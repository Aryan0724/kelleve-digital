<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use App\Services\OtpService;

class AuthController extends Controller
{
    /**
     * Maps a specific professional type → broad DB role.
     * This keeps the DB roles to just 5 while supporting 80+ display types.
     */
    public static function mapTypeToBroadRole(string $type): string
    {
        $workerTypes = [
            'carpenter', 'electrician', 'plumber', 'painter',
            'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer',
            'fabricator', 'aluminium_fabricator', 'glass_installer',
            'welder', 'polish_worker', 'wallpaper_installer',
            'worker', 'skilled_worker',
        ];

        $supplierTypes = [
            'plywood_dealer', 'laminate_dealer', 'tile_dealer',
            'marble_granite_dealer', 'paint_dealer', 'hardware_supplier',
            'lighting_supplier', 'electrical_supplier', 'sanitary_bathroom_supplier',
            'modular_kitchen_material_supplier', 'glass_supplier',
            'acp_aluminium_supplier', 'furniture_supplier', 'door_window_supplier',
            'supplier', 'material_supplier',
            'furniture_brand', 'tile_sanitaryware_brand', 'paint_coatings_brand',
            'lighting_brand', 'plywood_laminate_brand', 'home_appliances_brand',
            'hardware_fittings_brand', 'other_manufacturer_brand',
        ];

        $builderTypes = [
            'builder', 'real_estate_developer',
            'apartment_project', 'commercial_project', 'villa_project',
        ];

        $foodTypes = ['restaurant', 'cafe', 'dhaba', 'fast_food', 'bakery', 'sweet_shop', 'catering', 'tiffin_service', 'cloud_kitchen', 'bar', 'juice_bar'];
        $healthcareTypes = ['doctor', 'hospital', 'clinic', 'dentist', 'eye_specialist', 'diagnostic_lab', 'pharmacy', 'physiotherapist', 'ayurvedic_doctor', 'veterinary_doctor', 'optician', 'mental_health_counselor', 'dietitian'];
        $beautyTypes = ['salon', 'spa', 'nail_studio', 'tattoo_studio', 'makeup_artist', 'bridal_studio', 'beauty_parlour', 'mehendi_artist', 'unisex_salon', 'hair_salon', 'massage_center'];
        $fitnessTypes = ['gym', 'yoga_studio', 'martial_arts', 'swimming_pool', 'sports_academy', 'fitness_center', 'zumba_studio', 'personal_trainer', 'crossfit_box', 'cycling_studio'];
        $educationTypes = ['school', 'college', 'coaching_center', 'music_academy', 'dance_academy', 'language_class', 'computer_training', 'skill_development_center', 'photography_course', 'cooking_classes', 'online_tutors'];
        $retailTypes = ['electronics_shop', 'clothing_store', 'jewellery_shop', 'grocery_store', 'hardware_store', 'pharmacy_retail', 'mobile_shop', 'supermarket', 'toy_store', 'sports_goods', 'book_stationery', 'optical_store', 'automobile_parts', 'gift_shop', 'home_decor_store', 'shoe_store', 'watch_store', 'luggage_shop'];
        $hospitalityTypes = ['hotel', 'resort', 'guest_house', 'pg_hostel', 'homestay', 'service_apartment', 'boutique_hotel', 'dharamshala', 'farmhouse_villa', 'co_living_space'];
        $professionalTypes = ['chartered_accountant', 'lawyer', 'insurance_agent', 'financial_advisor', 'tax_consultant', 'company_secretary', 'notary', 'patent_attorney', 'hr_agency', 'management_consultant', 'import_export_consultant', 'fssai_consultant', 'gst_consultant', 'ip_attorney'];
        $eventsTypes = ['wedding_planner', 'photographer', 'videographer', 'dj', 'decorator', 'banquet_hall', 'event_manager', 'caterer_event', 'live_band', 'birthday_party_organizer', 'drone_photographer', 'photo_studio', 'album_designer'];
        $automotiveTypes = ['car_garage', 'car_wash', 'tyre_shop', 'driving_school', 'auto_spare_parts', 'bike_mechanic', 'battery_shop', 'car_dealer', 'two_wheeler_dealer', 'cng_lpg_fitter', 'dent_paint', 'windshield_repair', 'auto_electrician', 'truck_repair'];
        $travelTypes = ['travel_agency', 'tour_operator', 'car_rental', 'taxi_service', 'visa_consultant', 'bus_operator', 'adventure_tourism', 'honeymoon_specialist', 'hotel_booking_agent', 'ticket_agent', 'cruise_booking'];
        $itDigitalTypes = ['web_designer', 'app_developer', 'digital_marketing_agency', 'computer_repair', 'graphic_designer', 'software_company', 'printer_networking', 'seo_agency', 'content_writer', 'video_editor', 'social_media_manager', 'ecommerce_consultant', 'cybercafe', 'data_recovery'];

        $customerTypes = ['customer', 'homeowner'];

        if (in_array($type, $customerTypes)) return 'customer';
        if (in_array($type, $workerTypes)) return 'worker';
        if (in_array($type, $supplierTypes)) return 'supplier';
        if (in_array($type, $builderTypes)) return 'builder';
        if (in_array($type, $foodTypes)) return 'food_vendor';
        if (in_array($type, $healthcareTypes)) return 'healthcare';
        if (in_array($type, $beautyTypes)) return 'beauty';
        if (in_array($type, $fitnessTypes)) return 'fitness';
        if (in_array($type, $educationTypes)) return 'education';
        if (in_array($type, $retailTypes)) return 'retail';
        if (in_array($type, $hospitalityTypes)) return 'hospitality';
        if (in_array($type, $professionalTypes)) return 'professional_service';
        if (in_array($type, $eventsTypes)) return 'events';
        if (in_array($type, $automotiveTypes)) return 'automotive';
        if (in_array($type, $travelTypes)) return 'travel';
        if (in_array($type, $itDigitalTypes)) return 'it_digital';

        // Everything else maps to interior_designer (listing-based profile)
        // Covers: all design, arch, contractor, home improvement, support services
        return 'interior_designer';
    }

    /**
     * All specific professional type slugs accepted at registration.
     */
    public static function getAllowedTypes(): array
    {
        return [
            // Customer
            'customer', 'homeowner',
            // Interior & Design
            'interior_designer', 'interior_company', 'modular_kitchen_designer',
            'wardrobe_designer', '2d_3d_designer', 'space_planner',
            // Architecture & Engineering
            'architect', 'structural_engineer', 'civil_engineer',
            'mep_consultant', 'landscape_designer', 'vastu_consultant',
            // Contractors
            'interior_contractor', 'civil_contractor', 'turnkey_contractor',
            'renovation_contractor', 'demolition_contractor',
            // Skilled Workforce
            'carpenter', 'electrician', 'plumber', 'painter',
            'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer',
            'fabricator', 'aluminium_fabricator', 'glass_installer',
            'welder', 'polish_worker', 'wallpaper_installer',
            // Material Suppliers
            'plywood_dealer', 'laminate_dealer', 'tile_dealer',
            'marble_granite_dealer', 'paint_dealer', 'hardware_supplier',
            'lighting_supplier', 'electrical_supplier', 'sanitary_bathroom_supplier',
            'modular_kitchen_material_supplier', 'glass_supplier',
            'acp_aluminium_supplier', 'furniture_supplier', 'door_window_supplier',
            // Brands & Manufacturers
            'furniture_brand', 'tile_sanitaryware_brand', 'paint_coatings_brand',
            'lighting_brand', 'plywood_laminate_brand', 'home_appliances_brand',
            'hardware_fittings_brand', 'other_manufacturer_brand',
            // Builders & Developers
            'builder', 'real_estate_developer', 'apartment_project',
            'commercial_project', 'villa_project',
            // Home Improvement Services
            'home_renovation', 'waterproofing', 'pest_control',
            'deep_cleaning', 'cctv_security', 'home_automation',
            'solar_installation', 'ac_installation',
            // Support Services
            'packers_movers', 'interior_material_transport',
            'equipment_rental', 'interior_project_consultant',
            // Food & Beverage
            'restaurant', 'cafe', 'dhaba', 'fast_food', 'bakery', 'sweet_shop', 'catering', 'tiffin_service', 'cloud_kitchen', 'bar', 'juice_bar',
            // Healthcare
            'doctor', 'hospital', 'clinic', 'dentist', 'eye_specialist', 'diagnostic_lab', 'pharmacy', 'physiotherapist', 'ayurvedic_doctor', 'veterinary_doctor', 'optician', 'mental_health_counselor', 'dietitian',
            // Beauty
            'salon', 'spa', 'nail_studio', 'tattoo_studio', 'makeup_artist', 'bridal_studio', 'beauty_parlour', 'mehendi_artist', 'unisex_salon', 'hair_salon', 'massage_center',
            // Fitness
            'gym', 'yoga_studio', 'martial_arts', 'swimming_pool', 'sports_academy', 'fitness_center', 'zumba_studio', 'personal_trainer', 'crossfit_box', 'cycling_studio',
            // Education
            'school', 'college', 'coaching_center', 'music_academy', 'dance_academy', 'language_class', 'computer_training', 'skill_development_center', 'photography_course', 'cooking_classes', 'online_tutors',
            // Retail
            'electronics_shop', 'clothing_store', 'jewellery_shop', 'grocery_store', 'hardware_store', 'pharmacy_retail', 'mobile_shop', 'supermarket', 'toy_store', 'sports_goods', 'book_stationery', 'optical_store', 'automobile_parts', 'gift_shop', 'home_decor_store', 'shoe_store', 'watch_store', 'luggage_shop',
            // Hospitality
            'hotel', 'resort', 'guest_house', 'pg_hostel', 'homestay', 'service_apartment', 'boutique_hotel', 'dharamshala', 'farmhouse_villa', 'co_living_space',
            // Professional
            'chartered_accountant', 'lawyer', 'insurance_agent', 'financial_advisor', 'tax_consultant', 'company_secretary', 'notary', 'patent_attorney', 'hr_agency', 'management_consultant', 'import_export_consultant', 'fssai_consultant', 'gst_consultant', 'ip_attorney',
            // Events
            'wedding_planner', 'photographer', 'videographer', 'dj', 'decorator', 'banquet_hall', 'event_manager', 'caterer_event', 'live_band', 'birthday_party_organizer', 'drone_photographer', 'photo_studio', 'album_designer',
            // Automotive
            'car_garage', 'car_wash', 'tyre_shop', 'driving_school', 'auto_spare_parts', 'bike_mechanic', 'battery_shop', 'car_dealer', 'two_wheeler_dealer', 'cng_lpg_fitter', 'dent_paint', 'windshield_repair', 'auto_electrician', 'truck_repair',
            // Travel
            'travel_agency', 'tour_operator', 'car_rental', 'taxi_service', 'visa_consultant', 'bus_operator', 'adventure_tourism', 'honeymoon_specialist', 'hotel_booking_agent', 'ticket_agent', 'cruise_booking',
            // IT & Digital
            'web_designer', 'app_developer', 'digital_marketing_agency', 'computer_repair', 'graphic_designer', 'software_company', 'printer_networking', 'seo_agency', 'content_writer', 'video_editor', 'social_media_manager', 'ecommerce_consultant', 'cybercafe', 'data_recovery',
            // Legacy broad roles (backward compat)
            'business', 'worker', 'skilled_worker', 'supplier', 'material_supplier',
            'contractor',
        ];
    }

