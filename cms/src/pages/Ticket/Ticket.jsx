// Ticket.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Button";
import Icon from "../../components/Icons";
import * as XLSX from 'xlsx';
import axios from "axios";

const Ticket = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [assignees, setAssignees] = useState([]); // Add assignees state
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [types, setTypes] = useState([]);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    assignee: "All", // Add assignee filter
    agent: "All",
    status: "All",
    priority: "All",
    channelName: "All",
    type: "All",
    tags: "All",
    startDate: "",
    endDate: "",
    search: "",
  });

  const apiBaseUrl = "http://localhost:8000/api/tickets/";

  const formatAgentDisplay = (agent) => {
    if (!agent) return "Unassigned";
    const name = agent.name || agent.email || "Unassigned";
    return agent.email ? `${name} (${agent.email})` : name;
  };

  const getAgentById = (agentId) => {
    return agents.find(agent => agent.id === agentId) || null;
  };

  const getRequesterDisplay = (ticket) => {
    if (ticket.assignee) {
      return `${ticket.assignee_name || "Unassigned"} (${ticket.assignee_email || ""})`;
    }
    return ticket.requester || "Unknown Requester";
  };

  const fetchData = async () => {
    try {
      console.log("Fetching ticket list data");
      const cacheBuster = `?_=${new Date().getTime()}`;
      const [ticketsRes, agentsRes, assigneesRes, typesRes, channelsRes] = await Promise.all([
        axios.get(`${apiBaseUrl}${cacheBuster}`),
        axios.get(`${apiBaseUrl}agents/${cacheBuster}`),
        axios.get(`${apiBaseUrl}assignees/${cacheBuster}`), // Fetch assignees
        axios.get(`${apiBaseUrl}types/${cacheBuster}`),
        axios.get(`${apiBaseUrl}channels/${cacheBuster}`),
      ]);
      console.log("Fetched assignees:", assigneesRes.data);
      let updatedTickets = ticketsRes.data;
      if (state?.updatedTicket) {
        updatedTickets = updatedTickets.map(ticket =>
          ticket.id === state.updatedTicket.id ? { ...ticket, ...state.updatedTicket } : ticket
        );
      }
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);
      setAgents(agentsRes.data);
      setAssignees(assigneesRes.data); // Set assignees
      setTypes(typesRes.data);
      setChannels(channelsRes.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (state?.refresh) {
      console.log("Refresh flag detected, re-fetching ticket data");
      fetchData();
    }
  }, [state]);

  const ticketStats = [
    { label: "Total Tickets", count: tickets.length, color: "bg-gray-500", info: "i" },
    { label: "Closed Tickets", count: tickets.filter(t => t.status === "Submit Close").length, color: "bg-green-500", info: "i" },
    { label: "Open Tickets", count: tickets.filter(t => t.status === "Submit Open").length, color: "bg-orange-500", info: "i" },
    { label: "Pending Tickets", count: tickets.filter(t => t.status === "Submit Pending").length, color: "bg-yellow-500", info: "i" },
    { label: "Resolved Tickets", count: tickets.filter(t => t.status === "Submit Resolved").length, color: "bg-blue-500", info: "i" },
  ];

  const handleFilterChange = (e, key) => {
    const value = e.target.value;
    console.log("Filter changed:", key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let filtered = [...tickets];
    console.log("Applying filters:", filters);
    if (filters.assignee !== "All") {
      filtered = filtered.filter(ticket => ticket.assignee_object_id === parseInt(filters.assignee));
    }
    if (filters.agent !== "All") {
      filtered = filtered.filter(ticket => ticket.agent === parseInt(filters.agent));
    }
    if (filters.status !== "All") {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    if (filters.priority !== "All") {
      filtered = filtered.filter(ticket => ticket.priority.toLowerCase() === filters.priority.toLowerCase());
    }
    if (filters.channelName !== "All") {
      filtered = filtered.filter(ticket => ticket.channel === parseInt(filters.channelName));
    }
    if (filters.type !== "All") {
      filtered = filtered.filter(ticket => ticket.type === parseInt(filters.type));
    }
    if (filters.tags !== "All") {
      filtered = filtered.filter(ticket => ticket.tags.includes(filters.tags));
    }
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return ticketDate >= startDate && ticketDate <= endDate;
      });
    }
    if (filters.search) {
      filtered = filtered.filter(ticket => {
        const assigneeDisplay = ticket.assignee_name || "Unassigned";
        return (
          ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
          assigneeDisplay.toLowerCase().includes(filters.search.toLowerCase()) ||
          (ticket.requester || "").toLowerCase().includes(filters.search.toLowerCase())
        );
      });
    }
    console.log("After filtering, tickets:", filtered.length);
    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [filters, tickets, assignees]);

  // Update downloadCSV to include assignee
  const downloadCSV = () => {
    const headers = ['TICKET #,SUBJECT,REQUESTER NAME,REQUESTED ON,STATUS,PRIORITY,TYPE,CHANNEL,TAGS,AGENT,ASSIGNEE'];
    const csvRows = filteredTickets.map(ticket => {
      const typeName = types.find(t => t.id === ticket.type)?.name || "N/A";
      const channelName = channels.find(c => c.id === ticket.channel)?.name || "N/A";
      const agent = getAgentById(ticket.agent);
      const agentDisplay = agent ? formatAgentDisplay(agent) : "Unassigned";
      const requesterName = getRequesterDisplay(ticket);
      const assigneeDisplay = ticket.assignee_name ? `${ticket.assignee_name} (${ticket.assignee_email || ""})` : "Unassigned";
      return `${ticket.id},"${ticket.subject}","${requesterName}","${ticket.created_at}","${ticket.status}","${ticket.priority}","${typeName}","${channelName}","${ticket.tags}","${agentDisplay}","${assigneeDisplay}"`;
    });
    const csvContent = headers.join('\n') + '\n' + csvRows.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  // Update downloadExcel to include assignee
  const downloadExcel = () => {
    const data = filteredTickets.map(ticket => {
      const agent = getAgentById(ticket.agent);
      const agentDisplay = agent ? formatAgentDisplay(agent) : "Unassigned";
      return {
        id: ticket.id,
        subject: ticket.subject,
        requester: getRequesterDisplay(ticket),
        requestedOn: ticket.created_at,
        status: ticket.status,
        priority: ticket.priority,
        type: types.find(t => t.id === ticket.type)?.name || "N/A",
        channel: channels.find(c => c.id === ticket.channel)?.name || "N/A",
        tags: ticket.tags,
        agent: agentDisplay,
        assignee: ticket.assignee_name ? `${ticket.assignee_name} (${ticket.assignee_email || ""})` : "Unassigned",
      };
    });
    const ws = XLSX.utils.json_to_sheet(data, { header: ['id', 'subject', 'requester', 'requestedOn', 'status', 'priority', 'type', 'channel', 'tags', 'agent', 'assignee'] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ticket Report');
    XLSX.writeFile(wb, 'ticket_report.xlsx');
    setShowExportOptions(false);
  };

  const handleExportClick = () => {
    setShowExportOptions(!showExportOptions);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await axios.delete(`${apiBaseUrl}${ticketId}/`, {
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      setFilteredTickets(filteredTickets.filter(ticket => ticket.id !== ticketId));
      alert("Ticket deleted successfully!");
    } catch (err) {
      setError("Failed to delete ticket: " + (err.response?.data?.message || err.message));
      console.error("Delete error:", err.response?.data || err);
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const navigateToTicketUI = (ticketId) => {
    console.log("Navigating to /ticket/" + ticketId);
    navigate(`/ticket/${ticketId}`);
  };

  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, filteredTickets.length);
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-12 gap-4">
        {/* Filters */}
        <div className="col-span-3 bg-gray-100 rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Filter Results</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-md font-medium text-gray-700">Select Date Range</label>
              <div className="flex space-x-1 mt-1">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange(e, 'startDate')}
                  className="border border-gray-300 rounded-md p-1 w-1/2 text-sm"
                />
                <span className="flex items-center">To</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange(e, 'endDate')}
                  className="border border-gray-300 rounded-md p-1 w-20 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Assignee</label>
              <select
                value={filters.assignee}
                onChange={(e) => handleFilterChange(e, 'assignee')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} ({assignee.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Agent</label>
              <select
                value={filters.agent}
                onChange={(e) => handleFilterChange(e, 'agent')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {formatAgentDisplay(agent)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange(e, 'status')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                <option value="Submit Open">Open</option>
                <option value="Submit Pending">Pending</option>
                <option value="Submit Resolved">Resolved</option>
                <option value="Submit Close">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange(e, 'priority')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Channel Name</label>
              <select
                value={filters.channelName}
                onChange={(e) => handleFilterChange(e, 'channelName')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>{channel.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange(e, 'type')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Tags</label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange(e, 'tags')}
                placeholder="Enter tags"
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              />
              <div className="flex gap-4 mt-4">
                <Button className="bg-green-500 text-black">Apply</Button>
                <Button
                  className="bg-gray-500 text-black"
                  onClick={() => setFilters({
                    assignee: "All",
                    agent: "All",
                    status: "All",
                    priority: "All",
                    channelName: "All",
                    type: "All",
                    tags: "All",
                    startDate: "",
                    endDate: "",
                    search: "",
                  })}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
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
            <div className="relative">
              <Button
                className="bg-gray-200 text-black"
                onClick={handleExportClick}
              >
                Export
              </Button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <button
                    onClick={downloadExcel}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Excel
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    CSV
                  </button>
                </div>
              )}
            </div>
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

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                className="border p-1 rounded-md text-sm"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
            <input
              type="text"
              placeholder="Search:"
              value={filters.search}
              onChange={(e) => handleFilterChange(e, 'search')}
              className="p-1 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Table */}
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
              {currentTickets.length > 0 ? (
                currentTickets.map((ticket) => {
                  const agent = getAgentById(ticket.agent);
                  const agentDisplay = agent ? formatAgentDisplay(agent) : "Unassigned";
                  const requesterDisplay = getRequesterDisplay(ticket);
                  
                  return (
                    <tr key={ticket.id} className="border-t">
                      <td className="p-1 text-sm">{ticket.id}</td>
                      <td className="p-1 text-sm">{ticket.subject}</td>
                      <td className="p-1 text-sm">{requesterDisplay}</td>
                      <td className="p-1 text-sm">{new Date(ticket.created_at).toLocaleString()}</td>
                      <td className="p-1 text-sm">
                        Status: <span className="text-orange-500">{ticket.status.replace("Submit ", "")}</span><br />
                        Priority: <span className="text-gray-600">{ticket.priority}</span><br />
                        Agent: <span className="text-gray-600">{agentDisplay}</span>
                      </td>
                      <td className="p-1 text-sm">
                        <div className="relative">
                          <button
                            className="bg-white p-1 rounded-md shadow flex items-center justify-center w-8 h-8"
                            onClick={() => {
                              console.log("Action button clicked for ticket ID:", ticket.id);
                              setOpenDropdown(openDropdown === ticket.id ? null : ticket.id);
                            }}
                          >
                            <span className="text-black text-lg">⚙️</span>
                          </button>
                          {openDropdown === ticket.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToTicketUI(ticket.id);
                                }}
                              >
                                <span className="mr-2">👁️</span> View
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Delete button clicked for ticket ID:", ticket.id);
                                  handleDelete(ticket.id);
                                }}
                              >
                                <span className="mr-2">❌</span> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-2 border-b text-center text-sm">
                    No tickets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-2 text-sm">
            <p>
              Showing {startIndex + 1} to {endIndex} of {filteredTickets.length} entries
            </p>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`p-1 border border-gray-300 rounded text-sm ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Previous
              </Button>
              <span className="text-sm">{currentPage}</span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-1 border border-gray-300 rounded text-sm ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
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

export default Ticket;