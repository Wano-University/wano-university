import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const registerUser = async (req, res) => {
  try {

    const { name, address, nif, email, login, password, type } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "Password requires 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        address,
        nif,
        email,
        login,
        password: hashedPassword,
        type
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

    const { login, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { login: login }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials or inactive account." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { userId: user.id, role: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
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

export const changePassword = async (req, res) => {
  try {

  } catch (error) {

  }
}






