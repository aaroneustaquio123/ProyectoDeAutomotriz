// Datos de ejemplo para plantillas
const plantillasData = [
    {
        id: 1,
        marca: 'Toyota',
        proceso: 'Mystery Shopper',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 30
    },
    {
        id: 2,
        marca: 'Toyota',
        proceso: 'Mystery Shopper',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 30
    },
    {
        id: 3,
        marca: 'Toyota',
        proceso: 'Mystery Shopper',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 30
    },
    {
        id: 4,
        marca: 'Toyota',
        proceso: 'Mystery Shopper',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 30
    },
    {
        id: 5,
        marca: 'Toyota',
        proceso: 'Mystery Shopper',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 30
    },
    {
        id: 6,
        marca: 'Honda',
        proceso: 'Servicio Post-Venta',
        categoria: 'Procesos (Servicios)',
        numPreguntas: 25
    },
    {
        id: 7,
        marca: 'Nissan',
        proceso: 'Evaluación de Instalaciones',
        categoria: 'Infraestructura',
        numPreguntas: 40
    },
    {
        id: 8,
        marca: 'Mazda',
        proceso: 'Atención al Cliente',
        categoria: 'Procesos (Ventas)',
        numPreguntas: 28
    }
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
});

// Configurar selectores de fecha
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('.date-field');
    
    dateInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
}

// Inicializar filtros
function initializeFilters() {
    const empresaSelect = document.getElementById('empresa');
    const marcaSelect = document.getElementById('marca');
    const estadoSelect = document.getElementById('estado');

    // Agregar opciones de empresas
    const empresas = ['Empresa 1', 'Empresa 2', 'Empresa 3'];
    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa;
        option.textContent = empresa;
        empresaSelect.appendChild(option);
    });

    // Agregar opciones de marcas
    const marcas = [...new Set(plantillasData.map(p => p.marca))];
    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    });

    // Agregar opciones de estado
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

    // Botón de agregar
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            abrirModalNuevaPlantilla();
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
    const end = start + itemsPerPage;
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

// Crear tarjeta de plantilla
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
            <button class="btn-editar" onclick="editarPlantilla(${plantilla.id})">Editar</button>
        </div>
    `;

    return card;
}

// Editar plantilla específica
function editarPlantilla(id) {
    console.log('Editando plantilla:', id);
    // Redirigir a la página de edición con el ID de la plantilla
    window.location.href = `editarplantilla.html?id=${id}`;
}

// Aplicar filtros
function applyFilters() {
    const empresa = document.getElementById('empresa').value;
    const marca = document.getElementById('marca').value;
    const estado = document.getElementById('estado').value;
    const desde = document.getElementById('desde').value;
    const hasta = document.getElementById('hasta').value;

    filteredPlantillas = plantillasData.filter(plantilla => {
        const empresaMatch = empresa === 'Selecciona la empresa' || true; // Sin filtro de empresa en datos
        const marcaMatch = marca === 'Selecciona la marca' || plantilla.marca === marca;
        const estadoMatch = estado === 'Selecciona el concesionario' || true; // Sin filtro de estado en datos
        
        return empresaMatch && marcaMatch && estadoMatch;
    });

    currentPage = 1;
    renderPlantillas();

    console.log('Filtros aplicados:', {
        empresa,
        marca,
        estado,
        desde,
        hasta
    });
}

// Actualizar información de paginación
function updatePaginationInfo() {
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) {
        currentPageSpan.textContent = currentPage;
    }
}

// Actualizar botones de paginación
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredPlantillas.length / itemsPerPage);

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// Refrescar datos
function refreshData() {
    console.log('Refrescando datos...');
    
    // Simular actualización de datos
    setTimeout(() => {
        console.log('Datos actualizados');
        renderPlantillas();
        showNotification('Datos actualizados correctamente');
    }, 500);
}

// Exportar datos
function exportData() {
    console.log('Exportando datos...');
    
    // Generar y descargar CSV
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'plantillas_export.csv');
}

// Generar contenido CSV
function generateCSV() {
    let csv = 'Marca,Categoría,Proceso,Número de Preguntas\n';
    
    filteredPlantillas.forEach(plantilla => {
        csv += `${plantilla.marca},${plantilla.categoria},${plantilla.proceso},${plantilla.numPreguntas}\n`;
    });
    
    return csv;
}

// Descargar archivo CSV
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

// Inicializar modal de nueva plantilla
function initializeNuevaPlantillaModal() {
    const modal = document.getElementById('nuevaPlantillaModal');
    const closeBtn = document.getElementById('closeNuevaPlantilla');
    const cancelBtn = document.getElementById('btnCancelarPlantilla');
    const form = document.getElementById('formNuevaPlantilla');
    
    // Cerrar modal con la X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cerrarModalNuevaPlantilla();
        });
    }
    
    // Cerrar modal con botón Cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            cerrarModalNuevaPlantilla();
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModalNuevaPlantilla();
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            cerrarModalNuevaPlantilla();
        }
    });
    
    // Manejar envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            crearNuevaPlantilla();
        });
    }
}

// Abrir modal de nueva plantilla
function abrirModalNuevaPlantilla() {
    const modal = document.getElementById('nuevaPlantillaModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Limpiar el formulario
    const form = document.getElementById('formNuevaPlantilla');
    if (form) {
        form.reset();
    }
}

// Cerrar modal de nueva plantilla
function cerrarModalNuevaPlantilla() {
    const modal = document.getElementById('nuevaPlantillaModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Crear nueva plantilla
function crearNuevaPlantilla() {
    const marca = document.getElementById('marcaNueva').value;
    const concesionario = document.getElementById('concesionarioNuevo').value;
    const capitulo = document.getElementById('capituloNuevo').value;
    const nombreCapitulo = document.getElementById('nombreCapitulo').value;
    const subcapitulo = document.getElementById('subcapituloNuevo').value;
    const metodo = document.getElementById('metodoNuevo').value;
    
    console.log('Creando nueva plantilla:', {
        marca,
        concesionario,
        capitulo,
        nombreCapitulo,
        subcapitulo,
        metodo
    });
    
    // Aquí iría la lógica para guardar la plantilla en el backend
    
    showNotification('Plantilla creada exitosamente');
    cerrarModalNuevaPlantilla();
    
    // Agregar la nueva plantilla a los datos (simulación)
    const nuevaPlantilla = {
        id: plantillasData.length + 1,
        marca: marca,
        proceso: metodo,
        categoria: nombreCapitulo,
        numPreguntas: 0
    };
    
    plantillasData.push(nuevaPlantilla);
    filteredPlantillas = [...plantillasData];
    renderPlantillas();
}

// Inicializar modal de perfil
function initializeProfileModal() {
    const modal = document.getElementById('profileModal');
    const userIcon = document.querySelector('.user-icon');
    const closeModal = document.querySelector('.close-modal');
    const btnEditProfile = document.getElementById('btnEditProfile');
    const btnChangePassword = document.getElementById('btnChangePassword');
    const btnLogout = document.getElementById('btnLogout');
    
    // Abrir modal al hacer clic en el icono de usuario
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Cerrar modal al hacer clic en la X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Botón Editar Perfil
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function() {
            const inputs = document.querySelectorAll('.info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';
            
            if (isEditing) {
                inputs.forEach(input => {
                    input.setAttribute('readonly', true);
                });
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                
                console.log('Guardando cambios del perfil...');
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
    
    // Botón Cambiar Contraseña
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', function() {
            console.log('Abriendo diálogo de cambio de contraseña...');
            showNotification('Funcionalidad de cambio de contraseña próximamente');
        });
    }
    
    // Botón Cerrar Sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                console.log('Cerrando sesión...');
                showNotification('Cerrando sesión...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            }
        });
    }
    
    // Botón cambiar foto
    const btnChangePhoto = document.querySelector('.btn-change-photo');
    if (btnChangePhoto) {
        btnChangePhoto.addEventListener('click', function() {
            console.log('Abriendo selector de foto...');
            showNotification('Funcionalidad de cambio de foto próximamente');
        });
    }
}

// Función para mostrar notificaciones
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

console.log('Página de plantillas inicializada correctamente');