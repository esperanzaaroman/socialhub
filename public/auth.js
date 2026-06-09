async function verificarAdmin() {

  const token =
    localStorage.getItem('token');

  // No token?
  if (!token) {

    window.location.href =
      'login.html';

    return;
  }

  try {

    const response = await fetch(
      'http://localhost:3000/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Invalid token?
    if (!response.ok) {

      localStorage.removeItem('token');

      window.location.href =
        'login.html';

      return;
    }

    const data =
      await response.json();

    // Not admin?
    if (data.role !== 'admin') {

      alert('Acceso denegado');

      window.location.href =
        'login.html';

      return;
    }

    console.log(
      'Admin autenticado'
    );

  } catch (error) {

    console.error(error);

    alert(
      'Error verificando sesión'
    );

  }

}



async function verificarLider() {

  const token =
    localStorage.getItem('token');

  // No token?
  if (!token) {

    window.location.href =
      'login.html';

    return;
  }

  try {

    const response = await fetch(
      'http://localhost:3000/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Invalid token?
    if (!response.ok) {

      localStorage.removeItem('token');

      window.location.href =
        'login.html';

      return;
    }

    const data =
      await response.json();

    // Not leader?
    if (data.role !== 'lider') {

      alert('Acceso denegado');

      window.location.href =
        'login.html';

      return;
    }

    console.log(
      'Lider autenticado'
    );

  } catch (error) {

    console.error(error);

    alert(
      'Error verificando sesión'
    );

  }

}

async function obtenerUsuarioActual() {

  const token =
    localStorage.getItem('token');

  if (!token) {

    return {
      role: 'publico'
    };

  }

  try {

    const response = await fetch(
      'http://localhost:3000/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {

      localStorage.removeItem('token');

      return {
        role: 'publico'
      };

    }

    const usuario =
      await response.json();

    return usuario;

  } catch (error) {

    console.error(error);

    return {
      role: 'publico'
    };

  }

}

function logout() {

  localStorage.removeItem('token');

  window.location.href = 'login.html';

}