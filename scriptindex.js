document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');

    // 1. Lógica para ver/ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Intercambiar iconos
            eyeIcon.classList.toggle('hidden');
            eyeOffIcon.classList.toggle('hidden');
        });
    }

    // 2. Lógica del Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Detener el envío por defecto

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Credenciales exactas
            const USER_VAL = "instructor@summas.pe";
            const PASS_VAL = "12345678";

            if (email === USER_VAL && password === PASS_VAL) {
                // Si todo está bien, redirigir
                console.log("Acceso correcto");
                window.location.href = 'dash/dashboard.html';
            } else {
                // Si falla, avisar
                alert("Usuario o contraseña incorrectos.\n\nPrueba con:\nUser: instructor@summas.pe\nPass: 12345678");
            }
        });
    } else {
        console.error("No se encontró el formulario con ID 'loginForm'");
    }
});