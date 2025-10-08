import React, { useState } from 'react';
import RenewalReportHeader from '../Reports/RenewalReportHeader';
import Button from '../../components/Button'; // Adjust the import path as needed
import * as XLSX from 'xlsx';

const RenewalReport = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data tailored for SSL
  const mockData = [
    { id: 1, contactName: 'John Doe', companyName: 'Acme Corp', sslHost: 'acme-ssl.com', renewalDate: '2025-10-01', amount: 100 },
    { id: 2, contactName: 'Jane Smith', companyName: 'Beta LLC', sslHost: 'beta-ssl.com', renewalDate: '2025-11-12', amount: 150 },
    { id: 3, contactName: 'Alice Johnson', companyName: 'Gamma Inc', sslHost: 'gamma-ssl.com', renewalDate: '2025-09-30', amount: 200 },
    { id: 4, contactName: 'Bob Lee', companyName: 'Delta Ltd', sslHost: 'delta-ssl.com', renewalDate: '2025-12-15', amount: 250 },
    { id: 5, contactName: 'Eva Green', companyName: 'Epsilon Co', sslHost: 'epsilon-ssl.com', renewalDate: '2025-10-20', amount: 180 },
  ];

  // Pagination logic
  const totalPages = Math.ceil(mockData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  // Function to download CSV
  const downloadCSV = () => {
    const headers = ['ID,Contact Name,Company Name,SSL Host,SSL Renewal Date,Amount'];
    const csvRows = mockData.map(row => 
      `${row.id},"${row.contactName}","${row.companyName}","${row.sslHost}","${row.renewalDate}",${row.amount}`
    );
    const csvContent = headers.join('\n') + '\n' + csvRows.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renewal_report_ssl.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Function to download Excel using xlsx
  const downloadExcel = () => {
    // Convert mockData to worksheet
    const ws = XLSX.utils.json_to_sheet(mockData, { header: ['id', 'contactName', 'companyName', 'sslHost', 'renewalDate', 'amount'] });

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SSL Renewal Report');

    // Generate and download the Excel file
    XLSX.writeFile(wb, 'renewal_report_ssl.xlsx');
  };

  // Function to print the table
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const tableHTML = `
      <html>
        <head>
          <title>SSL Renewal Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SSL Renewal Report</h1>
            <p>Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>CONTACT NAME</th>
                <th>COMPANY NAME</th>
                <th>SSL HOST</th>
                <th>SSL RENEWAL DATE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${mockData.map(row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.contactName}</td>
                  <td>${row.companyName}</td>
                  <td>${row.sslHost}</td>
                  <td>${row.renewalDate}</td>
                  <td>$${row.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <RenewalReportHeader />
      <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <select
              className="border p-2 rounded"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing entries per page
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="space-x-2 flex">
            <Button 
              onClick={downloadExcel}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Excel
            </Button>
            <Button 
              onClick={downloadCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              CSV
            </Button>
            <Button 
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Print
            </Button>
          </div>
        </div>
        <table className="w-full text-left text-gray-600 border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">CONTACT NAME</th>
              <th className="p-2 border-b">COMPANY NAME</th>
              <th className="p-2 border-b">SSL HOST</th>
              <th className="p-2 border-b">SSL RENEWAL DATE</th>
              <th className="p-2 border-b">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border-b">{item.id}</td>
                  <td className="p-2 border-b">{item.contactName}</td>
                  <td className="p-2 border-b">{item.companyName}</td>
                  <td className="p-2 border-b">{item.sslHost}</td>
                  <td className="p-2 border-b">{item.renewalDate}</td>
                  <td className="p-2 border-b">${item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-2 border-b text-center">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex w-30 h-10 mt-2">
          <Button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`bg-gray-200 px-4 py-2 ml-2 rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'}`}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`bg-gray-200 px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenewalReport;