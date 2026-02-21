/* ══════════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════════ */
let empresas = [
    { id: 1, nombre: 'Toyota Automotriz',   sector: 'Automotriz', locales: 5, auditorias: 12, contacto: 'Carlos Ríos',  activa: true,
      marcas: ['Toyota', 'Hino', 'Lexus'],
      concesionarios: ['Mitsui', 'Grupo Pana'],
      localesList: ['Mitsui - La Molina', 'Grupo Pana - Surco'] },
    { id: 2, nombre: 'Derco Automotriz',    sector: 'Automotriz', locales: 8, auditorias: 20, contacto: 'Ana Flores',   activa: true,
      marcas: ['Suzuki', 'Mazda', 'Kia'],
      concesionarios: ['Derco Center'],
      localesList: ['Derco - Surquillo', 'Derco - San Isidro'] },
    { id: 3, nombre: 'Inchcape Automotriz', sector: 'Automotriz', locales: 4, auditorias: 9,  contacto: 'Luis Paredes', activa: true,
      marcas: ['BMW', 'Mini'],
      concesionarios: ['Inchcape Peru'],
      localesList: ['Inchcape - Miraflores'] },
    { id: 4, nombre: 'Sum Vehículos',       sector: 'Automotriz', locales: 3, auditorias: 6,  contacto: 'Marta Salas',  activa: false,
      marcas: [],
      concesionarios: [],
      localesList: ['Sum - Callao'] },
];

let selected               = null;
let _marcaEditando         = null;
let _concesionarioEditando = null;
let _localEditando         = null;
let _marcasFlujo           = [];
let _operadoresFlujo       = [];

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function getInitials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function filterList(query) {
    const q = query.toLowerCase().trim();
    return q ? empresas.filter(e => e.nombre.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q)) : empresas;
}

