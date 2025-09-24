import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputField from "../../components/InputField"; 
import Dropdown from "../../components/Dropdown";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    requester: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add ticket creation logic here (e.g., API call)
    navigate("/ticket/ticketpage");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Create Ticket</h1>

      {/* Filter Results and Main Content */}
      <div className="grid grid-cols-4 gap-4">
      
   {/* Filter Section (Left) */}
<div className="col-span-1 bg-gray-100 rounded-lg shadow p-4 space-y-6">
  <h2 className="text-lg font-medium mb-4">Filter Results</h2>

  {/* Date Range */}
  <div>
    <label className="block text-md font-medium text-gray-700 mb-1">Select Date Range</label>
    <div className="flex space-x-1 w-20 h-10">
      <InputField
        type="date"
        value={formData.dateStart || "2025-07-18"}
        onChange={(e) => handleChange({ target: { name: "dateStart", value: e.target.value } })}
        
      />
      <span className="flex items-center">To</span>
      <InputField
        type="date"
        value={formData.dateEnd || "2025-09-22"}
        onChange={(e) => handleChange({ target: { name: "dateEnd", value: e.target.value } })}
             
      />
    </div>
  </div>

  {/* Agent (Dropdown) */}
  <div>
    <label className="block text-md font-medium text-gray-700 mb-1">Agent</label>
    <Dropdown
      triggerText={formData.agent || "Select Agent"}
      onApply={() => console.log("Agent applied")}
    >
      <div className="space-y-2">
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, agent: "Agent 1" }))}
        >
          Agent 1
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, agent: "Agent 2" }))}
        >
          Agent 2
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, agent: "Agent 3" }))}
        >
          Agent 3
        </div>
      </div>
    </Dropdown>
  </div>

  {/* Status (Dropdown) */}
  <div>
    <label className="block text-md font-medium text-gray-700 mb-1">Status</label>
    <Dropdown
      triggerText={formData.status || "Select Status"}
      onApply={() => console.log("Status applied")}
    >
      <div className="space-y-2">
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, status: "Open" }))}
        >
          Open
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, status: "In Progress" }))}
        >
          In Progress
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, status: "Closed" }))}
        >
          Closed
        </div>
      </div>
    </Dropdown>
  </div>

  {/* Priority (Dropdown) */}
  <div>
    <label className="block text-md font-medium text-gray-700 mb-1">Priority</label>
    <Dropdown
      triggerText={formData.priority || "Select Priority"}
      onApply={() => console.log("Priority applied")}
    >
      <div className="space-y-2">
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, priority: "Low" }))}
        >
          Low
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, priority: "Medium" }))}
        >
          Medium
        </div>
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setFormData((prev) => ({ ...prev, priority: "High" }))}
        >
          High
        </div>
      </div>
    </Dropdown>
  </div>
</div>


        {/* Form Section (Right) */}
        <div className="col-span-3">
          <div className="mb-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-md font-medium text-gray-700">Subject</label>
                <InputField
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange({ target: { name: "subject", value: e.target.value } })}
                  placeholder="Enter ticket subject"
                  required
                />
              </div>

              {/* Requester */}
              <div>
                <label className="block text-md font-medium text-gray-700">Requester</label>
                <InputField
                  type="text"
                  value={formData.requester}
                  onChange={(e) => handleChange({ target: { name: "requester", value: e.target.value } })}
                  placeholder="Enter requester name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-md font-medium text-gray-700">Description</label>
                <InputField
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange({ target: { name: "description", value: e.target.value } })}
                  placeholder="Enter ticket description"
                  required
                  maxLength={500} // Example max length for description
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-md font-medium text-gray-700">Priority</label>
                <InputField
                  type="text"
                  value={formData.priority || ""}
                  onChange={(e) => handleChange({ target: { name: "priority", value: e.target.value } })}
                  placeholder="Select priority"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-md font-medium text-gray-700">Status</label>
                <InputField
                  type="text"
                  value={formData.status || ""}
                  onChange={(e) => handleChange({ target: { name: "status", value: e.target.value } })}
                  placeholder="Select status"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button className="bg-green-500 text-white" type="submit">
                  Create Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;