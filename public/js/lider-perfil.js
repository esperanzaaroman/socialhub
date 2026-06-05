document.addEventListener('DOMContentLoaded', async function() {

  const usuarioActual = await obtenerUsuarioActual();
  const rol = usuarioActual.role || 'publico';

  const params = new URLSearchParams(window.location.search);
  const idPerfil = params.get('id');

  let usuario = usuarioActual;

  if (idPerfil) {
    const response = await fetch(
      `http://localhost:3000/api/auth/profile/${idPerfil}`
    );
    usuario = await response.json();
  }

  const editBtn = document.getElementById('edit-btn');
  await cargarNavbar('');

  const puedeEditar =
    usuarioActual.id_usuario === usuario.id_usuario;

  const securityCard =
  document.getElementById('security-card');

  if (securityCard) {

  securityCard.style.display =
    puedeEditar
      ? 'block'
      : 'none';

}

  if (editBtn) {
    editBtn.style.display =
      puedeEditar ? 'inline-flex' : 'none';
  }

  const nombre = document.getElementById('profile-name');
  const breadcrumbNombre = document.getElementById('breadcrumb-profile-name');
  const avatar = document.getElementById('upload-photo-btn');
  const photoInput = document.getElementById('profile-photo-input');
  const profileRole = document.getElementById('profile-role');
  const profileCarrera = document.getElementById('profile-carrera');
  const profileCorreo = document.getElementById('profile-correo');
  const profileTelefono = document.getElementById('profile-telefono');
  const profileLinkedin = document.getElementById('profile-linkedin');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const profileMessage = document.getElementById('profile-message');
  const changePasswordBtn =
  document.getElementById(
    'change-password-btn'
  );

  const passwordMessage =
    document.getElementById(
      'password-message'
    );
  const profilePostsContainer =
  document.getElementById('profile-posts');


if (profilePostsContainer) {

  const responsePosts =
    await fetch(
      `http://localhost:3000/api/forum/posts?userId=${usuario.id_usuario}`
    );

  const posts =
    await responsePosts.json();

  profilePostsContainer.innerHTML = '';

  if (posts.length === 0) {
    profilePostsContainer.innerHTML = `
      <p style="color:#64748b;">
        Este usuario aún no ha realizado publicaciones.
      </p>
    `;
  }
  else {
    posts.forEach(function(post) {
      profilePostsContainer.innerHTML += `
        <div class="profile-post">
          <div style="font-weight:700;margin-bottom:6px;">
            ${post.nombre_proyecto}
          </div>

          <div style="font-size:13px;color:var(--gris-600);line-height:1.6;">
            ${post.texto}
          </div>

          ${
            post.multimedia_publi
              ? `
                <img
                  src="http://localhost:3000/${post.multimedia_publi}"
                  alt="Imagen publicación"
                  style="width:100%;max-height:260px;object-fit:cover;border-radius:12px;margin-top:10px;"
                >
              `
              : ''
          }
        </div>
      `;
    });
  }
}


  let modoEdicion = false;

  if (nombre) {
    nombre.textContent = usuario.username || 'Usuario';
  }

  if (breadcrumbNombre) {
    breadcrumbNombre.textContent = usuario.username || 'Usuario';
  }

  if (avatar) {
    if (usuario.foto_perfil) {
      avatar.innerHTML = `
        <img
          src="http://localhost:3000/${usuario.foto_perfil}"
          alt="Foto de perfil"
          style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
        >
      `;
    }
    else {
      avatar.textContent =
        usuario.username
          ? usuario.username.charAt(0).toUpperCase()
          : '?';
    }
  }

  if (profileRole) {
    if (usuario.carrera) {
      profileRole.textContent = `🎓 ${usuario.carrera}`;
    }
    else if (rol === 'admin') {
      profileRole.textContent = '🛡️ Administrador del sistema';
    }
    else {
      profileRole.textContent = '🎓 Líder social';
    }
  }

  if (profileCarrera) {
    if (usuario.carrera) {
      profileCarrera.textContent = usuario.carrera;
    }
    else if (rol === 'admin') {
      profileCarrera.textContent = 'No aplica para administrador';
    }
    else {
      profileCarrera.textContent = 'Carrera no registrada';
    }
  }

  if (profileCorreo) {
    profileCorreo.textContent =
      usuario.correo || 'Correo no registrado';
  }

  if (profileTelefono) {
    profileTelefono.textContent =
      usuario.telefono || 'Teléfono no registrado';
  }

  if (profileLinkedin) {
    if (usuario.linkedin) {
      let linkedinUrl = usuario.linkedin;

      if (
        !linkedinUrl.startsWith('http://') &&
        !linkedinUrl.startsWith('https://')
      ) {
        linkedinUrl = `https://${linkedinUrl}`;
      }

      profileLinkedin.innerHTML = `
        <a
          href="${linkedinUrl}"
          target="_blank"
          rel="noopener noreferrer"
          style="color:var(--azul);font-weight:600;"
        >
          ${usuario.linkedin}
        </a>
      `;
    }
    else {
      profileLinkedin.textContent = 'LinkedIn no registrado';
    }
  }

  if (editBtn) {
    editBtn.addEventListener('click', function(event) {
      event.preventDefault();

      if (modoEdicion) return;

      modoEdicion = true;

      if (nombre) {
        nombre.innerHTML = `
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
        saveProfileBtn.style.display = 'inline-flex';
      }

      if (profileCorreo) {
        profileCorreo.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="font-size:12px;font-weight:600;color:var(--gris-500);">
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
        profileTelefono.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="font-size:12px;font-weight:600;color:var(--gris-500);">
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
        profileLinkedin.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="font-size:12px;font-weight:600;color:var(--gris-500);">
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

      if (rol === 'lider' && profileCarrera) {
        profileCarrera.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="font-size:12px;font-weight:600;color:var(--gris-500);">
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
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async function() {

      const username =
        document.getElementById('input-username')?.value;

      const correo =
        document.getElementById('input-correo')?.value;

      const telefono =
        document.getElementById('input-telefono')?.value;

      const linkedin =
        document.getElementById('input-linkedin')?.value;

      const carrera =
        document.getElementById('input-carrera')?.value;

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(correo)) {
        mostrarMensajePerfil('Ingresa un correo válido', 'error');
        return;
      }

      if (
        telefono &&
        !/^[0-9]{10}$/.test(telefono)
      ) {
        mostrarMensajePerfil('El teléfono debe tener 10 dígitos, sin espacios', 'error');
        return;
      }

      if (
        linkedin &&
        linkedin.length > 150
      ) {
        mostrarMensajePerfil('LinkedIn demasiado largo', 'error');
        return;
      }

      if (
        linkedin &&
        !linkedin.includes('linkedin.com')
      ) {
        mostrarMensajePerfil('Ingresa una URL válida de LinkedIn', 'error');
        return;
      }

      const token = localStorage.getItem('token');

      const response = await fetch(
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

      const data = await response.json();

      if (response.ok) {
        mostrarMensajePerfil(
          'Perfil actualizado correctamente ✅',
          'success'
        );

        setTimeout(function() {
          window.location.reload();
        }, 1200);
      }
      else {
        mostrarMensajePerfil(
          data.mensaje || 'Error actualizando perfil',
          'error'
        );
      }
    });
  }

  if (avatar && photoInput) {
    avatar.addEventListener('click', function() {
      if (puedeEditar) {
        photoInput.click();
      }
    });
  }

  if (photoInput) {
    photoInput.addEventListener('change', async function() {

      const archivo = photoInput.files[0];

      if (!archivo) return;

      const formData = new FormData();

      formData.append('foto_perfil', archivo);

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:3000/api/auth/profile-photo',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        mostrarMensajePerfil(
          'Foto actualizada correctamente ✅',
          'success'
        );

        if (avatar) {
          avatar.innerHTML = `
            <img
              src="http://localhost:3000/${data.foto_perfil}?t=${Date.now()}"
              alt="Foto de perfil"
              style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
            >
          `;
        }
      }
      else {
        mostrarMensajePerfil(
          data.mensaje || 'Error subiendo foto',
          'error'
        );
      }
    });
  }

  function mostrarMensajePerfil(mensaje, tipo) {

    if (!profileMessage) return;

    profileMessage.textContent = mensaje;
    profileMessage.style.display = 'block';

    if (tipo === 'success') {
      profileMessage.style.background = 'var(--verde-light)';
      profileMessage.style.color = 'var(--verde-dark)';
    }
    else {
      profileMessage.style.background = '#fee2e2';
      profileMessage.style.color = '#991b1b';
    }
  }

  function mostrarMensajePassword(
  mensaje,
  tipo
) {

  if (!passwordMessage) {
    return;
  }

  passwordMessage.textContent =
    mensaje;

  passwordMessage.style.display =
    'block';

  if (tipo === 'success') {

    passwordMessage.style.background =
      'var(--verde-light)';

    passwordMessage.style.color =
      'var(--verde-dark)';

  }
  else {

    passwordMessage.style.background =
      '#fee2e2';

    passwordMessage.style.color =
      '#991b1b';

  }

}

if (changePasswordBtn) {

  changePasswordBtn.addEventListener(
    'click',
    async function() {

      const currentPassword =
        document.getElementById(
          'current-password'
        )?.value;

      const newPassword =
        document.getElementById(
          'new-password'
        )?.value;

      if (
        !currentPassword ||
        !newPassword
      ) {

        mostrarMensajePassword(
          'Completa todos los campos',
          'error'
        );

        return;

      }

      if (
        newPassword.length < 6
      ) {

        mostrarMensajePassword(
          'La nueva contraseña debe tener al menos 6 caracteres',
          'error'
        );

        return;

      }

      const token =
        localStorage.getItem(
          'token'
        );

      const response =
        await fetch(
          'http://localhost:3000/api/auth/change-password',
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword,
              newPassword
            })
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        mostrarMensajePassword(
          'Contraseña actualizada correctamente ✅',
          'success'
        );

        document.getElementById(
          'current-password'
        ).value = '';

        document.getElementById(
          'new-password'
        ).value = '';

      }
      else {

        mostrarMensajePassword(
          data.mensaje ||
          'Error actualizando contraseña',
          'error'
        );

      }

    }
  );

}

});