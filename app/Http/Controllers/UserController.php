<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['cais', 'learners'])->paginate(10);
        
        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email_address' => 'required|email|max:255|unique:user_tb,email_address',
            'password' => 'required|min:8|confirmed',
            'role_type' => ['required', Rule::in(['Admin', 'CAI', 'Learner'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email_address' => $validated['email_address'],
            'password' => Hash::make($validated['password']),
            'role_type' => $validated['role_type'],
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['cais', 'learners'])->findOrFail($id);
        
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $userId)
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email_address' => ['required','email','max:255', Rule::unique('user_tb','email_address')->ignore($user->user_id, 'user_id')],
            'password' => 'nullable|min:8|confirmed',
            'role_type' => ['required', Rule::in(['Admin', 'CAI', 'Learner'])],
        ]);

        $update = [
            'name' => $validated['name'],
            'email_address' => $validated['email_address'],
            'role_type' => $validated['role_type'],
        ];
        if (!empty($validated['password'])) {
            $update['password'] = Hash::make($validated['password']);
        }

        $user->update($update);

        return back()->with('success', 'User updated successfully.');
    }
}