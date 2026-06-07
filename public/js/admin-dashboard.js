let roleToCreate = null;

document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarAdmin();

    const usuario =
      await obtenerUsuarioActual();

    await cargarNavbar(
      'dashboard'
    );

    const welcomeName =
      document.getElementById(
        'welcome-name'
      );

    if (welcomeName && usuario.username) {
      welcomeName.textContent =
        usuario.username;
    }

    const btnCreateLeader =
      document.getElementById('btn-create-leader');

    const btnCreateAdmin =
      document.getElementById('btn-create-admin');

    const modal =
      document.getElementById('create-user-modal');

    const modalTitle =
      document.getElementById('modal-title');

    const carreraInput =
      document.getElementById('new-carrera');

    const cancelBtn =
      document.getElementById('cancel-create-user');

    function abrirModal(role) {

      roleToCreate =
        role;

      if (modal) {
        modal.style.display =
          'flex';
      }

      if (role === 'lider') {

        if (modalTitle) {
          modalTitle.textContent =
            'Registrar líder';
        }

        if (carreraInput) {
          carreraInput.style.display =
            'block';
        }

      }
      else {

        if (modalTitle) {
          modalTitle.textContent =
            'Registrar admin';
        }

        if (carreraInput) {
          carreraInput.style.display =
            'none';
        }

      }

    }

    if (btnCreateLeader) {
      btnCreateLeader.addEventListener(
        'click',
        function() {
          abrirModal('lider');
        }
      );
    }

    if (btnCreateAdmin) {
      btnCreateAdmin.addEventListener(
        'click',
        function() {
          abrirModal('admin');
        }
      );
    }

    if (cancelBtn) {
      cancelBtn.addEventListener(
        'click',
        function() {
          if (modal) {
            modal.style.display =
              'none';
          }
        }
      );
    }

    const saveBtn =
      document.getElementById(
        'save-create-user'
      );

    if (saveBtn) {

  saveBtn.addEventListener(
    'click',
    async function() {

      const username =
        document.getElementById(
          'new-username'
        ).value;

      const correo =
        document.getElementById(
          'new-email'
        ).value;

      const contrasena =
        document.getElementById(
          'new-password'
        ).value;

      const carrera =
        document.getElementById(
          'new-carrera'
        ).value;

      const token =
        localStorage.getItem(
          'token'
        );

      
      if (!username || !correo || !contrasena || !roleToCreate) {
  mostrarMensajeCrearUsuario(
    'Completa todos los campos obligatorios',
    'error'
  );
  return;
}

if (username.length < 3 || username.length > 50) {
  mostrarMensajeCrearUsuario(
    'El nombre debe tener entre 3 y 50 caracteres',
    'error'
  );
  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(correo)) {
  mostrarMensajeCrearUsuario(
    'Ingresa un correo válido',
    'error'
  );
  return;
}

if (contrasena.length < 6) {
  mostrarMensajeCrearUsuario(
    'La contraseña temporal debe tener al menos 6 caracteres',
    'error'
  );
  return;
}

if (roleToCreate === 'lider' && !carrera) {
  mostrarMensajeCrearUsuario(
    'La carrera es obligatoria para líderes, si no la conoce, introduzca "desconocido"',
    'error'
  );
  return;
}

      const response =
        await fetch(
          '/api/auth/admin/create-user',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              username,
              correo,
              contrasena,
              role: roleToCreate,
              carrera
            })
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          'Usuario creado correctamente ✅'
        );

        modal.style.display =
          'none';

      }
      else {

        alert(
          data.mensaje ||
          'Error creando usuario'
        );

      }

    }
  );

}

const createUserMessage =
  document.getElementById('create-user-message');

function mostrarMensajeCrearUsuario(mensaje, tipo) {
  if (!createUserMessage) return;

  createUserMessage.textContent = mensaje;
  createUserMessage.style.display = 'block';

  if (tipo === 'success') {
    createUserMessage.style.background = 'var(--verde-light)';
    createUserMessage.style.color = 'var(--verde-dark)';
  }
  else {
    createUserMessage.style.background = '#fee2e2';
    createUserMessage.style.color = '#991b1b';
  }
}
  }
);