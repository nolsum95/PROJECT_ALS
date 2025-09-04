<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cai;
use App\Models\Clc;
use App\Models\User;

class CaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cais = Cai::query()
            ->with(['clc:clc_id,clc_name'])
            ->withCount(['learners as learners_count'])
            ->orderBy('cai_id','desc')
            ->get(['cai_id','lastname','firstname','middlename','gender','assigned_clc','status']);

        $clcs = Clc::orderBy('clc_name')->get(['clc_id','clc_name']);
        $caiUsers = User::where('role_type', 'CAI')->orderBy('name')
            ->get(['user_id','name','email_address']);

        return Inertia::render('Admin/Clc/Cai_list', [
            'cais' => $cais,
            'clcs' => $clcs,
            'caiUsers' => $caiUsers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            // optional user creation
            // 'name' =>
            'email_address' => ['nullable','email','max:255','unique:user_tb,email_address'],
            'password' => ['nullable','string','min:8'],
            // required when no user is given
            'fk_userId' => ['nullable','integer','exists:user_tb,user_id'],
            'lastname' => ['required','string','max:255'],
            'firstname' => ['required','string','max:255'],
            'middlename' => ['nullable','string','max:255'],
            'gender' => ['required','in:Male,Female,Others'],
            'assigned_clc' => ['nullable','integer','exists:clc_tb,clc_id'],
            'status' => ['required','in:Active,Inactive'],
        ]);

        // Create user if credentials provided
        if (empty($data['fk_userId']) && !empty($data['email_address']) && !empty($data['password'])) {
            $user = \App\Models\User::create([
                'name' => ($data['firstname'].' '.$data['middlename'].' '.$data['lastname'].$data['']),
                'email_address' => $data['email_address'],
                'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
                'role_type' => 'CAI',
            ]);
            $data['fk_userId'] = $user->user_id;
        }

        if (empty($data['fk_userId'])) {
            return back()->with('error', 'Please select a linked user or provide credentials to create one.');
        }

        Cai::create(collect($data)->only([
            'fk_userId','lastname','firstname','middlename','gender','assigned_clc','status'
        ])->all());

        return back()->with('success', 'CAI created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $cai = Cai::with(['clc:clc_id,clc_name','learners:learner_id,fullname,assigned_cai'])
            ->findOrFail($id);
        return Inertia::render('Admin/Clc/Cai_show', [ 'cai' => $cai ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'fk_userId' => ['required','integer','exists:user_tb,user_id'],
            'lastname' => ['required','string','max:255'],
            'firstname' => ['required','string','max:255'],
            'middlename' => ['nullable','string','max:255'],
            'gender' => ['required','in:Male,Female,Others'],
            'assigned_clc' => ['nullable','integer','exists:clc_tb,clc_id'],
            'status' => ['required','in:Active,Inactive'],
        ]);

        Cai::where('cai_id', $id)->update($data);

        return back()->with('success', 'CAI updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
    }
}
