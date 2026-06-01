document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const usuario =
      await obtenerUsuarioActual();

    const rol =
      usuario.role || 'publico';

    const editBtn =
      document.getElementById('edit-btn');

    await cargarNavbar('');

    if (rol === 'lider' || rol === 'admin') {

      if (editBtn) {
        editBtn.style.display =
          'inline-flex';
      }

    }
    else {

      if (editBtn) {
        editBtn.style.display =
          'none';
      }

    }

  }
);