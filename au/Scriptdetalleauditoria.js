// =============================================
// BANCO DE PREGUNTAS POR EVALUACIÓN (sin API)
// =============================================
const EVALUACIONES = {
    'Evaluación DMS': [
        {
            title: 'Gestión del Sistema DMS',
            preguntadoA: 'Responsable de TI / DMS',
            lugarValidacion: 'Oficina / Sistema',
            questions: [
                { id: 1,  text: '¿El sistema DMS se encuentra actualizado a la última versión disponible?' },
                { id: 2,  text: '¿Se realizan respaldos (backups) diarios de la base de datos del DMS?' },
                { id: 3,  text: '¿Los usuarios del DMS cuentan con credenciales únicas e intransferibles?' },
                { id: 4,  text: '¿Existen perfiles de acceso diferenciados por rol en el DMS?' },
                { id: 5,  text: '¿Se registran correctamente los datos del cliente en el módulo de CRM del DMS?' },
            ]
        },
        {
            title: 'Inventario y Stock',
            preguntadoA: 'Jefe de Inventarios',
            lugarValidacion: 'Almacén / Sistema',
            questions: [
                { id: 6,  text: '¿El inventario físico coincide con el registrado en el DMS?' },
                { id: 7,  text: '¿Se realizan conteos cíclicos de inventario al menos una vez por semana?' },
                { id: 8,  text: '¿Las órdenes de compra se registran en el DMS antes de recibir la mercadería?' },
                { id: 9,  text: '¿Los movimientos de stock (entradas/salidas) tienen respaldo documental?' },
                { id: 10, text: '¿Los repuestos obsoletos están correctamente identificados y separados en el DMS?' },
            ]
        },
        {
            title: 'Facturación y Cobranzas',
            preguntadoA: 'Contador / Cajero',
            lugarValidacion: 'Caja / Sistema',
            questions: [
                { id: 11, text: '¿Las facturas emitidas coinciden con las órdenes de trabajo registradas en el DMS?' },
                { id: 12, text: '¿Los descuentos aplicados están debidamente autorizados y registrados?' },
                { id: 13, text: '¿El cierre de caja diario se realiza y cuadra con el DMS?' },
                { id: 14, text: '¿Las cuentas por cobrar están correctamente actualizadas en el sistema?' },
                { id: 15, text: '¿Se emiten reportes de facturación diaria desde el DMS?' },
            ]
        },
        {
            title: 'Reportes y Análisis',
            preguntadoA: 'Gerente / Supervisor',
            lugarValidacion: 'Oficina de Gerencia',
            questions: [
                { id: 16, text: '¿Se generan reportes mensuales de KPIs desde el DMS?' },
                { id: 17, text: '¿Los reportes de ventas se comparan con las metas establecidas?' },
                { id: 18, text: '¿Se utiliza el módulo de análisis de rentabilidad del DMS?' },
                { id: 19, text: '¿La gerencia revisa regularmente los tableros de control del DMS?' },
                { id: 20, text: '¿Los reportes de productividad del taller están disponibles y actualizados?' },
            ]
        }
    ],

    'Evaluación Postventa': [
        {
            title: 'Recepción de Vehículos',
            preguntadoA: 'Asesor de Servicio / Recepcionista',
            lugarValidacion: 'Área de Recepción',
            questions: [
                { id: 101, text: '¿Se realiza el peritaje del vehículo con el cliente presente al momento de la recepción?' },
                { id: 102, text: '¿Se entrega una copia de la Orden de Trabajo (OT) al cliente al momento de dejar el vehículo?' },
                { id: 103, text: '¿Se registran los datos del cliente y vehículo correctamente en el sistema?' },
                { id: 104, text: '¿Se informa al cliente el tiempo estimado de entrega?' },
                { id: 105, text: '¿Se verifica el nivel de combustible y kilometraje en la recepción?' },
            ]
        },
        {
            title: 'Taller y Técnicos',
            preguntadoA: 'Jefe de Taller / Técnico',
            lugarValidacion: 'Taller / Piso',
            questions: [
                { id: 106, text: '¿Los técnicos cuentan con herramientas certificadas y en buen estado?' },
                { id: 107, text: '¿Se utilizan procedimientos técnicos estándar del fabricante (TSB)?' },
                { id: 108, text: '¿Las Órdenes de Trabajo se completan con todos los campos requeridos?' },
                { id: 109, text: '¿Existe un sistema de control de tiempo por trabajo (time tracking)?' },
                { id: 110, text: '¿Los técnicos cuentan con certificaciones vigentes del fabricante?' },
            ]
        },
        {
            title: 'Entrega del Vehículo',
            preguntadoA: 'Asesor de Servicio',
            lugarValidacion: 'Área de Entrega',
            questions: [
                { id: 111, text: '¿Se realiza una explicación detallada al cliente sobre los trabajos efectuados?' },
                { id: 112, text: '¿Se entrega el vehículo limpio (lavado y aspirado)?' },
                { id: 113, text: '¿Se entrega al cliente las piezas reemplazadas (cuando aplica)?' },
                { id: 114, text: '¿El cliente firma la conformidad de entrega del vehículo?' },
                { id: 115, text: '¿Se le informa al cliente la próxima fecha de mantenimiento recomendada?' },
            ]
        },
        {
            title: 'Satisfacción del Cliente',
            preguntadoA: 'Supervisor de Postventa',
            lugarValidacion: 'Oficina de Postventa',
            questions: [
                { id: 116, text: '¿Se realizan llamadas de seguimiento post-servicio dentro de las 72 horas?' },
                { id: 117, text: '¿Los resultados de encuestas CSI se revisan y se toman acciones correctivas?' },
                { id: 118, text: '¿El indicador de retención de clientes se monitorea mensualmente?' },
                { id: 119, text: '¿Existe un proceso formal de gestión de quejas y reclamos?' },
                { id: 120, text: '¿El índice de retrabajo (come-backs) es menor al 5%?' },
            ]
        }
    ],

    'Evaluación Ventas': [
        {
            title: 'Atención al Cliente',
            preguntadoA: 'Vendedor / Asesor Comercial',
            lugarValidacion: 'Sala de Ventas / Showroom',
            questions: [
                { id: 201, text: '¿El vendedor realiza un saludo formal y se presenta con nombre al cliente?' },
                { id: 202, text: '¿Se aplica el proceso de sondeo de necesidades al cliente (por qué, para qué, cómo)?' },
                { id: 203, text: '¿Se realiza una presentación del vehículo siguiendo el walk-around estándar?' },
                { id: 204, text: '¿Se ofrece al cliente una prueba de manejo (test drive)?' },
                { id: 205, text: '¿Se entrega material informativo (cotización, ficha técnica) al cliente?' },
            ]
        },
        {
            title: 'Proceso de Cotización',
            preguntadoA: 'Vendedor / Jefe de Ventas',
            lugarValidacion: 'Sala de Ventas',
            questions: [
                { id: 206, text: '¿Las cotizaciones presentadas incluyen todos los costos (precio, impuestos, accesorios)?' },
                { id: 207, text: '¿El vendedor conoce las opciones de financiamiento disponibles?' },
                { id: 208, text: '¿Se presenta correctamente la tabla de precios vigente?' },
                { id: 209, text: '¿Los descuentos ofrecidos se encuentran dentro de los rangos autorizados?' },
                { id: 210, text: '¿Se registra el prospecto en el CRM con todos sus datos?' },
            ]
        },
        {
            title: 'Seguimiento de Prospectos',
            preguntadoA: 'Jefe de Ventas / Supervisor CRM',
            lugarValidacion: 'Oficina de Ventas / CRM',
            questions: [
                { id: 211, text: '¿Los prospectos en el CRM tienen actividades de seguimiento asignadas?' },
                { id: 212, text: '¿Se realiza al menos 3 contactos de seguimiento a prospectos no cerrados?' },
                { id: 213, text: '¿El pipeline de ventas está actualizado y refleja el estado real de cada oportunidad?' },
                { id: 214, text: '¿Los prospectos perdidos tienen registrado el motivo de pérdida en el CRM?' },
                { id: 215, text: '¿Se realizan reuniones semanales de seguimiento del pipeline?' },
            ]
        },
        {
            title: 'Entrega del Vehículo',
            preguntadoA: 'Vendedor / Jefe de Entregas',
            lugarValidacion: 'Área de Entrega',
            questions: [
                { id: 216, text: '¿Se realiza la presentación completa del vehículo al momento de la entrega?' },
                { id: 217, text: '¿El cliente firma el acta de entrega y la checklist de conformidad?' },
                { id: 218, text: '¿Se explican al cliente los beneficios de mantenimiento y garantía?' },
                { id: 219, text: '¿El vehículo se entrega lavado, con combustible y sin daños?' },
                { id: 220, text: '¿Se toma foto de la entrega para el archivo del expediente del cliente?' },
            ]
        }
    ],

    'Evaluación Infraestructura': [
        {
            title: 'Imagen Exterior',
            preguntadoA: 'Gerente de Local / Supervisor',
            lugarValidacion: 'Fachada / Estacionamiento',
            questions: [
                { id: 301, text: '¿La fachada del local se encuentra limpia y en buen estado?' },
                { id: 302, text: '¿La señalética exterior es visible, está actualizada y cumple con los estándares de marca?' },
                { id: 303, text: '¿El estacionamiento está señalizado correctamente (clientes, exhibición, servicio)?' },
                { id: 304, text: '¿Los vehículos en exhibición exterior están limpios y correctamente posicionados?' },
                { id: 305, text: '¿La iluminación exterior funciona correctamente en horas nocturnas?' },
            ]
        },
        {
            title: 'Showroom / Sala de Ventas',
            preguntadoA: 'Supervisor de Ventas',
            lugarValidacion: 'Showroom',
            questions: [
                { id: 306, text: '¿El showroom está limpio, ordenado y con la iluminación adecuada?' },
                { id: 307, text: '¿Los vehículos en exhibición están correctamente presentados (precios, fichas)?' },
                { id: 308, text: '¿El material POP (afiches, banners) está vigente y en buen estado?' },
                { id: 309, text: '¿El área de espera del cliente cuenta con sillas, agua y WiFi disponibles?' },
                { id: 310, text: '¿Los baños para clientes están limpios y bien abastecidos?' },
            ]
        },
        {
            title: 'Taller y Área de Servicio',
            preguntadoA: 'Jefe de Taller',
            lugarValidacion: 'Taller',
            questions: [
                { id: 311, text: '¿El taller cuenta con la señalización de seguridad requerida (EPP, zonas de riesgo)?' },
                { id: 312, text: '¿Las herramientas y equipos están ordenados y limpios (metodología 5S)?' },
                { id: 313, text: '¿Los elevadores y equipos de diagnóstico tienen calibración vigente?' },
                { id: 314, text: '¿El área de taller está libre de derrames de aceite o líquidos peligrosos?' },
                { id: 315, text: '¿Existe un plan de mantenimiento preventivo para los equipos del taller?' },
            ]
        },
        {
            title: 'Almacén de Repuestos',
            preguntadoA: 'Jefe de Repuestos',
            lugarValidacion: 'Almacén',
            questions: [
                { id: 316, text: '¿El almacén está organizado con sistema de ubicaciones (racks etiquetados)?' },
                { id: 317, text: '¿Los repuestos están protegidos de humedad, polvo y daños físicos?' },
                { id: 318, text: '¿Existe control de temperatura para repuestos sensibles (electrónicos, gomas)?' },
                { id: 319, text: '¿Los repuestos de alta rotación están ubicados en zonas de fácil acceso?' },
                { id: 320, text: '¿El almacén cuenta con control de acceso (solo personal autorizado)?' },
            ]
        }
    ],

    'Evaluación RRHH': [
        {
            title: 'Contratación y Onboarding',
            preguntadoA: 'Jefe de RRHH',
            lugarValidacion: 'Oficina de RRHH',
            questions: [
                { id: 401, text: '¿Todo el personal cuenta con contrato de trabajo firmado y vigente?' },
                { id: 402, text: '¿Los nuevos colaboradores reciben un proceso de inducción formal?' },
                { id: 403, text: '¿Los expedientes del personal están completos y actualizados?' },
                { id: 404, text: '¿Se realizan verificaciones de antecedentes antes de la contratación?' },
                { id: 405, text: '¿Existe un programa de onboarding documentado para cada puesto?' },
            ]
        },
        {
            title: 'Capacitación y Desarrollo',
            preguntadoA: 'Jefe de RRHH / Gerente',
            lugarValidacion: 'Sala de Capacitación / Sistema',
            questions: [
                { id: 406, text: '¿Se cuenta con un plan anual de capacitación aprobado?' },
                { id: 407, text: '¿Los técnicos cuentan con capacitaciones del fabricante al día?' },
                { id: 408, text: '¿Los vendedores han completado la certificación de producto vigente?' },
                { id: 409, text: '¿Se registran y archivan las constancias de capacitación del personal?' },
                { id: 410, text: '¿Existe un programa de línea de carrera para los colaboradores?' },
            ]
        },
        {
            title: 'Clima Laboral y Bienestar',
            preguntadoA: 'Jefe de RRHH / Personal',
            lugarValidacion: 'Oficina de RRHH',
            questions: [
                { id: 411, text: '¿Se realizan encuestas de clima laboral al menos una vez al año?' },
                { id: 412, text: '¿Los resultados de las encuestas de clima tienen planes de acción?' },
                { id: 413, text: '¿El personal cuenta con acceso a beneficios de salud y bienestar?' },
                { id: 414, text: '¿Existe un canal formal para que el personal presente quejas o sugerencias?' },
                { id: 415, text: '¿Se realizan actividades de integración del equipo al menos trimestralmente?' },
            ]
        },
        {
            title: 'Evaluación de Desempeño',
            preguntadoA: 'Gerente / Supervisor',
            lugarValidacion: 'Oficina de Gerencia / RRHH',
            questions: [
                { id: 416, text: '¿Se realizan evaluaciones de desempeño al menos semestralmente?' },
                { id: 417, text: '¿Los colaboradores conocen sus indicadores de desempeño (KPIs)?' },
                { id: 418, text: '¿Las evaluaciones de desempeño tienen retroalimentación documentada?' },
                { id: 419, text: '¿Los resultados de desempeño están vinculados al sistema de incentivos?' },
                { id: 420, text: '¿Se hace seguimiento a los planes de mejora individuales post-evaluación?' },
            ]
        }
    ]
};

// Fallback genérico si la evaluación no coincide con ninguna clave
function getEvaluacionGenerica(nombre) {
    return [
        {
            title: 'Procesos Generales',
            preguntadoA: 'Responsable del área',
            lugarValidacion: 'Local',
            questions: [
                { id: 901, text: '¿Los procesos están documentados y son conocidos por el equipo?' },
                { id: 902, text: '¿Se cumplen los estándares establecidos por la marca?' },
                { id: 903, text: '¿El personal está capacitado para sus funciones actuales?' },
                { id: 904, text: '¿Se realizan reuniones de equipo periódicas?' },
                { id: 905, text: '¿Existe un sistema de seguimiento de indicadores clave?' },
            ]
        },
        {
            title: 'Calidad y Mejora Continua',
            preguntadoA: 'Supervisor / Gerente',
            lugarValidacion: 'Oficina',
            questions: [
                { id: 906, text: '¿Se registran y analizan los incidentes o no conformidades?' },
                { id: 907, text: '¿Se aplican acciones correctivas ante desviaciones detectadas?' },
                { id: 908, text: '¿Los clientes reciben seguimiento posterior a la venta o servicio?' },
                { id: 909, text: '¿Se mide regularmente la satisfacción del cliente?' },
                { id: 910, text: '¿Existe un proceso de mejora continua documentado y activo?' },
            ]
        }
    ];
}

