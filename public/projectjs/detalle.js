import { crearNodoGrafica, crearNodoKpi } from "./widget.js";

let loteCSV = [];

const gridStack = GridStack.init({
    column: 12,
    cellHeight: 80,
    animate: true,
    float: false,
    resizable: { handles: 'se' },
    margin: 50
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearFecha(str) {
    if (!str) return new Date();
    str = String(str).trim();
    const matchDMY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (matchDMY) {
        return new Date(`${matchDMY[3]}-${matchDMY[2].padStart(2,'0')}-${matchDMY[1].padStart(2,'0')}T00:00:00`);
    }
    return new Date(str.includes('T') ? str : `${str}T00:00:00`);
}

function obtenerUrlEmbed(urlCompartida) {
    if (!urlCompartida) return '';
    if (urlCompartida.includes('watch?v=')) return `https://www.youtube.com/embed/${urlCompartida.split('watch?v=')[1].split('&')[0]}`;
    if (urlCompartida.includes('youtu.be/'))  return `https://www.youtube.com/embed/${urlCompartida.split('youtu.be/')[1].split('?')[0]}`;
    if (urlCompartida.includes('embed/'))     return urlCompartida;
    return `https://www.youtube.com/embed/${urlCompartida}`;
}

// ─── Rol / interfaz ───────────────────────────────────────────────────────────

function configurarInterfazPorRol(puedeEditar) {
    const botonAgregar = document.getElementById('btn-agregar-widget');
    if (puedeEditar) {
        gridStack.enableMove(true);
        gridStack.enableResize(true);
        if (botonAgregar) botonAgregar.style.display = 'inline-flex';
        gridStack.opts.resizable = { handles: 'se' };
        document.querySelectorAll('.btn-eliminar-widget').forEach(btn => btn.style.display = 'inline-block');
        document.body.classList.remove('modo-lectura');
    } else {
        gridStack.enableMove(false);
        gridStack.enableResize(false);
        if (botonAgregar) botonAgregar.style.display = 'none';
        document.querySelectorAll('.btn-eliminar-widget').forEach(btn => btn.style.display = 'none');
        document.querySelectorAll('.grid-stack-item').forEach(el => el.style.cursor = 'default');
        document.body.classList.add('modo-lectura');
    }
}

async function obtenerUsuarioActual() {
    try {
        const token = localStorage.getItem('token');
        const resp = await fetch('http://localhost:3000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        return data.data || data;
    } catch { return null; }
}

// ─── Layout autosave ──────────────────────────────────────────────────────────

gridStack.on('change', async function(event, items) {
    const actualizaciones = items.map(item => ({
        id_widget: item.el.getAttribute('data-id-widget'),
        pos_x: item.x,
        pos_y: item.y,
        ancho: item.w,
        alto:  item.h
    }));
    try {
        await fetch('http://localhost:3000/api/widgets/layout', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ widgets: actualizaciones })
        });
    } catch (err) {
        console.error("No se pudo salvar el layout:", err);
    }
});

gridStack.on('resizestop', function(event, el) {
    if (el._chartInstance) setTimeout(() => el._chartInstance.resize(), 100);
});

// ─── Cargar detalle del proyecto ──────────────────────────────────────────────

