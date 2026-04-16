const prisma = require('../config/prisma');

async function resolverSexoId(codigo) {
  const row = await prisma.cat_sexo.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Sexo no encontrado: ${codigo}`);
  return row.id;
}

async function resolverEstadoCivilId(nombre) {
  const row = await prisma.cat_estado_civil.findFirst({ where: { nombre } });
  if (!row) throw new Error(`Estado civil no encontrado: ${nombre}`);
  return row.id;
}

async function resolverVinculacionId(codigo) {
  if (!codigo) return null;
  const row = await prisma.cat_vinculacion_institucional.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Vinculación no encontrada: ${codigo}`);
  return row.id;
}

async function resolverEntrevistadorId(nombre) {
  if (!nombre) return null;
  const row = await prisma.cat_entrevistador.findFirst({ where: { nombre } });
  if (!row) throw new Error(`Entrevistador no encontrado: ${nombre}`);
  return row.id;
}

async function resolverParentescoId(codigo) {
  if (!codigo) return null;
  const row = await prisma.cat_parentesco.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Parentesco no encontrado: ${codigo}`);
  return row.id;
}

async function resolverNivelAcademicoId(codigo) {
  if (!codigo) return null;
  const row = await prisma.cat_nivel_academico.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Nivel académico no encontrado: ${codigo}`);
  return row.id;
}

