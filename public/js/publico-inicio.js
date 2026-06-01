document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const usuario =
      await obtenerUsuarioActual();

    await cargarNavbar('inicio');

    const loginBtn =
      document.getElementById(
        'login-public-btn'
      );

    if (
      usuario.role === 'admin' ||
      usuario.role === 'lider'
    ) {

      loginBtn.style.display =
        'none';

    }

  }
);