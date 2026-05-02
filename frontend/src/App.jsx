import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';

function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* <Navbar /> */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
