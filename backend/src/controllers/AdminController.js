import prisma from '../config/db.js';

/**
 * Ir buscar todos os utilizadores do banco de dados
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    type: true,
    isActive: true,
    permissions: { // O nome da relação no modelo User
      select: {
        permission: { // Navega para o modelo Permission ligado
          select: {
            description: true // Agora sim, o Prisma encontra o campo
          }
        }
      }
    }
  }
});

    // 🔴 MAPA DE RETORNO: Transformamos o formato do Prisma [{ description: 'VER_EMENTA' }]
    // num array simples de strings ['VER_EMENTA'] para que o teu Frontend funcione sem alterações!
    const usersFormatados = users.map(user => ({
  ...user,
  permissions: user.permissions.map(p => p.permission.description)
}));

    return res.status(200).json(usersFormatados);
  } catch (error) {
    console.error("Erro Prisma getAllUsers:", error);
    return res.status(500).json({ error: "Erro ao recolher utilizadores da base de dados." });
  }
};

/**
 * Atualizar estado e permissões de um utilizador específico
 */
/**
 * Atualizar estado e permissões de um utilizador específico
 */
export const updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { ativo, novasPermissoes } = req.body;
  const userId = Number(id);

  try {
    const listaPermissoes = Array.isArray(novasPermissoes) ? novasPermissoes : [];

    // 1. Procurar os IDs das novas permissões
    const permissoesBd = await prisma.permission.findMany({
      where: { description: { in: listaPermissoes } },
      select: { id: true }
    });

    // 2. Transação para garantir integridade
    const result = await prisma.$transaction(async (tx) => {
      // A. Atualiza o status do utilizador
      await tx.user.update({
        where: { id: userId },
        data: { isActive: ativo }
      });

      // B. Remove permissões antigas
      await tx.usersOnPermissions.deleteMany({
        where: { userId: userId }
      });

      // C. Cria novas permissões
      await tx.usersOnPermissions.createMany({
        data: permissoesBd.map(p => ({
          userId: userId,
          permissionId: p.id
        }))
      });

      // D. Busca o user atualizado com as relações carregadas
      return await tx.user.findUnique({
        where: { id: userId },
        include: { 
          permissions: { 
            include: { permission: true } 
          } 
        }
      });
    });

    // 3. Resposta de sucesso (fora da transação)
    return res.status(200).json({ 
      message: "Permissões atualizadas com sucesso!",
      user: {
        ...result,
        // Aqui corrigimos o mapeamento: acedemos ao objeto permission relacionado
        permissions: result.permissions.map(p => p.permission.description)
      }
    });

  } catch (error) {
    console.error("Erro Crítico no Prisma:", error);
    return res.status(500).json({ error: "Erro ao processar atualização no banco de dados." });
  }
};