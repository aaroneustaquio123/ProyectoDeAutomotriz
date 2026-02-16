// =============================================
// CONFIGURACIÓN DE LA API
// =============================================
const API_URL = 'http://127.0.0.1:8000';

// Variables globales
let currentPage = 1;
const itemsPerPage = 10;
let auditoriasData = [];
let filteredAuditorias = [];
let empresasData = [];
let marcasData = [];
let localesData = [];
let tiposEvaluacionData = [];

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

// Cargar datos iniciales desde la API
async function loadInitialData() {
    try {
        showNotification('Cargando datos...', 'info');
        
        // Cargar datos en paralelo
        const [empresas, marcas, locales, tipos, auditorias] = await Promise.all([
            fetch(`${API_URL}/empresas`).then(r => r.json()),
            fetch(`${API_URL}/marcas`).then(r => r.json()),
            fetch(`${API_URL}/locales`).then(r => r.json()),
            fetch(`${API_URL}/tipos-evaluacion`).then(r => r.json()),
            fetch(`${API_URL}/auditorias`).then(r => r.json())
        ]);
        
        empresasData = empresas;
        marcasData = marcas;
        localesData = locales;
        tiposEvaluacionData = tipos;
        auditoriasData = auditorias;
        filteredAuditorias = [...auditoriasData];
        
        initializeFilters();
        populateFormSelects();
        renderAuditorias();
        
        showNotification('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('Error cargando datos:', error);
        showNotification('Error al cargar los datos. Verifica que la API esté corriendo.', 'error');
    }
}

// Poblar los selects del formulario de nueva auditoría
function populateFormSelects() {
    // Select de Empresas
    const nuevaEmpresaSelect = document.getElementById('nuevaEmpresa');
    if (nuevaEmpresaSelect) {
        nuevaEmpresaSelect.innerHTML = '<option value="">Selecciona la empresa</option>';
        empresasData.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = empresa.nombre;
            nuevaEmpresaSelect.appendChild(option);
        });
    }
    
    // Select de Marcas
    const nuevaMarcaSelect = document.getElementById('nuevaMarca');
    if (nuevaMarcaSelect) {
        nuevaMarcaSelect.innerHTML = '<option value="">Selecciona la marca</option>';
        marcasData.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nombre;
            nuevaMarcaSelect.appendChild(option);
        });
    }
    
    // Select de Locales
    const nuevoLocalSelect = document.getElementById('nuevoLocal');
    if (nuevoLocalSelect) {
        nuevoLocalSelect.innerHTML = '<option value="">Selecciona el local</option>';
        localesData.forEach(local => {
            const option = document.createElement('option');
            option.value = local.id;
            option.textContent = local.nombre;
            nuevoLocalSelect.appendChild(option);
        });
    }
    
    // Select de Tipos de Evaluación
    const nuevaEvaluacionSelect = document.getElementById('nuevaEvaluacion');
    if (nuevaEvaluacionSelect) {
        nuevaEvaluacionSelect.innerHTML = '<option value="">Selecciona la evaluación</option>';
        tiposEvaluacionData.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            nuevaEvaluacionSelect.appendChild(option);
        });
    }
}

// =============================================
// FILTROS
// =============================================
function initializeFilters() {
    const empresaSelect = document.getElementById('empresa');
    const estadoSelect = document.getElementById('estado');

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
        const estados = ['Pendiente', 'Completado'];
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
    const estado = document.getElementById('estado').value;

    filteredAuditorias = auditoriasData.filter(auditoria => {
        const empresaMatch = !empresa || auditoria.empresa === empresa;
        const estadoMatch = !estado || auditoria.estado === estado;
        return empresaMatch && estadoMatch;
    });

    currentPage = 1;
    renderAuditorias();
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // Botón de refresh
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

    // Botón de exportar
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }

    // Filtros
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Paginación
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
    const btnNuevaAuditoria = document.getElementById('btnNuevaAuditoria');
    const nuevaAuditoriaModal = document.getElementById('nuevaAuditoriaModal');
    const closeNuevaAuditoria = document.getElementById('closeNuevaAuditoria');
    const formNuevaAuditoria = document.getElementById('formNuevaAuditoria');

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
        formNuevaAuditoria.addEventListener('submit', async function(event) {
            event.preventDefault();
            await crearNuevaAuditoria();
        });
    }
}

