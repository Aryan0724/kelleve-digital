<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PatientController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(Request $request)
    {
        $query = Patient::forCurrentTenant()->where('user_id', Auth::id());

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('patient_identifier', 'like', "%{$search}%");
            });
        }

        $patients = $query->orderBy('last_visit_at', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->get();

        return $this->success($patients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:5',
            'condition' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['last_visit_at'] = now();
        
        if (!isset($validated['status'])) {
            $validated['status'] = 'In Treatment';
        }

        $patient = Patient::create($validated);

        return $this->success($patient, 'Patient added successfully', 201);
    }

    public function show($id)
    {
        $patient = Patient::forCurrentTenant()->where('user_id', Auth::id())->findOrFail($id);
        return $this->success($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::forCurrentTenant()->where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:5',
            'condition' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $patient->update($validated);

        return $this->success($patient, 'Patient updated successfully');
    }

    public function destroy($id)
    {
        $patient = Patient::forCurrentTenant()->where('user_id', Auth::id())->findOrFail($id);
        $patient->delete();

        return $this->success(null, 'Patient removed successfully');
    }
}
