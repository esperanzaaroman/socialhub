function crearAvatarNavbar(usuario) {

  if (usuario.foto_perfil) {
    return `
      <img
        src="/${usuario.foto_perfil}"
        alt="Foto de perfil"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:50%;
        "
      >
    `;
  }

  return usuario.username
    ? usuario.username.charAt(0).toUpperCase()
    : '?';

}



async function cargarNavbar(paginaActiva) {
  const usuario = await obtenerUsuarioActual();
  const rol = usuario.role || 'publico';


  const avatarContenido =
    crearAvatarNavbar(usuario);

  const inicial = usuario.username
    ? usuario.username.charAt(0).toUpperCase()
    : '?';

  const navLinks = document.getElementById('nav-links');
  const navRight = document.getElementById('nav-right');

  if (!navLinks || !navRight) return;

  if (rol === 'admin') {
    navLinks.innerHTML = `
      <a href="admin-dashboard.html" class="navbar-link ${paginaActiva === 'dashboard' ? 'active' : ''}">Dashboard</a>
      <a href="admin-proyectos.html" class="navbar-link ${paginaActiva === 'proyectos' ? 'active' : ''}">Proyectos</a>
      <a href="foro.html" class="navbar-link ${paginaActiva === 'foro' ? 'active' : ''}">Foro</a>
      <a href="publico-inicio.html" class="navbar-link ${paginaActiva === 'inicio' ? 'active' : ''}">Inicio público</a>
      <a href="publico-proyectos.html" class="navbar-link ${paginaActiva === 'publico-proyectos' ? 'active' : ''}">Proyectos públicos</a>
      <a href="lideres.html"
        class="navbar-link ${paginaActiva === 'lideres' ? 'active' : ''}">
        Líderes
      </a>
    `;

    navRight.innerHTML = `
      <span class="navbar-badge">Administrador</span>
      <a href="admin-perfil.html" class="navbar-avatar" style="background:var(--morado);">
        ${avatarContenido}
      </a>
    `;
  }

  else if (rol === 'lider') {
    navLinks.innerHTML = `
      <a href="lider-dashboard.html" class="navbar-link ${paginaActiva === 'dashboard' ? 'active' : ''}">Dashboard</a>
      <a href="lider-proyectos.html" class="navbar-link ${paginaActiva === 'proyectos' ? 'active' : ''}">Mis Proyectos</a>
      <a href="foro.html" class="navbar-link ${paginaActiva === 'foro' ? 'active' : ''}">Foro</a>
      <a href="publico-inicio.html" class="navbar-link ${paginaActiva === 'inicio' ? 'active' : ''}">Inicio público</a>
      <a href="publico-proyectos.html" class="navbar-link ${paginaActiva === 'publico-proyectos' ? 'active' : ''}">Proyectos públicos</a>
      <a href="lideres.html"
        class="navbar-link ${paginaActiva === 'lideres' ? 'active' : ''}">
        Líderes
      </a>
    `;

    navRight.innerHTML = `
      <span class="navbar-badge">Líder Social</span>
      <a href="lider-perfil.html" class="navbar-avatar">
        ${avatarContenido}
      </a>
    `;
  }

  else {
    navLinks.innerHTML = `
      <a href="publico-inicio.html" class="navbar-link ${paginaActiva === 'inicio' ? 'active' : ''}">Inicio</a>
      <a href="publico-proyectos.html" class="navbar-link ${paginaActiva === 'publico-proyectos' ? 'active' : ''}">Proyectos</a>
      <a href="foro.html" class="navbar-link ${paginaActiva === 'foro' ? 'active' : ''}">Foro</a>
      <a href="lideres.html" class="navbar-link ${paginaActiva === 'lideres' ? 'active' : ''}">Líderes</a>
    `;

    navRight.innerHTML = '';
  }
}