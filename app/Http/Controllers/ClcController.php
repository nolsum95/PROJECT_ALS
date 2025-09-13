<?php

namespace App\Http\Controllers;

use App\Models\Clc;
use App\Models\Cai;
use App\Models\Learner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClcController extends Controller
{
    public function index()
    {
        $clcs = Clc::query()
            ->withCount(['cais as cais_count', 'learners as learners_count'])
            ->orderBy('clc_id', 'desc')
            ->get(['clc_id', 'clc_name', 'barangay']);

        return Inertia::render('Admin/Clc/List', [
            'clcs' => $clcs,
            'section' => 'clc-list',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'clc_name' => ['required','string','max:255'],
            'barangay' => ['required','string','max:255'],
        ]);

        Clc::create($data);

        return back()->with('success', 'CLC created successfully.');
    }

    public function show(Request $request, int $clcId)
    {
        $filterCai = $request->query('cai');

        $clc = Clc::with(['cais' => function ($q) {
            $q->orderBy('lastname');
        }])->findOrFail($clcId);

        $learnersQ = Learner::query()->where('assigned_clc', $clcId);
        if ($filterCai) {
            $learnersQ->where('assigned_cai', $filterCai);
        }
        $learners = $learnersQ->orderBy('fullname')->get(['learner_id','fullname','assigned_cai','assigned_clc','status']);

        return Inertia::render('Admin/Clc/Details', [
            'clc' => $clc->only(['clc_id','clc_name','barangay']) + [
                'cais' => $clc->cais()->get(['cai_id','firstname','middlename','lastname','assigned_clc','status']),
            ],
            'learners' => $learners,
            'filter' => [ 'cai' => $filterCai ],
        ]);
    }

    public function assignCais(Request $request, int $clcId)
    {
        $payload = $request->validate([
            'cai_ids' => ['array'],
            'cai_ids.*' => ['integer','exists:cai_tb,cai_id'],
        ]);

        Cai::whereIn('cai_id', $payload['cai_ids'] ?? [])->update(['assigned_clc' => $clcId]);

        return back()->with('success', 'CAIs assigned to CLC.');
    }

    public function assignLearners(Request $request, int $clcId)
    {
        $payload = $request->validate([
            'items' => ['array'],
            'items.*.learner_id' => ['required','integer','exists:learner_tb,learner_id'],
            'items.*.assigned_cai' => ['nullable','integer','exists:cai_tb,cai_id'],
        ]);

        foreach ($payload['items'] ?? [] as $row) {
            $update = [ 'assigned_clc' => $clcId ];
            if (array_key_exists('assigned_cai', $row)) {
                $update['assigned_cai'] = $row['assigned_cai'];
            }
            Learner::where('learner_id', $row['learner_id'])->update($update);
        }

        return back()->with('success', 'Learners assigned to CLC.');
    }

    public function reports()
    {
        $byClcLearners = Learner::selectRaw('assigned_clc, COUNT(*) as total')
            ->groupBy('assigned_clc')->pluck('total','assigned_clc');
        $byClcCais = Cai::selectRaw('assigned_clc, COUNT(*) as total')
            ->groupBy('assigned_clc')->pluck('total','assigned_clc');
        $byBarangay = Clc::selectRaw('barangay, COUNT(*) as total')->groupBy('barangay')->pluck('total','barangay');

        // return Inertia::render('Admin/Clc/Reports', [
        //     'byClcLearners' => $byClcLearners,
        //     'byClcCais' => $byClcCais,
        //     'byBarangay' => $byBarangay,
        // ]);
        return Inertia::render('Admin/Clc/Reports', [
            'byClcLearners' => $byClcLearners,
            'byClcCais' => $byClcCais,
            'byBarangay' => $byBarangay,
            'section' => 'clc-reports',
        ]);
    }

    public function update(Request $request, int $clcId)
    {
        $data = $request->validate([
            'clc_name' => ['required','string','max:255'],
            'barangay' => ['required','string','max:255'],
        ]);

        Clc::where('clc_id', $clcId)->update($data);

        return back()->with('success', 'CLC updated successfully.');
    }
}
