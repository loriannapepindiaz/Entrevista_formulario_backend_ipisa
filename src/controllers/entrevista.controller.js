const service = require('../services/entrevista.service');

// =======================
// STEP 1
// =======================
exports.guardarStep1 = async (req, res) => {
  try {
    const data   = req.body;
    const userId = req.user?.id ?? null; // viene del middleware de auth

    const result = await service.guardarStep1(data, userId);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 2
// =======================
exports.guardarStep2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep2(id, data, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 3
// =======================
exports.guardarStep3 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep3(id, data, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// STEP 4
// =======================
exports.guardarStep4 = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = req.body;
    const userId = req.user?.id ?? null;

    const result = await service.guardarStep4(id, data, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// BUSCAR
// =======================
exports.buscarEntrevista = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'El parámetro query es requerido.' });
    }

    const resultados = await service.buscar(query.trim());

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// GET POR ID
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
    res.status(500).json({ error: error.message });
  }
};