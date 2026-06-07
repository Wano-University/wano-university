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

    // Suporta ambos os formatos:
    // 1. String simples:                   "VER_EQUIPAMENTOS"
    // 2. Objeto Prisma raw:                { permission: { description: "VER_EQUIPAMENTOS" } }
    // 3. Objeto com description direto:    { description: "VER_EQUIPAMENTOS" }
    const permissoesDoUtilizador = user.permissions.map(p => {
      if (typeof p === 'string') return p;
      return p?.permission?.description || p?.description || null;
    }).filter(Boolean);

    const hasPerm = permissoesDoUtilizador.includes(requiredPermission);

    console.log("--- TESTE DE ACESSO ---");
    console.log("Permissões na tua conta:", permissoesDoUtilizador);
    console.log("A página exige:", requiredPermission);
    console.log("Pode entrar?:", hasPerm);

    if (!hasPerm) {
      return <Navigate to="/NoPerms" replace />;
    }
  }

  return children;
}