import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, CheckCircle, FileText, Settings, CalendarCheck } from 'lucide-react';
import Card from '../../../components/Card';
import Title from '../../../components/Title';
import InputField from '../../../components/InputField';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Dropdown from '../../../components/Dropdown';

// import axios from 'axios'; // Uncomment when backend is ready

ChartJS.register(ArcElement, Tooltip, Legend);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [dashboardData, setDashboardData] = useState({
    totalClients: 2,
    totalLeads: 2,
    totalLeadConversions: 0,
    contractsGenerated: 0,
    totalContractsSigned: 0,
    latestClients: [
      { id: 1, name: 'Nithya', timeAgo: '2 days ago' },
      { id: 2, name: 'Client 1', timeAgo: '3 hours ago' }
    ]
  });

  // Widget settings state
  const [widgetSettings, setWidgetSettings] = useState({
    totalClients: true,
    totalLeads: true,
    totalLeadConversions: true,
    contractsGenerated: true,
    totalContractsSigned: true,
    clientWiseEarnings: true,
    clientWiseTimelogs: true,
    leadsCountByStatus: true,
    leadsCountBySource: true,
    latestClients: true,
    recentLoginActivities: true
  });

  // Uncomment and implement when backend is ready
  /*
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/client-dashboard/', {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate
        }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Handle error (show message to user, etc.)
    }
  };
  */

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const applyDateRange = () => {
    // fetchDashboardData(); // Uncomment when backend is ready
    console.log('Applying date range:', dateRange);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleWidgetSettingsChange = (widget) => {
    const updatedSettings = {
      ...widgetSettings,
      [widget]: !widgetSettings[widget],
    };
    setWidgetSettings(updatedSettings);
  };

  // Chart data
  const leadsStatusData = {
    labels: ['New Lead'],
    datasets: [
      {
        data: [dashboardData.totalLeads],
        backgroundColor: ['#9B59B6'],
        hoverBackgroundColor: ['#8E44AD'],
      },
    ],
  };

  const leadsSourceData = {
    labels: ['Self'],
    datasets: [
      {
        data: [dashboardData.totalLeads],
        backgroundColor: ['#E74C3C'],
        hoverBackgroundColor: ['#C0392B'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="w-full h-auto flex justify-between items-center mb-4">
        <Title title="Client Dashboard" />
        <div className="flex space-x-4">
          {/* Widget Settings Dropdown */}
          <Dropdown triggerText="Widget Settings" icon={Settings}>
            <div className="space-y-2 w-[250px]">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.totalClients}
                  onChange={() => handleWidgetSettingsChange('totalClients')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Total Clients</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.totalLeads}
                  onChange={() => handleWidgetSettingsChange('totalLeads')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Total Leads</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.totalLeadConversions}
                  onChange={() => handleWidgetSettingsChange('totalLeadConversions')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Lead Conversions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.contractsGenerated}
                  onChange={() => handleWidgetSettingsChange('contractsGenerated')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Contracts Generated</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.totalContractsSigned}
                  onChange={() => handleWidgetSettingsChange('totalContractsSigned')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Contracts Signed</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.clientWiseEarnings}
                  onChange={() => handleWidgetSettingsChange('clientWiseEarnings')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Client Wise Earnings</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.clientWiseTimelogs}
                  onChange={() => handleWidgetSettingsChange('clientWiseTimelogs')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Client Wise Timelogs</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.leadsCountByStatus}
                  onChange={() => handleWidgetSettingsChange('leadsCountByStatus')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Leads Count by Status</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.leadsCountBySource}
                  onChange={() => handleWidgetSettingsChange('leadsCountBySource')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Leads Count by Source</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.latestClients}
                  onChange={() => handleWidgetSettingsChange('latestClients')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Latest Clients</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widgetSettings.recentLoginActivities}
                  onChange={() => handleWidgetSettingsChange('recentLoginActivities')}
                  className="form-checkbox accent-black"
                />
                <span className="text-sm">Show Recent Login Activities</span>
              </label>
            </div>
          </Dropdown>
          
          {/* Date Range Dropdown */}
          <Dropdown
            triggerText="Date Range"
            icon={CalendarCheck}
            onApply={applyDateRange}
          >
            <div className="flex items-center space-x-2 mb-2 p-2">
              <InputField
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                placeholder="From"
                className="w-full"
              />
              <span className="text-sm text-gray-600">To</span>
              <InputField
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                placeholder="To"
                className="w-full"
              />
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Metrics Grid - Conditionally render based on widget settings */}
      {widgetSettings.totalClients || widgetSettings.totalLeads || widgetSettings.totalLeadConversions || 
       widgetSettings.contractsGenerated || widgetSettings.totalContractsSigned ? (
        <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {widgetSettings.totalClients && (
            <div onClick={() => handleCardClick('/clients/view')} className="cursor-pointer">
              <Card Icon={User} firstData={dashboardData.totalClients} secondData="Total Clients" />
            </div>
          )}
          {widgetSettings.totalLeads && (
            <div onClick={() => handleCardClick('/lead/view')} className="cursor-pointer">
              <Card Icon={Users} firstData={dashboardData.totalLeads} secondData="Total Leads" />
            </div>
          )}
          {widgetSettings.totalLeadConversions && (
            <div onClick={() => handleCardClick('/lead/view')} className="cursor-pointer">
              <Card Icon={CheckCircle} firstData={dashboardData.totalLeadConversions} secondData="Total Lead Conversions" />
            </div>
          )}
          {widgetSettings.contractsGenerated && (
            <div onClick={() => handleCardClick('')} className="cursor-pointer">
              <Card Icon={FileText} firstData={dashboardData.contractsGenerated} secondData="Contracts Generated" />
            </div>
          )}
          {widgetSettings.totalContractsSigned && (
            <div onClick={() => handleCardClick('')} className="cursor-pointer">
              <Card Icon={CheckCircle} firstData={dashboardData.totalContractsSigned} secondData="Total Contracts Signed" />
            </div>
          )}
        </div>
      ) : null}

      {/* Client Wise Earnings and Timelogs */}
      {(widgetSettings.clientWiseEarnings || widgetSettings.clientWiseTimelogs) && (
        <div className="bg-gray-50 border border-gray-200 mb-4 w-full h-[500px] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {widgetSettings.clientWiseEarnings && (
            <div className="bg-white shadow-md p-6 text-center">
              <Title title="CLIENT WISE EARNINGS" />
              <p className="text-gray-500">No earning data found. Start recording the payments</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Manage
              </button>
            </div>
          )}
          {widgetSettings.clientWiseTimelogs && (
            <div className="bg-white shadow-md p-6 text-center">
              <Title title="CLIENT WISE TIMELOGS" />
              <p className="text-gray-500">No timelogs data found.</p>
            </div>
          )}
        </div>
      )}

      {/* Leads Count by Status and Source */}
      {(widgetSettings.leadsCountByStatus || widgetSettings.leadsCountBySource) && (
        <div className="bg-gray-50 border border-gray-200 mb-4 w-full h-[500px] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {widgetSettings.leadsCountByStatus && (
            <div className="bg-white shadow-md p-6">
              <Title title="LEADS COUNT BY STATUS" />
              <div className="h-72 flex items-center justify-center">
                <Doughnut data={leadsStatusData} options={chartOptions} />
              </div>
            </div>
          )}
          {widgetSettings.leadsCountBySource && (
            <div className="bg-white shadow-md p-6">
              <Title title="LEADS COUNT BY SOURCE" />
              <div className="h-72 flex items-center justify-center">
                <Doughnut data={leadsSourceData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Latest Clients and Recent Login Activities */}
      {(widgetSettings.latestClients || widgetSettings.recentLoginActivities) && (
        <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-[500px] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {widgetSettings.latestClients && (
            <div className="bg-white shadow-md rounded-3xl p-6">
              <Title title="LATEST CLIENTS" />
              <div className="space-y-4">
                {dashboardData.latestClients.map(client => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="text-green-600" />
                    </div>
                    <span>{client.name} {client.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {widgetSettings.recentLoginActivities && (
            <div className="bg-white shadow-md rounded-3xl p-6 text-center">
              <Title title="RECENT LOGIN ACTIVITIES" />
              <p className="text-gray-500">No Login Activity Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;