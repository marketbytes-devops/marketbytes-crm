import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';

const AttendanceSystem = () => {
  const [filters, setFilters] = useState({
    employeeName: '',
    department: '',
    month: 'October',
    year: '2025'
  });

  const employees = [
    { name: 'MarketBytes', department: 'Engineering' },
    { name: 'WebWorks', department: 'Engineering' },
    { name: 'Gowtham Krishna P', department: 'Development' },
    { name: 'Ananthakrishnan P', department: 'Development' },
    { name: 'Ajay', department: 'Design' }
  ];

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    // Filter logic would go here
  };

  const handleTabChange = () => {
    navigate('/hr/attendance/attendancemember'); // Navigate to the specified route
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button className="pb-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
            Summary
          </button>
          <Button
            onClick={handleTabChange} // Add onClick handler
            className="pb-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium"
          >
            Attendance By Member
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name
              </label>
              <InputField
                type="text"
                placeholder="Enter employee name"
                value={filters.employeeName}
                onChange={(e) => handleFilterChange('employeeName', e.target.value)}
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <InputField
                type="text"
                placeholder="Enter department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              />
            </div>

            {/* Select Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black text-black/80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <option value="All">All</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            {/* Select Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Year(s)
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black text-black/80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <Button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="inline-flex items-center mr-4">
              <span className="w-3 h-3 bg-red-500 rounded mr-1"></span> → Holiday
            </span>
            <span className="inline-flex items-center mr-4">
              <span className="w-3 h-3 bg-green-500 rounded mr-1"></span> → Present
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded mr-1"></span> → Absent
            </span>
          </p>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    EMPLOYEE
                  </th>
                  {daysInMonth.map(day => (
                    <th
                      key={day}
                      className="py-3 px-2 text-center text-sm font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee.name} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    {daysInMonth.map(day => (
                      <td
                        key={day}
                        className="py-3 px-2 text-center border-l border-gray-200"
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-200 mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;