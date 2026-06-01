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
        editBtn.style.display = 'inline-flex';
      }
    }
    else {
      if (editBtn) {
        editBtn.style.display = 'none';
      }
    }

    const nombre =
      document.getElementById('profile-name');

    const breadcrumbNombre =
      document.getElementById('breadcrumb-profile-name');

    const avatar =
      document.getElementById('profile-avatar');

    const profileRole =
      document.getElementById('profile-role');

    if (nombre && usuario.username) {
      nombre.textContent = usuario.username;
    }

    if (breadcrumbNombre && usuario.username) {
      breadcrumbNombre.textContent = usuario.username;
    }

    if (avatar && usuario.username) {
      avatar.textContent =
        usuario.username.charAt(0).toUpperCase();
    }

    if (profileRole) {
      if (rol === 'admin') {
        profileRole.textContent =
          '🛡️ Administrador del sistema';
      }
      else if (rol === 'lider') {
        profileRole.textContent =
          '🎓 Líder social';
      }
      else {
        profileRole.textContent =
          '🌍 Usuario público';
      }
    }

  }
);