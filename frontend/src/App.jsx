import { Routes, Route, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Navbar from './components/Navbar';
import { ThemeProvider } from './providers/ThemeProvider';
import LoginPage from './pages/LoginPage';

function RootLayout() {
  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/createacc" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage/>} />

      </Route>
    </Routes>
  );
}