// =============================================
// Variables globales
// =============================================
let auditoriaId = null;
let evaluacionData = { sections: [] };
let answers = {};
let questionData = {};
let currentSectionIndex = 0;
let currentModalQuestionId = null;
let totalQuestions = 0;

// Evidencia carrusel
let currentEvidenciaIndex = 0;
const MAX_EVIDENCIAS = 3;

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    auditoriaId = parseInt(urlParams.get('id'));

    if (!auditoriaId) {
        showNotification('No se especificó una auditoría', 'error');
        setTimeout(() => { window.location.href = 'auditorias.html'; }, 2000);
        return;
    }

    loadAuditoriaData();

    totalQuestions = evaluacionData.sections.reduce((sum, s) => sum + s.questions.length, 0);

    renderSection();
    updateProgress();
    initModals();
    initNav();
});

// =============================================
// CARGAR DATOS DE LA AUDITORÍA (sin API)
// =============================================
function loadAuditoriaData() {
    // Leer la auditoría guardada en localStorage por scriptauditorias.js
    let auditoria = null;

    try {
        const stored = localStorage.getItem('auditorias_data');
        if (stored) {
            const lista = JSON.parse(stored);
            auditoria = lista.find(a => a.id === auditoriaId);
        }
    } catch (e) {
        console.warn('No se pudo leer localStorage:', e);
    }

    const evaluacionNombre = auditoria?.evaluacion || '';
    const sections = EVALUACIONES[evaluacionNombre] || getEvaluacionGenerica(evaluacionNombre);

    // Inicializar answers y questionData
    sections.forEach(s => {
        s.questions.forEach(q => {
            if (!(q.id in answers)) answers[q.id] = null;
            if (!(q.id in questionData)) {
                questionData[q.id] = {
                    comoValido: '',
                    comentario: '',
                    evidencias: [null, null, null],
                    planAccion: {}
                };
            }
        });
    });

    evaluacionData.sections = sections;

    // Intentar recuperar respuestas guardadas previamente
    try {
        const savedAnswers = localStorage.getItem('auditoria_answers_' + auditoriaId);
        const savedQData   = localStorage.getItem('auditoria_qdata_'   + auditoriaId);
        if (savedAnswers) Object.assign(answers,      JSON.parse(savedAnswers));
        if (savedQData)   Object.assign(questionData, JSON.parse(savedQData));
    } catch (e) {
        console.warn('No se pudo restaurar respuestas previas:', e);
    }

    showNotification('Auditoría cargada correctamente', 'success');
}

