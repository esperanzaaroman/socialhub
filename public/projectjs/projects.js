async function cargarProyectos() {
    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/proyectos'
        );

        const proyectos = await respuesta.json();
        console.log("Proyecto recibido:", proyectos);

        const numProyectosInAct = proyectos.filter(proyecto => proyecto.estado === 'inactivo').length;
        const numProyectos = proyectos.length;
        const numProyectosActivos =  proyectos.filter(proyecto => proyecto.estado === 'activo').length;
        const tbody =
            document.getElementById('tabla-proyectos');
        const template =
            document.getElementById('template-fila-proyecto');

        tbody.innerHTML = '';

        const numInAct = document.querySelectorAll('.num-InAct');
        const numAct = document.querySelectorAll('.num-project-act');
        const num = document.querySelectorAll('.num-project');

        num.forEach(n => {
            n.innerText = `${numProyectos}`;
        });
        numAct.forEach(n=>{
            n.innerText = `${numProyectosActivos}`;
        })
        numInAct.forEach(n=>{
            n.innerText = `${numProyectosInAct}`;
        })

        proyectos.forEach(proyecto => {

            const clon = template.content.cloneNode(true);

            Object.entries(proyecto).forEach(([clave,valor]) => {
                clon.querySelectorAll(`[data-proyecto ="${clave}"]`).forEach(el=>{
                    if(el.tagName == 'A'){
                        el.innerText = valor;
                    } else if (clave === 'estado'){
                        el.innerText = ` ${valor}`;
                        el.className = `status-badge sb-${valor.toLowerCase()}`;
                    } else {
                        el.innerText = valor;
                    }
                });
            });

            const btnVer = clon.querySelector('.btn-ver-detalle');
            btnVer.href = `proyecto-detalle.html?id=${proyecto.id_proyecto}`;

            tbody.appendChild(clon);
        });

    } catch (error) {

        console.error(error);

    }
}

window.onload = cargarProyectos;