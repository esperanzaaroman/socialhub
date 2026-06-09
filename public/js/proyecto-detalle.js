document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const usuario =
      await obtenerUsuarioActual();

    const rol =
      usuario.role || 'publico';

    const actionBar =
      document.getElementById('action-bar');

    await cargarNavbar('publico-proyectos');

    if (
      rol === 'admin' ||
      rol === 'lider'
    ) {

      if (actionBar) {

        actionBar.style.display =
          'flex';

      }

    }
    else {

      if (actionBar) {

        actionBar.style.display =
          'none';

      }

    }

});