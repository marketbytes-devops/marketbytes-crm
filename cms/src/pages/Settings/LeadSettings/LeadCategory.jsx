import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CogIcon, Edit2, Trash2 } from 'lucide-react';
import LeadSidebar from '../LeadSettings/LeadSidebar';

const LeadCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [leadCategory, setLeadCategory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    if (!selectedCategory.trim()) {
      alert('Lead Category is required!');
      return;
    }
    setLeadCategory([...leadCategory, selectedCategory]);
    setSelectedCategory('');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(leadCategory[index]);
  };

  const handleUpdate = (index) => {
    if (!editingValue.trim()) {
      alert('Lead Category cannot be empty!');
      return;
    }
    const updatedCategory = [...leadCategory];
    updatedCategory[index] = editingValue;
    setLeadCategory(updatedCategory);
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleRemove = (index) => {
    if (window.confirm('Are you sure you want to remove this Lead Category?')) {
      const updatedCategory = leadCategory.filter((_, i) => i !== index);
      setLeadCategory(updatedCategory);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <LeadSidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CogIcon className="w-6 h-6 mr-2 text-gray-600" />
            Lead Category
          </h2>

          <div className="space-y-4">
            <div>Add New Lead Category</div>
            <div>
              <label className="block mt-4 text-sm font-bold text-gray-700 mb-1">
                Lead Category *
              </label>
              <InputField
                type="text"
                placeholder="Enter Lead Source *"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              />
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
          </div>
        </div>

        {/* Lead Source Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Lead Source</h3>
          <div className="grid grid-cols-4 gap-4 text-gray-500 font-medium">
            <span>#</span>
            <span>NAME</span>
            <span>ACTION</span>
          </div>
          {leadCategory.map((source, index) => (
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
                <span>{source}</span>
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

export default LeadCategory;
