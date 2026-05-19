CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    fecha_registro DATE,
    foto_perfil VARCHAR(200),
    telefono VARCHAR(15),
    linkedin VARCHAR(150),
    cvu VARCHAR(50)
);

CREATE TABLE admin (
    id_admin INT PRIMARY KEY,
    FOREIGN KEY (id_admin) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE lider (
    id_lider INT PRIMARY KEY,
    carrera VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (id_lider) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);



CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    `desc` VARCHAR(50)
);

CREATE TABLE ods (
    id_ods INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE poblacion_objetivo (
    id_poblacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    `desc` VARCHAR(50)
);

CREATE TABLE proyecto (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion_corta VARCHAR(200),
    descripcion_larga TEXT,
    id_categoria INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    periodo ENUM('regular', 'Intensivo Invierno', 'Intensivo verano'),
    video_url VARCHAR(150),
    estado ENUM('pendiente', 'en_proceso', 'activo', 'completado') DEFAULT 'pendiente',
    correo VARCHAR(100),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL
);

CREATE TABLE imagenes (
    id_img INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE
);

CREATE TABLE beneficiarios (
    id_beneficiarios INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT,
    nombre VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE
);

-- Tablas de relación Muchos a Muchos (N:M)
CREATE TABLE poblacion_proyecto (
    id_poblacion INT,
    id_proyecto INT,
    PRIMARY KEY (id_poblacion, id_proyecto),
    FOREIGN KEY (id_poblacion) REFERENCES poblacion_objetivo(id_poblacion) ON DELETE CASCADE,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE
);

CREATE TABLE proyecto_ods (
    id_proyecto INT,
    id_ods INT,
    PRIMARY KEY (id_proyecto, id_ods),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_ods) REFERENCES ods(id_ods) ON DELETE CASCADE
);

CREATE TABLE lider_proyecto (
    id_lider INT,
    id_proyecto INT,
    fecha_asignacion DATETIME,
    rol VARCHAR(50),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    PRIMARY KEY (id_lider, id_proyecto),
    FOREIGN KEY (id_lider) REFERENCES lider(id_lider) ON DELETE CASCADE,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE
);

CREATE TABLE modificacion (
    id_modificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT,
    id_lider INT,
    fecha_modificacion DATETIME,
    descripcion VARCHAR(250),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_lider) REFERENCES lider(id_lider) ON DELETE SET NULL
);

CREATE TABLE registro_proyectos (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT,
    id_admin INT,
    fecha_registro DATETIME,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE SET NULL
);

CREATE TABLE archivos_csv (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    ruta VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(50),
    fecha_carga DATETIME
);

CREATE TABLE metricas_proyecto (
    id_metrica INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    clave VARCHAR(50)
);

CREATE TABLE valores_metricas (
    id_valor INT AUTO_INCREMENT PRIMARY KEY,
    id_metrica INT,
    id_archivo INT,
    fecha DATETIME,
    valor_decimal DECIMAL(10,2),
    valor_entero INT,
    valor_texto VARCHAR(50),
    FOREIGN KEY (id_metrica) REFERENCES metricas_proyecto(id_metrica) ON DELETE CASCADE,
    FOREIGN KEY (id_archivo) REFERENCES archivos_csv(id_archivo) ON DELETE SET NULL
);

CREATE TABLE visualizacion (
    id_visualizacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

CREATE TABLE visualizacion_color (
    id_visual_color INT AUTO_INCREMENT PRIMARY KEY,
    id_visual INT,
    color VARCHAR(50),
    FOREIGN KEY (id_visual) REFERENCES visualizacion(id_visualizacion) ON DELETE CASCADE
);

CREATE TABLE plantilla (
    id_plantilla INT AUTO_INCREMENT PRIMARY KEY,
    id_visualizacion INT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    parametros_render JSON,
    FOREIGN KEY (id_visualizacion) REFERENCES visualizacion(id_visualizacion) ON DELETE SET NULL
);

CREATE TABLE dashboard_widget (
    id_widget INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT,
    id_metrica INT,
    id_plantilla INT,
    nombre_widget VARCHAR(100),
    pos_x INT,
    pos_y INT,
    ancho INT,
    alto INT,
    id_config JSON,
    operacion ENUM('SUM', 'AVG', 'COUNT', 'MAX', 'MIN'),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_metrica) REFERENCES metricas_proyecto(id_metrica) ON DELETE CASCADE,
    FOREIGN KEY (id_plantilla) REFERENCES plantilla(id_plantilla) ON DELETE CASCADE
);

CREATE TABLE publicacion_foro (
    id_publi INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    texto TEXT,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_proyecto INT,
    multimedia_publi VARCHAR(200),

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto)
);


CREATE TABLE like_foro (
    id_like INT AUTO_INCREMENT PRIMARY KEY,
    id_publi INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_like DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_publi) REFERENCES publicacion_foro(id_publi),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE comentario_foro (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_publi INT NOT NULL,
    texto TEXT,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_publi) REFERENCES publicacion_foro(id_publi)
);

