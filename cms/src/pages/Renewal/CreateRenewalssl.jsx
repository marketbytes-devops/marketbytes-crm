import React, { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import CreateRenewalHeader from './CreateRenewalHeader';

const SslPage = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    sslHost: '',
    renewalDate: '',
    amount: ''
  });

  // general handler for text/number inputs
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // special handler for date field
  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      renewalDate: e.target.value
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
          <h2 className="text-lg font-semibold text-gray-700 mb-4">SSL</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <InputField
                type="text"
                placeholder="Enter contact name"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <InputField
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="mt-1"
              />
            </div>

            {/* SSL Host */}
            <div>
              <label className="block text-sm font-medium text-gray-700">SSL Host</label>
              <InputField
                type="text"
                placeholder="Enter SSL host"
                value={formData.sslHost}
                onChange={(e) => handleInputChange('sslHost', e.target.value)}
                className="mt-1"
              />
            </div>

            {/* SSL Renewal Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">SSL Renewal Date</label>
              <InputField
                type="date"
                placeholder="YYYY-MM-DD"
                value={formData.renewalDate}
                onChange={handleDateChange} // custom handler
                className="mt-1"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <InputField
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="mt-1"
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

export default SslPage;
