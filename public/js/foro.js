document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const usuario =
      await obtenerUsuarioActual();

    const rol =
      usuario.role || 'publico';

    const newPostCard =
      document.getElementById('new-post-card');

    await cargarNavbar('foro');

    if (
      rol === 'admin' ||
      rol === 'lider'
    ) {

      newPostCard.style.display =
        'block';

    }
    else {

      newPostCard.style.display =
        'none';

    }

});