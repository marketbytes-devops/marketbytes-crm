import { useState, useRef, useEffect } from 'react';
import { FolderOpenDot, Calendar, UserPlus, DollarSign, Paperclip, CheckCircle } from 'lucide-react';
import Title from '../../../components/Title';
import Dropdown from '../../../components/Dropdown';
import InputField from '../../../components/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api/';

const AddProject = () => {
  const [formData, setFormData] = useState({
    workName: '',
    category: '',
    department: '',
    startDate: '',
    deadline: '',
    noDeadline: false,
    amc: false,
    amc_start_date: '',
    amc_end_date: '',
    renewable: false,
    renewalFrequency: '',
    workMembers: [],
    summary: '',
    notes: '',
    client: '',
    cost: '',
    currency: 'USD',
    status: 'ongoing',
    file: [],
  });
  const [isPinnedPopupOpen, setIsPinnedPopupOpen] = useState(false);
  const [showRenewalPopup, setShowRenewalPopup] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '', status: 'Due' });
  const [milestones, setMilestones] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currencies] = useState([
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'INR', label: 'INR' },
  ]);
  const [projectStatuses] = useState([
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'due', label: 'Due' },
    { value: 'overdue', label: 'Overdue' },
  ]);
  const [renewalFrequencies] = useState([
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'halfyearly', label: 'Half-Yearly' },
    { value: 'yearly', label: 'Yearly' },
  ]);
  const pinnedPopupRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, departmentsResponse, clientsResponse, employeesResponse, pinnedResponse] =
          await Promise.all([
            axios.get(`${API_URL}categories/`),
            axios.get(`${API_URL}departments/`),
            axios.get(`${API_URL}clients/`),
            axios.get(`${API_URL}project-members/employees/`),
            axios.get(`${API_URL}works/?pinned=true`),
          ]);

        setProjectCategories(
          categoriesResponse.data.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))
        );
        setDepartments(
          departmentsResponse.data.map((dept) => ({
            value: dept.id,
            label: dept.name,
          }))
        );
        setClients(
          clientsResponse.data.map((client) => ({
            value: client.id,
            label: client.name,
          }))
        );
        setEmployees(
          employeesResponse.data.map((user) => ({
            value: user.id,
            label: user.username,
          }))
        );
        setPinnedProjects(
          pinnedResponse.data.map((work) => ({
            id: work.id,
            name: work.workName,
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Handle click outside for pinned projects popup
    const handleClickOutside = (event) => {
      if (pinnedPopupRef.current && !pinnedPopupRef.current.contains(event.target)) {
        setIsPinnedPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Handle adding a member
  const handleAddMember = (employee) => {
    if (!employee?.value) return;
    if (formData.workMembers.some((member) => member.id === employee.value)) return;
    setFormData((prev) => ({
      ...prev,
      workMembers: [...prev.workMembers, { id: employee.value, name: employee.label, hours: '' }],
    }));
  };

  // Handle member hours change
  const handleMemberHoursChange = (index, hours) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.workMembers];
      updatedMembers[index].hours = hours;
      return { ...prev, workMembers: updatedMembers };
    });
  };

  // Handle removing a member
  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      workMembers: prev.workMembers.filter((_, i) => i !== index),
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      file: [...prev.file, ...files],
    }));
  };

  // Handle milestone addition
  const getMilestoneStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today ? 'Overdue' : 'Due';
  };

  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.dueDate) {
      setMilestones((prev) => [
        ...prev,
        { id: prev.length + 1, ...newMilestone, status: getMilestoneStatus(newMilestone.dueDate) },
      ]);
      setNewMilestone({ name: '', dueDate: '', status: 'Due' });
    }
  };

  // Handle removing a milestone
  const handleRemoveMilestone = (id) => {
    setMilestones((prev) => prev.filter((milestone) => milestone.id !== id));
  };
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Prevent submission if workName is empty
  if (!formData.workName || formData.workName.trim() === '') {
    alert('Please enter a project name.');
    return;
  }

  setIsLoading(true);
  try {
    const form = new FormData();
    form.append('workName', formData.workName.trim());
    form.append('category', formData.category || '');
    form.append('department', formData.department || '');
    form.append('startDate', formData.startDate || '');
    form.append('deadline', formData.deadline || '');
    form.append('noDeadline', formData.noDeadline);
    form.append('amc', formData.amc);
    form.append('amc_start_date', formData.amc_start_date || '');
    form.append('amc_end_date', formData.amc_end_date || '');
    form.append('renewable', formData.renewable);
    form.append('renewalFrequency', formData.renewalFrequency || '');

    // Append workMembers as PKs
    if (formData.workMembers.length > 0) {
      formData.workMembers.forEach((member) => {
        form.append('workMembers', member.id);
      });
    } else {
      form.append('workMembers', '');
    }

    // Send workMembersData
    const workMembersData = formData.workMembers.map((member) => ({
      id: member.id,
      hours: member.hours || '0',
    }));
    form.append('workMembersData', JSON.stringify(workMembersData.length > 0 ? workMembersData : []));

    form.append('summary', formData.summary || '');
    form.append('notes', formData.notes || '');
    form.append('client', formData.client || '');
    form.append('cost', formData.cost || '');
    form.append('currency', formData.currency);
    form.append('status', formData.status);
    form.append('milestones', JSON.stringify(milestones) || '');

    if (formData.file.length > 0) {
      formData.file.forEach((file) => {
        form.append('file', file);
      });
    }

    // Debug log
    console.log('Submitting form data:');
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    const res = await axios.post(`${API_URL}works/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Project saved:', res.data);
    alert('Project saved successfully!');
    navigate(`/projects/${res.data.id}`);
  } catch (error) {
    console.error('Error saving project:', error.response?.data || error.message);
    alert(`Failed to save project: ${error.response?.data?.detail || error.message}`);
  } finally {
    setIsLoading(false);
  }
};


  // Handle pinned projects actions
  const handlePinnedAction = (projectId, action) => {
    console.log(`Action ${action} on project ${projectId}`);
    // Implement action logic here (e.g., API calls for view, edit, delete)
  };

  return (
    <div className="p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
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
            <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-lg shadow-lg p-4 z-10">
              <h3 className="text-sm font-semibold mb-2">Pinned Projects</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-xs font-semibold">Sl.No</th>
                      <th className="p-2 text-xs font-semibold">Project Name</th>
                      <th className="p-2 text-xs font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pinnedProjects.length > 0 ? (
                      pinnedProjects.map((project, index) => (
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
            placeholder="Project Name"
            value={formData.workName}
            onChange={(e) => handleInputChange('workName', e.target.value)}
          />
          <InputField
            type="text"
            placeholder="Summary"
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
          />
          <InputField
            type="textarea"
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
         <Dropdown
  triggerText={formData.category ? projectCategories.find(opt => opt.value === formData.category)?.label : "Select Category"}
  icon={FolderOpenDot}
>
  <div className="space-y-2 w-[200px]">
    {projectCategories.map((option) => (
      <button
        key={option.value}
        onClick={() => handleInputChange('category', option.value)}
        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
          formData.category === option.value
            ? 'bg-black text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
</Dropdown>

          <Dropdown
            triggerText={
              formData.department
                ? departments.find((d) => d.value === formData.department)?.label || 'Select Department'
                : 'Select Department'
            }
            icon={FolderOpenDot}
          >
            <div className="space-y-2 w-[200px]">
              {departments.map((option) => (
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
                value={formData.amc_start_date}
                onChange={(e) => handleInputChange('amc_start_date', e.target.value)}
              />
              <InputField
                type="date"
                placeholder="AMC End Date"
                value={formData.amc_end_date}
                onChange={(e) => handleInputChange('amc_end_date', e.target.value)}
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
                    {renewalFrequencies.map((option) => (
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

          {/* Add Project Member */}
          <div>
            <Dropdown triggerText="Add Project Members" icon={UserPlus}>
              <div className="space-y-2 w-[200px]">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <button
                      key={employee.value}
                      onClick={() => handleAddMember(employee)}
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-200"
                    >
                      {employee.label}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-600 px-4 py-2">No employees available</div>
                )}
              </div>
            </Dropdown>

            {formData.workMembers.length > 0 && (
              <div className="mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-xs font-semibold">Employee Name</th>
                      <th className="p-2 text-xs font-semibold">Allocated Hours</th>
                      <th className="p-2 text-xs font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.workMembers.map((member, index) => (
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
                        <td className="p-2 text-xs">
                          <button
                            onClick={() => handleRemoveMember(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Client Info */}
        <h2 className="text-md font-semibold mb-4">Client Info</h2>
      <Dropdown
  triggerText={
    formData.client
      ? clients.find(opt => opt.value === formData.client)?.label
      : "Select Client"
  }
  icon={UserPlus}
>
  <div className="space-y-2 w-[200px]">
    {clients.map((client) => (
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
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
          />
         <Dropdown
  triggerText={
    formData.currency
      ? currencies.find(opt => opt.value === formData.currency)?.label
      : "Currency"
  }
  icon={DollarSign}
>
  <div className="space-y-2 w-[200px]">
    {currencies.map((currency) => (
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
              {projectStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleInputChange('status', status.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    formData.status === status.value
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
        {formData.file.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {formData.file.map((file, index) => (
              <li key={index}>{file.name}</li>
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
                <th className="p-3 text-xs font-semibold">Action</th>
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
                    <td className="p-3 text-xs">
                      <button
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-xs text-center">
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
            disabled={isLoading}
            className={`px-6 py-2 bg-black text-white rounded hover:bg-black/80 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProject;