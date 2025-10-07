
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const handleNavigateToTicketAgent = () => {
    navigate('/ticketsettings/ticketagent');
  };

    const handleNavigateToLeadSource = () => {
    navigate('/leadsettings/leadsource');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <ul className="space-y-2">
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Profile Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Notification Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Currency Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Payment Credentials</li>
          <li
            className="bg-purple-500 text-white p-2 rounded cursor-pointer"
            onClick={handleNavigateToTicketAgent}
          >
            Ticket Settings
          </li>
          <li
            className="bg-purple-500 text-white p-2 rounded cursor-pointer"
            onClick={handleNavigateToLeadSource}
          >
            Lead Settings
          </li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Finance Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Project Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Attendance Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Leaves Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Custom Fields</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Menu Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Module Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Roles & Permissions</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Storage Settings</li>
          <li className="text-gray-600 p-2 rounded hover:bg-gray-100">Language Settings</li>
        </ul>
      </div>

      {/* Main Content (Empty for now as per request) */}
      <div className="flex-1 p-6">
        {/* You can add content here if needed later */}
      </div>
    </div>
  );
};

export default Settings;
