import { renderWidgets } from "./widget";

async function cargarDetalleProyecto(){
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get('id');

    try {
        const respuestaProj = await fetch(`http://localhost:3000/api/proyectos/${idProyecto}`);
        const proyecto = await respuestaProj.json();

            document.getElementById('proyecto-titulo').innerText = proyecto.titulo;
            document.getElementById('proyecto-resumen').innerText = proyecto.resumen;
            document.getElementById('proyecto-categoria').innerText = proyecto.categoria;
            document.getElementById('proyecto-ods').innerText = proyecto.ods;
            document.getElementById('proyecto-estado').innerText = proyecto.estado;
            document.getElementById('proyecto-inicio').innerText = proyecto.finicio;
            document.getElementById('proyecto-fin').innerText = proyecto.ffin;

            const respuestaWidgets = await fetch(`http://localhost:3000/api/widgets?id_proyecto=${idProyecto}`);
            const widgets = await respuestaWidgets.json();

            renderWidgets(widgets);
    }catch(error){
        console.error("Error al conectar con API",error);
    }


}

window.onload = cargarDetalleProyecto;