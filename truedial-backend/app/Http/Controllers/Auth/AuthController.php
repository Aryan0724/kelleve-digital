<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Traits\ApiResponse;

class AuthController extends Controller {
    use ApiResponse;
    
    public function register(Request $request) {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'nullable|email|max:255|unique:auth.users,email',
            'phone'    => 'required|string|max:20|unique:auth.users,phone',
            'password' => 'required|string|min:6',
            'role'     => 'required|string',
        ]);
        
        $roleStr = $validated['role'];
        if (!in_array($roleStr, $this->getAllowedTypes())) {
            return $this->error('Invalid role type', 400);
        }
        
        $mappedRole = $this->mapRole($roleStr);
        $roleModel  = Role::where('slug', $mappedRole)->first();
        if (!$roleModel) { return $this->error('Role missing', 500); }
        
        $user = User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'] ?? null,
            'phone'             => $validated['phone'],
            'password'          => Hash::make($validated['password']),
            'professional_type' => $roleStr,
            'primary_role_id'   => $roleModel->id,
            'is_active'         => true,
        ]);
        
        $user->roles()->attach($roleModel->id);
        $token = $user->createToken('truedial-token')->plainTextToken;

        // Send TrueDial-branded welcome message to every new business/professional registrant
        if ($mappedRole !== 'customer') {
            try {
                $admin = User::whereHas('roles', fn($q) => $q->where('slug', 'admin'))->first()
                    ?? User::where('email', 'admin@truedial.in')->first();

                if ($admin && $admin->id !== $user->id) {
                    $conversationId = DB::table('conversations')->insertGetId([
                        'customer_id'           => $user->id,
                        'vendor_id'             => $admin->id,
                        'customer_unread_count' => 1,
                        'vendor_unread_count'   => 0,
                        'last_message_at'       => now(),
                        'created_at'            => now(),
                        'updated_at'            => now(),
                    ]);

                    DB::table('messages')->insert([
                        'conversation_id' => $conversationId,
                        'sender_id'       => $admin->id,
                        'message'         => 'Welcome to TrueDial! 🎉 We are thrilled to have your business on our platform. Let us know if you need any help setting up your profile or finding leads.',
                        'is_read'         => 0,
                        'created_at'      => now(),
                        'updated_at'      => now(),
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('TrueDial welcome message failed: ' . $e->getMessage());
            }
        }

        return $this->success(['user' => $user, 'token' => $token], 'Registered successfully');
    }
    
    public function login(Request $request) {
        $request->validate(['email_or_phone' => 'required|string', 'password' => 'required|string']);
        $user = User::where('email', $request->email_or_phone)->orWhere('phone', $request->email_or_phone)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials', 401);
        }
        $token = $user->createToken('truedial-token')->plainTextToken;
        return $this->success(['user' => $user, 'token' => $token]);
    }
    
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out');
    }
    
    public function me(Request $request) {
        return $this->success($request->user()->load('roles'));
    }
    
    public function updateProfile(Request $request) {
        $user = $request->user();
        $user->update($request->only(['name', 'phone', 'avatar']));
        return $this->success($user, 'Profile updated');
    }
    
    private function mapRole($type) {
        if ($type == 'customer' || $type == 'explorer') return 'customer';
        if (in_array($type, ['business_owner', 'restaurant', 'hospital', 'hotel', 'real_estate'])) return 'business';
        return 'worker'; // freelancer etc
    }
    
    private function getAllowedTypes() {
        return ['restaurants', 'cafes', 'hospitals', 'doctors', 'education', 'coaching', 'interior', 'repair', 'it', 'gyms', 'events', 'salons', 'automobile', 'travel', 'real_estate', 'legal', 'grocery', 'pharmacy', 'electronics', 'fashion', 'furniture', 'photography', 'packers', 'printing', 'catering', 'pets', 'jewellery', 'banking', 'courier', 'hardware', 'books', 'nursery', 'security', 'astrology', 'bakery', 'opticals', 'mobile_repair', 'customer', 'explorer', 'freelancer', 'business_owner'];
    }
}
