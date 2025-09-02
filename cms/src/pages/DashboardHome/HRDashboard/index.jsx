import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, CalendarCheck, UserPlus, UserMinus, Clock, PieChart, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../../components/Card';
import Title from '../../../components/Title';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Dropdown from '../../../components/Dropdown';
import InputField from '../../../components/InputField';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockData = {
  activeLeaveRequests: 15,
  totalLeavesApproved: 120,
  totalNewEmployees: 8,
  totalEmployeeExits: 3,
  averageAttendance: '92%',
  departmentWiseData: {
    labels: ['Digital Marketing', 'Development', 'HR', 'Sales'],
    datasets: [
      {
        data: [25, 40, 15, 20],
        backgroundColor: ['#34D399', '#3B82F6', '#FBBF24', '#EF4444'],
        hoverBackgroundColor: ['#2DD4BF', '#2563EB', '#F59E0B', '#DC2626'],
      },
    ],
  },
  departmentWiseEmployees: [
    { id: 1, name: 'John Doe', present: true, department: 'Digital Marketing' },
    { id: 2, name: 'Jane Smith', present: false, department: 'Digital Marketing' },
    { id: 3, name: 'Alice Johnson', present: true, department: 'Digital Marketing' },
    { id: 4, name: 'Bob Brown', present: true, department: 'Digital Marketing' },
    { id: 5, name: 'Carol White', present: false, department: 'Digital Marketing' },
  ],
  designationWiseEmployees: [
    { id: 1, name: 'John Doe', present: true, designation: 'A Level' },
    { id: 2, name: 'Jane Smith', present: false, designation: 'A Level' },
    { id: 3, name: 'Alice Johnson', present: true, designation: 'A Level' },
  ],
  genderWiseEmployees: [
    { id: 1, name: 'John Doe', present: true, gender: 'Male' },
    { id: 2, name: 'Jane Smith', present: false, gender: 'Male' },
    { id: 3, name: 'Alice Johnson', present: true, gender: 'Male' },
  ],
  roleWiseEmployees: [
    { id: 1, name: 'John Doe', present: true, role: 'Junior Backend Developer' },
    { id: 2, name: 'Jane Smith', present: false, role: 'Junior Backend Developer' },
  ],
  leavesTaken: [
    { id: 1, name: 'John Doe', totalLeaves: 5, availablePaidLeaves: 10, department: 'Digital Marketing' },
    { id: 2, name: 'Jane Smith', totalLeaves: 3, availablePaidLeaves: 12, department: 'Digital Marketing' },
    { id: 3, name: 'Alice Johnson', totalLeaves: 7, availablePaidLeaves: 8, department: 'Digital Marketing' },
  ],
  lateAttendance: [
    { id: 1, name: 'John Doe', totalLate: 2, department: 'Digital Marketing' },
    { id: 2, name: 'Jane Smith', totalLate: 4, department: 'Digital Marketing' },
    { id: 3, name: 'Alice Johnson', totalLate: 1, department: 'Digital Marketing' },
  ],
};

