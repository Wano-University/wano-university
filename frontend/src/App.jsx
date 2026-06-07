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
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import MyTickets from './pages/MyTickets';
import ValidateTicket from './pages/ValidateTicket';
import MyReservations from './pages/MyReservations';
import TemperatureDashboard from './pages/TemperatureDashboard';
import AirQualityDashboard from './pages/AirQualityDashboard';
import EnergyConsumptionDashboard from './pages/EnergyConsumptionDashboard';
import { TerminalProvider, TerminalPopup } from './components/TerminalPopup';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import ValidateReservation from './pages/ValidateReservation';
import './i18n';

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
        <Route path="/changepw" element={<ForgotPassword />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/home" element={<HomeRedirection />} />
        <Route path="/cafeteria" element={<ProtectedRoute> <Cafeteria /> </ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute> <MyTickets /> </ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}> <AdminHome /> </ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF']}> <StaffHome /> </ProtectedRoute>} />
        <Route path="/validate-ticket/:id" element={<ProtectedRoute allowedRoles={['STAFF']}> <ValidateTicket /> </ProtectedRoute>} />
        <Route path="/validate-reservation/:id" element={<ProtectedRoute allowedRoles={['STAFF']}> <ValidateReservation /> </ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER']}> <StudentHome /> </ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER']}> <MyReservations /> </ProtectedRoute>} />

        <Route path="/map" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <InteractiveMap /> </ProtectedRoute>} />
        <Route path="/menuconfig" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <MenuConfig /> </ProtectedRoute>} />

        <Route path="/TemperatureDashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <TemperatureDashboard /> </ProtectedRoute>} />
        <Route path="/AirQualityDashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <AirQualityDashboard /> </ProtectedRoute>} />
        <Route path="/EnergyConsumptionDashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <EnergyConsumptionDashboard /> </ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}