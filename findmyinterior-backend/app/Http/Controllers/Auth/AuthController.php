<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/v1/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        Log::info("AuthController::register - start");
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'phone'    => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role'     => ['required', 'in:customer,business,builder,supplier,worker'],
        ]);
        Log::info("AuthController::register - validation passed");

        try {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'phone'    => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
                'is_active' => true,
            ]);
            Log::info("AuthController::register - user created, id={$user->id}");

            // Attach role
            $role = \App\Models\Role::where('slug', $data['role'])->first();
            if ($role) {
                $user->roles()->attach($role->id);
            } else {
                Log::warning("AuthController::register - role '{$data['role']}' not found in roles table");
            }
            Log::info("AuthController::register - role attached");

            // Auto-create wallet for every new user
            \Illuminate\Support\Facades\DB::table('wallets')->insertOrIgnore([
                'user_id'    => $user->id,
                'balance'    => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Log::info("AuthController::register - wallet created");

            $token = $user->createToken('api-token')->plainTextToken;
            Log::info("AuthController::register - token created");

            return response()->json([
                'success' => true,
                'message' => 'Registration successful.',
                'data'    => [
                    'user'  => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);

        } catch (\Throwable $e) {
            Log::error("AuthController::register - failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Registration failed due to a server error. Please try again.',
            ], 500);
        }
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            Log::warning("Auth failure: Invalid credentials attempted for email {$request->email}");
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact support.',
            ], 403);
        }

        // Revoke old tokens and issue fresh one
        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'data'    => [
                'user'  => new UserResource($user->load('activeSubscription.plan')),
                'token' => $token,
            ],
        ]);
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * GET /api/v1/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new UserResource($request->user()->load('activeSubscription.plan')),
        ]);
    }
}
