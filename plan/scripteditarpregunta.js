document.addEventListener('DOMContentLoaded', function () {
    poblarSelectsPct();
    cargarDatosPregunta();
    initMetrica();
    initIntervalos();
    initBotones();
    initPerfil();
});

// ================================================
// POBLAR SELECTS DE %
// ================================================
function poblarSelectsPct() {
    ['inputDesde', 'inputHasta'].forEach(function (id) {
        var sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '';
        for (var i = 0; i <= 100; i += 10) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i + '%';
            sel.appendChild(opt);
        }
    });
    var desde = document.getElementById('inputDesde');
    var hasta = document.getElementById('inputHasta');
    if (desde) desde.value = 10;
    if (hasta) hasta.value = 20;
}

// ================================================
// CARGAR DATOS DE LA PREGUNTA A EDITAR
// ================================================
function cargarDatosPregunta() {
    var editando = localStorage.getItem('editandoPregunta');
    if (!editando) return;

    var datos = JSON.parse(editando);

    var inputQ    = document.getElementById('inputQueEvaluar');
    var inputC    = document.getElementById('inputComoEvaluar');
    var inputPeso = document.getElementById('inputPeso');

    if (inputQ    && datos.texto) inputQ.value    = datos.texto;
    if (inputC    && datos.como)  inputC.value    = datos.como;
    if (inputPeso && datos.peso)  inputPeso.value = datos.peso;

    window._metricaInicial      = datos.metrica    || 'Rango';
    window._intervalosIniciales = datos.intervalos || [];
}

// ================================================
// METRICA
// ================================================
function initMetrica() {
    var btnRango            = document.getElementById('btnRango');
    var btnSino             = document.getElementById('btnSino');
    var dotRango            = document.getElementById('dotRango');
    var dotSino             = document.getElementById('dotSino');
    var intervalosRow       = document.getElementById('intervalosRow');
    var btnAgregarIntervalo = document.getElementById('btnAgregarIntervalo');

    function activarRango() {
        dotRango.style.background = '#1D3579';
        dotRango.style.border     = '2px solid #1D3579';
        dotSino.style.background  = 'transparent';
        dotSino.style.border      = '2px solid #ccc';
        btnAgregarIntervalo.style.display = 'flex';
        intervalosRow.style.display = intervalosRow.children.length > 0 ? 'flex' : 'none';
        window._metricaActiva = 'Rango';
    }

    function activarSino() {
        dotSino.style.background  = '#1D3579';
        dotSino.style.border      = '2px solid #1D3579';
        dotRango.style.background = 'transparent';
        dotRango.style.border     = '2px solid #ccc';
        btnAgregarIntervalo.style.display = 'none';
        intervalosRow.style.display       = 'none';
        window._metricaActiva = 'Sí / No';
    }

    btnRango.addEventListener('click', activarRango);
    btnSino.addEventListener('click', activarSino);

    if (window._metricaInicial === 'Sí / No') {
        activarSino();
    } else {
        activarRango();
    }

    // Restaurar intervalos guardados
    if (window._intervalosIniciales && window._intervalosIniciales.length > 0) {
        window._intervalosIniciales.forEach(function (txt) {
            agregarIntervaloTag(txt);
        });
        intervalosRow.style.display = 'flex';
    }
}

// ================================================
// INTERVALOS
// ================================================
var contadorIntervalos = 0;

function initIntervalos() {
    var modalIntervalo      = document.getElementById('modalIntervalo');
    var btnAgregarIntervalo = document.getElementById('btnAgregarIntervalo');
    var btnClose            = document.getElementById('closeIntervalo');
    var btnCrear            = document.getElementById('btnConfirmarIntervalo');

    btnAgregarIntervalo.addEventListener('click', function () {
        var label = document.getElementById('labelIntervalo');
        if (label) label.textContent = 'Intervalo ' + (contadorIntervalos + 1);
        var desde = document.getElementById('inputDesde');
        var hasta = document.getElementById('inputHasta');
        var valor = document.getElementById('inputValor');
        if (desde) desde.value = 10;
        if (hasta) hasta.value = 20;
        if (valor) valor.value = 3;
        abrirModal('modalIntervalo');
    });

    btnClose.addEventListener('click', function () { cerrarModal('modalIntervalo'); });

    btnCrear.addEventListener('click', function () {
        var desde = document.getElementById('inputDesde').value;
        var hasta = document.getElementById('inputHasta').value;
        var valor = document.getElementById('inputValor').value;
        agregarIntervaloTag(desde + '% - ' + hasta + '% = ' + valor);
        contadorIntervalos++;
        document.getElementById('intervalosRow').style.display = 'flex';
        cerrarModal('modalIntervalo');
    });

    window.addEventListener('click', function (e) {
        if (e.target === modalIntervalo) cerrarModal('modalIntervalo');
    });
}

