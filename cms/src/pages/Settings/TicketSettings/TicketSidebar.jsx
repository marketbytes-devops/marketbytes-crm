
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TicketSidebar = () => {
  const navigate = useNavigate();

  const handleNavigateToTicketAgent = () => {
    navigate('/ticketsettings/ticketagent');
  };

  const handleNavigateToTicketTypes = () => {
    navigate('/ticketsettings/tickettype');
  };

  const handleNavigateToTicketChannel = () => {
    navigate('/ticketsettings/ticketchannel');
  };

  const handleNavigateToReplayTemplate = () => {
    navigate('/ticketsettings/replaytemplate');
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
          onClick={handleNavigateToTicketAgent}
        >
          Ticket Agents
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToTicketTypes}
        >
          Ticket Types
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToTicketChannel}
        >
          Ticket Channel
        </li>
        <li
          className="text-gray-600 p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={handleNavigateToReplayTemplate}
        >
          Reply Templates
        </li>
      </ul>
    </div>
  );
};

export default TicketSidebar;
