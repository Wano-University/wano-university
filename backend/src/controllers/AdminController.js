import prisma from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        isActive: true,

        address: true, 
        nif: true,
        login: true,
        permissions: {
          select: {
            permission: { select: { description: true } }
          }
        }
      }
    });

    const usersFormatados = users.map(user => ({
      ...user,
      permissions: user.permissions.map(p => p.permission.description)
    }));

    return res.status(200).json(usersFormatados);
  } catch (error) {
    console.error("Erro Prisma getAllUsers:", error);
    return res.status(500).json({ error: "Erro ao recolher utilizadores." });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, nif, login } = req.body;
  const userId = Number(id);

  try {

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        address,
        nif,
        login
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Erro Prisma updateProfile:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};

export const updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { ativo, novasPermissoes } = req.body;
  const userId = Number(id);

  try {
    const listaPermissoes = Array.isArray(novasPermissoes) ? novasPermissoes : [];

    const permissoesBd = await prisma.permission.findMany({
      where: { description: { in: listaPermissoes } },
      select: { id: true }
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { isActive: ativo }
      });

      await tx.usersOnPermissions.deleteMany({
        where: { userId: userId }
      });

      await tx.usersOnPermissions.createMany({
        data: permissoesBd.map(p => ({
          userId: userId,
          permissionId: p.id
        }))
      });

      return await tx.user.findUnique({
        where: { id: userId },
        include: { 
          permissions: { include: { permission: true } } 
        }
      });
    });

    return res.status(200).json({ 
      message: "Sucesso!",
      user: {
        ...result,
        permissions: result.permissions.map(p => p.permission.description)
      }
    });
  } catch (error) {
    console.error("Erro Crítico no Prisma:", error);
    return res.status(500).json({ error: "Erro ao processar atualização." });
  }
};