// src/services/auth.service.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (username, password) => {
  if (!username || !password) {
    throw new Error('Usuario y contraseña son requeridos');
  }

  const user = await prisma.users.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.activo) {
    throw new Error('Usuario inactivo. Contacte al administrador');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Generar JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    },
  };
};

const register = async (userData) => {
  const { username, password, full_name, role = 'user' } = userData;

  if (!username || !password || !full_name) {
    throw new Error('Faltan campos requeridos: username, password, full_name');
  }

  const existingUser = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error('El nombre de usuario ya está en uso');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = await prisma.users.create({
    data: {
      username,
      password_hash,
      full_name,
      role,
      activo: true,
    },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    full_name: newUser.full_name,
    role: newUser.role,
  };
};

module.exports = {
  login,
  register,
};