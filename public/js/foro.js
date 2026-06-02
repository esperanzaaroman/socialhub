document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const usuario =
      await obtenerUsuarioActual();



    const foroCurrentAvatar =
      document.getElementById('foro-current-avatar');

    if (foroCurrentAvatar) {

      if (usuario.foto_perfil) {

        foroCurrentAvatar.innerHTML =
          `<img
            src="http://localhost:3000/${usuario.foto_perfil}"
            alt="Foto de perfil"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              border-radius:50%;
            "
          >`;

      }
      else {

        foroCurrentAvatar.textContent =
          usuario.username
            ? usuario.username.charAt(0).toUpperCase()
            : '?';

      }

    }



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