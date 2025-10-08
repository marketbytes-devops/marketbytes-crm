import React, { useState, useEffect } from "react";
import { Download, Settings, Ticket } from "lucide-react";
import Card from "../../../components/Card";
import Title from "../../../components/Title";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/Dropdown";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

const TicketDashboard = () => {
  const navigate = useNavigate();
  const [widgetSettings, setWidgetSettings] = useState({
    unresolvedTickets: true,
    unassignedTickets: true,
    typeWise: true,
    statusWise: true,
    channelWise: true,
    newTickets: true,
  });
  const [ticketData, setTicketData] = useState({
    types: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    status: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    channel: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    unresolved: 0,
    unassigned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ticket data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const baseURL = "http://localhost:8000"; // Adjust to your backend URL
      try {
        const [typesResp, statusResp, channelResp, statsResp] = await Promise.all([
          axios.get(`${baseURL}/api/tickets/types/`),
          axios.get(`${baseURL}/api/tickets/status/`),
          axios.get(`${baseURL}/api/tickets/channels/`),
          axios.get(`${baseURL}/api/tickets/stats/`),
        ]);

        console.log("Raw Types Data:", typesResp.data);
        console.log("Raw Status Data:", statusResp.data);
        console.log("Raw Channel Data:", channelResp.data);
        console.log("Raw Stats Data:", statsResp.data);

        const typesData = {
          labels: typesResp.data.map((t) => t.name || "Unknown"),
          datasets: [
            {
              data: typesResp.data.map((t) => t.count || 0),
              backgroundColor: ["#4B5563", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"], // Extended for more segments
              borderWidth: 0,
            },
          ],
        };
        const statusData = {
          labels: statusResp.data.map((s) => s.status || "Unknown"),
          datasets: [
            {
              data: statusResp.data.map((s) => s.count || 0),
              backgroundColor: ["#3B82F6", "#EF4444", "#6B7280", "#10B981", "#F59E0B"], // Extended for more segments
              borderWidth: 0,
            },
          ],
        };
        const channelData = {
          labels: channelResp.data.map((c) => c.name || "Unknown"),
          datasets: [
            {
              data: channelResp.data.map((c) => c.count || 0),
              backgroundColor: ["#8B5CF6", "#3B82F6", "#F59E0B", "#10B981", "#4B5563"], // Extended for more segments
              borderWidth: 0,
            },
          ],
        };

        console.log("Processed Types Data:", typesData);
        console.log("Processed Status Data:", statusData);
        console.log("Processed Channel Data:", channelData);

        setTicketData({
          types: typesData,
          status: statusData,
          channel: channelData,
          unresolved: statsResp.data.unresolved || 0,
          unassigned: statsResp.data.unassigned || 0,
        });
      } catch (error) {
        console.error("Detailed Error:", error.response ? error.response.data : error.message);
        setError(`Failed to load data. ${error.response ? JSON.stringify(error.response.data) : error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWidgetSettingsChange = (widget) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widget]: !prev[widget],
    }));
  };

  const hasTypeData = ticketData.types.datasets[0].data.some(d => d > 0); // Check if any data is non-zero
  const hasStatusData = ticketData.status.datasets[0].data.some(d => d > 0);
  const hasChannelData = ticketData.channel.datasets[0].data.some(d => d > 0);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: 12,
          },
          color: "#374151",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "50%",
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <span>Ticket Dashboard</span>
        </h1>
        <Dropdown triggerText="Widget Settings" icon={Settings}>
          <div className="space-y-2 w-[250px]">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.unresolvedTickets}
                onChange={() => handleWidgetSettingsChange("unresolvedTickets")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">Unresolved Tickets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.unassignedTickets}
                onChange={() => handleWidgetSettingsChange("unassignedTickets")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">Total Unassigned Tickets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.typeWise}
                onChange={() => handleWidgetSettingsChange("typeWise")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">Type Wise Ticket</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.statusWise}
                onChange={() => handleWidgetSettingsChange("statusWise")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">Status Wise Ticket</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.channelWise}
                onChange={() => handleWidgetSettingsChange("channelWise")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">Channel Wise Ticket</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgetSettings.newTickets}
                onChange={() => handleWidgetSettingsChange("newTickets")}
                className="form-checkbox accent-black"
              />
              <span className="text-sm">New Tickets</span>
            </label>
          </div>
        </Dropdown>
      </div>

      {/* Date Range */}
      <div className="flex space-x-4">
        <input type="date" defaultValue="2025-08-23" className="border border-gray-300 rounded-md p-2" />
        <span>To</span>
        <input type="date" defaultValue="2025-09-22" className="border border-gray-300 rounded-md p-2" />
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Apply</button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgetSettings.unresolvedTickets && (
          <Card
            Icon={Ticket}
            firstData={ticketData.unresolved}
            secondData="Unresolved Tickets"
            onClick={() => navigate("/ticket/ticketpage")}
          />
        )}
        {widgetSettings.unassignedTickets && (
          <Card
            Icon={Ticket}
            firstData={ticketData.unassigned}
            secondData="Total Unassigned Ticket"
            onClick={() => navigate("/ticket/ticketpage")}
          />
        )}
      </div>

      {/* Section: TYPE WISE & STATUS WISE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgetSettings.typeWise && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Title title="TYPE WISE TICKET" />
              <button className="flex items-center text-gray-500 text-sm space-x-1">
                <Download size={16} />
                <span>DOWNLOAD</span>
              </button>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : hasTypeData ? (
                <Doughnut data={ticketData.types} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Ticket className="w-8 h-8 mb-2" />
                  <p>No ticket data found. Raw Data: {JSON.stringify(ticketData.types)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {widgetSettings.statusWise && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Title title="STATUS WISE TICKET" />
              <button className="flex items-center text-gray-500 text-sm space-x-1">
                <Download size={16} />
                <span>DOWNLOAD</span>
              </button>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : hasStatusData ? (
                <Doughnut data={ticketData.status} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Ticket className="w-8 h-8 mb-2" />
                  <p>No ticket data found. Raw Data: {JSON.stringify(ticketData.status)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section: CHANNEL WISE & NEW TICKETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgetSettings.channelWise && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Title title="CHANNEL WISE TICKET" />
              <button className="flex items-center text-gray-500 text-sm space-x-1">
                <Download size={16} />
                <span>DOWNLOAD</span>
              </button>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : hasChannelData ? (
                <Doughnut data={ticketData.channel} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Ticket className="w-8 h-8 mb-2" />
                  <p>No ticket data found. Raw Data: {JSON.stringify(ticketData.channel)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {widgetSettings.newTickets && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Title title="NEW TICKETS" />
            </div>
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Ticket className="w-8 h-8 mb-2" />
              <p>No ticket found.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;