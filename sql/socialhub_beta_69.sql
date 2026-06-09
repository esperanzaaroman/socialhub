-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-06-2026 a las 22:48:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `socialhub`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id_admin`) VALUES
(1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos_csv`
--

CREATE TABLE `archivos_csv` (
  `id_archivo` int(11) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `nombre_archivo` varchar(50) DEFAULT NULL,
  `fecha_carga` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `beneficiarios`
--

CREATE TABLE `beneficiarios` (
  `id_beneficiario` int(11) NOT NULL,
  `id_proyecto` int(11) DEFAULT NULL,
  `nombre` varchar(30) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `genero` enum('masculino','femenino','otro','prefiero_no_decir') DEFAULT NULL,
  `edad` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `beneficiarios_stats`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `beneficiarios_stats` (
`id_proyecto` int(11)
,`total` bigint(21)
,`masculino` decimal(23,0)
,`femenino` decimal(23,0)
,`otro` decimal(23,0)
,`sin_dato_genero` decimal(23,0)
,`edad_promedio` decimal(5,1)
,`edad_minima` tinyint(3) unsigned
,`edad_maxima` tinyint(3) unsigned
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `desc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `desc`) VALUES
(1, 'Chaparritas', 'chaparritas peligrosas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario_foro`
--

CREATE TABLE `comentario_foro` (
  `id_comentario` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_publi` int(11) NOT NULL,
  `texto` text DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dashboard_widget`
--

CREATE TABLE `dashboard_widget` (
  `id_widget` int(11) NOT NULL,
  `id_proyecto` int(11) DEFAULT NULL,
  `id_metrica` int(11) DEFAULT NULL,
  `id_plantilla` int(11) DEFAULT NULL,
  `nombre_widget` varchar(100) DEFAULT NULL,
  `pos_x` int(11) DEFAULT NULL,
  `pos_y` int(11) DEFAULT NULL,
  `ancho` int(11) DEFAULT NULL,
  `alto` int(11) DEFAULT NULL,
  `ui_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `operacion` enum('SUM','AVG','COUNT','MAX','MIN') DEFAULT NULL,
  `es_obligatorio` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dashboard_widget`
--

INSERT INTO `dashboard_widget` (`id_widget`, `id_proyecto`, `id_metrica`, `id_plantilla`, `nombre_widget`, `pos_x`, `pos_y`, `ancho`, `alto`, `ui_config`, `operacion`, `es_obligatorio`) VALUES
(164, 1, 1, 1, 'Beneficiarios Totales', 0, 0, 4, 3, '{\"color\":\"#6366f1\"}', 'COUNT', 1),
(165, 2, 1, 1, 'Beneficiarios Totales', 0, 0, 4, 3, '{\"color\":\"#6366f1\"}', 'COUNT', 1),
(166, 3, 1, 1, 'Beneficiarios Totales', 0, 0, 4, 3, '{\"color\":\"#6366f1\"}', 'COUNT', 1),
(167, 1, 2, 1, 'Prestadores Activos', 4, 0, 4, 3, '{\"color\":\"#10b981\"}', 'COUNT', 1),
(168, 2, 2, 1, 'Prestadores Activos', 4, 0, 4, 3, '{\"color\":\"#10b981\"}', 'COUNT', 1),
(169, 3, 2, 1, 'Prestadores Activos', 4, 0, 4, 3, '{\"color\":\"#10b981\"}', 'COUNT', 1),
(170, 1, 3, 1, 'Horas de Servicio', 8, 0, 4, 3, '{\"color\":\"#f59e0b\"}', 'SUM', 1),
(171, 2, 3, 1, 'Horas de Servicio', 8, 0, 4, 3, '{\"color\":\"#f59e0b\"}', 'SUM', 1),
(172, 3, 3, 1, 'Horas de Servicio', 8, 0, 4, 3, '{\"color\":\"#f59e0b\"}', 'SUM', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas_proyecto`
--

CREATE TABLE `horas_proyecto` (
  `id_horas` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `horas` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_img` int(11) NOT NULL,
  `id_proyecto` int(11) DEFAULT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lider`
--

CREATE TABLE `lider` (
  `id_lider` int(11) NOT NULL,
  `carrera` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lider`
--

INSERT INTO `lider` (`id_lider`, `carrera`, `estado`) VALUES
(1, 'ITC', 'activo'),
(2, 'ITC', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lider_proyecto`
--

CREATE TABLE `lider_proyecto` (
  `id_lider` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `fecha_asignacion` datetime DEFAULT current_timestamp(),
  `rol` varchar(50) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lider_proyecto`
--

INSERT INTO `lider_proyecto` (`id_lider`, `id_proyecto`, `fecha_asignacion`, `rol`, `estado`) VALUES
(1, 1, '2026-06-04 18:30:17', NULL, 'activo'),
(1, 2, '2026-06-05 18:29:22', NULL, 'activo'),
(2, 3, '2026-06-05 18:59:31', NULL, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `like_foro`
--

CREATE TABLE `like_foro` (
  `id_like` int(11) NOT NULL,
  `id_publi` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_like` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metricas_proyecto`
--

CREATE TABLE `metricas_proyecto` (
  `id_metrica` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `unidad` varchar(50) DEFAULT NULL,
  `es_general` tinyint(1) NOT NULL DEFAULT 0,
  `id_proyecto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metricas_proyecto`
--

INSERT INTO `metricas_proyecto` (`id_metrica`, `nombre`, `unidad`, `es_general`, `id_proyecto`) VALUES
(1, 'Beneficiarios Totales', 'Beneficiarios', 1, NULL),
(2, 'Prestadores Activos', 'Prestadores', 1, NULL),
(3, 'Horas de Servicio', 'Horas', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modificacion`
--

CREATE TABLE `modificacion` (
  `id_modificacion` int(11) NOT NULL,
  `id_proyecto` int(11) DEFAULT NULL,
  `id_lider` int(11) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ods`
--

CREATE TABLE `ods` (
  `id_ods` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ods`
--

INSERT INTO `ods` (`id_ods`, `nombre`) VALUES
(1, 'ODS 1: Fin de la pobreza'),
(2, 'ODS 2: Hambre cero'),
(3, 'ODS 3: Salud y bienestar'),
(4, 'ODS 4: Educación de calidad'),
(5, 'ODS 5: Igualdad de género'),
(6, 'ODS 6: Agua limpia y saneamiento'),
(7, 'ODS 7: Energía asequible y no contaminante'),
(8, 'ODS 8: Trabajo decente y crecimiento económico'),
(9, 'ODS 9: Industria, innovación e infraestructura'),
(10, 'ODS 10: Reducción de las desigualdades'),
(11, 'ODS 11: Ciudades y comunidades sostenibles'),
(12, 'ODS 12: Producción y consumo responsables'),
(13, 'ODS 13: Acción por el clima'),
(14, 'ODS 14: Vida submarina'),
(15, 'ODS 15: Vida de ecosistemas terrestres'),
(16, 'ODS 16: Paz, justicia e instituciones sólidas'),
(17, 'ODS 17: Alianzas para lograr los objetivos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plantilla`
--

CREATE TABLE `plantilla` (
  `id_plantilla` int(11) NOT NULL,
  `id_visualizacion` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `parametros_render` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`parametros_render`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plantilla`
--

INSERT INTO `plantilla` (`id_plantilla`, `id_visualizacion`, `nombre`, `descripcion`, `parametros_render`) VALUES
(1, 1, 'Métrica Pura (Valor Único)', 'Muestra el resultado bruto de una operación (Ej: un KPI gigante).', '{\"tipo_visual\":\"kpi_puro\"}'),
(2, 2, 'Gráfica Personalizada (Datos DB)', 'Renderiza una gráfica usando los datos históricos ya cargados en la base de datos.', '{\"tipo_visual\":\"grafica_db\"}'),
(3, 2, 'Gráfica Dinámica desde CSV', 'Permite al usuario subir un archivo CSV en el momento para dibujar una gráfica instantánea.', '{\"tipo_visual\":\"grafica_csv\"}'),
(4, 2, 'Gráfica de Barras Porcentual', 'Muestra los datos en formato de barra calculando el porcentaje respecto a una meta.', '{\"tipo_visual\":\"barra_porcentaje\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `poblacion_objetivo`
--

CREATE TABLE `poblacion_objetivo` (
  `id_poblacion` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `desc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `poblacion_objetivo`
--

INSERT INTO `poblacion_objetivo` (`id_poblacion`, `nombre`, `desc`) VALUES
(1, 'chaparritas con hambre', 'holiu');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `poblacion_proyecto`
--

CREATE TABLE `poblacion_proyecto` (
  `id_poblacion` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id_proyecto` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion_corta` varchar(200) DEFAULT NULL,
  `descripcion_larga` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `periodo` enum('regular','Intensivo Invierno','Intensivo verano') DEFAULT NULL,
  `video_url` varchar(150) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyecto`
--

INSERT INTO `proyecto` (`id_proyecto`, `nombre`, `descripcion_corta`, `descripcion_larga`, `id_categoria`, `fecha_inicio`, `fecha_fin`, `periodo`, `video_url`, `estado`) VALUES
(1, 'chaparritas peligrosas', 'hola soy chaparrita', 'jiji ', 1, '2026-06-04', '2026-07-05', 'regular', 'https://www.youtube.com/watch?v=QDia3e12czc', 'activo'),
(2, 'Hermoso', 'ser hermoso', '123', 1, '2026-06-05', '2026-06-06', 'regular', 'https://www.youtube.com/watch?v=QDia3e12czc', 'activo'),
(3, 'reina y madre', 'hermosa', '123', 1, '2026-06-16', '2026-06-05', 'Intensivo Invierno', 'https://www.youtube.com/watch?v=QDia3e12czc', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto_ods`
--

CREATE TABLE `proyecto_ods` (
  `id_proyecto` int(11) NOT NULL,
  `id_ods` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyecto_ods`
--

INSERT INTO `proyecto_ods` (`id_proyecto`, `id_ods`) VALUES
(1, 3),
(2, 15),
(3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto_prestador`
--

CREATE TABLE `proyecto_prestador` (
  `id_proyecto_prestador` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `estatus` varchar(20) DEFAULT 'activo',
  `fecha_alta` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion_foro`
--

CREATE TABLE `publicacion_foro` (
  `id_publi` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `texto` text DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `id_proyecto` int(11) DEFAULT NULL,
  `multimedia_publi` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_proyectos`
--

CREATE TABLE `registro_proyectos` (
  `id_registro` int(11) NOT NULL,
  `id_proyecto` int(11) DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_proyectos`
--

INSERT INTO `registro_proyectos` (`id_registro`, `id_proyecto`, `id_admin`, `fecha_registro`) VALUES
(1, 1, 1, '2026-06-04 18:30:17'),
(2, 2, 1, '2026-06-05 18:29:22'),
(3, 3, 1, '2026-06-05 18:59:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `testimonio`
--

CREATE TABLE `testimonio` (
  `id_testimonio` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `texto` text NOT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `testimonio`
--

INSERT INTO `testimonio` (`id_testimonio`, `id_proyecto`, `texto`, `fecha_hora`) VALUES
(1, 1, 'las mejores chaparritas', '2026-06-07 00:23:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` date DEFAULT NULL,
  `foto_perfil` varchar(200) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `linkedin` varchar(150) DEFAULT NULL,
  `cvu` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `username`, `correo`, `contrasena`, `fecha_registro`, `foto_perfil`, `telefono`, `linkedin`, `cvu`) VALUES
(1, 'Admin', 'admin@gmail.com', '$2b$10$9JZw7omSAtz4idJ9rlh8Me4DcvBiZl7jlMGc2wUhiQoc.g/bgUC42', NULL, NULL, NULL, NULL, NULL),
(2, 'mariani', 'hermosa@reina.com', '$2b$10$zGAxUDV.Z9q.86dicxNfI.JgebONEQPDKEbhwXBdKF5Q0Yepx9K4G', '2026-06-05', 'uploads/perfiles/perfil-2-1780726813693.JPG', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valores_metricas`
--

CREATE TABLE `valores_metricas` (
  `id_valor` int(11) NOT NULL,
  `id_metrica` int(11) DEFAULT NULL,
  `id_archivo` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor_decimal` decimal(10,2) DEFAULT NULL,
  `valor_entero` int(11) DEFAULT NULL,
  `valor_texto` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valores_metricas`
--

INSERT INTO `valores_metricas` (`id_valor`, `id_metrica`, `id_archivo`, `fecha`, `valor_decimal`, `valor_entero`, `valor_texto`) VALUES
(507, 3, NULL, '2026-06-08 06:00:00', 20.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_all_projects`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_all_projects` (
`id_proyecto` int(11)
,`nombre` varchar(50)
,`estado` enum('activo','inactivo')
,`lider` mediumtext
,`periodo` varchar(23)
,`ods` mediumtext
,`categoria` varchar(30)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_proyecto_completo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_proyecto_completo` (
`id_proyecto` int(11)
,`nombre` varchar(50)
,`descripcion_corta` varchar(200)
,`descripcion_larga` text
,`id_categoria` int(11)
,`fecha_inicio` date
,`fecha_fin` date
,`periodo` enum('regular','Intensivo Invierno','Intensivo verano')
,`video_url` varchar(150)
,`estado` enum('activo','inactivo')
,`categoria` varchar(30)
,`ods` mediumtext
,`poblacion` mediumtext
,`lider` mediumtext
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visualizacion`
--

CREATE TABLE `visualizacion` (
  `id_visualizacion` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visualizacion`
--

INSERT INTO `visualizacion` (`id_visualizacion`, `tipo`) VALUES
(1, 'kpi'),
(2, 'grafica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visualizacion_color`
--

CREATE TABLE `visualizacion_color` (
  `id_visual_color` int(11) NOT NULL,
  `id_visual` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visualizacion_color`
--

INSERT INTO `visualizacion_color` (`id_visual_color`, `id_visual`, `color`) VALUES
(1, NULL, '#6366f1'),
(2, NULL, '#10b981');

-- --------------------------------------------------------

--
-- Estructura para la vista `beneficiarios_stats`
--
DROP TABLE IF EXISTS `beneficiarios_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `beneficiarios_stats`  AS SELECT `beneficiarios`.`id_proyecto` AS `id_proyecto`, count(0) AS `total`, sum(`beneficiarios`.`genero` = 'masculino') AS `masculino`, sum(`beneficiarios`.`genero` = 'femenino') AS `femenino`, sum(`beneficiarios`.`genero` = 'otro') AS `otro`, sum(`beneficiarios`.`genero` is null) AS `sin_dato_genero`, round(avg(`beneficiarios`.`edad`),1) AS `edad_promedio`, min(`beneficiarios`.`edad`) AS `edad_minima`, max(`beneficiarios`.`edad`) AS `edad_maxima` FROM `beneficiarios` GROUP BY `beneficiarios`.`id_proyecto` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_all_projects`
--
DROP TABLE IF EXISTS `vista_all_projects`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_all_projects`  AS SELECT `p`.`id_proyecto` AS `id_proyecto`, `p`.`nombre` AS `nombre`, `p`.`estado` AS `estado`, group_concat(distinct `u`.`username` separator ', ') AS `lider`, concat(date_format(`p`.`fecha_inicio`,'%Y-%m-%d'),' a ',date_format(`p`.`fecha_fin`,'%Y-%m-%d')) AS `periodo`, group_concat(distinct `o`.`id_ods` separator ', ') AS `ods`, `c`.`nombre` AS `categoria` FROM (((((`proyecto` `p` left join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) left join `proyecto_ods` `po` on(`p`.`id_proyecto` = `po`.`id_proyecto`)) left join `ods` `o` on(`po`.`id_ods` = `o`.`id_ods`)) left join `lider_proyecto` `lo` on(`p`.`id_proyecto` = `lo`.`id_proyecto`)) left join `usuario` `u` on(`lo`.`id_lider` = `u`.`id_usuario`)) GROUP BY `p`.`id_proyecto` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_proyecto_completo`
--
DROP TABLE IF EXISTS `vista_proyecto_completo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_proyecto_completo`  AS SELECT `p`.`id_proyecto` AS `id_proyecto`, `p`.`nombre` AS `nombre`, `p`.`descripcion_corta` AS `descripcion_corta`, `p`.`descripcion_larga` AS `descripcion_larga`, `p`.`id_categoria` AS `id_categoria`, `p`.`fecha_inicio` AS `fecha_inicio`, `p`.`fecha_fin` AS `fecha_fin`, `p`.`periodo` AS `periodo`, `p`.`video_url` AS `video_url`, `p`.`estado` AS `estado`, `c`.`nombre` AS `categoria`, group_concat(distinct `o`.`nombre` separator ', ') AS `ods`, group_concat(distinct `pbo`.`nombre` separator ', ') AS `poblacion`, group_concat(distinct `u`.`username` separator ', ') AS `lider` FROM (((((((`proyecto` `p` left join `proyecto_ods` `po` on(`p`.`id_proyecto` = `po`.`id_proyecto`)) left join `lider_proyecto` `lo` on(`p`.`id_proyecto` = `lo`.`id_proyecto`)) left join `poblacion_proyecto` `pp` on(`p`.`id_proyecto` = `pp`.`id_proyecto`)) left join `poblacion_objetivo` `pbo` on(`pp`.`id_poblacion` = `pbo`.`id_poblacion`)) left join `ods` `o` on(`po`.`id_ods` = `o`.`id_ods`)) left join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) left join `usuario` `u` on(`lo`.`id_lider` = `u`.`id_usuario`)) GROUP BY `p`.`id_proyecto` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indices de la tabla `archivos_csv`
--
ALTER TABLE `archivos_csv`
  ADD PRIMARY KEY (`id_archivo`);

--
-- Indices de la tabla `beneficiarios`
--
ALTER TABLE `beneficiarios`
  ADD PRIMARY KEY (`id_beneficiario`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `comentario_foro`
--
ALTER TABLE `comentario_foro`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_publi` (`id_publi`);

--
-- Indices de la tabla `dashboard_widget`
--
ALTER TABLE `dashboard_widget`
  ADD PRIMARY KEY (`id_widget`),
  ADD KEY `id_proyecto` (`id_proyecto`),
  ADD KEY `id_metrica` (`id_metrica`),
  ADD KEY `id_plantilla` (`id_plantilla`);

--
-- Indices de la tabla `horas_proyecto`
--
ALTER TABLE `horas_proyecto`
  ADD PRIMARY KEY (`id_horas`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_img`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `lider`
--
ALTER TABLE `lider`
  ADD PRIMARY KEY (`id_lider`);

--
-- Indices de la tabla `lider_proyecto`
--
ALTER TABLE `lider_proyecto`
  ADD PRIMARY KEY (`id_lider`,`id_proyecto`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `like_foro`
--
ALTER TABLE `like_foro`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `id_publi` (`id_publi`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `metricas_proyecto`
--
ALTER TABLE `metricas_proyecto`
  ADD PRIMARY KEY (`id_metrica`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `modificacion`
--
ALTER TABLE `modificacion`
  ADD PRIMARY KEY (`id_modificacion`),
  ADD KEY `id_proyecto` (`id_proyecto`),
  ADD KEY `id_lider` (`id_lider`);

--
-- Indices de la tabla `ods`
--
ALTER TABLE `ods`
  ADD PRIMARY KEY (`id_ods`);

--
-- Indices de la tabla `plantilla`
--
ALTER TABLE `plantilla`
  ADD PRIMARY KEY (`id_plantilla`),
  ADD KEY `id_visualizacion` (`id_visualizacion`);

--
-- Indices de la tabla `poblacion_objetivo`
--
ALTER TABLE `poblacion_objetivo`
  ADD PRIMARY KEY (`id_poblacion`);

--
-- Indices de la tabla `poblacion_proyecto`
--
ALTER TABLE `poblacion_proyecto`
  ADD PRIMARY KEY (`id_poblacion`,`id_proyecto`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`id_proyecto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `proyecto_ods`
--
ALTER TABLE `proyecto_ods`
  ADD PRIMARY KEY (`id_proyecto`,`id_ods`),
  ADD KEY `id_ods` (`id_ods`);

--
-- Indices de la tabla `proyecto_prestador`
--
ALTER TABLE `proyecto_prestador`
  ADD PRIMARY KEY (`id_proyecto_prestador`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `publicacion_foro`
--
ALTER TABLE `publicacion_foro`
  ADD PRIMARY KEY (`id_publi`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `registro_proyectos`
--
ALTER TABLE `registro_proyectos`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `id_proyecto` (`id_proyecto`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indices de la tabla `testimonio`
--
ALTER TABLE `testimonio`
  ADD PRIMARY KEY (`id_testimonio`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `valores_metricas`
--
ALTER TABLE `valores_metricas`
  ADD PRIMARY KEY (`id_valor`),
  ADD KEY `id_metrica` (`id_metrica`),
  ADD KEY `id_archivo` (`id_archivo`);

--
-- Indices de la tabla `visualizacion`
--
ALTER TABLE `visualizacion`
  ADD PRIMARY KEY (`id_visualizacion`);

--
-- Indices de la tabla `visualizacion_color`
--
ALTER TABLE `visualizacion_color`
  ADD PRIMARY KEY (`id_visual_color`),
  ADD KEY `id_visual` (`id_visual`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `archivos_csv`
--
ALTER TABLE `archivos_csv`
  MODIFY `id_archivo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `beneficiarios`
--
ALTER TABLE `beneficiarios`
  MODIFY `id_beneficiario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comentario_foro`
--
ALTER TABLE `comentario_foro`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `dashboard_widget`
--
ALTER TABLE `dashboard_widget`
  MODIFY `id_widget` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT de la tabla `horas_proyecto`
--
ALTER TABLE `horas_proyecto`
  MODIFY `id_horas` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_img` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `like_foro`
--
ALTER TABLE `like_foro`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metricas_proyecto`
--
ALTER TABLE `metricas_proyecto`
  MODIFY `id_metrica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `modificacion`
--
ALTER TABLE `modificacion`
  MODIFY `id_modificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ods`
--
ALTER TABLE `ods`
  MODIFY `id_ods` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `plantilla`
--
ALTER TABLE `plantilla`
  MODIFY `id_plantilla` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `poblacion_objetivo`
--
ALTER TABLE `poblacion_objetivo`
  MODIFY `id_poblacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  MODIFY `id_proyecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proyecto_prestador`
--
ALTER TABLE `proyecto_prestador`
  MODIFY `id_proyecto_prestador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicacion_foro`
--
ALTER TABLE `publicacion_foro`
  MODIFY `id_publi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `registro_proyectos`
--
ALTER TABLE `registro_proyectos`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `testimonio`
--
ALTER TABLE `testimonio`
  MODIFY `id_testimonio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `valores_metricas`
--
ALTER TABLE `valores_metricas`
  MODIFY `id_valor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=508;

--
-- AUTO_INCREMENT de la tabla `visualizacion`
--
ALTER TABLE `visualizacion`
  MODIFY `id_visualizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `visualizacion_color`
--
ALTER TABLE `visualizacion_color`
  MODIFY `id_visual_color` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `beneficiarios`
--
ALTER TABLE `beneficiarios`
  ADD CONSTRAINT `beneficiarios_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentario_foro`
--
ALTER TABLE `comentario_foro`
  ADD CONSTRAINT `comentario_foro_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `comentario_foro_ibfk_2` FOREIGN KEY (`id_publi`) REFERENCES `publicacion_foro` (`id_publi`);

--
-- Filtros para la tabla `dashboard_widget`
--
ALTER TABLE `dashboard_widget`
  ADD CONSTRAINT `dashboard_widget_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE,
  ADD CONSTRAINT `dashboard_widget_ibfk_2` FOREIGN KEY (`id_metrica`) REFERENCES `metricas_proyecto` (`id_metrica`) ON DELETE CASCADE,
  ADD CONSTRAINT `dashboard_widget_ibfk_3` FOREIGN KEY (`id_plantilla`) REFERENCES `plantilla` (`id_plantilla`) ON DELETE CASCADE;

--
-- Filtros para la tabla `horas_proyecto`
--
ALTER TABLE `horas_proyecto`
  ADD CONSTRAINT `horas_proyecto_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `lider`
--
ALTER TABLE `lider`
  ADD CONSTRAINT `lider_ibfk_1` FOREIGN KEY (`id_lider`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `lider_proyecto`
--
ALTER TABLE `lider_proyecto`
  ADD CONSTRAINT `lider_proyecto_ibfk_1` FOREIGN KEY (`id_lider`) REFERENCES `lider` (`id_lider`) ON DELETE CASCADE,
  ADD CONSTRAINT `lider_proyecto_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `like_foro`
--
ALTER TABLE `like_foro`
  ADD CONSTRAINT `like_foro_ibfk_1` FOREIGN KEY (`id_publi`) REFERENCES `publicacion_foro` (`id_publi`),
  ADD CONSTRAINT `like_foro_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `metricas_proyecto`
--
ALTER TABLE `metricas_proyecto`
  ADD CONSTRAINT `metricas_proyecto_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `modificacion`
--
ALTER TABLE `modificacion`
  ADD CONSTRAINT `modificacion_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE,
  ADD CONSTRAINT `modificacion_ibfk_2` FOREIGN KEY (`id_lider`) REFERENCES `lider` (`id_lider`) ON DELETE SET NULL;

--
-- Filtros para la tabla `plantilla`
--
ALTER TABLE `plantilla`
  ADD CONSTRAINT `plantilla_ibfk_1` FOREIGN KEY (`id_visualizacion`) REFERENCES `visualizacion` (`id_visualizacion`) ON DELETE SET NULL;

--
-- Filtros para la tabla `poblacion_proyecto`
--
ALTER TABLE `poblacion_proyecto`
  ADD CONSTRAINT `poblacion_proyecto_ibfk_1` FOREIGN KEY (`id_poblacion`) REFERENCES `poblacion_objetivo` (`id_poblacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `poblacion_proyecto_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD CONSTRAINT `proyecto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE SET NULL;

--
-- Filtros para la tabla `proyecto_ods`
--
ALTER TABLE `proyecto_ods`
  ADD CONSTRAINT `proyecto_ods_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE,
  ADD CONSTRAINT `proyecto_ods_ibfk_2` FOREIGN KEY (`id_ods`) REFERENCES `ods` (`id_ods`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proyecto_prestador`
--
ALTER TABLE `proyecto_prestador`
  ADD CONSTRAINT `proyecto_prestador_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `publicacion_foro`
--
ALTER TABLE `publicacion_foro`
  ADD CONSTRAINT `publicacion_foro_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `publicacion_foro_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`);

--
-- Filtros para la tabla `registro_proyectos`
--
ALTER TABLE `registro_proyectos`
  ADD CONSTRAINT `registro_proyectos_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE,
  ADD CONSTRAINT `registro_proyectos_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`) ON DELETE SET NULL;

--
-- Filtros para la tabla `testimonio`
--
ALTER TABLE `testimonio`
  ADD CONSTRAINT `testimonio_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `valores_metricas`
--
ALTER TABLE `valores_metricas`
  ADD CONSTRAINT `valores_metricas_ibfk_1` FOREIGN KEY (`id_metrica`) REFERENCES `metricas_proyecto` (`id_metrica`) ON DELETE CASCADE,
  ADD CONSTRAINT `valores_metricas_ibfk_2` FOREIGN KEY (`id_archivo`) REFERENCES `archivos_csv` (`id_archivo`) ON DELETE SET NULL;

--
-- Filtros para la tabla `visualizacion_color`
--
ALTER TABLE `visualizacion_color`
  ADD CONSTRAINT `visualizacion_color_ibfk_1` FOREIGN KEY (`id_visual`) REFERENCES `visualizacion` (`id_visualizacion`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--- adding columnas para porder personalizar perfillll
ALTER TABLE proyecto
ADD COLUMN color_primario VARCHAR(20) DEFAULT '#1e40af',
ADD COLUMN font_titulo VARCHAR(100) DEFAULT "'Sora', sans-serif";