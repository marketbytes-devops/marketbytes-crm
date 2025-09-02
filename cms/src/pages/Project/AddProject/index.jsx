import { useState, useRef, useEffect } from 'react';
import { FolderOpenDot, Calendar, UserPlus, DollarSign, Paperclip, CheckCircle, AlertCircle } from 'lucide-react';
import Title from '../../../components/Title';
import Dropdown from '../../../components/Dropdown';
import InputField from '../../../components/InputField';

const mockData = {
  pinnedProjects: [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'API Integration' },
  ],
  projectCategories: [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'api', label: 'API Integration' },
  ],
  departments: [
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'sales', label: 'Sales' },
  ],
  clients: [
    { value: 'client1', label: 'Client A' },
    { value: 'client2', label: 'Client B' },
  ],
  currencies: [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'INR', label: 'INR' },
  ],
  projectStatuses: [
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'due', label: 'Due' },
    { value: 'overdue', label: 'Overdue' },
  ],
  employees: [
    { value: 'emp1', label: 'John Doe' },
    { value: 'emp2', label: 'Jane Smith' },
    { value: 'emp3', label: 'Alice Johnson' },
  ],
  renewalFrequencies: [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'halfyearly', label: 'Half-Yearly' },
    { value: 'yearly', label: 'Yearly' },
  ],
  milestones: [
    { id: 1, name: 'Initial Design', dueDate: '2025-07-20', status: 'Ongoing' },
    { id: 2, name: 'Development', dueDate: '2025-08-10', status: 'Overdue' },
    { id: 3, name: 'Testing', dueDate: '2025-08-25', status: 'Due' },
  ],
};

