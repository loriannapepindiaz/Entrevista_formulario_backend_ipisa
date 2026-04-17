const service = require('../services/entrevista.service');

// =======================
// BÚSQUEDA DE ENTREVISTAS (Filtrado por Rol)
// =======================
exports.buscarEntrevista = async (req, res) => {
  try {
    const { query } = req.query;
    const { id: userId, rol } = req.user; // Datos del token

    if (!query || !query.trim()) {
      return res.json([]);
    }

    // Pasamos el userId y el rol al servicio para que decida qué filtrar
    const resultados = await service.buscarPorNombre(
      query.trim(), 
      userId, 
      rol
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error en buscarEntrevista:', error);
    res.status(500).json({ 
      error: 'Error al buscar entrevistas',
      message: error.message 
    });
  }
};

// =======================
// OBTENER POR ID (Protección de acceso)
// =======================
exports.getEntrevista = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, rol } = req.user;

    const data = await service.getById(id);

    if (!data) {
      return res.status(404).json({ error: 'Entrevista no encontrada.' });
    }

    // LÓGICA DE PRIVACIDAD: 
    // Si eres entrevistador, pero la entrevista no es tuya, lanzamos 403
    if (rol === 'entrevistador' && data.entrevistador_id !== userId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para ver esta entrevista.' 
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Error en getEntrevista:', error);
    res.status(500).json({ error: error.message });
  }
};

// ======================================================
// LOS MÉTODOS DE GUARDADO (STEP 1 a 4) SE MANTIENEN IGUAL
// Pero asegúrate de pasar req.user.id como userId
// ======================================================
exports.guardarStep1 = async (req, res) => {
  try {
    const data   = req.body;
    const userId = req.user.id; // Ya sabemos que existe por el middleware

    const result = await service.guardarStep1(data, userId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error en guardarStep1:', error);
    res.status(500).json({ error: error.message });
  }
};

// ... Repetir igual para Step 2, 3 y 4 ...
exports.guardarStep2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user.id;
    const result = await service.guardarStep2(id, data, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.guardarStep3 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user.id;
    const result = await service.guardarStep3(id, data, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.guardarStep4 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user.id;
    const result = await service.guardarStep4(id, data, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};