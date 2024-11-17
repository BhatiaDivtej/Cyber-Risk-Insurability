import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const BusinessQuestions = ({onSubmit, initialData}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    // Contact Information
    name: '',
    phone: '',
    email: '',
    
    // General Information
    companyName: '',
    country: '',
    region: '',
    primaryIndustry: '',
    employeeCount: '',
    annualRevenue: '',
    revenue2023: '',
    revenue2022: '',
    cybersecurityBudget: '',
    regulations: [],
    
    // Data Handling
    recentBreach: '',
    incidentCount: '',
    dataExposed: [],
    recordsExposed: '',
    incidentFixed: '',
    
    // Cyber Insurance
    insuranceCarrier: '',
    lossBasisType: '',
    existingDeductibles: '',
    coverages: {
    incidentResponse: { coverage: '', deductible: '' },
    cyberExtortion: { coverage: '', deductible: '' },
    businessEmail: { coverage: '', deductible: '' },
    businessInterruption: { coverage: '', deductible: '' },
    liability: { coverage: '', deductible: '' }
  }
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const isPageValid = () => {
    switch(currentPage) {
      case 0:
        return formData.name && 
               validatePhone(formData.phone) && 
               validateEmail(formData.email);
      case 1:
        return formData.companyName && 
               formData.country &&
               formData.region &&
               formData.primaryIndustry && 
               formData.employeeCount && 
               formData.annualRevenue && 
               formData.cybersecurityBudget;
      case 2:
        return true; // Optional section
      case 3:
        return true; // Optional section
      default:
        return false;
    }
  };

  const handleInputChange = (e, section = null, subsection = null) => {
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
    } else if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-2">Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
          pattern="[0-9]{10}"
          required
        />
      </div>
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
      </div>
    </div>
  );

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Company's Name</label>
        <input
          type="text"
          name="companyName"
          placeholder="Company's Name"
          value={formData.companyName}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Geographic Locations of Operation</label>
        <div className="mb-4">
          <label className="block mb-2">Country</label>
          <CountryDropdown
            value={formData.country}
            onChange={(val) => handleInputChange({ target: { name: 'country', value: val }})}
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
      </div>

      <div>
        <label className="block mb-2">Region/State</label>
        <RegionDropdown
          country={formData.country}
          value={formData.region}
          onChange={(val) => handleInputChange({ target: { name: 'region', value: val }})}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Primary Industry</label>

        <select
          name="primaryIndustry"
          value={formData.primaryIndustry}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        >
          <option value="">Select from below</option>

          <option value="11">Agriculture, Forestry, Fishing and Hunting (11)</option>
          <option value="21">Mining, Quarrying, and Oil and Gas Extraction (21)</option>
          <option value="22">Utilities (22)</option>
          <option value="23">Construction (23)</option>
          <option value="31">Manufacturing (31)</option>
          <option value="42">Wholesale trade (42)</option>
          <option value="44">Retail trade (44)</option>
          <option value="48">Transportation and warehousing (48)</option>
          <option value="51">Information (51)</option>
          <option value="52">Finance and insurance (52)</option>
          <option value="53">Real estate and rental and leasing (53)</option>
          <option value="54">Professional, scientific, and technical services (54)</option>
          <option value="55">Management of companies and enterprises (55)</option>
          <option value="56">Administrative and support and waste management and remediation services (56)</option>
          <option value="61">Educational services (61)</option>
          <option value="62">Healthcare and social assistance (62)</option>
          <option value="71">Arts, entertainment, and recreation (71)</option>
          <option value="72">Accommodation and food services (72)</option>
          <option value="81">Other services (81)</option>
          <option value="92">Public administration (92)</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Number of Total Employees</label>
        {['1-50', '51-250', '251-1000', '1001-5000', '5001+'].map(option => (
          <div key={option} className="flex items-center space-x-2 my-1">
            <input
              type="radio"
              name="employeeCount"
              value={option}
              checked={formData.employeeCount === option}
              onChange={handleInputChange}
              className="form-radio"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block mb-2">Annual Revenue (in USD)</label>
        {[
          'Less than $1 million',
          '$1 million - $10 million',
          '$10 million - $100 million',
          '$100 million - $1 billion',
          'More than $1 billion'
        ].map(option => (
          <div key={option} className="flex items-center space-x-2 my-1">
            <input
              type="radio"
              name="annualRevenue"
              value={option}
              checked={formData.annualRevenue === option}
              onChange={handleInputChange}
              className="form-radio"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block mb-2">Previous Two Years' Revenue (Optional)</label>
        <div className="space-y-2">
          <input
            type="number"
            name="revenue2023"
            placeholder="FY 2023-24 Revenue"
            value={formData.revenue2023}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded"
          />
          <input
            type="number"
            name="revenue2022"
            placeholder="FY 2022-23 Revenue"
            value={formData.revenue2022}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Cybersecurity Budget Percentage</label>
        <input
          type="number"
          name="cybersecurityBudget"
          placeholder="Percentage (0-100)"
          value={formData.cybersecurityBudget}
          onChange={handleInputChange}
          min="0"
          max="100"
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Applicable Regulations</label>
        {['FTC', 'SEC', 'HIPAA', 'OCC', 'CCPA', 'BIPA', 'GDPR', 'UK ICO', 'OPC CA', 'NYDFS PART 500'].map(option => (
          <div key={option} className="flex items-center space-x-2 my-1">
            <input
              type="checkbox"
              name="regulations"
              value={option}
              checked={Array.isArray(formData.regulations) && formData.regulations.includes(option)}
              // checked={formData.regulations.includes(option)}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
    </div>
    </div>
  );

  const renderDataHandling = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Most Recent Cyber Breach / Incident</label>
        {[
          'Within the last 3 months',
          'Within the last 6 months',
          'Within the last 12 months',
          'More than a year',
          'No'
        ].map(option => (
          <div key={option} className="flex items-center space-x-2 my-1">
            <input
              type="radio"
              name="recentBreach"
              value={option}
              checked={formData.recentBreach === option}
              onChange={handleInputChange}
              className="form-radio"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>

      {formData.recentBreach && formData.recentBreach !== 'No' && (
        <>
          <div>
            <label className="block mb-2">Number of Recorded Cyber Incidents (Last 6 months)</label>
            <input
              type="number"
              name="incidentCount"
              placeholder="Number of incidents"
              value={formData.incidentCount}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Types of Data Exposed</label>
            {[
              'Personal Records',
              'Credit Card Details',
              'Health Information',
              'Financial Information'
            ].map(option => (
              <div key={option} className="flex items-center space-x-2 my-1">
                <input
                  type="checkbox"
                  name="dataExposed"
                  value={option}
                  checked={formData.dataExposed.includes(option)}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-2">Number of Records Exposed</label>
            {[
              '1-50',
              '51-100',
              '101-500',
              '501-1000',
              '1001-5000',
              '5001+'
            ].map(option => (
              <div key={option} className="flex items-center space-x-2 my-1">
                <input
                  type="radio"
                  name="recordsExposed"
                  value={option}
                  checked={formData.recordsExposed === option}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-2">Incident Resolution Status</label>
            {['Yes', 'No', 'In Progress'].map(option => (
              <div key={option} className="flex items-center space-x-2 my-1">
                <input
                  type="radio"
                  name="incidentFixed"
                  value={option}
                  checked={formData.incidentFixed === option}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCyberInsurance = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Primary Cyber Insurance Carrier</label>
        <input
          type="text"
          name="insuranceCarrier"
          placeholder="Insurance Carrier Name"
          value={formData.insuranceCarrier}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Loss Basis Type</label>
        {['Occurrence-based', 'Claims-made'].map(option => (
          <div key={option} className="flex items-center space-x-2 my-1">
            <input
              type="radio"
              name="lossBasisType"
              value={option}
              checked={formData.lossBasisType === option}
              onChange={handleInputChange}
              className="form-radio"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block mb-2">Existing Deductibles</label>
        <input
          type="number"
          name="existingDeductibles"
          placeholder="Deductible Amount"
          value={formData.existingDeductibles}
          onChange={handleInputChange}
          min="0"
          className="w-full p-2 bg-gray-800 rounded"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Coverage Details</h3>
        {[
          { key: 'incidentResponse', label: 'Incident Response' },
          { key: 'cyberExtortion', label: 'Cyber Extortion and Ransomware' },
          { key: 'businessEmail', label: 'Business Email Compromise and Fraud Wire' },
          { key: 'businessInterruption', label: 'Business Interruptions' },
          { key: 'liability', label: 'Liability' }
        ].map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="block font-medium">{label}</label>
            <input
              type="number"
              placeholder="Coverage Amount"
              value={formData.coverages[key].coverage}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                coverages: {
                  ...prev.coverages,
                  [key]: {
                    ...prev.coverages[key],
                    coverage: e.target.value
                  }
                }
              }))}
              className="w-full p-2 bg-gray-800 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Deductible Amount"
              value={formData.coverages[key].deductible}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                coverages: {
                  ...prev.coverages,
                  [key]: {
                    ...prev.coverages[key],
                    deductible: e.target.value
                  }
                }
              }))}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 0: return renderContactInfo();
      case 1: return renderGeneralInfo();
      case 2: return renderDataHandling();
      case 3: return renderCyberInsurance();
      default: return null;
    }
  };

  const pageHeadings = [
  "Contact Information",
  "General Information",
  "Data Handling",
  "Cyber Insurance Details"
  ];

return (
  <div className="min-h-screen bg-black text-white p-8">
    <h1 className="text-3xl font-bold mb-4">Business Questions</h1>
    <h2 className="text-xl mb-6">{pageHeadings[currentPage]}</h2>
    
    <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
      <div className="mb-8">
        {renderCurrentPage()}
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 flex items-center hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="mr-2" /> Previous
        </button>
        
        {currentPage === pageHeadings.length - 1 ? (
          <button
            type="submit"
            disabled={!isPageValid()}
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            Next Section
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

      {/* Progress indicator */}
      <div className="mt-8 flex justify-center space-x-2">
        {[0, 1, 2, 3].map((page) => (
          <div
            key={page}
            className={`h-2 w-2 rounded-full ${
              currentPage === page ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </form>
  </div>
);
};

export default BusinessQuestions;
