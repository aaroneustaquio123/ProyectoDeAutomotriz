// Datos de la plantilla
let plantillaActual = null;

// Inicializar la página cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosPlantilla();
    initializeProfileModal();
});

// Cargar datos de la plantilla desde URL o localStorage
function cargarDatosPlantilla() {
    // Obtener el ID de la plantilla desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const plantillaId = urlParams.get('id');
    
    if (plantillaId) {
        // Aquí cargarías los datos desde tu backend
        // Por ahora usamos datos simulados
        plantillaActual = {
            id: plantillaId,
            marca: 'Toyota',
            proceso: 'Mystery Shopper',
            categoria: 'Procesos (Ventas)',
            cumplimiento: 85
        };
        
        // Actualizar el porcentaje de cumplimiento
        const cumplimientoSpan = document.getElementById('porcentajeCumplimiento');
        if (cumplimientoSpan && plantillaActual.cumplimiento) {
            cumplimientoSpan.textContent = `${plantillaActual.cumplimiento}% Cumplimiento`;
        }
    }
}

// Toggle del acordeón
function toggleAccordion(header) {
    const accordionItem = header.parentElement;
    const isActive = accordionItem.classList.contains('active');
    
    // Cerrar todos los acordeones
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir el acordeón clickeado si no estaba activo
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

// Volver a la página de plantillas
function volverAPlantillas() {
    if (confirm('¿Deseas salir sin guardar los cambios?')) {
        window.location.href = 'plantillas.html';
    }
}

// Guardar cambios
function guardarCambios() {
    console.log('Guardando cambios de la plantilla:', plantillaActual);
    
    // Aquí iría la lógica para guardar en el backend
    showNotification('Cambios guardados exitosamente');
    
    // Opcional: volver a la página de plantillas después de guardar
    setTimeout(() => {
        window.location.href = 'plantillas.html';
    }, 1500);
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

// Agregar funcionalidad al botón Nuevo Criterio
document.addEventListener('DOMContentLoaded', function() {
    const btnNuevoCriterio = document.querySelector('.btn-nuevo-criterio');
    if (btnNuevoCriterio) {
        btnNuevoCriterio.addEventListener('click', function() {
            console.log('Abriendo formulario para nuevo criterio...');
            showNotification('Funcionalidad de nuevo criterio próximamente');
        });
    }
});

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

console.log('Página de edición de plantilla inicializada correctamente');