const HRDashboard = () => {
  const { widgetSettings, language } = useOutletContext();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [sortOption, setSortOption] = useState('alphaAsc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [designationFilter, setDesignationFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const itemsPerPage = 3;

  const visibleWidgets = {
    activeLeaveRequests: widgetSettings?.activeLeaveRequests ?? true,
    totalLeavesApproved: widgetSettings?.totalLeavesApproved ?? true,
    totalNewEmployees: widgetSettings?.totalNewEmployees ?? true,
    totalEmployeeExits: widgetSettings?.totalEmployeeExits ?? true,
    averageAttendance: widgetSettings?.averageAttendance ?? true,
    departmentWiseEmployee: widgetSettings?.departmentWiseEmployee ?? true,
    designationWiseEmployee: widgetSettings?.designationWiseEmployee ?? true,
    genderWiseEmployee: widgetSettings?.genderWiseEmployee ?? true,
    roleWiseEmployee: widgetSettings?.roleWiseEmployee ?? true,
    leavesTaken: widgetSettings?.leavesTaken ?? true,
    lateAttendanceMark: widgetSettings?.lateAttendanceMark ?? true,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Filtering and sorting logic for each table
  const filterAndSort = (data, filterKey, filterValue, searchFields) => {
    return data
      .filter(item => {
        if (filterValue !== 'ALL' && item[filterKey] !== filterValue) return false;
        return searchFields.some(field =>
          item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'alphaAsc':
            return a.name.localeCompare(b.name);
          case 'alphaDesc':
            return b.name.localeCompare(a.name);
          case 'presentAsc':
            return (b.present || 0) - (a.present || 0);
          case 'presentDesc':
            return (a.present || 0) - (b.present || 0);
          default:
            return 0;
        }
      });
  };

  const filteredDepartmentEmployees = filterAndSort(
    mockData.departmentWiseEmployees,
    'department',
    departmentFilter,
    ['name', 'department']
  );
  const filteredDesignationEmployees = filterAndSort(
    mockData.designationWiseEmployees,
    'designation',
    designationFilter,
    ['name', 'designation']
  );
  const filteredGenderEmployees = filterAndSort(
    mockData.genderWiseEmployees,
    'gender',
    genderFilter,
    ['name', 'gender']
  );
  const filteredRoleEmployees = filterAndSort(
    mockData.roleWiseEmployees,
    'role',
    roleFilter,
    ['name', 'role']
  );
  const filteredLeavesTaken = filterAndSort(
    mockData.leavesTaken,
    'department',
    departmentFilter,
    ['name', 'department']
  );
  const filteredLateAttendance = filterAndSort(
    mockData.lateAttendance,
    'department',
    departmentFilter,
    ['name', 'department']
  );

  // Pagination logic
  const paginate = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { paginatedData, totalPages };
  };

  const { paginatedData: paginatedDepartmentEmployees, totalPages: departmentPages } = paginate(filteredDepartmentEmployees);
  const { paginatedData: paginatedDesignationEmployees, totalPages: designationPages } = paginate(filteredDesignationEmployees);
  const { paginatedData: paginatedGenderEmployees, totalPages: genderPages } = paginate(filteredGenderEmployees);
  const { paginatedData: paginatedRoleEmployees, totalPages: rolePages } = paginate(filteredRoleEmployees);
  const { paginatedData: paginatedLeavesTaken, totalPages: leavesPages } = paginate(filteredLeavesTaken);
  const { paginatedData: paginatedLateAttendance, totalPages: latePages } = paginate(filteredLateAttendance);

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const applyDateRange = () => {
    console.log('Applied Date Range:', dateRange);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prev => {
      if (direction === 'next' && prev < Math.max(departmentPages, designationPages, genderPages, rolePages, leavesPages, latePages)) return prev + 1;
      if (direction === 'prev' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const sortOptions = [
    { value: 'alphaAsc', label: 'Alphabetic (A-Z)' },
    { value: 'alphaDesc', label: 'Alphabetic (Z-A)' },
    { value: 'presentAsc', label: 'Present (High to Low)' },
    { value: 'presentDesc', label: 'Present (Low to High)' },
  ];

  const handleSortOptionSelect = (optionValue) => {
    setSortOption(optionValue);
  };

  const departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'Development', label: 'Development' },
    { value: 'HR', label: 'HR' },
    { value: 'Sales', label: 'Sales' },
  ];

  const designationOptions = [
    { value: 'ALL', label: 'All Designations' },
    { value: 'A Level', label: 'A Level' },
  ];

  const genderOptions = [
    { value: 'ALL', label: 'All Genders' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  const roleOptions = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'Junior Backend Developer', label: 'Junior Backend Developer' },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="w-full h-auto flex justify-between items-center mb-4">
        <Title title="HR Dashboard" />
        <div className="flex space-x-4">
          <Dropdown triggerText="Date Range" icon={CalendarCheck} onApply={applyDateRange}>
            <div className="flex items-center space-x-2 mb-2">
              <InputField
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                placeholder="From"
              />
              <span className="text-sm">To</span>
              <InputField
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                placeholder="To"
              />
            </div>
          </Dropdown>
          <Dropdown triggerText="Sort By" icon={PieChart} onApply={() => {}}>
            <div className="space-y-2 w-[250px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortOptionSelect(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    sortOption === option.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>
      {/* Widgets Grid */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {visibleWidgets.activeLeaveRequests && (
          <Card Icon={CalendarCheck} firstData={mockData.activeLeaveRequests} secondData="Active Leave Requests" />
        )}
        {visibleWidgets.totalLeavesApproved && (
          <Card Icon={CheckCircle} firstData={mockData.totalLeavesApproved} secondData="Total Leaves Approved" />
        )}
        {visibleWidgets.totalNewEmployees && (
          <Card Icon={UserPlus} firstData={mockData.totalNewEmployees} secondData="Total New Employees" />
        )}
        {visibleWidgets.totalEmployeeExits && (
          <Card Icon={UserMinus} firstData={mockData.totalEmployeeExits} secondData="Total Employee Exits" />
        )}
        {visibleWidgets.averageAttendance && (
          <Card Icon={Clock} firstData={mockData.averageAttendance} secondData="Average Attendance" />
        )}
      </div>
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {visibleWidgets.departmentWiseEmployee && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Department Wise Employee</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Department" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {departmentOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDepartmentFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          departmentFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="h-64">
              <Pie data={mockData.departmentWiseData} options={chartOptions} />
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDepartmentEmployees.length > 0 ? (
                    paginatedDepartmentEmployees.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">
                          <span
                            className={`w-3.5 rounded-full text-xs px-2 py-1 ${
                              employee.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-xs text-center">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredDepartmentEmployees.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {departmentPages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === departmentPages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === departmentPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {visibleWidgets.designationWiseEmployee && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Designation Wise Employee</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Designation" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {designationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDesignationFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          designationFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDesignationEmployees.length > 0 ? (
                    paginatedDesignationEmployees.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">
                          <span
                            className={`w-3.5 rounded-full text-xs px-2 py-1 ${
                              employee.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-xs text-center">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredDesignationEmployees.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {designationPages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === designationPages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === designationPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {visibleWidgets.genderWiseEmployee && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Gender Wise Employee</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Gender" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGenderFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          genderFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGenderEmployees.length > 0 ? (
                    paginatedGenderEmployees.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">
                          <span
                            className={`w-3.5 rounded-full text-xs px-2 py-1 ${
                              employee.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-xs text-center">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredGenderEmployees.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {genderPages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === genderPages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === genderPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {visibleWidgets.roleWiseEmployee && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Role Wise Employee</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Role" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRoleFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          roleFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRoleEmployees.length > 0 ? (
                    paginatedRoleEmployees.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">
                          <span
                            className={`w-3.5 rounded-full text-xs px-2 py-1 ${
                              employee.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-xs text-center">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredRoleEmployees.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {rolePages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === rolePages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === rolePages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {visibleWidgets.leavesTaken && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Leaves Taken</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Department" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {departmentOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDepartmentFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          departmentFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Total Leaves Taken</th>
                    <th className="p-3 text-xs font-semibold">Available Paid Leaves</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeavesTaken.length > 0 ? (
                    paginatedLeavesTaken.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">{employee.totalLeaves}</td>
                        <td className="p-3 text-xs">{employee.availablePaidLeaves}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-xs text-center">
                        No leaves found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredLeavesTaken.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {leavesPages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === leavesPages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === leavesPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {visibleWidgets.lateAttendanceMark && (
          <div className="bg-white shadow-md rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-black text-md font-semibold">Late Attendance Mark</h2>
              </div>
              <div className="w-1/3">
                <Dropdown triggerText="Department" icon={Users}>
                  <div className="space-y-2 w-[200px]">
                    {departmentOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDepartmentFilter(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                          departmentFilter === option.value
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4">
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-xs font-semibold">Sl.No</th>
                    <th className="p-3 text-xs font-semibold">Employee Name</th>
                    <th className="p-3 text-xs font-semibold">Total Late Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLateAttendance.length > 0 ? (
                    paginatedLateAttendance.map((employee, index) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3 text-xs">{employee.name}</td>
                        <td className="p-3 text-xs">{employee.totalLate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-xs text-center">
                        No late attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredLateAttendance.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">Page {currentPage} of {latePages}</span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === latePages}
                  className={`px-4 py-2 text-sm rounded ${
                    currentPage === latePages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;