import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddService = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get service ID from URL for edit mode

  const [formData, setFormData] = useState({
    serviceName: '',
    department: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({
    serviceName: '',
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments for the dropdown
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departments/');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      console.log('Departments:', data);
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      toast.error('Failed to load departments. Please try again.');
    }
  };

  // Fetch service data for edit mode
  useEffect(() => {
    fetchDepartments();
    if (id) {
      const fetchService = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/services/${id}/`);
          if (response.ok) {
            const data = await response.json();
            console.log('Service:', data);
            setFormData({
              serviceName: data.name || '',
              status: data.status
                ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
                : 'Active',
              department: data.department ? data.department.toString() : '',
            });
          } else {
            console.error('Failed to fetch service');
            toast.error('Failed to load service data.');
          }
        } catch (error) {
          console.error('Error fetching service:', error);
          toast.error('Error loading service data.');
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle department change
  const handleDepartmentChange = (departmentId) => {
    setFormData((prev) => ({ ...prev, department: departmentId }));
    setErrors((prev) => ({ ...prev, department: '' }));
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      serviceName: '',
      department: '',
    };

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service Name is required';
      isValid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle save
  const handleSave = async () => {
    if (validateForm()) {
      const payload = {
        name: formData.serviceName,
        status: formData.status.toLowerCase(),
        department: formData.department, // Send department ID
      };

      try {
        const url = id ? `http://localhost:8000/api/services/${id}/` : 'http://localhost:8000/api/services/';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(id ? 'Updated service:' : 'Saved service:', data);
          toast.success(id ? `Service updated: ${data.name || formData.serviceName}` : `Service saved: ${data.name || formData.serviceName}`);
          setTimeout(() => navigate('/clients/service/view'), 2000);
        } else {
          console.error('Error saving/updating:', data);
          toast.error(id ? 'Failed to update service.' : 'Failed to save service.');
        }
      } catch (err) {
        console.error('Network error:', err);
        toast.error('Error saving/updating service.');
      }
    }
  };

  // Handle reset
  const handleReset = () => {
    if (id) {
      // In edit mode, refetch service data
      const fetchService = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/services/${id}/`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              serviceName: data.name || '',
              status: data.status
                ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
                : 'Active',
              department: data.department ? data.department.toString() : '',
            });
            setErrors({ serviceName: '', department: '' });
          } else {
            console.error('Failed to fetch service');
            toast.error('Failed to reset form.');
          }
        } catch (error) {
          console.error('Error fetching service:', error);
          toast.error('Error resetting form.');
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    } else {
      // In add mode, reset to empty form
      setFormData({
        serviceName: '',
        status: 'Active',
        department: '',
      });
      setErrors({
        serviceName: '',
        department: '',
      });
    }
  };

  // Resolve department ID to name for display
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return '-- Select department --';
    const dept = departments.find((d) => d.id.toString() === departmentId.toString());
    return dept ? dept.name : '-- Select department --';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service</h1>
          <h2 className="text-lg font-semibold bg-gray-400 text-gray-700 mt-5 p-2">
            {id ? 'EDIT SERVICE INFO' : 'ADD SERVICE INFO'}
          </h2>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-6">SERVICE DETAILS</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
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
                  Select Department
                </label>
                <Dropdown
                  triggerText={getDepartmentName(formData.department)}
                  className="w-full max-w-xs"
                >
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDepartmentChange(dept.id.toString())}
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
                  disabled={loading}
                >
                  {id ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddService;