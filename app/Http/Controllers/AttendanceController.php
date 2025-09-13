<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Learner;
use App\Models\Cai;
use App\Models\Clc;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request)
    {
        $filterLearner = $request->query('learner');
        $filterCai = $request->query('cai');
        $filterClc = $request->query('clc');
        $filterDate = $request->query('date');

        $q = Attendance::query()
            ->with(['learner:learner_id,fullname', 'cai:cai_id,firstname,middlename,lastname', 'clc:clc_id,clc_name'])
            ->orderBy('attendance_date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($filterLearner) {
            $q->where('learner_id', $filterLearner);
        }
        if ($filterCai) {
            $q->where('cai_id', $filterCai);
        }
        if ($filterClc) {
            $q->where('clc_id', $filterClc);
        }
        if ($filterDate) {
            $q->whereDate('attendance_date', $filterDate);
        }

        $attendances = $q->paginate(15);

        $learners = Learner::orderBy('fullname')->get(['learner_id', 'fullname']);
        $cais = Cai::orderBy('lastname')->get(['cai_id', 'firstname', 'middlename', 'lastname']);
        $clcs = Clc::orderBy('clc_name')->get(['clc_id', 'clc_name']);

        return Inertia::render('Admin/Attendance/Attendance_list', [
            'attendances' => $attendances,
            'learners' => $learners,
            'cais' => $cais,
            'clcs' => $clcs,
            'filters' => [
                'learner' => $filterLearner,
                'cai' => $filterCai,
                'clc' => $filterClc,
                'date' => $filterDate,
            ],
            'section' => 'attendance',
        ]);
    }

    /**
     * Store a newly created attendance record.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'learner_id' => ['required', 'integer', 'exists:learner_tb,learner_id'],
            'cai_id' => ['required', 'integer', 'exists:cai_tb,cai_id'],
            'clc_id' => ['required', 'integer', 'exists:clc_tb,clc_id'],
            'status' => ['required', 'in:Present,Absent,Excused'],
            'attendance_date' => ['required', 'date'],
            'remarks' => ['nullable', 'string', 'max:500'],
        ]);

        Attendance::create($data);

        return back()->with('success', 'Attendance record created successfully.');
    }

    /**
     * Update the specified attendance record.
     */
    public function update(Request $request, $attendanceId)
    {
        $data = $request->validate([
            'status' => ['required', 'in:Present,Absent,Excused'],
            'remarks' => ['nullable', 'string', 'max:500'],
        ]);

        $attendance = Attendance::findOrFail($attendanceId);
        $attendance->update($data);

        return back()->with('success', 'Attendance record updated successfully.');
    }

    /**
     * Remove the specified attendance record.
     */
    public function destroy($attendanceId)
    {
        $attendance = Attendance::findOrFail($attendanceId);
        $attendance->delete();

        return back()->with('success', 'Attendance record deleted successfully.');
    }
}