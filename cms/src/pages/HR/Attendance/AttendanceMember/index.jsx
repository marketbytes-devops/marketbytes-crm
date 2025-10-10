import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';

const AttendanceDashboard = () => {
  const [dateRange, setDateRange] = useState({ from: '01-10-2025', to: '10-10-2025' });
  const [employeeName, setEmployeeName] = useState('Ajay Renjith');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const attendanceData = [
    { date: '10-10-2025', day: 'Friday', status: 'Present', clockIn: '10:22 AM', clockOut: '-', details: 'Details' },
    { date: '09-10-2025', day: 'Thursday', status: 'Present', clockIn: '09:50 AM', clockOut: '09:41 PM', details: 'Details' },
    { date: '08-10-2025', day: 'Wednesday', status: 'Present', clockIn: '10:08 AM', clockOut: '10:07 PM', details: 'Details' },
    { date: '07-10-2025', day: '', status: 'Present', clockIn: '09:24 AM', clockOut: '10:01 PM', details: 'Details' },
  ];

  const summary = {
    totalWorkingDays: 8,
    daysPresent: 8,
    daysLate: 6,
    halfDay: 0,
    daysAbsent: 0,
    holidays: 0,
  };

  const handleNavigateToMarkAttendance = () => {
    navigate('/hr/attendance/markattendance'); // Navigate to the specified route
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🕒</span> Attendance
        </h2>
        <div className="space-x-2 flex">
          <Button className="bg-gray-200 text-black hover:bg-gray-300">Export</Button>
          <Button
            onClick={handleNavigateToMarkAttendance} // Add onClick handler
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Mark Attendance
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <span className="text-gray-500">Summary</span>
          </div>
          <div className="flex-1">
            <span className="text-purple-600 font-medium">Attendance By Member</span>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm text-gray-600">Select Date Range</label>
            <div className="flex space-x-2">
              <InputField
                type="text"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                placeholder="From"
                className="w-1/2"
              />
              <InputField
                type="text"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                placeholder="To"
                className="w-1/2"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600">Employee Name</label>
            <InputField
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Button className="bg-green-500 text-white hover:bg-green-600 mt-5">Apply</Button>
          </div>
        </div>

        <div className="flex justify-around text-center mb-6">
          <div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.totalWorkingDays}
            </div>
            <span className="text-gray-600">Total Working Days</span>
          </div>
          <div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.daysPresent}
            </div>
            <span className="text-gray-600">Days Present</span>
          </div>
          <div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.daysLate}
            </div>
            <span className="text-gray-600">Day(s) Late</span>
          </div>
          <div>
            <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.halfDay}
            </div>
            <span className="text-gray-600">Half Day</span>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.daysAbsent}
            </div>
            <span className="text-gray-600">Day(s) Absent</span>
          </div>
          <div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">
              {summary.holidays}
            </div>
            <span className="text-gray-600">Holidays</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-2 rounded-t">
          <span>DATE</span>
          <span>STATUS</span>
          <span>CLOCK IN</span>
          <span>CLOCK OUT</span>
          <span>OTHERS</span>
        </div>
        {attendanceData.map((entry, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 p-2 border-b">
            <div>
              <div>{entry.date}</div>
              <div className="text-gray-400 text-xs">{entry.day}</div>
            </div>
            <div className={`text-${entry.status === 'Present' ? 'green' : 'red'}-600`}>{entry.status}</div>
            <div>{entry.clockIn}</div>
            <div>{entry.clockOut}</div>
            <div>
              <Button className="bg-blue-500 text-white text-xs p-1 rounded">Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceDashboard;