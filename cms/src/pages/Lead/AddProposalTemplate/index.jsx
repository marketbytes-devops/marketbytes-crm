import React, { useState } from "react";
import InputField from "../../../components/InputField";
import { Edit, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProposalTemplate = () => {
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([
    { id: 1, name: "Ecommerce", proposal: "", body: "" },
    { id: 2, name: "EC Proposal", proposal: "", body: "" },
    { id: 3, name: "Digital Marketing Proposal", proposal: "", body: "" },
  ]);
  const [editId, setEditId] = useState(null);

  const [proposal, setProposal] = useState("");
  const [body, setBody] = useState("");

  const handleSave = () => {
    const newData = {
      id: editId ? editId : templates.length + 1,
      name: templateName,
      proposal,
      body,
    };

    if (editId) {
      setTemplates(templates.map((tpl) => (tpl.id === editId ? newData : tpl)));
      setEditId(null);
    } else {
      setTemplates([...templates, newData]);
    }

    setTemplateName("");
    setProposal("");
    setBody("");
  };

  const handleEdit = (tpl) => {
    setTemplateName(tpl.name);
    setProposal(tpl.proposal);
    setBody(tpl.body);
    setEditId(tpl.id);
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter((tpl) => tpl.id !== id));
  };

  // Custom toolbar options
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // toggled buttons
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video", "code-block"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
  ];

  return (
    <div className="w-full p-4 bg-white">
      <h2 className="font-semibold mb-4">ADD PROPOSAL TEMPLATE</h2>

      {/* Template Name */}
      <div className="mb-4">
        <label className="block font-medium mb-1">
          Template Name <span className="text-red-500">*</span>
        </label>
        <InputField
          type="text"
          placeholder=""
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      {/* Proposal Template */}
      <div className="mb-6">
        <label className="block font-medium mb-1">
          Proposal Template <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={proposal}
          onChange={setProposal}
          modules={modules}
          formats={formats}
          className="min-h-[120px] mb-4"
        />
      </div>

      {/* Body Content */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Body Content</label>
        <ReactQuill
          theme="snow"
          value={body}
          onChange={setBody}
          modules={modules}
          formats={formats}
          className="min-h-[120px] mb-4"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!templateName.trim() || !proposal.trim()} // disable if either is empty
        className={`px-4 py-2 rounded mb-6 ${
          !templateName.trim() || !proposal.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {editId ? "Update" : "Save"}
      </button>

      {/* Table */}
      <table className="w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-cyan-600 text-white">
            <th className="px-2 py-2 border">SL.</th>
            <th className="px-2 py-2 border">Template Name</th>
            <th className="px-2 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl, i) => (
            <tr key={tpl.id} className="text-center">
              <td className="border px-2 py-1">{i + 1}</td>
              <td className="border px-2 py-1 text-left">{tpl.name}</td>
              <td className="border px-2 py-3 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(tpl)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalTemplate;
