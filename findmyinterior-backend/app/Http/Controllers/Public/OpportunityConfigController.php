<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class OpportunityConfigController extends Controller
{
    /**
     * GET /api/v1/opportunities/config
     * Returns the backend-driven configuration for dynamic forms.
     */
    public function __invoke(): JsonResponse
    {
        $config = [
            'homeowner' => [
                [
                    'label' => 'Need Interior Designer',
                    'opportunity_type' => 'PROJECT',
                    'requirement_type' => 'HOME_INTERIOR',
                    'target_roles' => ['interior_designer', 'interior_company', 'architect'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Architect',
                    'opportunity_type' => 'PROJECT',
                    'requirement_type' => 'ARCHITECT_REQUEST',
                    'target_roles' => ['architect'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Contractor',
                    'opportunity_type' => 'PROJECT',
                    'requirement_type' => 'HOME_CONSTRUCTION',
                    'target_roles' => ['contractor', 'builder'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Renovation',
                    'opportunity_type' => 'PROJECT',
                    'requirement_type' => 'RENOVATION',
                    'target_roles' => ['contractor', 'interior_company'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ]
            ],
            'builder' => [
                [
                    'label' => 'Need Subcontractor',
                    'opportunity_type' => 'SUBCONTRACT',
                    'requirement_type' => 'SUBCONTRACT_REQUEST',
                    'target_roles' => ['contractor'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Supplier (Materials)',
                    'opportunity_type' => 'RFQ',
                    'requirement_type' => 'MATERIAL_REQUEST',
                    'target_roles' => ['material_supplier', 'supplier'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Workers',
                    'opportunity_type' => 'JOB',
                    'requirement_type' => 'LABOUR_REQUEST',
                    'target_roles' => ['skilled_worker', 'worker'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location']
                ]
            ],
            'contractor' => [
                [
                    'label' => 'Need Labour',
                    'opportunity_type' => 'JOB',
                    'requirement_type' => 'LABOUR_REQUEST',
                    'target_roles' => ['skilled_worker', 'worker'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location']
                ],
                [
                    'label' => 'Need Materials',
                    'opportunity_type' => 'RFQ',
                    'requirement_type' => 'MATERIAL_REQUEST',
                    'target_roles' => ['material_supplier', 'supplier'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location', 'attachments']
                ]
            ],
            'interior_designer' => [
                [
                    'label' => 'Need Contractor / Execution Team',
                    'opportunity_type' => 'SUBCONTRACT',
                    'requirement_type' => 'SUBCONTRACT_REQUEST',
                    'target_roles' => ['contractor'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Materials / Furniture',
                    'opportunity_type' => 'RFQ',
                    'requirement_type' => 'MATERIAL_REQUEST',
                    'target_roles' => ['material_supplier', 'supplier'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location', 'attachments']
                ]
            ],
            'architect' => [
                [
                    'label' => 'Need Contractor',
                    'opportunity_type' => 'SUBCONTRACT',
                    'requirement_type' => 'SUBCONTRACT_REQUEST',
                    'target_roles' => ['contractor'],
                    'fields' => ['title', 'description', 'project_category', 'budget', 'city', 'location', 'attachments']
                ],
                [
                    'label' => 'Need Materials',
                    'opportunity_type' => 'RFQ',
                    'requirement_type' => 'MATERIAL_REQUEST',
                    'target_roles' => ['material_supplier', 'supplier'],
                    'fields' => ['title', 'description', 'budget', 'city', 'location', 'attachments']
                ]
            ]
        ];

        // Also add aliases for interior_company to match interior_designer
        $config['interior_company'] = $config['interior_designer'];
        $config['customer'] = $config['homeowner'];
        
        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }
}
