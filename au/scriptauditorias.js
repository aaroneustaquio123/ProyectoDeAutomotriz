// =============================================
// Variables globales
// =============================================
let currentPage = 1;
const itemsPerPage = 10;
let auditoriasData = [];
let filteredAuditorias = [];

// =============================================
// PERSISTENCIA EN localStorage
// =============================================
function saveAuditoriasToStorage() {
    try {
        localStorage.setItem('auditorias_data', JSON.stringify(auditoriasData));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

function loadAuditoriasFromStorage() {
    try {
        const stored = localStorage.getItem('auditorias_data');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.warn('No se pudo leer localStorage:', e);
        return [];
    }
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
    initializeProfileModal();
    initializeNuevaAuditoriaModal();
    initializeDetalleAuditoriaModal();
});

// =============================================
// CARGAR DATOS INICIALES
// =============================================
function loadInitialData() {
    // Cargar desde localStorage (sin API)
    auditoriasData = loadAuditoriasFromStorage();

    filteredAuditorias = [...auditoriasData];
    initializeFilters();
    renderAuditorias();
}

// =============================================
// FILTROS
// =============================================
function initializeFilters() {
    const empresaSelect = document.getElementById('empresa');
    const estadoSelect  = document.getElementById('estado');

    if (empresaSelect) {
        empresaSelect.innerHTML = '<option value="">Selecciona la empresa</option>';
        const empresasUnicas = [...new Set(auditoriasData.map(a => a.empresa))];
        empresasUnicas.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa;
            option.textContent = empresa;
            empresaSelect.appendChild(option);
        });
    }

    if (estadoSelect) {
        estadoSelect.innerHTML = '<option value="">Selecciona el estado</option>';
        const estados = ['Pendiente', 'En Proceso', 'Completado'];
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            estadoSelect.appendChild(option);
        });
    }
}

function applyFilters() {
    const empresa = document.getElementById('empresa').value;
    const estado  = document.getElementById('estado').value;

    filteredAuditorias = auditoriasData.filter(auditoria => {
        const empresaMatch = !empresa || auditoria.empresa === empresa;
        const estadoMatch  = !estado  || auditoria.estado  === estado;
        return empresaMatch && estadoMatch;
    });

    currentPage = 1;
    renderAuditorias();
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
                refreshData();
            }, 300);
        });
    }

    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderAuditorias();
                updatePaginationButtons();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredAuditorias.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderAuditorias();
                updatePaginationButtons();
            }
        });
    }
}

