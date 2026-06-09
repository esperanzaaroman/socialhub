let roleToCreate = null;
async function cargarInfo (){
  try {
  const respuesta = await fetch(
            'http://localhost:3000/api/proyectos'
        );

        console.log('entre a cargarInfo')
        const proyectos = await respuesta.json();
        console.log("Proyecto recibido:", proyectos);

        const numProyectosInAct = proyectos.filter(proyecto => proyecto.estado === 'inactivo').length;
        const numProyectos = proyectos.length;
        const numProyectosActivos =  proyectos.filter(proyecto => proyecto.estado === 'activo').length;

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
      } catch (error) {

        console.error(error);

      }
};
document.addEventListener(
  'DOMContentLoaded',
  async function() {

    await verificarAdmin();

    const usuario =
      await obtenerUsuarioActual();

    await cargarNavbar(
      'dashboard'
    );

    const welcomeName =
      document.getElementById(
        'welcome-name'
      );

    if (welcomeName && usuario.username) {
      welcomeName.textContent =
        usuario.username;
    }

    const btnCreateLeader =
      document.getElementById('btn-create-leader');

    const btnCreateAdmin =
      document.getElementById('btn-create-admin');

    const modal =
      document.getElementById('create-user-modal');

    const modalTitle =
      document.getElementById('modal-title');

    const carreraInput =
      document.getElementById('new-carrera');

    const cancelBtn =
      document.getElementById('cancel-create-user');

    function abrirModal(role) {

      roleToCreate =
        role;

      if (modal) {
        modal.style.display =
          'flex';
      }

      if (role === 'lider') {

        if (modalTitle) {
          modalTitle.textContent =
            'Registrar líder';
        }

        if (carreraInput) {
          carreraInput.style.display =
            'block';
        }

      }
      else {

        if (modalTitle) {
          modalTitle.textContent =
            'Registrar admin';
        }

        if (carreraInput) {
          carreraInput.style.display =
            'none';
        }

      }

    }

    if (btnCreateLeader) {
      btnCreateLeader.addEventListener(
        'click',
        function() {
          abrirModal('lider');
        }
      );
    }

    if (btnCreateAdmin) {
      btnCreateAdmin.addEventListener(
        'click',
        function() {
          abrirModal('admin');
        }
      );
    }

    if (cancelBtn) {
      cancelBtn.addEventListener(
        'click',
        function() {
          if (modal) {
            modal.style.display =
              'none';
          }
        }
      );
    }

    const saveBtn =
      document.getElementById(
        'save-create-user'
      );

    if (saveBtn) {

  saveBtn.addEventListener(
    'click',
    async function() {

      const username =
        document.getElementById(
          'new-username'
        ).value;

      const correo =
        document.getElementById(
          'new-email'
        ).value;

      const contrasena =
        document.getElementById(
          'new-password'
        ).value;

      const carrera =
        document.getElementById(
          'new-carrera'
        ).value;

      const token =
        localStorage.getItem(
          'token'
        );

      
      if (!username || !correo || !contrasena || !roleToCreate) {
  mostrarMensajeCrearUsuario(
    'Completa todos los campos obligatorios',
    'error'
  );
  return;
}

if (username.length < 3 || username.length > 50) {
  mostrarMensajeCrearUsuario(
    'El nombre debe tener entre 3 y 50 caracteres',
    'error'
  );
  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(correo)) {
  mostrarMensajeCrearUsuario(
    'Ingresa un correo válido',
    'error'
  );
  return;
}

if (contrasena.length < 6) {
  mostrarMensajeCrearUsuario(
    'La contraseña temporal debe tener al menos 6 caracteres',
    'error'
  );
  return;
}

if (roleToCreate === 'lider' && !carrera) {
  mostrarMensajeCrearUsuario(
    'La carrera es obligatoria para líderes, si no la conoce, introduzca "desconocido"',
    'error'
  );
  return;
}

      const response =
        await fetch(
          '/api/auth/admin/create-user',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              username,
              correo,
              contrasena,
              role: roleToCreate,
              carrera
            })
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          'Usuario creado correctamente ✅'
        );

        modal.style.display =
          'none';

      }
      else {

        alert(
          data.mensaje ||
          'Error creando usuario'
        );

      }

    }
  );

}

const createUserMessage =
  document.getElementById('create-user-message');

