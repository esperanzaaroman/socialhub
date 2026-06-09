document.addEventListener(
  'DOMContentLoaded',
  async function() {
    await cargarNavbar('publico-proyectos');
  }
);

fetch("/api/catalogos/datos-formulario")
  .then(res => res.json())
  .then(respuesta => {
    const { categorias, ods, lideres, poblaciones } = respuesta.data;

    const todosLosSelects = document.querySelectorAll(".select-catalogo");

    todosLosSelects.forEach(select => {
      const tipo = select.dataset.catalogo;

      if (tipo === "ods") {
        select.innerHTML =
          `<option value="">Todos los ODS</option>` +
          ods.map(o =>
            `<option value="${o.id_ods}">${o.nombre}</option>`
          ).join('');
      }
      else if (tipo === "poblaciones") {
        select.innerHTML =
          `<option value="">Toda la población</option>` +
          poblaciones.map(p =>
            `<option value="${p.id_poblacion}">${p.nombre}</option>`
          ).join('');
      }
      else if (tipo === "categorias") {
        select.innerHTML =
          `<option value="">Todas las categorías</option>` +
          categorias.map(c =>
            `<option value="${c.id_categoria}">${c.nombre}</option>`
          ).join('');
      }
      else if (tipo === "lideres") {
        select.innerHTML =
          `<option value="">Todos los líderes</option>` +
          lideres.map(l =>
            `<option value="${l.id_lider}">${l.username}</option>`
          ).join('');
      }
    });
  })
  .catch(() => {});