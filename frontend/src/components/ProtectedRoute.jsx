import { Navigate } from 'react-router-dom';
import Unauthorized from '../pages/Unauthorized';

export default function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Unauthorized />;
  }

  return children;
}
