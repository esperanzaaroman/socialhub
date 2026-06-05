document.getElementById('form-proyecto').addEventListener('submit', async function(e){
    e.preventDefault();
    const datosProyecto = {
        titulo: document.getElementById('input-titulo').value,
        descorta: document.getElementById('input-resumen').value,
        desclarga: document.getElementById('input-desc').value,
        idcategoria: document.getElementById('categoria').value,
        ods: document.getElementById('ods').value,
        finicio: document.getElementById('input-finicio').value,
        ffin: document.getElementById('input-ffin').value,
        estado: document.getElementById('input-estado').value,
        periodo: document.getElementById('input-periodo').value,
        video: document.getElementById('input-video').value,
        id_lider: document.getElementById('input-lider').value
        
    };

    try{
        const token = localStorage.getItem('token');

        const respuesta = await fetch('http://localhost:3000/api/proyectos',{
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization': `Bearer ${token}`},
            body: JSON.stringify(datosProyecto)
        });
        const resultado = await respuesta.json();
        if(respuesta.ok){
            window.location.href=`proyecto-detalle.html?id=${resultado.id_proyecto}`;
        }else{
            alert("Error al guardar en el servidor: " + resultado.error);
        }
    }catch(error){
        console.error("El servidor de Node apagado: ", error);
    }

    

});