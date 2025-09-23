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
import AddLead from "./pages/Lead/AddLead";
import ViewLead from "./pages/Lead/ViewLead";
import AddProposalTemplate from "./pages/Lead/AddProposalTemplate";
import AddRFPTemplate from "./pages/Lead/AddRFPTemplate";
import AddSupportRequest from "./pages/SupportRequest/AddSupportRequest"
import ViewSupportRequest from "./pages/SupportRequest/ViewSupportRequest"
import CreateTickets from "./pages/Tickets/CreateTickets"
import TicketSettings from "./pages/Tickets/TicketSettings"
import ViewTickets from "./pages/Tickets/ViewTickets"
import ViewEmployee from "./pages/HR/EmployeeList/ViewEmployee"
import View from "./pages/HR/Department/View"
import ViewDept from "./pages/Client/Department/ViewDept"
import AddDept from "./pages/Client/Department/AddDept"
import ViewService from "./pages/Client/Department/ViewService"
import AddService from "./pages/Client/Department/AddService"

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
          path: "/lead/add",
          element: <AddLead /> ,
        },
         {
          path: "/lead/view",
          element: <ViewLead /> ,
        },
         {
          path: "/lead/proposal",
          element: <AddProposalTemplate /> ,
        },
         {
          path: "/lead/rfp",
          element: <AddRFPTemplate /> ,
        },
        {
          path: "/supportrequest/add",
          element: <AddSupportRequest /> ,
        },
         {
          path: "/supportrequest/view",
          element: <ViewSupportRequest /> ,
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

        }
       
      ],
    },
  ]);

  // main router
  return <RouterProvider router={router} />;
}

export default App;