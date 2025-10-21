import { useState, useEffect } from 'react';
import Dropdown from '../../../../components/Dropdown'; 
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Edit, Trash2 } from 'lucide-react'; 
import InputField from '../../../../components/InputField';

const DepartmentView = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All'
  });
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const navigate = useNavigate();
  
  const handleButtonClick = (path) => {
    navigate(path);
  };

  const fetchDepartments = async () => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/departments/');
    const data = await response.json();
    setDepartments(data);
    setFilteredDepartments(data);
  } catch (error) {
    console.error('Error fetching departments:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilterApply = () => {
  const filtered = departments.filter(dept => {
    const statusMatch = filters.status === 'All' ? true : dept.status.toLowerCase() === filters.status.toLowerCase();
    const startDateMatch = filters.startDate ? new Date(dept.created_at) >= new Date(filters.startDate) : true;
    const endDateMatch = filters.endDate ? new Date(dept.created_at) <= new Date(filters.endDate) : true;
    return statusMatch && startDateMatch && endDateMatch;
  });
  setFilteredDepartments(filtered);
  setCurrentPage(1);
};

  const handleFilterReset = () => {
    setFilteredDepartments(departments);
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
    setCurrentPage(1); // Reset to first page
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setFilters(prev => ({ ...prev, startDate: field === 'startDate' ? value : prev.startDate, endDate: field === 'endDate' ? value : prev.endDate }));
    setCurrentPage(1); // Reset to first page
  };

  const applyDateRange = () => {
  handleFilterApply();
};

  const handleEditDepartment = (departmentId) => {
    navigate(`/clients/dept/edit/${departmentId}`);
  };

  const handleDeleteDepartment = async (departmentId, departmentName) => {
  if (window.confirm(`Are you sure you want to delete ${departmentName}?`)) {
    try {
      const response = await fetch(`http://localhost:8000/api/departments/${departmentId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDepartments();
        alert('Department deleted successfully!');
        setCurrentPage(1);
      } else {
        alert('Failed to delete department.');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Error deleting department. Please try again.');
    }
  }
};
  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / entriesToShow);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Buttons */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Department</h1>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                onClick={() => handleButtonClick('/clients/dept/add')}
              >
                Add Department
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                onClick={() => handleButtonClick('/clients/service/view')}
              >
                Service
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Left & Right Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-full">
          
          {/* Filter Section - Left Sidebar */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-700">Filter Results</h2>
                
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date Range</label>
                  <Dropdown
                    triggerText="Date Range"
                    icon={CalendarCheck}
                    onApply={applyDateRange}
                    className="w-full"
                  >
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
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Dropdown
                    triggerText={filters.status}
                    className="w-full"
                  >
                    <div className="space-y-2">
                      <button
  onClick={() => handleStatusChange('All')}
  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
>
  All
</button>
                      <button
                        onClick={() => handleStatusChange('Active')}
                        className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleStatusChange('Inactive')}
                        className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Inactive
                      </button>
                    </div>
                  </Dropdown>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleFilterApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex-1"
                >
                  Apply
                </button>
                <button
                  onClick={handleFilterReset}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm flex-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Department Table Section - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Table Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-700">DEPARTMENT</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                      value={entriesToShow}
                      onChange={(e) => {
                        setEntriesToShow(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page when entries change
                      }}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DEPARTMENT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EMAIL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : paginatedDepartments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No departments found
                        </td>
                      </tr>
                    ) : (
                      paginatedDepartments.map((dept, index) => (
                        <tr key={dept.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(currentPage - 1) * entriesToShow + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dept.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dept.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dept.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {dept.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditDepartment(dept.id)}
                                title="Edit Department"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                                title="Delete Department"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * entriesToShow + 1} to {Math.min(currentPage * entriesToShow, departments.length)} of {departments.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;