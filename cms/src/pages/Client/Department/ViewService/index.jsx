
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { CalendarCheck, Plus } from 'lucide-react';

const ServiceView = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    status: 'All',
    department: 'All',
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState([]);

  // Fetch departments for the filter dropdown
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departments/');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      console.log('Departments:', data); // Debug departments
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again.');
    }
  };

  // Fetch services from the backend
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/services/');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      console.log('Services:', data); // Debug services
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  // Apply filters whenever formData or dateRange changes
  useEffect(() => {
    applyFilters();
  }, [formData, dateRange, services, departments]);

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  };

  // Handle department change
  const handleDepartmentChange = (department) => {
    console.log('Selected Department:', department); // Debug selected department
    setFormData((prev) => ({ ...prev, department }));
    setCurrentPage(1);
  };

  // Resolve department ID to name
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return 'N/A';
    const dept = departments.find((d) => d.id.toString() === departmentId.toString());
    return dept ? dept.name : 'N/A';
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...services];

    // Filter by status
    if (formData.status !== 'All') {
      filtered = filtered.filter((service) => service.status && service.status.toLowerCase() === formData.status.toLowerCase());
    }

    // Filter by department
    if (formData.department !== 'All') {
      filtered = filtered.filter((service) => {
        const departmentName = getDepartmentName(service.department);
        return departmentName && departmentName.toLowerCase() === formData.department.toLowerCase();
      });
    }

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((service) => {
        if (!service.created_at) return false;
        const createdAt = new Date(service.created_at);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return createdAt >= startDate && createdAt <= endDate;
      });
    }

    console.log('Filtered Services:', filtered); // Debug filtered services
    setFilteredServices(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFormData({ status: 'All', department: 'All' });
    setFilteredServices(services);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredServices.length / entriesPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle navigation
  const handleBack = () => navigate('/clients/dept/view');
  const handleAddService = () => navigate('/clients/service/add');

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Filter Results (Left Side) */}
      <div className="w-1/4 pr-4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
        {error && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <Dropdown triggerText="Date Range" icon={CalendarCheck}>
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
            <Dropdown triggerText={formData.status} className="w-full max-w-xs">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('All')}
                  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Active')}
                  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Inactive')}
                  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Inactive
                </button>
              </div>
            </Dropdown>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <Dropdown triggerText={formData.department} className="w-full max-w-xs">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDepartmentChange('All')}
                  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                >
                  All
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => handleDepartmentChange(dept.name)}
                    className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="flex space-x-2">
            <Button onClick={applyFilters} className="bg-green-500 hover:bg-green-600 text-white">
              Apply
            </Button>
            <Button onClick={resetFilters} className="bg-gray-500 hover:bg-gray-600 text-white">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Service Table (Right Side) */}
      <div className="w-3/4 pl-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Service</h2>
          <div className="flex space-x-2">
            <Button
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Back
            </Button>
            <Button
              onClick={handleAddService}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Add Service</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-4">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-200 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredServices.length)} of {filteredServices.length} entries
            </span>
          </div>

          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border-b">#</th>
                <th className="p-2 border-b">SERVICE NAME</th>
                <th className="p-2 border-b">STATUS</th>
                <th className="p-2 border-b">DEPARTMENT</th>
                <th className="p-2 border-b">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-2 text-center">
                    No services found
                  </td>
                </tr>
              ) : (
                currentServices.map((service, index) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{indexOfFirstEntry + index + 1}</td>
                    <td className="p-2">{service.name}</td>
                    <td className="p-2 text-green-500">{service.status}</td>
                    <td className="p-2">{getDepartmentName(service.department)}</td>
                    <td className="p-2">
                      <Dropdown triggerText="View Details" className="inline-block">
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/service/${service.id}`)}
                            className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/clients/service/edit/${service.id}`)}
                            className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
                                try {
                                  const response = await fetch(`http://localhost:8000/api/services/${service.id}/`, {
                                    method: 'DELETE',
                                  });
                                  if (response.ok) {
                                    fetchServices();
                                    alert('Service deleted successfully!');
                                  } else {
                                    alert('Failed to delete service.');
                                  }
                                } catch (err) {
                                  console.error('Error deleting service:', err);
                                  alert('Error deleting service. Please try again.');
                                }
                              }
                            }}
                            className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;
