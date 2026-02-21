document.addEventListener('DOMContentLoaded', function () {
    // Leer nombre del criterio desde URL params
    const params = new URLSearchParams(window.location.search);
    const criterio = params.get('criterio');
    if (criterio) {
        document.getElementById('pageTitle').textContent = 'SUBCRITERIOS - ' + decodeURIComponent(criterio).toUpperCase();
    }

    initAgregar();
    initEditar();
    initPerfil();
    initNavegacionPreguntas();
});

// ================================================
// NAVEGAR A PREGUNTAS al click en subcriterio
// ================================================
function initNavegacionPreguntas() {
    const lista = document.getElementById('subcriteriosList');
    if (lista) {
        lista.addEventListener('click', function (e) {
            const item = e.target.closest('.criterio-item');
            if (!item) return;
            const nombre = item.querySelector('.criterio-nombre').textContent.trim();
            window.location.href = 'preguntas.html?subcriterio=' + encodeURIComponent(nombre);
        });
    }
}

// ================================================
// AGREGAR SUBCRITERIO
// ================================================
function initAgregar() {
    const modal    = document.getElementById('modalNuevoSubcriterio');
    const btnAbrir = document.getElementById('btnAgregar');
    const btnClose = document.getElementById('closeNuevoSubcriterio');
    const btnCrear = document.getElementById('btnCrearSubcriterio');
    const input    = document.getElementById('inputNombreSub');

    btnAbrir.addEventListener('click', function () {
        if (input) input.value = '';
        abrirModal('modalNuevoSubcriterio');
    });

    btnClose.addEventListener('click', () => cerrarModal('modalNuevoSubcriterio'));

    btnCrear.addEventListener('click', function () {
        const nombre = input ? input.value.trim() : '';
        if (!nombre) {
            input.style.borderColor = '#E53E3E';
            input.focus();
            return;
        }
        input.style.borderColor = '';
        agregarSubcriterio(nombre);
        cerrarModal('modalNuevoSubcriterio');
        showNotification('Subcriterio agregado correctamente');
    });

    if (input) {
        input.addEventListener('keydown', e => { if (e.key === 'Enter') btnCrear.click(); });
        input.addEventListener('input',   () => { input.style.borderColor = ''; });
    }

    window.addEventListener('click', e => { if (e.target === modal) cerrarModal('modalNuevoSubcriterio'); });
}

function agregarSubcriterio(nombre) {
    const lista = document.getElementById('subcriteriosList');
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
// EDITAR SUBCRITERIOS
// ================================================
function initEditar() {
    const modalEditar   = document.getElementById('modalEditarSubcriterios');
    const modalGuardar  = document.getElementById('modalGuardar');
    const modalCancelar = document.getElementById('modalCancelar');

    const btnEditar         = document.getElementById('btnEditar');
    const closeEditar       = document.getElementById('closeEditarSub');
    const btnCancelarEditar = document.getElementById('btnCancelarEditar');
    const btnGuardarEditar  = document.getElementById('btnGuardarEditar');

    const closeGuardar = document.getElementById('closeGuardar');
    const btnSiGuardar = document.getElementById('btnSiGuardar');
    const btnNoGuardar = document.getElementById('btnNoGuardar');

    const closeCancelar = document.getElementById('closeCancelar');
    const btnSiCancelar = document.getElementById('btnSiCancelar');
    const btnNoCancelar = document.getElementById('btnNoCancelar');

    // Abrir modal editar
    btnEditar.addEventListener('click', function () {
        cargarListaEditar();
        abrirModal('modalEditarSubcriterios');
    });

    closeEditar.addEventListener('click', () => cerrarModal('modalEditarSubcriterios'));

    // Cancelar → modal confirmar cancelar
    btnCancelarEditar.addEventListener('click', function () {
        abrirModal('modalCancelar');
    });

    // Guardar → modal confirmar guardar
    btnGuardarEditar.addEventListener('click', function () {
        abrirModal('modalGuardar');
    });

    // === MODAL GUARDAR ===
    closeGuardar.addEventListener('click', () => cerrarModal('modalGuardar'));
    btnNoGuardar.addEventListener('click', () => cerrarModal('modalGuardar'));
    btnSiGuardar.addEventListener('click', function () {
        aplicarCambios();
        cerrarModal('modalGuardar');
        cerrarModal('modalEditarSubcriterios');
        showNotification('Subcriterios guardados correctamente');
    });

    // === MODAL CANCELAR ===
    closeCancelar.addEventListener('click', () => cerrarModal('modalCancelar'));
    btnNoCancelar.addEventListener('click', () => cerrarModal('modalCancelar'));
    btnSiCancelar.addEventListener('click', function () {
        cerrarModal('modalCancelar');
        cerrarModal('modalEditarSubcriterios');
    });

    // Cerrar al click fuera
    window.addEventListener('click', function (e) {
        if (e.target === modalEditar)   cerrarModal('modalEditarSubcriterios');
        if (e.target === modalGuardar)  cerrarModal('modalGuardar');
        if (e.target === modalCancelar) cerrarModal('modalCancelar');
    });
}

function cargarListaEditar() {
    const items  = document.querySelectorAll('#subcriteriosList .criterio-nombre');
    const ecList = document.getElementById('ecListSub');
    ecList.innerHTML = '';

    items.forEach(el => {
        const item = document.createElement('div');
        item.className = 'ec-item';
        item.innerHTML = `
            <input type="text" class="ec-input" value="${el.textContent.trim()}">
            <button class="ec-delete-btn" title="Eliminar" onclick="eliminarItem(this)">
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
}

function eliminarItem(btn) {
    const item = btn.closest('.ec-item');
    if (item) {
        item.style.transition = 'opacity 0.2s, transform 0.2s';
        item.style.opacity    = '0';
        item.style.transform  = 'translateX(20px)';
        setTimeout(() => item.remove(), 200);
    }
}

function aplicarCambios() {
    const inputs = document.querySelectorAll('#ecListSub .ec-input');
    const lista  = document.getElementById('subcriteriosList');
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
// PERFIL
// ================================================
function initPerfil() {
    const modal    = document.getElementById('profileModal');
    const userIcon = document.getElementById('userIconBtn');
    const closeBtn = document.getElementById('closeProfileModal');

    userIcon.addEventListener('click', e => {
        e.stopPropagation();
        abrirModal('profileModal');
    });

    closeBtn.addEventListener('click', () => cerrarModal('profileModal'));

    window.addEventListener('click', e => {
        if (e.target === modal) cerrarModal('profileModal');
    });

    const btnEdit = document.getElementById('btnEditProfile');
    if (btnEdit) {
        btnEdit.addEventListener('click', function () {
            const inputs    = document.querySelectorAll('#profileModal .info-group input');
            const isEditing = this.textContent === 'Guardar Cambios';
            if (isEditing) {
                inputs.forEach(i => i.setAttribute('readonly', true));
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                showNotification('Perfil actualizado correctamente');
            } else {
                inputs.forEach(i => {
                    if (i.type !== 'email') {
                        i.removeAttribute('readonly');
                        i.style.backgroundColor = 'white';
                    }
                });
                this.textContent = 'Guardar Cambios';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            ['modalNuevoSubcriterio', 'modalEditarSubcriterios', 'modalGuardar', 'modalCancelar', 'profileModal']
                .forEach(id => {
                    const m = document.getElementById(id);
                    if (m && m.classList.contains('show')) cerrarModal(id);
                });
        }
    });
}

// ================================================
// UTILIDADES
// ================================================
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

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