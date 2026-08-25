<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\ApiResponse;

class ConversationController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = DB::table('conversations')
            ->where('customer_id', $userId)
            ->orWhere('vendor_id', $userId)
            ->orderBy('last_message_at', 'desc')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($convo) use ($userId) {
                $convo->customer = DB::table('users')->where('id', $convo->customer_id)->select('id', 'name', 'avatar', 'phone', 'email')->first();
                $convo->vendor = DB::table('users')->where('id', $convo->vendor_id)->select('id', 'name', 'avatar', 'phone', 'email')->first();
                
                $latestMsg = DB::table('messages')
                    ->where('conversation_id', $convo->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $convo->messages = $latestMsg ? [$latestMsg] : [];
                $convo->latest_message = $latestMsg;

                $isVendor = ($convo->vendor_id == $userId);
                $unread = DB::table('messages')
                    ->where('conversation_id', $convo->id)
                    ->where('sender_id', '!=', $userId)
                    ->whereNull('read_at')
                    ->count();

                if ($isVendor) {
                    $convo->vendor_unread_count = $unread;
                    $convo->customer_unread_count = 0;
                } else {
                    $convo->customer_unread_count = $unread;
                    $convo->vendor_unread_count = 0;
                }

                return $convo;
            });

        return $this->success($conversations, 'Conversations retrieved');
    }

    public function store(Request $request)
    {
        $request->validate([
            'vendor_id' => 'nullable|integer',
            'user_id' => 'nullable|integer',
            'recipient_id' => 'nullable|integer',
            'business_id' => 'nullable|integer',
            'listing_id' => 'nullable|integer',
            'initial_message' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $customerId = $request->user()->id;
        $vendorId = $request->input('vendor_id') 
                 ?? $request->input('recipient_id') 
                 ?? $request->input('user_id');

        $businessId = $request->input('business_id') ?? $request->input('listing_id');

        if (!$vendorId && $businessId) {
            $listing = DB::table('listings')->where('id', $businessId)->first();
            if ($listing && $listing->user_id) {
                $vendorId = $listing->user_id;
            }
        }

        if (!$vendorId) {
            $admin = DB::table('users')->where('email', 'admin@truedial.in')->first()
                  ?? DB::table('users')->first();
            $vendorId = $admin ? $admin->id : 1;
        }

        if ($customerId == $vendorId) {
            $existing = DB::table('conversations')
                ->where('customer_id', $customerId)
                ->orWhere('vendor_id', $customerId)
                ->first();
            if ($existing) {
                return $this->success($existing, 'Existing conversation');
            }
            return $this->error('You cannot start a conversation with yourself', 400);
        }

        $convo = DB::table('conversations')
            ->where(function($q) use ($customerId, $vendorId) {
                $q->where('customer_id', $customerId)->where('vendor_id', $vendorId);
            })
            ->orWhere(function($q) use ($customerId, $vendorId) {
                $q->where('customer_id', $vendorId)->where('vendor_id', $customerId);
            })
            ->first();

        if (!$convo) {
            $convoId = DB::table('conversations')->insertGetId([
                'customer_id' => $customerId,
                'vendor_id' => $vendorId,
                'customer_unread_count' => 0,
                'vendor_unread_count' => 0,
                'last_message_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $convo = DB::table('conversations')->where('id', $convoId)->first();
        }

        $msgText = $request->input('initial_message') ?? $request->input('message');
        if (!empty($msgText)) {
            DB::table('messages')->insert([
                'conversation_id' => $convo->id,
                'sender_id' => $customerId,
                'message' => $msgText,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('conversations')->where('id', $convo->id)->update([
                'vendor_unread_count' => DB::raw('vendor_unread_count + 1'),
                'last_message_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $convo->customer = DB::table('users')->where('id', $convo->customer_id)->select('id', 'name', 'avatar')->first();
        $convo->vendor = DB::table('users')->where('id', $convo->vendor_id)->select('id', 'name', 'avatar')->first();

        return $this->success($convo, 'Conversation ready');
    }

    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;

        $convo = DB::table('conversations')
            ->where('id', $id)
            ->where(function($q) use ($userId) {
                $q->where('customer_id', $userId)->orWhere('vendor_id', $userId);
            })
            ->first();

        if (!$convo) {
            return $this->error('Conversation not found', 404);
        }

        $convo->customer = DB::table('users')->where('id', $convo->customer_id)->select('id', 'name', 'avatar', 'phone', 'email')->first();
        $convo->vendor = DB::table('users')->where('id', $convo->vendor_id)->select('id', 'name', 'avatar', 'phone', 'email')->first();

        return $this->success($convo, 'Conversation retrieved');
    }

    public function messages(Request $request, $id)
    {
        $userId = $request->user()->id;

        $convo = DB::table('conversations')
            ->where('id', $id)
            ->where(function($q) use ($userId) {
                $q->where('customer_id', $userId)->orWhere('vendor_id', $userId);
            })
            ->first();

        if (!$convo) {
            return $this->error('Conversation not found', 404);
        }

        $msgs = DB::table('messages')
            ->where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        DB::table('messages')
            ->where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        if ($convo->customer_id == $userId) {
            DB::table('conversations')->where('id', $id)->update(['customer_unread_count' => 0]);
        } else {
            DB::table('conversations')->where('id', $id)->update(['vendor_unread_count' => 0]);
        }

        return $this->success($msgs, 'Messages retrieved');
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:2000'
        ]);

        $userId = $request->user()->id;

        $convo = DB::table('conversations')
            ->where('id', $id)
            ->where(function($q) use ($userId) {
                $q->where('customer_id', $userId)->orWhere('vendor_id', $userId);
            })
            ->first();

        if (!$convo) {
            return $this->error('Conversation not found', 404);
        }

        $msgText = $request->input('message');

        $msgId = DB::table('messages')->insertGetId([
            'conversation_id' => $id,
            'sender_id' => $userId,
            'message' => $msgText,
            'message_type' => 'text',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $isCustomer = ($convo->customer_id == $userId);
        DB::table('conversations')
            ->where('id', $id)
            ->update([
                'last_message_at' => now(),
                'updated_at' => now(),
                'customer_unread_count' => $isCustomer ? $convo->customer_unread_count : DB::raw('customer_unread_count + 1'),
                'vendor_unread_count' => $isCustomer ? DB::raw('vendor_unread_count + 1') : $convo->vendor_unread_count,
            ]);

        $msg = DB::table('messages')->where('id', $msgId)->first();
        $msg->sender = DB::table('users')->where('id', $userId)->select('id', 'name', 'avatar')->first();

        return $this->success($msg, 'Message sent');
    }

    public function markAsRead(Request $request, $id)
    {
        $userId = $request->user()->id;

        $convo = DB::table('conversations')
            ->where('id', $id)
            ->where(function($q) use ($userId) {
                $q->where('customer_id', $userId)->orWhere('vendor_id', $userId);
            })
            ->first();

        if (!$convo) {
            return $this->success(null, 'OK');
        }

        DB::table('messages')
            ->where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        if ($convo->customer_id == $userId) {
            DB::table('conversations')->where('id', $id)->update(['customer_unread_count' => 0]);
        } else {
            DB::table('conversations')->where('id', $id)->update(['vendor_unread_count' => 0]);
        }

        return $this->success(null, 'Messages marked as read');
    }
}

