import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import PropTypes from 'prop-types';

const Assessments = ({ onSubmit, onPrevious, initialData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialData || {
    assessmentType: '',
    assessmentScore: null,
    cisAnswers: {},
    sigLiteAnswers: {}
  });

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment);
    setFormData(prev => ({
      ...prev,
      assessmentType: assessment
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload only PDF files');
        return;
      }
      if (file.size > 150 * 1024 * 1024) { // 150MB in bytes
        setError('File size should be less than 150MB');
        return;
      }
      setUploadedFile(file);
      setError('');
    }
  };

  const handleFileSubmit = async () => {
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('assessmentType', selectedAssessment);

    try {
      const response = await fetch('http://127.0.0.1:5000/parse_assessment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        assessmentScore: result.score
      }));

      onSubmit({
        assessmentType: selectedAssessment,
        assessmentScore: result.score
      });

    } catch (error) {
      setError('Uploaded file cannot be parsed. Please upload a different file or answer the assessment questions');
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const section = selectedQuestionnaire === 'CIS' ? 'cisAnswers' : 'sigLiteAnswers';
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const cisQuestions = [
    // Page 1
    [
      {
        title: "How frequently do you perform inventory of authorized devices?",
        name: "deviceInventory",
        type: "radio",
        options: ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"]
      },
      {
        title: "Do you maintain an inventory of authorized software?",
        name: "softwareInventory",
        type: "radio",
        options: ["Yes", "No", "In Progress"]
      },
      {
        title: "How often do you review and update security configurations?",
        name: "securityConfig",
        type: "radio",
        options: ["Monthly", "Quarterly", "Annually", "Never"]
      }
    ],
    // Page 2
    [
      {
        title: "Do you have continuous vulnerability assessment in place?",
        name: "vulnAssessment",
        type: "radio",
        options: ["Yes", "No", "Partially"]
      },
      {
        title: "How do you manage administrative privileges?",
        name: "adminPrivileges",
        type: "radio",
        options: ["Strict control", "Moderate control", "Basic control", "No control"]
      },
      {
        title: "Is email and browser protection implemented?",
        name: "emailProtection",
        type: "radio",
        options: ["Fully", "Partially", "Not implemented"]
      }
    ]
  ];

  const sigLiteQuestions = [
    // Page 1
    [
      {
        title: "Do you have a documented information security policy?",
        name: "securityPolicy",
        type: "radio",
        options: ["Yes", "No", "In Development"]
      },
      {
        title: "How often do you conduct security awareness training?",
        name: "awarenessTraining",
        type: "radio",
        options: ["Monthly", "Quarterly", "Annually", "Never"]
      },
      {
        title: "Is there a formal incident response plan?",
        name: "incidentResponse",
        type: "radio",
        options: ["Yes", "No", "Under Review"]
      }
    ],
    // Page 2
    [
      {
        title: "How do you manage third-party risk?",
        name: "thirdPartyRisk",
        type: "radio",
        options: ["Formal program", "Informal process", "No management"]
      },
      {
        title: "Is data classification implemented?",
        name: "dataClassification",
        type: "radio",
        options: ["Yes", "No", "Partially"]
      },
      {
        title: "Do you have business continuity plans in place?",
        name: "businessContinuity",
        type: "radio",
        options: ["Yes", "No", "In Development"]
      }
    ]
  ];

  const renderQuestion = (question) => {
    return (
      <div key={question.name} className="mb-6">
        <label className="block mb-2 font-medium">{question.title}</label>
        <div className="space-y-2">
          {question.options.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name={question.name}
                value={option}
                onChange={handleInputChange}
                className="form-radio"
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading... Please wait while the document is being processed.</div>
        </div>
      );
    }

    if (!selectedAssessment) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Can you provide any of these assessments/reports that you may have conducted in the last 3 months?
          </h2>
          {['NIST', 'PenTest', 'CIS', 'SIG Lite', 'None'].map(assessment => (
            <button
              key={assessment}
              onClick={() => handleAssessmentSelect(assessment)}
              className="block w-full p-4 text-left border rounded hover:bg-gray-700 transition-colors"
            >
              {assessment}
            </button>
          ))}
        </div>
      );
    }

    if (selectedAssessment !== 'None' && !selectedQuestionnaire) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Please Upload your {selectedAssessment} report
          </h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-12 w-12" />
              <span>Click to upload PDF (max 150MB)</span>
            </label>
          </div>
          {uploadedFile && (
            <div className="mt-4">
              <button
                onClick={handleFileSubmit}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-2">
              {error}
            </div>
          )}
        </div>
      );
    }

    if (selectedAssessment === 'None' && !selectedQuestionnaire) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Which assessment would you like to answer? Select any 1 option so we can present you with some relevant security questions to answer.
          </h2>
          {['CIS', 'SIG Lite'].map(questionnaire => (
            <button
              key={questionnaire}
              onClick={() => setSelectedQuestionnaire(questionnaire)}
              className="block w-full p-4 text-left border rounded hover:bg-gray-700 transition-colors"
            >
              {questionnaire}
            </button>
          ))}
        </div>
      );
    }

    const questions = selectedQuestionnaire === 'CIS' ? cisQuestions : sigLiteQuestions;

    return (
      <form className="space-y-6">
        {questions[currentPage].map(question => renderQuestion(question))}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => currentPage === 0 ? setCurrentPage(0) : setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 bg-gray-800 rounded flex items-center hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="mr-2" /> Previous
          </button>
          {currentPage === questions.length - 1 ? (
            <button
              type="button"
              onClick={() => onSubmit(formData)}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-gray-800 rounded flex items-center hover:bg-gray-700 transition-colors"
            >
              Next <ChevronRight className="ml-2" />
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Assessment Section</h1>
      {renderContent()}
    </div>
  );
};

Assessments.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default Assessments;