const gridStack = window.GridStack.init({
    column: 12,
    cellHeight: 80,
    animate: true,
    float: false,
    resizable: {handles: 'se'},

    margin: 20
});
export function renderWidgets(widgets){
    gridStack.removeAll();

    if (widgets.length == 0) {
        grid.innerHTML = '<p class = "n-data">Este proyecto aún no cuenta con métricas </p>';
        return;
    }

    widgets.forEach(widget=>{
        
        const configUi = widget.ui_config || {};
        const esKpi = (widget.tipo_visualizacion === 'kpi'||widget.id_plantilla===1);

        const templateId = esKpi ? 'widget-template-kpi' : 'widget-template-graph';
        const template = document.getElementById(templateId);
        const clon = template.content.cloneNode(true);

        const itemElement = clon.querySelector('.grid-stack-item');
        const tarjeta = clon.querySelector('.widget-card');

        itemElement.setAttribute('data-id-widget', widget.id_widget);

        itemElement.querySelector('.widget-title').innerText = widget.nombre_widget;

        if (configUi.color) tarjeta.style.borderTop = `4px solid ${configUi.color}`;

        if(esKpi){
            clon.querySelector('.widget-operation').innerText = widget.operacion;
            clon.querySelector('.widget-value').innerText = widget.valor_calculado;

            gridStack.makeWidget(itemElement);
            gridStack.update(itemElement, {
                x: widget.pos_x || 0, y: widget.pos_y || 0,
                w: widget.ancho || 4, h: widget.alto || 2,

                minW: 4, 
                minH: 2
            });
            
        }
        else{
            const canvas = clon.querySelector('.widget-chart');
            gridStack.makeWidget(itemElement);
            gridStack.update(itemElement, {
                x: widget.pos_x || 0, y: widget.pos_y || 0,
                w: widget.ancho || 6, h: widget.alto || 4,

                minW: 4, 
                minH: 2
            });

            const miGrafica =  new Chart(canvas, {
                type: configUi.tipo_grafica || 'bar',
                data: {
                    labels: widget.datos_grafica?.labels || ['Ene', 'Feb', 'Mar'],
                    datasets: [{
                        label: widget.nombre_widget,
                        data: widget.datos_grafica?.valores || [widget.valor_calculado, 10, 5],
                        backgroundColor: configUi.color || '#6366f1'
                    }]
                },
                options: { responsive: true, maintainAspectRatio:false }
            });
            gridStack.on('resizestop', (event, el) => {
                if (el === itemElement) {
                    setTimeout(() => {
                        miGrafica.resize();
                    }, 100 );
                    
                }
            });
        }
        itemElement.setAttribute('data-id-widget', widget.id_widget);
    });
    
}
