import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";

const AddOverTimeWork = () => {
  const [formData, setFormData] = useState({
    employee: "",
    project: "",
    date: "",
    hours: "",
    effort: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault();
    // Add save logic here (e.g., API call)
    console.log("Form Data Saved:", formData);
    navigate("/hr/overtimework"); // Navigate back to overtime work list
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/hr/overtimework");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-gray-200 p-2 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">ADD OVER TIME WORK</h1>
      </div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Employee <span className="text-red-500">*</span>
          </label>
          <InputField
            type="text"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            placeholder="Select Employee"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Project <span className="text-red-500">*</span>
          </label>
          <InputField
            type="text"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Select Project"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <InputField
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hours <span className="text-red-500">*</span>
          </label>
          <InputField
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            placeholder="Enter Hours"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Effort <span className="text-red-500">*</span>
          </label>
          <InputField
            type="text"
            name="effort"
            value={formData.effort}
            onChange={handleChange}
            placeholder="Enter Effort"
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-6">
          <Button
            type="submit"
            className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
          >
            Save
          </Button>
          <Button
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOverTimeWork;