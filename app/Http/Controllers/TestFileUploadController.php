<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestFileUploadController extends Controller
{
    /**
     * Test file upload functionality
     */
    public function testUpload(Request $request)
    {
        try {
            \Log::info('Testing file upload functionality');
            
            // Check if storage directories exist
            $publicDisk = Storage::disk('public');
            
            \Log::info('Storage disk info', [
                'disk_exists' => $publicDisk !== null,
                'root_path' => $publicDisk->path(''),
                'reviewer_files_exists' => $publicDisk->exists('reviewer-files'),
                'modules_exists' => $publicDisk->exists('modules')
            ]);
            
            // Create directories if they don't exist
            if (!$publicDisk->exists('reviewer-files')) {
                $publicDisk->makeDirectory('reviewer-files');
                \Log::info('Created reviewer-files directory');
            }
            
            if (!$publicDisk->exists('modules')) {
                $publicDisk->makeDirectory('modules');
                \Log::info('Created modules directory');
            }
            
            // Test file upload if file is provided
            if ($request->hasFile('test_file')) {
                $file = $request->file('test_file');
                
                \Log::info('Test file details', [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension()
                ]);
                
                $path = $file->store('test-uploads', 'public');
                
                \Log::info('Test file stored', ['path' => $path]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Test file uploaded successfully',
                    'path' => $path,
                    'url' => Storage::disk('public')->url($path)
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Storage test completed - no file uploaded',
                'storage_info' => [
                    'public_disk_path' => $publicDisk->path(''),
                    'reviewer_files_exists' => $publicDisk->exists('reviewer-files'),
                    'modules_exists' => $publicDisk->exists('modules')
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Storage test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Storage test failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
