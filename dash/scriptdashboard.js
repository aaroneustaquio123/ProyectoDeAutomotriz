// Dashboard JavaScript

// Datos de ejemplo para el dashboard
const dashboardData = {
    stats: {
        totalAudits: 1200,
        inProgress: 1100,
        completed: 1500,
        avgCompliance: 82
    },
    topBrands: [
        { company: 'Empresa1', brand: 'Marca1', compliance: 95.88 },
        { company: 'Empresa2', brand: 'Marca3', compliance: 90.15 },
        { company: 'Empresa3', brand: 'Marca3', compliance: 85.76 }
    ],
    pendingAudits: [
        {
            company: 'Empresa1',
            brand: 'Marca1',
            location: 'Local1',
            date: '30/01/2026',
            evaluation: 'Evaluación1',
            type: 'Tipo de evaluación'
        },
        {
            company: 'Empresa1',
            brand: 'Marca1',
            location: 'Local1',
            date: '30/01/2026',
            evaluation: 'Evaluación1',
            type: 'Tipo de evaluación'
        }
    ],
    areaPerformance: {
        ventas: 47,
        servicios: 34,
        planchadoPintura: 19
    }
};

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeFilters();
    initializeChart();
    setupEventListeners();
    animateStats();
    updateProgressBars();
    initializeProfileModal();
});

// Configurar selectores de fecha
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('.date-field');
    
    dateInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
}

// Inicializar filtros
function initializeFilters() {
    const empresaSelect = document.getElementById('empresa');
    const marcaSelect = document.getElementById('marca');
    const concesionarioSelect = document.getElementById('concesionario');
    const localesSelect = document.getElementById('locales');

    // Agregar opciones de ejemplo
    const empresas = ['Empresa 1', 'Empresa 2', 'Empresa 3'];
    const marcas = ['Marca 1', 'Marca 2', 'Marca 3'];
    const concesionarios = ['Concesionario 1', 'Concesionario 2'];
    const locales = ['Local 1', 'Local 2', 'Local 3'];

    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa;
        option.textContent = empresa;
        empresaSelect.appendChild(option);
    });

    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    });

    concesionarios.forEach(concesionario => {
        const option = document.createElement('option');
        option.value = concesionario;
        option.textContent = concesionario;
        concesionarioSelect.appendChild(option);
    });

    locales.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        option.textContent = local;
        localesSelect.appendChild(option);
    });
}

// Crear el gráfico de dona
function initializeChart() {
    const canvas = document.getElementById('areaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('chartTooltip');
    
    // Configurar el tamaño del canvas
    canvas.width = 250;
    canvas.height = 250;
    
    const data = dashboardData.areaPerformance;
    const total = data.ventas + data.servicios + data.planchadoPintura;
    
    const colors = ['#1D3579', '#4F5E9E', '#48BED7'];
    const labels = ['Ventas', 'Servicios', 'Planchado&Pintura'];
    const values = [data.ventas, data.servicios, data.planchadoPintura];
    
    let currentAngle = -Math.PI / 2; // Empezar desde arriba
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const innerRadius = 60;
    
    // Array para almacenar información de los segmentos
    const segments = [];
    
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Guardar información del segmento
        segments.push({
            startAngle: currentAngle,
            endAngle: currentAngle + sliceAngle,
            color: colors[index],
            label: labels[index],
            value: value
        });
        
        // Dibujar el segmento SIN texto
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // Agregar evento de movimiento del mouse para mostrar tooltip
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Calcular ángulo y distancia desde el centro
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Verificar si está dentro del donut
        if (distance >= innerRadius && distance <= radius) {
            // Encontrar qué segmento está bajo el cursor
            let hoveredSegment = null;
            for (let segment of segments) {
                let normalizedAngle = angle;
                if (normalizedAngle < -Math.PI / 2) {
                    normalizedAngle += 2 * Math.PI;
                }
                
                if (normalizedAngle >= segment.startAngle && normalizedAngle <= segment.endAngle) {
                    hoveredSegment = segment;
                    break;
                }
            }
            
            if (hoveredSegment) {
                tooltip.textContent = `${hoveredSegment.label}: ${hoveredSegment.value}%`;
                tooltip.style.left = event.clientX - rect.left + 15 + 'px';
                tooltip.style.top = event.clientY - rect.top - 10 + 'px';
                tooltip.classList.add('visible');
                canvas.style.cursor = 'pointer';
            } else {
                tooltip.classList.remove('visible');
                canvas.style.cursor = 'default';
            }
        } else {
            tooltip.classList.remove('visible');
            canvas.style.cursor = 'default';
        }
    });
    
    // Ocultar tooltip cuando el mouse sale del canvas
    canvas.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
        canvas.style.cursor = 'default';
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de refresh
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
                refreshData();
            }, 300);
        });
    }

    // Botón de exportar
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }

    // Filtros
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Botones de auditorías pendientes
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('blue') ? 'ver detalles' : 'reportar';
            console.log('Acción:', action);
        });
    });
}

