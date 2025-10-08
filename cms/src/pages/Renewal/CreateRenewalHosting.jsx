import React, { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import CreateRenewalHeader from './CreateRenewalHeader';

const HostingPage = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    domainName: '',
    domainRenewalDate: '',
    amount: ''
  });

  // General handler for text/number inputs
  const handleInputChange = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  // Special handler for date field
  const handleDateChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      domainRenewalDate: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submit logic here
  };

  return (
    <div className="p-4">
      <div className="container mx-auto p-4">
        <CreateRenewalHeader />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Hosting</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <InputField
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="mt-1"
                placeholder="Enter contact name"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <InputField
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="mt-1"
                placeholder="Enter company name"
              />
            </div>

            {/* Hosting */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hosting</label>
              <InputField
                type="text"
                value={formData.domainName}
                onChange={(e) => handleInputChange('domainName', e.target.value)}
                className="mt-1"
                placeholder="Enter hosting name"
              />
            </div>

            {/* Hosting Renewal Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hosting Renewal Date</label>
              <InputField
                type="date"
                value={formData.domainRenewalDate}
                onChange={handleDateChange} // custom handler
                className="mt-1"
                placeholder="YYYY-MM-DD"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <InputField
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="mt-1"
                placeholder="Enter amount"
              />
            </div>

            {/* Submit Button */}
            <div > 
              <Button
                className="bg-green-500 text-white hover:bg-green-600 w-full mt-4"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostingPage;
