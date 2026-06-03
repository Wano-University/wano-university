import { Navigate } from 'react-router-dom';

export default function HomeRedirection() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.type) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'STAFF':
      return <Navigate to="/staff" replace />;
    case 'PROFESSOR':
      return <Navigate to="/professor" replace />;
    case 'STUDENT':
    default:
      return <Navigate to="/student" replace />;
  }
}