function mostrarMensajeCrearUsuario(mensaje, tipo) {
  if (!createUserMessage) return;

  createUserMessage.textContent = mensaje;
  createUserMessage.style.display = 'block';

  if (tipo === 'success') {
    createUserMessage.style.background = 'var(--verde-light)';
    createUserMessage.style.color = 'var(--verde-dark)';
  }
  else {
    createUserMessage.style.background = '#fee2e2';
    createUserMessage.style.color = '#991b1b';
  }
}
  cargarInfo();
  cargarInfoBeneficiarios();
  cargarInfoPrestadores();
  cargarInfoHoras();
  }
);
async function cargarInfoProyectos (){
    try {
    const respuesta = await fetch(
              'http://localhost:3000/api/proyectos'
          );

          console.log('entre a cargarInfo')
          const proyectos = await respuesta.json();
          console.log("Proyecto recibido:", proyectos);

          const numProyectosInAct = proyectos.filter(proyecto => proyecto.estado === 'inactivo').length;
          const numProyectos = proyectos.length;
          const numProyectosActivos =  proyectos.filter(proyecto => proyecto.estado === 'activo').length;

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
        } catch (error) {

          console.error(error);

        }
  };
async function cargarInfoHoras(){
  try {
    const respuesta = await fetch('http://localhost:3000/api/horas');
    const json = await respuesta.json();
    const horas = json.data;


    const conteo = horas.reduce((acc, item) => {
        acc[item.id_proyecto] = (acc[item.id_proyecto] || 0) + 1;
        return acc;
    }, {});

    const sumaHoras = horas.reduce((acc, item) => {
        acc[item.id_proyecto] =
            (acc[item.id_proyecto] || 0) + parseFloat(item.horas);

        return acc;
    }, {});
    
    const horasPorAnio = horas.reduce((acc, item) => {
        acc[item.anio] = (acc[item.anio] || 0) + parseFloat(item.horas);
        return acc;
    }, {});

    const anioActual = new Date().getFullYear();
    const anioAnterior = new Date().getFullYear()-1;

    console.log(horasPorAnio[anioActual]);
    const difHrs = horasPorAnio[anioActual]-(horasPorAnio[anioAnterior]||0);

    document.getElementById('dif-hrs').innerText= difHrs;
    const totalHoras = horas.reduce(
        (acc, item) => acc + parseFloat(item.horas),
        0
    );
    console.log(totalHoras);
    const numHrs = document.querySelectorAll('.num-hrs');

    numHrs.forEach(n=>{
      n.innerText = `${totalHoras}`;
    })
    const colores = [
      'var(--azul)',
      'var(--verde)',
      'var(--naranja)',
      'var(--morado)'
    ];

    const horasPorPeriodo = horas
      .filter(item => item.anio === anioActual)
      .reduce((acc, item) => {
          acc[item.periodo] = (acc[item.periodo] || 0) + parseFloat(item.horas);
          return acc;
      }, {});
    console.log(horasPorPeriodo);
      document.querySelector('.anio-actual').textContent =
            `Por periodo (${anioActual})`;
    const contenedor = document.getElementById('period-hrs');
    const maxHoras = Math.max(...Object.values(horasPorPeriodo));

    contenedor.innerHTML = '';

    Object.entries(horasPorPeriodo).forEach(([periodo, horas], index) => {
        const porcentaje = (horas / maxHoras) * 100;

        contenedor.innerHTML += `
            <div class="period-row">
                <span class="period-name" style="width:80px;font-size:11px">
                    ${periodo}
                </span>

                <div class="period-bar-wrap">
                    <div class="period-bar-bg">
                        <div
                            class="period-bar-fill"
                            style="
                                width:${porcentaje}%;
                                background:${colores[index % colores.length]};
                                height:8px;
                                border-radius:10px;
                            ">
                        </div>
                    </div>
                </div>

                <span class="period-val">${horas}h</span>
            </div>
        `;
    });


  }catch(error){
    console.log(error);
  }
}


async function cargarInfoPrestadores() {
    try {
        const respuesta   = await fetch('http://localhost:3000/api/prestadores');
        const json        = await respuesta.json();
        const prestadores = json.data;
 
        renderPeriodoBars(prestadores);
        renderAnualBars(prestadores);
 
    } catch (error) {
        console.error('Error cargando prestadores:', error);
    }
}
 
// ── Barras por periodo ────────────────────────────────────────────────────────
 
function renderPeriodoBars(prestadores) {
    const COLORES = {
        'Intensivo Invierno': 'var(--azul)',
        'regular':            'var(--verde)',
        'Verano':             'var(--naranja)',
        'Ago-Dic':            'var(--morado)',
    };
    // Fallback para periodos no mapeados
    const COLORES_EXTRA = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ec4899','#14b8a6'];
 
    const porPeriodo = prestadores.reduce((acc, p) => {
        const periodo = p.periodo || 'Sin periodo';
        acc[periodo] = (acc[periodo] || 0) + 1;
        return acc;
    }, {});
 
    const total  = prestadores.length;
    const maximo = Math.max(...Object.values(porPeriodo));
 
    const contenedor = document.querySelector('.period-bars');
    if (!contenedor) return;
 
    contenedor.innerHTML = '';
 
    Object.entries(porPeriodo).forEach(([periodo, cnt], i) => {
        const pct   = maximo > 0 ? Math.round((cnt / maximo) * 100) : 0;
        const color = COLORES[periodo] || COLORES_EXTRA[i % COLORES_EXTRA.length];
 
        contenedor.innerHTML += `
            <div class="period-row">
                <span class="period-name">${periodo}</span>
                <div class="period-bar-wrap">
                    <div class="period-bar-bg">
                        <div class="period-bar-fill" style="width:${pct}%;background:${color};height:100%;transition:width .6s ease;"></div>
                    </div>
                </div>
                <span class="period-val">${cnt}</span>
            </div>`;
    });
 
    // Total acumulado
    const totalEl = document.querySelector('#sec-prestadores [style*="font-size:24px"]');
    if (totalEl) totalEl.innerText = total;
 
    // También actualiza .num-pre si existe
    document.querySelectorAll('.num-pre').forEach(n => n.innerText = total);
}
 
// ── Barras CSS por año ────────────────────────────────────────────────────────
 
function renderAnualBars(prestadores) {
    const porAnio = prestadores.reduce((acc, p) => {
        const anio = p.anio || new Date(p.fecha_alta).getFullYear();
        if (anio && anio > 2000) acc[anio] = (acc[anio] || 0) + 1;
        return acc;
    }, {});
 
    const anios  = Object.keys(porAnio).sort();
    const counts = anios.map(a => porAnio[a]);
    const maximo = Math.max(...counts);
    const total  = prestadores.length;
 
    // Crecimiento
    const primero  = counts[0] || 0;
    const ultimo   = counts[counts.length - 1] || 0;
    const pct      = primero > 0 ? Math.round(((ultimo - primero) / primero) * 100) : 0;
    const promedio = anios.length > 1
        ? Math.round((total - primero) / (anios.length - 1))
        : total;
 
    const contenedor = document.querySelector('.bar-chart-css');
    if (!contenedor) return;
 
    // Altura máxima visual = 96px (igual que el diseño original)
    const ALTURA_MAX = 96;
 
    contenedor.innerHTML = anios.map((anio, i) => {
        const cnt    = counts[i];
        const altura = maximo > 0 ? Math.round((cnt / maximo) * ALTURA_MAX) : 10;
        const esUltimo = i === anios.length - 1;
        return `
            <div class="bar-col">
                <span class="bar-val">${cnt}</span>
                <div class="bar-fill${esUltimo ? ' naranja' : ''}" style="height:${altura}px"></div>
                <span class="bar-label">${anio}</span>
            </div>`;
    }).join('');
 
    // Badge de crecimiento
    const badge = document.querySelector('#sec-prestadores [style*="var(--verde-light)"]');
    if (badge && anios.length > 1) {
        badge.innerHTML = `
            <div style="font-size:13px;color:var(--verde-dark);font-weight:600;">
                📈 Crecimiento ${anios[0]}–${anios[anios.length-1]}: <strong>+${pct}%</strong>
            </div>
            <div style="font-size:12px;color:var(--verde-dark);margin-top:2px;">
                Promedio anual: +${promedio} nuevos prestadores por año
            </div>`;
    }
}

