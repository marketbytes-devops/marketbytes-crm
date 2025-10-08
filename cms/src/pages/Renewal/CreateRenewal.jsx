import React, { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const RenewalPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Example click handler for search button
  const handleSearchClick = () => {
    console.log('Search clicked with value:', searchValue);
    // your search logic goes here
  };

  const handleAddRenewalClick = () => {
    navigate('/renewal/create/renewal-domain');
  };

  // Mock data for export
  const mockData = [
    { id: 1, domain: 'example.com', hosting: 'host1.com', ssl: 'active', email: 'john@example.com', client: 'Acme Corp' },
    { id: 2, domain: 'beta.com', hosting: 'host2.com', ssl: 'expired', email: 'jane@beta.com', client: 'Beta LLC' },
    { id: 3, domain: 'gamma.com', hosting: 'host3.com', ssl: 'active', email: 'alice@gamma.com', client: 'Gamma Inc' },
    { id: 4, domain: 'delta.com', hosting: 'host4.com', ssl: 'pending', email: 'bob@delta.com', client: 'Delta Ltd' },
    { id: 5, domain: 'epsilon.com', hosting: 'host5.com', ssl: 'active', email: 'eva@epsilon.com', client: 'Epsilon Co' },
  ];

  // Function to download Excel file
  const handleExportClick = () => {
    // Convert mockData to worksheet
    const ws = XLSX.utils.json_to_sheet(mockData, { header: ['id', 'domain', 'hosting', 'ssl', 'email', 'client'] });

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Renewal Report');

    // Generate and download the Excel file
    XLSX.writeFile(wb, 'renewal_report.xlsx');
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm6-8a8 8 0 100 16 8 8 0 000-16z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700">Renewal</h2>
        </div>
        <div className='h-10 w-36'>
          <Button className="bg-green-500 text-white hover:bg-green-600 w-full h-full flex items-center justify-center" onClick={handleAddRenewalClick}>
            Add Renewal +
          </Button>
        </div>
      </div>
     
          
         
      {/* Search + Export row */}
      <div className="flex justify-between items-center mb-4 bg-gray-100 p-2 rounded">
        <InputField
          type="text"
          placeholder="Type here and enter to search"
          value={searchValue}
          onChange={handleSearchChange}
          className="border-none bg-transparent flex-1"
        />

        {/* New clickable square search button */}
        <button
          onClick={handleSearchClick}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 mr-2"
        >
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a7 7 0 100 14A7 7 0 009 2zM1 9a8 8 0 1116 0A8 8 0 011 9z" />
            <path d="M15.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414z" />
          </svg>
        </button>

        <div className='h-10 w-20'>
          <Button className="bg-green-500 text-white hover:bg-green-600 w-full h-full flex items-center justify-center" onClick={handleExportClick}>
            Export
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-gray-100 p-2 rounded">
        <div className="grid grid-cols-7 gap-4 text-gray-500 font-medium">
          <span>ID</span>
          <span>DOMAIN</span>
          <span>HOSTING</span>
          <span>SSL</span>
          <span>EMAIL</span>
          <span>CLIENT</span>
          <span>ACTION</span>
        </div>
      </div>
    </div>
  );
};

export default RenewalPage;