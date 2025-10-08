import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const TicketForm = () => {
  const [ticketSubject, setTicketSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeType, setAssigneeType] = useState("");
  const [agent, setAgent] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("Low");
  const [channel, setChannel] = useState("");
  const [tags, setTags] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [agents, setAgents] = useState([]);
  const [types, setTypes] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("Submit Open");
  const apiBaseUrl = "http://localhost:8000/api/tickets/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assigneesRes, agentsRes, typesRes, channelsRes] = await Promise.all([
          axios.get(`${apiBaseUrl}assignees/`),
          axios.get(`${apiBaseUrl}agents/`),
          axios.get(`${apiBaseUrl}types/`),
          axios.get(`${apiBaseUrl}channels/`),
        ]);
        console.log('Assignees:', assigneesRes.data);
        console.log('Agents:', agentsRes.data);
        console.log('Types:', typesRes.data);
        console.log('Channels:', channelsRes.data);
        setAssignees(assigneesRes.data);
        setAgents(agentsRes.data);
        setTypes(typesRes.data);
        setChannels(channelsRes.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!ticketSubject.trim()) {
      setError("Ticket subject is required.");
      return;
    }
    if (!ticketDescription.trim()) {
      setError("Ticket description is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required in YYYY-MM-DD format.");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      setError("Due date must be in YYYY-MM-DD format.");
      return;
    }

    try {
      const ticketData = {
        subject: ticketSubject,
        description: ticketDescription,
        due_date: dueDate,
        assignee_id: assignee ? parseInt(assignee) : null,
        assignee_type: assigneeType || null,
        agent: agent ? parseInt(agent) : null,
        type: type ? parseInt(type) : null,
        priority,
        channel: channel ? parseInt(channel) : null,
        tags,
        status: submitStatus,
      };
      const response = await axios.post(apiBaseUrl, ticketData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      console.log('Success:', response.data);
      alert("Ticket created successfully!");
      setTicketSubject("");
      setDueDate("");
      setTicketDescription("");
      setAssignee("");
      setAssigneeType("");
      setAgent("");
      setType("");
      setPriority("Low");
      setChannel("");
      setTags("");
      setSubmitStatus("Submit Open");
      setError("");
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.keys(errors).map((key) => `${key}: ${errors[key].join(', ')}`);
        setError(`Failed to create ticket: ${errorMessages.join('; ')}`);
      } else {
        setError("Failed to create ticket: " + err.message);
      }
    }
  };

  const handleAddType = async () => {
    if (!newType) {
      setError("Ticket type is required");
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}add_type/`, { type: newType });
      console.log('New Type:', response.data);
      setTypes([...types, response.data]);
      setNewType("");
      closeTypeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add ticket type");
    }
  };

  const handleAddChannel = async () => {
    if (!newChannel) {
      setError("Channel name is required");
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}add_channel/`, { name: newChannel });
      console.log('New Channel:', response.data);
      setChannels([...channels, response.data]);
      setNewChannel("");
      closeChannelModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add channel");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openTypeModal = () => setIsTypeModalOpen(true);
  const closeTypeModal = () => setIsTypeModalOpen(false);
  const openChannelModal = () => setIsChannelModalOpen(true);
  const closeChannelModal = () => setIsChannelModalOpen(false);

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

  return (
    <div className="flex min-h-screen bg-gray-50 p-0">
      <div className="bg-white shadow-md rounded-lg p-4 space-y-6 w-1/4">
        <div>
          <label className="block text-sm font-semibold mb-2">Ticket Assignee Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={assignee}
            onChange={(e) => {
              const selectedAssignee = assignees.find(a => a.id === parseInt(e.target.value));
              setAssignee(e.target.value);
              setAssigneeType(selectedAssignee ? selectedAssignee.type : "");
            }}
          >
            <option value="">Select Ticket Assignee...</option>
            {assignees.map((a) => (
              <option key={`${a.type}-${a.id}`} value={a.id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Agent</label>
          <div className="flex items-center gap-2">
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
            >
              <option value="">Agent not assigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
            <Button
              className="border border-blue-500 text-blue-500 rounded px-2 py-1 text-xs"
              onClick={openModal}
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Type</label>
          <div className="flex items-center gap-2">
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type...</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Button
              className="border border-blue-500 text-blue-500 rounded px-2 py-1 text-xs whitespace-nowrap"
              onClick={openTypeModal}
            >
              + Add Type
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Priority *</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Channel Name</label>
          <div className="flex items-center gap-2">
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="">Select Channel...</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button
              className="border border-blue-500 text-blue-500 rounded px-2 py-1 text-xs whitespace-nowrap"
              onClick={openChannelModal}
            >
              + Add Channel
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Tags</label>
          <InputField
            type="text"
            placeholder="Enter tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 ml-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tickets</h2>
          <span className="text-blue-500 font-bold">TICKET # 7</span>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Ticket Subject *</label>
            <InputField
              type="text"
              placeholder="Enter subject"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Due Date *</label>
            <InputField
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Ticket Description *</label>
          <ReactQuill
            value={ticketDescription}
            onChange={setTicketDescription}
            placeholder="Enter description..."
            className="h-40"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>
        <div className="mt-12">
          <label className="block text-sm font-semibold mb-2">Submit Status</label>
          <div className="space-y-2">
            <label className="flex text-xs items-center">
              <input
                type="radio"
                name="submitStatus"
                value="Submit Open"
                checked={submitStatus === "Submit Open"}
                onChange={(e) => setSubmitStatus(e.target.value)}
                className="mr-2"
              />
              Submit Open
            </label>
            <label className="flex text-xs items-center">
              <input
                type="radio"
                name="submitStatus"
                value="Submit Pending"
                checked={submitStatus === "Submit Pending"}
                onChange={(e) => setSubmitStatus(e.target.value)}
                className="mr-2"
              />
              Submit Pending
            </label>
            <label className="flex text-xs items-center">
              <input
                type="radio"
                name="submitStatus"
                value="Submit Resolved"
                checked={submitStatus === "Submit Resolved"}
                onChange={(e) => setSubmitStatus(e.target.value)}
                className="mr-2"
              />
              Submit Resolved
            </label>
            <label className="flex text-xs items-center">
              <input
                type="radio"
                name="submitStatus"
                value="Submit Close"
                checked={submitStatus === "Submit Close"}
                onChange={(e) => setSubmitStatus(e.target.value)}
                className="mr-2"
              />
              Submit Close
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white rounded px-3 py-1 text-xs hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!ticketSubject.trim() || !ticketDescription.trim() || !dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)}
          >
            Submit ✓
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg shadow-lg w-96 mx-4">
            <div className="flex justify-between items-center bg-blue-500 border-b p-4">
              <h3 className="text-lg text-white font-semibold">Add New Agents</h3>
              <button
                className="text-white hover:text-gray-200 text-xl font-bold"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Choose Agents *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                >
                  <option value="">Choose Agents</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 border-t p-4">
              <button
                className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-50"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600"
                onClick={closeModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isTypeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg shadow-lg w-96 mx-4">
            <div className="flex justify-between items-center border-b p-4 bg-blue-500 text-white">
              <h3 className="text-lg font-semibold">Add New Ticket Type</h3>
              <button
                className="text-white hover:text-gray-200 text-xl font-bold"
                onClick={closeTypeModal}
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Ticket Type</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  type="text"
                  placeholder="Enter ticket type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 border-t p-4">
              <button
                className="bg-green-500 text-white rounded px-4 py-2 text-sm hover:bg-green-600"
                onClick={handleAddType}
              >
                ✓ Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isChannelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg shadow-lg w-96 mx-4">
            <div className="flex justify-between items-center border-b p-4 bg-blue-500 text-white">
              <h3 className="text-lg font-semibold">Add New Ticket Channel</h3>
              <button
                className="text-white hover:text-gray-200 text-xl font-bold"
                onClick={closeChannelModal}
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Channel Name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  type="text"
                  placeholder="Enter channel name"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 border-t p-4">
              <button
                className="bg-green-500 text-white rounded px-4 py-2 text-sm hover:bg-green-600"
                onClick={handleAddChannel}
              >
                ✓ Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketForm;