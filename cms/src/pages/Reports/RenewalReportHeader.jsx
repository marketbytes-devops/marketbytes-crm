// src/components/RenewalReportHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button'; // Adjust the import path as needed
import InputField from '../../components/InputField'; // Adjust the import path as needed

const RenewalReportHeader = () => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'ssl':
        navigate('/reports/renewal-report-ssl');
        break;
      case 'hosting':
        navigate('/reports/renewal-report-hosting');
        break;
      case 'email':
        navigate('/reports/renewal-report-email');
        break;
      default:
        navigate('/reports/renewal-report');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            ℝ
          </span>
          <h2 className="text-xl font-semibold">Renewal Report</h2>
        </div>
        <div classname ="w-20 h-10">
        <Button
          onClick={() => navigate('/renewal/create/renewal')}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => handleTabClick('domain')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Domain
        </Button>
        <Button
          onClick={() => handleTabClick('ssl')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          SSL
        </Button>
        <Button
          onClick={() => handleTabClick('hosting')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Hosting
        </Button>
        <Button
          onClick={() => handleTabClick('email')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Email
        </Button>
      </div>
      <div className="flex items-center  w-50 h-10 space-x-4">
        <InputField
          type="date"
          value="2025-09-24"
          onChange={() => {}} // Add state management if needed
          className="w-full max-w-xs" // Adjust width as needed
        />
        <span>To</span>
        <InputField
          type="date"
          value="2025-10-24"
          onChange={() => {}} // Add state management if needed
          className="w-full max-w-xs" // Adjust width as needed
        />
        <div classname="w-10  h-20">
        <Button className="bg-gray-700 text-white px-4 py-2 rounded">
          GO
        </Button>
        </div>
        <span>Total: Search...</span>
      </div>
    </div>
  );
};

export default RenewalReportHeader;