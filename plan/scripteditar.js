document.addEventListener('DOMContentLoaded', function () {
    initializeProfileModal();
    initializeEditarCriteriosModal();
    initializeNuevoCriterioModal();
    initializeGuardarModal();
    initializeCancelarModal();
    initializeSubcriteriosNavegacion();
});

// ================================================
// DATOS DE CRITERIOS
// ================================================
function getCriteriosActuales() {
    const items = document.querySelectorAll('#criteriosList .criterio-nombre');
    return Array.from(items).map(el => el.textContent.trim());
}

// ================================================
// NAVEGACION A SUBCRITERIOS
// ================================================
function initializeSubcriteriosNavegacion() {
    const criteriosList = document.getElementById('criteriosList');
    if (criteriosList) {
        criteriosList.addEventListener('click', function (e) {
            const item = e.target.closest('.criterio-item');
            if (!item) return;
            const nombre = item.querySelector('.criterio-nombre').textContent.trim();
            window.location.href = 'subcriterios.html?criterio=' + encodeURIComponent(nombre);
        });
    }
}

// ================================================
// MODAL EDITAR CRITERIOS
// ================================================
function initializeEditarCriteriosModal() {
    const btnAbrir  = document.getElementById('btnEditarCriterio');
    const btnClose  = document.getElementById('closeEditarCriterios');
    const btnCancel = document.getElementById('btnCancelarEditar');
    const btnGuard  = document.getElementById('btnGuardarCriterios');
    const modal     = document.getElementById('modalEditarCriterios');

    if (btnAbrir) btnAbrir.addEventListener('click', abrirEditarCriterios);
    if (btnClose) btnClose.addEventListener('click', () => cerrarModal('modalEditarCriterios'));

    // Cancelar dentro del modal editar → cierra editar y abre modal confirmar cancelar
    if (btnCancel) {
        btnCancel.addEventListener('click', function (e) {
            e.stopPropagation();
            cerrarModal('modalEditarCriterios');
            const mc = document.getElementById('modalCancelar');
            if (mc) { mc.classList.add('show'); document.body.style.overflow = 'hidden'; }
        });
    }

    // Guardar criterios → cierra editar y abre modal confirmar guardar
    if (btnGuard) {
        btnGuard.addEventListener('click', function (e) {
            e.stopPropagation();
            cerrarModal('modalEditarCriterios');
            abrirModalGuardarDesdeEditar();
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal('modalEditarCriterios');
    });
}

function abrirEditarCriterios() {
    const modal     = document.getElementById('modalEditarCriterios');
    const ecList    = document.getElementById('ecList');
    const criterios = getCriteriosActuales();

    ecList.innerHTML = '';

    criterios.forEach((nombre) => {
        const item = document.createElement('div');
        item.className = 'ec-item';
        item.innerHTML = `
            <input type="text" class="ec-input" value="${nombre}" placeholder="Nombre del criterio">
            <button class="ec-delete-btn" title="Eliminar" onclick="eliminarEcItem(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="11" fill="white" opacity="0.15"/>
                    <circle cx="12" cy="12" r="11" fill="none" stroke="white" stroke-width="1.5"/>
                    <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="16" y1="8" x2="8" y2="16" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;
        ecList.appendChild(item);
    });

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function eliminarEcItem(btn) {
    const item = btn.closest('.ec-item');
    if (item) {
        item.style.transition = 'opacity 0.2s, transform 0.2s';
        item.style.opacity    = '0';
        item.style.transform  = 'translateX(20px)';
        setTimeout(() => item.remove(), 200);
    }
}

function guardarCriteriosEditados() {
    const inputs = document.querySelectorAll('#ecList .ec-input');
    const lista  = document.getElementById('criteriosList');
    lista.innerHTML = '';

    inputs.forEach(input => {
        const nombre = input.value.trim();
        if (!nombre) return;
        const item = document.createElement('div');
        item.className = 'criterio-item';
        item.innerHTML = `
            <span class="criterio-nombre">${nombre.toUpperCase()}</span>
            <svg class="criterio-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        lista.appendChild(item);
    });
}

// ================================================
// MODAL GUARDAR
// ================================================
let guardarDesdeEditar = false;

function abrirModalGuardarDesdeEditar() {
    guardarDesdeEditar = true;
    const modal = document.getElementById('modalGuardar');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function initializeGuardarModal() {
    const modal    = document.getElementById('modalGuardar');
    const btnAbrir = document.getElementById('btnGuardar');
    const btnClose = document.getElementById('closeGuardar');
    const btnSi    = document.getElementById('btnConfirmarGuardar');
    const btnNo    = document.getElementById('btnCancelarGuardar');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', function (e) {
            e.stopPropagation();
            guardarDesdeEditar = false;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (btnClose) btnClose.addEventListener('click', () => cerrarModal('modalGuardar'));
    if (btnNo)    btnNo.addEventListener('click',    () => cerrarModal('modalGuardar'));

    if (btnSi) {
        btnSi.addEventListener('click', function (e) {
            e.stopPropagation();
            if (guardarDesdeEditar) {
                guardarCriteriosEditados();
                showNotification('Criterios guardados correctamente');
                cerrarModal('modalGuardar');
            } else {
                cerrarModal('modalGuardar');
                showNotification('Plantilla guardada correctamente');
                setTimeout(() => { window.location.href = 'plantillas.html'; }, 1500);
            }
            guardarDesdeEditar = false;
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal('modalGuardar');
    });
}

// ================================================
// MODAL CANCELAR
// ================================================
function initializeCancelarModal() {
    const modal    = document.getElementById('modalCancelar');
    const btnAbrir = document.getElementById('btnCancelar');
    const btnClose = document.getElementById('closeCancelar');
    const btnSi    = document.getElementById('btnConfirmarCancelar');
    const btnNo    = document.getElementById('btnNoCancelar');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', function (e) {
            e.stopPropagation();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (btnClose) btnClose.addEventListener('click', () => cerrarModal('modalCancelar'));
    if (btnNo)    btnNo.addEventListener('click',    () => cerrarModal('modalCancelar'));

    if (btnSi) {
        btnSi.addEventListener('click', function () {
            window.location.href = 'plantillas.html';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal('modalCancelar');
    });
}

// ================================================
// MODAL NUEVO CRITERIO
// ================================================
function initializeNuevoCriterioModal() {
    const modal    = document.getElementById('modalNuevoCriterio');
    const btnAbrir = document.getElementById('btnAgregarCriterio');
    const btnClose = document.getElementById('closeNuevoCriterio');
    const btnCrear = document.getElementById('btnCrearCriterio');
    const input    = document.getElementById('inputNombreCriterio');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', function (e) {
            e.stopPropagation();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            if (input) { input.value = ''; input.focus(); }
        });
    }

    if (btnClose) btnClose.addEventListener('click', () => cerrarModal('modalNuevoCriterio'));

    if (btnCrear) {
        btnCrear.addEventListener('click', function (e) {
            e.stopPropagation();
            const nombre = input ? input.value.trim() : '';
            if (!nombre) {
                input.focus();
                input.style.borderColor = '#FF0000';
                return;
            }
            input.style.borderColor = '';
            agregarCriterio(nombre);
            cerrarModal('modalNuevoCriterio');
            showNotification('Criterio agregado correctamente');
        });
    }

    if (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') document.getElementById('btnCrearCriterio').click();
        });
        input.addEventListener('input', function () { this.style.borderColor = ''; });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal('modalNuevoCriterio');
    });
}

