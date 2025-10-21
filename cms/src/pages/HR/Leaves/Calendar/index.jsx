import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button';

const LeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-09T16:56:00+05:30')); // Set to 04:56 PM IST, Oct 9, 2025
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [viewMode, setViewMode] = useState('month'); // Default view is month
  const navigate = useNavigate(); // Hook for navigation

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dayName = days[currentDate.getDay()];
  const day = currentDate.getDate();

  // Handle date navigation
  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(month + (direction === 'prev' ? -1 : 1));
    } else if (viewMode === 'week') {
      newDate.setDate(day + (direction === 'prev' ? -7 : 7));
    } else if (viewMode === 'day') {
      newDate.setDate(day + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  // Handle navigation for buttons
  const handleAllLeavesClick = () => {
    navigate('/hr/leaves/allleaves');
  };

  const handleAssignLeaveClick = () => {
    navigate('/hr/leaves/assignleaves');
  };

  // Render monthly calendar
  const renderMonthCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendar = [];
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCount > daysInMonth) {
          week.push(<td key={`${i}-${j}`} className="border p-2"></td>);
        } else {
          const isToday = dayCount === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
          week.push(
            <td key={`${i}-${j}`} className={`border p-2 text-center ${isToday ? 'bg-yellow-100' : ''}`}>
              {dayCount}
            </td>
          );
          dayCount++;
        }
      }
      calendar.push(<tr key={i}>{week}</tr>);
    }
    return calendar;
  };

  // Render weekly calendar
  const renderWeekCalendar = () => {
    const timeSlots = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];
    const weekStart = new Date(currentDate);
    weekStart.setDate(day - currentDate.getDay()); // Start of the week (Sunday)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {weekDays.map((date, index) => (
              <th key={index} className="border p-2 text-center">
                {days[date.getDay()]} {date.getDate()}/{date.getMonth() + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 text-left">{time}</td>
              {weekDays.map((date, colIndex) => {
                const isToday = date.toDateString() === currentDate.toDateString();
                const isCurrentTime = isToday && time === "4pm"; // Highlight 4pm on Thu 10/9
                return (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={`border p-2 ${isToday ? 'bg-yellow-100' : ''} ${isCurrentTime ? 'bg-yellow-200' : ''}`}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render daily calendar
  const renderDayCalendar = () => {
    const timeSlots = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];
    const currentHour = currentDate.getHours();
    const currentTimeSlot = currentHour >= 16 ? "4pm" : `${currentHour % 12 || 12}${currentHour >= 12 ? 'pm' : 'am'}`;
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-center" colSpan="2">{dayName}</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, index) => (
            <tr key={index}>
              <td className="border p-2 text-left w-20">{time}</td>
              <td
                className={`border p-2 ${time === currentTimeSlot ? 'bg-yellow-200' : 'bg-yellow-100'}`}
                colSpan="6"
              ></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
        No events to display
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-yellow-500">
          Leaves <span className="bg-yellow-200 text-black px-2 rounded-full">6 Pending Leaves</span>
        </div>
        <div className="space-x-2 flex">
          <Button className="bg-gray-200 text-gray-600" onClick={handleAllLeavesClick}>All Leaves</Button>
          <Button className="bg-gray-200 text-gray-600" onClick={handleAssignLeaveClick}>+ Assign Leave</Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2 flex">
          <Button className="bg-gray-500 text-white" onClick={() => handleDateChange('prev')}>&lt;</Button>
          <Button className="bg-gray-300 text-black" onClick={() => setCurrentDate(new Date())}>today</Button>
          <Button className="bg-gray-500 text-white" onClick={() => handleDateChange('next')}>&gt;</Button>
        </div>
        <div className="text-lg font-bold">{monthNames[month]} {year}</div>
        <div className="space-x-2 flex">
          <Button className="bg-gray-800 text-white" onClick={() => setViewMode('month')}>month</Button>
          <Button className="bg-gray-800 text-white" onClick={() => setViewMode('week')}>week</Button>
          <Button className="bg-gray-800 text-white" onClick={() => setViewMode('day')}>day</Button>
          <Button className="bg-gray-800 text-white" onClick={() => setViewMode('list')}>list</Button>
        </div>
      </div>
      {viewMode === 'month' ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {days.map(day => (
                <th key={day} className="border p-2 text-left">{day.substring(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderMonthCalendar()}</tbody>
        </table>
      ) : viewMode === 'week' ? (
        renderWeekCalendar()
      ) : viewMode === 'day' ? (
        renderDayCalendar()
      ) : (
        renderListView()
      )}
    </div>
  );
};

export default LeaveCalendar;