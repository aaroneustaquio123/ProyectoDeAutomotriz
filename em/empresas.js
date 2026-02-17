/* ══════════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════════ */
let empresas = [
    { id: 1, nombre: 'Toyota Automotriz',  sector: 'Automotriz', locales: 5, auditorias: 12, contacto: 'Carlos Ríos',  activa: true  },
    { id: 2, nombre: 'Derco Automotriz',   sector: 'Automotriz', locales: 8, auditorias: 20, contacto: 'Ana Flores',   activa: true  },
    { id: 3, nombre: 'Inchcape Automotriz',sector: 'Automotriz', locales: 4, auditorias: 9,  contacto: 'Luis Paredes', activa: true  },
    { id: 4, nombre: 'Sum Vehículos',      sector: 'Automotriz', locales: 3, auditorias: 6,  contacto: 'Marta Salas',  activa: false },
];

let selected = null;

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function getInitials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function filterList(query) {
    const q = query.toLowerCase().trim();
    return q
        ? empresas.filter(e =>
            e.nombre.toLowerCase().includes(q) ||
            e.sector.toLowerCase().includes(q)
          )
        : empresas;
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

    // Card "Agregar empresa" al final
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
   MODAL — NUEVA EMPRESA
══════════════════════════════════════════════ */
function openNueva() {
    document.getElementById('modalNueva').classList.add('show');
}

function closeNueva() {
    document.getElementById('modalNueva').classList.remove('show');
}

document.getElementById('closeNueva').addEventListener('click', closeNueva);

document.getElementById('formNueva').addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Guardamos temporalmente los datos del paso 1
    window._tempEmpresa = {
        nombre: document.getElementById('inputNombre').value.trim(),
        sector: document.getElementById('inputSector').value,
    };
    closeNueva();
    // Abrir paso 2
    document.getElementById('modalEstructura').classList.add('show');
});

/* ── Modal Estructura (paso 2) ── */
document.getElementById('closeEstructura').addEventListener('click', () => {
    document.getElementById('modalEstructura').classList.remove('show');
});

document.getElementById('btnCrearEmpresa').addEventListener('click', () => {
    const seleccionado = document.querySelector('input[name="estructura"]:checked');
    if (!seleccionado) {
        // Resaltar si no eligió nada
        document.querySelectorAll('.radio-option').forEach(r => {
            r.style.borderColor = '#DC2626';
        });
        setTimeout(() => {
            document.querySelectorAll('.radio-option').forEach(r => {
                r.style.borderColor = '';
            });
        }, 1200);
        return;
    }

    const temp = window._tempEmpresa || {};
    empresas.push({
        id: Date.now(),
        nombre: temp.nombre || 'Nueva Empresa',
        sector: temp.sector || '—',
        estructura: seleccionado.value,
        locales: 0,
        auditorias: 0,
        contacto: '—',
        activa: true,
    });

    render(filterList(document.getElementById('searchInput').value));
    document.getElementById('modalEstructura').classList.remove('show');
    // Reset
    document.getElementById('formNueva').reset();
    document.querySelectorAll('input[name="estructura"]').forEach(r => r.checked = false);
    window._tempEmpresa = null;

    // Abrir paso 3
    document.getElementById('modalMarca').classList.add('show');
});

/* ── Modal Marca (paso 3) ── */
document.getElementById('closeMarca').addEventListener('click', () => {
    document.getElementById('modalMarca').classList.remove('show');
});

document.getElementById('btnAgregarMarca').addEventListener('click', () => {
    const marca = document.getElementById('inputMarca').value.trim();
    // Aquí puedes guardar la marca en la empresa recién creada si lo necesitas
    document.getElementById('inputMarca').value = '';
    document.getElementById('modalMarca').classList.remove('show');

    // Abrir paso 4
    document.getElementById('modalOperador').classList.add('show');
});

/* ── Modal Operador (paso 4) ── */
document.getElementById('closeOperador').addEventListener('click', () => {
    document.getElementById('modalOperador').classList.remove('show');
});

document.getElementById('btnAgregarOperador').addEventListener('click', () => {
    const operador = document.getElementById('inputOperador').value.trim();
    document.getElementById('inputOperador').value = '';
    document.getElementById('modalOperador').classList.remove('show');

    // Abrir paso 5
    document.getElementById('modalSede').classList.add('show');
});

/* ── Modal Sede (paso 5) ── */
document.getElementById('closeSede').addEventListener('click', () => {
    document.getElementById('modalSede').classList.remove('show');
});

// Toggle selección de área tags
document.getElementById('areaContainer').addEventListener('click', (e) => {
    const tag = e.target.closest('.area-tag');
    if (!tag || tag.id === 'btnAddArea') return;
    tag.classList.toggle('selected');
});

// Agregar nueva área inline
document.getElementById('btnAddArea').addEventListener('click', () => {
    const container = document.getElementById('areaContainer');
    const addBtn = document.getElementById('btnAddArea');

    // Evitar duplicar input
    if (container.querySelector('.area-input-inline')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'area-input-inline';
    input.placeholder = 'Nueva área';
    container.insertBefore(input, addBtn);
    input.focus();

    input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') confirmArea(input);
        if (ev.key === 'Escape') input.remove();
    });

    input.addEventListener('blur', () => {
        if (input.value.trim()) confirmArea(input);
        else input.remove();
    });

    function confirmArea(inp) {
        const val = inp.value.trim();
        if (val) {
            const newTag = document.createElement('span');
            newTag.className = 'area-tag selected';
            newTag.dataset.area = val;
            newTag.textContent = val;
            container.insertBefore(newTag, addBtn);
        }
        inp.remove();
    }
});

document.getElementById('btnCrearSede').addEventListener('click', () => {
    document.getElementById('inputConcesionario').value = '';
    document.getElementById('inputSede').value = '';
    document.getElementById('inputDireccion').value = '';
    // Reset tags
    document.querySelectorAll('.area-tag:not(.add-area-tag)').forEach(t => {
        if (['Ventas','Servicios','Seminuevo','Repuestos','P&P'].includes(t.dataset.area)) {
            t.classList.remove('selected');
        } else {
            t.remove(); // eliminar tags personalizados
        }
    });
    document.getElementById('modalSede').classList.remove('show');
});

/* ══════════════════════════════════════════════
   MODAL — DETALLE EMPRESA
══════════════════════════════════════════════ */
function openDetalle(e) {
    selected = e;

    document.getElementById('dAvatar').textContent     = getInitials(e.nombre);
    document.getElementById('dNombre').textContent     = e.nombre;
    document.getElementById('dSector').textContent     = e.sector;
    document.getElementById('dLocales').textContent    = e.locales;
    document.getElementById('dAuditorias').textContent = e.auditorias;
    document.getElementById('dContacto').textContent   = e.contacto;

    const est = document.getElementById('dEstado');
    est.textContent  = e.activa ? 'Activa' : 'Inactiva';
    est.style.color  = e.activa ? '#10B981' : '#DC2626';

    document.getElementById('modalDetalle').classList.add('show');
}

document.getElementById('closeDetalle').addEventListener('click', () => {
    document.getElementById('modalDetalle').classList.remove('show');
});

document.getElementById('btnEliminar').addEventListener('click', () => {
    if (!selected) return;
    empresas = empresas.filter(e => e.id !== selected.id);
    render(filterList(document.getElementById('searchInput').value));
    document.getElementById('modalDetalle').classList.remove('show');
});

/* ══════════════════════════════════════════════
   CERRAR MODALES AL CLICK FUERA
══════════════════════════════════════════════ */
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });
});

/* ══════════════════════════════════════════════
   BÚSQUEDA EN TIEMPO REAL
══════════════════════════════════════════════ */
document.getElementById('searchInput').addEventListener('input', (e) => {
    render(filterList(e.target.value));
});

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
render(empresas);