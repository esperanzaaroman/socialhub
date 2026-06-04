document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await cargarNavbar('lideres');

    const grid =
      document.getElementById('lideres-grid');

    if (!grid) {
      return;
    }

    const response =
      await fetch(
        'http://localhost:3000/api/auth/leaders'
      );

    const lideres =
      await response.json();

    grid.innerHTML = '';

    lideres.forEach(
      function(lider) {

        const avatar =
          lider.foto_perfil
            ? `
              <img
                src="http://localhost:3000/${lider.foto_perfil}"
                alt="Foto de perfil"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  border-radius:50%;
                "
              >
            `
            : (
                lider.username
                  ? lider.username
                      .charAt(0)
                      .toUpperCase()
                  : '?'
              );

        grid.innerHTML += `
          <a
            class="lider-card"
            href="lider-perfil.html?id=${lider.id_usuario}"
          >

            <div
              class="lider-banner"
              style="
                background:
                linear-gradient(
                  135deg,
                  #5CA09E,
                  #3d7a78
                );
              "
            ></div>

            <div class="lider-body">

              <div
                class="lider-avatar"
                style="
                  background:
                  linear-gradient(
                    135deg,
                    #1e40af,
                    #3b82f6
                  );
                "
              >
                ${avatar}
              </div>

              <div class="lider-nombre">
                ${lider.username}
              </div>

              <div class="lider-carrera">
                ${lider.carrera || 'Carrera no registrada'}
              </div>

              <span class="lider-proyecto" style="background:#5CA09E;">
                ${lider.proyectos || 'Sin proyectos asignados'}
              </span>

            </div>
            

          </a>
        `;

      }
    );

  }
);