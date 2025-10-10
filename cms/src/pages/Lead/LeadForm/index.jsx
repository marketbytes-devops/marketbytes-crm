import { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import Title from '../../../components/Title';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    mobile: '',
    location: '',
    industry: ''
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation function for required fields
  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation (required + format)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // Mobile validation (required + format)
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^\+\d{1,3}\d{4,14}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Format: +[country code][number] (Eg: +91)';
    }

    // Industry validation (required)
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
      // Add your form submission logic here (API call, etc.)
      alert('Form submitted successfully!');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      companyName: '',
      name: '',
      email: '',
      mobile: '',
      location: '',
      industry: ''
    });
    setErrors({});
  };

  // Iframe code snippet
  const iframeCode = `<iframe src="https://worksuite.marketbytes.in/lead-form" width="180%" frameborder="0"></iframe>`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Title title="Field Status" />
          
          {/* Iframe Code Snippet Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Iframe Code Snippet</h3>
            <div className="bg-gray-100 p-4 rounded border border-gray-300 font-mono text-sm">
              {iframeCode}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            
            {/* Form Container */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <InputField
                    type="text"
                    placeholder=""
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="bg-white"
                  />
                </div>

                {/* Name Field (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type="email"
                    placeholder=""
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Mobile Field (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile (With country code Eg+91) <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type="tel"
                    placeholder="+91"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    pattern="^\+\d{1,3}\d{4,14}$"
                    title="Format: +[country code][number] (Eg: +911234567890)"
                    className="bg-white"
                    required
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <InputField
                    type="text"
                    placeholder=""
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-white"
                  />
                </div>

                {/* Industry Field (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type="text"
                    placeholder=""
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="bg-white"
                    required
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
                  )}
                </div>

                {/* Submit and Reset Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-2"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>

        
        
              

        </div>
      </div>
    </div>
  );
};

export default LeadForm;