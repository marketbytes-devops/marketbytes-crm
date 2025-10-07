import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CogIcon, Edit2, Trash2 } from 'lucide-react';
import LeadSidebar from '../LeadSettings/LeadSidebar';

const LeadStatus = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [leadStatus, setLeadStatus] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [color, setColor] = useState('#000000');
  const [defaultStatus, setDefaultStatus] = useState('');
  const navigate = useNavigate();

  // Mock data for initial dropdown options
  const mockData = [
    { name: 'New', color: '#4CAF50' },
    { name: 'In Progress', color: '#FF9800' },
    { name: 'Completed', color: '#2196F3' },
  ];

  useEffect(() => {
    // Do not initialize table with mock data, only use for dropdown
  }, []);

  const handleSave = () => {
    if (!selectedStatus.trim()) {
      alert('Lead Status is required!');
      return;
    }
    setLeadStatus([...leadStatus, { name: selectedStatus, color }]);
    setSelectedStatus('');
    setColor('#000000');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(leadStatus[index].name);
    setColor(leadStatus[index].color);
  };

  const handleUpdate = (index) => {
    if (!editingValue.trim()) {
      alert('Lead Status cannot be empty!');
      return;
    }
    const updatedStatus = [...leadStatus];
    updatedStatus[index] = { name: editingValue, color };
    setLeadStatus(updatedStatus);
    setEditingIndex(null);
    setEditingValue('');
    setColor('#000000');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
    setColor('#000000');
  };

  const handleRemove = (index) => {
    if (window.confirm('Are you sure you want to remove this Lead Status?')) {
      const updatedStatus = leadStatus.filter((_, i) => i !== index);
      setLeadStatus(updatedStatus);
      if (defaultStatus === leadStatus[index].name) {
        setDefaultStatus('');
      }
    }
  };

  const handleDefaultStatusChange = (e) => {
    const selected = e.target.value;
    setDefaultStatus(selected);
    if (selected && !leadStatus.some(status => status.name === selected)) {
      // Find the matching mock data or use the selected value
      const selectedMock = mockData.find(item => item.name === selected);
      if (selectedMock) {
        setLeadStatus([...leadStatus, { name: selectedMock.name, color: selectedMock.color }]);
      } else if (selected && selected !== '-- Select Default Status --') {
        setLeadStatus([...leadStatus, { name: selected, color: '#000000' }]);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <LeadSidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            Lead Status
          </h2>

          <div className="space-y-4">
            <div>Add New Lead Status</div>

            <div>
              <label className="block mt-4 text-sm font-bold text-gray-700 mb-1">
                Lead Status *
              </label>
              <InputField
                type="text"
                placeholder="Enter Lead Status *"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mt-4 text-sm font-bold text-gray-700 mb-1">
                Label Color *
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 p-1 border rounded mr-2"
                />
                <InputField
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 border rounded p-2"
                  required
                />
                <span
                  className="w-6 h-6 ml-2 border rounded"
                  style={{ backgroundColor: color }}
                ></span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end w-50">
              <Button
                onClick={handleSave}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </Button>
            </div>

            {/* Default Status Selection */}
            <div>
              <label className="block mt-4 text-sm font-bold text-gray-700 mb-1">
                Default Status Selection
              </label>
              <select
                value={defaultStatus}
                onChange={handleDefaultStatusChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">-- Select Default Status --</option>
                {mockData.map((status, index) => (
                  <option key={index} value={status.name}>
                    {status.name}
                  </option>
                ))}
                {leadStatus.map((status, index) => (
                  !mockData.some(mock => mock.name === status.name) && (
                    <option key={`saved-${index}`} value={status.name}>
                      {status.name}
                    </option>
                  )
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lead Status Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Lead Status</h3>
          <div className="grid grid-cols-4 gap-4 text-gray-500 font-medium">
            <span>#</span>
            <span>NAME</span>
            <span>COLOR</span>
            <span>ACTION</span>
          </div>
          {leadStatus.map((status, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-2 items-center">
              <span>{index + 1}</span>

              {editingIndex === index ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{status.name}</span>
              )}

              {editingIndex === index ? (
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 p-1 border rounded"
                />
              ) : (
                <span
                  className="w-6 h-6 border rounded"
                  style={{ backgroundColor: status.color }}
                ></span>
              )}

              <div className="flex space-x-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => handleUpdate(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadStatus;