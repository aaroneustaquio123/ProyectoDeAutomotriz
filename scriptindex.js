// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');
const eyeOffIcon = document.getElementById('eyeOffIcon');

togglePassword.addEventListener('click', function() {
    // Toggle password visibility
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon
    eyeIcon.classList.toggle('hidden');
    eyeOffIcon.classList.toggle('hidden');
});

// Form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', { email, password });
    
    // Aquí conectarías con tu backend
    alert('Funcionalidad de login - Conectar con backend para autenticación real');
    
    // Ejemplo de lo que harías en producción:
    /*
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
});