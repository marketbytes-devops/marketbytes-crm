import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";

const OverTimeWork = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Handle navigation to add overtime work page
  const handleAddOverTimeWork = () => {
    navigate("/hr/overtimework/overtimecreate");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">Over Time Work</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <input type="checkbox" id="overtime-work-filter" className="mr-2" />
          <label htmlFor="overtime-work-filter" className="text-gray-600">
            Over Time Work
          </label>
       </div>
        <div className="flex items-center space-x-4">
          <InputField
            type="text"
            placeholder="Search:"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-2 text-left text-sm">ID</th>
            <th className="p-2 text-left text-sm">EMPLOYEE</th>
            <th className="p-2 text-left text-sm">PROJECT</th>
            <th className="p-2 text-left text-sm">DATE</th>
            <th className="p-2 text-left text-sm">HOURS</th>
            <th className="p-2 text-left text-sm">EFFORT</th>
            <th className="p-2 text-left text-sm">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="p-4 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <span>No Overtime Work</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4  text-center">
        <Button
          className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
          onClick={handleAddOverTimeWork}
        >
          Add Over Time Work +
        </Button>
      </div>
    </div>
  );
};

export default OverTimeWork;