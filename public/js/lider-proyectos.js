document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarLider();

    await cargarNavbar(
      'proyectos'
    );

    const grid =
      document.getElementById(
        'projects-grid'
      );

    const token =
      localStorage.getItem(
        'token'
      );

    try {

      const response =
        await fetch(
          '/api/proyectos/mis-proyectos',
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const proyectos =
        await response.json();

      console.log('PROYECTOS LIDER:', proyectos);

      const activos =
        proyectos.filter(
          p => p.estado === 'activo'
        ).length;

      const inactivos =
        proyectos.filter(
          p => p.estado === 'inactivo'
        ).length;

      document.getElementById(
        'stat-activos'
      ).textContent = activos;

      document.getElementById(
        'stat-inactivos'
      ).textContent = inactivos;

      grid.innerHTML = '';

      if (!proyectos.length) {

        grid.innerHTML = `
          <p>
            No tienes proyectos asignados.
          </p>
        `;

        return;
      }

      proyectos.forEach(
        function(proyecto) {

          grid.innerHTML += `
            <div class="proj-card">

              <div
                  class="proj-card-banner"
                  style="
                    background:${proyecto.color_primario || '#2563eb'};
                  "
                >
                
                <span
                class="proj-status-badge"
                style="
                  background:rgba(255,255,255,.2);
                  backdrop-filter:blur(6px);
                "
              >
                  ● ${proyecto.estado}
                </span>
              </div>

              <div class="proj-card-body">

                <div class="proj-card-category">
                  ${proyecto.categoria || 'Sin categoría'}
                </div>

                <div class="proj-card-title">
                  ${proyecto.nombre}
                </div>

                <div class="proj-card-desc">
                  ${proyecto.descripcion_corta || 'Sin descripción'}
                </div>

                <div style="font-size:12px;color:var(--gris-500);line-height:1.7;margin-top:12px;">
                  <div>
                    📅 ${new Date(proyecto.fecha_inicio).toLocaleDateString()}
                    —
                    ${new Date(proyecto.fecha_fin).toLocaleDateString()}
                  </div>
                  <br>

                  <div>
                    🕒 ${proyecto.periodo || 'Periodo no registrado'}
                  </div>
                  <br>

                  <div>
                    🎯 ${proyecto.ods || 'ODS no registrado'}
                  </div>
                  <br>
                </div>

                <div class="proj-card-footer">
                  <a
                    href="proyecto-detalle.html?id=${proyecto.id_proyecto}"
                    class="btn btn-primary btn-sm"
                  >
                    Ver detalle →
                  </a>
                </div>

              </div>

            </div>
          `;
        }
      );

    } catch(error) {

      console.error(error);

      grid.innerHTML = `
        <p>
          Error cargando proyectos.
        </p>
      `;
    }

  }
);