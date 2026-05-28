document.getElementById('form-proyecto').addEventListener('submit',function(e){
    e.preventDefault();

    const datosProyecto = {
        titulo: document.getElementById('input-titulo').value,
        resumen: document.getElementById('input-resumen').value,
        categoria: document.getElementById('input-categoria').value,
        ods: document.getElementById('ods').value,
        zona: document.getElementById('input-zona').value,
        finicio: document.getElementById('input-finicio').value,
        ffin: document.getElementById('input-ffin').value,
        estado: "Activo"
    };

    try{
        const respuesta = await fetch('http://loccalhost:300/api/proyectos',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(datosProyecto)
        });
        const resultado = await respuesta.JSON();
        if(respuesta,ok){
            window.location.href=`proyecto-detalle.html?id=${resultado.id_proyecto}`;
        }else{
            alert("Error al guardar en el servidor: " + resultado.error);
        }
    }catch(error){
        console.error("El servidor de Node apagado: ", error);
    }

    

});