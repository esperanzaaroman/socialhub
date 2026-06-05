import { renderWidgets } from "./widget.js";

async function cargarDetalleProyecto(){
    console.log("Entré a cargarDetalleProyecto");
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get('id');
    console.log(idProyecto);
    try {
        const respuestaProj = await fetch(`http://localhost:3000/api/proyectos/${idProyecto}`);
        const proyecto = await respuestaProj.json();
        console.log("Proyecto recibido:", proyecto);
        console.log(proyecto);

        Object.entries(proyecto).forEach(([clave, valor]) => {

            document
                .querySelectorAll(`[data-proyecto="${clave}"]`)
                .forEach(el => {
                    el.innerText = valor;
                });

        });
            document.getElementById('proyecto-titulo').innerText = proyecto.nombre;
            document.getElementById('proyecto-resumen').innerText = proyecto.descripcion_corta;
            document.getElementById('proyecto-categoria').innerText = proyecto.categoria;
            document.getElementById('proyecto-ods').innerText = proyecto.ods; 
            document.getElementById('proyecto-estado').innerText = proyecto.estado;

            const fechaInicioCortas = new Date(proyecto.fecha_inicio).toLocaleDateString();
            document.getElementById('proyecto-inicio').innerText =fechaInicioCortas;

            const fechaFinCortas = new Date(proyecto.fecha_fin).toLocaleDateString();
            document.getElementById('proyecto-fin').innerText = fechaFinCortas;

            const respuestaWidgets = await fetch(`http://localhost:3000/api/widgets?id_proyecto=${idProyecto}`);
            const widgets = await respuestaWidgets.json();

            const iframeVideo = document.getElementById('videoproject');
    
            if (proyecto.video_url) {
                iframeVideo.src = obtenerUrlEmbed(proyecto.video_url);
            } else {
                iframeVideo.closest('.video-responsive-container').style.display = 'none';
            }
                    const widgetsReales = widgets.data.widgets;

            renderWidgets(widgetsReales);
    }catch(error){
        console.error("Error al conectar con API",error);
    }


}
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

    // Devolvemos la URL perfecta que el iframe sí va a aceptar
    return `https://www.youtube.com/embed/${videoId}`;
}

window.onload = cargarDetalleProyecto;