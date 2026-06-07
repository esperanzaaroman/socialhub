import { crearNodoGrafica, crearNodoKpi } from "./widget.js";
const gridStack = GridStack.init({
    column: 12,
    cellHeight: 80,
    animate: true,
    float: false,
    resizable: {handles: 'se'},

    margin: 50
});

function configurarInterfazPorRol(puedeEditar){
   const botonAgregar = document.getElementById('btn-agregar-widget');

    if (puedeEditar) {
        gridStack.enableMove(true);
        gridStack.enableResize(true);
        if (botonAgregar) botonAgregar.style.display = 'inline-flex';
        gridStack.opts.resizable = { handles: 'se' };
    } else {
        gridStack.enableMove(false);
        gridStack.enableResize(false);
        if (botonAgregar) botonAgregar.style.display = 'none';
        
        document.querySelectorAll('.grid-stack-item').forEach(el => {
            el.style.cursor = 'default';
        });
    }
}
gridStack.on('change', async function(event, items) {
    const actualizaciones = items.map(item => {
        return {
            id_widget: item.el.getAttribute('data-id-widget'),
            pos_x: item.x,
            pos_y: item.y,
            ancho: item.w,
            alto: item.h
        };
    });

    console.log("Nuevas posiciones listas para guardar:", actualizaciones);

    try {
        await fetch('/api/widgets/layout', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ widgets: actualizaciones })
        });
    } catch (err) {
        console.error("No se pudo salvar el layout:", err);
    }
});  
  
