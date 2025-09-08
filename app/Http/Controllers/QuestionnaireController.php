<?php

namespace App\Http\Controllers;

use App\Models\Questionnaire;
use App\Models\Classwork;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionnaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questionnaires = Questionnaire::with(['classwork', 'subject', 'questions', 'learnerAttempts'])
            ->paginate(10);
        
        return Inertia::render('Questionnaires/Index', [
            'questionnaires' => $questionnaires
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classworks = Classwork::all();
        $subjects = Subject::all();
        
        return Inertia::render('Questionnaires/Create', [
            'classworks' => $classworks,
            'subjects' => $subjects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fk_classwork_id' => 'required|exists:classwork_tb,classwork_id',
            'fk_subject_id' => 'required|exists:subject_tb,subject_id',
            'time_duration' => 'nullable|integer|min:1',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $questionnaire = Questionnaire::create($validated);

        return redirect()->route('questionnaires.index')
            ->with('success', 'Questionnaire created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $questionnaire = Questionnaire::with(['classwork', 'subject', 'questions', 'learnerAttempts'])
            ->findOrFail($id);
        
        return Inertia::render('Questionnaires/Show', [
            'questionnaire' => $questionnaire
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        $classworks = Classwork::all();
        $subjects = Subject::all();
        
        return Inertia::render('Questionnaires/Edit', [
            'questionnaire' => $questionnaire,
            'classworks' => $classworks,
            'subjects' => $subjects
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        
        $validated = $request->validate([
            'fk_classwork_id' => 'required|exists:classwork_tb,classwork_id',
            'fk_subject_id' => 'required|exists:subject_tb,subject_id',
            'time_duration' => 'nullable|integer|min:1',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $questionnaire->update($validated);

        return redirect()->route('questionnaires.index')
            ->with('success', 'Questionnaire updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        $questionnaire->delete();

        return redirect()->route('questionnaires.index')
            ->with('success', 'Questionnaire deleted successfully.');
    }
}

        
        return Inertia::render('Questionnaires/Show', [
            'questionnaire' => $questionnaire
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        $classworks = Classwork::all();
        $subjects = Subject::all();
        
        return Inertia::render('Questionnaires/Edit', [
            'questionnaire' => $questionnaire,
            'classworks' => $classworks,
            'subjects' => $subjects
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        
        $validated = $request->validate([
            'fk_classwork_id' => 'required|exists:classwork_tb,classwork_id',
            'fk_subject_id' => 'required|exists:subject_tb,subject_id',
            'time_duration' => 'nullable|integer|min:1',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $questionnaire->update($validated);

        return redirect()->route('questionnaires.index')
            ->with('success', 'Questionnaire updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        $questionnaire->delete();

        return redirect()->route('questionnaires.index')
            ->with('success', 'Questionnaire deleted successfully.');
    }
}
