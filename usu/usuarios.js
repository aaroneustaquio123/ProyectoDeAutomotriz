/* ================================================
   SUMMAS - Panel Usuarios
   Archivo: usuarios.js
   ================================================ */

// ── DATA ──────────────────────────────────────────
let usuarios = [
    { id: 1, nombre: 'Diego Mateo',  apellido: 'Guerrero Carranza', dni: '60784567', rol: 'Auditor',        correo: 'diegoMateo1@summas.pe', estado: 'Activo'   },
    { id: 2, nombre: 'Diego Mateo',  apellido: 'Guerrero Carranza', dni: '60784567', rol: 'Auditor',        correo: 'diegoMateo1@summas.pe', estado: 'Retirado' },
    { id: 3, nombre: 'Diego Mateo',  apellido: 'Guerrero Carranza', dni: '60784567', rol: 'Gerente(local)', correo: 'diegoMateo1@summas.pe', estado: 'Activo'   },
    { id: 4, nombre: 'Ana Torres',   apellido: 'Ríos Mendoza',      dni: '45678901', rol: 'Supervisor',     correo: 'ana.torres@summas.pe',  estado: 'Activo'   },
    { id: 5, nombre: 'Carlos Soto',  apellido: 'Vargas Lima',       dni: '32145678', rol: 'Administrador',  correo: 'c.soto@summas.pe',      estado: 'Retirado' },
];

let editId      = null;
let retirarId   = null; // ID del usuario a retirar (pendiente de confirmación)
let currentPage = 1;
const PER_PAGE  = 5;


// ── RENDER LISTA ──────────────────────────────────
function renderUsuarios() {
    const list     = document.getElementById('usuariosList');
    const filtered = filtrarUsuarios();
    const total    = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

    if (currentPage > total) currentPage = total;

    const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    list.innerHTML = '';

    if (slice.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#888;padding:50px 0;">No se encontraron usuarios.</p>';
    } else {
        slice.forEach(u => list.appendChild(crearCard(u)));
    }

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= total;
}


// ── CREAR CARD ────────────────────────────────────
function crearCard(u) {
    const card = document.createElement('div');
    card.className = 'usuario-card';

    const statusClass = u.estado === 'Activo' ? 'status-activo' : 'status-retirado';

    card.innerHTML = `
        <div class="user-info-col">
            <span class="col-label">Nombre</span>
            <span class="col-value">${u.nombre}</span>
        </div>
        <div class="user-info-col">
            <span class="col-label">Apellido</span>
            <span class="col-value">${u.apellido}</span>
        </div>
        <div class="user-info-col">
            <span class="col-label">DNI</span>
            <span class="col-value">${u.dni}</span>
        </div>
        <div class="user-info-col">
            <span class="col-label">Rol</span>
            <span class="col-value">${u.rol}</span>
        </div>
        <div class="user-info-col">
            <span class="col-label">Correo</span>
            <span class="col-value">${u.correo}</span>
        </div>
        <div class="user-info-col">
            <span class="status-badge ${statusClass}">${u.estado}</span>
        </div>
        <button class="btn-retirar" onclick="abrirModalRetirar(${u.id})">Retirar</button>
        <button class="btn-editar"  onclick="abrirModalEditar(${u.id})">Editar</button>
    `;

    return card;
}


// ── FILTRAR ───────────────────────────────────────
function filtrarUsuarios() {
    const estado = document.getElementById('filterEstado').value;
    if (estado === 'Activo' || estado === 'Retirado') {
        return usuarios.filter(u => u.estado === estado);
    }
    return [...usuarios];
}


// ── PAGINACIÓN ────────────────────────────────────
function cambiarPagina(dir) {
    currentPage += dir;
    renderUsuarios();
}


// ── MODAL AGREGAR USUARIO ─────────────────────────
function abrirModalNuevo() {
    document.getElementById('formUsuario').reset();
    document.getElementById('inputFotoNombre').value = '';
    abrirModal('usuarioModal');
}

function guardarUsuario(e) {
    e.preventDefault();

    const datos = {
        id:       Date.now(),
        nombre:   document.getElementById('inputNombre').value.trim(),
        apellido: document.getElementById('inputApellido').value.trim(),
        dni:      document.getElementById('inputDni').value.trim(),
        rol:      document.getElementById('inputRol').value,
        correo:   document.getElementById('inputCorreo').value.trim(),
        estado:   'Activo',
    };

    usuarios.push(datos);
    cerrarModal('usuarioModal');
    renderUsuarios();
    setTimeout(() => abrirModal('exitoModal'), 200);
}


// ── MODAL EDITAR USUARIO ──────────────────────────
function abrirModalEditar(id) {
    const u = usuarios.find(x => x.id === id);
    if (!u) return;

    editId = id;

    document.getElementById('editNombre').value    = u.nombre;
    document.getElementById('editApellido').value  = u.apellido;
    document.getElementById('editDni').value       = u.dni;
    document.getElementById('editRol').value       = u.rol;
    document.getElementById('editCorreo').value    = u.correo;
    document.getElementById('editEstado').value    = u.estado;
    document.getElementById('editFotoNombre').value = '';

    abrirModal('editarModal');
}

function guardarEdicion(e) {
    e.preventDefault();

    const idx = usuarios.findIndex(x => x.id === editId);
    if (idx === -1) return;

    usuarios[idx] = {
        ...usuarios[idx],
        nombre:   document.getElementById('editNombre').value.trim(),
        apellido: document.getElementById('editApellido').value.trim(),
        dni:      document.getElementById('editDni').value.trim(),
        rol:      document.getElementById('editRol').value,
        correo:   document.getElementById('editCorreo').value.trim(),
        estado:   document.getElementById('editEstado').value,
    };

    cerrarModal('editarModal');
    renderUsuarios();
    setTimeout(() => abrirModal('exitoModal'), 200);
}


// ── MODAL CONFIRMAR RETIRAR ───────────────────────
function abrirModalRetirar(id) {
    retirarId = id;
    abrirModal('retirarModal');
}

function confirmarRetiro() {
    const u = usuarios.find(x => x.id === retirarId);
    if (!u) return;

    u.estado = 'Retirado';
    retirarId = null;

    cerrarModal('retirarModal');
    renderUsuarios();
    setTimeout(() => abrirModal('exitoModal'), 200);
}


// ── FOTO ──────────────────────────────────────────
function mostrarNombreFoto(input) {
    const nombre = input.files[0] ? input.files[0].name : '';
    document.getElementById('inputFotoNombre').value = nombre;
}

function mostrarNombreFotoEditar(input) {
    const nombre = input.files[0] ? input.files[0].name : '';
    document.getElementById('editFotoNombre').value = nombre;
}


// ── EXPORTAR ──────────────────────────────────────
function exportar() {
    const csv = generarCSV(usuarios);
    descargarCSV(csv, 'usuarios_summas.csv');
}

function generarCSV(data) {
    const cabecera = ['Nombre', 'Apellido', 'DNI', 'Rol', 'Correo', 'Estado'];
    const filas = data.map(u =>
        [u.nombre, u.apellido, u.dni, u.rol, u.correo, u.estado]
            .map(v => `"${v}"`)
            .join(',')
    );
    return [cabecera.join(','), ...filas].join('\n');
}

function descargarCSV(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
}


// ── HELPERS MODALES ───────────────────────────────
function abrirModal(id) {
    document.getElementById(id).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Cerrar al hacer clic en el fondo oscuro
window.addEventListener('click', function (e) {
    ['usuarioModal', 'editarModal', 'retirarModal', 'exitoModal', 'profileModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (e.target === modal) cerrarModal(id);
    });
});


// ── FILTROS EN TIEMPO REAL ────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filterEstado').addEventListener('change', function () {
        currentPage = 1;
        renderUsuarios();
    });

    renderUsuarios();
});