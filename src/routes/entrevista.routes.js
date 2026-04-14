const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrevista.controller');

// =======================
// STEP 1 (crear)
// =======================
router.post('/step1', controller.guardarStep1);

// =======================
// STEP 2 (actualizar)
// =======================
router.put('/:id/step2', controller.guardarStep2);
// =======================
// STEP 3
// =======================
router.put('/:id/step3', controller.guardarStep3);
// =======================
// STEP 4
// =======================
router.put('/:id/step4', controller.guardarStep4);
// =======================
// BUSCAR
// =======================
router.get('/buscar', controller.buscarEntrevista);

// =======================
// GET POR ID
// =======================
router.get('/:id', controller.getEntrevista);

module.exports = router;