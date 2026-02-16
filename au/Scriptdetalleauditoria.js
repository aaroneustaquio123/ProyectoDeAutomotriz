// =============================================
// CONFIGURACIÓN DE LA API
// =============================================
const API_URL = 'http://127.0.0.1:8000';

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

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', async function () {
    // Obtener ID de la auditoría desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    auditoriaId = parseInt(urlParams.get('id'));
    
    if (!auditoriaId) {
        showNotification('No se especificó una auditoría', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Cargar datos de la auditoría y preguntas
    await loadAuditoriaData();
    
    // Inicializar respuestas
    evaluacionData.sections.forEach(s => {
        s.questions.forEach(q => {
            answers[q.id] = null;
            questionData[q.id] = { 
                comoValido: '', 
                comentario: '', 
                evidencias: [], 
                planAccion: {} 
            };
        });
    });
    
    totalQuestions = evaluacionData.sections.reduce((sum, s) => sum + s.questions.length, 0);
    
    renderSection();
    updateProgress();
    initModals();
    initNav();
});

// =============================================
// CARGAR DATOS DE LA AUDITORÍA
// =============================================
async function loadAuditoriaData() {
    try {
        showNotification('Cargando auditoría...', 'info');
        
        // Cargar preguntas desde la API
        const response = await fetch(`${API_URL}/auditorias/${auditoriaId}/preguntas`);
        if (!response.ok) {
            throw new Error('Error al cargar las preguntas');
        }
        
        const preguntas = await response.json();
        
        // Organizar preguntas por categoría
        const categorias = {};
        preguntas.forEach(p => {
            if (!categorias[p.categoria_nombre]) {
                categorias[p.categoria_nombre] = {
                    title: p.categoria_nombre,
                    preguntadoA: 'Responsable del área',
                    lugarValidacion: 'Local',
                    questions: []
                };
            }
            
            categorias[p.categoria_nombre].questions.push({
                id: p.pregunta_id,
                text: p.pregunta
            });
            
            // Si ya tiene respuesta, cargarla
            if (p.respuesta_id) {
                answers[p.pregunta_id] = p.respuesta ? 'si' : 'no';
                questionData[p.pregunta_id] = {
                    comoValido: p.como_valido || '',
                    comentario: p.comentario || '',
                    evidencias: [],
                    planAccion: {}
                };
            }
        });
        
        // Convertir a array de secciones
        evaluacionData.sections = Object.values(categorias);
        
        showNotification('Auditoría cargada correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar la auditoría', 'error');
    }
}

// =============================================
// GUARDAR RESPUESTA EN LA API
// =============================================
async function guardarRespuesta(preguntaId) {
    try {
        const respuesta = answers[preguntaId] === 'si' ? 1 : 0;
        const datos = questionData[preguntaId];
        
        const response = await fetch(`${API_URL}/auditorias/${auditoriaId}/respuestas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pregunta_id: preguntaId,
                respuesta: respuesta,
                comentario: datos.comentario || null,
                como_valido: datos.comoValido || null
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar la respuesta');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error guardando respuesta:', error);
        showNotification('Error al guardar la respuesta', 'error');
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
        const siActive = answers[q.id] === 'si' ? 'active' : '';
        const noActive = answers[q.id] === 'no' ? 'active' : '';
        const planVisible = answers[q.id] === 'no' ? 'visible' : '';
        const cvClass = questionData[q.id].comoValido ? 'has-data' : '';
        const evClass = questionData[q.id].evidencias.length > 0 ? 'has-data' : '';
        const cmClass = questionData[q.id].comentario ? 'has-data' : '';

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
async function setAnswer(qId, val) {
    answers[qId] = answers[qId] === val ? null : val;

    const box = document.getElementById('qbox-' + qId);
    box.querySelector('.btn-si').classList.toggle('active', answers[qId] === 'si');
    box.querySelector('.btn-no').classList.toggle('active', answers[qId] === 'no');

    const planRow = document.getElementById('plan-' + qId);
    if (answers[qId] === 'no') planRow.classList.add('visible');
    else planRow.classList.remove('visible');

    // Guardar respuesta en la API
    if (answers[qId] !== null) {
        await guardarRespuesta(qId);
    }

    updateProgress();
}

// =============================================
// PROGRESO
// =============================================
function updateProgress() {
    const allIds = evaluacionData.sections.flatMap(s => s.questions.map(q => q.id));
    const total = allIds.length;
    const siCount = allIds.filter(id => answers[id] === 'si').length;
    const noCount = allIds.filter(id => answers[id] === 'no').length;
    const answered = siCount + noCount;

    document.getElementById('progressCount').textContent = answered + '/' + total;
    document.getElementById('progressGreen').style.width = (siCount / total * 100) + '%';
    document.getElementById('progressRed').style.width = (noCount / total * 100) + '%';
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

    // Botón "Volver a la Auditoría" en la pantalla de resultados
    document.getElementById('btnVolverAuditoria').addEventListener('click', function () {
        document.getElementById('resultsContent').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Botón descargar
    document.getElementById('btnDownload').addEventListener('click', downloadResults);

    updateNavButtons();
}

function updateNavButtons() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');

    if (currentSectionIndex > 0) {
        btnAnterior.style.display = 'inline-flex';
    } else {
        btnAnterior.style.display = 'none';
    }

    if (currentSectionIndex >= evaluacionData.sections.length - 1) {
        btnSiguiente.textContent = 'Finalizar';
    } else {
        btnSiguiente.textContent = 'Siguiente';
    }
}

async function finalizarAuditoria() {
    const allIds = evaluacionData.sections.flatMap(s => s.questions.map(q => q.id));
    const unanswered = allIds.filter(id => answers[id] === null).length;
    
    if (unanswered > 0) {
        showNotification('Faltan ' + unanswered + ' preguntas por responder', 'warning');
        return;
    }

    try {
        // Calcular cumplimiento en el servidor
        const response = await fetch(`${API_URL}/auditorias/${auditoriaId}/calcular-cumplimiento`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Error al calcular el cumplimiento');
        }
        
        const resultado = await response.json();
        
        // Actualizar estado de la auditoría a "Completado"
        await fetch(`${API_URL}/auditorias/${auditoriaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                estado: 'Completado'
            })
        });
        
        // Mostrar resultados
        await showResults();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al finalizar la auditoría', 'error');
    }
}

// =============================================
// RESUMEN DE RESULTADOS
// =============================================
async function calculateResults() {
    try {
        // Obtener resumen desde la API
        const response = await fetch(`${API_URL}/auditorias/${auditoriaId}/resumen`);
        if (!response.ok) {
            throw new Error('Error al obtener el resumen');
        }
        
        const data = await response.json();
        
        // Transformar datos al formato esperado
        const results = [];
        let totalObtenido = 0;
        let totalMaximo = 0;
        
        data.forEach(item => {
            const obtenido = item.respuestas_si * 5; // Cada "Sí" vale 5 puntos
            const maximo = item.total_preguntas * 5;
            
            results.push({
                title: item.categoria,
                obtenido: obtenido,
                maximo: maximo,
                porcentaje: item.porcentaje_cumplimiento || 0
            });
            
            totalObtenido += obtenido;
            totalMaximo += maximo;
        });
        
        const totalPct = totalMaximo > 0 ? (totalObtenido / totalMaximo * 100) : 0;
        
        return { sections: results, totalObtenido, totalMaximo, totalPct };
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al calcular resultados', 'error');
        return { sections: [], totalObtenido: 0, totalMaximo: 0, totalPct: 0 };
    }
}

function getPctClass(pct) {
    if (pct >= 80) return 'pct-green';
    if (pct >= 70) return 'pct-yellow';
    return 'pct-red';
}

async function showResults() {
    const data = await calculateResults();

    // Llenar tabla
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';

    data.sections.forEach(s => {
        const pctClass = getPctClass(s.porcentaje);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-section">${s.title}</td>
            <td>${s.obtenido}</td>
            <td>${s.maximo}</td>
            <td><span class="pct-badge ${pctClass}">${s.porcentaje.toFixed(2)}%</span></td>
        `;
        tbody.appendChild(row);
    });

    // Total
    const totalDiv = document.getElementById('resultsTotal');
    const totalPctClass = getPctClass(data.totalPct);
    totalDiv.innerHTML = `
        <span class="results-total-label">%Cumplimiento Total</span>
        <span class="results-total-value pct-badge ${totalPctClass}">${data.totalPct.toFixed(2)}%</span>
    `;

    // Mostrar pantalla de resultados, ocultar auditoría
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('resultsContent').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showNotification('Auditoría finalizada exitosamente', 'success');
}

// =============================================
// DESCARGA DE RESULTADOS
// =============================================
async function downloadResults() {
    const data = await calculateResults();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    // Generar CSV con resultados completos
    let csv = '\uFEFF'; // BOM for Excel UTF-8
    csv += 'RESUMEN DE RESULTADOS DE AUDITORÍA\n';
    csv += 'Auditoría ID: ' + auditoriaId + '\n';
    csv += 'Fecha: ' + dateStr + ' ' + timeStr + '\n\n';

    // Tabla resumen
    csv += 'Sección,Obtenido,Máximo,%\n';
    data.sections.forEach(s => {
        csv += `${s.title},${s.obtenido},${s.maximo},${s.porcentaje.toFixed(2)}%\n`;
    });
    csv += `\n%Cumplimiento Total,,,${data.totalPct.toFixed(2)}%\n\n`;

    // Detalle por pregunta
    csv += 'DETALLE POR PREGUNTA\n';
    csv += 'Sección,Pregunta,Respuesta,Cómo Validó,Comentario,Plan de Acción\n';

    evaluacionData.sections.forEach(section => {
        section.questions.forEach(q => {
            const resp = answers[q.id] === 'si' ? 'Sí' : answers[q.id] === 'no' ? 'No' : 'Sin responder';
            const qd = questionData[q.id];
            const comoValido = (qd.comoValido || '').replace(/"/g, '""');
            const comentario = (qd.comentario || '').replace(/"/g, '""');
            let plan = '';
            if (qd.planAccion && qd.planAccion.descripcion) {
                plan = `Acción: ${qd.planAccion.descripcion || ''} | Responsable: ${qd.planAccion.responsable || ''} | Fecha: ${qd.planAccion.fecha || ''}`;
                plan = plan.replace(/"/g, '""');
            }
            csv += `"${section.title}","${q.text}","${resp}","${comoValido}","${comentario}","${plan}"\n`;
        });
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
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
function openModal(id) { 
    document.getElementById(id).classList.add('show'); 
    document.body.style.overflow = 'hidden'; 
}

function closeModal(id) { 
    document.getElementById(id).classList.remove('show'); 
    document.body.style.overflow = 'auto'; 
}

function openComoValido(qId) {
    currentModalQuestionId = qId;
    document.getElementById('comoValidoText').value = questionData[qId].comoValido || '';
    openModal('comoValidoModal');
}

function openComentario(qId) {
    currentModalQuestionId = qId;
    document.getElementById('comentarioText').value = questionData[qId].comentario || '';
    openModal('comentarioModal');
}

function openEvidencia(qId) {
    currentModalQuestionId = qId;
    renderUploadedFiles();
    openModal('evidenciaModal');
}

function openPlanAccion(qId) {
    currentModalQuestionId = qId;
    const plan = questionData[qId].planAccion || {};
    document.getElementById('planDescripcion').value = plan.descripcion || '';
    document.getElementById('planResponsable').value = plan.responsable || '';
    document.getElementById('planFecha').value = plan.fecha || '';
    openModal('planAccionModal');
}

function renderUploadedFiles() {
    const container = document.getElementById('uploadedFiles');
    container.innerHTML = '';
    (questionData[currentModalQuestionId].evidencias || []).forEach((f, i) => {
        container.innerHTML += `<div class="uploaded-file-item"><span>${f.name}</span><button class="remove-file" onclick="removeEvidencia(${i})">×</button></div>`;
    });
}

function removeEvidencia(idx) {
    questionData[currentModalQuestionId].evidencias.splice(idx, 1);
    renderUploadedFiles();
}

function initModals() {
    document.getElementById('closeComoValido').onclick = () => closeModal('comoValidoModal');
    document.getElementById('cancelComoValido').onclick = () => closeModal('comoValidoModal');
    document.getElementById('saveComoValido').onclick = async () => {
        questionData[currentModalQuestionId].comoValido = document.getElementById('comoValidoText').value;
        
        // Guardar en la API si la pregunta tiene respuesta
        if (answers[currentModalQuestionId] !== null) {
            await guardarRespuesta(currentModalQuestionId);
        }
        
        closeModal('comoValidoModal'); 
        renderSection(); 
        showNotification('Guardado', 'success');
    };

    document.getElementById('closeComentario').onclick = () => closeModal('comentarioModal');
    document.getElementById('cancelComentario').onclick = () => closeModal('comentarioModal');
    document.getElementById('saveComentario').onclick = async () => {
        questionData[currentModalQuestionId].comentario = document.getElementById('comentarioText').value;
        
        // Guardar en la API si la pregunta tiene respuesta
        if (answers[currentModalQuestionId] !== null) {
            await guardarRespuesta(currentModalQuestionId);
        }
        
        closeModal('comentarioModal'); 
        renderSection(); 
        showNotification('Comentario guardado', 'success');
    };

    document.getElementById('closeEvidencia').onclick = () => closeModal('evidenciaModal');
    document.getElementById('cancelEvidencia').onclick = () => closeModal('evidenciaModal');
    document.getElementById('saveEvidencia').onclick = () => { 
        closeModal('evidenciaModal'); 
        renderSection(); 
        showNotification('Evidencia guardada', 'success'); 
    };
    
    document.getElementById('uploadArea').onclick = () => document.getElementById('evidenciaFile').click();
    document.getElementById('evidenciaFile').onchange = (e) => {
        Array.from(e.target.files).forEach(f => { 
            questionData[currentModalQuestionId].evidencias.push({ name: f.name, file: f }); 
        });
        renderUploadedFiles(); 
        e.target.value = '';
    };

    document.getElementById('closePlanAccion').onclick = () => closeModal('planAccionModal');
    document.getElementById('cancelPlanAccion').onclick = () => closeModal('planAccionModal');
    document.getElementById('savePlanAccion').onclick = () => {
        questionData[currentModalQuestionId].planAccion = {
            descripcion: document.getElementById('planDescripcion').value,
            responsable: document.getElementById('planResponsable').value,
            fecha: document.getElementById('planFecha').value
        };
        closeModal('planAccionModal'); 
        showNotification('Plan de acción guardado', 'success');
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') ['comoValidoModal', 'comentarioModal', 'evidenciaModal', 'planAccionModal'].forEach(closeModal);
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
        case 'error': bg = 'linear-gradient(135deg,#DC2626,#B91C1C)'; break;
        case 'warning': bg = 'linear-gradient(135deg,#F59E0B,#D97706)'; break;
        default: bg = 'linear-gradient(135deg,#1D3579,#48BED7)';
    }
    el.style.cssText = `position:fixed;top:20px;right:20px;background:${bg};color:#fff;padding:14px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:10000;font-weight:600;font-family:'Inter',sans-serif;font-size:14px;animation:slideIn .3s ease`;
    document.body.appendChild(el);
    setTimeout(() => { 
        el.style.animation = 'slideOut .3s ease'; 
        setTimeout(() => { 
            if (document.body.contains(el)) document.body.removeChild(el); 
        }, 300); 
    }, 2500);
}

const st = document.createElement('style');
st.textContent = `@keyframes slideIn{from{transform:translateX(300px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(300px);opacity:0}}`;
document.head.appendChild(st);

console.log('Sistema de auditorías con FastAPI - Detalle inicializado correctamente');