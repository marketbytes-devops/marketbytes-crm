
import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import Icons from '../../../components/Icons';
import { CogIcon } from '@heroicons/react/24/outline';
import TicketSidebar from '../TicketSettings/TicketSidebar'; // Updated from Sidebar to TicketSidebar

const TicketType = () => {
  const [ticketType, setTicketType] = useState('');

  const handleSave = () => {
    // Handle save logic here
    if (ticketType.trim()) {
      setTicketType('');
      // Add logic to save ticket type
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TicketSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64"> {/* Add margin-left to avoid overlap with fixed sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Icons>
              <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            </Icons>
            Ticket Types
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add New Ticket Type</label>
              <InputField
                type="text"
                placeholder="Ticket Type *"
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-green-500 text-white hover:bg-green-600">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Ticket Types Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Types</h3>
          <div className="grid grid-cols-3 gap-4 text-gray-500 font-medium">
            <span>#</span>
            <span>NAME</span>
            <span>ACTION</span>
          </div>
          <p className="text-gray-500 mt-4">No ticket type added.</p>
        </div>
      </div>
    </div>
  );
};

export default TicketType;
