import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';

const MAPA_PERMISSOES = [
  { id: 'VER_EMENTA_COMPRAS',            label: 'Ementa',                roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_PARKING',                   label: 'Parking',               roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_SALAS_LABORATORIOS',        label: 'Ver Salas',             roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_EQUIPAMENTOS',              label: 'Ver Equipamentos',      roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_BICICLETAS_TROTINETES',     label: 'Ver Bicicletas',        roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD',                 label: 'Dashboards',            roles: ['STAFF', 'ADMIN'] },
  { id: 'GERIR_USERS',                   label: 'Gestão Users',          roles: ['ADMIN'] },
  { id: 'GERIR_EQUIPAMENTOS',            label: 'Gestão Equipamentos',   roles: ['ADMIN'] },
  { id: 'GERIR_BICICLETAS_TROTINETES',   label: 'Gestão Bicicletas',     roles: ['ADMIN'] },
  { id: 'GERIR_EMENTA',                  label: 'Gestão Ementa',         roles: ['ADMIN', 'STAFF'] },
  { id: 'GERIR_SENSORES',                label: 'Gestão Sensores',       roles: ['ADMIN'] }
];

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const registerUser = async (req, res) => {
  try {
    const { name, address, nif, email, login, password, type } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password policy violation." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const permsToAssign = MAPA_PERMISSOES
      .filter(perm => perm.roles.includes(type))
      .map(perm => perm.id);

    await Promise.all(
      permsToAssign.map(permId =>
        prisma.permission.upsert({
          where: { description: permId },
          update: {},
          create: { description: permId }
        })
      )
    );

    const user = await prisma.user.create({
      data: {
        name, address, nif, email, login,
        password: hashedPassword,
        type,
        permissions: {
          create: permsToAssign.map(permId => ({
            permission: { connect: { description: permId } }
          }))
        }
      },
      include: {
        permissions: { include: { permission: true } }
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create user." });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({
      where: { login: login },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials or inactive account." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const tokenDuration = rememberMe ? '7d' : '8h';
    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { userId: user.id, role: user.type },
      process.env.JWT_SECRET,
      { expiresIn: tokenDuration }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { login, email, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { login: login, email: email }
    });

    if (!user) {
      return res.status(401).json({ error: "Login and Email don't match." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: "Password successfully updated." });

  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "An error occurred while resetting the password." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { login, password, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { login: login }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password." });
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPasswordHashed }
    });

    return res.status(200).json({ message: "Password successfully changed." });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "An error occurred while changing the password." });
  }
};