import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../helpers/apiClient";

const API_URL = "http://127.0.0.1:8000/api/";

const ProjectDetails = () => {
  const [projects, setProjects] = useState([]);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get(`${API_URL}works/`);
        setProjects(res.data);
      } catch (err) {
        console.error(" Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Work Name</th>
              <th className="border px-4 py-2">Client</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Deadline</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{p.id}</td>
                <td className="border px-4 py-2">{p.workName}</td>
                <td className="border px-4 py-2">{p.client?.name || "N/A"}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2">
                  {p.cost} {p.currency}
                </td>
                <td className="border px-4 py-2">
                  {p.deadline || "No deadline"}
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectDetails;
