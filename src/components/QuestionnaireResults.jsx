import React from 'react';
import { ChevronLeft } from 'lucide-react';

const QuestionnaireResults = ({ data, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Questionnaire Results</h1>
      
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-800 rounded flex items-center hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="mr-2" /> Back to Questionnaire
        </button>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">JSON Output:</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResults;