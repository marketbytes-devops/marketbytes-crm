import { useState, useRef, useEffect } from 'react';
import Dropdown from '../../../components/Dropdown';
import Title from '../../../components/Title';
import Button from '../../../components/Button';

// Toggle Switch Component
const ToggleSwitch = ({ enabled, setEnabled, label }) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-700">{label}</span>
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        }`}
        onClick={() => setEnabled(!enabled)}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
            enabled ? 'transform translate-x-6' : ''
          }`}
        ></div>
      </div>
    </div>
  );
};

// Country Code Selector Component
const CountryCodeSelector = ({ value, onChange, phoneValue, onPhoneChange, name }) => {
  const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    { code: '+93', country: 'AF' },
  ];

  return (
    <div className="flex">
      <div className="w-1/3 mr-2">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {countryCodes.map((country) => (
            <option key={country.country} value={country.code}>
              {country.code} ({country.country})
            </option>
          ))}
        </select>
      </div>
      <div className="w-2/3">
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneValue}
          onChange={onPhoneChange}
          name={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const ClientInfoPage = () => {
  const [clientData, setClientData] = useState({
    companyName: '',
    website: '',
    address: '',
    mobile: '',
    officePhone: '',
    city: '',
    state: '',
    postalCode: '',
    clientName: '',
    clientEmail: '',
    dateOfBirth: '',
    password: '',
    skype: '',
    linkedIn: '',
    twitter: '',
    facebook: '',
    gstNumber: '',
    legIn: '',
    shippingAddress: '',
    note: '',
    country: 'US', // Added country field
  });

  const [sendCredentials, setSendCredentials] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mobileCountryCode, setMobileCountryCode] = useState('+93');
  const [officeCountryCode, setOfficeCountryCode] = useState('+93');

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'IN', label: 'India' },
    { value: 'AF', label: 'Afghanistan' },
  ];

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setClientData({ ...clientData, password });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleCountrySelect = (country) => {
    setClientData({ ...clientData, country });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', clientData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ADD CLIENT INFO</h1>

        <form onSubmit={handleSubmit}>
          {/* COMPANY DETAILS SECTION */}
          <div className="mb-8">
            <Title title="COMPANY DETAILS" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={clientData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={clientData.website}
                  onChange={handleInputChange}
                  placeholder="Enter website URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ADDRESS SECTION */}
          <div className="mb-8">
            <Title title="Address" />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={clientData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <CountryCodeSelector
                  value={mobileCountryCode}
                  onChange={(e) => setMobileCountryCode(e.target.value)}
                  phoneValue={clientData.mobile}
                  onPhoneChange={handleInputChange}
                  name="mobile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Phone Number</label>
                <CountryCodeSelector
                  value={officeCountryCode}
                  onChange={(e) => setOfficeCountryCode(e.target.value)}
                  phoneValue={clientData.officePhone}
                  onPhoneChange={handleInputChange}
                  name="officePhone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={clientData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={clientData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <Dropdown
                  triggerText={clientData.country ? countries.find(c => c.value === clientData.country).label : 'Select Country'}
                  onApply={() => {}}
                >
                  {countries.map((country) => (
                    <button
                      key={country.value}
                      onClick={() => handleCountrySelect(country.value)}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                    >
                      {country.label}
                    </button>
                  ))}
                </Dropdown>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          {/* CLIENT BASIC DETAILS SECTION */}
          <div className="mb-8">
            <Title title="CLIENT BASIC DETAILS" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={clientData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={clientData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="Enter client email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={clientData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">Client will login using this email.</p>
          </div>

          {/* PASSWORD SECTION */}
          <div className="mb-8">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={clientData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-sm text-gray-500 mb-4">Client will login using this password.</p>

            <Button
              onClick={generateRandomPassword}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 mb-4 w-auto"
              type="button"
            >
              Generate Random Password
            </Button>
          </div>

          {/* CLIENT OTHER DETAILS SECTION */}
          <div className="mb-8">
            <Title title="CLIENT OTHER DETAILS" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skype</label>
                <input
                  type="text"
                  name="skype"
                  value={clientData.skype}
                  onChange={handleInputChange}
                  placeholder="Skype ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  name="linkedIn"
                  value={clientData.linkedIn}
                  onChange={handleInputChange}
                  placeholder="LinkedIn profile URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={clientData.twitter}
                  onChange={handleInputChange}
                  placeholder="Twitter handle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={clientData.facebook}
                  onChange={handleInputChange}
                  placeholder="Facebook profile URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={clientData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="Enter GST number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leg in</label>
                <input
                  type="text"
                  name="legIn"
                  value={clientData.legIn}
                  onChange={handleInputChange}
                  placeholder="Enter leg in"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Send Credentials</span>
                <ToggleSwitch enabled={sendCredentials} setEnabled={setSendCredentials} />
                <span className="ml-2 text-sm text-gray-700">{sendCredentials ? 'Yes' : 'No'}</span>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Email Notifications</span>
                <ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} />
                <span className="ml-2 text-sm text-gray-700">{emailNotifications ? 'Enable' : 'Disable'}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <input
                type="text"
                name="shippingAddress"
                value={clientData.shippingAddress}
                onChange={handleInputChange}
                placeholder="Enter shipping address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                name="note"
                value={clientData.note}
                onChange={handleInputChange}
                placeholder="Add any notes here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              ></textarea>
            </div>

            {/* Text formatting toolbar (simplified) */}
            <div className="flex space-x-1 mt-2 mb-8">
              {['B', 'I', 'U', 'G', 'S', 'Ib*', 'IE', 'IE', 'E*', 'X'].map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
            Save Client Information
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClientInfoPage;