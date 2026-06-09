document.addEventListener('DOMContentLoaded', async function () {
  await verificarAdmin();

  const usuario = await obtenerUsuarioActual();
  await cargarNavbar('dashboard');

  const profileName = document.getElementById('profile-name');
  const avatar = document.getElementById('upload-photo-btn');
  const photoInput = document.getElementById('profile-photo-input');
  const profileCorreo = document.getElementById('profile-correo');
  const profileTelefono = document.getElementById('profile-telefono');
  const profileLinkedin = document.getElementById('profile-linkedin');
  const profileFecha = document.getElementById('profile-fecha');
  const editBtn = document.getElementById('edit-btn');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const profileMessage = document.getElementById('profile-message');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const passwordMessage = document.getElementById('password-message');
  const profilePostsEl = document.getElementById('profile-posts');

  let modoEdicion = false;

  function formatearFecha(fechaStr) {
    if (!fechaStr) return 'Fecha no registrada';
    const d = new Date(fechaStr);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function renderAvatar() {
    if (!avatar) return;

    if (usuario.foto_perfil) {
      avatar.innerHTML = `
        <img
          src="/${usuario.foto_perfil}"
          alt="Foto de perfil"
          style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
        >
      `;
    } else {
      avatar.textContent = usuario.username
        ? usuario.username.charAt(0).toUpperCase()
        : '?';
    }
  }

  function renderLinkedin() {
    if (!profileLinkedin) return;

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
    } else {
      profileLinkedin.textContent = 'LinkedIn no registrado';
    }
  }

  function poblarDatos() {
    if (profileName) profileName.textContent = usuario.username || 'Admin';
    if (profileCorreo) profileCorreo.textContent = usuario.correo || 'Correo no registrado';
    if (profileTelefono) profileTelefono.textContent = usuario.telefono || 'Teléfono no registrado';
    if (profileFecha) profileFecha.textContent = formatearFecha(usuario.fecha_registro);

    renderLinkedin();
    renderAvatar();
  }

  poblarDatos();

  if (editBtn) {
    editBtn.addEventListener('click', function (event) {
      event.preventDefault();

      if (modoEdicion) return;
      modoEdicion = true;

      if (profileName) {
        profileName.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="font-size:12px;font-weight:600;color:var(--gris-100);">
              Nombre
            </label>
            <input
              id="input-username"
              class="form-input"
              placeholder="Nombre completo"
              value="${usuario.username || ''}"
            >
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button id="save-hero-btn" class="btn btn-primary btn-sm">
                💾 Guardar cambios
              </button>
              <button
                id="cancel-hero-btn"
                class="btn btn-outline-white btn-sm"
                style="background:transparent;border:1px solid rgba(255,255,255,.4);color:white;"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        `;
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

      if (saveProfileBtn) {
        saveProfileBtn.style.display = 'inline-flex';
      }

      document.getElementById('save-hero-btn')?.addEventListener('click', guardarPerfilAdmin);

      document.getElementById('cancel-hero-btn')?.addEventListener('click', function () {
        window.location.reload();
      });
    });
  }

  async function guardarPerfilAdmin() {
    const username =
      document.getElementById('input-username')?.value || usuario.username;

    const correo =
      document.getElementById('input-correo')?.value || usuario.correo;

    const telefono =
      document.getElementById('input-telefono')?.value || '';

    const linkedin =
      document.getElementById('input-linkedin')?.value || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || username.length < 3 || username.length > 50) {
      mostrarMensajePerfil('El nombre debe tener entre 3 y 50 caracteres', 'error');
      return;
    }

    if (!emailRegex.test(correo)) {
      mostrarMensajePerfil('Ingresa un correo válido', 'error');
      return;
    }

    if (telefono && !/^[0-9]{10}$/.test(telefono)) {
      mostrarMensajePerfil('El teléfono debe tener 10 dígitos, sin espacios', 'error');
      return;
    }

    if (linkedin && linkedin.length > 150) {
      mostrarMensajePerfil('LinkedIn demasiado largo', 'error');
      return;
    }

    if (linkedin && !linkedin.includes('linkedin.com')) {
      mostrarMensajePerfil('Ingresa una URL válida de LinkedIn', 'error');
      return;
    }

    const token = localStorage.getItem('token');

    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        correo,
        telefono,
        linkedin
      })
    });

    const data = await response.json();

    if (response.ok) {
      mostrarMensajePerfil('Perfil actualizado correctamente ✅', 'success');

      setTimeout(function () {
        window.location.reload();
      }, 1200);
    } else {
      mostrarMensajePerfil(data.mensaje || 'Error actualizando perfil', 'error');
    }
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', guardarPerfilAdmin);
  }

  if (avatar && photoInput) {
    avatar.addEventListener('click', function () {
      photoInput.click();
    });
  }

  if (photoInput) {
    photoInput.addEventListener('change', async function () {
      const archivo = photoInput.files[0];

      if (!archivo) return;

      const formData = new FormData();
      formData.append('foto_perfil', archivo);

      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/profile-photo', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensajePerfil('Foto actualizada correctamente ✅', 'success');

        if (avatar) {
          avatar.innerHTML = `
            <img
              src="/${data.foto_perfil}?t=${Date.now()}"
              alt="Foto de perfil"
              style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
            >
          `;
        }
      } else {
        mostrarMensajePerfil(data.mensaje || 'Error subiendo foto', 'error');
      }
    });
  }

  if (profilePostsEl) {
    try {
      const resPosts = await fetch(`/api/forum/posts?userId=${usuario.id_usuario}`);
      const posts = await resPosts.json();

      profilePostsEl.innerHTML = '';

      if (!Array.isArray(posts) || posts.length === 0) {
        profilePostsEl.innerHTML = `
          <p style="color:#64748b;">
            Aún no has realizado publicaciones en el foro.
          </p>
        `;
      } else {
        posts.forEach(function (post) {
          profilePostsEl.innerHTML += `
            <div class="profile-post">
              <div style="font-weight:700;margin-bottom:6px;">
                ${post.nombre_proyecto || ''}
              </div>
              <div style="font-size:13px;color:var(--gris-600);line-height:1.6;">
                ${post.texto}
              </div>
              ${
                post.multimedia_publi
                  ? `
                    <img
                      src="/${post.multimedia_publi}"
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
    } catch (error) {
      profilePostsEl.innerHTML = `
        <p style="color:#64748b;">
          Error cargando publicaciones.
        </p>
      `;
    }
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async function () {
      const currentPassword =
        document.getElementById('current-password')?.value;

      const newPassword =
        document.getElementById('new-password')?.value;

      if (!currentPassword || !newPassword) {
        mostrarMensajePassword('Completa todos los campos', 'error');
        return;
      }

      if (newPassword.length < 6) {
        mostrarMensajePassword('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensajePassword('Contraseña actualizada correctamente ✅', 'success');

        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
      } else {
        mostrarMensajePassword(data.mensaje || 'Error actualizando contraseña', 'error');
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
    } else {
      profileMessage.style.background = '#fee2e2';
      profileMessage.style.color = '#991b1b';
    }
  }

  function mostrarMensajePassword(mensaje, tipo) {
    if (!passwordMessage) return;

    passwordMessage.textContent = mensaje;
    passwordMessage.style.display = 'block';

    if (tipo === 'success') {
      passwordMessage.style.background = 'var(--verde-light)';
      passwordMessage.style.color = 'var(--verde-dark)';
    } else {
      passwordMessage.style.background = '#fee2e2';
      passwordMessage.style.color = '#991b1b';
    }
  }
});