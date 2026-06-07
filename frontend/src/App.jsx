import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Navbar from './components/Navbar';
import { ThemeProvider } from './providers/ThemeProvider';
import InteractiveMap from './pages/InteractiveMap';
import Cafeteria from './pages/Cafeteria';
import MenuConfig from './pages/MenuConfig';
import Spaces from './pages/Spaces';
import HomeRedirection from './components/HomeRedirection';
import StaffHome from './pages/StaffHome';
import StudentHome from './pages/StudentHome';
import AdminHome from './pages/AdminHome';
import Equipments from './pages/Equipments';
import TemperatureDashboard from './pages/TemperatureDashboard';
import AirQualityDashboard from './pages/AirQualityDashboard';
import EnergyConsumptionDashboard from './pages/EnergyConsumptionDashboard';
//import Parking from './pages/Parking';
import Bikes from './pages/Bikes';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import MyTickets from './pages/MyTickets';
import ValidateTicket from './pages/ValidateTicket';
import LssDocs from './pages/Lssdocs';
import { TerminalProvider, TerminalPopup } from './components/TerminalPopup';
import './i18n';

import Footer from './components/Footer';
import NotFound from './components/NotFound';
import AdminUsers from './pages/AdminUsers';
import Alerts from './pages/Alerts';
import AccessLogs from './pages/AccessLogs';

function RootLayout() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
          <Navbar />
          <TerminalPopup />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </TerminalProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/createacc" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lssdocs" element={<LssDocs />} />
        <Route path="/changepw" element={<ForgotPassword />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path='/bikes' element={<Bikes />} />

        <Route path="/home" element={<HomeRedirection />} />
        <Route path="/cafeteria" element={<ProtectedRoute> <Cafeteria /> </ProtectedRoute>} />
        <Route path="/lssdocs" element={<ProtectedRoute> <LssDocs /> </ProtectedRoute>} />
        <Route path="/equipments" element={<ProtectedRoute> <Equipments /> </ProtectedRoute>} />

        <Route path="/tickets" element={<ProtectedRoute> <MyTickets /> </ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}> <AdminHome /> </ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF']}> <StaffHome /> </ProtectedRoute>} />
        <Route path="/validate-ticket/:id" element={<ProtectedRoute allowedRoles={['STAFF']}> <ValidateTicket /> </ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}> <StudentHome /> </ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['TEACHER']}> <StudentHome /> </ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <InteractiveMap /> </ProtectedRoute>} />
        <Route path="/menuconfig" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <MenuConfig /> </ProtectedRoute>} />

        <Route path="/temperaturedashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} requiredPermission="VER_DASHBOARD_TEMPERATURE"> <TemperatureDashboard /> </ProtectedRoute>} />
        <Route path="/airqualitydashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} requiredPermission="VER_DASHBOARD_QUALIDADE_AR"> <AirQualityDashboard /> </ProtectedRoute>} />
        <Route path="/energydashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} requiredPermission="VER_DASHBOARD_CONSUMO_ENERGETICO"> <EnergyConsumptionDashboard /> </ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']} requiredPermission="GERIR_USERS"> <AdminUsers /> </ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <Alerts /> </ProtectedRoute>} />
        <Route path="/accesslogs" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <AccessLogs /> </ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}