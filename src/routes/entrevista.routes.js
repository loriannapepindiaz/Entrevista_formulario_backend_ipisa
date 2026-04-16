const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrevista.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// ================================================
// Todas las rutas requieren estar autenticado
// ================================================
// Esto garantiza que el token se verifique SIEMPRE antes de cualquier ruta
router.use(authenticateToken);

// ================================================
// BÚSQUEDA — debe ir ANTES de /:id
// ================================================
router.get('/buscar', 
  authorizeRole('admin', 'supervisor', 'entrevistador'), 
  controller.buscarEntrevista
);

// ================================================
// STEP 1 — Crear estudiante + entrevista  → SOLO ADMIN
// ================================================
router.post('/step1', 
  authorizeRole('admin'), 
  controller.guardarStep1
);

// ================================================
// STEP 2, 3 y 4 — Edición → SOLO ADMIN
// ================================================
router.put('/:id/step2', 
  authorizeRole('admin'), 
  controller.guardarStep2
);

router.put('/:id/step3', 
  authorizeRole('admin'), 
  controller.guardarStep3
);

router.put('/:id/step4', 
  authorizeRole('admin'), 
  controller.guardarStep4
);

// ================================================
// Ver una entrevista por ID → Permitido a Admin, Supervisor y Entrevistador
// ================================================
router.get('/:id', 
  authorizeRole('admin', 'supervisor', 'entrevistador'), 
  controller.getEntrevista
);

module.exports = router;