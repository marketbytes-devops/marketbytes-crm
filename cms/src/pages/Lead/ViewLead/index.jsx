import { useState, useEffect } from 'react';
import Dropdown from '../../../components/Dropdown';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import Title from '../../../components/Title';
import Icons from '../../../components/Icons'
import { CalendarCheck, ChevronDown, Search, Plus, Download, FileText, Layout, FormInput } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadsView = () => {
  // Mock data for leads
  const mockLeads = [
    {
      id: 1,
      clientName: 'sam lead',
      companyName: 'companynameone',
      leadValue: 0,
      nextFollowUp: '--',
      leadAgent: 'Nithya',
      status: 'New Lead'
    },
    {
      id: 2,
      clientName: 'sam lead',
      companyName: 'companynameone',
      leadValue: 0,
      nextFollowUp: '--',
      leadAgent: '--',
      status: 'New Lead'
    },
    {
      id: 3,
      clientName: 'nithya',
      companyName: 'abcd company',
      leadValue: 0,
      nextFollowUp: '--',
      leadAgent: '--',
      status: 'New Lead'
    }
  ];

  // State for filters
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState({
    client: 'All',
    followUp: 'All',
    agents: 'All',
    leadCategory: 'All',
    leadStatus: 'All'
  });
  const [leads, setLeads] = useState(mockLeads);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportFormat, setExportFormat] = useState('');

  // Stats data
  const stats = {
    totalLeads: 3,
    totalClientConvert: '0',
    totalPendingFollowup: '0',
  };

  const navigate = useNavigate()
  const handleButtonClick = (path) => {
    navigate(path);
  };

  // Status options for dropdown
  const statusOptions = [
    'New Lead',
    'Connected',
    'Proposal Sent',
    'Closed Won',
    'Closed Lost',
    'Parked For Later',
    'Take Over'
  ];

  // Action options for dropdown
  const actionOptions = [
    'View',
    'Edit',
    'Delete',
    'Change To Client',
    'Add Follow Up'
  ];

  // Export functionality
  const exportToExcel = () => {
    // Backend integration code placeholder:
    // try {
    //   const response = await fetch('/api/leads/export/excel', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       filters: { ...filters, ...dateRange },
    //       searchTerm,
    //       leads: filteredLeads 
    //     })
    //   });
    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'leads.xlsx';
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // } catch (error) {
    //   console.error('Error exporting to Excel:', error);
    // }

    // Mock implementation for demo
    console.log('Exporting to Excel:', filteredLeads);
    alert('Excel export functionality would be implemented here!');
  };

  const exportToCSV = () => {
    // Backend integration code placeholder:
    // try {
    //   const response = await fetch('/api/leads/export/csv', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       filters: { ...filters, ...dateRange },
    //       searchTerm,
    //       leads: filteredLeads 
    //     })
    //   });
    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'leads.csv';
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // } catch (error) {
    //   console.error('Error exporting to CSV:', error);
    // }

    // Mock implementation for demo
    console.log('Exporting to CSV:', filteredLeads);
    
    // Frontend CSV generation (for demo purposes)
    const headers = ['Client Name', 'Company Name', 'Lead Value', 'Next Follow Up', 'Lead Agent', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.clientName}"`,
        `"${lead.companyName}"`,
        lead.leadValue,
        `"${lead.nextFollowUp}"`,
        `"${lead.leadAgent}"`,
        `"${lead.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = (format) => {
    setExportFormat(format);
    if (format === 'excel') {
      exportToExcel();
    } else if (format === 'csv') {
      exportToCSV();
    }
  };

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply date range filter
  const applyDateRange = () => {
    console.log('Date range applied:', dateRange);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply all filters
  const applyFilters = () => {
    console.log('Filters applied:', { ...filters, ...dateRange });
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFilters({
      client: 'All',
      followUp: 'All',
      agents: 'All',
      leadCategory: 'All',
      leadStatus: 'All'
    });
    setLeads(mockLeads);
  };

  // Handle status change for a lead
  const handleStatusChange = (leadId, newStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  // Handle action for a lead
  const handleAction = (leadId, action) => {
    console.log(`Action ${action} performed for lead ${leadId}`);
    
    switch (action) {
      case 'Delete':
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
        break;
      case 'Change To Client':
        console.log(`Changing lead ${leadId} to client`);
        break;
      case 'Add Follow Up':
        console.log(`Adding follow up for lead ${leadId}`);
        break;
      default:
        break;
    }
  };

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead =>
    lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.leadAgent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch leads on component mount
  useEffect(() => {
    setLeads(mockLeads);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter Results</h2>
            
            {/* Date Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Follow-up Date Range</h3>
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
                  <span className="text-sm text-gray-600">To</span>
                  <InputField
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                    placeholder="To"
                  />
                </div>
              </Dropdown>
            </div>

            {/* Client Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <Dropdown triggerText={filters.client} icon={ChevronDown}>
                <div className="space-y-2">
                  {['All', 'Client 1', 'Client 2', 'Client 3'].map(client => (
                    <button
                      key={client}
                      onClick={() => handleFilterChange('client', client)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {client}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Follow Up Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow Up</label>
              <Dropdown triggerText={filters.followUp} icon={ChevronDown}>
                <div className="space-y-2">
                  {['All', 'Today', 'This Week', 'This Month'].map(followUp => (
                    <button
                      key={followUp}
                      onClick={() => handleFilterChange('followUp', followUp)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {followUp}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Agents Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Agents</label>
              <Dropdown triggerText={filters.agents} icon={ChevronDown}>
                <div className="space-y-2">
                  {['All', 'Nithya', 'Agent 2', 'Agent 3'].map(agent => (
                    <button
                      key={agent}
                      onClick={() => handleFilterChange('agents', agent)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {agent}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Lead Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Category</label>
              <Dropdown triggerText={filters.leadCategory} icon={ChevronDown}>
                <div className="space-y-2">
                  {['All', 'Category 1', 'Category 2', 'Category 3'].map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('leadCategory', category)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Lead Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
              <Dropdown triggerText={filters.leadStatus} icon={ChevronDown}>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange('leadStatus', status)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Apply and Reset Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={applyFilters}
                className="bg-black text-white hover:bg-gray-800"
              >
                Apply
              </Button>
              <Button 
                onClick={resetFilters}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title and Top Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Title title="Leads" />
              
              {/* Top Action Buttons */}
              <div className="flex  gap-3 mt-4">
                <Button className="bg-white text-green-600 border-2 cursor-pointer
                                   hover:bg-green-600 hover:text-white flex items-center 
                                   space-x-2 text-sm "
                        onClick={()=>handleButtonClick('/leads/proposal')}>
                  <Plus className="w-5 h-5" />
                  <span>Add Proposal Template</span>
                </Button>

                <Button className="bg-white text-green-600 border-2 cursor-pointer
                                   hover:bg-green-600 hover:text-white flex items-center 
                                   space-x-2 text-sm "
                        onClick={()=>handleButtonClick('/leads/rfp')}>
                  <Plus className="w-4 h-4" />
                  <span>Add RFP Body Template</span>
                </Button>

                <Button className="bg-white text-green-600 border-2 cursor-pointer
                                   hover:bg-green-600 hover:text-white flex items-center 
                                   space-x-2 text-sm "
                        onClick={()=>handleButtonClick('/leads/add')}>
                  <Plus className="w-4 h-4" />
                  <span>Add New Lead</span>
                </Button>

                <Button className="bg-white text-purple-600 border-2 cursor-pointer
                                   hover:bg-purple-600 hover:text-white flex items-center 
                                   space-x-2 text-sm "
                        onClick={()=>handleButtonClick('/leads/kanbanboard')}>
                  <Layout className="w-4 h-4" />
                  <span>Kanban Board</span>
                </Button>

                <Button className="bg-white text-black px-4 py-2 border-2 border-black
                                  flex items-center space-x-2 text-sm cursor-pointer"
                        onClick={()=>handleButtonClick('/leads/leadform')}>
                  <FormInput className="w-4 h-4" />
                  <span>Lead Form</span>
                </Button>

                {/* Export Dropdown Button */}
                <Dropdown 
                  triggerText="Export" 
                  icon={Download}
                  className="bg-gray-600 text-black hover:bg-gray-700 px-4 py-2 flex items-center space-x-2 text-sm"
                >
                  <div className="space-y-1 min-w-[150px] ">
                    <button
                      onClick={() => handleExport('excel')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      CSV
                    </button>
                  </div>
                </Dropdown>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Icons className="ml-18">
                <div className="text-2xl font-bold text-gray-900">{stats.totalLeads}</div>
                </Icons>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Icons className="ml-18">
                <div className="text-2xl font-bold text-gray-900">{stats.totalClientConvert}</div>
                </Icons>
                <div className="text-sm text-gray-600">Total Client Convert</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Icons className="ml-18">
                <div className="text-2xl font-bold text-gray-900">{stats.totalPendingFollowup}</div>
                </Icons>
                <div className="text-sm text-gray-600">Total pending follow up</div>
              </div>
            </div>

            {/* Leads Table Section */}
            <div className="bg-white rounded-lg shadow-sm">
              {/* Table Header with Controls */}
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Show</span>
                  <select 
                    value={entriesToShow}
                    onChange={(e) => setEntriesToShow(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value={10}>10 </option>
                    <option value={25}>25 </option>
                    <option value={50}>50 </option>
                    <option value={100}>100 </option>
                  </select>
                  <span className="text-sm whitespace-nowrap">entries</span>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <InputField
                    type="text"
                    placeholder="      Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLIENT NAME</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY NAME</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEAD VALUE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NEXT FOLLOW UP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEAD AGENT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.slice(0, entriesToShow).map((lead, index) => (
                      <tr key={lead.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{lead.clientName}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{lead.companyName}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">${lead.leadValue}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{lead.nextFollowUp}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {lead.leadAgent !== '--' ? (
                            <span className="font-semibold">{lead.leadAgent}</span>
                          ) : (
                            lead.leadAgent
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <Dropdown 
                            triggerText={lead.status} 
                            icon={ChevronDown}
                            className="w-32"
                          >
                            <div className="space-y-1">
                              {statusOptions.map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(lead.id, status)}
                                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </Dropdown>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <Dropdown 
                            triggerText="ACTION" 
                            icon={ChevronDown}
                            className="w-24"
                          >
                            <div className="space-y-1">
                              {actionOptions.map(action => (
                                <button
                                  key={action}
                                  onClick={() => handleAction(lead.id, action)}
                                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-sm text-gray-700">
                  Showing {Math.min(entriesToShow, filteredLeads.length)} of {filteredLeads.length} entries
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-1 text-sm">
                    Previous
                  </Button>
                  <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-1 text-sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsView;