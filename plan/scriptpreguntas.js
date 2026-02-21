document.addEventListener('DOMContentLoaded', function () {
    // Leer nombre del subcriterio desde URL params
    const params = new URLSearchParams(window.location.search);
    const subcriterio = params.get('subcriterio');
    if (subcriterio) {
        document.getElementById('pageTitle').textContent =
            'PREGUNTAS - ' + decodeURIComponent(subcriterio).toUpperCase();
    }

    initAgregarPregunta();
    initPerfil();
});

// ================================================
// AGREGAR PREGUNTA
// ================================================
function initAgregarPregunta() {
    const modal    = document.getElementById('modalNuevaPregunta');
    const btnAbrir = document.getElementById('btnAgregarPregunta');
    const btnClose = document.getElementById('closeNuevaPregunta');
    const btnCrear = document.getElementById('btnCrearPregunta');
    const input    = document.getElementById('inputNuevaPregunta');

    btnAbrir.addEventListener('click', function () {
    window.location.href = 'agregarpregunta.html';
});

    btnClose.addEventListener('click', () => cerrarModal('modalNuevaPregunta'));

    btnCrear.addEventListener('click', function () {
        const texto = input ? input.value.trim() : '';
        if (!texto) {
            input.style.borderColor = '#E53E3E';
            input.focus();
            return;
        }
        input.style.borderColor = '';
        agregarPregunta(texto);
        cerrarModal('modalNuevaPregunta');
        showNotification('Pregunta agregada correctamente');
    });

    if (input) {
        input.addEventListener('input', () => { input.style.borderColor = ''; });
    }

    window.addEventListener('click', e => {
        if (e.target === modal) cerrarModal('modalNuevaPregunta');
    });
}

function agregarPregunta(texto) {
    const lista = document.getElementById('preguntasList');
    const item  = document.createElement('div');
    item.className = 'pregunta-item';
    item.innerHTML = `
        <span class="pregunta-nombre">${texto.toUpperCase()}</span>
        <svg class="pregunta-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;
    lista.appendChild(item);
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
            ['modalNuevaPregunta', 'profileModal'].forEach(id => {
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