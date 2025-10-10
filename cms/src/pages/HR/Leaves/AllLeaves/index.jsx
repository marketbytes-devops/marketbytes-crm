import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";

const Leaves = () => {
  const navigate = useNavigate();
  const [pendingLeavesCount] = useState(6); // Example pending leaves count
  const [activeTab, setActiveTab] = useState("allLeaves");
  const [filter, setFilter] = useState({
    dateRange: { from: "2025-10-02", to: "2025-11-08" },
    employee: "All",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle tab switch
  const handleCalendar = () => {
    navigate("/hr/leaves/calendar");
  };

  // Handle assign leave navigation
  const handleAssignLeave = () => {
    navigate("/hr/leaves/assignleaves");
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle apply filter (placeholder)
  const handleApplyFilter = () => {
    console.log("Filter Applied:", filter);
    // Add filter logic here
  };

  // Pagination handlers (no data, so disabled)
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    // No data, so no next page
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex">
      {/* Filter Sidebar */}
      <div className="w-1/4 pr-4 ">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Results</h2>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Select Date Range
            </label>
            <div className="flex space-x-2 w-20 h-10">
              <InputField
                type="date"
                name="dateRange.from"
                value={filter.dateRange.from}
                onChange={handleFilterChange}
                className="w-1/2"
              />
           
              <InputField
                type="date"
                name="dateRange.to"
                value={filter.dateRange.to}
                onChange={handleFilterChange}
                className="w-1/2"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Employee Name
            </label>
            <InputField
              type="text"
              name="employee"
              value={filter.employee}
              onChange={handleFilterChange}
              placeholder="All"
              className="w-full"
            />
          </div>
          <Button
            className="bg-green-500 text-white hover:bg-green-600 w-full py-2 rounded"
            onClick={handleApplyFilter}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:text-gray-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-700">Leaves</h1>
            <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingLeavesCount} Pending Leaves
            </span>
          </div>
          <div className="flex space-x-2">
           
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "calendarView"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={ handleCalendar}
            >
              Calendar View
            </button>
            <Button
              className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
              onClick={handleAssignLeave}
            >
              + Assign Leave
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <InputField
                type="number"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="w-20"
                placeholder="Show"
              />
              <span>entries</span>
            </div>
            <InputField
              type="text"
              placeholder="Search:"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-2 text-sm">#</th>
                <th className="p-2 text-sm">EMPLOYEE</th>
                <th className="p-2 text-sm">LEAVE DATE</th>
                <th className="p-2 text-sm">LEAVE STATUS</th>
                <th className="p-2 text-sm">LEAVE TYPE</th>
                <th className="p-2 text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex space-x-2">
              <Button
                className="p-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                className="p-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100"
                onClick={handleNext}
                disabled={true} // No data, so disable Next
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;