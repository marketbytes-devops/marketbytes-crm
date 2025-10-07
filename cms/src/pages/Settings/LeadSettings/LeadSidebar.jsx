
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeadSidebar = () => {
  const navigate = useNavigate();

  const handleNavigateToLeadSource = () => {
    navigate('/leadsettings/leadsource');
  };

  const handleNavigateToLeadStatus = () => {
    navigate('/leadsettings/leadstatus');
  };

  const handleNavigateToLeadAgent = () => {
    navigate('/leadsettings/leadagent');
  };

  const handleNavigateToLeadCategory = () => {
    navigate('/leadsettings/leadcategory');
  };

  const handleNavigateToSettings = () => {
    navigate('/settings'); 
  };

  return (
    <div className="w-64 bg-white shadow-lg p-4 fixed h-screen">
      <div className="mb-4">
        <button
          className="w-full text-left text-gray-600 p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={handleNavigateToSettings}
        >
          ← Settings
        </button>
      </div>
      <ul className="space-y-2">
    
        <li
          className="bg-white text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToLeadSource}
        >
          Lead Source
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToLeadStatus}
        >
          Lead Status
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToLeadAgent}
        >
          Lead Agent
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToLeadCategory}
        >
          Lead Category
        </li>
      </ul>
    </div>
  );
};

export default LeadSidebar;
