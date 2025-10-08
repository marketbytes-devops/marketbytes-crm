import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import TicketSidebar from '../TicketSettings/TicketSidebar';

// Custom styles to remove margins and adjust height
const styles = `
  .no-margins .ql-container {
    padding: 0;
    margin: 0;
  }
  .no-margins .ql-editor {
    padding: 0;
    margin: 0;
    min-height: 32px; /* Adjust as needed */
  }
`;

const ReplyTemplateForm = () => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ heading, text });
    // Add your form submission logic here
  };

  return (
    <div className="flex">
      <style>{styles}</style> {/* Inject custom styles */}
      <TicketSidebar />
      <div className="flex-1 p-6 ml-64">
        <h2 className="text-xl font-semibold mb-4">Add New Template</h2>
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Heading <span className="text-red-500">*</span></label>
            <InputField
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter template heading"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Text <span className="text-red-500">*</span></label>
            <div className=" border-gray-200 rounded no-margins"> {/* Add no-margins class */}
              <ReactQuill
                value={text}
                onChange={setText}
                placeholder="Enter template text"
                className="h-32"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>
          <div className='mt-15'>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white hover:bg-green-600 w-full p-2 rounded"
          >
            Save
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyTemplateForm;