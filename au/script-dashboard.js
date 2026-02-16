// =============================================
// DATOS DE EJEMPLO (en producción vendrían del backend)
// =============================================
const dashboardData = {
    auditInfo: {
        concesionario: 'Mitsui',
        local: 'La molina',
        auditor: 'Juan Rivas',
        fecha: '30/01/2026'
    },
    sections: [
        {
            title: 'Herramientas',
            preguntadoA: 'Responsable de almacén',
            lugarValidacion: 'Almacén',
            percentage: 90.00,
            questions: [
                {
                    id: 1,
                    text: 'Horario de recepción',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'El horario de recepción cumple con lo establecido',
                    comentario: '',
                    evidencias: ['evidencia1.jpg'],
                    planAccion: null
                },
                {
                    id: 2,
                    text: 'Servicio de mantenimiento periódico',
                    respuesta: 'no',
                    puntaje: 0,
                    comoValido: '',
                    comentario: 'No tiene evidencias',
                    evidencias: [],
                    planAccion: {
                        descripcion: 'Implementar un plan de servicio de mantenimiento periódico',
                        responsable: 'Jefe de Mantenimiento',
                        fecha: '15/02/2026',
                        prioridad: 'alta'
                    }
                }
            ]
        },
        {
            title: 'Proceso',
            preguntadoA: 'Jefe de Operaciones',
            lugarValidacion: 'Planta',
            percentage: 95.00,
            questions: [
                {
                    id: 3,
                    text: 'Documentación de procesos',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Toda la documentación está actualizada',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                },
                {
                    id: 4,
                    text: 'Cumplimiento de tiempos',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Los tiempos se cumplen según estándar',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                }
            ]
        },
        {
            title: 'SOMMA',
            preguntadoA: 'Gerente de Calidad',
            lugarValidacion: 'Oficina Principal',
            percentage: 93.00,
            questions: [
                {
                    id: 5,
                    text: 'Sistema de gestión implementado',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Sistema SOMMA operativo',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                },
                {
                    id: 6,
                    text: 'Auditorías internas',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Se realizan auditorías trimestrales',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                }
            ]
        },
        {
            title: 'Tecnología',
            preguntadoA: 'Jefe de TI',
            lugarValidacion: 'Centro de Cómputo',
            percentage: 87.00,
            questions: [
                {
                    id: 7,
                    text: 'Equipos actualizados',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Todos los equipos tienen última versión',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                },
                {
                    id: 8,
                    text: 'Sistemas de respaldo',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Backup diario automatizado',
                    comentario: '',
                    evidencias: [],
                    planAccion: null
                }
            ]
        },
        {
            title: 'Mejora Continua',
            preguntadoA: 'Encargado del Área de Mejora',
            lugarValidacion: 'Oficina Principal',
            percentage: 70.00,
            questions: [
                {
                    id: 9,
                    text: 'Plan de mejora',
                    respuesta: 'si',
                    puntaje: 5,
                    comoValido: 'Plan de mejora anual establecido',
                    comentario: '',
                    evidencias: ['evidencia2.jpg'],
                    planAccion: null
                },
                {
                    id: 10,
                    text: 'Incentivos para mejora de rendimiento',
                    respuesta: 'no',
                    puntaje: 0,
                    comoValido: '',
                    comentario: 'No tiene incentivos',
                    evidencias: [],
                    planAccion: {
                        descripcion: 'Implementar incentivos para la mejora de rendimiento',
                        responsable: 'Gerente de RRHH',
                        fecha: '28/02/2026',
                        prioridad: 'media'
                    }
                }
            ]
        }
    ]
};

// =============================================
// CALCULAR TOTALES
// =============================================
function calcularTotales() {
    let totalAprobadas = 0;
    let totalDesaprobadas = 0;
    let totalPuntaje = 0;
    let maxPuntaje = 0;

    dashboardData.sections.forEach(section => {
        section.questions.forEach(q => {
            if (q.respuesta === 'si') {
                totalAprobadas++;
                totalPuntaje += q.puntaje;
            } else {
                totalDesaprobadas++;
            }
            maxPuntaje += 5; // Cada pregunta vale 5 puntos máximo
        });
    });

    const porcentajeTotal = (totalPuntaje / maxPuntaje * 100).toFixed(1);

    return {
        aprobadas: totalAprobadas,
        desaprobadas: totalDesaprobadas,
        porcentaje: porcentajeTotal
    };
}

// =============================================
// RENDERIZAR GRÁFICO DE CUMPLIMIENTO
// =============================================
function renderCumplimientoChart() {
    const totales = calcularTotales();
    const canvas = document.getElementById('chartCumplimiento');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90;
    const lineWidth = 30;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular ángulos
    const totalPreguntas = totales.aprobadas + totales.desaprobadas;
    const aprobadasAngle = (totales.aprobadas / totalPreguntas) * 2 * Math.PI;
    const desaprobadasAngle = (totales.desaprobadas / totalPreguntas) * 2 * Math.PI;

    // Dibujar arco de aprobadas (verde)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + aprobadasAngle);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#10B981';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dibujar arco de desaprobadas (rojo)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + aprobadasAngle, -Math.PI / 2 + aprobadasAngle + desaprobadasAngle);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#DC2626';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Actualizar textos
    document.getElementById('totalPercentage').textContent = totales.porcentaje + '%';
    document.getElementById('legendAprobadas').textContent = `${totales.aprobadas} respuestas aprobadas`;
    document.getElementById('legendDesaprobadas').textContent = `${totales.desaprobadas} respuestas desaprobadas`;
}

// =============================================
// RENDERIZAR CRITERIOS
// =============================================
function renderCriterios() {
    const container = document.getElementById('criteriosList');
    container.innerHTML = '';

    dashboardData.sections.forEach(section => {
        const colorClass = section.percentage >= 90 ? 'green' : 
                          section.percentage >= 80 ? 'orange' : 'red';

        const html = `
            <div class="criterio-item">
                <div class="criterio-name">${section.title}</div>
                <div class="criterio-bar-container">
                    <div class="criterio-bar ${colorClass}" style="width: ${section.percentage}%"></div>
                </div>
                <div class="criterio-percentage">${section.percentage.toFixed(2)}%</div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// =============================================
// RENDERIZAR HISTORIAL
// =============================================
function renderHistorial() {
    const container = document.getElementById('historialSections');
    container.innerHTML = '';

    dashboardData.sections.forEach((section, sectionIndex) => {
        const html = `
            <div class="historial-section">
                <div class="section-header" onclick="toggleSection(${sectionIndex})">
                    <div class="section-header-left">
                        <div class="section-title">${section.title}</div>
                        <div class="section-meta">
                            <span>¿A quién se le preguntó? <strong>${section.preguntadoA}</strong></span>
                            <span>Lugar de validación: <strong>${section.lugarValidacion}</strong></span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div class="section-percentage">${section.percentage.toFixed(2)}%</div>
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="section-questions" id="section-${sectionIndex}">
                    ${section.questions.map((q, qIndex) => `
                        <div class="question-row ${q.respuesta === 'si' ? 'aprobada' : 'desaprobada'}">
                            <div class="question-header">
                                <span class="question-number">${qIndex + 1}.</span>
                                <span class="question-text">${q.text}</span>
                                <div class="question-response">
                                    <span class="response-badge ${q.respuesta}">${q.respuesta === 'si' ? 'Sí' : 'No'}</span>
                                    <span class="question-points">Puntaje: ${q.puntaje}/5</span>
                                </div>
                            </div>
                            ${q.comoValido ? `
                                <div class="question-details">
                                    <div class="detail-item">
                                        <span class="detail-label">¿Cómo validó?</span>
                                        <span class="detail-value">${q.comoValido}</span>
                                    </div>
                                    ${q.comentario ? `
                                        <div class="detail-item">
                                            <span class="detail-label">Comentario</span>
                                            <span class="detail-value">${q.comentario}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                            ${q.evidencias.length > 0 ? `
                                <div class="question-evidence">
                                    <span class="evidence-label">Evidencia:</span>
                                    ${q.evidencias.map(ev => `
                                        <div class="evidence-thumbnail">
                                            <img src="https://via.placeholder.com/80x60/48BED7/FFFFFF?text=IMG" alt="Evidencia">
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${q.planAccion ? `
                                <div class="detail-item" style="margin-top: 12px;">
                                    <span class="detail-label">Plan de Acción</span>
                                    <span class="detail-value">${q.planAccion.descripcion}</span>
                                </div>
                            ` : ''}
                            <button class="btn-ver-detalle" onclick="verDetallePregunta(${sectionIndex}, ${qIndex})">
                                Ver detalle completo
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// =============================================
// RENDERIZAR PLANES DE ACCIÓN
// =============================================
function renderPlanes() {
    const container = document.getElementById('planesList');
    container.innerHTML = '';

    let planNumber = 1;

    dashboardData.sections.forEach(section => {
        section.questions.forEach(q => {
            if (q.planAccion) {
                const plan = q.planAccion;
                const html = `
                    <div class="plan-item">
                        <div class="plan-header">
                            <div class="plan-number">
                                <div class="plan-badge">${planNumber}</div>
                                <div>
                                    <div class="plan-criterio">${section.title}</div>
                                    <div style="font-size: 13px; color: var(--text-gray); margin-top: 4px;">${q.text}</div>
                                </div>
                            </div>
                            <div class="plan-fecha">
                                <span class="fecha-label">Fecha de vencimiento</span>
                                <span class="fecha-value">${plan.fecha}</span>
                            </div>
                        </div>
                        <div class="plan-body">
                            <div class="plan-field">
                                <span class="plan-field-label">Pregunta</span>
                                <span class="plan-field-value">${q.text}</span>
                            </div>
                            <div class="plan-field">
                                <span class="plan-field-label">Comentario</span>
                                <span class="plan-field-value">${q.comentario || 'Sin comentario'}</span>
                            </div>
                        </div>
                        <div class="plan-footer">
                            <div class="plan-accion">
                                <strong>Plan de Acción:</strong> ${plan.descripcion}
                            </div>
                            <span class="prioridad-badge ${plan.prioridad}">
                                ${plan.prioridad.charAt(0).toUpperCase() + plan.prioridad.slice(1)}
                            </span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
                planNumber++;
            }
        });
    });

    if (planNumber === 1) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">No hay planes de acción registrados</p>';
    }
}

// =============================================
// TOGGLE SECTION
// =============================================
function toggleSection(index) {
    const header = document.querySelectorAll('.section-header')[index];
    const content = document.getElementById('section-' + index);
    
    header.classList.toggle('expanded');
    content.classList.toggle('expanded');
}

// =============================================
// VER DETALLE DE PREGUNTA
// =============================================
function verDetallePregunta(sectionIndex, questionIndex) {
    const section = dashboardData.sections[sectionIndex];
    const question = section.questions[questionIndex];
    
    const modal = document.getElementById('modalDetalle');
    const modalBody = document.getElementById('modalBody');
    
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Sección</div>
            <div style="font-size: 16px; color: var(--primary-blue); font-weight: 700;">${section.title}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Pregunta</div>
            <div style="font-size: 16px; color: var(--text-dark); font-weight: 600;">${question.text}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Respuesta</div>
                <span class="response-badge ${question.respuesta}">${question.respuesta === 'si' ? 'Sí' : 'No'}</span>
            </div>
            <div>
                <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Puntaje</div>
                <div style="font-size: 16px; color: var(--text-dark); font-weight: 600;">${question.puntaje}/5</div>
            </div>
        </div>
    `;
    
    if (question.comoValido) {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">¿Cómo validó?</div>
                <div style="font-size: 15px; color: var(--text-dark);">${question.comoValido}</div>
            </div>
        `;
    }
    
    if (question.comentario) {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Comentario</div>
                <div style="font-size: 15px; color: var(--text-dark);">${question.comentario}</div>
            </div>
        `;
    }
    
    if (question.evidencias.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--text-gray); font-weight: 600; margin-bottom: 8px;">Evidencias</div>
                <div style="display: flex; gap: 12px;">
                    ${question.evidencias.map(ev => `
                        <div class="evidence-thumbnail" style="width: 100px; height: 75px;">
                            <img src="https://via.placeholder.com/100x75/48BED7/FFFFFF?text=IMG" alt="Evidencia">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    if (question.planAccion) {
        html += `
            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-top: 20px;">
                <div style="font-size: 16px; color: var(--primary-blue); font-weight: 700; margin-bottom: 12px;">Plan de Acción</div>
                <div style="display: grid; gap: 12px;">
                    <div>
                        <div style="font-size: 13px; color: var(--text-gray); font-weight: 600;">Descripción</div>
                        <div style="font-size: 14px; color: var(--text-dark);">${question.planAccion.descripcion}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <div style="font-size: 13px; color: var(--text-gray); font-weight: 600;">Responsable</div>
                            <div style="font-size: 14px; color: var(--text-dark);">${question.planAccion.responsable}</div>
                        </div>
                        <div>
                            <div style="font-size: 13px; color: var(--text-gray); font-weight: 600;">Fecha límite</div>
                            <div style="font-size: 14px; color: var(--text-dark);">${question.planAccion.fecha}</div>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: var(--text-gray); font-weight: 600;">Prioridad</div>
                        <span class="prioridad-badge ${question.planAccion.prioridad}">
                            ${question.planAccion.prioridad.charAt(0).toUpperCase() + question.planAccion.prioridad.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = html;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModalDetalle() {
    const modal = document.getElementById('modalDetalle');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// =============================================
// EXPORTAR DASHBOARD
// =============================================
function exportarDashboard() {
    showNotification('Generando PDF...', 'info');
    
    // Aquí se implementaría la exportación a PDF
    // Por ahora solo mostramos una notificación
    setTimeout(() => {
        showNotification('Dashboard exportado exitosamente', 'success');
    }, 1500);
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

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    renderCumplimientoChart();
    renderCriterios();
    renderHistorial();
    renderPlanes();
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModalDetalle();
        }
    });
    
    // Cerrar modal al hacer click fuera
    document.getElementById('modalDetalle').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModalDetalle();
        }
    });
    
    console.log('Dashboard cargado exitosamente');
});