    /**
     * POST /api/v1/auth/register
     *
     * The frontend sends `role` as the specific type (e.g. "modular_kitchen_designer").
     * We store that as `professional_type` on the user, and map it to a broad role
     * (worker/supplier/builder/interior_designer/customer) for DB assignment.
     * This keeps DB roles at 5 while supporting 80+ display types.
     */
    public function register(Request $request): JsonResponse
    {
        Log::info("AuthController::register - start");
        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'email'             => ['required', 'email', 'unique:users'],
            'phone'             => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'password'          => ['required', 'confirmed', Password::min(8)],
            'role'              => ['required', 'in:' . implode(',', self::getAllowedTypes())],
            'professional_type' => ['nullable', 'string', 'max:100'], // Optional override
        ]);
        Log::info("AuthController::register - validation passed");

        // The 'role' field from frontend is actually the specific type
        $specificType = $data['role'];
        $broadRole    = self::mapTypeToBroadRole($specificType);

        try {
            $user = \Illuminate\Support\Facades\DB::transaction(function () use ($data, $specificType, $broadRole) {
                $user = User::create([
                    'name'              => $data['name'],
                    'email'             => $data['email'],
                    'phone'             => $data['phone'],
                    'password'          => Hash::make($data['password']),
                    'is_active'         => true,
                    // Store the specific type for display/search (e.g. "modular_kitchen_designer")
                    'professional_type' => $data['professional_type'] ?? $specificType,
                ]);
                Log::info("AuthController::register - user created, id={$user->id}, type={$specificType}, broad_role={$broadRole}");

                // Attach the broad role (only 5 exist in DB)
                $role = \App\Models\Role::where('slug', $broadRole)->first();
                if ($role) {
                    $user->roles()->attach($role->id);
                } else {
                    // Fallback: try to find any valid role
                    $fallback = \App\Models\Role::where('slug', 'interior_designer')
                        ->orWhere('slug', 'business')
                        ->first();
                    if ($fallback) {
                        $user->roles()->attach($fallback->id);
                    }
                    Log::warning("AuthController::register - broad role '{$broadRole}' not found, used fallback");
                }
                Log::info("AuthController::register - role attached");

                // Auto-create wallet
                \Illuminate\Support\Facades\DB::table('wallets')->insertOrIgnore([
                    'user_id'    => $user->id,
                    'balance'    => 0.00,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                Log::info("AuthController::register - wallet created");

                // Auto-create TrueDial Free Privilege Card
                \Illuminate\Support\Facades\DB::table('privilege_cards')->insertOrIgnore([
                    'user_id'     => $user->id,
                    'card_number' => 'TD-' . strtoupper(\Illuminate\Support\Str::random(10)),
                    'card_type'   => 'free',
                    'price'       => 0.00,
                    'status'      => 'active',
                    'valid_until' => now()->addYear(),
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
                Log::info("AuthController::register - free privilege card created");

                return $user;
            });

            $token = $user->createToken('api-token')->plainTextToken;
            Log::info("AuthController::register - token created");

            // Send a welcome message if the user is a professional (not a customer)
            if ($broadRole !== 'customer') {
                try {
                    // Find an admin user to act as sender (id 1 or first user with admin role)
                    $admin = User::whereHas('roles', function ($q) {
                        $q->where('slug', 'admin');
                    })->first() ?? User::find(1);

                    if ($admin && $admin->id !== $user->id) {
                        $conversation = Conversation::firstOrCreate([
                            'customer_id' => $user->id,
                            'vendor_id'   => $admin->id,
                        ]);

                        Message::create([
                            'conversation_id' => $conversation->id,
                            'sender_id'       => $admin->id,
                            'message'         => 'Welcome to Find My Interior! We are thrilled to have your business on our platform. Let us know if you need any help setting up your profile or finding leads.',
                            'message_type'    => 'text',
                        ]);

                        $conversation->increment('customer_unread_count');
                        $conversation->update(['last_message_at' => now(), 'last_vendor_reply_at' => now()]);
                    }
                } catch (\Exception $e) {
                    Log::error("AuthController::register - failed to send welcome message: " . $e->getMessage());
                }
            }

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
     * POST /api/v1/auth/send-otp
     */
    public function sendOtp(Request $request, OtpService $otpService): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'type'  => ['nullable', 'in:login,registration,lead_verification,phone_update']
        ]);

        $otpService->sendOtp($request->phone, $request->type ?? 'login');

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.'
        ]);
    }

    /**
     * POST /api/v1/auth/verify-otp
     */
    public function verifyOtp(Request $request, OtpService $otpService): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'otp'   => ['required', 'string', 'size:6'],
            'type'  => ['nullable', 'in:login,registration,lead_verification,phone_update']
        ]);

        $result = $otpService->verifyOtp($request->phone, $request->otp, $request->type ?? 'login');

        if (!$result['status']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data'    => isset($result['user']) ? new UserResource($result['user']) : null
        ]);
    }

    /**
     * POST /api/v1/auth/login-with-otp
     */
    public function loginWithOtp(Request $request, OtpService $otpService): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'otp'   => ['required', 'string', 'size:6'],
        ]);

        $result = $otpService->verifyOtp($request->phone, $request->otp, 'login');

        if (!$result['status']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        $user = $result['user'] ?? User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No account found with this phone number. Please register first.',
                'action'  => 'register'
            ], 404);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact support.',
            ], 403);
        }

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
