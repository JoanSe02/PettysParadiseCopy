CREATE DATABASE mascotas_db;
USE mascotas_db;
CREATE TABLE rol (
id_rol INT PRIMARY KEY NOT NULL ,
rol VARCHAR (50) NOT NULL
);

CREATE TABLE tipo_persona (
id_tipo INT PRIMARY KEY NOT NULL ,
tipo VARCHAR (50) NOT NULL
);

CREATE TABLE usuarios (
tipo_doc ENUM('C.C','C.E') ,
id_usuario INT PRIMARY KEY NOT NULL,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(30) NOT NULL,
ciudad VARCHAR(50) NOT NULL,
direccion VARCHAR(100) NOT NULL,
telefono VARCHAR(20) NOT NULL,
fecha_nacimiento DATE NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
contrasena VARCHAR(255) NOT NULL,
id_tipo INT NOT NULL,
id_rol INT NOT NULL,
FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
FOREIGN KEY (id_tipo) REFERENCES tipo_persona(id_tipo)
);

CREATE TABLE administradores (
id_admin INT PRIMARY KEY NOT NULL,
cargo VARCHAR(100) NOT NULL,
fecha_ingreso DATE NOT NULL,
FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE propietarios (
id_pro INT PRIMARY KEY NOT NULL,
FOREIGN KEY (id_pro) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE veterinarios (
id_vet INT PRIMARY KEY NOT NULL,
especialidad VARCHAR(100)NOT NULL,
horario VARCHAR(255)NOT NULL,
FOREIGN KEY (id_vet) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE mascotas (
cod_mas INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
nom_mas VARCHAR (100) NOT NULL,
especie VARCHAR (100) NOT NULL,
raza VARCHAR (100) NOT NULL,
edad DECIMAL (10,2) NOT NULL,
genero VARCHAR(25)NOT NULL,
peso DECIMAL (10,2) NOT NULL,
id_pro INT NOT NULL,
FOREIGN KEY (id_pro) references propietarios(id_pro)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
foto VARCHAR(255) NOT NULL
);

CREATE TABLE historiales_medicos(
cod_his INT NOT NULL AUTO_INCREMENT,
fech_his DATE NOT NULL,
descrip_his TEXT,
tratamiento TEXT,
cod_mas INT NOT NULL,
PRIMARY KEY(cod_his,cod_mas),
FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
);

CREATE TABLE servicios(
cod_ser INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nom_ser VARCHAR(100)NOT NULL,
descrip_ser TEXT,
precio DECIMAL (20,2)NOT NULL
);

CREATE TABLE citas (
  cod_cit INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  fech_cit DATE NOT NULL,
  hora TIME,
  cod_ser INT,
  id_vet INT,
  cod_mas INT,
  id_pro INT NOT NULL,
  estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA') NOT NULL DEFAULT 'PENDIENTE',
  notas TEXT,
  FOREIGN KEY (cod_ser) REFERENCES servicios(cod_ser),
  FOREIGN KEY (id_pro) REFERENCES propietarios(id_pro),
  FOREIGN KEY (id_vet) REFERENCES veterinarios(id_vet),
  FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
);

INSERT INTO tipo_persona (id_tipo, tipo) VALUES
(1, 'Invitado/Tutor'),
(2, 'Medico'),
(3, 'Auxiliar Veterinario'),
(4, 'Administrativo');

INSERT INTO Rol (id_rol, rol) VALUES
(1, 'Administrador'),
(2, 'Veterinario'),
(3, 'Propietario');

INSERT INTO usuarios (
    tipo_doc, id_usuario, nombre, apellido, ciudad, direccion, telefono,
    fecha_nacimiento, email, contrasena, id_tipo, id_rol
) VALUES
('C.C', 101, 'Ana', 'Ramírez', 'Bogotá', 'Calle 123 #45-67', '3001234567', '1990-05-15', 'ana@email.com', 'clave123', 1, 1),
('C.C', 102, 'Luis', 'Martínez', 'Medellín', 'Carrera 9 #12-34', '3009876543', '1985-08-20', 'luis@email.com', 'clave123', 1, 2),
('C.E', 103, 'Carlos', 'Gómez', 'Cali', 'Av. Siempreviva 742', '3012345678', '1992-12-01', 'carlos@email.com', 'clave123', 1, 3);

-- Insertar administrador
INSERT INTO administradores (id_admin, cargo, fecha_ingreso) VALUES 
(101, 'Gerente General', '2022-01-10');

-- Insertar propietario
INSERT INTO propietarios (id_pro) VALUES 
(103);

-- Insertar veterinario
INSERT INTO veterinarios (id_vet, especialidad, horario) VALUES 
(102, 'Cirugía y diagnóstico', 'Lunes a Viernes 8:00am - 5:00pm');

-- Insertar mascotas
INSERT INTO mascotas (nom_mas, especie, raza, edad, genero, peso, id_pro, foto) VALUES
('Max', 'Perro', 'Labrador', 3.5, 'Macho', 28.5, 103, 'max.jpg'),
('Luna', 'Gato', 'Siamés', 2.0, 'Hembra', 4.2, 103, 'luna.jpg'),
('Rocky', 'Perro', 'Bulldog', 5.0, 'Macho', 22.0, 103, 'rocky.jpg');

-- Insertar historial médico
INSERT INTO historiales_medicos (
    fech_his,descrip_his, tratamiento, cod_mas
) VALUES
('2024-01-15', 'Vacunación antirrábica', 'Vacuna aplicada: RabVac', 1),
('2024-03-10', 'Chequeo general', 'Desparasitación oral', 2);

-- Insertar servicios
INSERT INTO servicios (nom_ser, descrip_ser, precio) VALUES
('Consulta General', 'Evaluación médica general para cualquier tipo de mascota.', 45000.00),
('Vacunación Antirrábica', 'Aplicación de la vacuna antirrábica obligatoria.', 30000.00),
('Desparasitación', 'Tratamiento contra parásitos internos y externos.', 25000.00),
('Esterilización', 'Procedimiento quirúrgico para esterilizar al animal.', 70000.00),
('Baño y Peluquería', 'Servicio completo de higiene y estética para la mascota.', 35000.00);

-- Insertar citas
INSERT INTO citas (
    fech_cit, hora, cod_ser, id_vet, cod_mas,id_pro, estado
) VALUES
('2025-05-10', '10:00:00', 1, 102,2,103, 'CONFIRMADA'),
('2025-05-12', '14:30:00', 2, 102, 2,103,'PENDIENTE');

ALTER TABLE rol 
CHANGE id_rol id_rol INT(11) NOT NULL COMMENT 'Identificador único del rol',
CHANGE rol rol VARCHAR(50) NOT NULL COMMENT 'Nombre del rol';

ALTER TABLE tipo_persona 
CHANGE id_tipo id_tipo INT(11) NOT NULL COMMENT 'Identificador único del tipo de persona',
CHANGE tipo tipo VARCHAR(50) NOT NULL COMMENT 'Descripción del tipo de persona';

ALTER TABLE usuarios 
CHANGE tipo_doc tipo_doc ENUM('C.C','C.E') COMMENT 'Tipo de documento de identidad',
CHANGE id_usuario id_usuario INT(11) NOT NULL COMMENT 'Identificador único del usuario',
CHANGE nombre nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
CHANGE apellido apellido VARCHAR(30) NOT NULL COMMENT 'Apellido del usuario',
CHANGE ciudad ciudad VARCHAR(50) NOT NULL COMMENT 'Ciudad de residencia del usuario',
CHANGE direccion direccion VARCHAR(100) NOT NULL COMMENT 'Dirección de residencia del usuario',
CHANGE telefono telefono VARCHAR(20) NOT NULL COMMENT 'Número de teléfono del usuario',
CHANGE fecha_nacimiento fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento del usuario',
CHANGE email email VARCHAR(100) NOT NULL COMMENT 'Correo electrónico del usuario',
CHANGE contrasena contrasena VARCHAR(255) NOT NULL COMMENT 'Contraseña del usuario',
CHANGE id_tipo id_tipo INT(11) NOT NULL COMMENT 'Tipo de persona (FK)',
CHANGE id_rol id_rol INT(11) NOT NULL COMMENT 'Rol del usuario (FK)';

ALTER TABLE administradores 
CHANGE id_admin id_admin INT(11) NOT NULL COMMENT 'Identificador del administrador (FK a usuarios)',
CHANGE cargo cargo VARCHAR(100) NOT NULL COMMENT 'Cargo del administrador',
CHANGE fecha_ingreso fecha_ingreso DATE NOT NULL COMMENT 'Fecha de ingreso del administrador';

ALTER TABLE propietarios 
CHANGE id_pro id_pro INT(11) NOT NULL COMMENT 'Identificador del propietario (FK a usuarios)';

ALTER TABLE veterinarios 
CHANGE id_vet id_vet INT(11) NOT NULL COMMENT 'Identificador del veterinario (FK a usuarios)',
CHANGE especialidad especialidad VARCHAR(100) NOT NULL COMMENT 'Especialidad del veterinario',
CHANGE horario horario VARCHAR(255) NOT NULL COMMENT 'Horario de trabajo del veterinario';

ALTER TABLE mascotas 
CHANGE cod_mas cod_mas INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único de la mascota',
CHANGE nom_mas nom_mas VARCHAR(100) NOT NULL COMMENT 'Nombre de la mascota',
CHANGE especie especie VARCHAR(100) NOT NULL COMMENT 'Especie de la mascota',
CHANGE raza raza VARCHAR(100) NOT NULL COMMENT 'Raza de la mascota',
CHANGE edad edad DECIMAL(10,2) NOT NULL COMMENT 'Edad de la mascota en años',
CHANGE genero genero VARCHAR(25) NOT NULL COMMENT 'Género de la mascota',
CHANGE peso peso DECIMAL(10,2) NOT NULL COMMENT 'Peso de la mascota en kg',
CHANGE id_pro id_pro INT(11) NOT NULL COMMENT 'Identificador del propietario (FK)',
CHANGE foto foto VARCHAR(255) NOT NULL COMMENT 'Ruta de la foto de la mascota';

ALTER TABLE historiales_medicos 
CHANGE cod_his cod_his INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Código del historial médico',
CHANGE fech_his fech_his DATE NOT NULL COMMENT 'Fecha del registro médico',
CHANGE descrip_his descrip_his TEXT COMMENT 'Descripción del diagnóstico o procedimiento',
CHANGE tratamiento tratamiento TEXT COMMENT 'Tratamiento aplicado',
CHANGE cod_mas cod_mas INT(11) NOT NULL COMMENT 'Identificador de la mascota (FK)';

ALTER TABLE servicios 
CHANGE cod_ser cod_ser INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único del servicio',
CHANGE nom_ser nom_ser VARCHAR(100) NOT NULL COMMENT 'Nombre del servicio',
CHANGE descrip_ser descrip_ser TEXT COMMENT 'Descripción detallada del servicio',
CHANGE precio precio DECIMAL(20,2) NOT NULL COMMENT 'Precio del servicio';

ALTER TABLE citas 
CHANGE cod_cit cod_cit INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Código único de la cita',
CHANGE fech_cit fech_cit DATE NOT NULL COMMENT 'Fecha programada para la cita',
CHANGE hora hora TIME COMMENT 'Hora programada para la cita',
CHANGE cod_ser cod_ser INT(11) COMMENT 'Servicio solicitado (FK)',
CHANGE id_vet id_vet INT(11) COMMENT 'Veterinario asignado (FK)',
CHANGE cod_mas cod_mas INT(11) COMMENT 'Mascota para la cita (FK)',
CHANGE id_pro id_pro INT(11) NOT NULL COMMENT 'Usuario que solicita la cita (FK)',
CHANGE estado estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA') NOT NULL DEFAULT 'PENDIENTE' COMMENT 'Estado actual de la cita',
CHANGE notas notas TEXT COMMENT 'Notas adicionales sobre la cita';

ALTER TABLE usuarios 
ADD COLUMN intentos_fallidos INT DEFAULT 0 COMMENT 'Número de intentos fallidos de inicio de sesión',
ADD COLUMN cuenta_bloqueada BOOLEAN DEFAULT FALSE COMMENT 'Indica si la cuenta está bloqueada',
ADD COLUMN fecha_bloqueo DATETIME NULL COMMENT 'Fecha y hora cuando la cuenta fue bloqueada';

