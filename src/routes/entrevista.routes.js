const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrevista.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// Todas las rutas requieren token
router.use(authenticateToken);

// ================================================
// BÚSQUEDA
// ================================================
// Permitimos a los 3 roles buscar. 
// La lógica de "quién ve qué" se maneja dentro del controller.buscarEntrevista
router.get('/buscar', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.buscarEntrevista
);

// ================================================
// GUARDADO DE PASOS (Creación y Edición)
// ================================================
// CAMBIO CLAVE: Ahora los 3 roles pueden ejecutar el POST y los PUT
// para que no te vuelva a salir el error 403.

router.post('/step1', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.guardarStep1
);

router.put('/:id/step2', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.guardarStep2
);

router.put('/:id/step3', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.guardarStep3
);

router.put('/:id/step4', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.guardarStep4
);

// ================================================
// VER DETALLE
// ================================================
router.get('/:id', 
  authorizeRole('administrador', 'supervisor', 'entrevistador'), 
  controller.getEntrevista
);

module.exports = router;