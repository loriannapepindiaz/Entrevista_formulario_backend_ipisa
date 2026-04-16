// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.json({
      success: true,
      message: 'Login exitoso',
      ...result,
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    
    const statusCode = error.message.includes('inactivo') ? 403 : 401;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: result,
    });
  } catch (error) {
    console.error('Error en register:', error.message);
    
    const statusCode = error.message.includes('ya está en uso') ? 409 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
};