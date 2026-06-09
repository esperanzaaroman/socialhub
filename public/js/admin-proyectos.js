document.addEventListener('DOMContentLoaded', async function() {

  await verificarAdmin();


  const usuario = await obtenerUsuarioActual();


  await cargarNavbar('proyectos');

  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName && usuario.username) {
    welcomeName.textContent = usuario.username;
  }


  const welcomeRole = document.getElementById('welcome-role');
  if (welcomeRole && usuario.role) {

    welcomeRole.textContent = usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1);
  }
});