import React, { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import Title from "../../../components/Title";

// Mock data for dropdowns
const mockCompanies = ["Select Company", "Company A", "Company B", "Company C"];
const mockAgents = ["Sreepooja", "Nithya"];
const mockLeadSources = ["Self"];
const mockLeadCategories = ["E-Commerce Development"];
const mockLeadTeams = ["Business Development"];
const mockCountries = ["India", "USA", "UK", "Canada"];

// Mock data for clients (assuming similar to companies)
const mockClients = ["Select Client", "clientA", "clientB"];

// Modal Components
const AddLeadSourceModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  const [newSource, setNewSource] = useState("");

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Lead Source</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <InputField
          type="text"
          placeholder="Lead Source *"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(newSource)}
            className="bg-green-500 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// Similar modals for Lead Category and Lead Team
const AddLeadCategoryModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  const [newCategory, setNewCategory] = useState("");

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Lead Category</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <InputField
          type="text"
          placeholder="Lead Category *"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(newCategory)}
            className="bg-green-500 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddLeadTeamModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  const [newTeam, setNewTeam] = useState("");

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Lead Team</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <InputField
          type="text"
          placeholder="Lead Team *"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(newTeam)}
            className="bg-green-500 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddLeadAgentModal = ({
  isOpen,
  onClose,
  onSave,
  agents = mockAgents,
}) => {
  if (!isOpen) return null;
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleSave = () => {
    if (selectedAgent && !agents.includes(selectedAgent)) {
      onSave(selectedAgent);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Lead Agent</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <option value="">Select Agent</option>
          {agents.map((agent, i) => (
            <option key={i} value={agent}>
              {agent}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-500 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddLead = () => {
  // Form state for Company Details
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [postalCode, setPostalCode] = useState("");
  const [industry, setIndustry] = useState("");

  // Form state for Lead Details
  const [leadAgents, setLeadAgents] = useState(""); // Single value for agent selection
  const [addLeadAgentModalOpen, setAddLeadAgentModalOpen] = useState(false);
  const [leadSource, setLeadSource] = useState("Self");
  const [addLeadSourceModalOpen, setAddLeadSourceModalOpen] = useState(false);
  const [leadCategory, setLeadCategory] = useState("E-Commerce Development");
  const [addLeadCategoryModalOpen, setAddLeadCategoryModalOpen] =
    useState(false);
  const [leadTeam, setLeadTeam] = useState("Business Development");
  const [addLeadTeamModalOpen, setAddLeadTeamModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [leadValue, setLeadValue] = useState("0");
  const [nextFollowUp, setNextFollowUp] = useState("Yes");
  const [followUpDate, setFollowUpDate] = useState("");
  const [note, setNote] = useState("");

  // State for combobox dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handlers for modals
  const handleSaveLeadSource = (newSource) => {
    if (newSource) {
      setLeadSource(newSource);
      mockLeadSources.push(newSource);
    }
    setAddLeadSourceModalOpen(false);
  };

  const handleSaveLeadCategory = (newCategory) => {
    if (newCategory) {
      setLeadCategory(newCategory);
      mockLeadCategories.push(newCategory);
    }
    setAddLeadCategoryModalOpen(false);
  };

  const handleSaveLeadTeam = (newTeam) => {
    if (newTeam) {
      setLeadTeam(newTeam);
      mockLeadTeams.push(newTeam);
    }
    setAddLeadTeamModalOpen(false);
  };

  const handleAddAgent = (newAgent) => {
    if (newAgent && !mockAgents.includes(newAgent)) {
      mockAgents.push(newAgent);
      setLeadAgents(newAgent);
    }
  };

  const handleSaveLeadAgent = (newAgent) => {
    handleAddAgent(newAgent);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const leadData = {
      companyDetails: {
        companyName,
        website,
        address,
        mobile,
        officePhone,
        city,
        state,
        country,
        postalCode,
        industry,
      },
      leadDetails: {
        leadAgents,
        leadSource,
        leadCategory,
        leadTeam,
        clientName,
        clientEmail,
        leadValue,
        nextFollowUp,
        followUpDate,
        note,
      },
    };

    console.log("Lead Data:", leadData);
  };

  // Handle reset
  const handleReset = () => {
    setCompanyName("");
    setWebsite("");
    setAddress("");
    setMobile("");
    setOfficePhone("");
    setCity("");
    setState("");
    setCountry("India");
    setPostalCode("");
    setIndustry("");
    setLeadAgents("");
    setLeadSource("Self");
    setLeadCategory("E-Commerce Development");
    setLeadTeam("Business Development");
    setClientName("");
    setClientEmail("");
    setLeadValue("0");
    setNextFollowUp("Yes");
    setFollowUpDate("");
    setNote("");
  };

  // Handle company name changes and new company addition
  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    setCompanyName(value);
    if (
      e.key === "Enter" &&
      value &&
      !mockCompanies.includes(value) &&
      value !== "Select Company"
    ) {
      mockCompanies.push(value);
      setCompanyName(value);
      setIsDropdownOpen(false); // Close dropdown after adding
    }
  };

  // Handle selecting an existing company from dropdown
  const handleSelectCompany = (company) => {
    mockCompanies(company);
    setIsDropdownOpen(false);
  };

  // Handle client name changes and new company addition
  const handleClientNameChange = (e) => {
    const value = e.target.value;
    setClientName(value);
    if (
      e.key === "Enter" &&
      value &&
      !mockClients.includes(value) &&
      value !== "Select Client"
    ) {
      mockClients.push(value);
      setClientName(value);
      setIsDropdownOpen(false); // Close dropdown after adding
    }
  };

  // Handle selecting an existing client from dropdown
  const handleSelectClient = (client) => {
    setClientName(company);
    setIsDropdownOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title title="Leads" />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <Title title="ADD LEAD INFO" className="text-gray-600 mb-6" />

        {/* Company Details Section */}
        <div className="mb-8">
          <Title title="COMPANY DETAILS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name(To add new company type here and press enter)*
              </label>
              <div className="relative">
                <div className="border border-gray-200 rounded bg-white">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onKeyPress={handleCompanyNameChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 200)
                    } // Delay to allow click
                    placeholder="Select or type company name"
                    className="w-full text-sm p-2 focus:outline-none focus:ring-2 focus:ring-black bg-transparent"
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
                      {mockCompanies
                        .filter((company) =>
                          company
                            .toLowerCase()
                            .includes(companyName.toLowerCase())
                        )
                        .map((company, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectCompany(company)}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {company}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <InputField
                type="url"
                placeholder="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <InputField
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-4"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <div className="flex gap-2">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-sm border border-r-0 border-gray-300 bg-gray-50 w-14
                             rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {mockCountries.map((c, i) => (
                    <option key={i} value={c}>
                      {c === "India"
                        ? "🇮🇳+91"
                        : c === "USA"
                        ? "🇺🇸+1"
                        : c === "UK"
                        ? "🇬🇧+44"
                        : c === "Canada"
                        ? "🇨🇦+1"
                        : ""}
                    </option>
                  ))}
                </select>
                <InputField
                  type="tel"
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="!rounded-none !rounded-r-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Phone Number
              </label>
              <InputField
                type="tel"
                placeholder="Office Phone Number"
                value={officePhone}
                onChange={(e) => setOfficePhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <InputField
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <InputField
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none
                          focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {mockCountries.map((c, i) => (
                  <option key={i}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal code
              </label>
              <InputField
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <InputField
                type="text"
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lead Details Section */}
        <div>
          <Title title="LEAD DETAILS" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Agents
              </label>
              <div className="">
                <select
                  value={leadAgents}
                  onChange={(e) => setLeadAgents(e.target.value)}
                  className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none 
                            focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 
                            transition-colors duration-200"
                >
                  {mockAgents.map((agent, i) => (
                    <option key={i}>{agent}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setAddLeadAgentModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  + Add Agent
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Source
              </label>
              <div className="">
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none 
                             focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 
                             transition-colors duration-200"
                >
                  {mockLeadSources.map((source, i) => (
                    <option key={i}>{source}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setAddLeadSourceModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  + Add Lead Source
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Category{" "}
              </label>
              <div className="">
                <select
                  value={leadCategory}
                  onChange={(e) => setLeadCategory(e.target.value)}
                  className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none 
                            focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 
                            transition-colors duration-200"
                >
                  {mockLeadCategories.map((cat, i) => (
                    <option key={i}>{cat}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setAddLeadCategoryModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  + add lead category
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Team{" "}
              </label>
              <div className="">
                <select
                  value={leadTeam}
                  onChange={(e) => setLeadTeam(e.target.value)}
                  className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none 
                            focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 
                            transition-colors duration-200"
                >
                  {mockLeadTeams.map((team, i) => (
                    <option key={i}>{team}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setAddLeadTeamModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  + add lead team
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name(To add new client type here and press enter)*
              </label>
              <div className="relative">
                <div className="border border-gray-200 rounded bg-white">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    onKeyPress={handleClientNameChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 200)
                    } // Delay to allow click
                    placeholder="Select or type client name"
                    className="w-full text-sm p-2 focus:outline-none focus:ring-2 focus:ring-black bg-transparent"
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
                      {mockClients
                        .filter((client) =>
                          client
                            .toLowerCase()
                            .includes(clientName.toLowerCase())
                        )
                        .map((client, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectClient(client)}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {client}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email *
              </label>
              <InputField
                type="email"
                placeholder="Client Email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Value
              </label>
              <InputField
                type="number"
                placeholder="0"
                value={leadValue}
                onChange={(e) => setLeadValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next follow up
              </label>
              <select
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow Up Date
              </label>
              <InputField
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <InputField
              type="textarea"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-20"
            />
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded-md"
            >
              Save
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLeadSourceModal
        isOpen={addLeadSourceModalOpen}
        onClose={() => setAddLeadSourceModalOpen(false)}
        onSave={handleSaveLeadSource}
      />
      <AddLeadCategoryModal
        isOpen={addLeadCategoryModalOpen}
        onClose={() => setAddLeadCategoryModalOpen(false)}
        onSave={handleSaveLeadCategory}
      />
      <AddLeadTeamModal
        isOpen={addLeadTeamModalOpen}
        onClose={() => setAddLeadTeamModalOpen(false)}
        onSave={handleSaveLeadTeam}
      />
      <AddLeadAgentModal
        isOpen={addLeadAgentModalOpen}
        onClose={() => setAddLeadAgentModalOpen(false)}
        onSave={handleSaveLeadAgent}
      />
    </div>
  );
};

export default AddLead;
