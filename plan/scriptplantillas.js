// Datos de ejemplo para plantillas
const plantillasData = [
    { id: 1, marca: 'Toyota', proceso: 'Mystery Shopper', categoria: 'Procesos (Ventas)', numPreguntas: 30 },
    { id: 2, marca: 'Toyota', proceso: 'Mystery Shopper', categoria: 'Procesos (Ventas)', numPreguntas: 30 },
    { id: 3, marca: 'Toyota', proceso: 'Mystery Shopper', categoria: 'Procesos (Ventas)', numPreguntas: 30 },
    { id: 4, marca: 'Toyota', proceso: 'Mystery Shopper', categoria: 'Procesos (Ventas)', numPreguntas: 30 },
    { id: 5, marca: 'Toyota', proceso: 'Mystery Shopper', categoria: 'Procesos (Ventas)', numPreguntas: 30 },
    { id: 6, marca: 'Honda', proceso: 'Servicio Post-Venta', categoria: 'Procesos (Servicios)', numPreguntas: 25 },
    { id: 7, marca: 'Nissan', proceso: 'Evaluación de Instalaciones', categoria: 'Infraestructura', numPreguntas: 40 },
    { id: 8, marca: 'Mazda', proceso: 'Atención al Cliente', categoria: 'Procesos (Ventas)', numPreguntas: 28 }
];

// Variables globales
let currentPage = 1;
const itemsPerPage = 10;
let filteredPlantillas = [...plantillasData];

// Inicializar la página cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeFilters();
    setupEventListeners();
    renderPlantillas();
    initializeProfileModal();
    initializeNuevaPlantillaModal();
    initializeAccionCompletadaModal();
});

// Configurar selectores de fecha
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('.date-field');
    dateInputs.forEach(input => {
        input.addEventListener('focus', function() { this.type = 'date'; });
        input.addEventListener('blur', function() { if (!this.value) this.type = 'text'; });
    });
}

// Inicializar filtros
function initializeFilters() {
    const empresaSelect = document.getElementById('empresa');
    const marcaSelect   = document.getElementById('marca');
    const estadoSelect  = document.getElementById('estado');

    const empresas = ['Empresa 1', 'Empresa 2', 'Empresa 3'];
    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa;
        option.textContent = empresa;
        empresaSelect.appendChild(option);
    });

    const marcas = [...new Set(plantillasData.map(p => p.marca))];
    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    });

    const estados = ['Concesionario 1', 'Concesionario 2', 'Concesionario 3'];
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    });
}

// Configurar event listeners
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
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    const addBtn = document.querySelector('.add-btn');
    if (addBtn) addBtn.addEventListener('click', abrirModalNuevaPlantilla);

    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPlantillas();
                updatePaginationButtons();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPlantillas.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPlantillas();
                updatePaginationButtons();
            }
        });
    }
}

// Renderizar plantillas
function renderPlantillas() {
    const container = document.getElementById('plantillasList');
    if (!container) return;

    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end   = start + itemsPerPage;
    const pagePlantillas = filteredPlantillas.slice(start, end);

    if (pagePlantillas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <p style="font-size: 18px; font-weight: 600;">No se encontraron plantillas</p>
                <p style="font-size: 14px; margin-top: 10px;">Intenta ajustar los filtros</p>
            </div>
        `;
        return;
    }

    pagePlantillas.forEach(plantilla => {
        const card = createPlantillaCard(plantilla);
        container.appendChild(card);
    });

    updatePaginationInfo();
    updatePaginationButtons();
}

// Crear tarjeta de plantilla (sin onclick inline para compatibilidad móvil)
function createPlantillaCard(plantilla) {
    const card = document.createElement('div');
    card.className = 'plantilla-card';
    card.innerHTML = `
        <div class="plantilla-info">
            <div class="plantilla-title">Marca</div>
            <div class="plantilla-subtitle">${plantilla.marca}</div>
        </div>
        <div class="plantilla-info">
            <div class="plantilla-title">${plantilla.categoria}</div>
            <div class="plantilla-subtitle">${plantilla.proceso}</div>
        </div>
        <div class="plantilla-info">
            <div class="plantilla-title">Nº Preguntas</div>
            <div class="plantilla-subtitle">${plantilla.numPreguntas}</div>
        </div>
        <div class="plantilla-action">
            <button class="btn-editar">Editar</button>
        </div>
    `;

    // addEventListener en vez de onclick inline (funciona correctamente en móvil)
    card.querySelector('.btn-editar').addEventListener('click', function () {
        window.location.href = 'editarplantilla.html?id=' + plantilla.id;
    });

    return card;
}

// Aplicar filtros
function applyFilters() {
    const marca = document.getElementById('marca').value;

    filteredPlantillas = plantillasData.filter(plantilla => {
        const marcaMatch = marca === 'Selecciona la marca' || plantilla.marca === marca;
        return marcaMatch;
    });

    currentPage = 1;
    renderPlantillas();
}

// Paginación
function updatePaginationInfo() {
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
}

function updatePaginationButtons() {
    const prevBtn    = document.getElementById('prevPage');
    const nextBtn    = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredPlantillas.length / itemsPerPage);

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

// Refrescar datos
function refreshData() {
    setTimeout(() => {
        renderPlantillas();
        showNotification('Datos actualizados correctamente');
    }, 500);
}

// Exportar datos
function exportData() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'plantillas_export.csv');
}

function generateCSV() {
    let csv = 'Marca,Categoría,Proceso,Número de Preguntas\n';
    filteredPlantillas.forEach(p => {
        csv += `${p.marca},${p.categoria},${p.proceso},${p.numPreguntas}\n`;
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

// =====================
// MODAL NUEVA PLANTILLA
// =====================
function initializeNuevaPlantillaModal() {
    const modal     = document.getElementById('nuevaPlantillaModal');
    const closeBtn  = document.getElementById('closeNuevaPlantilla');
    const cancelBtn = document.getElementById('btnCancelarPlantilla');
    const form      = document.getElementById('formNuevaPlantilla');

    if (closeBtn)  closeBtn.addEventListener('click', cerrarModalNuevaPlantilla);
    if (cancelBtn) cancelBtn.addEventListener('click', cerrarModalNuevaPlantilla);

    window.addEventListener('click', function(event) {
        if (event.target === modal) cerrarModalNuevaPlantilla();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) cerrarModalNuevaPlantilla();
    });

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            crearNuevaPlantilla();
        });
    }
}

function abrirModalNuevaPlantilla() {
    const modal = document.getElementById('nuevaPlantillaModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    const form = document.getElementById('formNuevaPlantilla');
    if (form) form.reset();
}

function cerrarModalNuevaPlantilla() {
    const modal = document.getElementById('nuevaPlantillaModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function crearNuevaPlantilla() {
    const marca          = document.getElementById('marcaNueva').value;
    const nombreCapitulo = document.getElementById('nombreCapitulo').value;
    const nombrePlantilla = document.getElementById('nombrePlantilla').value;

    const nuevaPlantilla = {
        id:           plantillasData.length + 1,
        marca:        marca,
        proceso:      nombrePlantilla,
        categoria:    nombreCapitulo,
        numPreguntas: 0
    };

    plantillasData.push(nuevaPlantilla);
    filteredPlantillas = [...plantillasData];
    renderPlantillas();

    cerrarModalNuevaPlantilla();
    abrirModalAccionCompletada();
}

// ========================
// MODAL ACCIÓN COMPLETADA
// ========================
function initializeAccionCompletadaModal() {
    const closeBtn  = document.getElementById('closeAccionCompletada');
    const cerrarBtn = document.getElementById('btnCerrarAccion');
    const modal     = document.getElementById('accionCompletadaModal');

    if (closeBtn)  closeBtn.addEventListener('click', cerrarModalAccionCompletada);
    if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModalAccionCompletada);

    window.addEventListener('click', function(event) {
        if (event.target === modal) cerrarModalAccionCompletada();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) cerrarModalAccionCompletada();
    });
}

function abrirModalAccionCompletada() {
    const modal = document.getElementById('accionCompletadaModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalAccionCompletada() {
    const modal = document.getElementById('accionCompletadaModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===================
// MODAL DE PERFIL
// ===================
function initializeProfileModal() {
    const modal             = document.getElementById('profileModal');
    const userIcon          = document.querySelector('.user-icon');
    const btnEditProfile    = document.getElementById('btnEditProfile');
    const btnChangePassword = document.getElementById('btnChangePassword');
    const btnLogout         = document.getElementById('btnLogout');

    if (userIcon) {
        userIcon.addEventListener('click', function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function() {
            const inputs    = document.querySelectorAll('.info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';

            if (isEditing) {
                inputs.forEach(input => input.setAttribute('readonly', true));
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                showNotification('Perfil actualizado correctamente');
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
            showNotification('Funcionalidad de cambio de contraseña próximamente');
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                showNotification('Cerrando sesión...');
                setTimeout(() => { window.location.href = '/login'; }, 1000);
            }
        });
    }

    const btnChangePhoto = document.querySelector('.btn-change-photo');
    if (btnChangePhoto) {
        btnChangePhoto.addEventListener('click', function() {
            showNotification('Funcionalidad de cambio de foto próximamente');
        });
    }
}

// Notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1D3579 0%, #48BED7 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

console.log('Página de plantillas inicializada correctamente');