import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dropdown from '../../../components/Dropdown';
import Title from '../../../components/Title';
import Button from '../../../components/Button';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
const CountryCodeSelector = ({ value, onChange, phoneValue, onPhoneChange, name, disabled = false }) => {
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
          disabled={disabled}
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
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const ClientInfoPage = () => {
  const { id } = useParams(); // Get client ID from URL params
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Check if we're in edit mode
  

  const [notes,setNotes] = useState("");

  // Custom toolbar options
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // toggled buttons
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video", "code-block"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
  ];

  // State for form data
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
    dateOfBirth: null,
    password: '',
    skype: '',
    linkedIn: '',
    twitter: '',
    facebook: '',
    gstNumber: '',
    logIn: '',
    shippingAddress: '',
    note: '',
    country: 'US',
    status: 'active', // New field for status
  });

  

  const [sendCredentials, setSendCredentials] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mobileCountryCode, setMobileCountryCode] = useState('+93');
  const [officeCountryCode, setOfficeCountryCode] = useState('+93');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'IN', label: 'India' },
    { value: 'AF', label: 'Afghanistan' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },

  ];

  // Fetch client data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchClientData();
    }
  }, [id]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/clients/${id}/`);
      if (response.ok) {
        const data = await response.json();
        
        // Extract country code from mobile number if exists
        if (data.mobile) {
          const mobileMatch = data.mobile.match(/^(\+\d+)(.+)/);
          if (mobileMatch) {
            setMobileCountryCode(mobileMatch[1]);
            setClientData(prev => ({
              ...prev,
              mobile: mobileMatch[2]
            }));
          }
        }

        // Extract country code from office phone if exists
        if (data.office_phone) {
          const officeMatch = data.office_phone.match(/^(\+\d+)(.+)/);
          if (officeMatch) {
            setOfficeCountryCode(officeMatch[1]);
            setClientData(prev => ({
              ...prev,
              officePhone: officeMatch[2]
            }));
          }
        }

        // Map API response to form state
        setClientData({
          companyName: data.company_name || '',
          website: data.website || '',
          address: data.address || '',
          mobile: data.mobile ? data.mobile.replace(/^\+\d+/, '') : '',
          officePhone: data.office_phone ? data.office_phone.replace(/^\+\d+/, '') : '',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postal_code || '',
          clientName: data.name || '',
          clientEmail: data.email || '',
          dateOfBirth: data.date_of_birth || null,
          password: data.password || '',
          skype: data.skype || '',
          linkedIn: data.linkedin || '',
          twitter: data.twitter || '',
          facebook: data.facebook || '',
          gstNumber: data.gst_number || '',
          logIn: data.log_in || '',
          shippingAddress: data.shipping_address || '',
          note: data.note || '',
          country: data.country || 'US',
          status: data.status || 'active',
        });

        setSendCredentials(data.send_credentials || false);
        setEmailNotifications(data.email_notifications !== false);
      } else {
        setError('Failed to fetch client data');
      }
    } catch (err) {
      setError('Network error: Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clients/generate-password/');
      const data = await response.json();
      setClientData({ ...clientData, password: data.password });
    } catch (err) {
      console.error('Error generating password:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleCountrySelect = (country) => {
    setClientData({ ...clientData, country });
  };

  const handleStatusSelect = (status) => {
    setClientData({ ...clientData, status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError(null);
    setResponseData(null);
    setIsLoading(true);

    const payload = {
      name: clientData.clientName,
      email: clientData.clientEmail,
      company_name: clientData.companyName,
      website: clientData.website,
      address: clientData.address,
      mobile: clientData.mobile ? `${mobileCountryCode}${clientData.mobile}` : '',
      office_phone: clientData.officePhone ? `${officeCountryCode}${clientData.officePhone}` : '',
      city: clientData.city,
      state: clientData.state,
      country: clientData.country,
      date_of_birth: clientData.dateOfBirth,
      password: clientData.password,
      skype: clientData.skype,
      linkedin: clientData.linkedIn,
      twitter: clientData.twitter,
      facebook: clientData.facebook,
      gst_number: clientData.gstNumber,
      log_in: clientData.logIn,
      shipping_address: clientData.shippingAddress,
      note: clientData.note,
      send_credentials: sendCredentials,
      email_notifications: emailNotifications,
      // Include status only in edit mode
      ...(isEditMode && { status: clientData.status }),
    };

    try {
      const url = isEditMode 
        ? `http://127.0.0.1:8000/api/clients/${id}/`
        : 'http://127.0.0.1:8000/api/clients/';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage(isEditMode ? 'Client updated successfully!' : 'Client created successfully!');
        // setResponseData(result);
        
        if (!isEditMode) {
          // Reset form only for new client creation
          setClientData({
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
            dateOfBirth: null,
            password: '',
            skype: '',
            linkedIn: '',
            twitter: '',
            facebook: '',
            gstNumber: '',
            logIn: '',
            shippingAddress: '',
            note: '',
            country: 'US',
            status: 'active',
          });
          setMobileCountryCode('+93');
          setOfficeCountryCode('+93');
        }
      } else {
        setError(result.errors || `Failed to ${isEditMode ? 'update' : 'create'} client. Please check the form data.`);
      }
    } catch (err) {
      setError('Network error: Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'EDIT CLIENT INFO' : 'ADD CLIENT INFO'}
          </h1>
          {isEditMode && (
            <Button
              onClick={() => navigate('/clients/view')}
              className="bg-gray-500 text-white hover:bg-gray-600"
              type="button"
            >
              Back to Clients
            </Button>
          )}
        </div>

        {/* Display Success or Error Message */}
        {responseMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {responseMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        {/* Display Saved Data */}
        {responseData && (
          <div className="mb-8 p-4 bg-blue-50 rounded-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {isEditMode ? 'Updated Client Data' : 'Saved Client Data'}
            </h2>
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}

        <div >
          {/* STATUS DROPDOWN - Only visible in edit mode */}
          {isEditMode && (
            <div className="mb-6">
              <Title title="CLIENT STATUS" />
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Dropdown
                  triggerText={statusOptions.find(s => s.value === clientData.status)?.label || 'Select Status'}
                  
                >
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() =>handleStatusSelect(status.value)}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                    >
                      {status.label}
                    </button>
                  ))}
                </Dropdown>
              </div>
            </div>
          )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Log in</label>
                <input
                  type="text"
                  name="logIn"
                  value={clientData.logIn}
                  onChange={handleInputChange}
                  placeholder="Enter log in"
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
               <ReactQuill
                        theme="snow"
                        value={notes}
                        onChange={setNotes}
                        modules={modules}
                        formats={formats}
                        placeholder="Add any notes here"
                        className="w-full border border-gray-300 rounded-md focus:outline-none 
                                   focus:ring-blue-500 "
                      />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update Client Information' : 'Save Client Information')}
            </Button>
            
            {isEditMode && (
              <Button 
                type="button"
                onClick={() => navigate('/clients/view')}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoPage;