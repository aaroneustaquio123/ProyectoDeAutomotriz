// =============================================
// Dashauditorias.js — Summas
// =============================================

const API_URL = 'http://127.0.0.1:8000';

// ── Datos demo ──
const DEMO = {
    auditoria: {
        id: 1,
        marca: 'Toyota: Mitsui - La Molina',
        auditor: 'Juan Rivas',
        fecha_programada: '2026-01-30',
        capitulo: 'Procesos (Ventas): Mystery Shooper',
        porcentaje_cumplimiento: 95.40
    },
    incumplimientos: [
        {
            id: 1,
            criterio: 'Herramientas',
            pregunta: 'Servicio de mantenimiento periódico',
            comentario: 'El horario de recepción cumple con lo establecido',
            plan_accion: 'Implementar un plan de servicio de mantenimiento periódico',
            fecha_vencimiento: '2026-02-04',
            prioridad: 'Alta',
            estado: 'Falta Subsanar'
        },
        {
            id: 2,
            criterio: 'Mejora Continua',
            pregunta: 'Incentivos para mejora de rendimiento',
            comentario: 'No tiene incentivos',
            plan_accion: 'Implementar incentivos para la mejora de rendimiento',
            fecha_vencimiento: '2026-02-02',
            prioridad: 'Media',
            estado: 'En espera de validación'
        },
        {
            id: 3,
            criterio: 'Mejora Continua',
            pregunta: 'Incentivos para mejora de rendimiento',
            comentario: 'No tiene incentivos',
            plan_accion: 'Implementar incentivos para la mejora de rendimiento',
            fecha_vencimiento: '2026-02-02',
            prioridad: 'Baja',
            estado: 'En espera de validación'
        },
        {
            id: 4,
            criterio: 'Mejora Continua',
            pregunta: 'Incentivos para mejora de rendimiento',
            comentario: 'No tiene incentivos',
            plan_accion: 'Implementar incentivos para la mejora de rendimiento',
            fecha_vencimiento: '2026-02-02',
            prioridad: 'Media',
            estado: 'Falta Subsanar'
        },
        {
            id: 5,
            criterio: 'Mejora Continua',
            pregunta: 'Incentivos para mejora de rendimiento',
            comentario: 'No tiene incentivos',
            plan_accion: 'Implementar incentivos para la mejora de rendimiento',
            fecha_vencimiento: '2026-02-02',
            prioridad: 'Baja',
            estado: 'Falta Subsanar'
        }
    ]
};

// ── Variables del carrusel / modal ──
let imagenesEvidencia = [];
let imagenActual      = 0;
let itemValidandoId   = null;

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const audId  = params.get('id');
    let data     = DEMO;

    if (audId) {
        try {
            const res = await fetch(`${API_URL}/auditorias/${audId}/resultados`);
            if (res.ok) data = await res.json();
        } catch { /* usa demo */ }
    }

    renderHeader(data.auditoria);
    renderIncumplimientos(data.incumplimientos);

    // Cerrar modal al hacer click fuera
    const overlay = document.getElementById('modalValidar');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) cerrarModalValidar();
        });
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarModalValidar();
    });
});

// =============================================
// HEADER
// =============================================
function renderHeader(a) {
    const grid = document.getElementById('auditoriaHeaderGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="header-item">
            <span class="header-label">Marca</span>
            <span class="header-value">${a.marca || '-'}</span>
        </div>
        <div class="header-item">
            <span class="header-label">Auditor</span>
            <span class="header-value">${a.auditor || '-'}</span>
        </div>
        <div class="header-item">
            <span class="header-label">Fecha Programada</span>
            <span class="header-value">${formatDate(a.fecha_programada)}</span>
        </div>
        <div class="header-item">
            <span class="header-label">Capítulo</span>
            <span class="header-value">${a.capitulo || '-'}</span>
        </div>
        <div class="header-item">
            <span class="header-label">Porcentaje de cumplimiento</span>
            <span class="header-value">${
                a.porcentaje_cumplimiento !== null && a.porcentaje_cumplimiento !== undefined
                ? a.porcentaje_cumplimiento.toFixed(2) + '%'
                : 'Sin calificar'
            }</span>
        </div>
        <div class="header-item">
    <button class="btn-descargar" onclick="descargarResultados()">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none"
             stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
             stroke-linejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <polyline points="8 12 12 16 16 12"/>
        </svg>
        Descargar Resultados Completos
    </button>
</div>
    `;
}

// =============================================
// INCUMPLIMIENTOS
// =============================================
function renderIncumplimientos(lista) {
    const container = document.getElementById('incumplimientosList');
    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>¡Sin incumplimientos!</p>
                <p>Esta auditoría no registra ítems pendientes de subsanar.</p>
            </div>`;
        return;
    }

    container.innerHTML = lista.map((item, i) => buildCard(item, i + 1)).join('');
}