async function cargarDetalleProyecto() {
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get('id');

    try {
        const token = localStorage.getItem('token');
        const respuestaProj = await fetch(`http://localhost:3000/api/proyectos/${idProyecto}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const respuestaJson = await respuestaProj.json();
        const proyecto      = respuestaJson.data;
        const proyectoData  = proyecto.proyecto;

        configurarInterfazPorRol(proyecto.puedoEditar);

        // Rellenar campos con data-proyecto
        Object.entries(proyectoData).forEach(([clave, valor]) => {
            document.querySelectorAll(`[data-proyecto="${clave}"]`).forEach(el => el.innerText = valor);
        });

        document.getElementById('proyecto-titulo').innerText    = proyectoData.nombre;
        document.getElementById('proyecto-resumen').innerText   = proyectoData.descripcion_corta;
        document.getElementById('proyecto-categoria').innerText = proyectoData.categoria;
        document.getElementById('proyecto-ods').innerText       = proyectoData.ods;
        document.getElementById('proyecto-estado').innerText    = proyectoData.estado;
        document.getElementById('proyecto-inicio').innerText    = new Date(proyectoData.fecha_inicio).toLocaleDateString();
        document.getElementById('proyecto-fin').innerText       = new Date(proyectoData.fecha_fin).toLocaleDateString();

        // Video
        const iframeVideo = document.getElementById('videoproject');
        if (proyectoData.video_url) {
            iframeVideo.src = obtenerUrlEmbed(proyectoData.video_url);
        } else {
            iframeVideo.closest('.video-responsive-container').style.display = 'none';
        }

        // Widgets
        const respuestaWidgets = await fetch(`http://localhost:3000/api/widgets?id_proyecto=${idProyecto}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const widgetsJson  = await respuestaWidgets.json();
        const widgetsReales = widgetsJson.data.widgets;
        renderWidgets(widgetsReales);

        // Testimonios
        const usuario = await obtenerUsuarioActual();
        const rol = usuario?.role || 'publico';

        const addTestimonioBtn = document.getElementById('add-testimonio-btn');
        if ((rol === 'admin' || rol === 'lider') && addTestimonioBtn) {
            addTestimonioBtn.style.display = 'inline-flex';
        }

        const testimoniosContainer = document.getElementById('testimonios-list');
        const responseTestimonios  = await fetch(`http://localhost:3000/api/testimonios/proyecto/${idProyecto}`);
        const testimonios          = await responseTestimonios.json();

        testimoniosContainer.innerHTML = '';
        if (testimonios.length === 0) {
            testimoniosContainer.innerHTML = `<p style="color:#64748b;">Aún no hay testimonios.</p>`;
        } else {
            testimonios.forEach(t => {
                testimoniosContainer.innerHTML += `
                    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:12px;">
                        <div style="color:#334155;line-height:1.6;">${t.texto}</div>
                    </div>`;
            });
        }

        const testimonioForm   = document.getElementById('testimonio-form');
        const testimonioText   = document.getElementById('testimonio-text');
        const saveTestimonioBtn = document.getElementById('save-testimonio-btn');

        if (addTestimonioBtn && testimonioForm) {
            addTestimonioBtn.addEventListener('click', () => testimonioForm.style.display = 'block');
        }

        if (saveTestimonioBtn) {
            saveTestimonioBtn.addEventListener('click', async () => {
                const texto = testimonioText.value.trim();
                if (!texto) { alert('Escribe un testimonio'); return; }
                const response = await fetch('http://localhost:3000/api/testimonios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ id_proyecto: idProyecto, texto })
                });
                const data = await response.json();
                if (response.ok) { alert('Testimonio agregado correctamente ✅'); window.location.reload(); }
                else alert(data.mensaje || 'Error agregando testimonio');
            });
        }

        // Posts del foro
        const projectPostsContainer = document.getElementById('project-posts');
        if (projectPostsContainer) {
            const responsePosts = await fetch(`http://localhost:3000/api/forum/posts?projectId=${idProyecto}`);
            const posts = await responsePosts.json();
            projectPostsContainer.innerHTML = '';
            if (posts.length === 0) {
                projectPostsContainer.innerHTML = `<p style="color:#64748b;">Este proyecto aún no tiene publicaciones en el foro.</p>`;
            } else {
                posts.forEach(post => {
                    projectPostsContainer.innerHTML += `
                        <div class="profile-post" style="background:white;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:14px;">
                            <div style="font-weight:700;margin-bottom:6px;">${post.username}</div>
                            <div style="font-size:13px;color:#475569;line-height:1.6;">${post.texto}</div>
                            ${post.multimedia_publi ? `<img src="http://localhost:3000/${post.multimedia_publi}" alt="Imagen" style="width:100%;max-height:280px;object-fit:cover;border-radius:12px;margin-top:10px;">` : ''}
                        </div>`;
                });
            }
        }

    } catch (error) {
        console.error("Error al conectar con API", error);
    }
}

// ─── Render widgets ───────────────────────────────────────────────────────────

function renderWidgets(widgets) {
    gridStack.removeAll();

    widgets.forEach(widget => {
        const configUi = widget.ui_config || {};
        const esKpi    = widget.id_visualizacion === 1;

        const nuevoWidgetHTML = esKpi ? crearNodoKpi(widget) : crearNodoGrafica(widget);

        gridStack.makeWidget(nuevoWidgetHTML);
        gridStack.update(nuevoWidgetHTML, {
            x: widget.pos_x || 0,
            y: widget.pos_y || 0,
            w: widget.ancho || (esKpi ? 4 : 6),
            h: widget.alto  || (esKpi ? 2 : 4),
            minW: esKpi ? 2 : 4,
            minH: 2
        });

        // Botón eliminar — oculto si es obligatorio
        const btnEliminar = nuevoWidgetHTML.querySelector('.btn-eliminar-widget');
        if (btnEliminar && widget.es_obligatorio) btnEliminar.style.display = 'none';

        // Botón editar
        const btnEditar = nuevoWidgetHTML.querySelector('.btn-editar-widget');
        if (btnEditar) btnEditar.addEventListener('click', () => abrirModalEditar(widget));

        // Gráfica
        if (!esKpi) {
            const canvas        = nuevoWidgetHTML.querySelector('.widget-chart');
            const unidad        = canvas.dataset.unidad || '';
            const nombreMetrica = canvas.dataset.nombre || widget.nombre_widget;
            const historial     = widget.historial || [];
            const agrupacion    = configUi.agrupacion_beneficiarios || 'fecha';
            const esPorEtiqueta = widget.id_metrica === 1 && ['genero', 'edad'].includes(agrupacion);

            const labelsReales = historial.length > 0
                ? historial.map(item => {
                    if (esPorEtiqueta) return item.label || '—';
                    const f = new Date(item.fecha);
                    return isNaN(f.getTime()) ? item.fecha : `${f.getDate()}/${f.getMonth() + 1}`;
                })
                : ['Sin datos'];

            const valoresReales = historial.length > 0
                ? historial.map(item => parseFloat(item.valor_decimal) || 0)
                : [parseFloat(widget.valor_calculado) || 0];

            // Para pastel con etiquetas únicas (género/edad) múltiples colores
            const tipoGrafica = configUi.tipo_grafica || 'bar';
            const colorBase   = configUi.color || '#6366f1';
            const bgColors = esPorEtiqueta && tipoGrafica === 'pie'
                ? ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']
                      .slice(0, labelsReales.length)
                : colorBase;

            const miGrafica = new Chart(canvas, {
                type: tipoGrafica,
                data: {
                    labels: labelsReales,
                    datasets: [{
                        label: nombreMetrica,
                        data: valoresReales,
                        backgroundColor: bgColors,
                        borderColor:     Array.isArray(bgColors) ? bgColors : colorBase,
                        borderWidth: 2,
                        fill: tipoGrafica === 'line' ? false : true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: tipoGrafica === 'pie' || esPorEtiqueta } },
                    scales: tipoGrafica === 'pie' ? {} : {
                        x: {
                            title: {
                                display: true,
                                text: esPorEtiqueta ? (agrupacion === 'genero' ? 'Género' : 'Rango de edad') : 'Fecha',
                                color: '#94a3b8', font: { size: 11 }
                            },
                            ticks: { color: '#94a3b8', font: { size: 10 } }
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: !!unidad, text: unidad, color: '#94a3b8', font: { size: 11 } },
                            ticks: { color: '#94a3b8', font: { size: 10 } }
                        }
                    }
                }
            });

            nuevoWidgetHTML._chartInstance = miGrafica;
        }
    });

    // Eliminar widget
    document.querySelectorAll('.btn-eliminar-widget').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const elementoWidget = e.currentTarget.closest('.grid-stack-item');
            const idWidget = elementoWidget?.getAttribute('data-id-widget');
            if (!idWidget) return;
            if (!confirm("¿De verdad quieres quitar este widget del dashboard?")) return;

            try {
                const token = localStorage.getItem('token');
                const respuesta = await fetch(`http://localhost:3000/api/widgets/${idWidget}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resultado = await respuesta.json();
                if (respuesta.ok) {
                    gridStack.removeWidget(elementoWidget);
                    window.location.reload();
                } else {
                    alert(resultado.message || "No se pudo eliminar el widget.");
                }
            } catch (err) {
                console.error("Error al eliminar el widget:", err);
                alert("Hubo un error de conexión con el servidor.");
            }
        });
    });
}

// ─── Modal editar ─────────────────────────────────────────────────────────────

function abrirModalEditar(widget) {
    const modal = document.getElementById('modal-editar-widget');
    if (!modal) { console.error('Modal editar no encontrado en el DOM'); return; }

    const esObligatorio   = !!widget.es_obligatorio;
    const esGrafica       = widget.id_visualizacion === 2;
    const esHoras = widget.id_metrica === 3;

    const inputId = document.getElementById('editar-widget-id');
    inputId.value                   = widget.id_widget;
    inputId.dataset.idMetrica       = widget.id_metrica;
    inputId.dataset.idVisualizacion = widget.id_visualizacion;

    document.getElementById('editar-widget-obligatorio').value = esObligatorio || esHoras  ? '1' : '0';
    document.getElementById('editar-widget-nombre').value      = widget.nombre_widget;
    document.getElementById('editar-widget-operacion').value   = widget.operacion || 'SUM';
    document.getElementById('editar-widget-color').value       = widget.ui_config?.color || '#6366f1';

    const selectTipo = document.getElementById('editar-widget-tipo-grafica');
    if (selectTipo) selectTipo.value = widget.ui_config?.tipo_grafica || 'bar';

    // Agrupación beneficiarios en editar
    const wrapAgrupEditar = document.getElementById('editar-wrapper-agrupacion-beneficiarios');
    const selectAgrupEditar = document.getElementById('editar-widget-agrupacion-beneficiarios');
    const esBenefWidget = widget.id_metrica === 1 && esGrafica;
    if (wrapAgrupEditar) wrapAgrupEditar.style.display = esBenefWidget ? 'block' : 'none';
    if (selectAgrupEditar) selectAgrupEditar.value = widget.ui_config?.agrupacion_beneficiarios || 'fecha';

    document.getElementById('editar-nueva-fecha').value = new Date().toISOString().slice(0, 10);
    document.getElementById('editar-nuevo-valor').value = '';

    // Operación: oculta si es obligatorio O si es gráfica
    document.getElementById('editar-wrapper-operacion').style.display =
        (esObligatorio || esGrafica) ? 'none' : 'block';

    // Tipo gráfica: solo si es gráfica
    const wrapTipo = document.getElementById('editar-wrapper-tipo-grafica');
    if (wrapTipo) wrapTipo.style.display = esGrafica ? 'block' : 'none';

    // Historial: visible para todos (incluye obligatorias como horas)
    // Solo se oculta para beneficiarios (1) y prestadores (2) porque leen de tabla real
    const esMetricaAutocontada = [1, 2].includes(widget.id_metrica);
    document.getElementById('editar-wrapper-valor').style.display =
        esMetricaAutocontada ? 'none' : 'block';

    modal.classList.add('open');
}

// ─── Submit editar widget ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    cargarDetalleProyecto();
    inicializarFormCrear();
    inicializarFormEditar();
    inicializarModalCrearListeners();
});

function inicializarFormEditar() {
    const formEditar = document.getElementById('form-editar-widget');
    if (!formEditar) return;

    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token         = localStorage.getItem('token');
        const inputId       = document.getElementById('editar-widget-id');
        const id            = inputId.value;
        const esObligatorio = document.getElementById('editar-widget-obligatorio').value === '1';
        const idVisualizacion = parseInt(inputId.dataset.idVisualizacion);
        const esGrafica     = idVisualizacion === 2;

        // ui_config — siempre preservar tipo_grafica si es gráfica
        const uiConfig = { color: document.getElementById('editar-widget-color').value };
        if (esGrafica) {
            const selectTipo = document.getElementById('editar-widget-tipo-grafica');
            uiConfig.tipo_grafica = selectTipo ? selectTipo.value : 'bar';
            const wrapAgrup = document.getElementById('editar-wrapper-agrupacion-beneficiarios');
            if (wrapAgrup?.style.display !== 'none') {
                uiConfig.agrupacion_beneficiarios =
                    document.getElementById('editar-widget-agrupacion-beneficiarios')?.value || 'fecha';
            }
        }

        const payload = {
            nombre_widget: document.getElementById('editar-widget-nombre').value.trim(),
            ui_config: uiConfig
        };

        // Operación solo para KPIs no obligatorios
        if (!esObligatorio && !esGrafica) {
            payload.operacion = document.getElementById('editar-widget-operacion').value;
        }

        try {
            // 1. PUT del widget
            const respWidget = await fetch(`http://localhost:3000/api/widgets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!respWidget.ok) {
                const err = await respWidget.json();
                alert(err.message || 'Error al actualizar el widget');
                return;
            }

            // 2. Agregar valor histórico si se llenaron los campos
            // Aplica a métricas normales Y a horas (id_metrica=3)
            const nuevoValor = parseFloat(document.getElementById('editar-nuevo-valor').value);
            const nuevaFecha = document.getElementById('editar-nueva-fecha').value;

            if (!isNaN(nuevoValor) && nuevaFecha) {
                const respValor = await fetch(`http://localhost:3000/api/widgets/${id}/valores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ valor: nuevoValor, fecha: nuevaFecha })
                });
                if (!respValor.ok) {
                    const err = await respValor.json();
                    alert('Widget guardado, pero error al registrar el valor: ' + (err.message || ''));
                }
            }

            document.getElementById('modal-editar-widget').classList.remove('open');
            window.location.reload();

        } catch (err) {
            console.error('Error al editar widget:', err);
            alert('Hubo un error de conexión al guardar.');
        }
    });
}

// ─── Modal crear: listeners de UI ────────────────────────────────────────────

function inicializarModalCrearListeners() {
    const params           = new URLSearchParams(window.location.search);
    const idProyectoActual = params.get('id');

    const selectPlantilla = document.getElementById('widget-plantilla');
    const wrapTipoGrafica = document.getElementById('wrapper-tipo-grafica');
    const modalTitulo     = document.getElementById('modal-titulo-cambiante');
    const selectEntrada   = document.getElementById('metrica-entrada-tipo');
    const wrapManual      = document.getElementById('wrapper-entrada-manual');
    const wrapCSV         = document.getElementById('wrapper-entrada-csv');
    const wrapSeleccion   = document.getElementById('wrapper-metrica-seleccion');
    const wrapNueva       = document.getElementById('wrapper-metrica-nueva');
    const labelCombo      = document.getElementById('label-combo-metrica');
    const radioGeneral    = document.getElementById('metrica-tipo-general');
    const radioExistente  = document.getElementById('metrica-tipo-existente');
    const radioNueva      = document.getElementById('metrica-tipo-nueva');

    // Helper: recalcular si mostrar el selector de agrupación
    function actualizarAgrupacionBenef() {
        const esGrafica   = document.getElementById('widget-plantilla')?.value === '2';
        const esGeneral   = document.getElementById('metrica-tipo-general')?.checked;
        const selectGen   = document.getElementById('widget-metrica');
        // Es beneficiarios si: origen=general Y la métrica seleccionada es id=1
        const idSelec     = parseInt(selectGen?.value);
        const esBeneficiarios = esGeneral && idSelec === 1;
        const wrapAgrup   = document.getElementById('wrapper-agrupacion-beneficiarios');
        if (wrapAgrup) wrapAgrup.style.display = (esGrafica && esBeneficiarios) ? 'block' : 'none';
    }

    // Tipo de visualización
    if (selectPlantilla && wrapTipoGrafica) {
        selectPlantilla.addEventListener('change', (e) => {
            const esGrafica = e.target.value === "2";
            wrapTipoGrafica.style.display = esGrafica ? "block" : "none";
            document.getElementById('wrapper-operacion').style.display = esGrafica ? "none" : "block";
            if (modalTitulo) modalTitulo.innerText = esGrafica ? "Configurar Gráfica Dinámica" : "Configurar Tarjeta KPI";
            const selectTipoGrafica = document.getElementById('widget-tipo-grafica');
            if (selectTipoGrafica) {
                esGrafica ? selectTipoGrafica.setAttribute('required', 'true') : selectTipoGrafica.removeAttribute('required');
            }
            actualizarAgrupacionBenef();
        });
    }

    // Origen de métrica
    if (radioGeneral) {
        radioGeneral.addEventListener('change', () => {
            wrapSeleccion.style.display = "block";
            wrapNueva.style.display = "none";
            labelCombo.innerText = "Selecciona la Métrica General:";
            document.getElementById('nueva-metrica-nombre').removeAttribute('required');
            // Métricas generales no admiten carga manual de datos
            document.getElementById('wrapper-captura-datos').style.display = "none";
            cargarMetricasFiltradas('generales');
            actualizarAgrupacionBenef();
        });
    }

    if (radioExistente) {
        radioExistente.addEventListener('change', () => {
            wrapSeleccion.style.display = "block";
            wrapNueva.style.display = "none";
            labelCombo.innerText = "Selecciona una Métrica usada en este proyecto:";
            document.getElementById('nueva-metrica-nombre').removeAttribute('required');
            document.getElementById('wrapper-captura-datos').style.display = "block";
            cargarMetricasFiltradas('proyecto', idProyectoActual);
            actualizarAgrupacionBenef();
        });
    }

    if (radioNueva) {
        radioNueva.addEventListener('change', () => {
            wrapSeleccion.style.display = "none";
            wrapNueva.style.display = "block";
            document.getElementById('nueva-metrica-nombre').setAttribute('required', 'true');
            document.getElementById('wrapper-captura-datos').style.display = "block";
            actualizarAgrupacionBenef();
        });
    }

    // Detectar cuando cambia la métrica seleccionada (para mostrar/ocultar agrupación)
    document.getElementById('widget-metrica')?.addEventListener('change', actualizarAgrupacionBenef);

    // Método de captura
    if (selectEntrada && wrapManual && wrapCSV) {
        selectEntrada.addEventListener('change', (e) => {
            const val = e.target.value;
            wrapManual.style.display = val === 'manual' ? "block" : "none";
            wrapCSV.style.display    = val === 'csv'    ? "block" : "none";
            document.getElementById('widget-valor-inicial').toggleAttribute('required', val === 'manual');
            document.getElementById('widget-archivo-csv').toggleAttribute('required', val === 'csv');
        });
    }

    // Generales por defecto: ocultar captura
    if (radioGeneral?.checked) {
        document.getElementById('wrapper-captura-datos').style.display = "none";
        cargarMetricasFiltradas('generales');
    }
}

// ─── Cargar métricas en el select ─────────────────────────────────────────────

async function cargarMetricasFiltradas(tipo, idProyecto = null) {
    const selectMetrica = document.getElementById('widget-metrica');
    if (!selectMetrica) return;

    try {
        const token = localStorage.getItem('token');

        // Generales: métricas con es_general=1 (id 1,2,3)
        // Proyecto:  métricas con id_proyecto = X (las que el líder creó)
        const url = tipo === 'proyecto'
            ? `http://localhost:3000/api/widgets/metricas/${idProyecto}`
            : `http://localhost:3000/api/metricas/generales`;

        const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const datos     = await respuesta.json();

        // El endpoint de generales puede devolver array directo o { data: { metricas } }
        const lista = Array.isArray(datos)
            ? datos
            : (datos.data?.metricas || datos.data || []);

        selectMetrica.innerHTML = '';

        if (lista.length === 0) {
            selectMetrica.innerHTML = '<option value="">No se encontraron métricas</option>';
            return;
        }

        lista.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id_metrica;
            option.text  = `${m.nombre} (${m.unidad})`;
            selectMetrica.appendChild(option);
        });

    } catch (err) {
        console.error("Error al cargar las métricas:", err);
    }
}

// ─── Submit crear widget ──────────────────────────────────────────────────────

function inicializarFormCrear() {
    const formWidget = document.getElementById('form-crear-widget');
    if (!formWidget) return;

    formWidget.addEventListener('submit', async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const idProyectoActual = parseInt(params.get('id'));
        if (!idProyectoActual) { alert("Error: No se encontró el ID del proyecto."); return; }

        // Información de la métrica
        let infoMetrica = {};
        if (document.getElementById('metrica-tipo-nueva').checked) {
            infoMetrica = {
                tipo:   'nueva',
                nombre: document.getElementById('nueva-metrica-nombre').value.trim(),
                unidad: document.getElementById('nueva-metrica-unidad').value.trim() || 'Unidades'
            };
        } else {
            const selectM = document.getElementById('widget-metrica');
            if (!selectM?.value) { alert("Por favor selecciona una métrica válida."); return; }
            const textoOption = selectM.options[selectM.selectedIndex].text;
            infoMetrica = {
                tipo:       'existente',
                id_metrica: parseInt(selectM.value),
                nombre:     textoOption.split('(')[0].trim(),
                unidad:     textoOption.match(/\((.+)\)/)?.[1]?.trim() || ''
            };
        }

        const idPlantilla = parseInt(document.getElementById('widget-plantilla').value, 10);
        const tipoEntrada = document.getElementById('metrica-entrada-tipo').value;
        const configUi    = { color: document.getElementById('widget-color').value };
        if (idPlantilla === 2) {
            configUi.tipo_grafica = document.getElementById('widget-tipo-grafica').value;
            const agrupSelect = document.getElementById('widget-agrupacion-beneficiarios');
            if (agrupSelect && agrupSelect.closest('#wrapper-agrupacion-beneficiarios')?.style.display !== 'none') {
                configUi.agrupacion_beneficiarios = agrupSelect.value;
            }
        }

        const payloadBase = {
            id_proyecto:   idProyectoActual,
            nombre_widget: document.getElementById('widget-nombre').value.trim(),
            id_plantilla:  idPlantilla,
            operacion:     document.getElementById('widget-operacion').value,
            ui_config:     configUi,
            infoMetrica
        };

        if (tipoEntrada === 'ninguno' ||
            document.getElementById('metrica-tipo-general').checked) {
            // Sin datos — enviar directo sin valores
            await enviarWidgetAlBackend(payloadBase);

        } else if (tipoEntrada === 'manual') {
            const val = parseFloat(document.getElementById('widget-valor-inicial').value);
            if (isNaN(val)) { alert("Ingresa un valor numérico válido."); return; }
            payloadBase.valores = [{
                valor: val,
                fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }];
            await enviarWidgetAlBackend(payloadBase);

        } else {
            const inputCSV = document.getElementById('widget-archivo-csv');
            if (!inputCSV.files?.length) { alert("Por favor selecciona un archivo CSV."); return; }

            Papa.parse(inputCSV.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: async function(results) {
                    const filas      = results.data;
                    const columnaCSV = infoMetrica.unidad || infoMetrica.nombre;

                    if (filas.length > 0 && !(columnaCSV in filas[0])) {
                        alert(`Error: No se encontró la columna "${columnaCSV}".\n\nColumnas disponibles: ${Object.keys(filas[0]).join(', ')}`);
                        return;
                    }

                    payloadBase.valores = filas.reduce((acc, fila) => {
                        const valorNumerico = parseFloat(fila[columnaCSV]);
                        if (isNaN(valorNumerico)) return acc;

                        const fechaOriginal = fila['fecha'] || fila['Fecha'] || fila['date'] || fila['Date'];
                        const fechaParsed   = parsearFecha(fechaOriginal);
                        const fechaValida   = !isNaN(fechaParsed.getTime()) ? fechaParsed : new Date();

                        acc.push({
                            valor: valorNumerico,
                            fecha: fechaValida.toISOString().slice(0, 19).replace('T', ' ')
                        });
                        return acc;
                    }, []);

                    await enviarWidgetAlBackend(payloadBase);
                }
            });
        }
    });
}

async function enviarWidgetAlBackend(payload) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('http://localhost:3000/api/widgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (!respuesta.ok) throw new Error("Error al guardar en el servidor");
        alert("Widget y métricas procesadas exitosamente.");
        window.location.reload();
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error en el servidor al guardar el widget.");
    }
}

// ─── Modal registrar beneficiario / prestador ─────────────────────────────────

function inicializarModalRegistroPersona() {
    const modalEl   = document.getElementById('modal-registro-persona');
    const tituloEl  = document.getElementById('modal-registro-titulo');
    const formBenef = document.getElementById('form-registro-beneficiario');
    const formPrest = document.getElementById('form-registro-prestador');
    const radioB    = document.getElementById('registro-tipo-beneficiario');
    const radioP    = document.getElementById('registro-tipo-prestador');
    const radioManual = document.getElementById('registro-modo-manual');
    const radioCSV    = document.getElementById('registro-modo-csv');
    const wrapManual  = document.getElementById('wrapper-registro-manual');
    const wrapCSV     = document.getElementById('wrapper-registro-csv');

    if (!modalEl || !formBenef || !formPrest) return;

    const params     = new URLSearchParams(window.location.search);
    const idProyecto = parseInt(params.get('id'));
    const token      = () => localStorage.getItem('token');
    const hoy        = new Date().toISOString().slice(0, 10);

    document.getElementById('benef-fecha').value = hoy;
    document.getElementById('prest-fecha').value = hoy;

    // ── Helpers de vista ─────────────────────────────────────────────────────

    function esBeneficiario() { return radioB.checked; }
    function esCSV()          { return radioCSV.checked; }

    function actualizarVista() {
        const benef = esBeneficiario();
        tituloEl.innerText      = benef ? 'Registrar Beneficiario' : 'Registrar Prestador de Servicio';
        formBenef.style.display = benef ? 'block' : 'none';
        formPrest.style.display = benef ? 'none'  : 'block';
        // hints CSV
        document.getElementById('csv-hint-beneficiario').style.display = benef ? 'block' : 'none';
        document.getElementById('csv-hint-prestador').style.display    = benef ? 'none'  : 'block';
        // reset preview al cambiar tipo
        limpiarPreviewCSV();
    }

    function actualizarModo() {
        const csv = esCSV();
        wrapManual.style.display = csv ? 'none'  : 'block';
        wrapCSV.style.display    = csv ? 'block' : 'none';
        limpiarPreviewCSV();
    }

    function limpiarPreviewCSV() {
        const inputFile = document.getElementById('registro-archivo-csv');
        if (inputFile) inputFile.value = '';
        document.getElementById('csv-preview').style.display = 'none';
        document.getElementById('csv-preview-resumen').innerText = '';
        document.getElementById('csv-preview-tabla').innerHTML  = '';
        document.getElementById('csv-preview-errores').innerText = '';
        document.getElementById('btn-importar-csv').disabled = true;
        loteCSV = [];
    }

    radioB.addEventListener('change', actualizarVista);
    radioP.addEventListener('change', actualizarVista);
    radioManual.addEventListener('change', actualizarModo);
    radioCSV.addEventListener('change', actualizarModo);
    actualizarVista();

    // ── Validadores de fila CSV ───────────────────────────────────────────────

    const GENEROS_VALIDOS = ['masculino','femenino','otro','prefiero_no_decir'];

    function normalizarFecha(str) {
        if (!str) return hoy;
        str = String(str).trim();
        const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (dmy) return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
        const d = new Date(str.includes('T') ? str : `${str}T00:00:00`);
        return isNaN(d) ? hoy : d.toISOString().slice(0,10);
    }

    function parsearFilaBeneficiario(fila, num) {
        const errores = [];
        const nombre = (fila['nombre'] || fila['Nombre'] || '').toString().trim();
        if (!nombre) errores.push(`Fila ${num}: nombre vacío`);

        const generoRaw = (fila['genero'] || fila['Genero'] || fila['género'] || '').toString().trim().toLowerCase();
        const genero = GENEROS_VALIDOS.includes(generoRaw) ? generoRaw : null;
        if (generoRaw && !genero) errores.push(`Fila ${num}: género "${generoRaw}" inválido (se ignorará)`);

        const edadRaw = parseInt(fila['edad'] || fila['Edad'] || '');
        const edad = (!isNaN(edadRaw) && edadRaw >= 0 && edadRaw <= 120) ? edadRaw : null;

        const fecha_registro = normalizarFecha(fila['fecha_registro'] || fila['fecha'] || fila['Fecha'] || '');

        return { datos: { nombre, genero, edad, fecha_registro }, errores };
    }

    function parsearFilaPrestador(fila, num) {
        const errores = [];
        const estatusRaw = (fila['estatus'] || fila['Estatus'] || 'activo').toString().trim().toLowerCase();
        const estatus = ['activo','inactivo'].includes(estatusRaw) ? estatusRaw : 'activo';
        if (estatusRaw && !['activo','inactivo'].includes(estatusRaw))
            errores.push(`Fila ${num}: estatus "${estatusRaw}" inválido, se usará "activo"`);

        const fecha_alta = normalizarFecha(fila['fecha_alta'] || fila['fecha'] || fila['Fecha'] || '');
        return { datos: { estatus, fecha_alta }, errores };
    }

    // ── Leer y previsualizar CSV ──────────────────────────────────────────────

    

    document.getElementById('registro-archivo-csv').addEventListener('change', function() {
        const file = this.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const filas   = results.data;
                const benef   = esBeneficiario();
                const erroresGlobal = [];
                loteCSV = [];

                filas.forEach((fila, i) => {
                    const { datos, errores } = benef
                        ? parsearFilaBeneficiario(fila, i + 2)
                        : parsearFilaPrestador(fila, i + 2);
                    loteCSV.push(datos);
                    erroresGlobal.push(...errores);
                });

                // Resumen
                const resumenEl = document.getElementById('csv-preview-resumen');
                resumenEl.innerText = `${loteCSV.length} fila(s) encontrada(s) en el archivo.`;

                // Tabla preview (primeras 5 filas)
                const tablaEl = document.getElementById('csv-preview-tabla');
                const cols    = Object.keys(loteCSV[0] || {});
                const muestra = loteCSV.slice(0, 5);
                tablaEl.innerHTML = `
                  <thead style="background:var(--gris-100,#f1f5f9);">
                    <tr>${cols.map(c => `<th style="padding:4px 8px;text-align:left;font-size:11px;">${c}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${muestra.map(r => `<tr>${cols.map(c => `<td style="padding:4px 8px;border-top:1px solid var(--gris-200,#e2e8f0);font-size:11px;">${r[c] ?? '—'}</td>`).join('')}</tr>`).join('')}
                    ${loteCSV.length > 5 ? `<tr><td colspan="${cols.length}" style="padding:4px 8px;font-size:11px;color:var(--gris-400,#94a3b8);">… y ${loteCSV.length - 5} más</td></tr>` : ''}
                  </tbody>`;

                // Errores de validación (advertencias)
                document.getElementById('csv-preview-errores').innerText =
                    erroresGlobal.length ? '⚠️ ' + erroresGlobal.join(' · ') : '';

                document.getElementById('csv-preview').style.display = 'block';
                document.getElementById('btn-importar-csv').disabled = loteCSV.length === 0;
            },
            error: function() {
                alert('No se pudo leer el archivo CSV. Verifica que sea un archivo válido.');
            }
        });
    });

    // ── Importar lote CSV ─────────────────────────────────────────────────────

    document.getElementById('btn-importar-csv').addEventListener('click', async () => {
        if (!loteCSV.length) return;
        const benef    = esBeneficiario();
        const endpoint = benef ? 'http://localhost:3000/api/beneficiarios/lote'
                                : 'http://localhost:3000/api/prestadores/lote';
        const body     = benef
            ? { id_proyecto: idProyecto, beneficiarios: loteCSV }
            : { id_proyecto: idProyecto, prestadores:   loteCSV };

        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify(body)
            });
            if (!resp.ok) throw new Error();
            const data = await resp.json();
            const insertados = data.data?.insertados ?? loteCSV.length;
            alert(`✅ ${insertados} registro(s) importado(s) correctamente.`);
            modalEl.classList.remove('open');
            limpiarPreviewCSV();
            window.location.reload();
        } catch {
            alert('Error al importar los registros. Verifica que el servidor esté disponible.');
        }
    });

    // ── Submit formulario manual beneficiario ─────────────────────────────────

    formBenef.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('benef-nombre').value.trim();
        const genero = document.getElementById('benef-genero').value || null;
        const edad   = parseInt(document.getElementById('benef-edad').value) || null;
        const fecha  = document.getElementById('benef-fecha').value || hoy;
        try {
            const resp = await fetch('http://localhost:3000/api/beneficiarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ id_proyecto: idProyecto, nombre, genero, edad, fecha_registro: fecha })
            });
            if (!resp.ok) throw new Error();
            alert(`Beneficiario "${nombre}" registrado correctamente.`);
            formBenef.reset();
            document.getElementById('benef-fecha').value = hoy;
            modalEl.classList.remove('open');
            window.location.reload();
        } catch {
            alert('Error al registrar el beneficiario. Intenta de nuevo.');
        }
    });

    // ── Submit formulario manual prestador ────────────────────────────────────

    formPrest.addEventListener('submit', async (e) => {
        e.preventDefault();
        const estatus    = document.getElementById('prest-estatus').value;
        const fecha_alta = document.getElementById('prest-fecha').value || hoy;
        try {
            const resp = await fetch('http://localhost:3000/api/prestadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ id_proyecto: idProyecto, estatus, fecha_alta })
            });
            if (!resp.ok) throw new Error();
            alert('Prestador registrado correctamente.');
            formPrest.reset();
            document.getElementById('prest-fecha').value = hoy;
            modalEl.classList.remove('open');
            window.location.reload();
        } catch {
            alert('Error al registrar el prestador. Intenta de nuevo.');
        }
    });
}

inicializarModalRegistroPersona();