function renderGraficasPrestadores(prestadores) {
    const porPeriodo = prestadores.reduce((acc, p) => {
        const periodo = p.periodo || 'Sin periodo';
        acc[periodo] = (acc[periodo] || 0) + 1;
        return acc;
    }, {});

    const periodos = Object.keys(porPeriodo);
    const cntPeriodo = periodos.map(k => porPeriodo[k]);
    const total = prestadores.length;

    const canvasPeriodo = document.getElementById('grafica-prestadores-periodo');
    if (canvasPeriodo) {
        new Chart(canvasPeriodo, {
            type: 'bar',
            data: {
                labels: periodos,
                datasets: [{
                    label: 'Prestadores',
                    data: cntPeriodo,
                    backgroundColor: ['#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899','#14b8a6'],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',   
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.x} prestadores`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8', font: { size: 11 } },
                        grid: { color: '#f1f5f9' }
                    },
                    y: {
                        ticks: { color: '#475569', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    const totalEl = document.getElementById('prestadores-total-historico');
    if (totalEl) totalEl.innerText = total;

    const porAnio = prestadores.reduce((acc, p) => {
        const anio = p.anio || new Date(p.fecha_alta).getFullYear();
        if (anio) acc[anio] = (acc[anio] || 0) + 1;
        return acc;
    }, {});

    const anios = Object.keys(porAnio).sort();
    const cntAnio = anios.map(a => porAnio[a]);

    const primero = cntAnio[0] || 0;
    const ultimo  = cntAnio[cntAnio.length - 1] || 0;
    const pct     = primero > 0 ? Math.round(((ultimo - primero) / primero) * 100) : 0;
    const promedio = anios.length > 1
        ? Math.round((total - primero) / (anios.length - 1))
        : total;

    const bgAnio = anios.map((a, i) =>
        i === anios.length - 1 ? '#f59e0b' : '#1e3a8a'
    );

    const canvasAnio = document.getElementById('grafica-prestadores-anual');
    if (canvasAnio) {
        new Chart(canvasAnio, {
            type: 'bar',
            data: {
                labels: anios,
                datasets: [{
                    data: cntAnio,
                    backgroundColor: bgAnio,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.y} prestadores`
                        }
                    },
                    // Números encima de cada barra
                    datalabels: {
                        anchor: 'end', align: 'top',
                        color: '#475569', font: { size: 11, weight: '600' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 11 } },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        display: false
                    }
                }
            }
        });
    }

    const badgeCrecimiento = document.getElementById('prestadores-crecimiento-badge');
    if (badgeCrecimiento && anios.length > 1) {
        badgeCrecimiento.innerHTML = `
            <span style="font-weight:700;">📈 Crecimiento ${anios[0]}–${anios[anios.length-1]}: +${pct}%</span><br>
            <span>Promedio anual: +${promedio} nuevos prestadores por año</span>
        `;
        badgeCrecimiento.style.display = 'block';
    }
}
async function cargarInfoBeneficiarios() {
    try {
        const respuesta      = await fetch('http://localhost:3000/api/beneficiarios');
        const json           = await respuesta.json();
        const beneficiarios  = json.data;
 
        renderBeneficiariosTotal(beneficiarios);
        renderBeneficiariosAnual(beneficiarios);
        renderBeneficiariosGenero(beneficiarios);
        renderBeneficiariosEdad(beneficiarios);
 
    } catch (error) {
        console.error('Error cargando beneficiarios:', error);
    }
}
 
// ── Total ─────────────────────────────────────────────────────────────────────
function renderBeneficiariosTotal(beneficiarios) {
    const total = beneficiarios.length;
    document.querySelectorAll('.num-ben').forEach(n => n.innerText = total.toLocaleString());
    const totalGrande = document.getElementById('ben-total-grande');
    if (totalGrande) totalGrande.innerText = total.toLocaleString();
}
 
// ── Por año ───────────────────────────────────────────────────────────────────
function renderBeneficiariosAnual(beneficiarios) {
    const porAnio = beneficiarios.reduce((acc, b) => {
        const anio = new Date(b.fecha_registro).getFullYear();
        if (anio > 2000) acc[anio] = (acc[anio] || 0) + 1;
        return acc;
    }, {});
 
    const anios   = Object.keys(porAnio).sort();
    const counts  = anios.map(a => porAnio[a]);
    const maximo  = Math.max(...counts);
    const ALTURA_MAX = 120;
 
    const contenedor = document.getElementById('ben-barras-anual');
    if (!contenedor) return;
 
    contenedor.innerHTML = anios.map((anio, i) => {
        const cnt      = counts[i];
        const altura   = maximo > 0 ? Math.round((cnt / maximo) * ALTURA_MAX) : 10;
        const esUltimo = i === anios.length - 1;
        return `
            <div class="bar-col">
                <span class="bar-val">${cnt.toLocaleString()}</span>
                <div class="bar-fill${esUltimo ? ' naranja' : ''}" style="height:${altura}px"></div>
                <span class="bar-label">${anio}</span>
            </div>`;
    }).join('');
}
 
