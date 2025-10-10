import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";

const Leaves = () => {
  const navigate = useNavigate();
  const [pendingLeavesCount] = useState(6); // Example pending leaves count
  const [activeTab, setActiveTab] = useState("allLeaves");

  const leaveRequests = [
    {
      id: 1,
      user: "Aravind N",
      date: "10-03-2025 (Monday)",
      remainingLeaves: 18,
      reason: "I am going to home so i did not able to come on Monday",
      approvalStatus: "Pending",
    },
    {
      id: 2,
      user: "User",
      date: "04-04-2025 (Friday)",
      remainingLeaves: 18,
      reason: "going to temple",
      approvalStatus: "Pending",
    },
    {
      id: 3,
      user: "User",
      date: "07-05-2025 (Wednesday)",
      remainingLeaves: 18,
      reason: "Family Trip",
      approvalStatus: "Pending",
    },
    {
      id: 4,
      user: "User",
      date: "08-05-2025 (Thursday)",
      remainingLeaves: 18,
      reason: "Exam",
      approvalStatus: "Pending",
    },
    {
      id: 5,
      user: "User",
      date: "09-05-2025 (Friday)",
      remainingLeaves: 18,
      reason: "Personal Work",
      approvalStatus: "Pending",
    },
    {
      id: 6,
      user: "User",
      date: "10-05-2025 (Saturday)",
      remainingLeaves: 18,
      reason: "Medical Checkup",
      approvalStatus: "Pending",
    },
  ];

  // Handle tab switch and navigation
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "allLeaves") {
      navigate("/hr/leaves/allleaves");
    } else if (tab === "calendarView") {
      // Optionally navigate to a calendar view route, e.g., "/hr/leaves/calendar"
      navigate("/hr/leaves/calendar");
    }
  };

  // Handle assign leave navigation
  const handleAssignLeave = () => {
    navigate("/hr/leaves/assignleaves");
  };

  // Handle accept/reject actions (placeholder)
  const handleAction = (id, action) => {
    console.log(`Leave ${id} ${action}ed`);
    // Add API call or state update logic here
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
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
              activeTab === "allLeaves"
                ? "bg-gray-200 text-gray-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => handleTabSwitch("allLeaves")}
          >
            All Leaves
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "calendarView"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => handleTabSwitch("calendarView")}
          >
            Calendar View
          </button>
          <Button
            className="bg-gray-200 text-gray-600 hover:bg-green-600 px-4 py-2 rounded"
            onClick={handleAssignLeave}
          >
            + Assign Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-gray-700 font-semibold">
                Casual Leave Request
              </h2>
            </div>
            <p className="text-gray-600 mb-1">{request.user}</p>
            <div className="bg-gray-100 p-2 mb-2 rounded">
              <p className="text-gray-700 font-medium">{request.date}</p>
              <p className="text-gray-500 text-sm">
                {request.remainingLeaves} Remaining Leaves
              </p>
            </div>
            <p className="text-gray-600 mb-2">Reason</p>
            <p className="text-gray-700 mb-2">{request.reason}</p>
            <p className="text-yellow-600 mb-2">TL Approval: {request.approvalStatus}</p>
            <div className="flex space-x-2">
              <Button
                className="bg-green-500 text-white hover:bg-green-600 px-2 py-1 rounded text-sm"
                onClick={() => handleAction(request.id, "accept")}
              >
                ✓ Accept
              </Button>
              <Button
                className="bg-red-400 text-white hover:bg-red-500 px-2 py-1 rounded text-sm"
                onClick={() => handleAction(request.id, "reject")}
              >
                ✗ Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaves;