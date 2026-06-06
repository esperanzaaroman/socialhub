

export function renderWidgets(widgets){
    const grid = document.getElementById('metrics-grid');

    

    grid.innerHTML="";

    if (widgets.length == 0) {
        grid.innerHTML = '<p class = "n-data">Este proyecto aún no cuenta con métricas </p>';
        return;
    }
    widgets.forEach(widget=>{
        
        const configUi = widget.ui_config || {};

        if(widget.tipo_visualizacion == 'kpi'||widget.id_plantilla===1){
            const template = document.getElementById('widget-template-kpi');
            const clon = template.content.cloneNode(true);

            const tarjeta = clon.querySelector('.card-kpi');

            clon.querySelector('.widget-title').innerText = widget.nombre_widget;
            clon.querySelector('.widget-operation').innerText = widget.operacion;
            clon.querySelector('.widget-value').innerText = widget.valor_calculado;

            if (configUi.color){
                tarjeta.style.borderTop = `4px solid ${configUi.color}`;

            }
            grid.appendChild(clon);
        }
        else if(widget.tipo_visualizacion==='grafica'||widget.id_plantilla===2){
            const template = document.getElementById('widget-template-graph');
            const clon = template.content.cloneNode(true);
            
            clon.querySelector('.widget-title').innerText = widget.nombre_widget;
            
            const canvas = clon.querySelector('.widget-canvas');
            contenedor.appendChild(clon);
            
            new Chart(canvas, {
                type: configUi.tipo_grafica || 'bar',
                data: {
                    labels: widget.datos_grafica?.labels || ['Semana 1', 'Semana 2', 'Semana 3'],
                    datasets: [{
                        label: widget.nombre_widget,
                        data: widget.datos_grafica?.valores || [widget.valor_calculated, 10, 5],
                        backgroundColor: configUi.color || '#6366f1'
                    }]
                },
                options: { responsive: true }
            });
        }
    });    
}
