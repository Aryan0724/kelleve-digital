<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Helper to get the correct frontend URL.
     */
    protected function getFrontendUrl(): string
    {
        if (app()->environment('local', 'testing')) {
            return env('FRONTEND_URL', 'http://localhost:3000');
        }
        return 'https://findmyinterior.com';
    }

    /**
     * Helper to get the redirect URI for OAuth callback.
     */
    protected function getRedirectUri(Request $request): string
    {
        if (app()->environment('local', 'testing')) {
            return 'http://localhost:8000/api/v1/auth/google/callback';
        }
        return config('services.google.redirect', 'https://findmyinterior.com/api/v1/auth/google/callback');
    }

    /**
     * GET /api/v1/auth/google/redirect
     * Redirects the user to Google OAuth Consent screen or returns the URL as JSON.
     */
    public function redirect(Request $request)
    {
        $clientId = config('services.google.client_id');
        $redirectUri = $this->getRedirectUri($request);
        $role = $request->query('role', 'customer');

        $params = [
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'access_type'   => 'offline',
            'prompt'        => 'select_account',
            'state'         => $role,
        ];

        $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'url' => $url]);
        }

        return redirect()->away($url);
    }

    /**
     * GET /api/v1/auth/google/callback
     * Handles redirect from Google OAuth consent screen.
     */
    public function callback(Request $request)
    {
        $frontendUrl = rtrim($this->getFrontendUrl(), '/');

        if ($request->has('error')) {
            Log::warning('Google OAuth Error: ' . $request->query('error'));
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Google login was cancelled or failed.'));
        }

        $code = $request->query('code');
        if (!$code) {
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('No authorization code received from Google.'));
        }

        $clientId     = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri  = $this->getRedirectUri($request);

        try {
            // 1. Exchange code for access token
            $tokenRes = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
                'code'          => $code,
                'grant_type'    => 'authorization_code',
                'redirect_uri'  => $redirectUri,
            ]);

            if ($tokenRes->failed()) {
                Log::error('Google OAuth token exchange failed', ['response' => $tokenRes->json()]);
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Failed to authenticate with Google.'));
            }

            $accessToken = $tokenRes->json('access_token');

            // 2. Fetch Google user profile
            $userRes = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($userRes->failed()) {
                Log::error('Google OAuth userinfo request failed', ['response' => $userRes->json()]);
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Could not retrieve Google profile.'));
            }

            $googleData = $userRes->json();
            $roleOverride = $request->query('state', 'customer');

            $user = $this->findOrCreateGoogleUser($googleData, $roleOverride);

            if (!$user->is_active) {
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Your account has been suspended. Please contact support.'));
            }

            // 3. Generate Sanctum token
            $user->tokens()->delete();
            $token = $user->createToken('google-oauth')->plainTextToken;

            // 4. Redirect to frontend /login page with token & user info in query parameters
            $userJson = urlencode(json_encode(new UserResource($user)));
            $targetUrl = $frontendUrl . '/login?token=' . urlencode($token) . '&user=' . $userJson;

            return redirect()->away($targetUrl);

        } catch (\Throwable $e) {
            Log::error('Google OAuth callback exception: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('An unexpected error occurred during Google Login.'));
        }
    }

    /**
     * POST /api/v1/auth/google-login
     * Handles direct Google Login (via ID Token or Access Token from frontend button/popup).
     */
    public function loginDirect(Request $request): JsonResponse
    {
        $request->validate([
            'credential'   => 'nullable|string',
            'access_token' => 'nullable|string',
            'role'         => 'nullable|string',
        ]);

        try {
            $googleData = null;

            if ($request->filled('credential')) {
                // Verify Google ID token
                $res = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                    'id_token' => $request->credential,
                ]);

                if ($res->failed()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid Google ID token.',
                    ], 401);
                }
                $googleData = $res->json();
            } elseif ($request->filled('access_token')) {
                // Fetch profile using Google access token
                $res = Http::withToken($request->access_token)->get('https://www.googleapis.com/oauth2/v3/userinfo');

                if ($res->failed()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid Google access token.',
                    ], 401);
                }
                $googleData = $res->json();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing Google credential or access_token.',
                ], 422);
            }

            $user = $this->findOrCreateGoogleUser($googleData, $request->input('role', 'customer'));

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been suspended. Please contact support.',
                ], 403);
            }

            $user->tokens()->delete();
            $token = $user->createToken('google-oauth')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Google Login successful.',
                'data'    => [
                    'user'  => new UserResource($user),
                    'token' => $token,
                ],
            ]);

        } catch (\Throwable $e) {
            Log::error('GoogleAuthController::loginDirect exception: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Google login failed due to a server error.',
            ], 500);
        }
    }

    /**
     * Find existing user by google_id or email, or create a new user.
     */
    protected function findOrCreateGoogleUser(array $googleData, ?string $roleOverride = 'customer'): User
    {
        $googleId = $googleData['sub'] ?? null;
        $email    = $googleData['email'] ?? null;
        $name     = $googleData['name'] ?? 'Google User';
        $picture  = $googleData['picture'] ?? null;

        // 1. Search by google_id
        $user = null;
        if ($googleId) {
            $user = User::where('google_id', $googleId)->first();
        }

        // 2. Search by email if not found
        if (!$user && $email) {
            $user = User::where('email', $email)->first();
        }

        // 3. Update existing user
        if ($user) {
            if (!$user->google_id && $googleId) {
                $user->google_id = $googleId;
            }
            if (!$user->avatar && $picture) {
                $user->avatar = $picture;
            }
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
            }
            $user->save();
            return $user;
        }

        // 4. Create new user
        $specificType = $roleOverride ?: 'customer';
        $broadRole    = AuthController::mapTypeToBroadRole($specificType);

        $user = User::create([
            'name'               => $name,
            'email'              => $email,
            'google_id'          => $googleId,
            'password'           => Hash::make(Str::random(32)),
            'avatar'             => $picture,
            'is_active'          => true,
            'is_verified'        => true,
            'verification_level' => 'identity_verified',
            'professional_type'  => $specificType,
        ]);
        $user->email_verified_at = now();
        $user->save();

        // Assign broad role
        $role = \App\Models\Role::where('slug', $broadRole)->first();
        if (!$role) {
            $role = \App\Models\Role::where('slug', 'customer')->first();
        }
        if ($role) {
            $user->roles()->attach($role->id);
        }

        // Create wallet
        DB::table('wallets')->insertOrIgnore([
            'user_id'    => $user->id,
            'balance'    => 0.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $user;
    }
}
