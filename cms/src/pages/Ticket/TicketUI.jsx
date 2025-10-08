import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const TicketUI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("TicketUI rendered with ID:", id, "State:", state);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agents, setAgents] = useState([]);
  const [types, setTypes] = useState([]);
  const [channels, setChannels] = useState([]);

  // Function to format agent display name - extract name from email or use provided name
  const formatAgentDisplay = (agent) => {
    if (!agent) return "";
    
    // If agent name is just an email, extract the username part as the name
    if (agent.name && agent.name.includes('@')) {
      const email = agent.name;
      const namePart = email.split('@')[0];
      // Capitalize first letter of name
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      return `${displayName} (${email})`;
    }
    
    // If agent has separate name and email, use both
    if (agent.name && agent.email) {
      return `${agent.name} (${agent.email})`;
    }
    
    // Fallback to just name or email
    return agent.name || agent.email || "";
  };

  // Function to extract name from email for display purposes
  const extractNameFromEmail = (email) => {
    if (!email) return "";
    if (email.includes('@')) {
      const namePart = email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return email;
  };

  // Get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Fetch dropdown data first
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [agentsRes, typesRes, channelsRes] = await Promise.all([
          fetch("http://localhost:8000/api/tickets/agents/").then(res => res.json()),
          fetch("http://localhost:8000/api/tickets/types/").then(res => res.json()),
          fetch("http://localhost:8000/api/tickets/channels/").then(res => res.json()),
        ]);
        console.log("Fetched dropdown data:", { agents: agentsRes, types: typesRes, channels: channelsRes });
        setAgents(agentsRes || []);
        setTypes(typesRes || []);
        setChannels(channelsRes || []);
      } catch (err) {
        setError(err.message);
        console.error("Dropdown data fetch error:", err);
      }
    };
    fetchDropdownData();
  }, []);

  // Fetch ticket data after dropdown data is loaded
  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching ticket data for ID:", id);
        const response = await fetch(`http://localhost:8000/api/tickets/${id}/`);
        if (!response.ok) throw new Error(`Failed to fetch ticket: ${response.status}`);
        const data = await response.json();
        console.log("Fetched ticket data:", JSON.stringify(data, null, 2));
        
        // Get agent details for display
        const agent = agents.find(a => a.id === data.agent);
        const agentDisplay = agent ? formatAgentDisplay(agent) : "---";
        
        console.log("Formatted agent display:", agentDisplay);
        setTicket({
          agentId: data.agent || null,
          agent: agentDisplay,
          typeId: data.type || null,
          type: data.type ? types.find(t => t.id === data.type)?.name || "" : "",
          priority: data.priority || "Low",
          channelId: data.channel || null,
          channelName: data.channel ? channels.find(c => c.id === data.channel)?.name || "" : "",
          tags: data.tags ? data.tags.split(",").filter(tag => tag) : [],
          subject: data.subject || "",
          description: data.description || "",
          createdAt: data.created_at
            ? new Date(data.created_at).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" })
            : "",
          requester: data.requester || "",
          attachment: data.attachment || "",
          status: data.status || "Submit Open",
          due_date: data.due_date || null,
        });
      } catch (err) {
        setError(err.message);
        console.error("Ticket fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch ticket if agents are loaded (to properly format agent name)
    if (agents.length > 0) {
      fetchTicket();
    }
  }, [id, agents, types, channels]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() && ticket) {
      const newTags = [...ticket.tags, e.target.value.trim()];
      console.log("Adding tag, new tags:", newTags);
      setTicket({ ...ticket, tags: newTags });
      e.target.value = "";
    }
  };

  const handleRemoveTag = (index) => {
    if (ticket) {
      const newTags = ticket.tags.filter((_, i) => i !== index);
      console.log("Removing tag, new tags:", newTags);
      setTicket({ ...ticket, tags: newTags });
    }
  };

  const handleInputChange = (field, value) => {
    if (ticket) {
      console.log("Input changed:", field, value);
      const updatedTicket = { ...ticket, [field]: value };
      
      if (field === "agent") {
        const selectedAgent = agents.find(agent => agent.id === parseInt(value));
        updatedTicket.agentId = selectedAgent ? selectedAgent.id : null;
        updatedTicket.agent = selectedAgent ? formatAgentDisplay(selectedAgent) : "";
        console.log("Selected agent:", selectedAgent, "Updated agentId:", updatedTicket.agentId);
      }
      
      if (field === "type") {
        const selectedType = types.find(type => type.name === value);
        updatedTicket.typeId = selectedType ? selectedType.id : null;
      }
      
      if (field === "channelName") {
        const selectedChannel = channels.find(channel => channel.name === value);
        updatedTicket.channelId = selectedChannel ? selectedChannel.id : null;
      }
      
      setTicket(updatedTicket);
    }
  };

  const updateTicket = async (updatedData) => {
    try {
      // Match backend field names exactly
      const requestData = {
        agent: updatedData.agentId ?? ticket.agentId,
        type: updatedData.typeId ?? ticket.typeId,
        channel: updatedData.channelId ?? ticket.channelId,
        priority: updatedData.priority ?? ticket.priority,
        tags: updatedData.tags ?? ticket.tags.join(","),
        subject: updatedData.subject ?? ticket.subject,
        description: updatedData.description ?? ticket.description,
        status: updatedData.status ?? ticket.status,
        due_date: updatedData.due_date ?? ticket.due_date,
      };
      console.log("Updating ticket with ID:", id, "Request Data:", JSON.stringify(requestData, null, 2));
      const response = await fetch(`http://localhost:8000/api/tickets/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(requestData),
      });
      const responseText = await response.text(); // Get raw response for debugging
      console.log("PUT response status:", response.status, "Response Text:", responseText);
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = responseText;
        }
        const errorMessages = typeof errorData === "object"
          ? Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
              .join("; ")
          : errorData;
        throw new Error(errorMessages || `Failed to update ticket: ${response.status}`);
      }
      const data = JSON.parse(responseText);
      console.log("Ticket updated successfully, Response Data:", JSON.stringify(data, null, 2));
      
      // Get the updated agent details for proper display in Ticket page
      const updatedAgent = agents.find(a => a.id === data.agent);
      const agentDisplayName = updatedAgent ? formatAgentDisplay(updatedAgent) : "Unassigned";
      
      // Pass updated ticket data to Ticket.js with proper agent information
      navigate("/ticket/ticketpage", { 
        state: { 
          refresh: true, 
          updatedTicket: { 
            id: parseInt(id), 
            ...data, 
            assignee_name: agentDisplayName,
            agent: data.agent 
          } 
        } 
      });
    } catch (err) {
      setError(err.message);
      console.error("Update ticket error:", err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ticket?") && ticket) {
      try {
        console.log("Deleting ticket with ID:", id);
        const response = await fetch(`http://localhost:8000/api/tickets/${id}/`, {
          method: "DELETE",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        });
        if (!response.ok) throw new Error("Failed to delete ticket");
        console.log("Ticket deleted successfully");
        navigate("/ticket/ticketpage", { state: { refresh: true } });
      } catch (err) {
        setError(err.message);
        console.error("Delete ticket error:", err);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!ticket) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select
              value={ticket.agentId || ""}
              onChange={(e) => handleInputChange("agent", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {formatAgentDisplay(agent)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={ticket.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              value={ticket.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Priority</option>
              {["Low", "Medium", "High"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
            <select
              value={ticket.channelName}
              onChange={(e) => handleInputChange("channelName", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Channel</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.name}>
                  {channel.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={ticket.due_date || ""}
              onChange={(e) => handleInputChange("due_date", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ticket.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <InputField
              type="text"
              placeholder=""
              value=""
              onChange={() => {}}
              onKeyDown={handleAddTag}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white w-full"
              onClick={() => updateTicket({
                agentId: ticket.agentId,
                typeId: ticket.typeId,
                channelId: ticket.channelId,
                priority: ticket.priority,
                tags: ticket.tags.join(","),
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
                due_date: ticket.due_date,
              })}
            >
              Save
            </Button>
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-white w-full"
              onClick={() => navigate("/ticket/ticketpage")}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Tickets</h1>
          <span
            className={`bg-${ticket.status === "Submit Open" ? "orange" : "green"}-100 text-${
              ticket.status === "Submit Open" ? "orange" : "green"
            }-800 text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {ticket.status.replace("Submit ", "")}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-1">{ticket.subject}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {ticket.createdAt} · {ticket.requester}
          </p>
          <div className="flex items-start space-x-3 mb-4">
            <img
              src="https://via.placeholder.com/32?text=AR"
              alt={ticket.requester.split(" ")[0]}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {ticket.requester} {ticket.createdAt}
              </p>
              <InputField
                type="text"
                value={ticket.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-4">
            <a href="#" className="text-sm text-blue-600">
              {ticket.attachment}
            </a>
            <div className="flex space-x-2">
              <button className="text-blue-500 hover:text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6">2 months ago</p>
          <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

TicketUI.propTypes = {};

export default TicketUI;