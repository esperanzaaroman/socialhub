async function cargarProyectos() {
    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/proyectos'
        );

        const proyectos = await respuesta.json();

        const tbody =
            document.getElementById('tabla-proyectos');

        tbody.innerHTML = '';

        proyectos.forEach(proyecto => {

            tbody.innerHTML += `
            <tr>
                <td>
                    <div class="proj-name-cell">
                        <div class="proj-icon-badge">📚</div>
                        <div>
                            <div class="proj-cell-name">
                                ${proyecto.nombre}
                            </div>
                            <div class="proj-cell-ods">
                                ODS ${proyecto.ods} · ${proyecto.categoria}
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="status-badge sb-activo">
                        ● ${proyecto.estado}
                    </span>
                </td>

                <td>
                    <div class="lider-cell">
                        <a href="lider-perfil.html">
                            ${proyecto.lider}
                        </a>
                    </div>
                </td>

                <td>
                    ${proyecto.periodo}
                </td>

                <td>
                    <div class="action-btns">
                        <a
                            href="proyecto-detalle.html?id=${proyecto.id_proyecto}"
                            class="action-btn ab-view"
                        >
                            👁 Ver
                        </a>
                    </div>
                </td>
            </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }
}

window.onload = cargarProyectos;