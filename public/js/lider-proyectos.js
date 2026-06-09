document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarLider();

    await cargarNavbar(
      'proyectos'
    );

  }
);