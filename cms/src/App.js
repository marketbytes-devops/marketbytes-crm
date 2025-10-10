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
import KanbanBoard from "./pages/Lead/KanbanBoard";
import LeadForm from "./pages/Lead/LeadForm";
import AddSupportRequest from "./pages/SupportRequest/AddSupportRequest";
import ViewSupportRequest from "./pages/SupportRequest/ViewSupportRequest";
import Renewal from"./pages/Renewal/CreateRenewal";
import CreateTicket from "./pages/Ticket/CreateTicket";
import TicketAgent from "./pages/Settings/TicketSettings/TicketAgent";
import TicketType from "./pages/Settings/TicketSettings/TicketType";
import TicketChannel from "./pages/Settings/TicketSettings/TicketChannel";
import TicketUI from "./pages/Ticket/TicketUI";
import ReplayTemplate from "./pages/Settings/TicketSettings/ReplayTemplate";
import TicketSettings from "./pages/Settings/TicketSettings/TicketSidebar";
import Ticket from "./pages/Ticket/Ticket";
import ViewEmployee from "./pages/HR/EmployeeList/ViewEmployee";
import View from "./pages/HR/Department/View";
import Add from"./pages/HR/Department/Add";
import AddEmployee from "./pages/HR/EmployeeList/AddEmployee";
import DesignationView from "./pages/HR/Designation/view";
import EditEmployee from "./pages/HR/EmployeeList/EditEmployee";
import AttendanceSummary from "./pages/HR/Attendance/AttendanceSummary";
import AttendanceMember from "./pages/HR/Attendance/AttendanceMember";
import AttendanceMark from "./pages/HR/Attendance/AttendanceMark";
import Holiday from "./pages/HR/Holiday";
import HolidayCalendar from "./pages/HR/Holiday/HolidayCalendar";
import Leaves from "./pages/HR/Leaves/PendingLeaves";
import AllLeaves from"./pages/HR/Leaves/AllLeaves";
import AssignLeaves from"./pages/HR/Leaves/AssignLeaves";
import OvertimeWork from "./pages/HR/OvertimeWork";
import RecruitmentView from"./pages/HR/Recruitment/RecruitmentView";
import CreateRecruitment from"./pages/HR/Recruitment/CreateRecruitment";
import EditRecruitment from"./pages/HR/Recruitment/EditRecruitment";
import OvertimeCreate from "./pages/HR/OvertimeWork/OvertimeCreate";
import Calendar from"./pages/HR/Leaves/Calendar";
import ViewDept from"./pages/Client/Department/ViewDept";
import AddDept from"./pages/Client/Department/AddDept";
import ViewService from "./pages/Client/Department/ViewService";
import AddService from "./pages/Client/Department/AddService";
import RenewalReport from"./pages/Reports/RenewalReport";
import RenewalReportssl from"./pages/Reports/RenewalReportssl";
import RenewalReporthosting from"./pages/Reports/RenewalReporthosting";
import RenewalReportemail from "./pages/Reports/RenewalReportemail";
import RenewalReportHeader from "./pages/Reports/RenewalReportHeader";
import CreateRenewalHeader from "./pages/Renewal/CreateRenewalHeader";
import CreateRenewalDomain from "./pages/Renewal/CreateRenewalDomain";
import CreateRenewalEmail from"./pages/Renewal/CreateRenewalEmail";
import CreateRenewalHosting from "./pages/Renewal/CreateRenewalHosting";
import CreateRenewalssl from "./pages/Renewal/CreateRenewalssl";
import CreateRenewal from "./pages/Renewal/CreateRenewal";
import EmployeeList from "./pages/HR/EmployeeList/EmployeeList";
import EmployeeProfile from "./pages/HR/EmployeeList/EmployeeProfile";


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
          path:'/leads/kanbanboard',
          element: <KanbanBoard/>
        },
         {
          path:'/leads/leadform',
          element: <LeadForm/>
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
        path:"/ticket/:id",
        element:<TicketUI />
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
        path:'hr/employee/add',
        element:<AddEmployee/>
        },
        {
          path:'/hr/department/view',
          element: <View/>,
        },
        {
          path:'hr/department/add',
          element:<Add />,
        },
        
        {
        path:'hr/designation',
        element:<DesignationView />
      },
      {
        path:'/hr/employeeprofile/:employeeId',
        element:<EmployeeProfile />
      },
      {
        path:'hr/editemployee/:employeeId',
        element:<EditEmployee />

      },
      {
        path:'/hr/holiday/calendar',
        element:<HolidayCalendar/>
      },
      {
        path:'hr/attendance/attendancemember',
        element:<AttendanceMember />
      },
      {
       path:'hr/attendance/attendancesummary',
       element:<AttendanceSummary />
      },
      {
       path:'hr/attendance/markattendance',
       element:<AttendanceMark />
      },
      {
        path:'hr/holiday/',
        element:<Holiday />
      },
      {
        path:'hr/leaves/',
        element:<Leaves />
      },
     {
        path:'hr/leaves/allleaves',
        element:<AllLeaves />
     },
     {
      path:'hr/leaves/assignleaves',
      element:<AssignLeaves />

     },
      {
        path:'hr/overtimework/',
        element:<OvertimeWork />
      },
      {
        path:'hr/recruitment/recruitmentview',
        element:<RecruitmentView />
      },
      {
        path:'hr/recruitment/createrecruitment',
        element:<CreateRecruitment />
      },
      {
        path:'hr/recruitment/editrecruitment',
        element:<EditRecruitment />
      },
      {
        path:'hr/overtimework/overtimecreate',
        element:<OvertimeCreate />

      },
      {
        path:'hr/leaves/calendar',
        element:<Calendar />
      },
       {
        path:'/hr/employeelist/employeelist',
        element:<EmployeeList />
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
       },
        {
        path: "/works/contracts",
        element: <ContractsView/>
       },
        {
          path:'/reports/renewal-report',
          element: <RenewalReport/>
        },
      {
        path:'/reports/renewal-report-ssl',
        element:<RenewalReportssl />
      },
      {
        path:'/reports/renewal-report-hosting',
        element:<RenewalReporthosting />
      },
      {
        path:'/reports/renewal-report-email',
        element:<RenewalReportemail />
      },
      {
        path:'/reports/renewal-topbar',
        element:<RenewalReportHeader />
      },
      {
        path:'/reports/renewal-report',
        element:<Renewal />

      },
      {
        path:'/renewal/create/renewal-header',
        element:<CreateRenewalHeader />
      },
      {
        path:'/renewal/create/renewal-domain',
        element:<CreateRenewalDomain />
      },
      {
        path:'/renewal/create/renewal-hosting',
        element:<CreateRenewalHosting />
      },
     {
        path:'/renewal/create/renewal-ssl',
        element:<CreateRenewalssl />
      },
      {
        path:'/renewal/create/renewal-email',
        element:<CreateRenewalEmail />
      },
      {
        path:'/renewal/create/renewal',
        element:<CreateRenewal />
      },
   
      ],
    },

  ]);

  // main router
  return <RouterProvider router={router} />;
}

export default App;