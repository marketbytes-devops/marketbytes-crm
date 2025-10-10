import { useState } from 'react';
import Button from '../../../../components/Button';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';

const LeaveAssignmentForm = () => {
  const [member, setMember] = useState('Ajay Renjith');
  const [leaveType, setLeaveType] = useState('Casual');
  const [status, setStatus] = useState('Approved');
  const [duration, setDuration] = useState('Single');
  const [date, setDate] = useState('09-10-2025');
  const [reason, setReason] = useState('');

  const handleMemberChange = (e) => setMember(e.target.value);
  const handleLeaveTypeChange = (e) => setLeaveType(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleReasonChange = (e) => setReason(e.target.value);

  const handleApply = () => {
    console.log({ member, leaveType, status, duration, date, reason });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Leaves</h2>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-gray-900 mb-4">ASSIGN LEAVE</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Member</label>
            <InputField
              type="text"
              value={member}
              onChange={handleMemberChange}
              placeholder="Select Member"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <Dropdown triggerText={leaveType} onApply={handleApply} className="w-full">
              <InputField
                type="text"
                value={leaveType}
                onChange={handleLeaveTypeChange}
                placeholder="Select Leave Type"
              />
              <button className="w-full py-1 text-sm text-green-600 hover:text-green-800">+ Add Leave Type</button>
            </Dropdown>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <InputField
              type="text"
              value={status}
              onChange={handleStatusChange}
              placeholder="Select Status"
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Duration</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  value="Single"
                  checked={duration === 'Single'}
                  onChange={handleDurationChange}
                  className="mr-2"
                />
                Single
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  value="Multiple"
                  checked={duration === 'Multiple'}
                  onChange={handleDurationChange}
                  className="mr-2"
                />
                Multiple
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  value="Half Day"
                  checked={duration === 'Half Day'}
                  onChange={handleDurationChange}
                  className="mr-2"
                />
                Half Day
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <InputField
              type="text"
              value={date}
              onChange={handleDateChange}
              placeholder="Select Date"
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for absence *</label>
          <InputField
            type="text"
            value={reason}
            onChange={handleReasonChange}
            placeholder="Enter reason"
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleApply} className="bg-green-500 text-white hover:bg-green-600">
            Save
          </Button>
          <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300">Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveAssignmentForm;