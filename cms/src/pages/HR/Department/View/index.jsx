import React from 'react';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import Dropdown from '../../../../components/Dropdown';
import { useNavigate } from 'react-router-dom';

const DepartmentAdd = () => {
  const departments = [
    { id: 1, name: 'Business Development', url: 'https://docs.google.com/spreadsheets/d/1l_9nThOUgnqFoIuA0VwxyEm7500CyETJB8jabykuTI/edit#gid=0', members: 2, serviceText: 'SERVICE TEXT CAR' },
    { id: 2, name: 'Director Board', url: 'https://docs.google.com/spreadsheets/d/1cNgK3MCixA4rHRe8gMsgaCJYNfGoyWujGYEdylfs/edit?usp=sharing', members: 2, serviceText: 'Director Board' },
    { id: 3, name: 'Development', url: 'https://docs.google.com/spreadsheets/d/1x7QHMHj3BKZseKOOs_wflq2m4FX70SWWKQdSxCG65M/edit?usp=sharing', members: 11, serviceText: 'Development Department' },
    { id: 4, name: 'Digital Marketing', url: 'https://docs.google.com/spreadsheets/d/1iIeqdJhipz6bAt064imf80eTAA2GMUhXcl4ipnCg/edit?usp=sharing', members: 5, serviceText: 'Digital Marketing Department' },
    { id: 5, name: 'Creative Designing', url: 'https://docs.google.com/spreadsheets/d/1RVQ_ugCUHeSNTpU5uidHGCAaZ3hMQPILrqHK-Q8E/edit?usp=sharing', members: 3, serviceText: 'Creative Designing Team' },
    { id: 6, name: 'Internal', url: '', members: 0, serviceText: 'NOT ADDED', isNotAdded: true },
    { id: 7, name: 'test', url: '', members: 2, serviceText: 'NOT ADDED', isNotAdded: true },
    { id: 8, name: 'Human', url: '', members: 0, serviceText: 'NOT ADDED', isNotAdded: true },
  ];

  const navigate = useNavigate();
  const handledepartmentadd = () => {
    navigate("/hr/department/add");
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="w-6 h-6 mr-3 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs">👤</span>
          </span>
          Department
        </h2>
        <Button className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md" onClick={handledepartmentadd}>
          Add Department +
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-left font-medium">#</th>
              <th className="py-3 px-4 text-left font-medium">DEPARTMENT</th>
              <th className="py-3 px-4 text-left font-medium">WORKSHEET URL</th>
              <th className="py-3 px-4 text-left font-medium">SERVICE TEXT</th>
              <th className="py-3 px-4 text-left font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{dept.name}</span>
                    <span className="text-green-600 text-xs mt-1">{dept.members} Members</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {dept.url ? (
                    <a
                      href={dept.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {dept.url}
                    </a>
                  ) : (
                    <span className="text-gray-400">NOT ADDED</span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-700">{dept.serviceText}</td>
                <td className="py-3 px-4">
                  {dept.isNotAdded ? (
                    <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                      NOT ADDED
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentAdd;