document.addEventListener('DOMContentLoaded', async function () {

    const usuario = await obtenerUsuarioActual();
    await cargarNavbar('inicio');

    const loginBtn = document.getElementById('login-public-btn');
    if (usuario.role === 'admin' || usuario.role === 'lider') {
        loginBtn.style.display = 'none';
    }

    // Ejecutar todo en paralelo
    await Promise.allSettled([
        cargarMetricasFlotantes(),
        cargarProyectosDestacados(),
        cargarTestimonios(),
        cargarGraficas()
    ]);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const PALETA = ['#5CA09E', '#9B5BA5', '#D7685B', '#7AB8DD', '#E89042', '#6366f1'];

function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── Métricas flotantes ────────────────────────────────────────────────────────

async function cargarMetricasFlotantes() {
    try {
        // Proyectos activos
        const rProy    = await fetch('/api/proyectos');
        const proyectos = await rProy.json();
        const activos  = (Array.isArray(proyectos) ? proyectos : proyectos.data || [])
                            .filter(p => p.estado === 'activo');
        setText('metrica-proyectos', activos.length);
    } catch (e) { console.warn('proyectos:', e); }

    try {
        // Beneficiarios totales
        const rBen  = await fetch('/api/beneficiarios');
        const jBen  = await rBen.json();
        const bens  = jBen.data || [];
        setText('metrica-beneficiarios', bens.length.toLocaleString('es-MX') + '+');
    } catch (e) { console.warn('beneficiarios:', e); }

    try {
        // Líderes activos
        const rLid  = await fetch('/api/lideres');
        const jLid  = await rLid.json();
        const lids  = (jLid.data || jLid);
        const total = Array.isArray(lids)
            ? lids.filter(l => (l.estado || '').toLowerCase() === 'activo').length
            : 0;
        setText('metrica-lideres', total + '+');
    } catch (e) { console.warn('lideres:', e); }

    try {
        // Horas de servicio totales
        const rHrs  = await fetch('/api/horas');
        const jHrs  = await rHrs.json();
        const horas = jHrs.data || [];
        const total = horas.reduce((acc, h) => acc + parseFloat(h.horas || 0), 0);
        setText('metrica-horas', Math.round(total).toLocaleString('es-MX') + '+');
    } catch (e) { console.warn('horas:', e); }
}

// ── Proyectos destacados ──────────────────────────────────────────────────────

async function cargarProyectosDestacados() {
    const cont = document.getElementById('cuadriculaDestacados');
    if (!cont) return;

    try {
        const r       = await fetch('/api/proyectos');
        const data    = await r.json();
        const activos = (Array.isArray(data) ? data : data.data || [])
                            .filter(p => p.estado === 'activo');

        if (activos.length === 0) {
            cont.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:2rem;">No hay proyectos activos por el momento.</p>';
            return;
        }

        cont.innerHTML = activos.slice(0, 3).map(function (p, i) {
            const color = PALETA[i % PALETA.length];
            // p.ods puede venir como string separado por comas o como array
            const odsArr = Array.isArray(p.ods)
                ? p.ods
                : (p.ods ? p.ods.split(',').map(s => s.trim()).filter(Boolean) : []);
            const chips  = odsArr.slice(0, 3)
                .map(l => `<span class="ods-chip">${l}</span>`).join('');
            const letra  = (p.nombre || '?').charAt(0).toUpperCase();

            return `<a class="tarjeta-destacado" href="proyecto-detalle.html?id=${p.id_proyecto}">
              <div class="destacado-banner" style="background-color:${color};">
                <div class="ods-chips">${chips}</div>
                <span class="badge-estado" style="color:#15803d;">● Activo</span>
                <div class="destacado-letra">${letra}</div>
              </div>
              <div class="destacado-cuerpo">
                <div class="destacado-titulo">${p.nombre}</div>
                <div class="destacado-desc">${p.descripcion_corta || ''}</div>
              </div>
            </a>`;
        }).join('');

    } catch (e) {
        console.warn('destacados:', e);
    }
}

// ── Testimonios ───────────────────────────────────────────────────────────────

async function cargarTestimonios() {
    const cont = document.getElementById('cuadriculaTestimonios');
    if (!cont) return;

    try {
        const r    = await fetch('/api/testimonios');
        const data = await r.json();
        // El endpoint puede devolver array directo o {data: [...]}
        const lista = Array.isArray(data) ? data : (data.data || []);

        if (lista.length === 0) return;

        cont.innerHTML = lista.map(function (t, i) {
            const color        = PALETA[i % PALETA.length];
            // El nombre del proyecto puede venir en t.nombre_proyecto (si el endpoint hace join)
            // o hay que buscarlo por t.id_proyecto
            const nombreProy   = t.nombre_proyecto || t.proyecto || `Proyecto ${t.id_proyecto}`;
            const letra        = nombreProy.charAt(0).toUpperCase();

            return `<div class="tarjeta-testimonio-pub">
              <div class="comillas-pub">"</div>
              <p class="testimonio-texto-pub">${t.texto}</p>
              <div class="testimonio-pie-pub">
                <div class="avatar-pub" style="background-color:${color};">${letra}</div>
                <div>
                  <div class="testimonio-nombre-pub">${nombreProy}</div>
                  <div class="testimonio-proyecto-pub">Testimonio del proyecto</div>
                </div>
              </div>
            </div>`;
        }).join('');

    } catch (e) {
        console.warn('testimonios:', e);
    }
}

// ── Gráficas ──────────────────────────────────────────────────────────────────

async function cargarGraficas() {
    const colorCuadricula = 'rgba(100, 116, 139, 0.12)';
    const paletaGrafica   = ['#5CA09E','#9B5BA5','#E89042','#D7685B','#7AB8DD','#6366f1'];

    // Inicializar gráficas vacías
    const graficaODS = new Chart(document.getElementById('graficaODS'), {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Proyectos', data: [], backgroundColor: [], borderRadius: 6 }] },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: colorCuadricula }, ticks: { color: '#64748b', stepSize: 1 } },
                y: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
            }
        }
    });

    const graficaBenef = new Chart(document.getElementById('graficaBeneficiarios'), {
        type: 'line',
        data: { labels: [], datasets: [{
            label: 'Beneficiarios', data: [],
            borderColor: '#5CA09E', backgroundColor: 'rgba(92,160,158,0.1)',
            borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#5CA09E',
            tension: 0.35, fill: true
        }]},
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: colorCuadricula }, ticks: { color: '#64748b' } },
                y: { grid: { color: colorCuadricula }, ticks: { color: '#64748b' } }
            }
        }
    });

    // ── Gráfica ODS: desde /api/ods/stats (endpoint nuevo) ───────────────────
    try {
        const r     = await fetch('/api/ods/stats');
        const json  = await r.json();
        const lista = (json.data?.ods || []).filter(o => o.num_proyectos > 0);

        if (lista.length > 0) {
            // Extraer nombre corto: "ODS 4: Educación de calidad" → "ODS 4 · Educación"
            graficaODS.data.labels = lista.map(o => {
                const m = o.nombre.match(/ODS\s*(\d+):\s*(.+)/i);
                return m ? `ODS ${m[1]} · ${m[2].split(' ').slice(0,2).join(' ')}` : o.nombre;
            });
            graficaODS.data.datasets[0].data            = lista.map(o => o.num_proyectos);
            graficaODS.data.datasets[0].backgroundColor = lista.map((_, i) => paletaGrafica[i % paletaGrafica.length]);
            graficaODS.update();
        }
    } catch (e) {
        // Fallback: construir desde /api/proyectos si el endpoint ODS no existe aún
        try {
            const r2   = await fetch('/api/proyectos');
            const data = await r2.json();
            const proy = Array.isArray(data) ? data : (data.data || []);
            const conteo = {};
            proy.forEach(p => {
                const odsArr = Array.isArray(p.ods)
                    ? p.ods
                    : (p.ods ? p.ods.split(',').map(s => s.trim()).filter(Boolean) : []);
                odsArr.forEach(o => { conteo[o] = (conteo[o] || 0) + 1; });
            });
            const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
            graficaODS.data.labels                       = sorted.map(e => e[0]);
            graficaODS.data.datasets[0].data             = sorted.map(e => e[1]);
            graficaODS.data.datasets[0].backgroundColor = sorted.map((_, i) => paletaGrafica[i % paletaGrafica.length]);
            graficaODS.update();
        } catch (e2) { console.warn('graficaODS fallback:', e2); }
    }

    // ── Gráfica beneficiarios: acumulado histórico por mes ───────────────────
    try {
        const r    = await fetch('/api/beneficiarios');
        const json = await r.json();
        const bens = json.data || [];

        // Agrupar por mes YYYY-MM y acumular
        const porMes = {};
        bens.forEach(b => {
            const d = new Date(b.fecha_registro);
            if (isNaN(d)) return;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            porMes[key] = (porMes[key] || 0) + 1;
        });

        const meses  = Object.keys(porMes).sort();
        let acum = 0;
        const valores = meses.map(m => { acum += porMes[m]; return acum; });
        // Label legible: "Ene 2025"
        const MESES_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const labels   = meses.map(m => {
            const [y, mo] = m.split('-');
            return `${MESES_ES[parseInt(mo) - 1]} ${y}`;
        });

        if (meses.length > 0) {
            graficaBenef.data.labels             = labels;
            graficaBenef.data.datasets[0].data   = valores;
            graficaBenef.update();
        }
    } catch (e) { console.warn('graficaBenef:', e); }
}