// Animar las estadísticas al cargar
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat) => {
        const finalText = stat.textContent;
        const hasPercent = finalText.includes('%');
        const target = parseInt(finalText);
        const duration = 2000; // 2 segundos
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (hasPercent ? '%' : '');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + (hasPercent ? '%' : '');
            }
        }, duration / steps);
    });
}

// Refrescar datos
function refreshData() {
    console.log('Refrescando datos...');
    
    // Simular actualización de datos
    setTimeout(() => {
        console.log('Datos actualizados');
        // Volver a dibujar el gráfico
        initializeChart();
    }, 500);
}

// Exportar datos
function exportData() {
    console.log('Exportando datos...');
    
    // Generar y descargar CSV
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'dashboard_export.csv');
}

// Generar contenido CSV
function generateCSV() {
    let csv = 'Métrica,Valor\n';
    csv += `Auditorías Totales,${dashboardData.stats.totalAudits}\n`;
    csv += `En Proceso,${dashboardData.stats.inProgress}\n`;
    csv += `Finalizadas,${dashboardData.stats.completed}\n`;
    csv += `Cumplimiento Promedio,${dashboardData.stats.avgCompliance}%\n`;
    csv += '\nTop 3 Marcas\n';
    csv += 'Empresa,Marca,Cumplimiento\n';
    
    dashboardData.topBrands.forEach(brand => {
        csv += `${brand.company},${brand.brand},${brand.compliance}%\n`;
    });
    
    return csv;
}

// Descargar archivo CSV
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Aplicar filtros
function applyFilters() {
    const empresa = document.getElementById('empresa').value;
    const marca = document.getElementById('marca').value;
    const concesionario = document.getElementById('concesionario').value;
    const locales = document.getElementById('locales').value;
    const desde = document.getElementById('desde').value;
    const hasta = document.getElementById('hasta').value;
    
    console.log('Filtros aplicados:', {
        empresa,
        marca,
        concesionario,
        locales,
        desde,
        hasta
    });
}

// Función para actualizar las barras de progreso de forma animada
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 200);
    });
}

// Llamar a la animación de barras cuando la página carga
window.addEventListener('load', function() {
    setTimeout(() => {
        updateProgressBars();
    }, 300);
});

// Función para formatear fechas
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para calcular días restantes
function getDaysRemaining(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Agregar tooltips informativos
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

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
                // Guardar cambios
                inputs.forEach(input => {
                    input.setAttribute('readonly', true);
                });
                this.textContent = 'Editar Perfil';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                
                // Aquí iría la lógica para guardar en el servidor
                console.log('Guardando cambios del perfil...');
                showNotification('Perfil actualizado correctamente');
            } else {
                // Habilitar edición
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
                // Aquí iría la lógica de logout
                showNotification('Cerrando sesión...');
                setTimeout(() => {
                    // Redirigir a login
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

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
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
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

console.log('Dashboard inicializado correctamente');