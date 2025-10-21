import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import * as XLSX from "xlsx";

const Recruitment = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Zaid Abdal Majeed",
      email: "zaidchokli@gmail.com",
      mobile: "9744117716",
      gender: "male",
      round: "technical",
      status: "Selected",
      offered: "pending",
    },
  ]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMenu, setActionMenu] = useState({ show: false, candidateId: null });

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredCandidates(
      candidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.mobile.includes(searchTerm)
      )
    );
  }, [searchTerm, candidates]);

  // Handle action menu toggle
  const toggleActionMenu = (candidateId) => {
    setActionMenu(prev => ({
      show: prev.candidateId === candidateId ? !prev.show : true,
      candidateId: candidateId
    }));
  };

  // Handle action menu close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenu.show && !event.target.closest('.action-dropdown')) {
        setActionMenu({ show: false, candidateId: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actionMenu.show]);

  const totalPages = Math.ceil(filteredCandidates.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, filteredCandidates.length);
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (candidateId) => {
    navigate(`/hr/recruitment/editrecruitment/${candidateId}`);
    setActionMenu({ show: false, candidateId: null });
  };

  const handleView = (candidateId) => {
    // Navigate to view page or show modal - implement as needed
    alert(`View candidate details for ID: ${candidateId}`);
    setActionMenu({ show: false, candidateId: null });
  };

  const handleSwitchToEmployee = (candidateId) => {
    // Implement switch to employee functionality
    alert(`Switch candidate ID ${candidateId} to employee status`);
    setActionMenu({ show: false, candidateId: null });
  };

  const downloadExcel = () => {
    const data = filteredCandidates.map((candidate, index) => ({
      "#": index + 1,
      Name: candidate.name,
      Email: candidate.email,
      Mobile: candidate.mobile,
      Gender: candidate.gender,
      Round: candidate.round,
      Status: candidate.status,
      Offered: candidate.offered,
    }));
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["#", "Name", "Email", "Mobile", "Gender", "Round", "Status", "Offered"],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recruitment Report");
    XLSX.writeFile(wb, "recruitment_report.xlsx");
  };

  const handleAddCandidates = () => {
    navigate("/hr/recruitment/createrecruitment");
  };

  const getCandidateById = (id) => {
    return candidates.find(candidate => candidate.id === id);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">Recruitment</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleAddCandidates}
          >
            + Add Candidates
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <InputField
            type="text"
            placeholder="Search:"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={downloadExcel}
          >
            Export <span className="ml-1">▼</span>
          </Button>
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-2 text-left text-sm">#</th>
            <th className="p-2 text-left text-sm">NAME</th>
            <th className="p-2 text-left text-sm">EMAIL</th>
            <th className="p-2 text-left text-sm">MOBILE</th>
            <th className="p-2 text-left text-sm">GENDER</th>
            <th className="p-2 text-left text-sm">ROUND</th>
            <th className="p-2 text-left text-sm">STATUS</th>
            <th className="p-2 text-left text-sm">OFFERED</th>
            <th className="p-2 text-left text-sm">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentCandidates.length > 0 ? (
            currentCandidates.map((candidate) => (
              <tr key={candidate.id} className="border-t">
                <td className="p-2 text-sm">{candidate.id}</td>
                <td className="p-2 text-sm">{candidate.name}</td>
                <td className="p-2 text-sm">{candidate.email}</td>
                <td className="p-2 text-sm">{candidate.mobile}</td>
                <td className="p-2 text-sm">{candidate.gender}</td>
                <td className="p-2 text-sm">{candidate.round}</td>
                <td className="p-2 text-sm text-green-500">{candidate.status}</td>
                <td className="p-2 text-sm">{candidate.offered}</td>
                <td className="p-2 text-sm relative">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => toggleActionMenu(candidate.id)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2z"
                      />
                    </svg>
                  </button>
                  
                  {/* Action Dropdown */}
                  {actionMenu.show && actionMenu.candidateId === candidate.id && (
                    <div className="action-dropdown absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={() => handleEdit(candidate.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleView(candidate.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleSwitchToEmployee(candidate.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                      >
                        Switch to Employee
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="p-2 text-center text-sm">
                No candidates available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Showing {startIndex + 1} to {endIndex} of {filteredCandidates.length} entries</span>
        <div className="flex items-center space-x-2">
          <Button
            className={`p-1 border border-gray-300 rounded text-sm ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{currentPage}</span>
          <Button
            className={`p-1 border border-gray-300 rounded text-sm ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;