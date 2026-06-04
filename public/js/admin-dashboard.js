document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarAdmin();

    const usuario =
      await obtenerUsuarioActual();

    await cargarNavbar(
      'dashboard'
    );

    const welcomeName =
      document.getElementById(
        'welcome-name'
      );

    if (welcomeName && usuario.username) {

      welcomeName.textContent =
        usuario.username;

    }

  }
);