const service = require('../services/entrevista.service');

// =======================
// STEP 1 - Crear entrevista básica
// =======================
exports.guardarStep1 = async (req, res) => {
  try {
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep1(data, userId);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error en guardarStep1:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 2 - Entorno familiar
// =======================
exports.guardarStep2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep2(id, data, userId);

    res.json(result);
  } catch (error) {
    console.error('Error en guardarStep2:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 3 - Expectativas y datos adicionales
// =======================
exports.guardarStep3 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep3(id, data, userId);

    res.json(result);
  } catch (error) {
    console.error('Error en guardarStep3:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 4 - Preguntas extras
// =======================
exports.guardarStep4 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep4(id, data, userId);

    res.json(result);
  } catch (error) {
    console.error('Error en guardarStep4:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// BÚSQUEDA DE ENTREVISTAS (Backend)
// =======================
exports.buscarEntrevista = async (req, res) => {
  try {
    const { query } = req.query;

    // Si no hay query, devolvemos array vacío (mejor experiencia)
    if (!query || !query.trim()) {
      return res.json([]);
    }

    const resultados = await service.buscarPorNombre(query.trim());

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
// OBTENER ENTREVISTA POR ID (para ver/editar)
// =======================
exports.getEntrevista = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.getById(id);

    if (!data) {
      return res.status(404).json({ error: 'Entrevista no encontrada.' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error en getEntrevista:', error);
    res.status(500).json({ error: error.message });
  }
};