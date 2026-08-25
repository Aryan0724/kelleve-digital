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
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($convo) use ($userId) {
                $convo->customer = DB::table('users')->where('id', $convo->customer_id)->select('id', 'name', 'avatar')->first();
                $convo->vendor = DB::table('users')->where('id', $convo->vendor_id)->select('id', 'name', 'avatar')->first();
                
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
                    ->where('is_read', 0)
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

        $convo->customer = DB::table('users')->where('id', $convo->customer_id)->select('id', 'name', 'avatar')->first();
        $convo->vendor = DB::table('users')->where('id', $convo->vendor_id)->select('id', 'name', 'avatar')->first();

        return $this->success($convo, 'Conversation retrieved');
    }

    public function messages(Request $request, $id)
    {
        $userId = $request->user()->id;

        $msgs = DB::table('messages')
            ->where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages from other user as read automatically
        DB::table('messages')
            ->where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->update(['is_read' => 1]);

        return $this->success($msgs, 'Messages retrieved');
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userId = $request->user()->id;

        $msgId = DB::table('messages')->insertGetId([
            'conversation_id' => $id,
            'sender_id' => $userId,
            'message' => $request->input('message'),
            'is_read' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('conversations')
            ->where('id', $id)
            ->update(['updated_at' => now()]);

        $msg = DB::table('messages')->where('id', $msgId)->first();

        return $this->success($msg, 'Message sent');
    }

    public function markAsRead(Request $request, $id)
    {
        $userId = $request->user()->id;

        DB::table('messages')
            ->where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->update(['is_read' => 1]);

        return $this->success(null, 'Messages marked as read');
    }
}
