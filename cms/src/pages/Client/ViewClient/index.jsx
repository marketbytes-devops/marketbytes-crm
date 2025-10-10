import { useState,useEffect } from 'react';
import { Plus, Download, Search, Edit, Trash2 } from 'lucide-react';
import Title from '../../../components/Title';
import Dropdown from '../../../components/Dropdown';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';

const ViewClient = () => {
  const navigate = useNavigate()
  
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredClientsData, setFilteredClientsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/clients/');
      const data = await response.json();
      setClientsData(data);
      setFilteredClientsData(data); // Initialize filtered data with all clients
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const applyFilters = () => {
    const filtered = clientsData.filter(client => {
      const clientMatch = clientFilter === 'all' || client.id === clientFilter;
      const statusMatch = statusFilter === 'all' || client.status.toLowerCase() === statusFilter;
      const startDateMatch = dateRange.startDate ? new Date(client.created_at) >= new Date(dateRange.startDate) : true;
      const endDateMatch = dateRange.endDate ? new Date(client.created_at) <= new Date(dateRange.endDate) : true;
      return clientMatch && statusMatch && startDateMatch && endDateMatch;
    });

    setFilteredClientsData(filtered);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter('all');
    setClientFilter('all');
    setFilteredClientsData(clientsData); // Reset to show all clients
    setCurrentPage(1); // Reset to first page
  };

  // Apply search filter to the filteredClientsData
  const searchedClients = filteredClientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(searchedClients.length / itemsPerPage);
  const paginatedClients = searchedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditClient = (clientId) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const handleDeleteClient = async (clientId, clientName) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/clients/${clientId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh the client list after successful deletion
          fetchClients();
          alert('Client deleted successfully!');
        } else {
          alert('Failed to delete client.');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client. Please try again.');
      }
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const clientOptions = [
    { value: 'all', label: 'All' },
    ...clientsData.map(client => ({
      value: client.id,
      label: client.name
    }))
  ];

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="w-full h-auto flex justify-between items-center mb-6">
        <Title title="Client Results" />
        <div className="flex space-x-3">
          <div>
            <Button
              onClick={() => handleButtonClick('/clients/add')}
              className="bg-white text-green-600 border-2 cursor-pointer hover:bg-green-600
                       hover:text-white w-40 h-12 whitespace-nowrap flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Client</span>
            </Button>
          </div>

          <div>
            <Button
              onClick={() => handleButtonClick('/clients/dept/view')}
              className="bg-white text-green-600 border-2 cursor-pointer hover:bg-green-600
                       hover:text-white w-40 h-12 whitespace-nowrap flex items-center justify-center"
            >
              <Plus className='w-5 h-5'/>
              <span>Department</span> 
            </Button>
          </div>

          <Button
            onClick={() => console.log('Export')}
            className="bg-white text-green-600 border-2 cursor-pointer hover:bg-green-600
                      hover:text-white w-32 h-12 flex items-center justify-center"
          >
            <Download className='w-5 h-5'/>
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Result</h3>
        <h3 className="text-lg mb-4">Select Date Range</h3>
        
        {/* Date Range with Labels */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <InputField
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end pb-2">
            <span className="text-sm font-medium text-gray-700">To</span>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <InputField
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="w-full md:w-64">
            <Dropdown 
              triggerText={statusOptions.find(opt => opt.value === statusFilter)?.label || "All"} 
              selectedValue={statusFilter} 
              onSelect={setStatusFilter}
            >
              <div className="space-y-2 w-full">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                      statusFilter === option.value
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
        
        {/* Client Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <div className="w-full md:w-64">
            <Dropdown 
              triggerText={clientOptions.find(opt => opt.value === clientFilter)?.label || "All"} 
              selectedValue={clientFilter} 
              onSelect={setClientFilter}
            >
              <div className="space-y-2 w-full">
                {clientOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setClientFilter(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                      clientFilter === option.value
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
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={applyFilters}
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
          >
            Apply Now
          </Button>
          <Button
            onClick={resetFilters}
            className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold">{searchedClients.length} Total Clients</h3>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-sm whitespace-nowrap">Show</span>
              <select 
                className="border rounded px-2 py-1 w-20"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when items per page changes
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm whitespace-nowrap">entries</span>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <InputField
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Loading clients...
                  </td>
                </tr>
              ) : paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client, index) => (
                  <tr key={client.id}>
                    <td className="px-4 py-3 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 cursor-pointer">
                      {client.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{client.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClient(client.id)}
                          title="Edit Client"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          title="Delete Client"
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

        {/* Pagination */}
        {!isLoading && searchedClients.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchedClients.length)} of {searchedClients.length} entries
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClient;