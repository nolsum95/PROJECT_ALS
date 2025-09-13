<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Learner;
use App\Models\Cai;
use App\Models\Clc;

class LearnerController extends Controller
{
    public function index(Request $request)
    {
        $filterCai = $request->query('cai');
        $filterClc = $request->query('clc');

        $q = Learner::query()
            ->with(['cai:cai_id,firstname,middlename,lastname', 'clc:clc_id,clc_name'])
            ->orderBy('learner_id','desc');

        if ($filterCai !== null && $filterCai !== '') {
            if ($filterCai === 'unassigned') {
                $q->whereNull('assigned_cai');
            } else {
                $q->where('assigned_cai', $filterCai);
            }
        }
        if ($filterClc) {
            $q->where('assigned_clc', $filterClc);
        }

        $learners = $q->get(['learner_id','fullname','assigned_cai','assigned_clc','status']);

        $cais = Cai::orderBy('lastname')->get(['cai_id','firstname','middlename','lastname']);
        $clcs = Clc::orderBy('clc_name')->get(['clc_id','clc_name']);

        return Inertia::render('Admin/Learner/Learner_list', [
            'learners' => $learners,
            'cais' => $cais,
            'clcs' => $clcs,
            'filters' => [ 'cai' => $filterCai, 'clc' => $filterClc ],
        ]);
    }

    public function updateStatus(Request $request, $learnerId)
    {
        $request->validate([
            'status' => ['required', 'string', 'max:255'],
        ]);
        $learner = Learner::findOrFail($learnerId);
        $learner->status = $request->input('status');
        $learner->save();

        return back()->with('success', 'Learner status updated.');
    }
}
