const {
  createTestimonio,
  getTestimoniosByProject,
  getAllTestimonios
} = require(
  '../models/testimonioModel'
);

async function createProjectTestimonio(
  req,
  res
) {

  try {

    const {
      id_proyecto,
      texto
    } = req.body;

    if (
      !id_proyecto ||
      !texto
    ) {

      return res.status(400).json({
        mensaje:
          'Completa todos los campos'
      });

    }

    const id_testimonio =
      await createTestimonio(
        id_proyecto,
        texto
      );

    res.status(201).json({
      mensaje:
        'Testimonio creado correctamente',
      id_testimonio
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje:
        'Error creando testimonio'
    });

  }

}

async function getProjectTestimonios(
  req,
  res
) {

  try {

    const testimonios =
      await getTestimoniosByProject(
        req.params.idProyecto
      );

    res.json(testimonios);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje:
        'Error obteniendo testimonios'
    });

  }

}

async function getTestimonios(req, res) {
  try {
    const testimonios = await getAllTestimonios();
    res.json(testimonios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error obteniendo testimonios' });
  }
}

module.exports = {
  createProjectTestimonio,
  getProjectTestimonios,
  getTestimonios
};