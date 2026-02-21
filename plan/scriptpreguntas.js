document.addEventListener('DOMContentLoaded', function () {
    // Leer nombre del subcriterio desde URL params
    const params = new URLSearchParams(window.location.search);
    const subcriterio = params.get('subcriterio');
    if (subcriterio) {
        document.getElementById('pageTitle').textContent =
            'PREGUNTAS - ' + decodeURIComponent(subcriterio).toUpperCase();
    }

    cargarPreguntasGuardadas();
    aplicarEdicionSiHay();
    initAgregarPregunta();
    initPerfil();
});

// ================================================
// CARGAR PREGUNTAS DEL HISTORIAL
// ================================================
function cargarPreguntasGuardadas() {
    var historial  = JSON.parse(localStorage.getItem('historialPreguntas') || '[]');
    var nuevaTexto = localStorage.getItem('nuevaPregunta');

    historial.forEach(function (p, idx) {
        var esNueva = nuevaTexto && p.texto === nuevaTexto;
        renderPregunta(p.texto, idx, esNueva);
    });

    if (nuevaTexto) {
        localStorage.removeItem('nuevaPregunta');
        showNotification('Pregunta agregada correctamente');
    }
}

// ================================================
// APLICAR EDICIÓN AL VOLVER DE editarpregunta.html
// ================================================
function aplicarEdicionSiHay() {
    var editadaStr = localStorage.getItem('preguntaEditada');
    if (!editadaStr) return;

    var editada = JSON.parse(editadaStr);
    localStorage.removeItem('preguntaEditada');

    if (editada.index !== null && editada.index !== undefined) {
        // Era una pregunta del historial: actualizar el item ya renderizado
        var items = document.querySelectorAll('.pregunta-item[data-idx]');
        items.forEach(function (item) {
            if (parseInt(item.dataset.idx) === editada.index) {
                item.querySelector('.pregunta-nombre').textContent = editada.datos.texto.toUpperCase();
                // Animación flash para indicar que fue editada
                item.style.transition = 'background 0.4s';
                item.style.background = '#EEF1FB';
                setTimeout(function () { item.style.background = ''; }, 800);
            }
        });
    } else {
        // Era una pregunta fija del HTML: buscarla por texto original y actualizarla
        var todos = document.querySelectorAll('.pregunta-item');
        todos.forEach(function (item) {
            var span = item.querySelector('.pregunta-nombre');
            if (span && span.textContent === editada.textoOriginal.toUpperCase()) {
                span.textContent = editada.datos.texto.toUpperCase();
                item.style.transition = 'background 0.4s';
                item.style.background = '#EEF1FB';
                setTimeout(function () { item.style.background = ''; }, 800);
            }
        });
    }

    showNotification('Pregunta editada correctamente');
}

// ================================================
// RENDERIZAR PREGUNTA EN LA LISTA
// ================================================
function renderPregunta(texto, idx, animada) {
    const lista = document.getElementById('preguntasList');
    const item  = document.createElement('div');
    item.className    = 'pregunta-item';
    item.dataset.idx  = idx;   // índice en historialPreguntas
    item.style.cursor = 'pointer';
    item.innerHTML = `
        <span class="pregunta-nombre">${texto.toUpperCase()}</span>
        <svg class="pregunta-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;

    // Click -> editar
    item.addEventListener('click', function () {
        irAEditar(idx, texto);
    });

    if (animada) {
        item.style.opacity    = '0';
        item.style.transform  = 'translateY(-10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        lista.appendChild(item);
        requestAnimationFrame(function () {
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0)';
        });
    } else {
        lista.appendChild(item);
    }
}

// ================================================
// IR A EDITAR - guarda datos en localStorage y redirige
// ================================================
function irAEditar(idx, texto) {
    var historial = JSON.parse(localStorage.getItem('historialPreguntas') || '[]');
    var datos     = historial[idx] || { texto: texto };
    datos.index   = idx;

    localStorage.setItem('editandoPregunta', JSON.stringify(datos));
    window.location.href = 'editarpregunta.html';
}

// ================================================
// HACER CLICKEABLES LAS PREGUNTAS FIJAS DEL HTML
// ================================================
// Esto se ejecuta al cargar para que las preguntas hardcodeadas en el HTML también sean editables
document.addEventListener('DOMContentLoaded', function () {
    var itemsFijos = document.querySelectorAll('#preguntasList .pregunta-item:not([data-idx])');
    itemsFijos.forEach(function (item) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            var texto = item.querySelector('.pregunta-nombre').textContent;
            localStorage.setItem('editandoPregunta', JSON.stringify({
                texto:     texto,
                como:      '',
                peso:      '3',
                metrica:   'Rango',
                intervalos:[],
                index:     null
            }));
            window.location.href = 'editarpregunta.html';
        });
    });
});

// ================================================
// AGREGAR PREGUNTA
// ================================================
function initAgregarPregunta() {
    const btnAbrir = document.getElementById('btnAgregarPregunta');

    btnAbrir.addEventListener('click', function () {
        window.location.href = 'agregarpregunta.html';
    });

    window.addEventListener('click', e => {
        const modal = document.getElementById('modalNuevaPregunta');
        if (e.target === modal) cerrarModal('modalNuevaPregunta');
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
    `;
    document.body.appendChild(n);
    setTimeout(() => {
        setTimeout(() => { if (document.body.contains(n)) document.body.removeChild(n); }, 300);
    }, 3000);
}