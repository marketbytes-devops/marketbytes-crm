import React, { useState } from 'react';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import React Quill styles

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    // Round 1 fields
    name: 'Zaïd Abdül Majëëd',
    email: 'zaidchoki@gmail.com',
    gender: 'male',
    cv: '',
    designation: '',
    department: '',
    comments: '',
    // Profile Information fields
    dob: '',
    mobile: '974417716',
    status: 'Active',
    // Round 2 fields
    score: 8,
    interviewer: '',
    machineTest: 'No',
    // Round 4 fields
    interviewerHR: '', // Separate interviewer for Round 4
    scoreHR: '',
    commentsHR: 'Good',
    // Final Recruitment Status
    recruitmentStatus: 'Selected',
    interviewerFinal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle ReactQuill comments change for Round 1
  const handleCommentsChange = (value) => {
    setFormData({ ...formData, comments: value });
  };

  // Handle ReactQuill comments change for Round 4
  const handleCommentsHRChange = (value) => {
    setFormData({ ...formData, commentsHR: value });
  };

  // Handle file upload for CV
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, cv: file ? file.name : '' });
  };

  // Handle radio buttons for status and machine test
  const handleRadioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    // Add API call here to save data
  };

  return (
    <div className="p-6">
      {/* Candidate Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidate - Zaïd Abdül Majëëd</h1>
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">View Recruitment</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        </div>
      </div>

      {/* Round 1 - Introduction */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-800">
            Round 1 - Introduction <span className="text-green-600">(✓ Completed)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <InputField
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <InputField
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvUpload}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {formData.cv && (
              <p className="text-sm text-gray-600 mt-1">{formData.cv}</p>
            )}
          </div>

          {/* Designation Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">-- Select Designation --</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Team Lead">Team Lead</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Department Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department **</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">-- Select Department --</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>

        {/* Comments Section with React Quill */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
          <ReactQuill
            theme="snow"
            value={formData.comments}
            onChange={handleCommentsChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ],
            }}
            className="bg-white"
            placeholder="Enter your comments here..."
          />
        </div>
      

      {/* Additional Profile Information Section */}
       <br></br>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <InputField
              type="date"
              value={formData.dob}
              onChange={handleChange}
              name="dob"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <InputField
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              name="mobile"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Inactive
              </label>
            </div>
          </div>
        </div>
         <div className="mt-6">
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
          >
            Save
          </Button>
        </div>
     </div>
      {/* Round 2 - Technical */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-800">
            Round 2 - Technical <span className="text-green-600">(✓ Completed)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Score Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score *</label>
            <InputField
              type="number"
              value={formData.score}
              onChange={handleChange}
              name="score"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Comments Section with React Quill */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments *</label>
            <ReactQuill
              theme="snow"
              value={formData.comments}
              onChange={handleCommentsChange}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
              className="bg-white"
              placeholder="Enter your comments here..."
            />
          </div>

          {/* Interviewer Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
            <InputField
              type="text"
              value={formData.interviewer}
              onChange={handleChange}
              name="interviewer"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Machine Test */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Machine Test</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="machineTest"
                  value="Yes"
                  checked={formData.machineTest === 'Yes'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="machineTest"
                  value="No"
                  checked={formData.machineTest === 'No'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Save Button for Round 2 */}
          <div className="mt-6">
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Round 4 - HR */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-800">
            Round 4 - HR <span className="text-green-600">(✓ Completed)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Interviewer Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
            <InputField
              type="text"
              value={formData.interviewerHR}
              onChange={handleChange}
              name="interviewerHR"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Score Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <InputField
              type="number"
              value={formData.scoreHR}
              onChange={handleChange}
              name="scoreHR"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Comments Section with React Quill */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <ReactQuill
              theme="snow"
              value={formData.commentsHR}
              onChange={handleCommentsHRChange}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
              className="bg-white"
              placeholder="Enter your comments here..."
            />
          </div>

          {/* Save Button for Round 4 */}
         
        </div>
         <div className="flex justify-between items-center mb-4">
        
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Recruitment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recruitment Status</label>
            <select
              name="recruitmentStatus"
              value={formData.recruitmentStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          

          {/* Save Button for Final Status */}
          <div className="mt-6">
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Final Recruitment Status */}
   
        
      </div>

  );
};

export default CandidateForm;