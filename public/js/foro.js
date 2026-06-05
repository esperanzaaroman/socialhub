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

    const projectSelect =
  document.getElementById(
    'post-project'
  );

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

  const token =
  localStorage.getItem(
    'token'
  );

if (
  token &&
  projectSelect
) {

  const response =
    await fetch(
      'http://localhost:3000/api/forum/projects',
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  const proyectos =
    await response.json();

  proyectos.forEach(
    function(proyecto) {

      projectSelect.innerHTML += `
        <option
          value="${proyecto.id_proyecto}"
        >
          ${proyecto.nombre}
        </option>
      `;

    }
  );

}

const publishBtn =
  document.getElementById('publish-post-btn');

const postText =
  document.getElementById('post-text');

if (publishBtn) {

  publishBtn.addEventListener(
    'click',
    async function() {

      const texto =
        postText.value.trim();

      const id_proyecto =
        projectSelect.value;

      if (!id_proyecto || !texto) {
        alert(
          'Selecciona un proyecto y escribe una publicación'
        );
        return;
      }

      const token =
        localStorage.getItem('token');

      const response =
        await fetch(
          'http://localhost:3000/api/forum/posts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              texto,
              id_proyecto
            })
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        alert('Publicación creada correctamente ✅');
        window.location.reload();
      }
      else {
        alert(
          data.mensaje ||
          'Error creando publicación'
        );
      }

    }
  );

}

});