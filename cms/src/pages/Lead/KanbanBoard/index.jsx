import { useState } from "react";
import { Filter, Plus, Table, Calendar } from "lucide-react";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import Dropdown from "../../../components/Dropdown";
import { useNavigate } from "react-router-dom";

const LeadsBoard = () => {
  const [dateRange, setDateRange] = useState({
    from: "2025-09-19",
    to: "2025-10-02",
  });

  const leads = {
    "NEW LEAD": [
      { name: "Sam", company: "Companynameone", followup: "No follow up found" },
      { name: "Test", company: "Test", followup: "No follow up found" },
      { name: "Test", company: "Test", followup: "No follow up found" },
    ],
    CONNECTED: [],
    "PROPOSAL SENT": [],
    "CLOSED WON": [],
    "CLOSED LOST": [],
  };

  const stageColors = {
    "NEW LEAD": "text-purple-600",
    CONNECTED: "text-yellow-500",
    "PROPOSAL SENT": "text-blue-600",
    "CLOSED WON": "text-green-600",
    "CLOSED LOST": "text-red-600",
  };

  const navigate = useNavigate()
  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Leads</h1>
        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <Dropdown triggerText="Filter Results" icon={Filter}>
            <div className="grid grid-cols-2 gap-4 w-[400px]">
              <div>
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  From
                </label>
                <InputField
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  To
                </label>
                <InputField
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">
                  Choose Agents
                </label>
                <select className="w-full text-sm p-2 border border-gray-200 rounded bg-gray-50">
                  <option>All</option>
                </select>
              </div>
              <div className="flex items-center justify-end col-span-2 space-x-2">
                <Button className="bg-green-500 hover:bg-green-600 text-white py-2">
                  Apply
                </Button>
                <Button className="bg-gray-200 hover:bg-gray-300 text-black py-2">
                  Reset
                </Button>
                <Button className="bg-gray-100 hover:bg-gray-200 text-black py-2">
                  Close
                </Button>
              </div>
            </div>
          </Dropdown>

          {/* Add Column */}
          <Button className="flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 text-sm">
            <Plus className="w-4 h-4" />
            Add Column
          </Button>

          {/* Table View */}
          <Button className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 text-sm"
                  onClick={()=>handleButtonClick('/leads/view')}>
            Table View
          </Button>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Leads From{" "}
        <span className="font-semibold">
          {new Date(dateRange.from).toLocaleDateString("en-GB")}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {new Date(dateRange.to).toLocaleDateString("en-GB")}
        </span>
      </p>

      {/* Kanban Board */}
      <div className="mt-4 grid grid-cols-5 gap-4">
        {Object.keys(leads).map((stage) => (
          <div key={stage}>
            <h2
              className={`text-sm font-semibold mb-2 ${stageColors[stage]} flex items-center justify-between`}
            >
              {stage} (₹0)
              <span className="text-gray-400">⚙</span>
            </h2>

            <div className="space-y-3">
              {leads[stage].length > 0 ? (
                leads[stage].map((lead, index) => (
                  <div
                    key={index}
                    className="bg-white shadow rounded p-3 text-sm"
                  >
                    <p className="font-medium">{lead.name} (₹0)</p>
                    <p className="text-gray-500 text-xs">{lead.company}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {lead.followup}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No leads</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsBoard;
