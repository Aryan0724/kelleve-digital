<?php

namespace App\Modules\Truedial\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PrivilegeCard;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class PrivilegeCardController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function generate(Request $request)
    {
        $tenantId = $this->tenantContext->getTenantId();
        
        $card = PrivilegeCard::create([
            'user_id' => $request->user()->id,
            'tenant_id' => $tenantId,
            'card_number' => 'TD-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'status' => 'active'
        ]);

        return $this->success($card, 'Card generated successfully', 201);
    }

    public function myCards(Request $request)
    {
        $cards = PrivilegeCard::forCurrentTenant()->where('user_id', $request->user()->id)->get();
            
        return $this->success($cards);
    }
}
