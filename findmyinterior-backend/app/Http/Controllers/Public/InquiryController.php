<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Notifications\InquiryReceivedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * POST /api/v1/inquiries
     * Public — any visitor can send an inquiry.
     */
    public function store(Request $request): JsonResponse
    {
        $request->merge([
            'inquirable_type' => strtolower(str_replace('BuilderProject', 'builder', $request->inquirable_type))
        ]);

        $data = $request->validate([
            'inquirable_type' => ['required', 'in:listing,builder,supplier,worker'],
            'inquirable_id'   => ['required', 'integer'],
            'name'            => ['required', 'string', 'max:255'],
            'phone'           => ['required', 'string', 'max:20'],
            'email'           => ['nullable', 'email'],
            'message'         => ['required', 'string', 'max:2000'],
        ]);

        // Resolve morph class
        $morphMap = [
            'listing'  => \App\Models\Listing::class,
            'builder'  => \App\Models\Builder::class,
            'supplier' => \App\Models\Supplier::class,
            'worker'   => \App\Models\Worker::class,
        ];

        $data['inquirable_type'] = $morphMap[$data['inquirable_type']];
        $data['user_id'] = $request->user()?->id;

        $inquiry = Inquiry::create($data);

        // Fire notification — handled by InquiryReceivedNotification (WhatsApp + Email)
        try {
            $parent = $inquiry->inquirable;
            if ($parent && $parent->user) {
                $parent->user->notify(new InquiryReceivedNotification($inquiry));

                // Also create a conversation if the user is logged in
                $user = auth('sanctum')->user();
                if ($user) {
                    $conversation = \App\Models\Conversation::firstOrCreate(
                        [
                            'project_id' => null,
                            'customer_id' => $user->id,
                            'vendor_id' => $parent->user->id,
                        ],
                        [
                            'status' => 'active',
                            'project_stage' => 'inquiry',
                            'unlocked_at' => now(),
                        ]
                    );

                    \App\Models\Message::create([
                        'conversation_id' => $conversation->id,
                        'sender_id' => $user->id,
                        'body' => "Inquiry regarding " . class_basename($parent) . ":\n\n" . $data['message'],
                        'is_read' => false,
                    ]);
                }
            }
        } catch (\Throwable $e) {
            // Notification failure must never break the inquiry submission
            \Illuminate\Support\Facades\Log::error('Inquiry logic failed: ' . $e->getMessage());
        }

        // Mark flags on inquiry
        $inquiry->update([
            'whatsapp_sent' => true,
            'email_sent'    => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been sent successfully. We will contact you shortly.',
        ], 201);
    }
}