const AddProject = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectCategory: '',
    department: '',
    startDate: '',
    deadline: '',
    noDeadline: false,
    amc: false,
    amcStartDate: '',
    amcEndDate: '',
    renewable: false,
    renewalFrequency: '',
    projectMembers: [],
    projectSummary: '',
    projectNotes: '',
    client: '',
    projectCost: '',
    currency: 'USD',
    projectStatus: 'ongoing',
    attachments: [],
  });
  const [isPinnedPopupOpen, setIsPinnedPopupOpen] = useState(false);
  const [showRenewalPopup, setShowRenewalPopup] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '', status: 'Due' });
  const [milestones, setMilestones] = useState(mockData.milestones);
  const pinnedPopupRef = useRef(null);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: !prev[field] };
      if (field === 'noDeadline' && newData.noDeadline) {
        newData.deadline = '';
      }
      if (field === 'renewable' && newData.renewable) {
        setShowRenewalPopup(true);
      }
      return newData;
    });
  };

  // Handle project member addition
  const handleAddMember = (member) => {
    setFormData((prev) => ({
      ...prev,
      projectMembers: [...prev.projectMembers, { id: member.value, name: member.label, hours: '' }],
    }));
  };

  // Handle member hours change
  const handleMemberHoursChange = (index, hours) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.projectMembers];
      updatedMembers[index].hours = hours;
      return { ...prev, projectMembers: updatedMembers };
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map((file) => file.name)],
    }));
  };

  // Handle milestone addition
  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.dueDate) {
      setMilestones((prev) => [
        ...prev,
        { id: prev.length + 1, ...newMilestone },
      ]);
      setNewMilestone({ name: '', dueDate: '', status: 'Due' });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Project Data:', { ...formData, milestones });
    // Add API call or further processing here
  };

  // Handle pinned projects popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pinnedPopupRef.current && !pinnedPopupRef.current.contains(event.target)) {
        setIsPinnedPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePinnedAction = (projectId, action) => {
    console.log(`Action ${action} on project ${projectId}`);
    // Implement action logic here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title title="Add New Project" />
        <div className="relative" ref={pinnedPopupRef}>
          <button
            onClick={() => setIsPinnedPopupOpen(!isPinnedPopupOpen)}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <FolderOpenDot className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold">Pinned Projects</span>
          </button>
          {isPinnedPopupOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
              <h3 className="text-sm font-semibold mb-2">Pinned Projects</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-xs font-semibold">Sl.No</th>
                    <th className="p-2 text-xs font-semibold">Project Name</th>
                    <th className="p-2 text-xs font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.pinnedProjects.length > 0 ? (
                    mockData.pinnedProjects.map((project, index) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-xs">{index + 1}</td>
                        <td className="p-2 text-xs">{project.name}</td>
                        <td className="p-2 text-xs">
                          <Dropdown triggerText="Actions" icon={CheckCircle}>
                            <div className="space-y-2 w-[150px]">
                              <button
                                onClick={() => handlePinnedAction(project.id, 'viewDetails')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                View Project Details
                              </button>
                              <button
                                onClick={() => handlePinnedAction(project.id, 'viewTasks')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                View Project Tasks
                              </button>
                              <button
                                onClick={() => handlePinnedAction(project.id, 'edit')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                Edit Project
                              </button>
                              <button
                                onClick={() => handlePinnedAction(project.id, 'duplicate')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                Duplicate Project
                              </button>
                              <button
                                onClick={() => handlePinnedAction(project.id, 'unpin')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                Unpin
                              </button>
                              <button
                                onClick={() => handlePinnedAction(project.id, 'delete')}
                                className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                              >
                                Delete
                              </button>
                            </div>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-2 text-xs text-center">
                        No pinned projects
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-3xl p-6">
        {/* Project Info */}
        <h2 className="text-md font-semibold mb-4">Project Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            type="text"
            placeholder="Project Name *"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
          />
          <Dropdown triggerText="Select Category" icon={FolderOpenDot}>
            <div className="space-y-2 w-[200px]">
              {mockData.projectCategories.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('projectCategory', option.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    formData.projectCategory === option.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Dropdown>
          <Dropdown triggerText="Select Department" icon={FolderOpenDot}>
            <div className="space-y-2 w-[200px]">
              {mockData.departments.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('department', option.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    formData.department === option.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Dropdown>
          <InputField
            type="date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
          {!formData.noDeadline && (
            <InputField
              type="date"
              placeholder="Deadline"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          )}
        </div>

        {/* Additional Features */}
        <h2 className="text-md font-semibold mb-4">Additional Features</h2>
        <div className="flex flex-col space-y-2 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.noDeadline}
              onChange={() => handleCheckboxChange('noDeadline')}
              className="form-checkbox h-4 w-4 text-black"
            />
            <span className="text-sm">Add project without deadline?</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amc}
              onChange={() => handleCheckboxChange('amc')}
              className="form-checkbox h-4 w-4 text-black"
            />
            <span className="text-sm">AMC</span>
          </label>
          {formData.amc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                type="date"
                placeholder="AMC Start Date"
                value={formData.amcStartDate}
                onChange={(e) => handleInputChange('amcStartDate', e.target.value)}
              />
              <InputField
                type="date"
                placeholder="AMC End Date"
                value={formData.amcEndDate}
                onChange={(e) => handleInputChange('amcEndDate', e.target.value)}
              />
            </div>
          )}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.renewable}
              onChange={() => handleCheckboxChange('renewable')}
              className="form-checkbox h-4 w-4 text-black"
            />
            <span className="text-sm">Renewable Project?</span>
          </label>
          {showRenewalPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
              <div className="bg-white rounded-lg p-4 w-64">
                <h3 className="text-sm font-semibold mb-2">Select Renewal Frequency</h3>
                <Dropdown triggerText="Renewal Frequency" icon={Calendar}>
                  <div className="space-y-2 w-[200px]">
                    {mockData.renewalFrequencies.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleInputChange('renewalFrequency', option.value);
                          setShowRenewalPopup(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          formData.renewalFrequency === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
                <button
                  onClick={() => setShowRenewalPopup(false)}
                  className="w-full py-2 bg-black text-white rounded hover:bg-black/80 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div>
            <Dropdown triggerText="Add Project Members" icon={UserPlus}>
              <div className="space-y-2 w-[200px]">
                {mockData.employees.map((employee) => (
                  <button
                    key={employee.value}
                    onClick={() => handleAddMember(employee)}
                    className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                  >
                    {employee.label}
                  </button>
                ))}
              </div>
            </Dropdown>
            {formData.projectMembers.length > 0 && (
              <div className="mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-xs font-semibold">Employee Name</th>
                      <th className="p-2 text-xs font-semibold">Allocated Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.projectMembers.map((member, index) => (
                      <tr key={member.id} className="border-b">
                        <td className="p-2 text-xs">{member.name}</td>
                        <td className="p-2 text-xs">
                          <InputField
                            type="number"
                            placeholder="Hours"
                            value={member.hours}
                            onChange={(e) => handleMemberHoursChange(index, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <textarea
            placeholder="Project Summary"
            value={formData.projectSummary}
            onChange={(e) => handleInputChange('projectSummary', e.target.value)}
            className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black text-black/80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            rows="4"
          />
          <textarea
            placeholder="Project Notes/Remarks"
            value={formData.projectNotes}
            onChange={(e) => handleInputChange('projectNotes', e.target.value)}
            className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black text-black/80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            rows="4"
          />
        </div>

        {/* Client Info */}
        <h2 className="text-md font-semibold mb-4">Client Info</h2>
        <Dropdown triggerText="Select Client" icon={UserPlus}>
          <div className="space-y-2 w-[200px]">
            {mockData.clients.map((client) => (
              <button
                key={client.value}
                onClick={() => handleInputChange('client', client.value)}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                  formData.client === client.value
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {client.label}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Project Valuation */}
        <h2 className="text-md font-semibold mb-4 mt-4">Project Valuation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            type="number"
            placeholder="Project Cost"
            value={formData.projectCost}
            onChange={(e) => handleInputChange('projectCost', e.target.value)}
          />
          <Dropdown triggerText="Currency" icon={DollarSign}>
            <div className="space-y-2 w-[200px]">
              {mockData.currencies.map((currency) => (
                <button
                  key={currency.value}
                  onClick={() => handleInputChange('currency', currency.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    formData.currency === currency.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {currency.label}
                </button>
              ))}
            </div>
          </Dropdown>
          <Dropdown triggerText="Project Status" icon={CheckCircle}>
            <div className="space-y-2 w-[200px]">
              {mockData.projectStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleInputChange('projectStatus', status.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    formData.projectStatus === status.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>

        {/* Attachments */}
        <h2 className="text-md font-semibold mb-4">Attachments</h2>
        <div className="flex items-center justify-center w-full mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Paperclip className="w-8 h-8 text-gray-500" />
              <p className="text-sm text-gray-500">Upload a file or drag and drop</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        {formData.attachments.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {formData.attachments.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        )}

        {/* Project Timeline */}
        <h2 className="text-md font-semibold mb-4 mt-4">Project Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InputField
            type="text"
            placeholder="Milestone Name"
            value={newMilestone.name}
            onChange={(e) => setNewMilestone((prev) => ({ ...prev, name: e.target.value }))}
          />
          <InputField
            type="date"
            placeholder="Due Date"
            value={newMilestone.dueDate}
            onChange={(e) => setNewMilestone((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
          <button
            onClick={handleAddMilestone}
            className="px-4 py-2 bg-black text-white rounded hover:bg-black/80"
          >
            Add Milestone
          </button>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-xs font-semibold">Sl.No</th>
                <th className="p-3 text-xs font-semibold">Milestone</th>
                <th className="p-3 text-xs font-semibold">Due Date</th>
                <th className="p-3 text-xs font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.length > 0 ? (
                milestones.map((milestone, index) => (
                  <tr key={milestone.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs">{index + 1}</td>
                    <td className="p-3 text-xs">{milestone.name}</td>
                    <td className="p-3 text-xs">{milestone.dueDate}</td>
                    <td className="p-3 text-xs">
                      <span
                        className={`w-3.5 rounded-full text-xs px-2 py-1 ${
                          milestone.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-xs text-center">
                    No milestones added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded hover:bg-black/80"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProject;