import React from 'react';

const FinalResults = ({ data, onBack }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white">No results available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-screen text-white">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{data.company_name}</h1>
          <div className="text-2xl font-semibold text-red-400">
            Expected Total Loss: ${data.expected_total_loss.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Expected Losses by Category:</h2>
          <div className="space-y-4">
            {Object.entries(data.expected_subcategory_losses).map(([category, value]) => (
              <div 
                key={category} 
                className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
              >
                <span className="font-medium">{category}</span>
                <span className="text-green-400">
                  ${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={onBack}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
};

export default FinalResults;