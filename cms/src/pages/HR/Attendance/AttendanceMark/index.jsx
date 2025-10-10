import React, { useState } from 'react';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState({
    date: '10-10-2025',
    employeeName: 'A. Jay Renjith',
    designation: 'Stack Engineer',
    clockInTime: '10:22 AM',
    clockInIP: '61.12.16.47',
    clockOutTime: '',
    clockOutIP: '61.12.16.47',
    isLate: false,
    isHalfDay: false,
    workingFrom: 'office'
  });

  const handleInputChange = (field, value) => {
    setAttendance(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleChange = (field) => {
    setAttendance(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    console.log('Attendance saved:', attendance);
    // Save logic would go here
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2 text-blue-600">⏰</span> Attendance
        </h2>

        {/* Attendance Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Date
          </label>
          <InputField
            type="text"
            value={attendance.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Employee Details */}
        <div className="mb-6 flex items-center">
          <img
            src="https://via.placeholder.com/40" // Replace with actual employee image URL
            alt="Employee"
            className="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{attendance.employeeName}</h3>
            <p className="text-sm text-gray-600">{attendance.designation}</p>
          </div>
          <span className="ml-auto text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            PRESENT
          </span>
          <Button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
            Details
          </Button>
        </div>

        {/* Clock In/Out Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clock In *</label>
            <InputField
              type="text"
              value={attendance.clockInTime}
              onChange={(e) => handleInputChange('clockInTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clock In IP *</label>
            <InputField
              type="text"
              value={attendance.clockInIP}
              onChange={(e) => handleInputChange('clockInIP', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clock Out</label>
            <InputField
              type="text"
              value={attendance.clockOutTime}
              onChange={(e) => handleInputChange('clockOutTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clock Out IP</label>
            <InputField
              type="text"
              value={attendance.clockOutIP}
              onChange={(e) => handleInputChange('clockOutIP', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Toggles and Working From */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={attendance.isLate}
                onChange={() => handleToggleChange('isLate')}
                className="mr-2"
              />
              Late
            </label>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={attendance.isHalfDay}
                onChange={() => handleToggleChange('isHalfDay')}
                className="mr-2"
              />
              Half Day
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working From</label>
            <InputField
              type="text"
              value={attendance.workingFrom}
              onChange={(e) => handleInputChange('workingFrom', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <Button
            onClick={handleSave}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;