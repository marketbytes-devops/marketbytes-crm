// App.jsx or ServicePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { CalendarCheck,Plus } from 'lucide-react'; // Replace with your calendar icon library

const ServiceView = () => {
  const navigate = useNavigate();

  // Mock data for the table
  const mockData = [
    { id: 16, serviceName: 'testing', status: 'active', department: 'webdevelopment' },
    { id: 15, serviceName: 'code gernnation', status: 'active', department: 'webdevelopment' },
    { id: 13, serviceName: 'test two', status: 'active', department: 'webdevelopment' },
    { id: 12, serviceName: 'test service', status: 'active', department: 'webdevelopment' },
  ];

  const [services, setServices] = useState(mockData);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    status: 'Active',
    department: 'All',
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  // Handle department change (mock implementation)
  const handleDepartmentChange = (department) => {
    setFormData((prev) => ({ ...prev, department }));
  };

  // Apply filter (mock implementation - replace with backend call)
  const applyFilters = () => {
    // Simulate filtering logic
    let filteredServices = [...mockData];
    if (dateRange.startDate && dateRange.endDate) {
      filteredServices = filteredServices.filter((service) => {
        // Mock date logic - replace with actual date comparison
        return true; // Placeholder
      });
    }
    if (formData.status !== 'All') {
      filteredServices = filteredServices.filter((service) => service.status === formData.status.toLowerCase());
    }
    if (formData.department !== 'All') {
      filteredServices = filteredServices.filter((service) => service.department === formData.department.toLowerCase());
    }
    setServices(filteredServices);
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFormData({ status: 'Active', department: 'All' });
    setServices(mockData);
  };

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentServices = services.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(services.length / entriesPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle navigation
  const handleBack = () => navigate('/clients/dept/view');
  const handleAddService = () => navigate('/clients/service/add'); // Replace with your route

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Filter Results (Left Side) */}
      <div className="w-1/4 pr-4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
        <div className="space-y-4">
          {/* Date Range */}
          <Dropdown triggerText="Date Range" icon={CalendarCheck} onApply={applyFilters}>
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Dropdown triggerText={formData.status} className="w-full max-w-xs">
              <div className="space-y-2">
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
                <button
                  type="button"
                  onClick={() => handleDepartmentChange('webdevelopment')}
                  className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                >
                  webdevelopment
                </button>
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

           <div>
            <Button onClick={handleBack} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 ">
              Back
            </Button>
            </div>

            <div>
            <Button onClick={handleAddService} 
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
             <span>Add Service</span>
            </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-4">
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="p-2 border border-gray-200 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, services.length)} of {services.length} entries
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
              {currentServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{service.id}</td>
                  <td className="p-2">{service.serviceName}</td>
                  <td className="p-2 text-green-500">{service.status}</td>
                  <td className="p-2">{service.department}</td>
                  <td className="p-2">
                    <Dropdown triggerText="View Details" className="inline-block">
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/service/${service.id}`)} // Mock navigation
                          className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/edit-service/${service.id}`)} // Mock navigation
                          className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Mock delete logic
                            setServices(services.filter((s) => s.id !== service.id));
                          }}
                          className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </Dropdown>
                  </td>
                </tr>
              ))}
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