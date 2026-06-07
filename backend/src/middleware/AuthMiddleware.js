import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const verifyToken = (req, res, next) => {
  console.log("1. Entrou no verifyToken");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No valid token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const requireRole = (allowedRoles) => {
  
  return (req, res, next) => {
    console.log("2. Entrou no requireRole para:", allowedRoles);
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. You do not have the required permissions.' });
    }
    next();
  };
};

export const checkPermission = (permissaoRequerida) => {
  return async (req, res, next) => {
    try {
      const userId = Number(req.user.userId);
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { 
          permissions: { 
            include: { permission: true } 
          } 
        }
      });

      if (!user) return res.status(403).json({ error: "Utilizador não encontrado na BD." });

      const permissoesDoUtilizador = user.permissions.map(p => p.permission.description);
      if (!permissoesDoUtilizador.includes(permissaoRequerida)) {
        return res.status(403).json({ error: `Falta a permissão: ${permissaoRequerida}` });
      }

      next();
    } catch (error) {
      console.error("Erro no checkPermission:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  };
};