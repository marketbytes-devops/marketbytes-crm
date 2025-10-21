import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../../components/Button";
import * as XLSX from 'xlsx';
import axios from "axios";

const Employees = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("Employees page rendered, Location state:", state);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    employee: "All",
    skills: "All",
    designation_name: "All",
    department: "All",
    search: "",
    role: "All",
  });
  const [showActionButton, setShowActionButton] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const actionMenuRef = useRef(null);

  const apiBaseUrl = "http://localhost:8000/api/";
  const endpoints = {
    employees: `${apiBaseUrl}project-members/employees`,
    departments: `${apiBaseUrl}departments/`,
    designation_name: `${apiBaseUrl}designation/`,
  };

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching employee list data");
      const cacheBuster = `?_=${new Date().getTime()}`;
      const [employeesRes, departmentsRes, designationsRes] = await Promise.all([
        axios.get(`${endpoints.employees}${cacheBuster}`),
        axios.get(`${endpoints.departments}${cacheBuster}`),
        axios.get(`${endpoints.designation_name}${cacheBuster}`),
      ]);
      console.log("Fetched employees data:", JSON.stringify(employeesRes.data, null, 2));
      console.log("Fetched departments data:", JSON.stringify(departmentsRes.data, null, 2));
      console.log("Fetched designations data:", JSON.stringify(designationsRes.data, null, 2));

      let updatedEmployees = employeesRes.data;

      // Extract unique skills from employees
      const allSkills = [];
      updatedEmployees.forEach(emp => {
        const skillsStr = emp.skills || '';
        const skillsArr = skillsStr
          .split(',')
          .map(s => s.trim())
          .filter(s => s !== '');
        skillsArr.forEach(skillId => {
          if (!allSkills.some(skill => skill.id === skillId)) {
            allSkills.push({ id: skillId, name: ` ${skillId}` });
          }
        });
      });
      setSkills(allSkills);
      console.log("Extracted skills:", allSkills);

      // Update local state with edited employee if provided
      if (state?.updatedEmployee) {
        console.log("Applying updated employee from state:", state.updatedEmployee);
        updatedEmployees = updatedEmployees.map(emp =>
          emp.id === state.updatedEmployee.id ? { ...emp, ...state.updatedEmployee } : emp
        );
      }
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setDepartments(departmentsRes.data);
      setDesignations(designationsRes.data);
      setError("");
      console.log("Employee list data fetched successfully:", updatedEmployees);
    } catch (err) {
      setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount or when refresh flag is set
  useEffect(() => {
    fetchData();
  }, [state?.refresh]);

  // Apply filters
  useEffect(() => {
    console.log("Applying filters:", filters);
    console.log("Before filtering, employees:", employees.length);
    let filtered = [...employees];

    if (filters.status !== "All") {
      filtered = filtered.filter(emp => emp.logIn?.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.employee !== "All") {
      filtered = filtered.filter(emp => emp.name === filters.employee);
    }
    if (filters.skills !== "All") {
      filtered = filtered.filter(emp => {
        const skillsStr = emp.skills || '';
        const skillsArr = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
        return skillsArr.includes(filters.skills);
      });
    }
    if (filters.designation_name !== "All") {
      filtered = filtered.filter(emp => emp.designation_id === Number(filters.designation_name));
    }
    if (filters.role !== "All") {
      filtered = filtered.filter(emp => emp.role?.toLowerCase() === filters.role.toLowerCase());
    }
    if (filters.department !== "All") {
      filtered = filtered.filter(emp => emp.department_id === Number(filters.department));
    }
    if (filters.search) {
      filtered = filtered.filter(emp =>
        (emp.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
         emp.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
         emp.role?.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    console.log("After filtering, employees:", filtered.length);
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [filters, employees]);

  // Handle click outside to close the action menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, filteredEmployees.length);
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
  console.log("Current employees:", currentEmployees);

  // Download Excel
  const downloadExcel = () => {
    const data = filteredEmployees.map((emp, index) => ({
      "#": index + 1,
      Name: emp.name || "N/A",
      Email: emp.email || "N/A",
      Role: emp.role || "N/A",
      Status: emp.logIn || "N/A",
      Designation: emp.designation || "N/A",
      Department: emp.department || "N/A",
      Skills: (emp.skills || '')
        .split(',')
        .map(skillId => skills.find(s => s.id === skillId.trim())?.name || "N/A")
        .filter(name => name !== "N/A")
        .join(", "),
    }));
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["#", "Name", "Email", "Role", "Status", "Designation", "Department", "Skills"],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
    XLSX.writeFile(wb, 'employee_report.xlsx');
  };

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle filter change
  const handleFilterChange = (e, key) => {
    const value = e.target.value;
    console.log("Filter changed:", key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const roleOptions = ["All", "Admin", "Employee", "Team Lead"];
  const statusOptions = ["All", "Active", "Inactive"];

  return (
    <div className="bg-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-12 gap-4">
        {/* Filters */}
        <div className="col-span-3 bg-gray-100 rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Filter Results</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-md font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange(e, 'status')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Select Employee</label>
              <select
                value={filters.employee}
                onChange={(e) => handleFilterChange(e, 'employee')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name || "N/A"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Skills</label>
              <select
                value={filters.skills}
                onChange={(e) => handleFilterChange(e, 'skills')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Designation</label>
              <select
                value={filters.designation_name}
                onChange={(e) => handleFilterChange(e, 'designation_name')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {designations.map(des => (
                  <option key={des.id} value={des.id}>{des.designation_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange(e, 'role')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange(e, 'department')}
                className="w-full p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <Button className="bg-green-500 text-black">Apply</Button>
              <Button
                className="bg-gray-500 text-black"
                onClick={() => setFilters({
                  status: "All",
                  employee: "All",
                  skills: "All",
                  designation_name: "All",
                  department: "All",
                  search: "",
                  role: "All",
                })}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="flex justify-end gap-2 mb-4">
            <Button className="bg-green-500 text-black" onClick={() => navigate("/hr/employee/add")}>
              Add New Employee +
            </Button>
            <Button className="bg-gray-200 text-black" onClick={() => navigate("/hr/employeelist/employeelist")}>
              List
            </Button>
            <Button className="bg-gray-200 text-black" onClick={downloadExcel}>
              Export
            </Button>
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                className="border p-1 rounded-md text-sm"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
            <input
              type="text"
              placeholder="Search:"
              value={filters.search}
              onChange={(e) => handleFilterChange(e, 'search')}
              className="p-1 border border-gray-300 rounded-md text-sm w-64"
            />
          </div>

          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-sm"></th>
                <th className="p-2 text-left text-sm">#</th>
                <th className="p-2 text-left text-sm">Name</th>
                <th className="p-2 text-left text-sm">Email</th>
                <th className="p-2 text-left text-sm">Role</th>
                <th className="p-2 text-left text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-2 border-b text-center text-sm">
                    Loading employees...
                  </td>
                </tr>
              ) : currentEmployees.length > 0 ? (
                currentEmployees.map((emp, index) => (
                  <tr key={emp.id} className="border-t">
                    <td className="p-2 text-sm relative">
                      <div className="flex flex-col items-start">
                        <button
                          className="bg-gray-200 p-1 rounded-md mb-1"
                          onClick={() => setShowActionButton(showActionButton === emp.id ? null : emp.id)}
                        >
                          +
                        </button>
                        {showActionButton === emp.id && (
                          <button
                            className="bg-blue-500 text-white p-1 rounded-md"
                            onClick={() => setShowActionMenu(showActionMenu === emp.id ? null : emp.id)}
                          >
                            Action
                          </button>
                        )}
                      </div>
                      {showActionMenu === emp.id && (
                        <div ref={actionMenuRef} className="absolute right-0 mt-8 w-32 bg-white border rounded-md shadow-lg z-10">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setShowActionMenu(null);
                              if (!emp.id) {
                                console.error("Employee ID is missing for navigation");
                                setError("Cannot navigate: Employee ID is missing");
                                return;
                              }
                              console.log("View clicked for employee:", emp.id);
                              navigate(`/hr/employeeprofile/${emp.id}`);
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            View
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setShowActionMenu(null);
                              if (!emp.id) {
                                console.error("Employee ID is missing for navigation");
                                setError("Cannot navigate: Employee ID is missing");
                                return;
                              }
                              console.log("Edit clicked for employee:", emp.id);
                              navigate(`/hr/editemployee/${emp.id}`);
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setShowActionMenu(null);
                              console.log("Delete clicked for employee:", emp.id);
                              // Handle Delete action
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-sm">{index + 1}</td>
                    <td className="p-2 text-sm">{emp.name || "N/A"}</td>
                    <td className="p-2 text-sm">{emp.email || "N/A"}</td>
                    <td className="p-2 text-sm">{emp.role || "N/A"}</td>
                    <td className="p-2 text-sm">
                      <span className={emp.logIn === "Enable" ? "text-green-500" : "text-red-500"}>
                        {emp.logIn === "Enable" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-2 border-b text-center text-sm">
                    No employees available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-2 text-sm">
            <p>
              Showing {startIndex + 1} to {endIndex} of {filteredEmployees.length} entries
            </p>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`p-1 border border-gray-300 rounded text-sm ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Previous
              </Button>
              <span className="text-sm">{currentPage}</span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-1 border border-gray-300 rounded text-sm ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Employees;

