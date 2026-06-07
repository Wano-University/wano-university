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
            permission: { 
              select: { 
                description: true 
              } 
            }
          }
        }
      },
      orderBy: {
        id: 'asc' 
      }
    });

    const usersFormatados = users.map(user => ({
      ...user,
      permissions: Array.isArray(user.permissions) 
        ? user.permissions
            .map(p => p.permission?.description)
            .filter(Boolean)
        : []
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
  const userId = parseInt(id, 10);

  try {
    const permissoesObj = await prisma.permission.findMany({
      where: { description: { in: novasPermissoes } },
      select: { id: true }
    });
    const novosPermissionIds = permissoesObj.map(p => p.id);

    await prisma.$transaction([
      prisma.usersOnPermissions.deleteMany({ where: { userId } }),
      prisma.usersOnPermissions.createMany({
        data: novosPermissionIds.map(permId => ({ userId, permissionId: permId }))
      }),
      prisma.user.update({
        where: { id: userId },
        data: { isActive: !!ativo }
      })
    ]);

    return res.status(200).json({ success: true, message: "Permissões atualizadas!" });
  } catch (error) {
    console.error("Erro Prisma na gravação:", error);
    return res.status(500).json({ success: false, message: "Erro ao gravar na BD." });
  }
};