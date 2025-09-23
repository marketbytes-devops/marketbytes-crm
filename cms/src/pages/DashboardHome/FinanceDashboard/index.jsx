import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import Card from '../../../components/Card';
import Title from '../../../components/Title';
import InputField from '../../../components/InputField'; 
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const mockData = {
  paidInvoices: 0,
  totalExpenses: 0,
  totalEarnings: 0,
  totalProfit: 0,
  totalPendingAmount: 0,
  invoiceOverview: {
    draft: 0,
    notSent: 0,
    unpaid: 0,
    overdue: 0,
    partiallyPaid: 0,
    paid: 0,
  },
  estimateOverview: {
    draft: 0,
    notSent: 0,
    sent: 0,
    declined: 0,
    expired: 0,
    accepted: 0,
  },
  proposalOverview: {
    waiting: 0,
    declined: 0,
    expired: 0,
    accepted: 0,
    converted: 0,
  },
  invoices: [],
  estimates: [],
  expenses: [],
  payments: [],
  duePayments: [],
  proposals: [],
  earningsByClient: [],
  earningsByProjects: {
    labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'],
    datasets: [{
      label: 'Earnings',
      data: [0, 0, 0, 0, 0],
      backgroundColor: '#1E90FF',
    }],
  },
};

const FinanceDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '19-08-2025',
    endDate: '18-09-2025',
  });
  const [activeTab, setActiveTab] = useState('Invoices');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const applyDateRange = () => {
    // Handle date range application
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Earnings by Projects',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="w-full h-auto flex justify-between items-center mb-4">
        <Title title="Finance Dashboard" />
        <div className="flex items-center space-x-2">
          <InputField
            type="text"
            value={dateRange.startDate}
            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            placeholder="From"
            className="w-32"
          />
          <span className="text-sm">To</span>
          <InputField
            type="text"
            value={dateRange.endDate}
            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            placeholder="To"
            className="w-32"
          />
          <button
            onClick={applyDateRange}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card Icon={DollarSign} firstData={mockData.paidInvoices} secondData="Paid Invoices" />
        <Card Icon={DollarSign} firstData={mockData.totalExpenses} secondData="Total Expenses" />
        <Card Icon={DollarSign} firstData={mockData.totalEarnings} secondData="Total Earnings" />
        <Card Icon={DollarSign} firstData={mockData.totalProfit} secondData="Total Profit" />
        <Card Icon={DollarSign} firstData={mockData.totalPendingAmount} secondData="Total Pending Amount" />
      </div>

      {/* Overview Sections */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-3xl p-6">
          <Title title="INVOICE OVERVIEW" />
          <div className="space-y-2">
            <p>Draft 0%</p>
            <p>Not Sent 0%</p>
            <p>Unpaid 0%</p>
            <p>Overdue 0%</p>
            <p>Partially Paid 0%</p>
            <p>Paid 0%</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-3xl p-6">
          <Title title="ESTIMATE OVERVIEW" />
          <div className="space-y-2">
            <p>Draft 0%</p>
            <p>Not Sent 0%</p>
            <p>Sent 0%</p>
            <p>Declined 0%</p>
            <p>Expired 0%</p>
            <p>Accepted 0%</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-3xl p-6">
          <Title title="PROPOSAL OVERVIEW" />
          <div className="space-y-2">
            <p>Waiting 0%</p>
            <p>Declined 0%</p>
            <p>Expired 0%</p>
            <p>Accepted 0%</p>
            <p>Converted 0%</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4">
        <div className="flex justify-between mb-4">
          <div className="space-x-2 flex">
            {['Invoices', 'Estimates', 'Expenses', 'Payments', 'Due Payments', 'Proposals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <InputField type="text" placeholder="Search:" className="w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {activeTab === 'Invoices' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">INVOICE #</th>
                    <th className="p-3 text-xs font-semibold">PROJECT</th>
                    <th className="p-3 text-xs font-semibold">CLIENT</th>
                    <th className="p-3 text-xs font-semibold">TOTAL</th>
                    <th className="p-3 text-xs font-semibold">INVOICE DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
                {activeTab === 'Estimates' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">ESTIMATE #</th>
                    <th className="p-3 text-xs font-semibold">CLIENT</th>
                    <th className="p-3 text-xs font-semibold">TOTAL</th>
                    <th className="p-3 text-xs font-semibold">ESTIMATE DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
                {activeTab === 'Expenses' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">EXPENSE #</th>
                    <th className="p-3 text-xs font-semibold">CATEGORY</th>
                    <th className="p-3 text-xs font-semibold">AMOUNT</th>
                    <th className="p-3 text-xs font-semibold">DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
                {activeTab === 'Payments' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">PAYMENT #</th>
                    <th className="p-3 text-xs font-semibold">INVOICE #</th>
                    <th className="p-3 text-xs font-semibold">AMOUNT</th>
                    <th className="p-3 text-xs font-semibold">PAYMENT DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
                {activeTab === 'Due Payments' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">INVOICE #</th>
                    <th className="p-3 text-xs font-semibold">CLIENT</th>
                    <th className="p-3 text-xs font-semibold">AMOUNT DUE</th>
                    <th className="p-3 text-xs font-semibold">DUE DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
                {activeTab === 'Proposals' && (
                  <>
                    <th className="p-3 text-xs font-semibold">#</th>
                    <th className="p-3 text-xs font-semibold">PROPOSAL #</th>
                    <th className="p-3 text-xs font-semibold">CLIENT</th>
                    <th className="p-3 text-xs font-semibold">TOTAL</th>
                    <th className="p-3 text-xs font-semibold">PROPOSAL DATE</th>
                    <th className="p-3 text-xs font-semibold">STATUS</th>
                    <th className="p-3 text-xs font-semibold">ACTION</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'Invoices' && mockData.invoices.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
              {activeTab === 'Estimates' && mockData.estimates.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
              {activeTab === 'Expenses' && mockData.expenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
              {activeTab === 'Payments' && mockData.payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
              {activeTab === 'Due Payments' && mockData.duePayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
              {activeTab === 'Proposals' && mockData.proposals.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-xs text-center">No data available in table</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-gray-500 mt-2">Showing 0 to 0 of 0 entries</div>
        <div className="flex justify-between mt-2">
          <span>Previous</span>
          <span>Next</span>
        </div>
      </div>

      {/* Earnings by Client */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4">
        <Title title="EARNINGS BY CLIENT" />
        <div className="text-center">
          <p className="text-gray-500">No earning data found. Start recording the payments</p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Manage</button>
        </div>
      </div>

      {/* Earnings by Projects */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 mb-4 w-full h-auto p-4">
        <div className="h-64">
          <Bar data={mockData.earningsByProjects} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;