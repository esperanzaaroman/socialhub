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

    const profileCarrera =
      document.getElementById('profile-carrera');

    const profileCorreo =
      document.getElementById('profile-correo');

    const profileTelefono =
      document.getElementById('profile-telefono');

    const profileLinkedin =
      document.getElementById('profile-linkedin');

    const profileCvu =
      document.getElementById('profile-cvu');

    const saveProfileBtn =
      document.getElementById('save-profile-btn');

    let modoEdicion = false;

    if (nombre && usuario.username) {
      nombre.textContent = usuario.username;
    }

    if (breadcrumbNombre && usuario.username) {
      breadcrumbNombre.textContent = usuario.username;
    }
    
    if (avatar) {
      avatar.textContent =
        usuario.username
          ? usuario.username.charAt(0).toUpperCase()
          : '?';
    }




    if (profileRole) {

      if (rol === 'admin') {

        profileRole.textContent =
          '🛡️ Administrador del sistema';

      }
      else if (rol === 'lider') {

        profileRole.textContent =
          usuario.carrera
            ? `🎓 ${usuario.carrera}`
            : '🎓 Líder social';

      }
      else {

        profileRole.textContent =
          '🌍 Usuario público';

      }

    }

    if (profileCarrera) {

      if (rol === 'admin') {

        profileCarrera.textContent =
          'No aplica para administrador';

      }
      else {

        profileCarrera.textContent =
          usuario.carrera ||
          'Carrera no registrada';

      }

    }

    if (profileCorreo) {

      profileCorreo.textContent =
        usuario.correo ||
        'Correo no registrado';

    }

    if (profileTelefono) {

      profileTelefono.textContent =
        usuario.telefono ||
        'Teléfono no registrado';

    }

    if (profileLinkedin) {

      profileLinkedin.textContent =
        usuario.linkedin ||
        'LinkedIn no registrado';

    }

    if (profileCvu) {

      profileCvu.textContent =
        usuario.cvu ||
        'CVU no registrado';

    }


  if (editBtn) {

    editBtn.addEventListener(
      'click',
      async function(event) {

        event.preventDefault();

        if (modoEdicion) {
          return;
        }

        modoEdicion = true;

        if (nombre) {
          nombre.innerHTML =
            `<input
              id="input-username"
              class="form-input"
              value="${usuario.username || ''}"
            >`;
        }

        if (saveProfileBtn) {
          saveProfileBtn.style.display =
            'inline-flex';
        }

        if (profileCorreo) {
          profileCorreo.innerHTML =
            `<input
              id="input-correo"
              class="form-input"
              value="${usuario.correo || ''}"
            >`;
        }

        if (profileTelefono) {
          profileTelefono.innerHTML =
            `<input
              id="input-telefono"
              class="form-input"
              value="${usuario.telefono || ''}"
            >`;
        }

        if (profileLinkedin) {
          profileLinkedin.innerHTML =
            `<input
              id="input-linkedin"
              class="form-input"
              value="${usuario.linkedin || ''}"
            >`;
        }

        if (profileCvu) {
          profileCvu.innerHTML =
            `<input
              id="input-cvu"
              class="form-input"
              value="${usuario.cvu || ''}"
            >`;
        }

        if (
          rol === 'lider' &&
          profileCarrera
        ) {
          profileCarrera.innerHTML =
            `<input
              id="input-carrera"
              class="form-input"
              value="${usuario.carrera || ''}"
            >`;
        }

      }
    );

}


  if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
      'click',
      async function() {

        const correo =
          document.getElementById(
            'input-correo'
          )?.value;

        const telefono =
          document.getElementById(
            'input-telefono'
          )?.value;

        const linkedin =
          document.getElementById(
            'input-linkedin'
          )?.value;

        const cvu =
          document.getElementById(
            'input-cvu'
          )?.value;

        const carrera =
          document.getElementById(
            'input-carrera'
          )?.value;

        const username =
          document.getElementById(
            'input-username'
          )?.value;

        const token =
  localStorage.getItem('token');

    const response =
      await fetch(
        'http://localhost:3000/api/auth/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            username,
            correo,
            telefono,
            linkedin,
            cvu,
            carrera
          })
        }
      );

    const data =
      await response.json();

    if (response.ok) {

      alert(
        'Perfil actualizado correctamente'
      );

      window.location.reload();

    }
    else {

      alert(
        data.mensaje ||
        'Error actualizando perfil'
      );

    }

      }
    );

  }



    
  }
);