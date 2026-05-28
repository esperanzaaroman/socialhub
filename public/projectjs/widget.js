

export function renderWidgets(widgets){
    const grid = document.getElementById('metrics-grid');
    const template = document.getElementById('widget-template');

    grid.innerHTML="";

    widgets.forEach(widget=>{
        const widgetClone = template.content.cloneNode(true);

        widgetClone.querySelector('.widget-title').innerText=widget.nombre_widget;
        widgetClone.querySelector('.widget-operation').innerText=`Operacion: ${widget.operacion}`;


        if(widget.ui_config && widget.ui_config.color_titulo){
            widgetClone.querySelector('.widget-title').style.color = widget.ui_config.color_titulo;
        }

        grid.appendChild(widgetClone);
    });

    
}
