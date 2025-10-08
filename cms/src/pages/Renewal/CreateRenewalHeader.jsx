import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button'; 

const CreateRenewalHeader = () => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'ssl':
        navigate('/renewal/create/renewal-ssl');
        break;
      case 'hosting':
        navigate('/renewal/create/renewal-hosting');
        break;
      case 'domain':
        navigate('/renewal/create/renewal-domain');
        break;
      case 'email':
        navigate('/renewal/create/renewal-email');
        break;
      default:
        navigate('/renewal/create/renewal-header');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="w-20 h-10">
          <Button
            onClick={() => navigate('/renewal/create/renewal')}
            className="bg-gray-700 text-white px-4 py-2 rounded w-full h-full flex items-center justify-center"
          >
            Back
          </Button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => handleTabClick('domain')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Domain
        </Button>
        <Button
          onClick={() => handleTabClick('ssl')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          SSL
        </Button>
        <Button
          onClick={() => handleTabClick('hosting')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Hosting
        </Button>
        <Button
          onClick={() => handleTabClick('email')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Email
        </Button>
      </div>
    </div>
  );
};

export default CreateRenewalHeader;