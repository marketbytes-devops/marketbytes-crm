import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = "http://127.0.0.1:8000/api/";
  const endpoints = {
    employees: `${apiBaseUrl}project-members/employees/`,
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const employeesRes = await axios.get(endpoints.employees);
        const formattedEmployees = employeesRes.data.map(emp => ({
          id: emp.id,
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          mobile: emp.mobile || "",
          address: emp.address || "",
        }));
        setEmployees(formattedEmployees);
        setFilteredEmployees(formattedEmployees);
        setError("");
      } catch (err) {
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply search filter
  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.mobile.includes(searchTerm) ||
      emp.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, filteredEmployees.length);
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Download Excel
  const downloadExcel = () => {
    const data = filteredEmployees.map((emp, index) => ({
      "#": index + 1, // Sequential SL No for export
      "ID": emp.employeeId,
      "Name": emp.name,
      "Email": emp.email,
      "Mobile": emp.mobile,
      "Address": emp.address,
    }));
    const ws = XLSX.utils.json_to_sheet(data, { header: ["#", "ID", "Name", "Email", "Mobile", "Address"] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
    XLSX.writeFile(wb, 'employee_report.xlsx');
  };

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle delete employee
  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        // Call backend DELETE API (adjust endpoint if needed)
        await axios.delete(`${endpoints.employees}${employeeId}/`);
        console.log('Employee deleted successfully:', employeeId);
        // Refetch data to update list and renumber SL No
        // Trigger refetch by updating a dependency (e.g., via a key or state)
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const employeesRes = await axios.get(endpoints.employees);
            const formattedEmployees = employeesRes.data.map(emp => ({
              id: emp.id,
              employeeId: emp.employeeId,
              name: emp.name,
              email: emp.email,
              mobile: emp.mobile || "",
              address: emp.address || "",
            }));
            setEmployees(formattedEmployees);
            setFilteredEmployees(formattedEmployees);
            setError("");
          } catch (err) {
            setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
        alert('Employee deleted successfully!');
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Failed to delete employee: ' + (err.response?.data?.message || err.message));
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">👤</span> Employees
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 border rounded"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search:"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1 border rounded"
          />
          <button
            onClick={downloadExcel}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Export
          </button>
        </div>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-600">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Mobile</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Action</th> {/* New Action column */}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="p-2 text-center">Loading...</td>
            </tr>
          ) : currentEmployees.length > 0 ? (
            currentEmployees.map((emp, index) => (
              <tr key={emp.id} className="border-t">
                <td className="p-2">{startIndex + index + 1}</td> {/* Sequential SL No: 1, 2, 3... */}
                <td className="p-2">{emp.employeeId}</td>
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.mobile}</td>
                <td className="p-2">{emp.address}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-2 text-center">No employees available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4 text-sm">
        <span>Showing {startIndex + 1} to {endIndex} of {filteredEmployees.length} entries</span>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-2 py-1 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;