CREATE OR REPLACE VIEW vista_proyecto_completo AS
SELECT
    p.*,
    c.nombre AS categoria,
    GROUP_CONCAT(DISTINCT o.nombre SEPARATOR ', ') AS ods,
    GROUP_CONCAT(DISTINCT pbo.nombre SEPARATOR ', ') AS poblacion,
    GROUP_CONCAT(DISTINCT u.username SEPARATOR ', ') AS lider,
    MIN(u.id_usuario) AS id_lider,
    MIN(l.carrera) AS carrera_lider
FROM proyecto p
LEFT JOIN proyecto_ods po ON p.id_proyecto = po.id_proyecto
LEFT JOIN lider_proyecto lo ON p.id_proyecto = lo.id_proyecto
LEFT JOIN poblacion_proyecto pp ON p.id_proyecto = pp.id_proyecto
LEFT JOIN poblacion_objetivo pbo ON pp.id_poblacion = pbo.id_poblacion
LEFT JOIN ods o ON po.id_ods = o.id_ods
LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
LEFT JOIN usuario u ON lo.id_lider = u.id_usuario
LEFT JOIN lider l ON l.id_lider = u.id_usuario
GROUP BY p.id_proyecto;

