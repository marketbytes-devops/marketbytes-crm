
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CogIcon } from '@heroicons/react/24/outline';
import TicketSidebar from '../TicketSettings/TicketSidebar';
import axios from 'axios';

const TicketAgent = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiBaseUrl = 'http://localhost:8000/api/tickets/';

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}agents/`);
        setAgents(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch agents: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching agents:', err);
      }
    };
    fetchAgents();
  }, []);

  const handleSave = () => {
    // Handle save logic here
    // Example: Send selectedAgents to backend to create AgentAssignment
    console.log('Selected Agent ID:', selectedAgents);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TicketSidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            Ticket Agents
          </h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="space-y-4">
            {/* Add Agents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Agents *
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={selectedAgents}
                onChange={(e) => setSelectedAgents(e.target.value)}
              >
                <option value="">Choose Agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
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
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAgent;