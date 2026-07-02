<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Services\TrustScoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class VerificationController extends Controller
{
    private TrustScoreService $trustScoreService;

    public function __construct(TrustScoreService $trustScoreService)
    {
        $this->trustScoreService = $trustScoreService;
    }

    public function status(Request $request)
    {
        $user = $request->user()->load(['documents', 'listing']);
        
        // Recalculate to ensure it's up to date
        $this->trustScoreService->recalculateForUser($user);

        return response()->json([
            'status' => 'success',
            'data' => [
                'profile_completion_score' => $user->profile_completion_score,
                'trust_score' => $user->trust_score,
                'verification_level' => $user->verification_level,
                'is_verified_business' => $user->is_verified_business,
                'documents' => $user->documents->map(function ($doc) {
                    return [
                        'id'               => $doc->id,
                        'document_type'    => $doc->document_type,
                        // file_path is now a base64 data URI — it IS the URL
                        'file_path'        => $doc->file_path,
                        'status'           => $doc->status,
                        'rejection_reason' => $doc->rejection_reason,
                        'created_at'       => $doc->created_at,
                    ];
                })
            ]
        ]);
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|string|in:gst_certificate,pan_card,owner_photo,business_logo,business_image,office_image,portfolio_document,trade_license,aadhaar,work_history',
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $file = $request->file('file');
        $documentType = $request->input('document_type');

        // Convert to base64 data URI — stored directly in DB, no filesystem needed.
        $mime = $file->getMimeType() ?: 'application/octet-stream';
        if (str_contains($mime, 'pdf')) {
            // PDF: store as base64 data URI directly
            $dataUri = 'data:application/pdf;base64,' . base64_encode(file_get_contents($file->getRealPath()));
        } else {
            // Image: resize + compress then base64
            $dataUri = \App\Helpers\ImageHelper::toBase64($file, 1600, 85);
        }

        // Check if user already has this document type (update it to pending)
        $document = UserDocument::where('user_id', $user->id)
            ->where('document_type', $documentType)
            ->first();

        if ($document) {
            $document->update([
                'file_path' => $dataUri,
                'status' => 'pending',
                'rejection_reason' => null,
            ]);
        } else {
            $document = UserDocument::create([
                'user_id' => $user->id,
                'document_type' => $documentType,
                'file_path' => $dataUri,
                'status' => 'pending',
            ]);
        }

        // Recalculate score
        $this->trustScoreService->recalculateForUser($user);

        return response()->json([
            'status' => 'success',
            'message' => 'Document uploaded successfully and is pending verification.',
            'data' => $document
        ]);
    }
}
