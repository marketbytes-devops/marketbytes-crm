import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, LayoutDashboard, User, Settings, Users, Folder, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/img-logo.png';

const Sidebar = ({ toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleLinkClick = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      toggleSidebar();
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/dashboard/dashboardd', label: ' Dashboard' },
        { to: '/dashboard/project', label: 'Project Dashboard' },
        { to: '/dashboard/client', label: 'Client Dashboard' },
        { to: '/dashboard/hr', label: 'HR Dashboard' },
        { to: '/dashboard/ticket', label: 'Ticket Dashboard' },
        { to: '/dashboard/finance', label: 'Finance Dashboard' },
        { to: '/dashboard/renewal', label: 'Renewal Dashboard' },
    
    
      ],
    },
    {
      label: 'Clients',
      icon: <Users className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/clients/add', label: 'Add Client' },
        { to: '/clients/view', label: 'View Client' },
      ],
    },
    {
      label: 'Lead',
      icon: <Users className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/leads/add', label: 'Add leads' },
        { to: '/leads/view', label: 'View leads' },
        { to: '/leads/proposal', label: 'Add Proposal Template' },
        { to: '/leads/rfp', label: 'Add RFP Template' },
      ],
    },
     {
      label: 'SupportRequest',
      icon: <Users className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/support/add', label: 'Add support' },
        { to: '/support/view', label: 'View support' },
      ],
    },
   
    {
      label: 'Works',
      icon: <Folder className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/projects/details', label: 'Projects' },
        { to: '/projects/add', label: 'Add Project' },
        { to: '/works/contracts', label: 'Contracts'}
      ],
    },

    {
    label: 'HR',
    icon: <Users className="w-5 h-5 mr-3" />,
    subItems: [
    
          { to: '/hr/employee/view', label: 'Employee List' },
          { to: '/hr/department/view', label: 'Department' },
          { to: '/hr/designation/', label: 'Designation' },
          { to:  'hr/attendance/attendancesummary', label: 'Attendance'},
          { to: 'hr/holiday/',label:'Holiday'},
          { to: 'hr/leaves/',label:'Leaves'},
          {to:'hr/overtimework/',label:'OvertimeWork'},
          {to:'hr/recruitment/recruitmentview',label:'Recruitment'}
        ],
      },

   

     {
      label: 'Renewal',
      icon: <User className="w-5 h-5 mr-3" />,
      subItems: [
        { to: '/renewal/create/renewal', label: 'Renewal' },
      ],
    },
    
    {
      label: 'Ticket',
      icon: <Users className="w-5 h-5 mr-3" />,
        subItems: [
        { to: '/ticket/ticketpage', label: 'Ticket' },

      ],
    },
    {
      label: 'Reports',
      icon: <Folder className="w-5 h-5 mr-3" />,
        subItems: [
        { to: '/reports/renewal-report', label: 'RenewalReport' },

      ],
    },
     

    { to: '/profile', label: 'Profile', icon: <User className="w-5 h-5 mr-3" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-3" /> },
    
    
  ];

   return (
    <motion.div
      className="fixed top-0 left-0 w-72 h-screen bg-white shadow-lg flex flex-col border-r border-gray-200"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)' }}
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Main sidebar navigation"
    >
      <div className="flex items-center justify-center py-4.5">
        <motion.img
          src={logo}
          className="w-24"
          alt="Prime Logo"
          aria-label="Prime Logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex items-center justify-between w-full p-3 rounded-lg text-black/80 hover:bg-gray-100 hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`submenu-${index}`}
                    aria-label={`Toggle ${item.label} menu`}
                  >
                    <span className="flex items-center text-sm font-medium">
                      {item.icon}
                      {item.label}
                    </span>
                    {openMenu === item.label ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 hover:text-black" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 hover:text-black" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openMenu === item.label && item.subItems && (
                      <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <motion.ul
                          id={`submenu-${index}`}
                          className="pl-4 mt-2 space-y-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <NavLink
                                to={subItem.to}
                                className={({ isActive }) =>
                                  `block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                      ? 'bg-black text-white'
                                      : 'text-gray-600 hover:bg-gray-200 hover:text-black'
                                  }`
                                }
                                onClick={handleLinkClick}
                                aria-current={location.pathname === subItem.to ? 'page' : undefined}
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      </div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-black/80 hover:bg-gray-100 hover:text-black'
                    }`
                  }
                  onClick={handleLinkClick}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
