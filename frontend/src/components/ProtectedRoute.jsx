import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredPermission, allowedRoles }) {
  // 1. Vai buscar o utilizador diretamente ao Local Storage (onde o teu Login o guarda)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Se não houver ninguém logado, manda para o Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Verificação de Tipo de Utilizador (Role)
  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Verificação da Permissão (A Lógica Corrigida)
  if (requiredPermission) {
    // Se o user não tiver o array de permissões, bloqueia logo
    if (!user.permissions || !Array.isArray(user.permissions)) {
      return <Navigate to="/NoPerms" replace />;
    }

    // Transforma a lista do Prisma numa lista de strings
    const permissoesDoUtilizador = user.permissions.map(p => p.permission?.description);
    
    // Verifica se a permissão requerida está na lista
    const hasPerm = permissoesDoUtilizador.includes(requiredPermission);

    // Logs para tu veres na consola (Podes apagar isto mais tarde)
    console.log("--- TESTE DE ACESSO ---");
    console.log("Permissões na tua conta:", permissoesDoUtilizador);
    console.log("A página exige:", requiredPermission);
    console.log("Pode entrar?:", hasPerm);

    if (!hasPerm) {
      return <Navigate to="/NoPerms" replace />;
    }
  }

  // Se passou em todos os testes, carrega a página!
  return children;
}