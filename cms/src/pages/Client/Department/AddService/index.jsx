import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';

const AddService = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    department: '',
    status: 'Active'
  });
  
  const [errors, setErrors] = useState({
    serviceName: '',
    department: ''
  });

  // Mock department data - replace with API call later
  const departments = [
    { id: 1, name: 'IT Department' },
    { id: 2, name: 'HR Department' },
    { id: 3, name: 'Finance Department' },
    { id: 4, name: 'Operations Department' },
    { id: 5, name: 'Marketing Department' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDepartmentChange = (departmentId) => {
    const selectedDept = departments.find(dept => dept.id === departmentId);
    setFormData((prev) => ({ ...prev, department: selectedDept?.name || '' }));
    setErrors((prev) => ({ ...prev, department: '' }));
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      serviceName: '',
      department: ''
    };

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service Name is required';
      isValid = false;
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      // TODO: Add service creation logic here (API call)
      console.log('Saving service:', formData);
      
      // Backend Integration Example (commented for future use):
      /*
      const apiData = {
        name: formData.serviceName,
        department: formData.department,
        status: formData.status === 'Active'
      };
      
      fetch('/api/services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Service created successfully:', data);
        navigate('/services/view');
      })
      .catch(error => {
        console.error('Error creating service:', error);
      });
      */
      
      // Navigate back to service list after save
      navigate('/clients/service/view');
    }
  };

  const handleReset = () => {
    setFormData({
      serviceName: '',
      department: '',
      status: 'Active'
    });
    setErrors({
      serviceName: '',
      department: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service</h1>
          <h2 className="text-lg font-semibold bg-gray-400 text-gray-700 mt-5 p-2">DEPARTMENT SERVICE</h2>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-6">DETAILS</h3>
          
          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <InputField
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={(e)=>handleChange({target: {name:"serviceName", value: e.target.value}})}
                placeholder="Enter service name"
                required
              />
              {errors.serviceName && (
                <p className="text-xs text-red-500 mt-1">{errors.serviceName}</p>
              )}
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department:
              </label>
              <Dropdown
                triggerText={formData.department || '-- Select department --'}
                className="w-full max-w-xs"
              >
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleDepartmentChange(dept.id)}
                      className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </Dropdown>
              {errors.department && (
                <p className="text-xs text-red-500 mt-1">{errors.department}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Dropdown
                triggerText={formData.status}
                className="w-full max-w-xs"
              >
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Active')}
                    className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Inactive')}
                    className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
                  >
                    Inactive
                  </button>
                </div>
              </Dropdown>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;