async function cargarDetalleProyecto(){
    console.log("Entré a cargarDetalleProyecto");
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get('id');
    console.log(idProyecto);
    try {
        const token = localStorage.getItem('token');
        const respuestaProj = await fetch(`/api/proyectos/${idProyecto}`,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        const respuestaJson = await respuestaProj.json();
        const proyecto = await respuestaJson.data;
        console.log("Proyecto recibido:", proyecto);
        console.log(proyecto);
        const proyectoData = proyecto.proyecto;
        console.log(proyectoData.categoria);
        configurarInterfazPorRol(proyecto.puedoEditar)
        
        Object.entries(proyectoData).forEach(([clave, valor]) => {

            document
                .querySelectorAll(`[data-proyecto="${clave}"]`)
                .forEach(el => {
                    el.innerText = valor;
                });

        });
            document.getElementById('proyecto-titulo').innerText = proyectoData.nombre;
            document.getElementById('proyecto-resumen').innerText = proyectoData.descripcion_corta;
            document.getElementById('proyecto-categoria').innerText = proyectoData.categoria;
            document.getElementById('proyecto-ods').innerText = proyectoData.ods; 
            document.getElementById('proyecto-estado').innerText = proyectoData.estado;

            const fechaInicioCortas = new Date(proyectoData.fecha_inicio).toLocaleDateString();
            document.getElementById('proyecto-inicio').innerText =fechaInicioCortas;

            const fechaFinCortas = new Date(proyectoData.fecha_fin).toLocaleDateString();
            document.getElementById('proyecto-fin').innerText = fechaFinCortas;

            // ── LÍDER DEL PROYECTO ────────────────────────────────
            const liderNombreEl  = document.getElementById('lider-nombre');
            const liderCarreraEl = document.getElementById('lider-carrera');
            const liderAvatarEl  = document.getElementById('lider-avatar');
            const liderLinkEl    = document.getElementById('lider-perfil-link');

            if (liderNombreEl)  liderNombreEl.textContent  = proyectoData.lider   || 'Sin líder asignado';
            if (liderCarreraEl) liderCarreraEl.textContent = proyectoData.carrera_lider || 'Carrera no registrada';
            if (liderAvatarEl)  liderAvatarEl.textContent  = proyectoData.lider ? proyectoData.lider.charAt(0).toUpperCase() : '?';
            if (liderLinkEl && proyectoData.id_lider) {
                liderLinkEl.href = `lider-perfil.html?id=${proyectoData.id_lider}`;
            }
            // ─────────────────────────────────────────────────────

            // ── BOTÓN EDITAR PROYECTO ─────────────────────────────
            const btnEditar = document.getElementById('btn-agregar-widget');
            if (btnEditar) {
                btnEditar.addEventListener('click', function () {
                    const editNombre      = document.getElementById('edit-nombre');
                    const editDescripcion = document.getElementById('edit-descripcion');
                    const editEstado      = document.getElementById('edit-estado');
                    if (editNombre)      editNombre.value      = proyectoData.nombre || '';
                    if (editDescripcion) editDescripcion.value = proyectoData.descripcion_corta || '';
                    if (editEstado)      editEstado.value      = proyectoData.estado || 'activo';
                    document.getElementById('modal-editar-proyecto').style.display = 'flex';
                });
            }

            const saveEditBtn = document.getElementById('save-edit-proyecto');
            if (saveEditBtn) {
                saveEditBtn.addEventListener('click', async function () {
                    const nombre          = document.getElementById('edit-nombre')?.value.trim();
                    const descripcion_corta = document.getElementById('edit-descripcion')?.value.trim();
                    const estado          = document.getElementById('edit-estado')?.value;
                    const msgEl           = document.getElementById('edit-proyecto-message');

                    if (!nombre || !descripcion_corta) {
                        if (msgEl) { msgEl.textContent = 'Completa todos los campos'; msgEl.style.display = 'block'; msgEl.style.background = '#fee2e2'; msgEl.style.color = '#991b1b'; }
                        return;
                    }

                    const token = localStorage.getItem('token');
                    const resp  = await fetch(`/api/proyectos/${idProyecto}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ nombre, descripcion_corta, estado })
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        alert('Proyecto actualizado correctamente ✅');
                        window.location.reload();
                    } else {
                        if (msgEl) { msgEl.textContent = data.error || 'Error al guardar'; msgEl.style.display = 'block'; msgEl.style.background = '#fee2e2'; msgEl.style.color = '#991b1b'; }
                    }
                });
            }
            // ─────────────────────────────────────────────────────

            const respuestaWidgets = await fetch(`/api/widgets?id_proyecto=${idProyecto}`);
            const widgets = await respuestaWidgets.json();

            const iframeVideo = document.getElementById('videoproject');
    
            if (proyecto.video_url) {
                iframeVideo.src = obtenerUrlEmbed(proyecto.video_url);
            } else {
                iframeVideo.closest('.video-responsive-container').style.display = 'none';
            }
            const widgetsReales = widgets.data.widgets;

            renderWidgets(widgetsReales);

            //agregando aca para los de los testimonios jiji
            const usuario =
            await obtenerUsuarioActual();

            const rol =
            usuario?.role || 'publico';


            

            const addTestimonioBtn =
            document.getElementById(
                'add-testimonio-btn'
            );

            if (
            rol === 'admin' ||
            rol === 'lider'
            ) {

            addTestimonioBtn.style.display =
                'inline-flex';

            }


            const testimoniosContainer =
            document.getElementById(
                'testimonios-list'
            );

            const responseTestimonios =
            await fetch(
                `/api/testimonios/proyecto/${idProyecto}`
            );

            const testimonios =
            await responseTestimonios.json();

            testimoniosContainer.innerHTML =
            '';

            if (testimonios.length === 0) {

            testimoniosContainer.innerHTML =
                `
                <p style="color:#64748b;">
                Aún no hay testimonios.
                </p>
                `;

            }
            else {

            testimonios.forEach(
                function(testimonio) {

                testimoniosContainer.innerHTML += `
                    <div
                    style="
                        background:white;
                        border:1px solid #e2e8f0;
                        border-radius:12px;
                        padding:14px;
                        margin-bottom:12px;
                    "
                    >
                    <div
                        style="
                        color:#334155;
                        line-height:1.6;
                        "
                    >
                        ${testimonio.texto}
                    </div>
                    </div>
                `;

                }
            );

            }
            //agregando aca pa el boton de los testimonio sjiji

            const testimonioForm =
            document.getElementById('testimonio-form');

            const testimonioText =
            document.getElementById('testimonio-text');

            const saveTestimonioBtn =
            document.getElementById('save-testimonio-btn');

            if (addTestimonioBtn && testimonioForm) {
            addTestimonioBtn.addEventListener('click', function() {
                testimonioForm.style.display = 'block';
            });
            }

            if (saveTestimonioBtn) {
            saveTestimonioBtn.addEventListener('click', async function() {

                const texto =
                testimonioText.value.trim();

                if (!texto) {
                alert('Escribe un testimonio');
                return;
                }

                const token =
                localStorage.getItem('token');

                const response =
                await fetch(
                    '/api/testimonios',
                    {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_proyecto: idProyecto,
                        texto
                    })
                    }
                );

                const data =
                await response.json();

                if (response.ok) {
                alert('Testimonio agregado correctamente ✅');
                window.location.reload();
                }
                else {
                alert(data.mensaje || 'Error agregando testimonio');
                }

            });
            }



            //agregandp aca para relacionar lo del los posts relacionados al proyecto!
            const projectPostsContainer =
            document.getElementById('project-posts');

            if (projectPostsContainer) {

            const responsePosts =
                await fetch(
                `/api/forum/posts?projectId=${idProyecto}`
                );

            const posts =
                await responsePosts.json();

            projectPostsContainer.innerHTML = '';

            if (posts.length === 0) {
                projectPostsContainer.innerHTML = `
                <p style="color:#64748b;">
                    Este proyecto aún no tiene publicaciones en el foro.
                </p>
                `;
            }
            else {
                posts.forEach(function(post) {
                projectPostsContainer.innerHTML += `
                    <div
                    class="profile-post"
                    style="
                        background:white;
                        border:1px solid #e2e8f0;
                        border-radius:14px;
                        padding:16px;
                        margin-bottom:14px;
                    "
                    >
                    <div style="font-weight:700;margin-bottom:6px;">
                        ${post.username}
                    </div>

                    <div style="font-size:13px;color:#475569;line-height:1.6;">
                        ${post.texto}
                    </div>

                    ${
                        post.multimedia_publi
                        ? `
                            <img
                            src="/${post.multimedia_publi}"
                            alt="Imagen publicación"
                            style="
                                width:100%;
                                max-height:280px;
                                object-fit:cover;
                                border-radius:12px;
                                margin-top:10px;
                            "
                            >
                        `
                        : ''
                    }
                    </div>
                `;
                });
            }
            }
            // aca se acaba


    }catch(error){
        console.error("Error al conectar con API",error);
    }


}
function renderWidgets(widgets){
    gridStack.removeAll();

    widgets.forEach(widget => {
        const configUi = widget.ui_config || {};
        const esKpi = (widget.tipo_visualizacion === 'kpi' || widget.id_plantilla === 1);
        
        const nuevoWidgetHTML = esKpi ? crearNodoKpi(widget) : crearNodoGrafica(widget);

        gridStack.makeWidget(nuevoWidgetHTML);
        gridStack.update(nuevoWidgetHTML, {
            x: widget.pos_x || 0,
            y: widget.pos_y || 0,
            w: widget.ancho || (esKpi ? 4 : 6),
            h: widget.alto || (esKpi ? 2 : 4),
            minW: esKpi ? 2 : 4,
            minH: esKpi ? 2 : 2
        });
        if (!esKpi) {
            const canvas = nuevoWidgetHTML.querySelector('.widget-chart');
            
            const miGrafica = new Chart(canvas, {
                type: configUi.tipo_grafica || 'bar',
                data: {
                    labels: widget.datos_grafica?.labels || ['Ene', 'Feb', 'Mar'],
                    datasets: [{
                        label: widget.nombre_widget,
                        data: widget.datos_grafica?.valores || [widget.valor_calculado, 10, 5],
                        backgroundColor: configUi.color || '#6366f1'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            nuevoWidgetHTML._chartInstance = miGrafica;
        }
    });
}
gridStack.on('resizestop', function(event, el) {
    if (el._chartInstance) {
        setTimeout(() => { el._chartInstance.resize(); }, 100);
    }
});
function obtenerUrlEmbed(urlCompartida) {
    if (!urlCompartida) return '';

    let videoId = '';

    if (urlCompartida.includes('watch?v=')) {
        videoId = urlCompartida.split('watch?v=')[1].split('&')[0];
    } 
    else if (urlCompartida.includes('youtu.be/')) {
        videoId = urlCompartida.split('youtu.be/')[1].split('?')[0];
    }
    else if (urlCompartida.includes('embed/')) {
        return urlCompartida;
    }
    else {
        videoId = urlCompartida;
    }

    return `https://www.youtube.com/embed/${videoId}`;
}

async function cargarMetricasFiltradas(tipo, idProyecto = null) {
    const selectMetrica = document.getElementById('widget-metrica');
    if (!selectMetrica) return;

    try {
        const token = localStorage.getItem('token');
        let url = '/api/metricas/generales'; 
        
        if (tipo === 'proyecto') {
            url = `/api/proyectos/${idProyecto}/metricas-utilizadas`;
        }

        const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const datos = await respuesta.json();
        
        selectMetrica.innerHTML = '';
        if (datos.length === 0) {
            selectMetrica.innerHTML = '<option value="">No se encontraron métricas</option>';
            return;
        }

        datos.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id_metrica;
            option.text = `${m.nombre} (${m.unidad})`;
            selectMetrica.appendChild(option);
        });
    } catch (err) {
        console.error(" Error al cargar las métricas dinámicas:", err);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    cargarDetalleProyecto();
    const radioGeneral = document.getElementById('metrica-tipo-general');
    const radioExistente = document.getElementById('metrica-tipo-existente');
    const radioNueva = document.getElementById('metrica-tipo-nueva');

    const wrapSeleccion = document.getElementById('wrapper-metrica-seleccion');
    const wrapNueva = document.getElementById('wrapper-metrica-nueva');
    const labelCombo = document.getElementById('label-combo-metrica');

    const selectEntrada = document.getElementById('metrica-entrada-tipo');
    const wrapManual = document.getElementById('wrapper-entrada-manual');
    const wrapCSV = document.getElementById('wrapper-entrada-csv');

    const params = new URLSearchParams(window.location.search);
    const idProyectoActual = params.get('id');

    if (radioGeneral && radioExistente && radioNueva) {
        
        radioGeneral.addEventListener('change', () => {
            if (radioGeneral.checked) {
                wrapSeleccion.style.display = "block";
                wrapNueva.style.display = "none";
                labelCombo.innerText = "Selecciona la Métrica General:";
                
                document.getElementById('nueva-metrica-nombre').removeAttribute('required');
                cargarMetricasFiltradas('generales');
            }
        });

        radioExistente.addEventListener('change', () => {
            if (radioExistente.checked) {
                wrapSeleccion.style.display = "block";
                wrapNueva.style.display = "none";
                labelCombo.innerText = "Selecciona una Métrica usada en este proyecto:";
                
                document.getElementById('nueva-metrica-nombre').removeAttribute('required');
                cargarMetricasFiltradas('proyecto', idProyectoActual);
            }
        });

        radioNueva.addEventListener('change', () => {
            if (radioNueva.checked) {
                wrapSeleccion.style.display = "none";
                wrapNueva.style.display = "block";
                
                document.getElementById('nueva-metrica-nombre').setAttribute('required', 'true');
            }
        });
    }

    if (selectEntrada && wrapManual && wrapCSV) {
        selectEntrada.addEventListener('change', (e) => {
            if (e.target.value === "manual") {
                wrapManual.style.display = "block";
                wrapCSV.style.display = "none";
                
                document.getElementById('widget-valor-inicial').setAttribute('required', 'true');
                document.getElementById('widget-archivo-csv').removeAttribute('required');
            } else if (e.target.value === "csv") {
                wrapManual.style.display = "none";
                wrapCSV.style.display = "block";
                
                document.getElementById('widget-valor-inicial').removeAttribute('required');
                document.getElementById('widget-archivo-csv').setAttribute('required', 'true');
            }
        });
    }

    if (radioGeneral && radioGeneral.checked) {
        cargarMetricasFiltradas('generales');
    }
});


const formWidget = document.getElementById('form-crear-widget');

if (formWidget) {
    formWidget.addEventListener('submit', async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const idProyectoActual = parseInt(params.get('id'));

        if (!idProyectoActual) {
            alert("Error: No se encontró el ID del proyecto.");
            return;
        }

        const esNuevaMetrica = document.getElementById('metrica-tipo-nueva').checked;
        let infoMetrica = {};

        if (esNuevaMetrica) {
            infoMetrica = {
                tipo: 'nueva',
                nombre: document.getElementById('nueva-metrica-nombre').value.trim(),
                unidad: document.getElementById('nueva-metrica-unidad').value.trim() || 'Unidades'
            };
        } else {
            const selectM = document.getElementById('widget-metrica');
            if (!selectM || !selectM.value) {
                alert("Por favor selecciona una métrica válida del listado.");
                return;
            }
            infoMetrica = {
                tipo: 'existente',
                id_metrica: parseInt(selectM.value),
                nombre: selectM.options[selectM.selectedIndex].text.split('(')[0].trim() 
            };
        }

        const tipoEntrada = document.getElementById('metrica-entrada-tipo').value;
        const configUi = { color: document.getElementById('widget-color').value };

        const payloadBase = {
            id_proyecto: idProyectoActual,
            nombre_widget: document.getElementById('widget-nombre').value.trim(),
            id_plantilla: 1, 
            operacion: 'SUM',
            ui_config: configUi,
            infoMetrica: infoMetrica,
            tipoEntrada: tipoEntrada
        };

        if (tipoEntrada === 'manual') {
            payloadBase.valores = [
                { valor: parseFloat(document.getElementById('widget-valor-inicial').value), fecha: new Date() }
            ];
            await enviarWidgetAlBackend(payloadBase);
        } 
        else {
            const inputCSV = document.getElementById('widget-archivo-csv');
            if (!inputCSV.files || inputCSV.files.length === 0) {
                alert("Por favor selecciona un archivo CSV.");
                return;
            }

            const archivo = inputCSV.files[0];

            Papa.parse(archivo, {
                header: true, 
                skipEmptyLines: true,
                complete: async function(results) {
                    const filas = results.data;
                    const nombreColumnaBuscada = infoMetrica.nombre; 
                    
                    if (filas.length > 0 && !(nombreColumnaBuscada in filas[0])) {
                        alert(`Error: No se encontró ninguna columna llamada "${nombreColumnaBuscada}" en tu archivo CSV.`);
                        return;
                    }

                    const valoresProcesados = [];

                    filas.forEach(fila => {
                        const valorNumerico = parseFloat(fila[nombreColumnaBuscada]);
                        const fechaFila = fila['fecha'] || fila['Fecha'] || fila['date'] || fila['Date'] || new Date();

                        if (!isNaN(valorNumerico)) {
                            valoresProcesados.push({
                                valor: valorNumerico,
                                fecha: fechaFila
                            });
                        }
                    });

                    payloadBase.valores = valoresProcesados;
                    await enviarWidgetAlBackend(payloadBase);
                }
            });
        }
    });
}

async function enviarWidgetAlBackend(payload) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('/api/widgets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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