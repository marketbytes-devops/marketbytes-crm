import { Users, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from '../../../components/Card';
import Title from '../../../components/Title';
import Button from '../../../components/Button';

const RenewalDashboard = () => {
  const navigate = useNavigate();
  
  const cardData = [
    { id: 1, Icon: Users, firstData: 2, secondData: "Total Clients" },
    { id: 2, Icon: Bookmark, firstData: 0, secondData: "Active Domains" },
    { id: 3, Icon: Bookmark, firstData: 0, secondData: "Pending Domains" },
    { id: 4, Icon: Bookmark, firstData: 0, secondData: "Expired Domains" },
    { id: 5, Icon: Bookmark, firstData: 0, secondData: "Active Hosting" },
    { id: 6, Icon: Bookmark, firstData: 0, secondData: "Pending Hosting" },
    { id: 7, Icon: Bookmark, firstData: 0, secondData: "Expired Hosting" },
    { id: 8, Icon: Bookmark, firstData: 0, secondData: "Active SSL" },
    { id: 9, Icon: Bookmark, firstData: 0, secondData: "Pending SSL" },
    { id: 10, Icon: Bookmark, firstData: 0, secondData: "Expired SSL" },
    { id: 11, Icon: Bookmark, firstData: 0, secondData: "Active Emails" },
    { id: 12, Icon: Bookmark, firstData: 0, secondData: "Pending Emails" },
    { id: 13, Icon: Bookmark, firstData: 0, secondData: "Expired Emails" },
  ];

  const handleCardClick = (secondData) => {
    if (["Active Domains", "Pending Domains", "Expired Domains"].includes(secondData)) {
      navigate('/reports/renewal-report');
    } else if (["Active Hosting", "Pending Hosting", "Expired Hosting"].includes(secondData)) {
      navigate('/reports/renewal-report-hosting');
    } else if (["Active SSL", "Pending SSL", "Expired SSL"].includes(secondData)) {
      navigate('/reports/renewal-report-ssl');
    } else if (["Active Emails", "Pending Emails", "Expired Emails"].includes(secondData)) {
      navigate('/reports/renewal-report-email');
    }
  };

  return (
    <div className="p-6">
      <Title title="Renewal Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map(({ id, Icon, firstData, secondData }) => (
          [
            "Active Domains", "Pending Domains", "Expired Domains",
            "Active Hosting", "Pending Hosting", "Expired Hosting",
            "Active SSL", "Pending SSL", "Expired SSL",
            "Active Emails", "Pending Emails", "Expired Emails"
          ].includes(secondData) ? (
            <Button
              key={id}
              onClick={() => handleCardClick(secondData)}
              className="bg-white hover:bg-gray-100"
            >
              <Card
                Icon={Icon}
                firstData={firstData}
                secondData={secondData}
              />
            </Button>
          ) : (
            <Card
              key={id}
              Icon={Icon}
              firstData={firstData}
              secondData={secondData}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default RenewalDashboard;