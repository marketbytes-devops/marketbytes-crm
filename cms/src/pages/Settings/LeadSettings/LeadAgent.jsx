import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2Icon } from 'lucide-react';
import Button from '../../../components/Button';
import { CogIcon } from '@heroicons/react/24/outline';
import LeadSidebar from './LeadSidebar';

const LeadAgent = () => {
  const [assignedGroup, setAssignedGroup] = useState('');
  const [agents, setAgents] = useState([]);
  const [agentCounter, setAgentCounter] = useState(1);
  const navigate = useNavigate();

  // Sample group options
  const groupOptions = [
    { value: '', label: '--' },
    { value: 'group1', label: 'Group 1' },
    { value: 'group2', label: 'Group 2' },
    { value: 'group3', label: 'Group 3' },
  ];

  const handleSave = () => {
    if (assignedGroup && assignedGroup !== '') {
      const selectedGroup = groupOptions.find(option => option.value === assignedGroup);
      const newAgent = {
        id: agentCounter,
        name: selectedGroup.label,
        groupValue: assignedGroup
      };
      
      setAgents([...agents, newAgent]);
      setAgentCounter(agentCounter + 1);
      setAssignedGroup(''); // Reset dropdown after save
    }
  };

  const handleRemoveAgent = (id) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <LeadSidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            Lead Agents
          </h2>

          <div className="space-y-4">
            {/* Add Agents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Agents *
              </label>
             
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
          <div className="grid grid-cols-4 gap-4 text-gray-500 font-medium mb-4 p-2 border-b">
            <span>#</span>
            <span>NAME</span>
            <span>ACTION</span>
          </div>
          
          {agents.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No agents added yet
            </div>
          ) : (
            <div className="space-y-2">
              {agents.map((agent, index) => (
                <div key={agent.id} className="grid grid-cols-4 gap-4 items-center p-2 hover:bg-gray-50 rounded">
                  <span>{index + 1}</span>
                  <span>{agent.name}</span>
                  <span></span> {/* Empty column for alignment */}
                  <div className="flex">
                    <button
                      onClick={() => handleRemoveAgent(agent.id)}
                      className="text-red-500 hover:text-red-700 p-1 -ml-35 rounded-full hover:bg-red-50"
                      title="Remove agent"
                    >
                      <Trash2Icon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadAgent;