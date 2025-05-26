USE mascotas_db;
DELIMITER $$

-- Crear administrador
CREATE PROCEDURE CrearAdministrador(
    IN p_id_admin INT,
    IN p_cargo VARCHAR(100),
    IN p_fecha_ingreso DATE
)
BEGIN
    INSERT INTO administradores (id_admin, cargo, fecha_ingreso)
    VALUES (p_id_usuario, p_cargo, p_fecha_ingreso);
END$$

-- Obtener todos los administradores
CREATE PROCEDURE ObtenerAdministradores()
BEGIN
    SELECT a.id_admin, a.cargo, a.fecha_ingreso, 
           u.nombre, u.apellido, u.email, u.telefono
    FROM administradores a
    JOIN usuarios u ON a.id_admin = u.id_usuario;
END$$

-- Obtener administrador por ID
CREATE PROCEDURE ObtenerAdministradorPorId(
    IN p_id_admin INT
)
BEGIN
    SELECT a.id_admin, a.cargo, a.fecha_ingreso, 
           u.nombre, u.apellido, u.email, u.telefono, u.ciudad, u.direccion
    FROM administradores a
    JOIN usuarios u ON a.id_admin = u.id_usuario
    WHERE a.id_admin = p_id_admin;
END$$

-- Actualizar administrador
CREATE PROCEDURE ActualizarAdministrador(
    IN p_id_admin INT,
    IN p_cargo VARCHAR(100),
    IN p_fecha_ingreso DATE
)
BEGIN
    UPDATE administradores SET
        cargo = p_cargo,
        fecha_ingreso = p_fecha_ingreso
    WHERE id_admin = p_id_admin;
END$$

-- Eliminar administrador
CREATE PROCEDURE EliminarAdministrador(
    IN p_id_admin INT
)
BEGIN
    DELETE FROM administradores WHERE id_admin = p_id_admin;
END$$

DELIMITER ;