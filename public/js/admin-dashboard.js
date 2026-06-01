document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarAdmin();

    await cargarNavbar(
      'dashboard'
    );

  }
);