<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Conversation;
use App\Models\Requirement;
use App\Models\ContactUnlock;
use App\Models\Bid;
use App\Services\WalletService;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    private WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * List user's active conversations.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $conversations = Conversation::with([
            'project', 
            'customer', 
            'vendor',
            'messages' => function($query) {
                $query->latest()->limit(1);
            }
        ])
            ->where('customer_id', $user->id)
            ->orWhere('vendor_id', $user->id)
            ->orderByDesc('last_message_at')
            ->paginate(15);
            
        return response()->json($conversations);
    }

    /**
     * Initiate a conversation attached to a requirement.
     */
    public function store(Request $request, $requirementId)
    {
        $user = $request->user();
        
        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        $morphType = 'Project';
        if ($type === 'rfq') {
            $modelClass = \App\Models\Rfq::class;
            $morphType = 'Rfq';
        }
        if ($type === 'job') {
            $modelClass = \App\Models\WorkerJob::class;
            $morphType = 'WorkerJob';
        }
        
        $requirement = $modelClass::findOrFail($requirementId);
        
        // Determine roles
        $customerId = $requirement->user_id;
        $vendorId = null;
        
        if ($user->id === $customerId) {
            $request->validate(['vendor_id' => 'required|exists:users,id']);
            $vendorId = $request->vendor_id;
        } else {
            $vendorId = $user->id;
        }
        
        // Authorization: Customer <-> Bidder OR Unlocked Vendor
        // Build all possible morph type strings for this requirement type
        $morphVariants = [$modelClass, $morphType];
        if ($morphType === 'WorkerJob') {
            $morphVariants[] = 'App\\Models\\WorkerJob';
        } elseif ($morphType === 'Rfq') {
            $morphVariants[] = 'App\\Models\\Rfq';
        } else {
            // Project / Requirement
            $morphVariants[] = 'Requirement';
            $morphVariants[] = 'App\\Models\\Requirement';
            $morphVariants[] = 'Project';
        }
        $morphVariants = array_unique($morphVariants);

        $isUnlocked = ContactUnlock::where('requirement_id', $requirementId)
            ->whereIn('requirement_type', $morphVariants)
            ->where('user_id', $vendorId)
            ->exists();

        $bid = Bid::where('requirement_id', $requirementId)
            ->whereIn('requirement_type', $morphVariants)
            ->where('professional_id', $vendorId)
            ->first();

        $isBidder   = $bid !== null;
        $isAwarded  = $isBidder && ($bid->status === 'awarded' || $bid->is_awarded);

        // Awarded status always grants messaging from BOTH sides — free
        if ($isAwarded) {
            // Fall through
        } elseif ($user->id === $customerId) {
            // Customer → Professional: professional must have submitted a bid OR be shortlisted
            $isShortlisted = \App\Models\Shortlist::where('user_id', $customerId)
                ->where('professional_id', $vendorId)
                ->exists();
            if (!$isBidder && !$isShortlisted) {
                return response()->json(['message' => 'Vendor must submit a bid or be shortlisted first.'], 403);
            }
        } else {
            // Professional → Customer
            if (!$isUnlocked && !$isBidder) {
                // Has no relationship to this requirement at all
                return response()->json(['message' => 'You must submit a bid or unlock this lead before messaging.'], 403);
            }

            if (!$isUnlocked && $isBidder) {
                // Bidder but not awarded and not unlocked → charge unlock fee
                $userRoles    = $user->roles->pluck('slug')->toArray();
                $isWorker     = in_array('worker', $userRoles) || in_array('skilled_worker', $userRoles);
                $unlockFee    = config('marketplace.unlock_fee', 49.00);

                if (!$isWorker && $unlockFee > 0) {
                    $balance = $this->walletService->getBalance($user);
                    if ($balance < $unlockFee) {
                        return response()->json([
                            'message'     => "Insufficient wallet balance to message this client. A ₹{$unlockFee} messaging unlock fee is required. Please top up your wallet.",
                            'requires_payment' => true,
                            'unlock_fee'  => $unlockFee,
                        ], 402);
                    }

                    // Deduct fee & create unlock record in a transaction
                    DB::transaction(function () use ($user, $requirement, $morphType, $unlockFee) {
                        $this->walletService->deduct(
                            $user,
                            $unlockFee,
                            "Messaging unlock fee for requirement #{$requirement->id}",
                            ['reference_type' => $morphType, 'reference_id' => $requirement->id]
                        );

                        DB::table('contact_unlocks')->insertOrIgnore([
                            'user_id'          => $user->id,
                            'requirement_id'   => $requirement->id,
                            'requirement_type' => $requirement->getMorphClass(),
                            'created_at'       => now(),
                            'updated_at'       => now(),
                        ]);
                    });

                    $isUnlocked = true; // now unlocked — proceed
                }
                // Workers fall through for free
            }
        }
        
        // Create or get existing conversation — key on the actual DB unique constraint
        $conversation = Conversation::updateOrCreate(
            [
                'project_id'  => $requirementId,
                'customer_id' => $customerId,
                'vendor_id'   => $vendorId,
            ],
            [
                'project_type'  => $morphType,
                'status'        => 'active',
                'project_stage' => 'initiated',
                'unlocked_at'   => $isUnlocked ? now() : null,
            ]
        );
        
        return response()->json($conversation->load(['customer', 'vendor']), 201);
    }

    /**
     * Get a specific conversation.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $conversation = Conversation::with([
            'project', 
            'customer', 
            'vendor'
        ])
        ->where(function($q) use ($user) {
            $q->where('customer_id', $user->id)
              ->orWhere('vendor_id', $user->id);
        })
        ->findOrFail($id);
            
        return response()->json($conversation);
    }
}
