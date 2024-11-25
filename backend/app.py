from flask import Flask, request, jsonify, send_from_directory
import json
from model.financial_services_finloss import model
from model.parser import PentestReportParser
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

frontend_folder = os.path.join(os.getcwd(),'..','frontend')
dist_folder = os.path.join(frontend_folder, 'dist')

# server static files from the dist folder under the frontend directory
@app.route('/',defaults={'filename':''})
@app.route('/<path:filename>')

def index(filename):
    if not filename:
        filename = 'index.html'
    return send_from_directory(dist_folder, filename)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/parse_assessment', methods=['POST'])
def parse_assessment():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    assessment_type = request.form.get('assessmentType')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        # Save the file temporarily
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        # Parse the file based on assessment type
        if assessment_type == 'PenTest':
            parser = PentestReportParser()
            score = parser.get_pentest_score(file_path)
        else:
            # For other assessment types, you can add similar parsing logic
            score = 0.0  # Placeholder
            
        # Clean up - remove the temporary file
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'score': score
        })
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': str(e)}), 500

@app.route('/submit', methods=['POST'])
def submit():
    # Get the questionnaire data from the frontend
    data = request.json
    
    # Run the financial services model to get results
    results = model(data)
    
    # Return the results as JSON
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)