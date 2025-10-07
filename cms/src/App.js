import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import "./index.css";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/DashboardHome/AdminDashboard";
import ProjectDashboard from "./pages/DashboardHome/ProjectDashboard";
import ClientDashboard from "./pages/DashboardHome/ClientDashboard";
import HRDashboard from "./pages/DashboardHome/HRDashboard";
import AddClient from "./pages/Client/AddClient";
import ViewClient from "./pages/Client/ViewClient";
import ProjectDetails from "./pages/Project/ProjectDetails";
import AddProject from "./pages/Project/AddProject";
import TicketDashboard from "./pages/DashboardHome/TicketDashboard"
import FinanceDashboard from "./pages/DashboardHome/FinanceDashboard";
import RenewalDashboard from "./pages/DashboardHome/RenewalDashboard";
import Dashboardd from "./pages/DashboardHome/Dashboard";
import ViewLead from "./pages/Lead/ViewLead";
import AddLead from "./pages/Lead/AddLead";
import AddProposalTemplate from "./pages/Lead/AddProposalTemplate";
import AddRFPTemplate from "./pages/Lead/AddRFPTemplate";
import AddSupportRequest from "./pages/SupportRequest/AddSupportRequest";
import ViewSupportRequest from "./pages/SupportRequest/ViewSupportRequest";
import Renewal from"./pages/Renewal/Renewal";
import Ticket from"./pages/Ticket/Ticket";
import CreateTicket from "./pages/Ticket/CreateTicket";
import TicketAgent from "./pages/Settings/TicketSettings/TicketAgent";
import TicketType from "./pages/Settings/TicketSettings/TicketType";
import TicketChannel from "./pages/Settings/TicketSettings/TicketChannel";
import ReplayTemplate from "./pages/Settings/TicketSettings/ReplayTemplate";
import TicketSettings from "./pages/Settings/TicketSettings/TicketSidebar";

import ViewEmployee from "./pages/HR/EmployeeList/ViewEmployee";
import View from "./pages/HR/Department/View";
import ViewDept from"./pages/Client/Department/ViewDept";
import AddDept from"./pages/Client/Department/AddDept";
import ViewService from "./pages/Client/Department/ViewService";
import AddService from "./pages/Client/Department/AddService";

import KanbanBoard from "./pages/Lead/KanbanBoard";
import LeadForm from "./pages/Lead/LeadForm";

import LeadSettings from "./pages/Settings/LeadSettings/LeadSidebar";
import LeadSource from "./pages/Settings/LeadSettings/LeadSource";
import LeadStatus from "./pages/Settings/LeadSettings/LeadStatus";
import LeadAgent from "./pages/Settings/LeadSettings/LeadAgent";
import LeadCategory from "./pages/Settings/LeadSettings/LeadCategory";


import ContractsView from "./pages/Contracts/ContractsView"


const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login setIsAuthenticated={setIsAuthenticated} />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Layout
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <AdminDashboard />,
        },
        {
          path: "/dashboard/dashboardd",
          element: <Dashboardd />,
        },
        {
          path: "/dashboard/project",
          element: <ProjectDashboard />,
        },
        {
          path: "/dashboard/client",
          element: <ClientDashboard />,
        },
        {
          path: "/dashboard/hr",
          element: <HRDashboard />,
        },
        {
          path: "/clients/add",
          element: <AddClient />,
        },
        {
          path: "/clients/view",
          element: <ViewClient />,
        },

        {
          path: "/projects/:id",
          element: <ProjectDetails />,
        },
        {
          path: "/projects/add",
          element: <AddProject />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        
       {
          path: "/dashboard/ticket",
          element: <TicketDashboard />,
        },
        {
          path: "/dashboard/finance",
          element: <FinanceDashboard />,
        },
        {
          path: "/dashboard/renewal",
          element: <RenewalDashboard />,
        },
       {
        path:"/leads/add",
        element: <AddLead />
       },
       {
       path:"/leads/view",
       element: <ViewLead />
       },
       {
        path:"/leads/proposal",
        element: <AddProposalTemplate />
       },
       {
        path:"/leads/rfp",
        element: <AddRFPTemplate />
       },
       {
        path:"/support/add",
        element: <AddSupportRequest />
       },
       {
        path:"/support/view",
        element: <ViewSupportRequest />
       },
       {
        path:"/renewal/renewaal",
        element: <Renewal />
       },
        {
        path:"/ticket/ticketpage",
        element: <Ticket />
       },
       {
        path:"/ticket/create",
        element: <CreateTicket />
       },
       {
        path:"/ticketsettings/ticketagent",
        element: <TicketAgent />
       },
       {
        path:"/ticketsettings/tickettype",
        element: <TicketType />
       },
       {
        path:"/ticketsettings/ticketchannel",
        element: <TicketChannel />
       },
      {
      path:"/ticketsettings/replaytemplate",
      element: <ReplayTemplate />
      },
      {
        path:"/ticketsettings/ticketsidebar",
        element: <TicketSettings />
      },
      {
          path:'/hr/employee/view',
          element: <ViewEmployee/>,
        },
        {
          path:'/hr/department/view',
          element: <View/>,
        },
        {
          path: '/clients/dept/view',
          element: <ViewDept/>,

        },
         {
          path: '/clients/dept/add',
          element: <AddDept/>,
        },
        {
          path:'/clients/service/view',
          element: <ViewService/>
        },
        {
          path:'/clients/service/add',
          element: <AddService/>
        },
        {
          path:'/leads/kanbanboard',
          element: <KanbanBoard/>
        },
         {
          path:'/leads/leadform',
          element: <LeadForm/>
        },
        {
          path:'/leadsettings/leadsidebar',
          element: <LeadSettings/>
        },
         {
        path:"/leadsettings/leadsource",
        element: <LeadSource />
       },
       {
        path:"/leadsettings/leadstatus",
        element: <LeadStatus/>
       },
       {
        path:"/leadsettings/leadagent",
        element: <LeadAgent/>
       },
       {
        path:"/leadsettings/leadcategory",
        element: <LeadCategory/>
       },

       {
        path: "/works/contracts",
        element: <ContractsView/>
       },

       {
        path: "/clients/edit/:id",
        element: <AddClient/>
       },
       {
        path: "/clients/dept/edit/:id",
        element: <AddDept/>
       },
       {
        path: "/clients/service/edit/:id",
        element: <AddService/>
       }

      ],
    },
  ]);

  // main router
  return <RouterProvider router={router} />;
}

export default App;