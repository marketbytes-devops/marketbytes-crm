import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../../../components/Button';
import Icons from '../../../../components/Icons';

const EmployeeProfile = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Profile'); // State to track the active tab
  const apiBaseUrl = 'http://localhost:8000/api/';
  const endpoint = `${apiBaseUrl}project-members/employees`;

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        const cacheBuster = `?_=${new Date().getTime()}`;
        const response = await axios.get(`${endpoint}/${employeeId}${cacheBuster}`);
        setEmployee(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch employee data: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching employee data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading employee data...</div>;
  }

  if (error || !employee) {
    return <div className="p-6 text-center text-red-500">{error || 'Employee not found'}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Employees</h2>
        <div className="w-20 h-5">
          <Button className="bg-green-500 text-white hover:bg-green-600">Edit</Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <img
              src={employee.profile_picture || 'https://via.placeholder.com/150'}
              alt="Employee"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 p-4 text-black bg-opacity-50 w-full">
              <h3 className="text-lg font-medium">{employee.name}</h3>
              <p className="text-sm">{employee.email}</p>
              <p className="text-xs">Last login at {employee.last_login || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Icons>
              <span className="text-green-500">✔</span>
            </Icons>
            <div>
              <p className="text-gray-600">Tasks Done</p>
              <p className="text-lg font-medium">{employee.tasks_done || 0}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Icons>
              <span className="text-blue-500">⏳</span>
            </Icons>
            <div>
              <p className="text-gray-600">Hours Logged</p>
              <p className="text-lg font-medium">{employee.hours_logged || 'N/A'}</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 flex items-center">
            <Icons>
              <span className="text-yellow-500">↩</span>
            </Icons>
            <div>
              <p className="text-gray-600">Leaves Taken</p>
              <p className="text-lg font-medium">{employee.leaves_taken || 0}</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 flex items-center">
            <Icons>
              <span className="text-red-500">↪</span>
            </Icons>
            <div>
              <p className="text-gray-600">Remaining Leaves</p>
              <p className="text-lg font-medium">{employee.remaining_leaves || 0}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex space-x-4 mb-4 text-sm">
          {[
            'Profile',
            'Activity',
            'Projects',
            'Tasks',
            'Leaves',
            'Time Logs',
            'Documents',
            'Appreciation Note',
            'Employee Quotient',
            'RMI',
            'KPI',
          ].map((tab) => (
            <button
              key={tab}
              className={`text-black hover:underline ${activeTab === tab ? 'font-bold underline' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Conditionally render profile details when activeTab is 'Profile' */}
        {activeTab === 'Profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Full Name</p>
              <p className="text-sm font-small">{employee.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Employee ID</p>
              <p className="text-sm font-small">{employee.employee_id || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm font-small">{employee.email || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Designation</p>
              <p className="text-sm font-small">{employee.designation_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Department</p>
              <p className="text-sm font-small">{employee.department_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Joining Date</p>
              <p className="text-sm font-small">{employee.joining_date || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Mobile</p>
              <p className="text-sm font-small">{employee.mobile || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Gender</p>
              <p className="text-sm font-small">{employee.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Slack Username</p>
              <p className="text-sm font-small">{employee.slack_username || '@'}</p>
            </div>
            <div>
              <p className="font-medium">Hourly Rate</p>
              <p className="text-sm font-small">{employee.hourly_rate || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Skills</p>
              <p className="text-sm font-small">{employee.skills || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Report To</p>
              <p className="text-sm font-small">{employee.report_to || 'N/A'}</p>
            </div>
            <div className="col-span-3">
              <p className="font-medium">Address</p>
              <p className="text-sm font-small">{employee.address || 'N/A'}</p>
            </div>
          </div>
        )}
        {/* Placeholder for other tabs */}
        {activeTab !== 'Profile' && (
          <div className="text-center text-gray-600">
            Content for {activeTab} is not yet implemented.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;