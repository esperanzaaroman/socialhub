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
                `http://localhost:3000/api/testimonios/proyecto/${idProyecto}`
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
                    'http://localhost:3000/api/testimonios',
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
                `http://localhost:3000/api/forum/posts?projectId=${idProyecto}`
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
                            src="http://localhost:3000/${post.multimedia_publi}"
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