function buildCard(item, num) {
    const estadoCls  = getEstadoClass(item.estado);
    const estadoIcon = getEstadoIcon(item.estado);
    const delay      = `animation-delay: ${(num - 1) * 0.07}s`;

    const botonValidar = (item.estado === 'En espera de validación')
        ? `<button class="btn-validar" onclick="validarItem(${item.id})">Validar</button>`
        : '';

    return `
    <div class="incumplimiento-card ${estadoCls}" style="${delay}">
        <div class="card-number">${num}.</div>
        <div class="card-body">
            <div class="card-grid">
                <div class="card-field">
                    <span class="card-field-label">Criterio</span>
                    <span class="card-field-value">${item.criterio}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Pregunta</span>
                    <span class="card-field-value">${item.pregunta}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Fecha de vencimiento</span>
                    <span class="card-field-value">${formatDate(item.fecha_vencimiento)}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Comentario</span>
                    <span class="card-field-value">${item.comentario || '-'}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Plan de Acción</span>
                    <span class="card-field-value">${item.plan_accion || '-'}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Prioridad</span>
                    <span class="card-field-value">
                        <span class="badge-prioridad ${item.prioridad}">${item.prioridad}</span>
                    </span>
                </div>
            </div>
            <div class="card-estado">
                <span class="estado-text ${estadoCls}">
                    ${estadoIcon}
                    ${item.estado}
                </span>
                ${botonValidar}
            </div>
        </div>
    </div>`;
}

function getEstadoClass(estado) {
    if (estado === 'Falta Subsanar')          return 'falta-subsanar';
    if (estado === 'En espera de validación') return 'en-validacion';
    if (estado === 'Subsanado')               return 'subsanado';
    return 'falta-subsanar';
}

function getEstadoIcon(estado) {
    if (estado === 'Falta Subsanar') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>`;
    }
    if (estado === 'En espera de validación') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
            </svg>`;
}

// =============================================
// MODAL VALIDAR
// =============================================
function validarItem(id) {
    itemValidandoId   = id;
    imagenesEvidencia = [];
    imagenActual      = 0;

    const textarea = document.getElementById('validarComentario');
    const input    = document.getElementById('inputImagen');
    if (textarea) textarea.value = '';
    if (input)    input.value    = '';

    actualizarCarrusel();

    const modal = document.getElementById('modalValidar');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalValidar() {
    const modal = document.getElementById('modalValidar');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ── Cargar imágenes — máximo 3 ──
function cargarImagenes(event) {
    const files             = Array.from(event.target.files);
    const espacioDisponible = 3 - imagenesEvidencia.length;

    if (espacioDisponible <= 0) {
        showToast('Máximo 3 imágenes permitidas', 'error');
        event.target.value = '';
        return;
    }

    const archivosACargar = files.slice(0, espacioDisponible);

    if (files.length > espacioDisponible) {
        showToast(`Solo se cargaron ${espacioDisponible} imagen(es). Máximo 3 permitidas`, 'error');
    }

    archivosACargar.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            imagenesEvidencia.push(e.target.result);
            imagenActual = imagenesEvidencia.length - 1;
            actualizarCarrusel();
        };
        reader.readAsDataURL(file);
    });

    event.target.value = '';
}

