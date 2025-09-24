import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import TicketSidebar from '../TicketSettings/TicketSidebar';

const ReplyTemplateForm = () => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ heading, text });
    // Add your form submission logic here
  };

  // Simple formatting functions (basic implementation)
  const handleBold = () => {
    setText((prev) => `${prev}<b>${window.getSelection().toString() || 'Bold text'}</b>`);
  };

  const handleItalic = () => {
    setText((prev) => `${prev}<i>${window.getSelection().toString() || 'Italic text'}</i>`);
  };

  const handleUnderline = () => {
    setText((prev) => `${prev}<u>${window.getSelection().toString() || 'Underlined text'}</u>`);
  };

  return (
    <div className="flex">
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
            <div className="bg-white border border-gray-200 rounded p-2">
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  onClick={handleBold}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <b>B</b>
                </button>
                <button
                  type="button"
                  onClick={handleItalic}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <i>I</i>
                </button>
                <button
                  type="button"
                  onClick={handleUnderline}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <span>15</span>
                </button>
                <button
                  type="button"
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <span>≡</span>
                </button>
                <button
                  type="button"
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <span>≡</span>
                </button>
                <button
                  type="button"
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <span>≡</span>
                </button>
                <button
                  type="button"
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <span>×</span>
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter template text"
                className="w-full h-32 p-2 border-none focus:outline-none resize-none"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white hover:bg-green-600 w-full p-2 rounded"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReplyTemplateForm;