import React, { useState } from "react";
import { Download, Settings, Ticket } from "lucide-react";
import Card from "../../../components/Card";
import Title from "../../../components/Title";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/Dropdown";

const TicketDashboard = () => {
  const navigate = useNavigate();

  // widget settings state
  const [widgetSettings, setWidgetSettings] = useState({
    unresolvedTickets: true,
    unassignedTickets: true,
    typeWise: true,
    statusWise: true,
    channelWise: true,
    newTickets: true,
  });

  const handleWidgetSettingsChange = (widget) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widget]: !prev[widget],
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <span>Ticket Dashboard</span>
        </h1>

        {/* Widget Settings Dropdown */}
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
        <input
          type="date"
          defaultValue="2025-08-23"
          className="border border-gray-300 rounded-md p-2"
        />
        <span>To</span>
        <input
          type="date"
          defaultValue="2025-09-22"
          className="border border-gray-300 rounded-md p-2"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          Apply
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgetSettings.unresolvedTickets && (
          <Card
            Icon={Ticket}
            firstData="0"
            secondData="Unresolved Tickets"
            onClick={() => navigate("/ticket/ticketpage")}
          />
        )}
        {widgetSettings.unassignedTickets && (
          <Card
            Icon={Ticket}
            firstData="0"
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
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Ticket className="w-8 h-8 mb-2" />
              <p>No ticket found.</p>
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
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Ticket className="w-8 h-8 mb-2" />
              <p>No ticket found.</p>
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
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Ticket className="w-8 h-8 mb-2" />
              <p>No ticket found.</p>
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
