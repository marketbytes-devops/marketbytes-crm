import React, { useState, useEffect } from 'react';
import Button from '../../../../components/Button';
import axios from 'axios';

const DesignationList = () => {
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch designations (now includes computed members/employees)
      const designationResponse = await axios.get('http://127.0.0.1:8000/api/designation/');
      // Fetch employees (all profiles with user info for avatar lookup)
      const employeeResponse = await axios.get('http://127.0.0.1:8000/api/project-members/employees/');

      console.log('Designations:', designationResponse.data);
      console.log('Employees:', employeeResponse.data);

      // Deduplicate designations by id
      const uniqueDesignations = Array.from(
        new Map(designationResponse.data.map(item => [item.id, item])).values()
      );

      setDesignations(uniqueDesignations);
      setEmployees(employeeResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load designations or employees');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Optional polling: Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleAddDesignation = () => {
    console.log('Add new designation');
    // Implement add designation logic here
  };

  const handleActionClick = (designation) => {
    console.log('Action clicked for:', designation);
    // Implement edit/view actions here
  };

  // Get member count
  const getMemberCount = (designation) => {
    return designation.employees?.length || designation.members || 0;
  };

  // Render employee avatars with hover effect
  const renderEmployees = (employeeIds) => {
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return <span className="text-gray-500 text-sm">No employees</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {employeeIds.slice(0, 5).map((employeeId, index) => {
          const employee = employees.find(emp => emp?.id === employeeId);
          if (!employee) {
            console.warn(`Employee with ID ${employeeId} not found in employees data`);
            return null;
          }
          return (
            <div key={index} className="relative group">
              <img
                src={employee.profilePicture || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?'}
                alt={employee.name || 'Unknown Employee'}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap z-10 min-w-max">
                {employee.name || 'Unknown'}
              </div>
            </div>
          );
        })}
        {employeeIds.length > 5 && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold border-2 border-white shadow-sm">
            +{employeeIds.length - 5}
          </div>
        )}
      </div>
    );
  };

  // Render member count badge
  const renderMemberBadge = (count) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      {count} Member{count !== 1 ? 's' : ''}
    </span>
  );

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Designations</h1>
        </div>
        <div className="flex space-x-3">
          <div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-md flex items-center space-x-2"
              onClick={fetchData}
            >
              Refresh
            </Button>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md flex items-center space-x-2"
            onClick={handleAddDesignation}
          >
            Add Designation +
          </Button>
        </div>
      </div>

      {designations.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No designations found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">DESIGNATION</th>
                <th className="py-3 px-6 text-left">MEMBER COUNT</th>
                <th className="py-3 px-6 text-left">EMPLOYEES</th>
                <th className="py-3 px-6 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {designations.map((designation, index) => {
                const memberCount = getMemberCount(designation);
                const employeeIds = designation.employees || [];
                return (
                  <tr
                    key={designation.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {designation.designation_name || 'Unnamed Designation'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {renderMemberBadge(memberCount)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {renderEmployees(employeeIds)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => handleActionClick(designation)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DesignationList;