// ── Por género ────────────────────────────────────────────────────────────────
function renderBeneficiariosGenero(beneficiarios) {
    const total = beneficiarios.length;
 
    const porGenero = beneficiarios.reduce((acc, b) => {
        const g = b.genero || 'sin_dato';
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {});
 
    const femenino  = porGenero['femenino']  || 0;
    const masculino = porGenero['masculino'] || 0;
    const otro      = (porGenero['otro'] || 0) + (porGenero['prefiero_no_decir'] || 0);
 
    const pctF = total > 0 ? Math.round((femenino  / total) * 100) : 0;
    const pctM = total > 0 ? Math.round((masculino / total) * 100) : 0;
    const pctO = total > 0 ? Math.round((otro      / total) * 100) : 0;
 
    const contenedor = document.getElementById('ben-genero');
    if (!contenedor) return;
 
    contenedor.innerHTML = `
        <div class="ben-genero-col">
            <div class="ben-genero-num" style="color:var(--azul)">${femenino.toLocaleString()}</div>
            <div class="ben-genero-label">♀ Mujeres (${pctF}%)</div>
            <div class="ben-genero-bar-bg"><div class="ben-genero-bar-fill" style="width:${pctF}%;background:var(--azul)"></div></div>
        </div>
        <div class="ben-genero-col">
            <div class="ben-genero-num" style="color:var(--verde)">${masculino.toLocaleString()}</div>
            <div class="ben-genero-label">♂ Hombres (${pctM}%)</div>
            <div class="ben-genero-bar-bg"><div class="ben-genero-bar-fill" style="width:${pctM}%;background:var(--verde)"></div></div>
        </div>
        <div class="ben-genero-col">
            <div class="ben-genero-num" style="color:var(--morado)">${otro.toLocaleString()}</div>
            <div class="ben-genero-label">⚧ No binario (${pctO}%)</div>
            <div class="ben-genero-bar-bg"><div class="ben-genero-bar-fill" style="width:${pctO}%;background:var(--morado)"></div></div>
        </div>`;
}
 
// ── Por rango de edad ─────────────────────────────────────────────────────────
function renderBeneficiariosEdad(beneficiarios) {
    const RANGOS = [
        { label: '3–5 años',   min: 3,  max: 5,   color: 'var(--naranja)' },
        { label: '6–12 años',  min: 6,  max: 12,  color: 'var(--azul)'   },
        { label: '12–15 años', min: 12, max: 15,  color: 'var(--verde)'  },
        { label: '15–17 años', min: 15, max: 17,  color: 'var(--morado)' },
        { label: '18–23+ años',min: 18, max: 999, color: '#1e3a8a'       },
    ];
 
    const conteos = RANGOS.map(r => ({
        ...r,
        cnt: beneficiarios.filter(b => b.edad >= r.min && b.edad <= r.max).length
    }));
 
    const maximo = Math.max(...conteos.map(r => r.cnt));
 
    const contenedor = document.getElementById('ben-rangos-edad');
    if (!contenedor) return;
 
    contenedor.innerHTML = conteos.map(r => {
        const pct = maximo > 0 ? Math.round((r.cnt / maximo) * 100) : 0;
        return `
            <div class="period-row">
                <span class="period-name">${r.label}</span>
                <div class="period-bar-wrap">
                    <div class="period-bar-bg">
                        <div class="period-bar-fill" style="width:${pct}%;background:${r.color};height:100%;transition:width .6s ease;"></div>
                    </div>
                </div>
                <span class="period-val" style="color:${r.color};font-weight:700;">${r.cnt}</span>
            </div>`;
    }).join('');
 
    // Badge grupo más beneficiado
    const masAlto = conteos.reduce((a, b) => b.cnt > a.cnt ? b : a, conteos[0]);
    const badge   = document.getElementById('ben-grupo-badge');
    if (badge && masAlto.cnt > 0) {
        badge.innerHTML = `
            <div style="font-size:13px;color:#1e40af;font-weight:600;">
                📌 Grupo más beneficiado: <strong>${masAlto.label}</strong>
            </div>
            <div style="font-size:12px;color:#3b82f6;margin-top:2px;">
                ${masAlto.cnt} beneficiarios (${Math.round((masAlto.cnt / beneficiarios.length) * 100)}% del total)
            </div>`;
        badge.style.display = 'block';
    }
}