// =============================================
// GUARDAR RESPUESTAS EN localStorage (sin API)
// =============================================
function guardarRespuestaLocal(preguntaId) {
    try {
        localStorage.setItem('auditoria_answers_' + auditoriaId, JSON.stringify(answers));
        localStorage.setItem('auditoria_qdata_'   + auditoriaId, JSON.stringify(questionData));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

// =============================================
// RENDER
// =============================================
function renderSection() {
    const card = document.getElementById('evalCard');
    const section = evaluacionData.sections[currentSectionIndex];
    if (!section) return;

    let html = `
        <div class="eval-section-title">${section.title}</div>
        <div class="eval-meta">
            <div class="eval-meta-item">
                <span class="eval-meta-label">¿A quién se le preguntó?</span>
                <span class="eval-meta-value">${section.preguntadoA}</span>
            </div>
            <div class="eval-meta-item">
                <span class="eval-meta-label">¿En qué lugar se validó?</span>
                <span class="eval-meta-value">${section.lugarValidacion}</span>
            </div>
        </div>
    `;

    section.questions.forEach((q, idx) => {
        const siActive  = answers[q.id] === 'si' ? 'active' : '';
        const noActive  = answers[q.id] === 'no' ? 'active' : '';
        const planVisible = answers[q.id] === 'no' ? 'visible' : '';
        const cvClass   = questionData[q.id]?.comoValido  ? 'has-data' : '';
        const evs       = questionData[q.id]?.evidencias || [];
        const evClass   = evs.some(e => e !== null) ? 'has-data' : '';
        const cmClass   = questionData[q.id]?.comentario ? 'has-data' : '';

        html += `
        <div class="question-box" id="qbox-${q.id}">
            <div class="q-top">
                <span class="q-number">${idx + 1}</span>
                <span class="q-text">${q.text}</span>
                <div class="q-buttons">
                    <button class="btn-si ${siActive}" onclick="setAnswer(${q.id},'si')">Sí</button>
                    <button class="btn-no ${noActive}" onclick="setAnswer(${q.id},'no')">No</button>
                </div>
            </div>
            <div class="q-bottom">
                <div class="q-bottom-left">
                    <button class="link-como-valido ${cvClass}" onclick="openComoValido(${q.id})">¿Cómo validó?</button>
                </div>
                <div class="q-bottom-right">
                    <button class="link-action ${evClass}" onclick="openEvidencia(${q.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        Evidencia
                    </button>
                    <button class="link-action ${cmClass}" onclick="openComentario(${q.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Comentario
                    </button>
                </div>
            </div>
            <div class="q-plan-row ${planVisible}" id="plan-${q.id}">
                <button class="link-plan" onclick="openPlanAccion(${q.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    Plan de Acción
                </button>
            </div>
        </div>`;
    });

    card.innerHTML = html;
}

// =============================================
// SÍ / NO
// =============================================
function setAnswer(qId, val) {
    answers[qId] = answers[qId] === val ? null : val;

    const box = document.getElementById('qbox-' + qId);
    box.querySelector('.btn-si').classList.toggle('active', answers[qId] === 'si');
    box.querySelector('.btn-no').classList.toggle('active', answers[qId] === 'no');

    const planRow = document.getElementById('plan-' + qId);
    if (answers[qId] === 'no') planRow.classList.add('visible');
    else planRow.classList.remove('visible');

    guardarRespuestaLocal(qId);
    updateProgress();
}

// =============================================
// PROGRESO
// =============================================
function updateProgress() {
    const allIds    = evaluacionData.sections.flatMap(s => s.questions.map(q => q.id));
    const total     = allIds.length;
    const siCount   = allIds.filter(id => answers[id] === 'si').length;
    const noCount   = allIds.filter(id => answers[id] === 'no').length;
    const answered  = siCount + noCount;

    document.getElementById('progressCount').textContent = answered + '/' + total;
    document.getElementById('progressGreen').style.width  = (siCount  / total * 100) + '%';
    document.getElementById('progressRed').style.width    = (noCount  / total * 100) + '%';
}

// =============================================
// NAVEGACIÓN
// =============================================
function initNav() {
    document.getElementById('btnSiguiente').addEventListener('click', function () {
        if (currentSectionIndex < evaluacionData.sections.length - 1) {
            currentSectionIndex++;
            renderSection();
            updateProgress();
            updateNavButtons();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            finalizarAuditoria();
        }
    });

    document.getElementById('btnAnterior').addEventListener('click', function () {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            renderSection();
            updateProgress();
            updateNavButtons();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('btnVolverAuditoria').addEventListener('click', function () {
        document.getElementById('resultsContent').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('btnDownload').addEventListener('click', downloadResults);
    updateNavButtons();
}

function updateNavButtons() {
    const btnAnterior  = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');

    btnAnterior.style.display = currentSectionIndex > 0 ? 'inline-flex' : 'none';
    btnSiguiente.textContent  = currentSectionIndex >= evaluacionData.sections.length - 1 ? 'Finalizar' : 'Siguiente';
}

function finalizarAuditoria() {
    const allIds     = evaluacionData.sections.flatMap(s => s.questions.map(q => q.id));
    const unanswered = allIds.filter(id => answers[id] === null).length;

    if (unanswered > 0) {
        showNotification('Faltan ' + unanswered + ' preguntas por responder', 'warning');
        return;
    }

    // Actualizar estado de la auditoría en localStorage
    try {
        const stored = localStorage.getItem('auditorias_data');
        if (stored) {
            const lista = JSON.parse(stored);
            const idx   = lista.findIndex(a => a.id === auditoriaId);
            if (idx !== -1) {
                lista[idx].estado = 'Completado';
                const pct = calcularPorcentaje();
                lista[idx].cumplimiento_porcentaje = pct;
                localStorage.setItem('auditorias_data', JSON.stringify(lista));
            }
        }
    } catch (e) {
        console.warn('No se pudo actualizar el estado:', e);
    }

    showResults();
}

function calcularPorcentaje() {
    const allIds  = evaluacionData.sections.flatMap(s => s.questions.map(q => q.id));
    const total   = allIds.length;
    const siCount = allIds.filter(id => answers[id] === 'si').length;
    return total > 0 ? parseFloat(((siCount / total) * 100).toFixed(2)) : 0;
}

// =============================================
// RESULTADOS (sin API)
// =============================================
function calculateResults() {
    const sections  = evaluacionData.sections;
    let totalObt    = 0;
    let totalMax    = 0;
    const results   = [];

    sections.forEach(s => {
        const obtenido = s.questions.filter(q => answers[q.id] === 'si').length * 5;
        const maximo   = s.questions.length * 5;
        const pct      = maximo > 0 ? (obtenido / maximo * 100) : 0;
        results.push({ title: s.title, obtenido, maximo, porcentaje: pct });
        totalObt += obtenido;
        totalMax += maximo;
    });

    const totalPct = totalMax > 0 ? (totalObt / totalMax * 100) : 0;
    return { sections: results, totalObtenido: totalObt, totalMaximo: totalMax, totalPct };
}

function getPctClass(pct) {
    if (pct >= 80) return 'pct-green';
    if (pct >= 70) return 'pct-yellow';
    return 'pct-red';
}

function showResults() {
    const data  = calculateResults();
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';

    data.sections.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-section">${s.title}</td>
            <td>${s.obtenido}</td>
            <td>${s.maximo}</td>
            <td><span class="pct-badge ${getPctClass(s.porcentaje)}">${s.porcentaje.toFixed(2)}%</span></td>
        `;
        tbody.appendChild(row);
    });

    const totalDiv = document.getElementById('resultsTotal');
    totalDiv.innerHTML = `
        <span class="results-total-label">%Cumplimiento Total</span>
        <span class="results-total-value pct-badge ${getPctClass(data.totalPct)}">${data.totalPct.toFixed(2)}%</span>
    `;

    document.getElementById('mainContent').style.display  = 'none';
    document.getElementById('resultsContent').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Auditoría finalizada exitosamente', 'success');
}

// =============================================
// DESCARGA
// =============================================
function downloadResults() {
    const data = calculateResults();
    const now  = new Date();

    let csv = '\uFEFF';
    csv += 'RESUMEN DE RESULTADOS DE AUDITORÍA\n';
    csv += 'Auditoría ID: ' + auditoriaId + '\n';
    csv += 'Fecha: ' + now.toLocaleDateString('es-PE') + ' ' + now.toLocaleTimeString('es-PE') + '\n\n';
    csv += 'Sección,Obtenido,Máximo,%\n';
    data.sections.forEach(s => {
        csv += `${s.title},${s.obtenido},${s.maximo},${s.porcentaje.toFixed(2)}%\n`;
    });
    csv += `\n%Cumplimiento Total,,,${data.totalPct.toFixed(2)}%\n\n`;
    csv += 'DETALLE POR PREGUNTA\n';
    csv += 'Sección,Pregunta,Respuesta,Cómo Validó,Comentario,Plan de Acción\n';

    evaluacionData.sections.forEach(section => {
        section.questions.forEach(q => {
            const resp      = answers[q.id] === 'si' ? 'Sí' : answers[q.id] === 'no' ? 'No' : 'Sin responder';
            const qd        = questionData[q.id];
            const comoValido = (qd?.comoValido || '').replace(/"/g, '""');
            const comentario = (qd?.comentario || '').replace(/"/g, '""');
            let plan = '';
            if (qd?.planAccion?.descripcion) {
                plan = `Acción: ${qd.planAccion.descripcion} | Responsable: ${qd.planAccion.responsable || ''} | Fecha: ${qd.planAccion.fecha || ''}`;
                plan = plan.replace(/"/g, '""');
            }
            csv += `"${section.title}","${q.text}","${resp}","${comoValido}","${comentario}","${plan}"\n`;
        });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Resultados_Auditoria_' + auditoriaId + '_' + now.toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Resultados descargados', 'success');
}

// =============================================
// MODALES
// =============================================
function openModal(id)  { document.getElementById(id).classList.add('show');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('show'); document.body.style.overflow = 'auto';   }

function openComoValido(qId) {
    currentModalQuestionId = qId;
    document.getElementById('comoValidoText').value = questionData[qId]?.comoValido || '';
    openModal('comoValidoModal');
}

function openComentario(qId) {
    currentModalQuestionId = qId;
    document.getElementById('comentarioText').value = questionData[qId]?.comentario || '';
    openModal('comentarioModal');
}

function openEvidencia(qId) {
    currentModalQuestionId = qId;
    currentEvidenciaIndex  = 0;

    if (!questionData[qId].evidencias) questionData[qId].evidencias = [];
    while (questionData[qId].evidencias.length < MAX_EVIDENCIAS) {
        questionData[qId].evidencias.push(null);
    }

    renderEvidenciaSlot();
    updateEvDots();
    openModal('evidenciaModal');
}

function openPlanAccion(qId) {
    currentModalQuestionId = qId;
    const plan = questionData[qId]?.planAccion || {};
    document.getElementById('planDescripcion').value = plan.descripcion || '';
    document.getElementById('planResponsable').value = plan.responsable || '';
    document.getElementById('planFecha').value       = plan.fecha       || '';
    openModal('planAccionModal');
}

// =============================================
// EVIDENCIA — CARRUSEL
// =============================================
function renderEvidenciaSlot() {
    const container = document.getElementById('evSlotContainer');
    if (!container) return;
    const qId  = currentModalQuestionId;
    const item = questionData[qId].evidencias[currentEvidenciaIndex];

    if (!item) {
        container.innerHTML = `
            <div class="ev-slot-empty" id="evSlotEmpty">
                <div class="ev-plus-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
                <p>Agregar Evidencia</p>
            </div>`;
        document.getElementById('evSlotEmpty').addEventListener('click', () => {
            document.getElementById('evidenciaFile').click();
        });
    } else {
        const isPdf = item.name?.toLowerCase().endsWith('.pdf');
        container.innerHTML = `
            <div class="ev-slot-filled">
                ${isPdf
                    ? `<div class="ev-pdf-icon">📄</div><div class="ev-file-name">${item.name}</div>`
                    : `<img src="${item.dataUrl}" alt="${item.name}">`
                }
                <button class="ev-remove-btn" id="evRemoveBtn" title="Eliminar">✕</button>
            </div>`;
        document.getElementById('evRemoveBtn').addEventListener('click', () => {
            questionData[qId].evidencias[currentEvidenciaIndex] = null;
            renderEvidenciaSlot();
            updateEvDots();
        });
    }
}

function updateEvDots() {
    if (!currentModalQuestionId) return;
    const qId = currentModalQuestionId;
    document.querySelectorAll('#evDots .ev-dot').forEach((dot, i) => {
        dot.classList.toggle('active',    i === currentEvidenciaIndex);
        dot.classList.toggle('has-file', !!(questionData[qId]?.evidencias?.[i]));
    });
}

function initModals() {
    // ¿Cómo validó?
    document.getElementById('closeComoValido').onclick  = () => closeModal('comoValidoModal');
    document.getElementById('cancelComoValido').onclick = () => closeModal('comoValidoModal');
    document.getElementById('saveComoValido').onclick   = () => {
        questionData[currentModalQuestionId].comoValido = document.getElementById('comoValidoText').value;
        guardarRespuestaLocal(currentModalQuestionId);
        closeModal('comoValidoModal');
        renderSection();
        showNotification('Guardado', 'success');
    };

    // Comentario
    document.getElementById('closeComentario').onclick  = () => closeModal('comentarioModal');
    document.getElementById('cancelComentario').onclick = () => closeModal('comentarioModal');
    document.getElementById('saveComentario').onclick   = () => {
        questionData[currentModalQuestionId].comentario = document.getElementById('comentarioText').value;
        guardarRespuestaLocal(currentModalQuestionId);
        closeModal('comentarioModal');
        renderSection();
        showNotification('Comentario guardado', 'success');
    };

    // Evidencia
    document.getElementById('closeEvidencia').onclick  = () => closeModal('evidenciaModal');
    document.getElementById('cancelEvidencia').onclick = () => closeModal('evidenciaModal');
    document.getElementById('saveEvidencia').onclick   = () => {
        closeModal('evidenciaModal');
        renderSection();
        showNotification('Evidencia guardada', 'success');
    };

    document.getElementById('evPrev').addEventListener('click', () => {
        currentEvidenciaIndex = (currentEvidenciaIndex - 1 + MAX_EVIDENCIAS) % MAX_EVIDENCIAS;
        renderEvidenciaSlot();
        updateEvDots();
    });
    document.getElementById('evNext').addEventListener('click', () => {
        currentEvidenciaIndex = (currentEvidenciaIndex + 1) % MAX_EVIDENCIAS;
        renderEvidenciaSlot();
        updateEvDots();
    });
    document.getElementById('evDots').addEventListener('click', (e) => {
        const dot = e.target.closest('.ev-dot');
        if (dot) {
            currentEvidenciaIndex = parseInt(dot.dataset.idx);
            renderEvidenciaSlot();
            updateEvDots();
        }
    });

    document.getElementById('evidenciaFile').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const qId    = currentModalQuestionId;
        const reader = new FileReader();
        reader.onload = (ev) => {
            questionData[qId].evidencias[currentEvidenciaIndex] = {
                name:    file.name,
                file:    file,
                dataUrl: ev.target.result
            };
            renderEvidenciaSlot();
            updateEvDots();
            const next = questionData[qId].evidencias.findIndex((item, i) => i > currentEvidenciaIndex && !item);
            if (next !== -1) {
                setTimeout(() => {
                    currentEvidenciaIndex = next;
                    renderEvidenciaSlot();
                    updateEvDots();
                }, 400);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Plan de acción
    document.getElementById('closePlanAccion').onclick  = () => closeModal('planAccionModal');
    document.getElementById('cancelPlanAccion').onclick = () => closeModal('planAccionModal');
    document.getElementById('savePlanAccion').onclick   = () => {
        questionData[currentModalQuestionId].planAccion = {
            descripcion: document.getElementById('planDescripcion').value,
            responsable: document.getElementById('planResponsable').value,
            fecha:       document.getElementById('planFecha').value
        };
        guardarRespuestaLocal(currentModalQuestionId);
        closeModal('planAccionModal');
        showNotification('Plan de acción guardado', 'success');
    };

    // Escape / click fuera
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['comoValidoModal', 'comentarioModal', 'evidenciaModal', 'planAccionModal'].forEach(closeModal);
        }
    });
    ['comoValidoModal', 'comentarioModal', 'evidenciaModal', 'planAccionModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', function (e) {
            if (e.target === this) closeModal(id);
        });
    });
}

// =============================================
// NOTIFICACIÓN
// =============================================
function showNotification(msg, type) {
    const el = document.createElement('div');
    el.textContent = msg;
    let bg;
    switch (type) {
        case 'success': bg = 'linear-gradient(135deg,#10B981,#059669)'; break;
        case 'error':   bg = 'linear-gradient(135deg,#DC2626,#B91C1C)'; break;
        case 'warning': bg = 'linear-gradient(135deg,#F59E0B,#D97706)'; break;
        default:        bg = 'linear-gradient(135deg,#1D3579,#48BED7)';
    }
    el.style.cssText = `position:fixed;top:20px;right:20px;background:${bg};color:#fff;padding:14px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:10000;font-weight:600;font-family:'Inter',sans-serif;font-size:14px;`;
    document.body.appendChild(el);
    setTimeout(() => {
        setTimeout(() => { if (document.body.contains(el)) document.body.removeChild(el); }, 300);
    }, 2500);
}

console.log('scriptdetalleauditoria.js — modo sin API, preguntas hardcodeadas');