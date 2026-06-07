import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredPermission, allowedRoles }) {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission) {
    if (!user.permissions || !Array.isArray(user.permissions)) {
      return <Navigate to="/NoPerms" replace />;
    }

    const permissoesDoUtilizador = user.permissions.map(p => p.permission?.description);
    
    const hasPerm = permissoesDoUtilizador.includes(requiredPermission);

    if (!hasPerm) {
      return <Navigate to="/NoPerms" replace />;
    }
  }
  return children;
}