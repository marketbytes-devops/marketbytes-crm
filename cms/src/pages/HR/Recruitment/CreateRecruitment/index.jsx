import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill theme
import { useNavigate } from "react-router-dom";
const AddNewCandidates = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    designation: "",
    department: "",
    comments: "",
    dateOfBirth: "",
    mobile: "",
    image: null,
    imagePreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = () => {
    console.log("Saved data:", formData);
  };
  const navigate = useNavigate();
    const handleviewCandidates = () => {
    navigate("/hr/recruitment/recruitmentview");
  };
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between  mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Candidates
        </h2>
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"  onClick={handleviewCandidates} >
          Back 
        </button>
      </div>

      {/* Form */}
      <div className="bg-gray-50 p-8 rounded-lg shadow">
        <h3 className="text-center text-lg font-semibold mb-8 tracking-wide">
          STAGE 1
        </h3>

        {/* Name */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Designation */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Designation <span className="text-red-500">*</span>
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">--</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
          </select>
        </div>

        {/* Department */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">--</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Image Upload + Preview */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Upload
          </label>
          <div className="flex flex-col items-start">
            <div className="w-32 h-32 bg-white border border-gray-300 rounded-md mb-3 flex items-center justify-center overflow-hidden">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
            <input
              type="file"
              id="upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById("upload").click()}
              className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Comments (React Quill) */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">
            Comments
          </label>
          <ReactQuill
            theme="snow"
            value={formData.comments}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, comments: value }))
            }
            className="bg-white border border-gray-200 rounded-md"
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-5">
          <label className="block font-medium mb-2 text-gray-700">
            Date Of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Mobile */}
        <div className="mb-8">
          <label className="block font-medium mb-2 text-gray-700">
            Mobile
          </label>
          <input
            type="tel"
            name="mobile"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
        >
          ✔ Save
        </button>
      </div>
    </div>
  );
};

export default AddNewCandidates;
