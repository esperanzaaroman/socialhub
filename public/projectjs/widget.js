export function crearNodoKpi(widget) {
    const template = document.getElementById('widget-template-kpi');
    const clon = template.content.cloneNode(true);
    const itemElement = clon.querySelector('.grid-stack-item');
    const configUi = widget.ui_config || {};

    itemElement.setAttribute('data-id-widget', widget.id_widget);
    itemElement.querySelector('.widget-title').innerText = widget.nombre_widget;
    itemElement.querySelector('.widget-operation').innerText = widget.operacion;
    
    const valorAMostrar = widget.valor_calculado !== null && widget.valor_calculado !== undefined 
        ? widget.valor_calculado 
        : 0;
    itemElement.querySelector('.widget-value').innerText = valorAMostrar;
    
    if (configUi.color) {
        const tarjeta = itemElement.querySelector('.widget-card');
        if (tarjeta) {
            tarjeta.style.borderTop = `4px solid ${configUi.color}`;
        }
    }

    return itemElement;
}

export function crearNodoGrafica(widget) {
    const template = document.getElementById('widget-template-graph');
    const clon = template.content.cloneNode(true);
    const itemElement = clon.querySelector('.grid-stack-item');
    const configUi = widget.ui_config || {};

    itemElement.setAttribute('data-id-widget', widget.id_widget);
    itemElement.querySelector('.widget-title').innerText = widget.nombre_widget;
    
    if (configUi.color) {
        const tarjeta = itemElement.querySelector('.widget-card');
        if (tarjeta) {
            tarjeta.style.borderTop = `4px solid ${configUi.color}`;
        }
    }

    return itemElement;
}