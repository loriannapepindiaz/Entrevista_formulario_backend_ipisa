const prisma = require('../config/prisma');

// =======================
// STEP 1 (CREAR)
// =======================
exports.guardarStep1 = async (data) => {
  return await prisma.entrevista.create({
    data: {
      fecha: data.fecha,
      formulario: data.formulario,
      seccion: data.seccion,
      nombres: data.nombres,
      apellidos: data.apellidos,
      sexo: data.sexo,
      edad: data.edad ? Number(data.edad) : null,

      vinculacion: data.vinculacion,
      especificar_vinculacion: data.especificar_vinculacion,

      // entrevistados (relación)
      entrevistados: {
        create: data.entrevistados
      }
    }
  });
};

// =======================
// STEP 2 (ACTUALIZAR)
// =======================
exports.guardarStep2 = async (id, data) => {
  return await prisma.entrevista.update({
    where: { id: Number(id) },
    data: {
      estado_civil: data.estado_civil,
      conducta: data.conducta,
      inconvenientes: data.inconvenientes,
      ayuda_psic: data.ayuda_psic,
      ayuda_psic_detalle: data.ayuda_psic_detalle,
      zona_vivienda: data.zona_vivienda,
      habitos: data.habitos,
      actividades_familia: data.actividades_familia,
      tiempo_juntos: data.tiempo_juntos,
      expectativas_centro: data.expectativas_centro,
      agresion_ocurrida: data.agresion_ocurrida,
      agresiones: data.agresiones
    }
  });
};
// =======================
// STEP 3 (ACTUALIZAR)
// =======================
exports.guardarStep3 = async (id, data) => {
  return await prisma.entrevista.update({
    where: { id: Number(id) },
    data: {
      convivencia: data.convivencia,
      motivos: data.motivos,
      dificultades: data.dificultades,
      estudiante_descr: data.estudiante_descr,
      repetido: data.repetido,
      alfabetizacion: data.alfabetizacion,
      alfabetizacion_detalle: data.alfabetizacion_detalle,
      motivacion: data.motivacion,
      ingreso_real: data.ingreso_real,
      aporte_mensual: data.aporte_mensual,
      telefono: data.telefono,
      observaciones: data.observaciones,
      entrevistador: data.entrevistador
    }
  });
};

// =======================
// STEP 4 (ACTUALIZAR)
// =======================
exports.guardarStep4 = async (id, data) => {
  return await prisma.entrevista.update({
    where: { id: Number(id) },
    data: {
      condicion_salud: data.condicion_salud,
      condicion_salud_detalle: data.condicion_salud_detalle,

      medicamento: data.medicamento,
      medicamento_detalle: data.medicamento_detalle,

      supervisor_extraescolar: data.supervisor_extraescolar,
      supervisor_otro: data.supervisor_otro,
      supervisor_otro_especifico: data.supervisor_otro_especifico,

      padres_fuera: data.padres_fuera,
      padres_fuera_detalle: data.padres_fuera_detalle,
      pais_residencia: data.pais_residencia,
      observaciones_padres_fuera: data.observaciones_padres_fuera,

      tipo_casa: data.tipo_casa,
      tipo_casa_otro: data.tipo_casa_otro,

      estado_padres: data.estado_padres,
      convive_padres: data.convive_padres,
      figuras_familiares: data.figuras_familiares,

      valoracion_familia: data.valoracion_familia,

      // 👇 importante (json o relación según tu schema)
      hermanos: data.hermanos
    }
  });
};
// =======================
// BUSCAR (para el buscador)
// =======================
exports.buscar = async (query) => {
  return await prisma.entrevista.findMany({
    where: {
      OR: [
        { nombres: { contains: query, mode: 'insensitive' } },
        { apellidos: { contains: query, mode: 'insensitive' } }
      ]
    }
  });
};

// =======================
// OBTENER POR ID
// =======================
exports.getById = async (id) => {
  return await prisma.entrevista.findUnique({
    where: { id: Number(id) },
    include: {
      entrevistados: true
    }
  });
};

// =======================
// (OPCIONAL) ACTUALIZAR TODO
// =======================
// por si luego quieres guardar todo junto
exports.actualizarCompleto = async (id, data) => {
  return await prisma.entrevista.update({
    where: { id: Number(id) },
    data: data
  });
};