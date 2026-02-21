document.addEventListener('DOMContentLoaded', function () {
    poblarSelectsPct();
    initMetrica();
    initIntervalos();
    initBotones();
    initPerfil();
});

// ================================================
// POBLAR SELECTS DE % (0%, 10%, ... 100%)
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
// METRICA - Controla qué filas/elementos se ven
// ================================================
function initMetrica() {
    var selectMetrica       = document.getElementById('selectMetrica');
    var intervalosRow       = document.getElementById('intervalosRow');
    var btnAgregarIntervalo = document.getElementById('btnAgregarIntervalo');
    var filaSino            = document.getElementById('filaSino');

    function actualizarVista() {
        var valor = selectMetrica.value;

        if (valor === 'rango') {
            // Rango: mostrar intervalos (si los hay) + botón agregar, ocultar fila Sí/No
            btnAgregarIntervalo.style.display = 'flex';
            filaSino.style.display            = 'none';
            // Mostrar fila de intervalos solo si tiene hijos
            intervalosRow.style.display = intervalosRow.children.length > 0 ? 'flex' : 'none';
        } else if (valor === 'sino') {
            // Sí/No: mostrar fila Sí/No, ocultar rango
            btnAgregarIntervalo.style.display = 'none';
            intervalosRow.style.display       = 'none';
            filaSino.style.display            = 'flex';
        } else {
            // Otro: ocultar todo
            btnAgregarIntervalo.style.display = 'none';
            intervalosRow.style.display       = 'none';
            filaSino.style.display            = 'none';
        }
    }

    selectMetrica.addEventListener('change', actualizarVista);

    // Al cargar: Rango por defecto → mostrar botón, ocultar Sí/No, ocultar intervalos (vacíos)
    actualizarVista();
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

    var modalCompletado  = document.getElementById('modalCompletado');
    var btnCloseCompletado = document.getElementById('closeCompletado');

    // Abrir modal intervalo
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

    // Crear intervalo
    btnCrear.addEventListener('click', function () {
        var desde = document.getElementById('inputDesde').value;
        var hasta = document.getElementById('inputHasta').value;
        var valor = document.getElementById('inputValor').value;

        agregarIntervaloTag(desde + '% - ' + hasta + '% = ' + valor);
        contadorIntervalos++;

        // Mostrar fila de intervalos
        var row = document.getElementById('intervalosRow');
        row.style.display = 'flex';

        cerrarModal('modalIntervalo');
        abrirModal('modalCompletado');
    });

    // Cerrar modal completado
    btnCloseCompletado.addEventListener('click', function () { cerrarModal('modalCompletado'); });

    window.addEventListener('click', function (e) {
        if (e.target === modalIntervalo)  cerrarModal('modalIntervalo');
        if (e.target === modalCompletado) cerrarModal('modalCompletado');
    });

    // ===== MANEJO PARA SÍ/NO =====
    var btnAgregarSino = document.getElementById('btnAgregarSino');
    if (btnAgregarSino) {
        btnAgregarSino.addEventListener('click', function() {
            var filaSino = document.getElementById('filaSino');
            var opcionesContainer = document.getElementById('opcionesRow');
            
            // Agregar opciones Sí y No
            agregarOpcionSino('Sí');
            agregarOpcionSino('No');
            
            // Mostrar el contenedor de opciones
            opcionesContainer.style.display = 'flex';
            
            // Ocultar el botón después de agregarlo
            btnAgregarSino.style.display = 'none';
            abrirModal('modalCompletado');
        });
    }
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

function agregarOpcionSino(texto) {
    var row = document.getElementById('opcionesRow');
    // Verificar si ya existe la opción
    var existe = Array.from(row.children).some(function(tag) {
        return tag.textContent.includes(texto);
    });
    
    if (!existe) {
        var tag = document.createElement('div');
        tag.className = 'intervalo-tag';
        tag.innerHTML = 
            '<span>' + texto + ' = 5 puntos</span>' +
            '<button class="intervalo-delete" onclick="eliminarOpcionSino(this)" title="Eliminar">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
            '</svg></button>';
        row.appendChild(tag);
    }
}

function eliminarOpcionSino(btn) {
    var tag = btn.closest('.intervalo-tag');
    if (tag) {
        tag.style.transition = 'opacity 0.2s, transform 0.2s';
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(function() {
            tag.remove();
            var row = document.getElementById('opcionesRow');
            var btnAgregarSino = document.getElementById('btnAgregarSino');
            // Si quedan 0 opciones, mostrar botón de nuevo
            if (row && row.children.length === 0) {
                if (btnAgregarSino) btnAgregarSino.style.display = 'flex';
                row.style.display = 'none';
            }
        }, 200);
    }
}

// ================================================
// BOTONES PRINCIPALES
// ================================================
function initBotones() {
    var btnCancelar = document.getElementById('btnCancelar');
    var btnCrear    = document.getElementById('btnCrearPregunta');
    var inputQ      = document.getElementById('inputQueEvaluar');

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () { history.back(); });
    }

    if (btnCrear) {
        btnCrear.addEventListener('click', function () {
            var queEvaluar = inputQ ? inputQ.value.trim() : '';
            if (!queEvaluar) {
                if (inputQ) { inputQ.style.borderColor = '#E53E3E'; inputQ.focus(); }
                return;
            }
            if (inputQ) inputQ.style.borderColor = '';
            abrirModal('modalCompletado');
        });
    }

    if (inputQ) {
        inputQ.addEventListener('input', function () { inputQ.style.borderColor = ''; });
    }
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
            ['modalIntervalo', 'modalCompletado', 'profileModal'].forEach(function (id) {
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