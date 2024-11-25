// import React, { useState } from 'react';
// import BusinessQuestions from './components/BusinessQuestions';
// import SecurityQuestions from './components/SecurityQuestions';
// import QuestionnaireResults from './components/QuestionnaireResults';
// import FinalResults from './components/FinalResults';
// import Sidebar from './components/Sidebar';

// const App = () => {
//   const [currentSection, setcurrentSection] = useState('business');
//   const [showResults, setShowResults] = useState(false);
//   const [loading, setloading] = useState(false);
//   const [businessData, setBusinessData] = useState({});
//   const [securityData, setSecurityData] = useState({});
//   const [outputData, setOutputData] = useState({});

//   const handleBusinessSubmit = (data) => {
//     console.log("Business Submit Handler Called", data);
//     setBusinessData(data);
//     setcurrentSection('security');
//   };

//   const handleSecuritySubmit = async (data) => {
//     console.log("Security Submit Handler Called", data);
//     setSecurityData(data);
//     setloading(true)
    
//     const combinedData = {
//       businessQuestions: businessData,
//       securityQuestions: securityData
//     };
    
//     // Send the data to the Flask backend
//     try {
//         const response = await fetch('http://127.0.0.1:5000/submit', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(combinedData),  // Convert the data to JSON format
//         });

//         if (!response.ok){
//           throw new Error('Server Responses with error: ' + response.statusText);
//         }

//         const result = await response.json();  // Get the response
//         console.log("Response from server:", result);
        
//         setOutputData(result);
//         setloading(false)  
//         setShowResults(true);
        
//     } catch (error) {
//         console.error("Error sending data:", error);
//         setloading(false)
//     }

// };

//   const handleBack = () => {
//     if (currentSection === 'security'){
//       setcurrentSection('business')
//     }
//     else{
//       setShowResults(false);
//       setcurrentSection('business');
//       setBusinessData();
//       setSecurityData();
//     }
//   };

//   const handleNavigate = (section) => {
//     if (!showResults) {
//       // Save current section data before navigation
//       if (currentSection === 'business') {
//         // Don't overwrite existing data if it's just a navigation
//         setcurrentSection(section);
//       } else if (currentSection === 'security') {
//         // Don't overwrite existing data if it's just a navigation
//         setcurrentSection(section);
//       }
//     }
//   };

//   const renderContent = () => {
//     if (loading){
//       return <div> Loading .... Please wait while the results are being computed. </div>;
//     }
//     if (showResults) {
//       return <FinalResults data={outputData} onBack={handleBack}/>;
//     }
//     if (currentSection === 'business') {
//       return <BusinessQuestions onSubmit={handleBusinessSubmit} initialData={businessData} onPrevious={() => handleBack()} />;
//     }

//     return <SecurityQuestions onSubmit={handleSecuritySubmit} initialData={securityData} onPrevious={() => handleBack()} />;
//   };

//   return (
//     <div className="flex min-h-screen bg-black">
//       <Sidebar 
//         currentSection={currentSection}
//         onNavigate={handleNavigate}
//       />
//       <main className="flex-1 ml-64">
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// export default App;
import React, { useState } from 'react';
import BusinessQuestions from './components/BusinessQuestions';
import SecurityQuestions from './components/SecurityQuestions';
import Assessments from './components/Assessments';
import QuestionnaireResults from './components/QuestionnaireResults';
import FinalResults from './components/FinalResults';
import Sidebar from './components/Sidebar';

const App = () => {
  const [currentSection, setcurrentSection] = useState('business');
  const [showResults, setShowResults] = useState(false);
  const [loading, setloading] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [assessmentData, setAssessmentData] = useState({});
  const [securityData, setSecurityData] = useState({});
  const [outputData, setOutputData] = useState({});

  const handleBusinessSubmit = (data) => {
    console.log("Business Submit Handler Called", data);
    setBusinessData(data);
    setcurrentSection('assessment');
  };

  const handleAssessmentSubmit = (data) => {
    console.log("Assessment Submit Handler Called", data);
    setAssessmentData(data);
    setcurrentSection('security');
  };

  const handleSecuritySubmit = async (data) => {
    console.log("Security Submit Handler Called", data);
    setSecurityData(data);
    setloading(true)
    
    const combinedData = {
      businessQuestions: businessData,
      assessmentData: assessmentData,
      securityQuestions: securityData
    };
    
    try {
        const response = await fetch('http://127.0.0.1:5000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(combinedData),
        });

        if (!response.ok){
          throw new Error('Server Responses with error: ' + response.statusText);
        }

        const result = await response.json();
        console.log("Response from server:", result);
        
        setOutputData(result);
        setloading(false)  
        setShowResults(true);
        
    } catch (error) {
        console.error("Error sending data:", error);
        setloading(false)
    }
  };

  const handleBack = () => {
    if (currentSection === 'security') {
      setcurrentSection('assessment');
    } else if (currentSection === 'assessment') {
      setcurrentSection('business');
    } else {
      setShowResults(false);
      setcurrentSection('business');
      setBusinessData({});
      setAssessmentData({});
      setSecurityData({});
    }
  };

  const handleNavigate = (section) => {
    if (!showResults) {
      setcurrentSection(section);
    }
  };

  const renderContent = () => {
    if (loading){
      return <div>Loading .... Please wait while the results are being computed.</div>;
    }
    if (showResults) {
      return <FinalResults data={outputData} onBack={handleBack}/>;
    }
    if (currentSection === 'business') {
      return <BusinessQuestions onSubmit={handleBusinessSubmit} initialData={businessData} onPrevious={() => handleBack()} />;
    }
    if (currentSection === 'assessment') {
      return <Assessments onSubmit={handleAssessmentSubmit} initialData={assessmentData} onPrevious={() => handleBack()} />;
    }

    return <SecurityQuestions onSubmit={handleSecuritySubmit} initialData={securityData} onPrevious={() => handleBack()} />;
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar 
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 ml-64">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;