const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  const correo =
    document.getElementById('correo').value;
  const contrasena =
    document.getElementById('contrasena').value;

  try {

    if (!correo || !contrasena) {

    alert(
        'Pon tu correo y contraseña primero'
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

      alert(data.mensaje);

    }

  } catch (error) {

    console.error(error);

    alert('Error conectando con servidor');

  }

});