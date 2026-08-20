<?php

namespace App\Services;

use App\Models\Rfq;
use App\Models\RfqQuotation;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class RfqQuotationService
{
    public function submitQuotation(Rfq $rfq, array $data, $supplierId)
    {
        if ($rfq->status !== 'open') {
            throw new InvalidArgumentException("Cannot submit a quotation to an RFQ that is not open.");
        }

        if ($rfq->user_id === $supplierId) {
            throw new InvalidArgumentException("You cannot quote on your own RFQ.");
        }

        $existing = RfqQuotation::where('requirement_id', $rfq->id)
                                ->where('professional_id', $supplierId)
                                ->first();
        if ($existing) {
            throw new InvalidArgumentException("You have already submitted a quotation for this RFQ.");
        }

        return RfqQuotation::create(array_merge($data, [
            'requirement_id' => $rfq->id,
            'professional_id' => $supplierId,
            'status' => 'pending'
        ]));
    }

    public function acceptQuotation(Rfq $rfq, RfqQuotation $quotation)
    {
        return DB::transaction(function () use ($rfq, $quotation) {
            $lockedRfq = Rfq::where('id', $rfq->id)->lockForUpdate()->first();
            
            if ($lockedRfq->status !== 'open') {
                throw new InvalidArgumentException("Cannot accept quotation. RFQ is already {$lockedRfq->status}.");
            }

            if ($quotation->status !== 'pending') {
                throw new InvalidArgumentException("This quotation cannot be accepted.");
            }

            $quotation->update(['status' => 'accepted']);
            
            RfqQuotation::where('requirement_id', $rfq->id)
                        ->where('id', '!=', $quotation->id)
                        ->update(['status' => 'rejected']);
            
            $lockedRfq->update(['status' => 'closed']);

            return $quotation->fresh();
        });
    }
}
