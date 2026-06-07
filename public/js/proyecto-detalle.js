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

    if (rol === 'admin' || rol === 'lider') {

      if (actionBar) actionBar.style.display = 'flex';

      const label = document.getElementById('action-bar-label');
      const sub   = document.getElementById('action-bar-sub');

      if (rol === 'admin') {
        if (label) label.textContent = 'Vista de administrador';
        if (sub)   sub.textContent   = 'Puedes editar y supervisar este proyecto';
      }
      // lider: mantiene el texto por defecto del HTML

    } else {

      if (actionBar) actionBar.style.display = 'none';

    }

});