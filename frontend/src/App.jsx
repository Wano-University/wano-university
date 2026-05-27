import { Routes, Route, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Navbar from './components/Navbar';
import { ThemeProvider } from './providers/ThemeProvider';
import InteractiveMap from './pages/InteractiveMap';
import Cafeteria from './pages/Cafeteria';
import MenuConfig from './pages/MenuConfig';

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
        <Route path="/map" element={<InteractiveMap />} />
        <Route path="/cafeteria" element={<Cafeteria />}/>
        <Route path="/menuconfig" element={<MenuConfig/>}/>
      </Route>
    </Routes>
  );
}
