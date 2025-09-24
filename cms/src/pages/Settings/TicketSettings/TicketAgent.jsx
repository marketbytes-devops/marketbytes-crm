import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CogIcon } from '@heroicons/react/24/outline';
import TicketSidebar from '../TicketSettings/TicketSidebar';

const TicketAgent = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState('');
  const [assignedGroup, setAssignedGroup] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    // Handle save logic here
  };

  // Sample group options
  const groupOptions = [
    { value: '', label: '--' },
    { value: 'group1', label: 'Group 1' },
    { value: 'group2', label: 'Group 2' },
    { value: 'group3', label: 'Group 3' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <TicketSidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            Ticket Agents
          </h2>

          <div className="space-y-4">
            {/* Add Agents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Agents *
              </label>
              <InputField
                type="text"
                placeholder="Choose Agents *"
                value={selectedAgents}
                onChange={(e) => setSelectedAgents(e.target.value)}
              />
            </div>

            {/* Assign Group with Manage Groups Button + Native Select */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Assign Group
                </label>
                <Button
                  onClick={() => navigate('/manage-groups')}
                  className="px-2 py-1 text-xs border border-blue-500 text-blue-500  bg-white hover:bg-blue-50"
                >
                  Manage Groups
                </Button>
                <span className="text-red-500">*</span>
              </div>

              <select
                value={assignedGroup}
                onChange={(e) => setAssignedGroup(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              >
                {groupOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Agents</h3>
          <div className="grid grid-cols-4 gap-4 text-gray-500 font-medium">
            <span>NAME</span>
            <span>GROUP</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAgent;
