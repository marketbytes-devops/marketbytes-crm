import React, { useState } from 'react';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';

const DepartmentForm = () => {
  const [formData, setFormData] = useState({
    department: '',
    worksheetUrl: '',
    serviceText: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">👤</span> Department
      </div>
      <div className="bg-gray-200 p-4 rounded mb-6">ADD DEPARTMENT</div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <InputField
            type="text"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            name="department"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Worksheet URL <span className="text-red-500">*</span>
          </label>
          <InputField
            type="url"
            placeholder="Worksheet URL"
            value={formData.worksheetUrl}
            onChange={handleChange}
            name="worksheetUrl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Service Text <span className="text-red-500">*</span>
          </label>
          <InputField
            type="text"
            placeholder="Service Text"
            value={formData.serviceText}
            onChange={handleChange}
            name="serviceText"
          />
        </div>
        <div className="flex space-x-4">
          <Button className="bg-green-500 text-white hover:bg-green-600 px-4 py-2" onClick={() => alert('Save clicked')}>
            Save
          </Button>
          <Button className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2" onClick={() => alert('Back clicked')}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;