/* ══════════════════════════════════════════════
   RENDER CARDS
══════════════════════════════════════════════ */
function render(list) {
    const grid = document.getElementById('empresasGrid');
    grid.innerHTML = '';

    list.forEach((e, i) => {
        const card = document.createElement('div');
        card.className = 'empresa-card';
        card.style.animationDelay = `${i * 0.06}s`;
        card.innerHTML = `
            <div class="empresa-avatar">${getInitials(e.nombre)}</div>
            <div>
                <div class="empresa-name">${e.nombre}</div>
                <div class="empresa-meta">${e.sector}</div>
            </div>
            <div class="empresa-footer">
                <div class="empresa-audits">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                         fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    ${e.auditorias}
                </div>
                <div class="empresa-dot ${e.activa ? '' : 'off'}" title="${e.activa ? 'Activa' : 'Inactiva'}"></div>
            </div>`;
        card.addEventListener('click', () => openDetalle(e));
        grid.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'empresa-card add-card';
    addCard.innerHTML = `
        <div class="add-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"
                 fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </div>
        <span class="add-label">Agregar Empresa</span>`;
    addCard.addEventListener('click', openNueva);
    grid.appendChild(addCard);
}

/* ══════════════════════════════════════════════
   VISTA DETALLE EMPRESA
══════════════════════════════════════════════ */
function openDetalle(e) {
    const fresco = empresas.find(emp => emp.id === e.id) || e;
    selected = fresco;

    document.getElementById('detalleTitulo').textContent = fresco.nombre;
    poblarTags('marcasContainer',         fresco.marcas         || [], 'marca');
    poblarTags('concesionariosContainer', fresco.concesionarios || [], 'concesionario');
    poblarTags('localesContainer',        fresco.localesList    || [], 'local');

    document.getElementById('vistaLista').style.display   = 'none';
    document.getElementById('vistaDetalle').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function poblarTags(containerId, items, tipo) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => container.appendChild(crearTag(item, tipo)));
}

function crearTag(texto, tipo) {
    const tag = document.createElement('span');
    tag.className = 'detalle-tag' + (tipo ? ' detalle-tag--editable' : '');
    tag.textContent = texto;
    if (tipo === 'marca')         tag.addEventListener('click', () => abrirEditarMarca(tag, texto));
    if (tipo === 'concesionario') tag.addEventListener('click', () => abrirEditarConcesionario(tag, texto));
    if (tipo === 'local')         tag.addEventListener('click', () => abrirEditarLocal(tag, texto));
    return tag;
}

document.getElementById('btnVolver').addEventListener('click', () => {
    document.getElementById('vistaDetalle').style.display = 'none';
    document.getElementById('vistaLista').style.display   = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function filterDetalleTags(containerId, query) {
    const q = query.toLowerCase().trim();
    document.getElementById(containerId).querySelectorAll('.detalle-tag').forEach(t => {
        t.style.display = (q === '' || t.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
}

function agregarTagDetalle(containerId) {
    if      (containerId === 'marcasContainer')         abrirModalAgregarMarca();
    else if (containerId === 'concesionariosContainer') abrirModalConcesionario();
    else if (containerId === 'localesContainer')        abrirModalLocal();
}

/* ══════════════════════════════════════════════
   MODAL EDITAR MARCA
══════════════════════════════════════════════ */
function abrirEditarMarca(tagEl, nombreActual) {
    _marcaEditando = { tagEl, nombreOriginal: nombreActual };
    document.getElementById('inputEditarMarca').value = nombreActual;
    document.getElementById('modalEditarMarca').classList.add('show');
}

document.getElementById('closeEditarMarca').addEventListener('click', () => {
    document.getElementById('modalEditarMarca').classList.remove('show');
    _marcaEditando = null;
});

document.getElementById('btnActualizarMarca').addEventListener('click', () => {
    const nuevoNombre = document.getElementById('inputEditarMarca').value.trim();
    if (!nuevoNombre || !_marcaEditando) return;
    const { tagEl, nombreOriginal } = _marcaEditando;
    if (selected) {
        const idx = selected.marcas.indexOf(nombreOriginal);
        if (idx !== -1) selected.marcas[idx] = nuevoNombre;
    }
    tagEl.textContent = nuevoNombre;
    tagEl.onclick = null;
    tagEl.addEventListener('click', () => abrirEditarMarca(tagEl, nuevoNombre));
    document.getElementById('modalEditarMarca').classList.remove('show');
    _marcaEditando = null;
    mostrarAccionCompletada();
});

document.getElementById('btnEliminarMarcaEditar').addEventListener('click', () => {
    document.getElementById('modalEditarMarca').classList.remove('show');
    document.getElementById('modalConfirmarEliminarMarca').classList.add('show');
});

document.getElementById('closeConfirmarEliminarMarca').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarMarca').classList.remove('show');
    _marcaEditando = null;
});

document.getElementById('btnNoEliminarMarca').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarMarca').classList.remove('show');
    _marcaEditando = null;
});

document.getElementById('btnSiEliminarMarca').addEventListener('click', () => {
    if (!_marcaEditando) return;
    const { tagEl, nombreOriginal } = _marcaEditando;
    if (selected) selected.marcas = selected.marcas.filter(m => m !== nombreOriginal);
    tagEl.remove();
    document.getElementById('modalConfirmarEliminarMarca').classList.remove('show');
    _marcaEditando = null;
    mostrarAccionCompletada();
});

/* ══════════════════════════════════════════════
   MODAL EDITAR CONCESIONARIO
══════════════════════════════════════════════ */
function abrirEditarConcesionario(tagEl, nombreActual) {
    _concesionarioEditando = { tagEl, nombreOriginal: nombreActual };
    document.getElementById('inputEditarConcesionario').value = nombreActual;
    const sel = document.getElementById('selectEditarMarcaConcesionario');
    sel.innerHTML = '<option value="" disabled selected>Seleccionar marca</option>';
    (selected?.marcas || []).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        sel.appendChild(opt);
    });
    document.getElementById('modalEditarConcesionario').classList.add('show');
}

document.getElementById('closeEditarConcesionario').addEventListener('click', () => {
    document.getElementById('modalEditarConcesionario').classList.remove('show');
    _concesionarioEditando = null;
});

document.getElementById('btnActualizarConcesionario').addEventListener('click', () => {
    const nuevoNombre = document.getElementById('inputEditarConcesionario').value.trim();
    if (!nuevoNombre || !_concesionarioEditando) return;
    const { tagEl, nombreOriginal } = _concesionarioEditando;
    if (selected) {
        const idx = selected.concesionarios.indexOf(nombreOriginal);
        if (idx !== -1) selected.concesionarios[idx] = nuevoNombre;
    }
    tagEl.textContent = nuevoNombre;
    tagEl.onclick = null;
    tagEl.addEventListener('click', () => abrirEditarConcesionario(tagEl, nuevoNombre));
    document.getElementById('modalEditarConcesionario').classList.remove('show');
    _concesionarioEditando = null;
    mostrarAccionCompletada();
});

document.getElementById('btnEliminarConcesionarioEditar').addEventListener('click', () => {
    document.getElementById('modalEditarConcesionario').classList.remove('show');
    document.getElementById('modalConfirmarEliminarConcesionario').classList.add('show');
});

document.getElementById('closeConfirmarEliminarConcesionario').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarConcesionario').classList.remove('show');
    _concesionarioEditando = null;
});

document.getElementById('btnNoEliminarConcesionario').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarConcesionario').classList.remove('show');
    _concesionarioEditando = null;
});

document.getElementById('btnSiEliminarConcesionario').addEventListener('click', () => {
    if (!_concesionarioEditando) return;
    const { tagEl, nombreOriginal } = _concesionarioEditando;
    if (selected) selected.concesionarios = selected.concesionarios.filter(c => c !== nombreOriginal);
    tagEl.remove();
    document.getElementById('modalConfirmarEliminarConcesionario').classList.remove('show');
    _concesionarioEditando = null;
    mostrarAccionCompletada();
});

/* ══════════════════════════════════════════════
   MODAL EDITAR LOCAL
══════════════════════════════════════════════ */
function abrirEditarLocal(tagEl, nombreActual) {
    _localEditando = { tagEl, nombreOriginal: nombreActual };

    const partes     = nombreActual.split(' - ');
    const nombre     = partes.length > 1 ? partes.slice(1).join(' - ') : partes[0];
    const concNombre = partes.length > 1 ? partes[0] : '';

    document.getElementById('inputEditarLocalNombre').value    = nombre;
    document.getElementById('inputEditarLocalDireccion').value = '';

    const selM = document.getElementById('selectEditarLocalMarca');
    selM.innerHTML = '<option value="" disabled selected>Seleccionar marca</option>';
    (selected?.marcas || []).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        selM.appendChild(opt);
    });

    const selC = document.getElementById('selectEditarLocalConcesionario');
    selC.innerHTML = '<option value="" disabled selected>Seleccionar concesionario</option>';
    (selected?.concesionarios || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        selC.appendChild(opt);
    });
    if (concNombre) selC.value = concNombre;

    resetOperacionesEditar();
    document.getElementById('modalEditarLocal').classList.add('show');
}

document.getElementById('closeEditarLocal').addEventListener('click', () => {
    document.getElementById('modalEditarLocal').classList.remove('show');
    _localEditando = null;
});

document.getElementById('btnActualizarLocal').addEventListener('click', () => {
    if (!_localEditando) return;
    const nombre        = document.getElementById('inputEditarLocalNombre').value.trim();
    const concesionario = document.getElementById('selectEditarLocalConcesionario').value;
    const nuevoLabel    = [concesionario, nombre].filter(Boolean).join(' - ') || nombre || 'Local';
    const { tagEl, nombreOriginal } = _localEditando;
    if (selected) {
        const idx = selected.localesList.indexOf(nombreOriginal);
        if (idx !== -1) selected.localesList[idx] = nuevoLabel;
    }
    tagEl.textContent = nuevoLabel;
    tagEl.onclick = null;
    tagEl.addEventListener('click', () => abrirEditarLocal(tagEl, nuevoLabel));
    document.getElementById('modalEditarLocal').classList.remove('show');
    _localEditando = null;
    mostrarAccionCompletada();
});

document.getElementById('btnEliminarLocalEditar').addEventListener('click', () => {
    document.getElementById('modalEditarLocal').classList.remove('show');
    document.getElementById('modalConfirmarEliminarLocal').classList.add('show');
});

document.getElementById('closeConfirmarEliminarLocal').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarLocal').classList.remove('show');
    _localEditando = null;
});

document.getElementById('btnNoEliminarLocal').addEventListener('click', () => {
    document.getElementById('modalConfirmarEliminarLocal').classList.remove('show');
    _localEditando = null;
});

document.getElementById('btnSiEliminarLocal').addEventListener('click', () => {
    if (!_localEditando) return;
    const { tagEl, nombreOriginal } = _localEditando;
    if (selected) {
        selected.localesList = selected.localesList.filter(l => l !== nombreOriginal);
        selected.locales = Math.max(0, (selected.locales || 1) - 1);
    }
    tagEl.remove();
    document.getElementById('modalConfirmarEliminarLocal').classList.remove('show');
    _localEditando = null;
    mostrarAccionCompletada();
});

/* ══════════════════════════════════════════════
   MODAL ACCIÓN COMPLETADA
══════════════════════════════════════════════ */
function mostrarAccionCompletada() {
    document.getElementById('modalAccionCompletada').classList.add('show');
}

document.getElementById('closeAccionCompletada').addEventListener('click', () => {
    document.getElementById('modalAccionCompletada').classList.remove('show');
});

/* ══════════════════════════════════════════════
   ABRIR MODALES DESDE DETALLE
══════════════════════════════════════════════ */
function abrirModalAgregarMarca() {
    document.getElementById('inputNuevaMarca').value = '';
    document.getElementById('modalAgregarMarca').classList.add('show');
}

function abrirModalConcesionario() {
    const sel = document.getElementById('selectMarcaConcesionario');
    sel.innerHTML = '<option value="" disabled selected>Seleccionar marca</option>';
    const marcasDisponibles = selected?.marcas?.length
        ? selected.marcas
        : [...new Set(empresas.flatMap(e => e.marcas || []))];
    marcasDisponibles.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        sel.appendChild(opt);
    });
    document.getElementById('inputNuevoConcesionario').value = '';
    document.getElementById('modalAgregarConcesionario').classList.add('show');
}

function abrirModalLocal() {
    const selM = document.getElementById('selectLocalMarca');
    selM.innerHTML = '<option value="" disabled selected>Seleccionar marca</option>';
    const marcasLocal = selected?.marcas?.length
        ? selected.marcas
        : [...new Set(empresas.flatMap(e => e.marcas || []))];
    marcasLocal.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        selM.appendChild(opt);
    });

    const selC = document.getElementById('selectLocalConcesionario');
    selC.innerHTML = '<option value="" disabled selected>Seleccionar concesionario</option>';
    (selected?.concesionarios || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        selC.appendChild(opt);
    });
    document.getElementById('inputLocalNombre').value    = '';
    document.getElementById('inputLocalDireccion').value = '';
    resetOperaciones();
    document.getElementById('modalAgregarLocal').classList.add('show');
}

/* ══════════════════════════════════════════════
   OPERACIONES — helpers para modales detalle
══════════════════════════════════════════════ */
function resetOperaciones() {
    const container = document.getElementById('operacionesContainer');
    container.innerHTML = '';
    container.appendChild(crearBtnAddOp('btnAddOp', container));
}

function resetOperacionesEditar() {
    const container = document.getElementById('operacionesEditarContainer');
    container.innerHTML = '';
    container.appendChild(crearBtnAddOp('btnAddOpEditar', container));
}

