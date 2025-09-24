import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Icon from "../../components/Icons";

const Ticket = () => {
  const navigate = useNavigate();

  const ticketStats = [
    { label: "Total Tickets", count: 1, color: "bg-gray-500", info: "i" },
    { label: "Closed Tickets", count: 0, color: "bg-green-500", info: "i" },
    { label: "Open Tickets", count: 1, color: "bg-orange-500", info: "i" },
    { label: "Pending Tickets", count: 0, color: "bg-yellow-500", info: "i" },
    { label: "Resolved Tickets", count: 0, color: "bg-blue-500", info: "i" },
  ];

  const filters = {
    agent: "All",
    status: "All",
    priority: "All",
    channelName: "All",
    type: "All",
    tags: "All",
  };

  const tickets = [
    {
      id: 1,
      subject: "Test",
      requester: "sree",
      requestedOn: "18-07-2025 01:25 PM",
      status: "open",
      priority: "medium",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>

      {/* Grid Container */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column (Filters) */}
        <div className="col-span-3 bg-gray-100 rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Filter Results</h2>
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-md font-medium text-gray-700">Select Date Range</label>
              <div className="flex space-x-1 mt-1">
                <input
                  type="date"
                  defaultValue="2025-07-18"
                  className="border border-gray-300 rounded-md p-1 w-1/2 text-sm"
                />
                <span className="flex items-center">To</span>
                <input
                  type="date"
                  defaultValue="2025-09-22"
                  className="border border-gray-300 rounded-md p-1 w-20 text-sm"
                />
              </div>
            </div>
            {/* Other Filters */}
            <div>
              <label className="block text-md font-medium text-gray-700">Agent</label>
              <select
                value={filters.agent}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Priority</label>
              <select
                value={filters.priority}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Channel Name</label>
              <select
                value={filters.channelName}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Type</label>
              <select
                value={filters.type}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Tags</label>
              <select
                value={filters.tags}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option>All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-9">
          {/* Buttons on top right */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              className="bg-gray-200 text-black"
              onClick={() => navigate("/ticketsettings/ticketagent")}
            >
              Ticket Settings
            </Button>
            <Button
              className="bg-gray-200 text-black"
              onClick={() => navigate("/ticket/create")}
            >
              Create Ticket
            </Button>
            <Button className="bg-gray-200 text-black">Export</Button>
          </div>

          {/* Ticket Stats */}
          <div className="flex justify-around mb-4">
            {ticketStats.map((stat, index) => (
              <div key={index} className="text-center">
                <Icon>
                  <span
                    className={`text-white ${stat.color} rounded-full w-8 h-8 flex items-center justify-center`}
                  >
                    {stat.count}
                  </span>
                </Icon>
                <p className="text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="flex justify-between mb-2">
            <select className="p-1 border border-gray-300 rounded-md text-sm">
              <option>Show 10 entries</option>
            </select>
            <input
              type="text"
              placeholder="Search:"
              className="p-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 text-left text-sm">TICKET #</th>
                <th className="p-1 text-left text-sm">SUBJECT</th>
                <th className="p-1 text-left text-sm">REQUESTER NAME</th>
                <th className="p-1 text-left text-sm">REQUESTED ON</th>
                <th className="p-1 text-left text-sm">OTHERS</th>
                <th className="p-1 text-left text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="p-1 text-sm">{ticket.id}</td>
                  <td className="p-1 text-sm">{ticket.subject}</td>
                  <td className="p-1 text-sm">{ticket.requester}</td>
                  <td className="p-1 text-sm">{ticket.requestedOn}</td>
                  <td className="p-1 text-sm">
                    Status:{" "}
                    <span className="text-orange-500">{ticket.status}</span>
                    <br />
                    Priority:{" "}
                    <span className="text-gray-600">{ticket.priority}</span>
                  </td>
                  <td className="p-1 text-sm">
                    <button className="text-gray-500">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-2 text-sm">
            <p>Showing 1 to 1 of 1 entries</p>
            <div className="space-x-1">
              <button className="p-1 border border-gray-300 rounded text-sm">
                Previous
              </button>
              <span>1</span>
              <button className="p-1 border border-gray-300 rounded text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
