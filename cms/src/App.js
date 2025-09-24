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
import EmployeeAdd from "./pages/HR/EmployeeList/EmployeeAdd";
import EmployeeView from "./pages/HR/EmployeeList/EmployeeView";
import Renewal from"./pages/Renewal/Renewal";
import Ticket from"./pages/Ticket/Ticket";
import CreateTicket from "./pages/Ticket/CreateTicket";
import TicketAgent from "./pages/Settings/TicketSettings/TicketAgent";
import TicketType from "./pages/Settings/TicketSettings/TicketType";
import TicketChannel from "./pages/Settings/TicketSettings/TicketChannel";
import ReplayTemplate from "./pages/Settings/TicketSettings/ReplayTemplate";
import TicketSettings from "./pages/Settings/TicketSettings/TicketSidebar";
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
        path:"/hr/employee/add",
        element: <EmployeeAdd />
       },
       {
        path:"/hr/employee/view",
        element: <EmployeeView />
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
      }
      ],
    },
  ]);

  // main router
  return <RouterProvider router={router} />;
}

export default App;