function agregarIntervaloTag(texto) {
    var row = document.getElementById('intervalosRow');
    var tag = document.createElement('div');
    tag.className = 'intervalo-tag';
    tag.innerHTML =
        '<span>' + texto + '</span>' +
        '<button class="intervalo-delete" onclick="eliminarIntervalo(this)" title="Eliminar">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg></button>';
    row.appendChild(tag);
}

function eliminarIntervalo(btn) {
    var tag = btn.closest('.intervalo-tag');
    if (tag) {
        tag.style.transition = 'opacity 0.2s, transform 0.2s';
        tag.style.opacity    = '0';
        tag.style.transform  = 'scale(0.8)';
        setTimeout(function () {
            tag.remove();
            contadorIntervalos = Math.max(0, contadorIntervalos - 1);
            var row = document.getElementById('intervalosRow');
            if (row && row.children.length === 0) row.style.display = 'none';
        }, 200);
    }
}

function recogerIntervalos() {
    var tags = document.querySelectorAll('#intervalosRow .intervalo-tag span');
    return Array.from(tags).map(function (s) { return s.textContent; });
}

// ================================================
// BOTONES PRINCIPALES
// ================================================
function initBotones() {
    var btnGuardar  = document.getElementById('btnGuardarPregunta');
    var btnEliminar = document.getElementById('btnEliminarPregunta');
    var inputQ      = document.getElementById('inputQueEvaluar');

    // ---- ACTUALIZAR: abre modal de confirmación ----
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {
            var queEvaluar = inputQ ? inputQ.value.trim() : '';
            if (!queEvaluar) {
                if (inputQ) { inputQ.style.borderColor = '#E53E3E'; inputQ.focus(); }
                return;
            }
            if (inputQ) inputQ.style.borderColor = '';
            abrirModal('modalConfirmarActualizar');
        });
    }

    // ---- ELIMINAR: abre modal de confirmación ----
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function () {
            abrirModal('modalConfirmarEliminar');
        });
    }

    // ---- CONFIRMAR ACTUALIZAR: Sí ----
    document.getElementById('btnSiActualizar').addEventListener('click', function () {
        guardarCambios();
        cerrarModal('modalConfirmarActualizar');
        abrirModal('modalCompletado');
        setTimeout(function () { history.back(); }, 1500);
    });

    // ---- CONFIRMAR ACTUALIZAR: No ----
    document.getElementById('btnNoActualizar').addEventListener('click', function () {
        cerrarModal('modalConfirmarActualizar');
    });

    // ---- CONFIRMAR ELIMINAR: Sí ----
    document.getElementById('btnSiEliminar').addEventListener('click', function () {
        eliminarPregunta();
        cerrarModal('modalConfirmarEliminar');
        abrirModal('modalCompletado');
        setTimeout(function () { history.back(); }, 1500);
    });

    // ---- CONFIRMAR ELIMINAR: No ----
    document.getElementById('btnNoEliminar').addEventListener('click', function () {
        cerrarModal('modalConfirmarEliminar');
    });

    // ---- CERRAR MODAL COMPLETADO ----
    document.getElementById('closeCompletado').addEventListener('click', function () {
        cerrarModal('modalCompletado');
    });

    // ---- CERRAR CON X ----
    document.getElementById('closeConfirmarActualizar').addEventListener('click', function () {
        cerrarModal('modalConfirmarActualizar');
    });
    document.getElementById('closeConfirmarEliminar').addEventListener('click', function () {
        cerrarModal('modalConfirmarEliminar');
    });

    // ---- CERRAR AL CLICK FUERA ----
    window.addEventListener('click', function (e) {
        ['modalConfirmarActualizar', 'modalConfirmarEliminar', 'modalCompletado'].forEach(function (id) {
            var m = document.getElementById(id);
            if (e.target === m) cerrarModal(id);
        });
    });

    if (inputQ) {
        inputQ.addEventListener('input', function () { inputQ.style.borderColor = ''; });
    }
}

// ================================================
// GUARDAR CAMBIOS EN localStorage
// ================================================
function guardarCambios() {
    var inputQ    = document.getElementById('inputQueEvaluar');
    var queEvaluar = inputQ ? inputQ.value.trim() : '';

    var editando = JSON.parse(localStorage.getItem('editandoPregunta') || '{}');
    var idx      = editando.index;

    var preguntaActualizada = {
        texto:      queEvaluar,
        como:       document.getElementById('inputComoEvaluar').value.trim(),
        peso:       document.getElementById('inputPeso').value,
        metrica:    window._metricaActiva || 'Rango',
        intervalos: recogerIntervalos(),
        timestamp:  Date.now()
    };

    var historial = JSON.parse(localStorage.getItem('historialPreguntas') || '[]');

    if (idx !== undefined && idx !== null && historial[idx]) {
        historial[idx] = preguntaActualizada;
        localStorage.setItem('historialPreguntas', JSON.stringify(historial));
        localStorage.setItem('preguntaEditada', JSON.stringify({ index: idx, datos: preguntaActualizada }));
    } else {
        localStorage.setItem('preguntaEditada', JSON.stringify({
            index: null,
            datos: preguntaActualizada,
            textoOriginal: editando.texto
        }));
    }

    localStorage.removeItem('editandoPregunta');
}

// ================================================
// ELIMINAR PREGUNTA DEL localStorage
// ================================================
function eliminarPregunta() {
    var editando = JSON.parse(localStorage.getItem('editandoPregunta') || '{}');
    var idx      = editando.index;

    if (idx !== undefined && idx !== null) {
        var historial = JSON.parse(localStorage.getItem('historialPreguntas') || '[]');
        historial.splice(idx, 1);
        localStorage.setItem('historialPreguntas', JSON.stringify(historial));
        localStorage.setItem('preguntaEliminada', JSON.stringify({ index: idx }));
    } else {
        localStorage.setItem('preguntaEliminada', JSON.stringify({ textoOriginal: editando.texto }));
    }

    localStorage.removeItem('editandoPregunta');
}

// ================================================
// PERFIL
// ================================================
function initPerfil() {
    var modal    = document.getElementById('profileModal');
    var userIcon = document.getElementById('userIconBtn');
    var closeBtn = document.getElementById('closeProfileModal');

    userIcon.addEventListener('click', function (e) { e.stopPropagation(); abrirModal('profileModal'); });
    closeBtn.addEventListener('click', function () { cerrarModal('profileModal'); });
    window.addEventListener('click', function (e) { if (e.target === modal) cerrarModal('profileModal'); });

    var btnEdit = document.getElementById('btnEditProfile');
    if (btnEdit) {
        btnEdit.addEventListener('click', function () {
            var inputs    = document.querySelectorAll('#profileModal .info-group input');
            var isEditing = this.textContent === 'Guardar Cambios';
            if (isEditing) {
                inputs.forEach(function (i) { i.setAttribute('readonly', true); });
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
            } else {
                inputs.forEach(function (i) {
                    if (i.type !== 'email') { i.removeAttribute('readonly'); i.style.backgroundColor = 'white'; }
                });
                this.textContent = 'Guardar Cambios';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            ['modalIntervalo', 'modalConfirmarActualizar', 'modalConfirmarEliminar', 'modalCompletado', 'profileModal'].forEach(function (id) {
                var m = document.getElementById(id);
                if (m && m.classList.contains('show')) cerrarModal(id);
            });
        }
    });
}

// ================================================
// UTILIDADES
// ================================================
function abrirModal(id) {
    var m = document.getElementById(id);
    if (m) { m.classList.add('show'); document.body.style.overflow = 'hidden'; }
}

function cerrarModal(id) {
    var m = document.getElementById(id);
    if (m) { m.classList.remove('show'); document.body.style.overflow = 'auto'; }
}