// =============================================
// MODAL NUEVA AUDITORÍA
// =============================================
function initializeNuevaAuditoriaModal() {
    const btnNuevaAuditoria   = document.getElementById('btnNuevaAuditoria');
    const nuevaAuditoriaModal = document.getElementById('nuevaAuditoriaModal');
    const closeNuevaAuditoria = document.getElementById('closeNuevaAuditoria');
    const btnCancelar         = document.getElementById('btnCancelarAuditoria');
    const formNuevaAuditoria  = document.getElementById('formNuevaAuditoria');

    if (btnNuevaAuditoria) {
        btnNuevaAuditoria.addEventListener('click', function() {
            nuevaAuditoriaModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeNuevaAuditoria) {
        closeNuevaAuditoria.addEventListener('click', function() {
            nuevaAuditoriaModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            nuevaAuditoriaModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            document.getElementById('formNuevaAuditoria').reset();
        });
    }

    if (nuevaAuditoriaModal) {
        nuevaAuditoriaModal.addEventListener('click', function(event) {
            if (event.target === nuevaAuditoriaModal) {
                nuevaAuditoriaModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && nuevaAuditoriaModal && nuevaAuditoriaModal.classList.contains('show')) {
            nuevaAuditoriaModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    if (formNuevaAuditoria) {
        formNuevaAuditoria.addEventListener('submit', function(event) {
            event.preventDefault();
            crearNuevaAuditoria();
        });
    }
}

// =============================================
// CREAR NUEVA AUDITORÍA — guarda en localStorage
// =============================================
function crearNuevaAuditoria() {
    const empresa       = document.getElementById('nuevaEmpresa').value;
    const marca         = document.getElementById('nuevaMarca').value;
    const concesionaria = document.getElementById('nuevaConcesionaria').value;
    const local         = document.getElementById('nuevoLocal').value;
    const evaluacion    = document.getElementById('nuevaEvaluacion').value;
    const auditor       = document.getElementById('nuevoAuditor').value.trim();
    const fecha         = document.getElementById('nuevaFecha').value;

    if (!empresa || !marca || !concesionaria || !local || !evaluacion || !auditor || !fecha) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    const nuevaAuditoria = {
        id: Date.now(),
        empresa,
        marca,
        concesionaria,
        local,
        evaluacion,
        auditor,
        fecha,
        estado: 'Pendiente',
        cumplimiento_porcentaje: null
    };

    auditoriasData.push(nuevaAuditoria);
    filteredAuditorias = [...auditoriasData];

    // ← Guardar en localStorage para que el detalle pueda leerla
    saveAuditoriasToStorage();

    showNotification('Auditoría creada exitosamente', 'success');

    document.getElementById('formNuevaAuditoria').reset();
    document.getElementById('nuevaAuditoriaModal').classList.remove('show');
    document.body.style.overflow = 'auto';

    initializeFilters();
    renderAuditorias();
}

// =============================================
// MODAL DETALLE AUDITORÍA
// =============================================
function initializeDetalleAuditoriaModal() {
    const modal    = document.getElementById('detalleAuditoriaModal');
    const closeBtn = document.getElementById('closeDetalleAuditoria');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

function openDetalleAuditoria(id) {
    // Recargar desde localStorage para tener el estado actualizado (ej. si volvió de detalle)
    auditoriasData     = loadAuditoriasFromStorage();
    filteredAuditorias = [...auditoriasData];

    const auditoria = auditoriasData.find(a => a.id === id);
    if (!auditoria) return;

    const modal       = document.getElementById('detalleAuditoriaModal');
    const estadoBadge = document.getElementById('detalleEstado');
    const btnAction   = document.getElementById('btnDetalleAction');

    document.getElementById('detalleEmpresa').textContent =
        auditoria.empresa + ': ' + auditoria.marca + ' - ' + auditoria.local;
    document.getElementById('detalleEvaluacion').textContent = auditoria.evaluacion;
    document.getElementById('detalleFecha').textContent      = formatDateFromSQL(auditoria.fecha);
    document.getElementById('detalleAuditor').textContent    = auditoria.auditor || '-';

    const cumplimientoText =
        auditoria.cumplimiento_porcentaje !== null &&
        auditoria.cumplimiento_porcentaje !== undefined
            ? auditoria.cumplimiento_porcentaje.toFixed(2) + '%'
            : 'Sin calificar';
    document.getElementById('detalleCumplimiento').textContent = cumplimientoText;

    estadoBadge.className = 'detalle-status-badge';
    btnAction.className   = 'btn-detalle-action';

    switch (auditoria.estado) {
        case 'Pendiente':
            estadoBadge.classList.add('pendiente');
            estadoBadge.textContent = 'Pendiente';
            btnAction.textContent   = 'Empezar';
            btnAction.onclick = function() {
                window.location.href = 'Detalleauditoria.html?id=' + id;
            };
            break;

        case 'En Proceso':
            estadoBadge.classList.add('en-proceso');
            estadoBadge.textContent = 'En Proceso';
            btnAction.classList.add('en-proceso');
            btnAction.textContent   = 'Continuar';
            btnAction.onclick = function() {
                window.location.href = 'Detalleauditoria.html?id=' + id;
            };
            break;

        case 'Completado':
            estadoBadge.classList.add('completado');
            estadoBadge.textContent = 'Completado';
            btnAction.classList.add('completado');
            btnAction.textContent   = 'Ver Resultados';
            btnAction.onclick = function() {
                window.location.href = 'Dashauditorias.html?id=' + id;
            };
            break;

        default:
            estadoBadge.textContent = auditoria.estado;
            btnAction.textContent   = 'Ver';
            btnAction.onclick = function() {
                window.location.href = 'Detalleauditoria.html?id=' + id;
            };
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// =============================================
// RENDERIZADO
// =============================================
function renderAuditorias() {
    // Sincronizar estados actualizados desde localStorage
    const stored = loadAuditoriasFromStorage();
    auditoriasData.forEach((a, i) => {
        const updated = stored.find(s => s.id === a.id);
        if (updated) {
            auditoriasData[i].estado = updated.estado;
            auditoriasData[i].cumplimiento_porcentaje = updated.cumplimiento_porcentaje;
        }
    });

    const container = document.getElementById('auditoriasList');
    if (!container) return;

    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end   = start + itemsPerPage;
    const pageAuditorias = filteredAuditorias.slice(start, end);

    if (pageAuditorias.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#666;">
                <p style="font-size:18px; font-weight:600;">No se encontraron auditorías</p>
                <p style="font-size:14px; margin-top:10px;">Intenta ajustar los filtros o crear una nueva auditoría</p>
            </div>`;
        return;
    }

    pageAuditorias.forEach(auditoria => {
        const card = createAuditoriaCard(auditoria);
        container.appendChild(card);
    });

    updatePaginationInfo();
    updatePaginationButtons();
}

function createAuditoriaCard(auditoria) {
    const card = document.createElement('div');
    card.className = 'auditoria-card';

    const statusClass = auditoria.estado === 'Completado' ? 'completed'
                      : auditoria.estado === 'En Proceso'  ? 'in-progress'
                      : '';

    const cumplimientoDisplay =
        auditoria.cumplimiento_porcentaje !== null &&
        auditoria.cumplimiento_porcentaje !== undefined
            ? auditoria.cumplimiento_porcentaje.toFixed(2) + '%'
            : '-';

    card.innerHTML = `
        <div class="auditoria-info">
            <div class="auditoria-title">${auditoria.empresa}</div>
            <div class="auditoria-subtitle">${auditoria.marca} - ${auditoria.local}</div>
        </div>
        <div class="auditoria-info">
            <div class="auditoria-title">${auditoria.evaluacion}</div>
            <div class="auditoria-subtitle">Auditoría</div>
        </div>
        <div class="auditoria-date">
            <div class="auditoria-label">Fecha Programada</div>
            <div class="auditoria-value">${formatDateFromSQL(auditoria.fecha)}</div>
        </div>
        <div class="auditoria-compliance">
            <div class="auditoria-label">%Cumplimiento Total</div>
            <div class="auditoria-value">${cumplimientoDisplay}</div>
        </div>
        <div class="auditoria-status">
            <div class="status-badge ${statusClass}">${auditoria.estado}</div>
        </div>
        <div class="auditoria-action">
            <button class="btn-ir" onclick="openDetalleAuditoria(${auditoria.id})">Ir</button>
        </div>`;

    return card;
}

// =============================================
// UTILIDADES
// =============================================
function formatDateFromSQL(dateString) {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function updatePaginationInfo() {
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
}

function updatePaginationButtons() {
    const prevBtn    = document.getElementById('prevPage');
    const nextBtn    = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredAuditorias.length / itemsPerPage);

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

function refreshData() {
    auditoriasData     = loadAuditoriasFromStorage();
    filteredAuditorias = [...auditoriasData];
    initializeFilters();
    renderAuditorias();
}

function exportData() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'auditorias_export.csv');
    showNotification('Datos exportados correctamente', 'success');
}

function generateCSV() {
    let csv = '\uFEFF';
    csv += 'Empresa,Marca,Local,Evaluación,Fecha,Auditor,Estado,Cumplimiento %\n';

    filteredAuditorias.forEach(auditoria => {
        const cumplimiento =
            auditoria.cumplimiento_porcentaje !== null &&
            auditoria.cumplimiento_porcentaje !== undefined
                ? auditoria.cumplimiento_porcentaje.toFixed(2) + '%'
                : 'Pendiente';

        csv += `${auditoria.empresa},${auditoria.marca},${auditoria.local},`;
        csv += `${auditoria.evaluacion},${formatDateFromSQL(auditoria.fecha)},`;
        csv += `${auditoria.auditor},${auditoria.estado},${cumplimiento}\n`;
    });

    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// =============================================
// MODAL DE PERFIL
// =============================================
function initializeProfileModal() {
    const modal          = document.getElementById('profileModal');
    const userIcon       = document.querySelector('.user-icon');
    const closeModal     = document.querySelector('#profileModal .close-modal');
    const btnEditProfile = document.getElementById('btnEditProfile');
    const btnChangePass  = document.getElementById('btnChangePassword');
    const btnLogout      = document.getElementById('btnLogout');

    if (userIcon) {
        userIcon.addEventListener('click', function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function() {
            const inputs    = document.querySelectorAll('#profileModal .info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';

            if (isEditing) {
                inputs.forEach(input => input.setAttribute('readonly', true));
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                showNotification('Perfil actualizado correctamente', 'success');
            } else {
                inputs.forEach(input => {
                    if (input.id !== 'email' && input.id !== 'joinDate') {
                        input.removeAttribute('readonly');
                        input.style.backgroundColor = 'white';
                    }
                });
                this.textContent = 'Guardar Cambios';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
            }
        });
    }

    if (btnChangePass) {
        btnChangePass.addEventListener('click', function() {
            showNotification('Funcionalidad de cambio de contraseña próximamente', 'info');
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                showNotification('Cerrando sesión...', 'info');
                setTimeout(() => { window.location.href = 'login.html'; }, 1000);
            }
        });
    }

    const btnChangePhoto = document.querySelector('.btn-change-photo');
    if (btnChangePhoto) {
        btnChangePhoto.addEventListener('click', function() {
            showNotification('Funcionalidad de cambio de foto próximamente', 'info');
        });
    }
}

// =============================================
// NOTIFICACIONES
// =============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    let backgroundColor;
    switch (type) {
        case 'success': backgroundColor = 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; break;
        case 'error':   backgroundColor = 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'; break;
        case 'warning': backgroundColor = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'; break;
        default:        backgroundColor = 'linear-gradient(135deg, #1D3579 0%, #48BED7 100%)';
    }

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${backgroundColor}; color: white;
        padding: 15px 25px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,.2);
        z-index: 10000; font-weight: 600;
        font-family: 'Inter', sans-serif;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        setTimeout(() => {
            if (document.body.contains(notification)) document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

console.log('Sistema de auditorías inicializado — modo localStorage (sin API).');