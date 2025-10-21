import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropdown from "../../../components/Dropdown"; // your Dropdown
import InputField from "../../../components/InputField"; // your InputField
import { Pencil, Trash2 } from "lucide-react";

// Mock categories
const mockCategories = [
  { id: 1, name: "E-Commerce Development" },
  { id: 2, name: "Mobile App Development" },
  { id: 3, name: "UI/UX Design" },
  { id: 4, name: "Digital Marketing" },
];

export default function AddRfpMailTemplate() {
  const [formData, setFormData] = useState({
    category: "",
    template: "",
  });

  const [templates, setTemplates] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (!formData.category || !formData.template) {
      alert("Please select category and enter template body");
      return;
    }

    if (editId) {
      // Update existing template
      setTemplates(
        templates.map((t) =>
          t.id === editId
            ? { ...t, category: formData.category, template: formData.template }
            : t
        )
      );
      setEditId(null);
    } else {
      // Add new template
      const newEntry = {
        id: templates.length + 1,
        category: formData.category,
        template: formData.template,
      };
      setTemplates([...templates, newEntry]);
    }

    setFormData({ category: "", template: "" });
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter((t) => t.id !== id));
    if (editId === id) {
      setFormData({ category: "", template: "" });
      setEditId(null);
    }
  };

  const handleEdit = (id) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setFormData({ category: template.category, template: template.template });
      setEditId(id);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">ADD RFP MAIL BODY TEMPLATE</h2>

      {/* Category Section */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center gap-3">
          {/* Dropdown for selecting category */}
          <Dropdown triggerText="Select Category">
            <div className="space-y-2">
              {mockCategories.map((cat) => {
                const alreadyUsed = templates.some(
                  (t) => t.category === cat.name && t.id !== editId
                );
                return (
                  <button
                    key={cat.id}
                    disabled={alreadyUsed}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: cat.name }))
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      alreadyUsed
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </Dropdown>

          {/* InputField showing selected category */}
          <div className="flex-1">
            <InputField
              type="text"
              placeholder="Selected Category"
              value={formData.category}
              onChange={() => {}} // read-only
              title="Selected category"
            />
          </div>
        </div>
      </div>

      {/* Quill Editor */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          RFP Mail Body Template <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={formData.template}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, template: value }))
          }
          className="bg-white"
        />
      </div>

      {/* Save / Update button */}
      <button
        onClick={handleSave}
        className={`${
          editId
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-emerald-500 hover:bg-emerald-600"
        } text-white px-6 py-2 rounded-md font-medium`}
      >
        {editId ? "✎ Update" : "✔ Save"}
      </button>

      {/* Table */}
      <div className="mt-6 border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-cyan-600 text-white text-left">
              <th className="p-2 w-16">SL.</th>
              <th className="p-2">Category Name</th>
              <th className="p-2 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No templates added yet
                </td>
              </tr>
            ) : (
              templates.map((t, idx) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{t.category}</td>
                  <td className="p-2 flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(t.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
