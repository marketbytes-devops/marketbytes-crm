const DateRangeSelector = () => {
  // Set default dates based on current date (Sep 18, 2025, 06:16 PM IST) and one month prior
  const today = new Date().toISOString().split('T')[0];
  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-600">Select Date Range</span>
      <input type="date" className="border rounded px-2 py-1" defaultValue={oneMonthAgo} />
      <span className="text-gray-600">To</span>
      <input type="date" className="border rounded px-2 py-1" defaultValue={today} />
      <button className="bg-green-500 text-white px-4 py-1 rounded">Apply</button>
    </div>
  );
};

export default DateRangeSelector;