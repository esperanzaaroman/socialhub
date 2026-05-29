const loginBtn = document.getElementById('loginBtn');
const errorMensaje =
  document.getElementById('errorMensaje');

function mostrarError(mensaje) {

  errorMensaje.textContent = mensaje;

  errorMensaje.style.display = 'block';
}

loginBtn.addEventListener('click', async () => {
    errorMensaje.style.display = 'none';
    const correo =
        document.getElementById('correo').value;
    const contrasena =
        document.getElementById('contrasena').value;

  try {

    if (!correo || !contrasena) {

    mostrarError(
    'Asegurate de ingresar con tu correo y contraseña'
    );


    return;
    }
    if (!correo.includes('@')) {

    mostrarError(
        'Escribe un correo válido'
        );
    return;
    }

    const response = await fetch(
      'http://localhost:3000/api/auth/login',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          correo,
          contrasena
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem(
        'token',
        data.token
      );
      errorMensaje.style.display = 'none';

      alert('Login exitoso');


        if (data.role === 'admin') {

        window.location.href =
            'admin-dashboard.html';

        }
        else if (data.role === 'lider') {

        window.location.href =
            'lider-dashboard.html';

        }
        else {

        alert('Rol no válido');

        }
    

    } else {


      mostrarError(data.mensaje);

    }

  } catch (error) {

    console.error(error);

    alert('Error conectando con servidor');

  }

});