import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button';

const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    name: '',
    password: '',
    designation: '',
    department: '',
    reportTo: '',
    dateOfBirth: '',
    joiningDate: '',
    probationPeriod: '',
    slackUsername: '',
    exitDate: '',
    gender: 'male',
    address: '',
    skills: '',
    mobile: '',
    hourlyRate: '',
    logIn: 'Enable',
    emailNotifications: 'Enable',
    profilePicture: null,
    profilePictureUrl: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [generateRandom, setGenerateRandom] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(true);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await fetch('http://127.0.0.1:8000/api/departments/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Departments fetched:', data);
        setDepartments(data);
      } catch (err) {
        setError(`Error fetching departments: ${err.message}`);
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch designations
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        setLoadingDesignations(true);
        const response = await fetch('http://127.0.0.1:8000/api/designation/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Designations fetched:', data);
        setDesignations(data);
      } catch (err) {
        setError(`Error fetching designations: ${err.message}`);
        console.error('Error fetching designations:', err);
      } finally {
        setLoadingDesignations(false);
      }
    };
    fetchDesignations();
  }, []);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (loadingDesignations || loadingDepartments) return; // Wait for designations and departments
      try {
        setLoadingEmployee(true);
        const response = await fetch(`http://127.0.0.1:8000/api/project-members/employees/${employeeId}/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Employee fetched:', data);

        const designation = designations.find(d => d.designation_name === data.designation);
        const department = departments.find(d => d.name === data.department);

        const employeeData = {
          employeeId: data.employeeId || '',
          email: data.employeeEmail || '',
          name: data.employeeName || '',
          password: '',
          designation: designation ? designation.id : '',
          department: department ? department.id : '',
          reportTo: data.reportTo || '',
          dateOfBirth: data.dateOfBirth || '',
          joiningDate: data.joiningDate || '',
          probationPeriod: data.probationPeriod || '',
          slackUsername: data.slackUsername || '',
          exitDate: data.exitDate || '',
          gender: data.gender || 'male',
          address: data.address || '',
          skills: data.skills || '',
          mobile: data.mobile || '',
          hourlyRate: data.hourlyRate || '',
          logIn: data.logIn || 'Enable',
          emailNotifications: data.emailNotifications || 'Enable',
          profilePicture: null,
          profilePictureUrl: data.profilePicture || '',
        };

        setFormData(employeeData);
        setInitialData(employeeData);
      } catch (err) {
        setError(`Error fetching employee data: ${err.message}`);
        console.error('Error fetching employee:', err);
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [employeeId, designations, departments, loadingDesignations, loadingDepartments]);

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleGeneratePasswordChange = (e) => {
    const isChecked = e.target.checked;
    setGenerateRandom(isChecked);
    if (isChecked) {
      const newPassword = generateRandomPassword();
      setFormData((prevData) => ({ ...prevData, password: newPassword }));
    } else {
      setFormData((prevData) => ({ ...prevData, password: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(`Input changed: ${name} = ${value || files?.[0]?.name}`);
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0] || null,
        profilePictureUrl: files[0] ? '' : prevData.profilePictureUrl,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      if (name === 'password' && value !== '' && generateRandom) {
        setGenerateRandom(false);
      }
    }
  };

  const handleClearProfilePicture = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: null,
      profilePictureUrl: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      const fieldMapping = {
        employeeId: 'employeeId',
        name: 'first_name',
        email: 'email',
        password: 'password',
        designation: 'designation',
        department: 'department',
        reportTo: 'reportTo',
        dateOfBirth: 'dateOfBirth',
        joiningDate: 'joiningDate',
        probationPeriod: 'probationPeriod',
        slackUsername: 'slackUsername',
        exitDate: 'exitDate',
        gender: 'gender',
        address: 'address',
        skills: 'skills',
        mobile: 'mobile',
        hourlyRate: 'hourlyRate',
        logIn: 'logIn',
        emailNotifications: 'emailNotifications',
        profilePicture: 'profilePicture',
      };

      submitData.append('username', formData.email);

      Object.keys(formData).forEach((key) => {
        if (key === 'profilePictureUrl') return;
        if (key === 'profilePicture') {
          if (formData[key]) submitData.append(fieldMapping[key], formData[key]);
        } else if (key === 'password' && formData[key] === '') {
          // Skip empty password
        } else if (formData[key] !== null && formData[key] !== '') {
          if (key === 'designation') {
            submitData.append(fieldMapping[key], formData[key]);
          } else if (key === 'department') {
            submitData.append(fieldMapping[key], formData[key]);
          } else {
            submitData.append(fieldMapping[key], formData[key]);
          }
        }
      });

      for (let [key, value] of submitData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/project-members/employees/${employeeId}/`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        const errorMessage = Object.values(errorData).flat().join(', ') || `Failed to update employee: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const updatedEmployee = await response.json();
      console.log('Employee updated:', updatedEmployee);
      alert('Employee updated successfully!');
      navigate(`/hr/employeeprofile/${employeeId}`, { state: { updatedEmployee } });
    } catch (error) {
      console.error('Error updating employee:', error);
      alert(`Error updating employee: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setGenerateRandom(false);
  };

  const handleSaveDesignation = async () => {
    if (newDesignation.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/designation/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designation_name: newDesignation.trim() }),
        });
        if (!response.ok) throw new Error(`Failed to create designation: ${response.statusText}`);
        const newDes = await response.json();
        setDesignations([...designations, newDes]);
        setFormData((prevData) => ({ ...prevData, designation: newDes.id }));
        setNewDesignation('');
        setShowDesignationModal(false);
      } catch (error) {
        console.error('Error creating designation:', error);
        alert(`Error creating designation: ${error.message}`);
      }
    }
  };

  const handleSaveDepartment = async () => {
    if (newDepartment.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/departments/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newDepartment.trim() }),
        });
        if (!response.ok) throw new Error(`Failed to create department: ${response.statusText}`);
        const newDept = await response.json();
        setDepartments([...departments, newDept]);
        setFormData((prevData) => ({ ...prevData, department: newDept.id }));
        setNewDepartment('');
        setShowDepartmentModal(false);
      } catch (error) {
        console.error('Error creating department:', error);
        alert(`Error creating department: ${error.message}`);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <h2 className="text-xl font-bold mb-2">Edit Employee</h2>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">EDIT EMPLOYEE INFO</h3>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {loadingEmployee || loadingDesignations || loadingDepartments ? (
          <p>Loading employee data...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID*
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  name="employeeId"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  readOnly
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Employee will login using this email.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  readOnly={generateRandom}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="generateRandomPassword"
                    checked={generateRandom}
                    onChange={handleGeneratePasswordChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="generateRandomPassword"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Generate Random Password
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Employee will login using this password.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                  <button
                    type="button"
                    onClick={() => setShowDesignationModal(true)}
                    className="ml-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    +
                  </button>
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Designation</option>
                  {loadingDesignations ? (
                    <option disabled>Loading designations...</option>
                  ) : (
                    designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.designation_name}
                      </option>
                    ))
                  )}
                </select>
                {showDesignationModal && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 mx-4">
                      <div className="flex justify-between items-center bg-blue-500 border-b p-4">
                        <h3 className="text-lg text-white font-semibold">Add New Designation</h3>
                        <button
                          className="text-white hover:text-gray-200 text-xl font-bold"
                          onClick={() => setShowDesignationModal(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Designation
                          </label>
                          <input
                            type="text"
                            value={newDesignation}
                            onChange={(e) => setNewDesignation(e.target.value)}
                            placeholder="Enter new designation"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 border-t p-4">
                        <button
                          className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowDesignationModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-green-500 text-white rounded px-4 py-2 text-sm hover:bg-green-600"
                          onClick={handleSaveDesignation}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                  <button
                    type="button"
                    onClick={() => setShowDepartmentModal(true)}
                    className="ml-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    +
                  </button>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {loadingDepartments ? (
                    <option disabled>Loading departments...</option>
                  ) : departments.length === 0 ? (
                    <option disabled>No departments available</option>
                  ) : (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name || 'Unknown Department'}
                      </option>
                    ))
                  )}
                </select>
                {showDepartmentModal && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 mx-4">
                      <div className="flex justify-between items-center bg-blue-500 border-b p-4">
                        <h3 className="text-lg text-white font-semibold">Add New Department</h3>
                        <button
                          className="text-white hover:text-gray-200 text-xl font-bold"
                          onClick={() => setShowDepartmentModal(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Department
                          </label>
                          <input
                            type="text"
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            placeholder="Enter new department"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 border-t p-4">
                        <button
                          className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowDepartmentModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-green-500 text-white rounded px-4 py-2 text-sm hover:bg-green-600"
                          onClick={handleSaveDepartment}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report To
                </label>
                <input
                  type="text"
                  placeholder="Enter manager name"
                  value={formData.reportTo}
                  onChange={handleChange}
                  name="reportTo"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  name="dateOfBirth"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  name="joiningDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probation Period
                </label>
                <input
                  type="date"
                  value={formData.probationPeriod}
                  onChange={handleChange}
                  name="probationPeriod"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slack Username
                </label>
                <input
                  type="text"
                  placeholder="Slack Username"
                  value={formData.slackUsername}
                  onChange={handleChange}
                  name="slackUsername"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exit Date
                </label>
                <input
                  type="date"
                  value={formData.exitDate}
                  onChange={handleChange}
                  name="exitDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                name="address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                placeholder="Skills"
                value={formData.skills}
                onChange={handleChange}
                name="skills"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  name="mobile"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (INR)
                </label>
                <input
                  type="number"
                  placeholder="Hourly Rate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  name="hourlyRate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login
                </label>
                <select
                  name="logIn"
                  value={formData.logIn}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Notifications
                </label>
                <select
                  name="emailNotifications"
                  value={formData.emailNotifications}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  {formData.profilePictureUrl && !formData.profilePicture ? (
                    <div className="relative">
                      <img
                        src={formData.profilePictureUrl}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleClearProfilePicture}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">Select Image</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        name="profilePicture"
                        onChange={handleChange}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loadingDepartments || loadingDesignations || loadingEmployee || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEmployee;