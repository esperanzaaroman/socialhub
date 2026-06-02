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
      document.getElementById('upload-photo-btn');

    const photoInput =
      document.getElementById('profile-photo-input');

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


    const saveProfileBtn =
      document.getElementById('save-profile-btn');
    
    const profileMessage =
      document.getElementById('profile-message');

    let modoEdicion = false;

    if (nombre && usuario.username) {
      nombre.textContent = usuario.username;
    }

    if (breadcrumbNombre && usuario.username) {
      breadcrumbNombre.textContent = usuario.username;
    }
    


    if (avatar) {

      if (usuario.foto_perfil) {

        avatar.innerHTML =
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

        avatar.textContent =
          usuario.username
            ? usuario.username.charAt(0).toUpperCase()
            : '?';

      }

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

      if (usuario.linkedin) {

        let linkedinUrl =
          usuario.linkedin;

        if (
          !linkedinUrl.startsWith('http://') &&
          !linkedinUrl.startsWith('https://')
        ) {
          linkedinUrl =
            `https://${linkedinUrl}`;
        }

        profileLinkedin.innerHTML =
          `<a
            href="${linkedinUrl}"
            target="_blank"
            rel="noopener noreferrer"
            style="color:var(--azul);font-weight:600;"
          >
            ${usuario.linkedin}
          </a>`;

      }
      else {

        profileLinkedin.textContent =
          'LinkedIn no registrado';

      }

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
            `
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="font-size:12px;font-weight:600;color:var(--gris-100);">
                Nombre
              </label>

              <input
                id="input-username"
                class="form-input"
                placeholder="Juan Pérez Guerrero"
                value="${usuario.username || ''}"
              >
            </div>
            `;
        }
        if (saveProfileBtn) {
          saveProfileBtn.style.display =
            'inline-flex';
        }

        if (profileCorreo) {
          profileCorreo.innerHTML =
            `
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="
                font-size:12px;
                font-weight:600;
                color:var(--gris-500);
              ">
                Correo electrónico
              </label>

              <input
                id="input-correo"
                class="form-input"
                placeholder="nombre@tec.mx"
                value="${usuario.correo || ''}"
              >
            </div>
            `;
        }

      if (profileTelefono) {
        profileTelefono.innerHTML =
          `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="
              font-size:12px;
              font-weight:600;
              color:var(--gris-500);
            ">
              Teléfono
            </label>

            <input
              id="input-telefono"
              class="form-input"
              placeholder="2221234567"
              value="${usuario.telefono || ''}"
            >
          </div>
          `;
      }

      if (profileLinkedin) {
        profileLinkedin.innerHTML =
          `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="
              font-size:12px;
              font-weight:600;
              color:var(--gris-500);
            ">
              Perfil de LinkedIn
            </label>

            <input
              id="input-linkedin"
              class="form-input"
              placeholder="linkedin.com/in/tu-perfil"
              value="${usuario.linkedin || ''}"
            >
          </div>
          `;
      }


        if (
          rol === 'lider' &&
          profileCarrera
        ) {
          profileCarrera.innerHTML =
            `
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="
                font-size:12px;
                font-weight:600;
                color:var(--gris-500);
              ">
                Carrera
              </label>

              <input
                id="input-carrera"
                class="form-input"
                placeholder="Ingeniería en Sistemas"
                value="${usuario.carrera || ''}"
              >
            </div>
            `;
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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {

      mostrarMensajePerfil(
        'Ingresa un correo válido',
        'error'
      );

      return;
    }

    const telefonoRegex =
      /^[0-9]{10}$/;

    if (
      telefono &&
      !telefonoRegex.test(telefono)
    ) {

      mostrarMensajePerfil(
        'El teléfono debe tener 10 dígitos',
        'error'
      );

      return;
    }

    if (
      linkedin &&
      linkedin.length > 150
    ) {

      mostrarMensajePerfil(
        'LinkedIn demasiado largo',
        'error'
      );

      return;
    }

    if (
      linkedin &&
      !linkedin.includes('linkedin.com')
    ) {

      mostrarMensajePerfil(
        'Ingresa una URL válida de LinkedIn',
        'error'
      );

      return;
    }



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
            carrera
          })
        }
      );

    const data =
      await response.json();

    if (response.ok) {
    mostrarMensajePerfil(
      'Foto actualizada correctamente ✅',
      'success'
    );

    avatar.innerHTML =
      `<img
        src="http://localhost:3000/${data.foto_perfil}?t=${Date.now()}"
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

        mostrarMensajePerfil(
          data.mensaje ||
          'Error actualizando perfil',
          'error'
        );

    }

      }
    );

  }

  function mostrarMensajePerfil(
    mensaje,
    tipo
  ) {

    if (!profileMessage) {
      return;
    }

    profileMessage.textContent =
      mensaje;

    profileMessage.style.display =
      'block';

    if (tipo === 'success') {
      profileMessage.style.background =
        'var(--verde-light)';
      profileMessage.style.color =
        'var(--verde-dark)';
    }
    else {
      profileMessage.style.background =
        '#fee2e2';
      profileMessage.style.color =
        '#991b1b';
    }

  }

  if (avatar && photoInput) {

    avatar.addEventListener(
      'click',
      function() {

        photoInput.click();

      }
    );

}

if (photoInput) {

  photoInput.addEventListener(
    'change',
    async function() {

      const archivo =
        photoInput.files[0];

      if (!archivo) {
        return;
      }

      const formData =
        new FormData();

      formData.append(
        'foto_perfil',
        archivo
      );

      const token =
        localStorage.getItem('token');

      const response =
        await fetch(
          'http://localhost:3000/api/auth/profile-photo',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        mostrarMensajePerfil(
          'Foto actualizada correctamente ✅',
          'success'
        );

        setTimeout(
          function() {
            window.location.reload();
          },
          2000
        );

      }
      else {

        mostrarMensajePerfil(
          data.mensaje ||
          'Error subiendo foto',
          'error'
        );

      }

    }
  );

}



    
  }
);