// ── Actualizar carrusel completo ──
function actualizarCarrusel() {
    const img     = document.getElementById('carouselImg');
    const empty   = document.getElementById('carouselEmpty');
    const counter = document.getElementById('carouselCounter');
    const btnAdd  = document.querySelector('.btn-add-img');
    const flechaL = document.querySelector('.carousel-arrow.left');
    const flechaR = document.querySelector('.carousel-arrow.right');
    const wrapper = document.querySelector('.carousel-img-wrapper');

    if (!img || !empty) return;

    if (imagenesEvidencia.length === 0) {
        // Sin imágenes
        img.classList.remove('visible');
        empty.style.display  = 'block';
        if (counter) counter.textContent = '';

        // Ocultar flechas
        if (flechaL) flechaL.style.visibility = 'hidden';
        if (flechaR) flechaR.style.visibility = 'hidden';

        // Área gris clickeable para subir imagen
        if (wrapper) {
            wrapper.style.cursor = 'pointer';
            wrapper.onclick = () => document.getElementById('inputImagen').click();
        }

    } else {
        // Con imágenes
        img.src = imagenesEvidencia[imagenActual];
        img.classList.add('visible');
        empty.style.display = 'none';
        if (counter) counter.textContent = `${imagenActual + 1} / ${imagenesEvidencia.length}`;

        // Mostrar flechas solo si hay más de 1 imagen
        const mostrarFlechas = imagenesEvidencia.length > 1 ? 'visible' : 'hidden';
        if (flechaL) flechaL.style.visibility = mostrarFlechas;
        if (flechaR) flechaR.style.visibility = mostrarFlechas;

        // Quitar click del wrapper
        if (wrapper) {
            wrapper.style.cursor = 'default';
            wrapper.onclick = null;
        }
    }

    // Ocultar botón agregar si ya hay 3
    if (btnAdd) {
        btnAdd.style.display = imagenesEvidencia.length >= 3 ? 'none' : 'block';
    }
}

// ── Flecha izquierda ──
function prevImagen() {
    if (imagenesEvidencia.length === 0) return;
    imagenActual = (imagenActual - 1 + imagenesEvidencia.length) % imagenesEvidencia.length;
    actualizarCarrusel();
}

// ── Flecha derecha — abre explorador si no hay imágenes ──
function nextImagen() {
    if (imagenesEvidencia.length === 0) {
        document.getElementById('inputImagen').click();
        return;
    }
    imagenActual = (imagenActual + 1) % imagenesEvidencia.length;
    actualizarCarrusel();
}

// ── Confirmar validación ──
function confirmarValidacion() {
    const comentario = document.getElementById('validarComentario').value.trim();

    if (!comentario) {
        showToast('Escribe un comentario antes de validar', 'error');
        return;
    }

    // Cuando tengas la API conectada, descomenta esto:
    // fetch(`${API_URL}/incumplimientos/${itemValidandoId}/validar`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ comentario, imagenes: imagenesEvidencia })
    // });

    cerrarModalValidar();
    showToast('Ítem validado correctamente', 'success');
}

// =============================================
// DESCARGA
// =============================================
function descargarResultados() {
    showToast('Descarga iniciada...', 'info');
    // Conectar con tu endpoint cuando tengas la API
}

// =============================================
// UTILS
// =============================================
function formatDate(str) {
    if (!str) return '-';
    const parts = str.split('-');
    if (parts.length !== 3) return str;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
function descargarResultados() {
    // Esta línea realiza la redirección al archivo que mencionaste
    window.location.href = 'Dashboardresultados.html';
}

function showToast(msg, type = 'info') {
    // Eliminar toasts duplicados
    document.querySelectorAll('.summas-toast').forEach(t => t.remove());

    const colors = {
        success: 'linear-gradient(135deg,#10B981,#059669)',
        error:   'linear-gradient(135deg,#DC2626,#B91C1C)',
        info:    'linear-gradient(135deg,#1D3579,#48BED7)'
    };

    const t = document.createElement('div');
    t.className   = 'summas-toast';
    t.textContent = msg;
    t.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 13px 22px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,.2);
        z-index: 9999;
        animation: toastIn .3s ease;
    `;

    if (!document.getElementById('toastStyle')) {
        const s = document.createElement('style');
        s.id = 'toastStyle';
        s.textContent = `
            @keyframes toastIn {
                from { transform: translateX(300px); opacity: 0; }
                to   { transform: translateX(0);     opacity: 1; }
            }`;
        document.head.appendChild(s);
    }

    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}