
document.addEventListener(
  'DOMContentLoaded',
  async function() {
    console.log('entre a cargarInfo')
    await verificarLider();

    const usuario =
      await obtenerUsuarioActual();

    await cargarNavbar(
      'dashboard'
    );

    const welcomeName =
      document.getElementById('welcome-name');

    if (welcomeName && usuario.username) {

      welcomeName.textContent =
        `¡Hola, ${usuario.username}! 👋`;

    }
  }
);


