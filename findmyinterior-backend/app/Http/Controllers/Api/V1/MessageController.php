<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Message;
use App\Models\Conversation;
use App\Notifications\NewMessageNotification;

class MessageController extends Controller
{
    /**
     * Get messages for a conversation.
     */
    public function index(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = $request->user();
        
        if ($user->id !== $conversation->customer_id && $user->id !== $conversation->vendor_id && (!$user->hasRole('admin') && (!method_exists($user, 'isAdmin') || !$user->isAdmin()))) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Mark as read
        if ($user->id === $conversation->customer_id && $conversation->customer_unread_count > 0) {
            $conversation->update(['customer_unread_count' => 0]);
            Message::where('conversation_id', $conversationId)
                ->where('sender_id', $conversation->vendor_id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        } elseif ($user->id === $conversation->vendor_id && $conversation->vendor_unread_count > 0) {
            $conversation->update(['vendor_unread_count' => 0]);
            Message::where('conversation_id', $conversationId)
                ->where('sender_id', $conversation->customer_id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }
        
        $messages = Message::with(['sender', 'attachments'])
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }

    /**
     * Send a message in a conversation.
     */
    public function store(Request $request, $conversationId)
    {
        $request->validate([
            'message' => 'required_without:attachments|string',
            'message_type' => 'nullable|in:text,image,document,system,event',
            'meta_data' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240', // Explicitly block execs
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $user = $request->user();
        
        if ($user->id !== $conversation->customer_id && $user->id !== $conversation->vendor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'message' => $request->message,
            'message_type' => $request->message_type ?? 'text',
            'meta_data' => $request->meta_data,
        ]);
        
        // Analytics & Tracking Hooks
        $updates = ['last_message_at' => now()];
        
        if ($user->id === $conversation->vendor_id) {
            if (!$conversation->first_vendor_reply_at) {
                $updates['first_vendor_reply_at'] = now();
            }
            $updates['last_vendor_reply_at'] = now();
            $conversation->increment('customer_unread_count');
        } else {
            $updates['last_customer_reply_at'] = now();
            $conversation->increment('vendor_unread_count');
        }
        
        $conversation->update($updates);
        
        $recipient = $user->id === $conversation->customer_id ? $conversation->vendor : $conversation->customer;
        
        if ($recipient) {
            $recipient->notify(new NewMessageNotification([
                'sender_name' => $user->name,
                'conversation_id' => $conversationId
            ]));
        }
        
        return response()->json($message->load(['sender', 'attachments']), 201);
    }
}
