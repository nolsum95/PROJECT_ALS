<?php

namespace App\Http\Controllers;

use App\Models\Learner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LearnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learners = Learner::with(['user', 'clcs', 'modules', 'learnerAnswers', 'learnerAttempts'])
            ->paginate(10);
        
        return Inertia::render('Learners/Index', [
            'learners' => $learners
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::where('role_type', 'Learner')->get();
        
        return Inertia::render('Learners/Create', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fk_userId' => 'required|exists:user_tb,user_id',
            'fullname' => 'required|string|max:255',
            'assigned_clc' => 'required|string|max:255',
            'assigned_cai' => 'required|string|max:255',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ]);

        $learner = Learner::create($validated);

        return redirect()->route('learners.index')
            ->with('success', 'Learner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $learner = Learner::with(['user', 'clcs', 'modules', 'learnerAnswers', 'learnerAttempts'])
            ->findOrFail($id);
        
        return Inertia::render('Learners/Show', [
            'learner' => $learner
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $learner = Learner::findOrFail($id);
        $users = User::where('role_type', 'Learner')->get();
        
        return Inertia::render('Learners/Edit', [
            'learner' => $learner,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $learner = Learner::findOrFail($id);
        
        $validated = $request->validate([
            'fk_userId' => 'required|exists:user_tb,user_id',
            'fullname' => 'required|string|max:255',
            'assigned_clc' => 'required|string|max:255',
            'assigned_cai' => 'required|string|max:255',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ]);

        $learner->update($validated);

        return redirect()->route('learners.index')
            ->with('success', 'Learner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $learner = Learner::findOrFail($id);
        $learner->delete();

        return redirect()->route('learners.index')
            ->with('success', 'Learner deleted successfully.');
    }
}

            'learner' => $learner
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $learner = Learner::findOrFail($id);
        $users = User::where('role_type', 'Learner')->get();
        
        return Inertia::render('Learners/Edit', [
            'learner' => $learner,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $learner = Learner::findOrFail($id);
        
        $validated = $request->validate([
            'fk_userId' => 'required|exists:user_tb,user_id',
            'fullname' => 'required|string|max:255',
            'assigned_clc' => 'required|string|max:255',
            'assigned_cai' => 'required|string|max:255',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ]);

        $learner->update($validated);

        return redirect()->route('learners.index')
            ->with('success', 'Learner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $learner = Learner::findOrFail($id);
        $learner->delete();

        return redirect()->route('learners.index')
            ->with('success', 'Learner deleted successfully.');
    }
}
