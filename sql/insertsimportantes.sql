INSERT INTO `plantilla` (`id_plantilla`, `id_visualizacion`, `nombre`, `descripcion`, `parametros_render`) VALUES
(1, 1, 'Métrica Pura (Valor Único)', 'Muestra el resultado bruto de una operación (Ej: un KPI gigante).', '{"tipo_visual":"kpi_puro"}'),
(2, 2, 'Gráfica Personalizada (Datos DB)', 'Renderiza una gráfica usando los datos históricos ya cargados en la base de datos.', '{"tipo_visual":"grafica_db"}'),
(3, 2, 'Gráfica Dinámica desde CSV', 'Permite al usuario subir un archivo CSV en el momento para dibujar una gráfica instantánea.', '{"tipo_visual":"grafica_csv"}'),
(4, 2, 'Gráfica de Barras Porcentual', 'Muestra los datos en formato de barra calculando el porcentaje respecto a una meta.', '{"tipo_visual":"barra_porcentaje"}');