// Crear nueva auditoría en la API
async function crearNuevaAuditoria() {
    const empresa_id = parseInt(document.getElementById('nuevaEmpresa').value);
    const marca_id = parseInt(document.getElementById('nuevaMarca').value);
    const local_id = parseInt(document.getElementById('nuevoLocal').value);
    const evaluacion_id = parseInt(document.getElementById('nuevaEvaluacion').value);
    const auditor = document.getElementById('nuevoAuditor').value;
    const fecha = document.getElementById('nuevaFecha').value;
    
    if (!empresa_id || !marca_id || !local_id || !evaluacion_id || !auditor || !fecha) {
        showNotification('Por favor, complete todos los campos', 'error');
        return;
    }
    
    const nuevaAuditoria = {
        empresa_id: empresa_id,
        marca_id: marca_id,
        local_id: local_id,
        evaluacion_id: evaluacion_id,
        auditor: auditor,
        fecha: fecha,
        estado: 'Pendiente'
    };
    
    try {
        const response = await fetch(`${API_URL}/auditorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaAuditoria)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la auditoría');
        }
        
        const result = await response.json();
        showNotification('Auditoría creada exitosamente', 'success');
        
        // Cerrar modal y limpiar formulario
        document.getElementById('formNuevaAuditoria').reset();
        document.getElementById('nuevaAuditoriaModal').classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Recargar datos
        await loadInitialData();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al crear la auditoría', 'error');
    }
}

// =============================================
// MODAL DETALLE AUDITORÍA
// =============================================
function initializeDetalleAuditoriaModal() {
    const modal = document.getElementById('detalleAuditoriaModal');
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
    const auditoria = auditoriasData.find(a => a.id === id);
    if (!auditoria) return;

    const modal = document.getElementById('detalleAuditoriaModal');
    const estadoBadge = document.getElementById('detalleEstado');
    const btnAction = document.getElementById('btnDetalleAction');

    // Llenar datos
    document.getElementById('detalleEmpresa').textContent = auditoria.empresa + ': ' + auditoria.marca + ' - ' + auditoria.local;
    document.getElementById('detalleEvaluacion').textContent = auditoria.evaluacion;
    document.getElementById('detalleFecha').textContent = formatDateFromSQL(auditoria.fecha);
    document.getElementById('detalleAuditor').textContent = auditoria.auditor || '-';
    
    // Mostrar cumplimiento si existe
    const cumplimientoText = auditoria.cumplimiento_porcentaje !== null && auditoria.cumplimiento_porcentaje !== undefined
        ? auditoria.cumplimiento_porcentaje.toFixed(2) + '%'
        : 'Sin calificar';
    document.getElementById('detalleCumplimiento').textContent = cumplimientoText;

    // Configurar badge de estado
    estadoBadge.textContent = auditoria.estado;
    estadoBadge.className = 'detalle-status-badge';
    
    // Reset button classes
    btnAction.className = 'btn-detalle-action';

    if (auditoria.estado === 'Pendiente') {
        estadoBadge.classList.add('pendiente');
        btnAction.textContent = 'Empezar';
    } else if (auditoria.estado === 'Completado') {
        estadoBadge.classList.add('finalizada');
        btnAction.classList.add('finalizada');
        btnAction.textContent = 'Ver Resultados';
    }

    // Acción del botón
    btnAction.onclick = function() {
        window.location.href = 'Detalleauditoria.html?id=' + id;
    };

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// =============================================
// RENDERIZADO
// =============================================
function renderAuditorias() {
    const container = document.getElementById('auditoriasList');
    if (!container) return;

    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageAuditorias = filteredAuditorias.slice(start, end);

    if (pageAuditorias.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <p style="font-size: 18px; font-weight: 600;">No se encontraron auditorías</p>
                <p style="font-size: 14px; margin-top: 10px;">Intenta ajustar los filtros o crear una nueva auditoría</p>
            </div>
        `;
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

    const statusClass = auditoria.estado === 'Completado' ? 'completed' : '';
    
    // Mostrar cumplimiento si existe, sino mostrar "-"
    const cumplimientoDisplay = auditoria.cumplimiento_porcentaje !== null && auditoria.cumplimiento_porcentaje !== undefined
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
        </div>
    `;

    return card;
}

// =============================================
// UTILIDADES
// =============================================
function formatDateFromSQL(dateString) {
    // Convierte YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function formatDate(dateString) {
    // Para mantener compatibilidad
    return formatDateFromSQL(dateString);
}

function updatePaginationInfo() {
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) {
        currentPageSpan.textContent = currentPage;
    }
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredAuditorias.length / itemsPerPage);

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

async function refreshData() {
    console.log('Refrescando datos...');
    await loadInitialData();
}

function exportData() {
    console.log('Exportando datos...');
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'auditorias_export.csv');
    showNotification('Datos exportados correctamente', 'success');
}

function generateCSV() {
    let csv = '\uFEFF'; // BOM para Excel UTF-8
    csv += 'Empresa,Marca,Local,Evaluación,Fecha,Auditor,Estado,Cumplimiento %\n';
    
    filteredAuditorias.forEach(auditoria => {
        const cumplimiento = auditoria.cumplimiento_porcentaje !== null && auditoria.cumplimiento_porcentaje !== undefined
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
    const modal = document.getElementById('profileModal');
    const userIcon = document.querySelector('.user-icon');
    const closeModal = document.querySelector('#profileModal .close-modal');
    const btnEditProfile = document.getElementById('btnEditProfile');
    const btnChangePassword = document.getElementById('btnChangePassword');
    const btnLogout = document.getElementById('btnLogout');
    
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
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function() {
            const inputs = document.querySelectorAll('#profileModal .info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';
            
            if (isEditing) {
                inputs.forEach(input => {
                    input.setAttribute('readonly', true);
                });
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
    
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', function() {
            showNotification('Funcionalidad de cambio de contraseña próximamente', 'info');
        });
    }
    
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                showNotification('Cerrando sesión...', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
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
    switch(type) {
        case 'success':
            backgroundColor = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            break;
        case 'error':
            backgroundColor = 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)';
            break;
        case 'warning':
            backgroundColor = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
            break;
        default:
            backgroundColor = 'linear-gradient(135deg, #1D3579 0%, #48BED7 100%)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('Sistema de auditorías con FastAPI inicializado correctamente');