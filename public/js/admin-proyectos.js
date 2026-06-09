// ==========================================
// Variables de estado global
// ==========================================
let todosLosProyectos = [];
let proyectosFiltrados = [];
let paginaActual = 1;
const elementosPorPagina = 10;
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
document.addEventListener('DOMContentLoaded', async function() {
  // 1. Autenticación y UI (Tu lógica original)
  try {
    if (typeof verificarAdmin === 'function') await verificarAdmin();
    
    if (typeof obtenerUsuarioActual === 'function') {
      const usuario = await obtenerUsuarioActual();
      const welcomeName = document.getElementById('welcome-name');
      if (welcomeName && usuario.username) {
        welcomeName.textContent = usuario.username;
      }
      const welcomeRole = document.getElementById('welcome-role');
      if (welcomeRole && usuario.role) {
        welcomeRole.textContent = usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1);
      }
    }
    if (typeof cargarNavbar === 'function') await cargarNavbar('proyectos');
  } catch (error) {
    console.warn("Aviso: Funciones de auth no encontradas o fallaron.", error);
  }

  // 2. Inicializar Event Listeners de Filtros
  configurarFiltros();

  // 3. Cargar datos de la API
  await cargarProyectos();
});

// ==========================================
// Consumo de API y KPIs
// ==========================================
async function cargarProyectos() {
  try {
    // Tu FETCH original
    const respuesta = await fetch('http://localhost:3000/api/proyectos');
    todosLosProyectos = await respuesta.json();
    console.log("Proyectos recibidos:", todosLosProyectos);

    // Actualizar los KPIs de la parte superior
    actualizarKPIs(todosLosProyectos);

    // Al inicio, los datos filtrados son exactamente todos los descargados
    proyectosFiltrados = [...todosLosProyectos];
    
    // Mandamos a pintar la primera página
    renderizarTabla();

  } catch (error) {
    console.error("Error al cargar los proyectos desde la API:", error);
  }
}

function actualizarKPIs(proyectos) {
  // Tu lógica original para contar activos/inactivos
  const numProyectosInAct = proyectos.filter(p => p.estado && p.estado.toLowerCase() === 'inactivo').length;
  const numProyectosActivos = proyectos.filter(p => p.estado && p.estado.toLowerCase() === 'activo').length;
  const numProyectos = proyectos.length;

  document.querySelectorAll('.num-project').forEach(n => {
      n.innerText = `${numProyectos}`;
  });
  document.querySelectorAll('.num-project-act').forEach(n => {
      n.innerText = `${numProyectosActivos}`;
  });
  document.querySelectorAll('.num-InAct').forEach(n => {
      n.innerText = `${numProyectosInAct}`;
  });
}

// ==========================================
// Filtros y Búsqueda
// ==========================================
function configurarFiltros() {
  const inputBusqueda = document.querySelector('.search-inp');
  const selectsFiltros = document.querySelectorAll('.filter-pill');

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', aplicarFiltros);
  }

  selectsFiltros.forEach(select => {
    select.addEventListener('change', aplicarFiltros);
  });
}

function aplicarFiltros() {
  const inputEl = document.querySelector('.search-inp');
  const searchTerm = inputEl ? inputEl.value.toLowerCase() : '';
  const selects = document.querySelectorAll('.filter-pill');
  
  const estadoFiltro = selects[0] ? selects[0].value : 'Todos los estados';
  const categoriaFiltro = selects[1] ? selects[1].value : 'Todas las categorías';
  const periodoFiltro = selects[2] ? selects[2].value : 'Todos los periodos';

  proyectosFiltrados = todosLosProyectos.filter(p => {
    const nombre = (p.nombre || '').toLowerCase();
    const lider = (p.lider || '').toLowerCase();
    
    // 1. Coincidencia de texto
    const coincideBusqueda = nombre.includes(searchTerm) || lider.includes(searchTerm);
    
    // 2. Coincidencia de selects (Si dice "Todo/a", deja pasar todo)
    const coincideEstado = estadoFiltro.startsWith("Todo") || p.estado === estadoFiltro;
    const coincideCategoria = categoriaFiltro.startsWith("Toda") || p.categoria === categoriaFiltro;
    const coincidePeriodo = periodoFiltro.startsWith("Todo") || p.periodo === periodoFiltro;

    return coincideBusqueda && coincideEstado && coincideCategoria && coincidePeriodo;
  });

  // Reiniciamos a la página 1 tras filtrar
  paginaActual = 1;
  renderizarTabla();
}

