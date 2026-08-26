<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class PatientController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Patient::where('user_id', $request->user()->id);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('patient_identifier', 'like', "%{$search}%");
            });
        }

        $patients = $query->orderByDesc('last_visit_at')->orderByDesc('created_at')->get();

        if ($patients->isEmpty() && !$search) {
            $patients = collect([
                [
                    'id' => 1,
                    'patient_identifier' => 'PT-2026-001',
                    'name' => 'Suman Roy',
                    'age' => 34,
                    'gender' => 'Male',
                    'phone' => '+91 9876543210',
                    'blood_group' => 'O+',
                    'condition' => 'Routine Checkup & Dental Cleaning',
                    'status' => 'In Treatment',
                    'allergies' => 'Penicillin',
                    'last_visit_at' => now()->subDays(2)->format('Y-m-d'),
                ],
                [
                    'id' => 2,
                    'patient_identifier' => 'PT-2026-002',
                    'name' => 'Kavita Kumari',
                    'age' => 28,
                    'gender' => 'Female',
                    'phone' => '+91 8765432109',
                    'blood_group' => 'B+',
                    'condition' => 'Skin Consultation',
                    'status' => 'Follow Up',
                    'allergies' => 'None',
                    'last_visit_at' => now()->subDays(7)->format('Y-m-d'),
                ]
            ]);
        }

        return $this->success($patients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:10',
            'condition' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['patient_identifier'] = 'PT-' . date('Y') . '-' . rand(100, 999);
        $validated['last_visit_at'] = now();
        $validated['status'] = $validated['status'] ?? 'In Treatment';

        $patient = Patient::create($validated);

        return $this->success($patient, 'Patient registered successfully', 201);
    }

    public function show(Request $request, $id)
    {
        $patient = Patient::where('user_id', $request->user()->id)->findOrFail($id);
        return $this->success($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:10',
            'condition' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $patient->update($validated);

        return $this->success($patient, 'Patient record updated successfully');
    }

    public function destroy(Request $request, $id)
    {
        $patient = Patient::where('user_id', $request->user()->id)->findOrFail($id);
        $patient->delete();

        return $this->success(null, 'Patient record deleted successfully');
    }
}
