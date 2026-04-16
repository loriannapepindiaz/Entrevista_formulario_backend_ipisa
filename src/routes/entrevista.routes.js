const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrevista.controller');

// ══════════════════════════════════════════════════════════════════
// BÚSQUEDA — debe ir ANTES de /:id para no ser capturada como UUID
// ══════════════════════════════════════════════════════════════════
router.get('/buscar', controller.buscarEntrevista);

// ══════════════════════════════════════════════════════════════════
// STEP 1 — Crea estudiante + entrevista
// ══════════════════════════════════════════════════════════════════
router.post('/step1', controller.guardarStep1);

// ══════════════════════════════════════════════════════════════════
// STEP 2 — Entorno familiar
// ══════════════════════════════════════════════════════════════════
router.put('/:id/step2', controller.guardarStep2);

// ══════════════════════════════════════════════════════════════════
// STEP 3 — Expectativas / académico / teléfonos
// ══════════════════════════════════════════════════════════════════
router.put('/:id/step3', controller.guardarStep3);

// ══════════════════════════════════════════════════════════════════
// STEP 4 — Preguntas extras / hermanos exalumnos
// ══════════════════════════════════════════════════════════════════
router.put('/:id/step4', controller.guardarStep4);

// ══════════════════════════════════════════════════════════════════
// GET POR ID — Carga completa para lectura/edición
// ══════════════════════════════════════════════════════════════════
router.get('/:id', controller.getEntrevista);

module.exports = router;