function agregarCriterio(nombre) {
    const lista = document.getElementById('criteriosList');
    if (!lista) return;
    const item = document.createElement('div');
    item.className = 'criterio-item';
    item.innerHTML = `
        <span class="criterio-nombre">${nombre.toUpperCase()}</span>
        <svg class="criterio-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;
    lista.appendChild(item);
}

// ================================================
// MODAL PERFIL
// ================================================
function initializeProfileModal() {
    const modal    = document.getElementById('profileModal');
    const userIcon = document.getElementById('userIconBtn');
    const closeBtn = document.getElementById('closeProfileModal');

    if (userIcon) {
        userIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => cerrarModal('profileModal'));

    window.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal('profileModal');
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            [
                'modalEditarCriterios',
                'modalNuevoCriterio',
                'modalGuardar',
                'modalCancelar',
                'profileModal'
            ].forEach(id => {
                const m = document.getElementById(id);
                if (m && m.classList.contains('show')) cerrarModal(id);
            });
        }
    });

    const btnEditProfile = document.getElementById('btnEditProfile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function () {
            const inputs    = document.querySelectorAll('#profileModal .info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';
            if (isEditing) {
                inputs.forEach(input => input.setAttribute('readonly', true));
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                showNotification('Perfil actualizado correctamente');
            } else {
                inputs.forEach(input => {
                    if (input.type !== 'email') {
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

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            cerrarModal('profileModal');
            const mc = document.getElementById('modalCancelar');
            if (mc) { mc.classList.add('show'); document.body.style.overflow = 'hidden'; }
        });
    }
}

// ================================================
// UTILIDADES
// ================================================
function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showNotification(message) {
    const n = document.createElement('div');
    n.textContent = message;
    n.style.cssText = `
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
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => { if (document.body.contains(n)) document.body.removeChild(n); }, 300);
    }, 3000);
}