// ==========================================
// Renderizado y Paginación (Tu lógica de template)
// ==========================================
function renderizarTabla() {
  const tbody = document.getElementById('tabla-proyectos');
  const template = document.getElementById('template-fila-proyecto');
  
  // Limpiamos la tabla
  tbody.innerHTML = '';

  // Calcular recortes de paginación
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const proyectosPagina = proyectosFiltrados.slice(inicio, fin);

  if (proyectosPagina.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: var(--gris-400);">No hay proyectos que coincidan con la búsqueda.</td></tr>`;
  } else {
    // Tu iteración de DOM exactamente como la escribiste
    proyectosPagina.forEach(proyecto => {
      const clon = template.content.cloneNode(true);

      Object.entries(proyecto).forEach(([clave, valor]) => {
          clon.querySelectorAll(`[data-proyecto="${clave}"]`).forEach(el => {
              if (el.tagName === 'A') {
                  el.innerText = valor;
              } else if (clave === 'estado') {
                  el.innerText = ` ${valor}`;
                  el.className = `status-badge sb-${(valor || '').toLowerCase()}`;
              } else {
                  el.innerText = valor;
              }
          });
      });

      const btnVer = clon.querySelector('.btn-ver-detalle');
      if (btnVer && proyecto.id_proyecto) {
          btnVer.href = `proyecto-detalle.html?id=${proyecto.id_proyecto}`;
      }

      tbody.appendChild(clon);
    });
  }

  // Refrescar los elementos visuales de la paginación inferior
  actualizarTextosPaginacion(inicio, fin);
  renderizarBotonesPaginacion();
}

function actualizarTextosPaginacion(inicio, fin) {
  const total = proyectosFiltrados.length;
  const minElemento = total === 0 ? 0 : inicio + 1;
  const maxElemento = Math.min(fin, total);
  const textoMostrando = `${minElemento}–${maxElemento}`;
  
  const resultsCount = document.querySelector('.results-count');
  if(resultsCount) {
    resultsCount.innerHTML = `Mostrando ${textoMostrando} de <span class="num-project">${total}</span> resultados`;
  }
  
  const pagInfo = document.querySelector('.pag-info');
  if(pagInfo) {
    pagInfo.innerHTML = `Mostrando ${textoMostrando} de <span class="num-project">${total}</span> proyectos`;
  }
}

function renderizarBotonesPaginacion() {
  const contenedorBotones = document.querySelector('.pag-btns');
  if(!contenedorBotones) return;
  
  contenedorBotones.innerHTML = '';

  const totalPaginas = Math.ceil(proyectosFiltrados.length / elementosPorPagina);
  if (totalPaginas <= 1) return; // Ocultar botones si todo cabe en 1 página

  // Botón "Anterior"
  const btnAnt = document.createElement('button');
  btnAnt.className = 'pag-btn';
  btnAnt.textContent = '← Anterior';
  btnAnt.disabled = paginaActual === 1;
  btnAnt.onclick = () => { 
    if(paginaActual > 1) { paginaActual--; renderizarTabla(); } 
  };
  contenedorBotones.appendChild(btnAnt);

  // Números (1, 2, 3...)
  for (let i = 1; i <= totalPaginas; i++) {
    const btnNum = document.createElement('button');
    btnNum.className = `pag-btn ${i === paginaActual ? 'active' : ''}`;
    btnNum.textContent = i;
    btnNum.onclick = () => { paginaActual = i; renderizarTabla(); };
    contenedorBotones.appendChild(btnNum);
  }

  // Botón "Siguiente"
  const btnSig = document.createElement('button');
  btnSig.className = 'pag-btn';
  btnSig.textContent = 'Siguiente →';
  btnSig.disabled = paginaActual === totalPaginas;
  btnSig.onclick = () => { 
    if(paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); } 
  };
  contenedorBotones.appendChild(btnSig);
}