function crearBtnAddOp(id, container) {
    const addBtn = document.createElement('span');
    addBtn.className = 'op-add-btn';
    addBtn.id = id;
    addBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
             fill="none" stroke="#1D3579" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ingresar operación`;
    addBtn.addEventListener('click', () => handleAddOp(container, addBtn));
    return addBtn;
}

function handleAddOp(container, addBtn) {
    if (container.querySelector('.op-input-inline')) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'op-input-inline';
    input.placeholder = 'Nueva operación';
    container.insertBefore(input, addBtn);
    input.focus();

    function confirmOp() {
        const val = input.value.trim();
        if (val) {
            const tag = document.createElement('span');
            tag.className = 'op-tag';
            tag.dataset.op = val;
            tag.innerHTML = `${val} <button class="op-remove" onclick="removeOpTag(this)">×</button>`;
            container.insertBefore(tag, input);
        }
        if (input.parentNode) input.remove();
    }
    input.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); confirmOp(); }
        if (ev.key === 'Escape') input.remove();
    });
    input.addEventListener('blur', () => setTimeout(confirmOp, 100));
}

function removeOpTag(btn) { btn.closest('.op-tag').remove(); }

/* ══════════════════════════════════════════════
   OPERACIONES SEDE — nuevo diseño
══════════════════════════════════════════════ */
function resetOperacionesSede() {
    const container = document.getElementById('areaContainer2');
    container.innerHTML = '';
    container.appendChild(crearBtnAddOpSede(container));
}

function crearBtnAddOpSede(container) {
    const addBtn = document.createElement('span');
    addBtn.className = 'op-add-btn-sede';
    addBtn.innerHTML = `
        <span class="op-add-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                 fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </span>
        Ingresar operación`;
    addBtn.addEventListener('click', () => handleAddOpSede(container, addBtn));
    return addBtn;
}

function handleAddOpSede(container, addBtn) {
    if (container.querySelector('.op-input-sede')) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'op-input-sede';
    input.placeholder = 'Nueva operación';
    container.insertBefore(input, addBtn);
    input.focus();

    function confirmOp() {
        const val = input.value.trim();
        if (val) {
            const tag = document.createElement('span');
            tag.className = 'op-tag-sede';
            tag.dataset.op = val;
            tag.innerHTML = `${val} <button class="op-remove-sede" onclick="this.closest('.op-tag-sede').remove()">×</button>`;
            container.insertBefore(tag, input);
        }
        if (input.parentNode) input.remove();
    }
    input.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); confirmOp(); }
        if (ev.key === 'Escape') input.remove();
    });
    input.addEventListener('blur', () => setTimeout(confirmOp, 120));
}

/* ══════════════════════════════════════════════
   HELPER: agregar tag al contenedor detalle
══════════════════════════════════════════════ */
function addDetalleTag(containerId, texto, tipo) {
    document.getElementById(containerId).appendChild(crearTag(texto, tipo));
}

/* ══════════════════════════════════════════════
   MODAL AGREGAR MARCA (desde detalle)
══════════════════════════════════════════════ */
document.getElementById('closeAgregarMarca').addEventListener('click', () => {
    document.getElementById('modalAgregarMarca').classList.remove('show');
});

document.getElementById('btnCrearMarca').addEventListener('click', () => {
    const val = document.getElementById('inputNuevaMarca').value.trim();
    if (!val) return;
    if (selected) {
        selected.marcas = selected.marcas || [];
        selected.marcas.push(val);
    }
    addDetalleTag('marcasContainer', val, 'marca');
    document.getElementById('modalAgregarMarca').classList.remove('show');
    abrirModalConcesionario();
});

/* ══════════════════════════════════════════════
   MODAL AGREGAR CONCESIONARIO (desde detalle)
══════════════════════════════════════════════ */
document.getElementById('closeAgregarConcesionario').addEventListener('click', () => {
    document.getElementById('modalAgregarConcesionario').classList.remove('show');
});

document.getElementById('btnCrearConcesionario').addEventListener('click', () => {
    const val = document.getElementById('inputNuevoConcesionario').value.trim();
    if (!val) return;
    if (selected) {
        selected.concesionarios = selected.concesionarios || [];
        selected.concesionarios.push(val);
    }
    addDetalleTag('concesionariosContainer', val, 'concesionario');
    document.getElementById('modalAgregarConcesionario').classList.remove('show');
    abrirModalLocal();
});

/* ══════════════════════════════════════════════
   MODAL AGREGAR LOCAL (desde detalle)
══════════════════════════════════════════════ */
document.getElementById('closeAgregarLocal').addEventListener('click', () => {
    document.getElementById('modalAgregarLocal').classList.remove('show');
});

document.getElementById('btnCrearLocal').addEventListener('click', () => {
    const nombre        = document.getElementById('inputLocalNombre').value.trim();
    const concesionario = document.getElementById('selectLocalConcesionario').value;
    const label         = [concesionario, nombre].filter(Boolean).join(' - ') || nombre || 'Local';
    if (selected) {
        selected.localesList = selected.localesList || [];
        selected.localesList.push(label);
        selected.locales = (selected.locales || 0) + 1;
    }
    addDetalleTag('localesContainer', label, 'local');
    document.getElementById('modalAgregarLocal').classList.remove('show');
});

/* ══════════════════════════════════════════════
   MODAL NUEVA EMPRESA (paso 1)
══════════════════════════════════════════════ */
function openNueva()  { document.getElementById('modalNueva').classList.add('show'); }
function closeNueva() { document.getElementById('modalNueva').classList.remove('show'); }

document.getElementById('closeNueva').addEventListener('click', closeNueva);

document.getElementById('formNueva').addEventListener('submit', (ev) => {
    ev.preventDefault();
    window._tempEmpresa = {
        nombre: document.getElementById('inputNombre').value.trim(),
        sector: document.getElementById('inputSector').value,
    };
    closeNueva();
    document.getElementById('modalEstructura').classList.add('show');
});

/* ── Paso 2: Estructura ── */
document.getElementById('closeEstructura').addEventListener('click', () => {
    document.getElementById('modalEstructura').classList.remove('show');
});

document.getElementById('btnCrearEmpresa').addEventListener('click', () => {
    const seleccionado = document.querySelector('input[name="estructura"]:checked');
    if (!seleccionado) {
        document.querySelectorAll('.radio-option').forEach(r => r.style.borderColor = '#DC2626');
        setTimeout(() => document.querySelectorAll('.radio-option').forEach(r => r.style.borderColor = ''), 1200);
        return;
    }

    const temp = window._tempEmpresa || {};
    const nuevaEmpresa = {
        id: Date.now(),
        nombre: temp.nombre || 'Nueva Empresa',
        sector: temp.sector || '—',
        estructura: seleccionado.value,
        locales: 0, auditorias: 0, contacto: '—', activa: true,
        marcas: [], concesionarios: [], localesList: [],
    };
    empresas.push(nuevaEmpresa);
    render(filterList(document.getElementById('searchInput').value));

    document.getElementById('modalEstructura').classList.remove('show');
    document.getElementById('formNueva').reset();
    document.querySelectorAll('input[name="estructura"]').forEach(r => r.checked = false);
    window._tempEmpresa = null;

    if (seleccionado.value === 'solo_locales') {
        resetModalSede();
        document.getElementById('modalSede').classList.add('show');
    } else if (seleccionado.value === 'operadores') {
        abrirModalOperador();
    } else {
        _marcasFlujo = [];
        document.getElementById('inputMarca').value = '';
        document.getElementById('marcasFlujoContainer').style.display = 'none';
        document.getElementById('marcasFlujoTags').innerHTML = '';
        document.getElementById('btnContinuarMarcas').style.display = 'none';
        document.getElementById('modalMarca').classList.add('show');
    }
});

/* ── Paso 3: Agregar Marcas ── */
document.getElementById('closeMarca').addEventListener('click', () => {
    document.getElementById('modalMarca').classList.remove('show');
});

document.getElementById('inputMarca').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); agregarMarcaFlujo(); }
});

document.getElementById('btnAgregarMarca').addEventListener('click', agregarMarcaFlujo);

function agregarMarcaFlujo() {
    const val = document.getElementById('inputMarca').value.trim();
    if (!val) return;
    _marcasFlujo.push(val);
    document.getElementById('inputMarca').value = '';
    renderMarcasFlujo();
    document.getElementById('marcasFlujoContainer').style.display = 'flex';
    document.getElementById('btnContinuarMarcas').style.display = 'inline-block';
}

function renderMarcasFlujo() {
    const container = document.getElementById('marcasFlujoTags');
    container.innerHTML = '';
    _marcasFlujo.forEach((m, i) => {
        const tag = document.createElement('span');
        tag.className = 'local-creado-tag';
        tag.innerHTML = `${m} <button class="local-creado-remove" onclick="removeMarcaFlujo(${i})">×</button>`;
        container.appendChild(tag);
    });
}

function removeMarcaFlujo(i) {
    _marcasFlujo.splice(i, 1);
    renderMarcasFlujo();
    if (!_marcasFlujo.length) {
        document.getElementById('marcasFlujoContainer').style.display = 'none';
        document.getElementById('btnContinuarMarcas').style.display = 'none';
    }
}

document.getElementById('btnContinuarMarcas').addEventListener('click', () => {
    const ultimaEmpresa = empresas[empresas.length - 1];

    if (ultimaEmpresa) {
        ultimaEmpresa.marcas = [..._marcasFlujo];
        render(filterList(document.getElementById('searchInput').value));
    }

    _marcasFlujo = [];
    document.getElementById('marcasFlujoContainer').style.display = 'none';
    document.getElementById('btnContinuarMarcas').style.display = 'none';
    document.getElementById('modalMarca').classList.remove('show');

    if (ultimaEmpresa?.estructura === 'marcas_operadores') {
        abrirModalOperador();
    } else {
        resetModalSede();
        document.getElementById('modalSede').classList.add('show');
    }
});

/* ── Paso 4: Agregar Concesionarios ── */
document.getElementById('closeOperador').addEventListener('click', () => {
    document.getElementById('modalOperador').classList.remove('show');
});

function abrirModalOperador() {
    _operadoresFlujo = [];
    document.getElementById('inputOperador').value = '';
    document.getElementById('operadoresFlujoContainer').style.display = 'none';
    document.getElementById('operadoresFlujoTags').innerHTML = '';
    document.getElementById('btnContinuarOperadores').style.display = 'none';

    const sel = document.getElementById('selectOperadorMarca');
    sel.innerHTML = '<option value="" disabled selected>Seleccionar marca</option>';

    const ultimaEmpresa = empresas[empresas.length - 1];
    const todasLasMarcas = [...new Set(empresas.flatMap(e => e.marcas || []))];
    const marcasDisponibles = ultimaEmpresa?.marcas?.length
        ? ultimaEmpresa.marcas
        : todasLasMarcas;

    marcasDisponibles.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        sel.appendChild(opt);
    });

    document.getElementById('modalOperador').classList.add('show');
}

document.getElementById('btnAgregarOperador').addEventListener('click', () => {
    const val = document.getElementById('inputOperador').value.trim();
    if (!val) return;
    _operadoresFlujo.push(val);
    document.getElementById('inputOperador').value = '';
    renderOperadoresFlujo();
    document.getElementById('operadoresFlujoContainer').style.display = 'flex';
    document.getElementById('btnContinuarOperadores').style.display = 'inline-block';
});

function renderOperadoresFlujo() {
    const container = document.getElementById('operadoresFlujoTags');
    container.innerHTML = '';
    _operadoresFlujo.forEach((op, i) => {
        const tag = document.createElement('span');
        tag.className = 'local-creado-tag';
        tag.innerHTML = `${op} <button class="local-creado-remove" onclick="removeOperadorFlujo(${i})">×</button>`;
        container.appendChild(tag);
    });
}

function removeOperadorFlujo(i) {
    _operadoresFlujo.splice(i, 1);
    renderOperadoresFlujo();
    if (!_operadoresFlujo.length) {
        document.getElementById('operadoresFlujoContainer').style.display = 'none';
        document.getElementById('btnContinuarOperadores').style.display = 'none';
    }
}

document.getElementById('btnContinuarOperadores').addEventListener('click', () => {
    const ultimaEmpresa = empresas[empresas.length - 1];

    if (ultimaEmpresa) {
        ultimaEmpresa.concesionarios = [..._operadoresFlujo];
        render(filterList(document.getElementById('searchInput').value));
    }

    _operadoresFlujo = [];
    document.getElementById('modalOperador').classList.remove('show');

    resetModalSede();
    document.getElementById('modalSede').classList.add('show');
});

/* ── Paso 5: Nuevo Local ── */
document.getElementById('closeSede').addEventListener('click', () => {
    document.getElementById('modalSede').classList.remove('show');
    resetModalSede();
});

function resetModalSede() {
    document.getElementById('inputSede').value      = '';
    document.getElementById('inputDireccion').value = '';
    const localesCont = document.getElementById('localesCreadosContainer');
    const localesTags = document.getElementById('localesCreadosTags');
    const btnFin      = document.getElementById('btnFinalizarCreacion');
    if (localesCont) localesCont.style.display = 'none';
    if (localesTags) localesTags.innerHTML     = '';
    if (btnFin)      btnFin.style.display      = 'none';
    resetOperacionesSede();
}

document.getElementById('btnCrearSede').addEventListener('click', () => {
    const nombre = document.getElementById('inputSede').value.trim();
    if (!nombre) return;

    const tagsContainer = document.getElementById('localesCreadosTags');
    const tag = document.createElement('span');
    tag.className = 'local-creado-tag';
    tag.innerHTML = `${nombre} <button class="local-creado-remove" onclick="removeLocalCreadoTag(this)">×</button>`;
    tagsContainer.appendChild(tag);

    document.getElementById('localesCreadosContainer').style.display = 'block';
    document.getElementById('btnFinalizarCreacion').style.display    = 'inline-block';

    document.getElementById('inputSede').value      = '';
    document.getElementById('inputDireccion').value = '';
    resetOperacionesSede();
});

function removeLocalCreadoTag(btn) {
    btn.closest('.local-creado-tag').remove();
    const tagsContainer = document.getElementById('localesCreadosTags');
    if (!tagsContainer.children.length) {
        document.getElementById('localesCreadosContainer').style.display = 'none';
        document.getElementById('btnFinalizarCreacion').style.display    = 'none';
    }
}

document.getElementById('btnFinalizarCreacion').addEventListener('click', () => {
    // 1. Leer tags y guardar datos en la empresa
    const tags = document.querySelectorAll('#localesCreadosTags .local-creado-tag');
    const nombres = Array.from(tags).map(t => t.childNodes[0].textContent.trim());

    const ultimaEmpresa = empresas[empresas.length - 1];
    if (ultimaEmpresa && nombres.length) {
        ultimaEmpresa.localesList = nombres;
        ultimaEmpresa.locales = nombres.length;
    }

    // 2. Cerrar modal y resetear
    document.getElementById('modalSede').classList.remove('show');
    resetModalSede();

    // 3. Re-renderizar lista de empresas
    render(filterList(document.getElementById('searchInput').value));

    // 4. Solo mostrar modal de acción completada (sin redirigir al detalle)
    mostrarAccionCompletada();
});

/* ══════════════════════════════════════════════
   CERRAR MODALES AL CLICK FUERA
══════════════════════════════════════════════ */
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target !== modal) return;
        modal.classList.remove('show');
        if (['modalEditarMarca','modalConfirmarEliminarMarca'].includes(modal.id))                 _marcaEditando         = null;
        if (['modalEditarConcesionario','modalConfirmarEliminarConcesionario'].includes(modal.id)) _concesionarioEditando = null;
        if (['modalEditarLocal','modalConfirmarEliminarLocal'].includes(modal.id))                 _localEditando         = null;
        if (modal.id === 'modalSede') resetModalSede();
    });
});

/* ══════════════════════════════════════════════
   BÚSQUEDA EN TIEMPO REAL
══════════════════════════════════════════════ */
document.getElementById('searchInput').addEventListener('input', (e) => render(filterList(e.target.value)));

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
(function init() {
    render(empresas);
    resetOperaciones();
    resetOperacionesEditar();
    resetOperacionesSede();
})();