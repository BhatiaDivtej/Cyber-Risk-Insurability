import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const SecurityQuestions = ({onPrevious, onSubmit, initialData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState(initialData || {
    materialBreach: '',
    remoteAccess: '',
    remoteAccessTypes: [],
    securityPlanPractice: '',
    documentedSecurityPlan: '',
    securityTraining: '',
    alternativeTraining: '',
    incidentResponseTraining: '',
    riskAssessment: '',
    infrastructureAssessment: '',
    necessaryPatches: '',
    patchesIn30Days: '',
    dataEncryption: '',
    dataBacking: '',
    thirdPartyControls: '',
    securityAlerts: '',
    edrTools: '',
    edrToolsUsed: ''
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const currentArray = Array.isArray(formData[name]) ? formData[name] : [];

      const updatedArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      setFormData(prev => ({
        ...prev,
        [name]: updatedArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const questions = [
    // Page 1
    [
      {
        title: "Have you suffered any material breaches in the last 12 months?",
        name: "materialBreach",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        title: "Do you allow remote network access to critical workers?",
        name: "remoteAccess",
        type: "radio",
        options: ["Yes", "No", "Remote Access is not permitted"]
      },
      formData.remoteAccess === "Yes" && {
        title: "Select remote access types:",
        name: "remoteAccessTypes",
        type: "checkbox",
        options: [
          "IT Support Staff",
          "Cybersecurity Professionals",
          "Business Continuity/ Disaster Recovery Teams",
          "Executive Leadership"
        ]
      },
      {
        title: "How often do you practice the information security plan you have in place?",
        name: "securityPlanPractice",
        type: "radio",
        options: ["Annually", "Biannually", "Quarterly", "Monthly", "Never"]
      },
      formData.securityPlanPractice === "Never" && {
        title: "Do you have a documented information security in place?",
        name: "documentedSecurityPlan",
        type: "radio",
        options: ["Yes", "No"]
      }
    ],
    // Page 2
    [
      {
        title: "How often are all critical employees required to complete regular cyber security awareness training?",
        name: "securityTraining",
        type: "radio",
        options: ["Annually", "Biannually", "Quarterly", "No cyber security awareness training is offered"]
      },
      formData.securityTraining === "No cyber security awareness training is offered" && {
        title: "Do you offer alternative training such as workshops or informal training?",
        name: "alternativeTraining",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        title: "How often do you conduct formal incident response training?",
        name: "incidentResponseTraining",
        type: "radio",
        options: ["Monthly", "Quarterly", "Annually", "Never"]
      },
      {
        title: "How often do you conduct a cybersecurity risk assessment of their IT infrastructure?",
        name: "riskAssessment",
        type: "radio",
        options: ["Weekly/Daily", "Monthly", "Quarterly", "Other"]
      }
    ],
    // Page 3
    [
      {
        title: "Including emergency patches, have you made the necessary patches to prevent an incident?",
        name: "necessaryPatches",
        type: "radio",
        options: ["Yes", "No"]
      },
      formData.necessaryPatches === "No" && {
        title: "Will these patches be made in the next 30 days?",
        name: "patchesIn30Days",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        title: "Is all sensitive data encrypted both at rest and in transit?",
        name: "dataEncryption",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        title: "How often is critical data backed up?",
        name: "dataBacking",
        type: "radio",
        options: ["Monthly", "Weekly/Daily", "Other", "Critical data is not backed up"]
      }
    ],
    // Page 4
    [
      {
        title: "Are there controls in place to manage and secure third-party access to your network?",
        name: "thirdPartyControls",
        type: "radio",
        options: ["Yes", "No", "I do not have any third parties which I share data or system access"]
      },
      {
        title: "What is your process for monitoring and responding to security alerts?",
        name: "securityAlerts",
        type: "radio",
        options: ["Response is in real-time", "Response is within the hour", "Response is within the day", "I do not monitor my security alerts."]
      },
      {
        title: "Are endpoint detection and response (EDR) tools used on all endpoints?",
        name: "edrTools",
        type: "radio",
        options: ["Yes", "No"]
      },
      formData.edrTools === "Yes" && {
        title: "What endpoint detection and response (EDR) tools are used within your network?",
        name: "edrToolsUsed",
        type: "radio",
        options: ["CrowdStrike Falcon", "Microsoft Defender", "SentinelOne", "Other"]
      }
    ]
  ];

  const renderQuestion = (question) => {
    if (!question) return null;

    return (
      <div key={question.name} className="mb-6">
        <label className="block mb-2 font-medium">{question.title}</label>
        {question.type === 'radio' && (
          <div className="space-y-2">
            {question.options.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.name}
                  value={option}
                  checked={formData[question.name] === option}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        )}
        {question.type === 'checkbox' && (
          <div className="space-y-2">
            {question.options.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={question.name}
                  value={option}
                  checked={Array.isArray(formData.remoteAccessTypes) && formData.remoteAccessTypes.includes(option)}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const isPageValid = () => {
    const currentQuestions = questions[currentPage].filter(Boolean);
    return currentQuestions.every(question => {
      if (question.type === 'radio') {
        return formData[question.name] !== '';
      }
      if (question.type === 'checkbox') {
        return formData[question.name]?.length > 0;
      }
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Security Questions</h1>
      <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-8">
          {questions[currentPage].map(question => renderQuestion(question))}
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => currentPage === 0 ? onPrevious() : setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-800 rounded flex items-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2" /> Previous
          </button>
          {currentPage === questions.length - 1 ? (
            <button
              type="submit"
              disabled={!isPageValid()}
              onClick={() => {onSubmit(formData)}}
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Show Insurability Results
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!isPageValid()}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 flex items-center hover:bg-gray-700 transition-colors"
            >
              Next <ChevronRight className="ml-2" />
            </button>
          )}
        </div>
        <div className="mt-8 flex justify-center space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                currentPage === index ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default SecurityQuestions;

SecurityQuestions.propTypes = {
    onPrevious: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };