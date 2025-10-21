import React, { useState } from 'react';
import Button from '../../../components/Button';
import InputField from '../../../components/InputField';
import { useNavigate } from 'react-router-dom'; 
const HolidayList = () => {
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [date, setDate] = useState('');
  const [occasion, setOccasion] = useState('');
  const [markDay, setMarkDay] = useState('');
 
  const handleMarkDefaultClick = () => setShowMarkModal(true);
  const handleAddHolidayClick = () => setShowAddModal(true);
  const handleViewCalendarClick = () => setShowCalendarModal(true);
 
  const handleSaveMark = () => {
    setShowMarkModal(false);
    // Add save logic here
  };
 
  const handleSaveAdd = () => {
    setShowAddModal(false);
    // Add save logic here
  };
 
  const handleSaveCalendar = () => {
    setShowCalendarModal(false);
    // Add save logic here
  };
 const navigate = useNavigate();
 const handleButtonClick  =(path) =>{
  navigate(path);
 }
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Holiday List Of 2025</h2>
        <div>
          <Button onClick={handleMarkDefaultClick} className="bg-purple-200 hover:bg-purple-300 text-purple-800 mr-2">
            Mark Default Holidays
          </Button>
          <Button onClick={ ()=> handleButtonClick('/hr/holiday/calendar')} className="bg-transparent hover:bg-gray-200 text-blue-600 mr-2">
            View on Calendar
          </Button>
          <Button onClick={handleAddHolidayClick} className="bg-green-500 hover:bg-green-600 text-white">
            Add Holiday
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/4 pr-4">
          <div className="space-y-2">
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
              <div key={month} className="flex items-center">
                <span className="text-gray-500 mr-2">📅</span>
                <span className={month === 'October' ? 'text-blue-600 font-medium' : 'text-gray-700'}>{month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-3/4 bg-white p-4 rounded shadow">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th>#</th>
                <th>Date</th>
                <th>Occasion</th>
                <th>Day</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No holiday found for this month</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4">
            <Button onClick={handleAddHolidayClick} className="bg-green-500 hover:bg-green-600 text-white">
              Add Holiday
            </Button>
          </div>
        </div>
      </div>
 
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Mark Holiday</h3>
              <button onClick={() => setShowMarkModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="mt-4">
              <p>Mark day for Holiday</p>
              <label className="block mt-2">
                <input
                  type="checkbox"
                  checked={markDay === 'Saturday'}
                  onChange={() => setMarkDay('Saturday')}
                  className="mr-2"
                /> Saturday
              </label>
              <label className="block mt-2">
                <input
                  type="checkbox"
                  checked={markDay === 'Sunday'}
                  onChange={() => setMarkDay('Sunday')}
                  className="mr-2"
                /> Sunday
              </label>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={() => setShowMarkModal(false)} className="bg-gray-200 hover:bg-gray-300">
                Close
              </Button>
              <Button onClick={handleSaveMark} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
 
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">+ Holiday</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="mt-4 space-y-4">
              <InputField
                type="text"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
              <Button onClick={handleAddHolidayClick} className="bg-blue-500 hover:bg-blue-600 text-white mt-2">
                Add
              </Button>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={() => setShowAddModal(false)} className="bg-gray-200 hover:bg-gray-300">
                Close
              </Button>
              <Button onClick={handleSaveAdd} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
 
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Holiday Calendar</h3>
              <button onClick={() => setShowCalendarModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="mt-4 text-center">
              <button className="bg-gray-800 text-white px-2 py-1 rounded-l">←</button>
              <button className="bg-gray-300 text-gray-700 px-2 py-1">today</button>
              <button className="bg-gray-800 text-white px-2 py-1 rounded-r">→</button>
              <h3 className="mt-2">OCTOBER 2025</h3>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-500">{day}</div>
                ))}
                {Array(31).fill().map((_, i) => (
                  <div key={i} className="text-center p-1">{i + 1}</div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={() => setShowCalendarModal(false)} className="bg-gray-200 hover:bg-gray-300">
                Close
              </Button>
              <Button onClick={handleSaveCalendar} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default HolidayList;
 