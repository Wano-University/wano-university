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
import LssDocs from './pages/Lssdocs';
import { TerminalProvider, TerminalPopup } from './components/TerminalPopup';

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
        <Route path="/lssdocs" element={<LssDocs/>} />
        <Route path="/changepw" element={<ForgotPassword />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/home" element={<HomeRedirection />} />
        <Route path="/cafeteria" element={<ProtectedRoute> <Cafeteria /> </ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute> <MyTickets /> </ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}> <AdminHome /> </ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF']}> <StaffHome /> </ProtectedRoute>} />
        <Route path="/validate-ticket/:id" element={<ProtectedRoute allowedRoles={['STAFF']}> <ValidateTicket /> </ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}> <StudentHome /> </ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['TEACHER']}> <StudentHome /> </ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <InteractiveMap /> </ProtectedRoute>} />
        <Route path="/menuconfig" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}> <MenuConfig /> </ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
