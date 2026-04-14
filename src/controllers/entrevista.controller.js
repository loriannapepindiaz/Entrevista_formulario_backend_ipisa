const service = require('../services/entrevista.service');

// =======================
// STEP 1
// =======================
exports.guardarStep1 = async (req, res) => {
  try {
    const data = req.body;

    const result = await service.guardarStep1(data);

    res.json(result);
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
    const data = req.body;

    const result = await service.guardarStep2(id, data);

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
    const data = req.body;

    const result = await service.guardarStep3(id, data);

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
    const data = req.body;

    const result = await service.guardarStep4(id, data);

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

    const resultados = await service.buscar(query);

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

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};