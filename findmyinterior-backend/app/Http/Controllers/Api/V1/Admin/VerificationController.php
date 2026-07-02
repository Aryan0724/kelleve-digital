<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDocument;
use App\Services\TrustScoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VerificationController extends Controller
{
    private TrustScoreService $trustScoreService;

    public function __construct(TrustScoreService $trustScoreService)
    {
        $this->trustScoreService = $trustScoreService;
    }

    public function index(Request $request)
    {
        $filter = $request->query('filter', 'pending');

        $query = User::query()
            ->with(['documents' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }, 'listing', 'primaryRole']);

        if ($filter === 'pending') {
            $query->whereHas('documents', function ($q) {
                $q->where('status', 'pending');
            });
        } elseif ($filter === 'verified') {
            $query->where('is_verified_business', true);
        } elseif ($filter === 'rejected') {
            $query->whereHas('documents', function ($q) {
                $q->where('status', 'rejected');
            });
        } elseif ($filter === 'elite') {
            $query->where('verification_level', 'elite_professional');
        } elseif ($filter === 'low_trust') {
            $query->where('trust_score', '<', 30);
        } elseif ($filter === 'incomplete') {
            $query->where('profile_completion_score', '<', 50);
        }

        $users = $query->paginate(20);

        // Transform documents to include full URLs
        $users->getCollection()->transform(function ($user) {
            $user->documents->transform(function ($doc) {
                // file_path is already a base64 data URI
                $doc->url = $doc->file_path;
                return $doc;
            });
            return $user;
        });

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    public function approveDocument(Request $request, $id)
    {
        $document = UserDocument::findOrFail($id);
        
        $document->update([
            'status' => 'approved',
            'rejection_reason' => null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        $this->trustScoreService->recalculateForUser($document->user);

        return response()->json([
            'status' => 'success',
            'message' => 'Document approved successfully.',
            'data' => $document
        ]);
    }

    public function rejectDocument(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $document = UserDocument::findOrFail($id);
        
        $document->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('rejection_reason'),
            'approved_by' => null,
            'approved_at' => null,
        ]);

        $this->trustScoreService->recalculateForUser($document->user);

        return response()->json([
            'status' => 'success',
            'message' => 'Document rejected successfully.',
            'data' => $document
        ]);
    }

    public function approveBusiness(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // This force-approves the business manually by an admin
        // It bypasses the document checks if the admin decides to.
        $user->update([
            'verification_level' => 'verified_business',
            'is_verified_business' => true,
        ]);

        $this->trustScoreService->recalculateForUser($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User manually verified as a business.',
        ]);
    }

    public function revokeBusiness(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'verification_level' => 'basic_member',
            'is_verified_business' => false,
        ]);

        // Recalculate to set scores accurately without the business level
        $this->trustScoreService->recalculateForUser($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User business verification revoked.',
        ]);
    }
}