async function resolverEstadoEstudioId(codigo) {
  if (!codigo) return null;
  const row = await prisma.cat_estado_estudio.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Estado de estudio no encontrado: ${codigo}`);
  return row.id;
}

async function resolverTallerId(codigo) {
  if (!codigo) return null;
  const row = await prisma.cat_taller.findFirst({ where: { codigo } });
  if (!row) throw new Error(`Taller no encontrado: ${codigo}`);
  return row.id;
}

async function resolverPaisId(nombre) {
  if (!nombre || nombre === 'Otro') return null;
  const row = await prisma.cat_pais.findFirst({ where: { nombre } });
  if (!row) throw new Error(`País no encontrado: ${nombre}`);
  return row.id;
}

async function resolverDuenoTelefonoId(nombre) {
  if (!nombre) return null;
  const row = await prisma.cat_dueno_telefono.findFirst({ where: { nombre } });
  return row ? row.id : null;
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1
// ══════════════════════════════════════════════════════════════════════════════
exports.guardarStep1 = async (data, userId = null) => {

  const [sexoId, vinculacionId] = await Promise.all([
    resolverSexoId(data.sexo),
    resolverVinculacionId(data.vinculacion),
  ]);

  const estudiante = await prisma.estudiante.create({
    data: {
      nombres:   data.nombres,
      apellidos: data.apellidos,
      sexo_id:   sexoId,
      edad:      Number(data.edad),
    },
  });

  const [
    nivelMadreId, estadoMadreId,
    nivelPadreId, estadoPadreId,
    nivelTutorId, estadoTutorId,
  ] = await Promise.all([
    resolverNivelAcademicoId(data.nivel_madre),
    resolverEstadoEstudioId(data.duracion_madre),
    resolverNivelAcademicoId(data.nivel_padre),
    resolverEstadoEstudioId(data.duracion_padre),
    resolverNivelAcademicoId(data.nivel_tutor  || null),
    resolverEstadoEstudioId(data.duracion_tutor || null),
  ]);

  const parentescosIds = await Promise.all(
    (data.entrevistados || []).map(e => resolverParentescoId(e.parentesco))
  );

  const entrevista = await prisma.entrevista.create({
    data: {
      estudiante_id:           estudiante.id,
      fecha_entrevista:        new Date(data.fecha),
      formulario:              data.formulario || null,
      seccion:                 data.seccion    || null,
      estado_civil_id:         1,
      vinculacion_id:          vinculacionId ?? 1,
      especificar_vinculacion: data.especificar_vinculacion || '',

      entrevista_participante: {
        create: (data.entrevistados || []).map((e, i) => ({
          nombre:          e.nombre,
          parentesco_id:   parentescosIds[i],
          parentesco_otro: e.parentesco === 'otro' ? (e.parentesco_otro || null) : null,
        })),
      },

      entrevista_nivel_academico_referente: {
        create: [
          {
            rol:                'madre',
            nivel_academico_id: nivelMadreId,
            estado_estudio_id:  estadoMadreId,
            tipo_especifico:    data.tipo_madre || null,
          },
          {
            rol:                'padre',
            nivel_academico_id: nivelPadreId,
            estado_estudio_id:  estadoPadreId,
            tipo_especifico:    data.tipo_padre || null,
          },
          ...(data.nivel_tutor ? [{
            rol:                'tutor',
            nivel_academico_id: nivelTutorId,
            estado_estudio_id:  estadoTutorId,
            tipo_especifico:    data.tipo_tutor || null,
          }] : []),
        ],
      },
    },
  });

  return { estudiante, entrevista };
};

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2
// ══════════════════════════════════════════════════════════════════════════════
exports.guardarStep2 = async (entrevistaId, data, userId = null) => {

  const estadoCivilId = await resolverEstadoCivilId(data.estado_civil);

  await prisma.entrevista.update({
    where: { id: entrevistaId },
    data:  { estado_civil_id: estadoCivilId },
  });

  const ayudaPsic     = data.ayuda_psic       === 'Si';
  const agresionOcurr = data.agresion_ocurrida === 'Si';

  const payload = {
    conducta:                  data.conducta            || '',
    inconvenientes:            data.inconvenientes      || '',
    ayuda_psicologica:         ayudaPsic,
    ayuda_psicologica_detalle: ayudaPsic ? (data.ayuda_psic_detalle || '') : '',
    zona_vivienda:             data.zona_vivienda       || '',
    habitos:                   data.habitos             || '',
    actividades_familia:       data.actividades_familia || '',
    tiempo_juntos:             data.tiempo_juntos       || '',
    expectativas_centro:       data.expectativas_centro || '',
    agresion_ocurrida:         agresionOcurr,
    agresiones:                agresionOcurr ? (data.agresiones || null) : null,
  };

  return await prisma.entrevista_respuesta_principal.upsert({
    where:  { entrevista_id: entrevistaId },
    create: { entrevista_id: entrevistaId, ...payload },
    update: payload,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3
// ══════════════════════════════════════════════════════════════════════════════
exports.guardarStep3 = async (entrevistaId, data, userId = null) => {

  const entrevistadorId = await resolverEntrevistadorId(data.entrevistador);
  const telefonos       = data.telefonos || [];
  const duenosIds       = await Promise.all(telefonos.map(t => resolverDuenoTelefonoId(t.dueno)));

  await prisma.entrevista.update({
    where: { id: entrevistaId },
    data: {
      entrevistador_id: entrevistadorId,
      ingreso_real:     data.ingreso_real   ? parseFloat(String(data.ingreso_real).replace(/[^0-9.]/g, ''))   : null,
      aporte_mensual:   data.aporte_mensual ? parseFloat(String(data.aporte_mensual).replace(/[^0-9.]/g, '')) : null,
      observaciones:    data.observaciones  || '',
    },
  });

  const otraInst = data.otra_institucion === 'Si';
  const repitio  = data.repetido_curso   === 'Si';
  const alfab    = data.alfabetizacion   === 'Si';

  const payload = {
    convivencia:                   data.convivencia      || '',
    motivos_institucion:           data.motivos          || '',
    otra_institucion:              otraInst,
    dificultades_otra_institucion: otraInst ? (data.dificultades || null) : null,
    descripcion_estudiante:        data.estudiante_descr || '',
    repitencia_sobreedad:          repitio ? (data.repetido || '') : '',
    alfabetizacion:                alfab,
    alfabetizacion_detalle:        alfab ? (data.alfabetizacion_detalle || '') : '',
    motivacion_estudiante:         data.motivacion || '',
  };

  await prisma.entrevista_respuesta_principal.upsert({
    where:  { entrevista_id: entrevistaId },
    create: { entrevista_id: entrevistaId, ...payload },
    update: payload,
  });

  await prisma.entrevista_telefono.deleteMany({ where: { entrevista_id: entrevistaId } });

  const telsFiltrados = telefonos.filter(t => t.numero?.trim());
  if (telsFiltrados.length > 0) {
    await prisma.entrevista_telefono.createMany({
      data: telsFiltrados.map((t, i) => ({
        entrevista_id: entrevistaId,
        numero:        t.numero.trim(),
        dueno_id:      duenosIds[i],
        orden:         i + 1,
      })),
    });
  }

  return { ok: true };
};

// ══════════════════════════════════════════════════════════════════════════════
// STEP 4
// ══════════════════════════════════════════════════════════════════════════════
exports.guardarStep4 = async (entrevistaId, data, userId = null) => {

  const hayPadresFuera = data.padres_fuera === 'Si';

  const [paisMadreId, paisPadreId] = await Promise.all([
    hayPadresFuera ? resolverPaisId(data.pais_madre) : Promise.resolve(null),
    hayPadresFuera ? resolverPaisId(data.pais_padre) : Promise.resolve(null),
  ]);

  const payload = {
    condicion_salud:            data.condicion_salud === 'Si',
    condicion_salud_detalle:    data.condicion_salud === 'Si' ? (data.condicion_salud_detalle || '') : '',
    medicamento:                data.medicamento || '',
    medicamento_detalle:        (data.medicamento === 'Si' || data.medicamento === 'Tal vez') ? (data.medicamento_detalle || '') : '',
    supervisor_extraescolar:    data.supervisor_extraescolar || '',
    supervisor_otro_especifico: data.supervisor_extraescolar === 'Otro' ? (data.supervisor_otro_especifico || '') : '',
    padres_fuera:               hayPadresFuera,
    padres_fuera_detalle:       hayPadresFuera ? (data.padres_fuera_detalle || '') : '',
    pais_madre_id:              paisMadreId,
    pais_madre_otro:            data.pais_madre === 'Otro' ? (data.pais_madre_otro || '') : '',
    pais_padre_id:              paisPadreId,
    pais_padre_otro:            data.pais_padre === 'Otro' ? (data.pais_padre_otro || '') : '',
    observaciones_padres_fuera: hayPadresFuera ? (data.observaciones_padres_fuera || '') : '',
    tipo_casa:                  data.tipo_casa          || '',
    estado_padres:              data.estado_padres       || '',
    convive_padres:             data.convive_padres      || '',
    figuras_familiares:         data.figuras_familiares  || '',
    hermanos_exalumnos_si_no:   data.hermanos_exalumnos_si_no === 'Si',
    valoracion_familia:         data.valoracion_familia ? Number(data.valoracion_familia) : null,
    observaciones_internas:     data.observaciones_internas || null,
  };

  await prisma.entrevista_respuesta_extra.upsert({
    where:  { entrevista_id: entrevistaId },
    create: { entrevista_id: entrevistaId, ...payload },
    update: payload,
  });

  await prisma.entrevista_hermano_exalumno.deleteMany({ where: { entrevista_id: entrevistaId } });

  const hermanos = data.hermanos_exalumnos_si_no === 'Si' ? (data.hermanos || []) : [];

  if (hermanos.length > 0) {
    const tallerIds = await Promise.all(hermanos.map(h => resolverTallerId(h.taller)));

    await prisma.entrevista_hermano_exalumno.createMany({
      data: hermanos.map((h, i) => ({
        entrevista_id:   entrevistaId,
        nombre:          h.nombre || '',
        taller_id:       tallerIds[i],
        anio_graduacion: h.anio ? Number(h.anio) : null,
        tipo_parentesco: h.tipo ? (h.otro_especifico ? `${h.tipo}: ${h.otro_especifico}` : h.tipo) : null,
      })),
    });
  }

  return { ok: true };
};

// ══════════════════════════════════════════════════════════════════════════════
// BUSCAR
// ══════════════════════════════════════════════════════════════════════════════
exports.buscar = async (query) => {
  return await prisma.entrevista.findMany({
    where: {
      estudiante: {
        OR: [
          { nombres:   { contains: query, mode: 'insensitive' } },
          { apellidos: { contains: query, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      estudiante:                    true,
      entrevista_participante:       true,
      cat_entrevistador:             true,
      cat_estado_civil:              true,
      cat_vinculacion_institucional: true,
    },
    orderBy: { fecha_entrevista: 'desc' },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// GET POR ID
// ══════════════════════════════════════════════════════════════════════════════
exports.getById = async (id) => {
  return await prisma.entrevista.findUnique({
    where: { id },
    include: {
      estudiante:                    true,
      cat_estado_civil:              true,
      cat_vinculacion_institucional: true,
      cat_entrevistador:             true,
      entrevista_participante: {
        include: { cat_parentesco: true },
      },
      entrevista_nivel_academico_referente: {
        include: {
          cat_nivel_academico: true,
          cat_estado_estudio:  true,
        },
      },
      entrevista_telefono: {
        include: { cat_dueno_telefono: true },
        orderBy: { orden: 'asc' },
      },
      entrevista_respuesta_principal: true,
      entrevista_respuesta_extra: {
        include: {
          cat_pais_entrevista_respuesta_extra_pais_madre_idTocat_pais: true,
          cat_pais_entrevista_respuesta_extra_pais_padre_idTocat_pais: true,
        },
      },
      entrevista_hermano_exalumno: {
        include: { cat_taller: true },
      },
    },
  });
};