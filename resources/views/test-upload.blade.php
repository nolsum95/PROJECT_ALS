<!DOCTYPE html>
<html>
<head>
    <title>Test File Upload</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Test File Upload</h1>
    
    <form id="uploadForm" enctype="multipart/form-data">
        @csrf
        <div>
            <label>Test File:</label>
            <input type="file" name="test_file" accept=".pdf,.doc,.docx" required>
        </div>
        <br>
        <button type="submit">Upload Test File</button>
    </form>
    
    <div id="result"></div>
    
    <hr>
    
    <h2>Test Reviewer Upload</h2>
    <p><strong>File Requirements:</strong> 10KB minimum, 20MB maximum. Accepted formats: PDF, DOC, DOCX</p>
    <form id="reviewerForm" enctype="multipart/form-data">
        @csrf
        <div>
            <label>File:</label>
            <input type="file" name="file" accept=".pdf,.doc,.docx" required>
        </div>
        <div>
            <label>Test Level:</label>
            <select name="test_level" required>
                <option value="reviewer">Reviewer</option>
                <option value="pretest">Pretest</option>
                <option value="posttest">Posttest</option>
            </select>
        </div>
        <div>
            <label>Title:</label>
            <input type="text" name="title" required>
        </div>
        <div>
            <label>Description:</label>
            <textarea name="description"></textarea>
        </div>
        <div>
            <label>CLC ID:</label>
            <input type="number" name="fk_clc_id" value="1" required>
        </div>
        <div>
            <label>Posting Status:</label>
            <select name="posting_status" required>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="scheduled">Scheduled</option>
            </select>
        </div>
        <br>
        <button type="submit">Upload Reviewer File</button>
    </form>
    
    <div id="reviewerResult"></div>

    <script>
        // Test upload
        document.getElementById('uploadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/admin/test-upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
        });
        
        // Reviewer upload test
        document.getElementById('reviewerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/admin/reviewers/upload', {
                    method: 'POST',
                    body: formData
                });
                
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                const responseText = await response.text();
                console.log('Raw response:', responseText);
                
                // Try to parse as JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    result = {
                        error: 'Failed to parse JSON response',
                        raw_response: responseText,
                        status: response.status
                    };
                }
                
                document.getElementById('reviewerResult').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('reviewerResult').innerHTML = 'Error: ' + error.message;
            }
        });
    </script>
</body>
</html>
