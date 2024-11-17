// import React from 'react';

// const Sidebar = ({ currentSection, onNavigate }) => {
//   return (
//     <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 p-6">
//       <div className="mt-8">
//         <h2 className="text-xl font-bold text-white mb-6 px-4">Sections</h2>
//         <div className="space-y-2">
//           <button
//             onClick={() => onNavigate('business')}
//             className={`w-full px-4 py-3 text-left rounded transition-colors ${
//               currentSection === 'business'
//                 ? 'bg-blue-600 text-white'
//                 : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//             }`}
//           >
//             Business Questions
//           </button>
//           <button
//             onClick={() => onNavigate('security')}
//             className={`w-full px-4 py-3 text-left rounded transition-colors ${
//               currentSection === 'security'
//                 ? 'bg-blue-600 text-white'
//                 : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//             }`}
//           >
//             Security Questions
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardList, Shield, FileText } from 'lucide-react';

const Sidebar = ({ currentSection, onNavigate }) => {
  const sections = [
    { id: 'business', label: 'Business Questions', icon: ClipboardList },
    { id: 'assessment', label: 'Assessments', icon: FileText },
    { id: 'security', label: 'Security Questions', icon: Shield },
  ];

  return (
    <div className="fixed w-64 h-full bg-gray-900 p-4">
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded transition-colors ${
                currentSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  currentSection: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Sidebar;