import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import InputField from '../../../../components/InputField';

const AddDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get departmentId from URL

  const [formData, setFormData] = useState({
    departmentName: '',
    email: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({
    departmentName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch department data for edit mode
  useEffect(() => {
    if (id) {
      const fetchDepartment = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/departments/${id}/`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              departmentName: data.name,
              email: data.email,
              status: data.status, // Ensure consistent casing
            });
          } else {
            console.error('Failed to fetch department');
            alert('Failed to load department data.');
          }
        } catch (error) {
          console.error('Error fetching department:', error);
          alert('Error loading department data.');
        } finally {
          setLoading(false);
        }
      };
      fetchDepartment();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      departmentName: '',
      email: '',
    };

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const payload = {
        name: formData.departmentName, // map frontend → backend
        email: formData.email,
        status: formData.status // Ensure backend expects lowercase
      };

      try {
        const url = id
          ? `http://localhost:8000/api/departments/${id}/`
          : 'http://localhost:8000/api/departments/';
          
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json(); // get saved/updated department from backend

        if (response.ok) {
          console.log(id ? 'Updated department:' : 'Saved department:', data);
          alert(id ? `Department updated: ${data.name} (${data.status})` : `Department saved: ${data.name} (${data.status})`);
          navigate('/clients/dept/view');
        } else {
          console.error('Error saving/updating:', data);
          alert(id ? 'Failed to update department.' : 'Failed to save department.');
        }
      } catch (err) {
        console.error('Network error:', err);
        alert('Error saving/updating department.');
      }
    }
  };

  const handleReset = () => {
    if (id) {
      // In edit mode, refetch the department data to reset the form
      const fetchDepartment = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/departments/${id}/`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              departmentName: data.name,
              email: data.email,
              status: data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase(),
            });
            setErrors({ departmentName: '', email: '' });
          } else {
            console.error('Failed to fetch department');
            alert('Failed to reset form.');
          }
        } catch (error) {
          console.error('Error fetching department:', error);
          alert('Error resetting form.');
        } finally {
          setLoading(false);
        }
      };
      fetchDepartment();
    } else {
      // In add mode, reset to empty form
      setFormData({
        departmentName: '',
        email: '',
        status: 'Active',
      });
      setErrors({
        departmentName: '',
        email: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Department</h1>
          <h2 className="text-lg font-semibold bg-gray-400 text-gray-700 mt-5">
            {id ? 'EDIT DEPARTMENT INFO' : 'ADD DEPARTMENT INFO'}
          </h2>
        </div>

        {/* Department Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-6">DEPARTMENT DETAILS</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-6">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <InputField
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={(e)=>handleChange({target: {name:"departmentName", value: e.target.value}})}
                  placeholder="Enter department name"
                  required
                />
                {errors.departmentName && (
                  <p className="text-xs text-red-500 mt-1">{errors.departmentName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e)=>handleChange({target: {name:"email", value: e.target.value}})}
                  placeholder="Enter email address"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Multiple emails separate by comma</p>
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
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Active')}
                      className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Inactive')}
                      className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      Inactive
                    </button>
                  </div>
                </Dropdown>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {id ? 'Update' : 'Save'}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;