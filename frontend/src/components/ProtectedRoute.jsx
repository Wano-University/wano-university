import { Navigate } from 'react-router-dom';
import NoPerms from '../pages/NoPerms';

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <NoPerms />;
  }

  if (requiredPermission) {
    const userPermissions = user.permissions || [];
    
    // Lógica robusta para encontrar a permissão na estrutura do Prisma
    const hasPermission = userPermissions.some((p) => {
      // 1. Se for uma string direta no array (ex: ['GERIR_EMENTA'])
      if (typeof p === 'string') return p === requiredPermission;
      
      if (p.permission) {
        // 2. Se for um objeto da tabela de junção (Prisma): p.permission.description
        if (p.permission.description === requiredPermission) return true;
        
        // 3. Se for apenas p.permission como string
        if (typeof p.permission === 'string' && p.permission === requiredPermission) return true;
      }
      
      return false;
    });

    if (!hasPermission) {
      console.log(`[Segurança] Acesso negado. Falta a permissão: ${requiredPermission}`);
      return <NoPerms />;
    }
  }

  return children;
}