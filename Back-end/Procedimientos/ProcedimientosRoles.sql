DELIMITER $$

-- Crear rol
CREATE PROCEDURE CrearRol(
    IN p_id_rol INT,
    IN p_rol VARCHAR(50)
)
BEGIN
    INSERT INTO rol (id_rol, rol)
    VALUES (p_id_rol, p_rol);
END$$

-- Obtener todos los roles
CREATE PROCEDURE ObtenerRoles()
BEGIN
    SELECT * FROM rol;
END$$

-- Obtener rol por ID
CREATE PROCEDURE ObtenerRolPorId(
    IN p_id_rol INT
)
BEGIN
    SELECT * FROM rol WHERE id_rol = p_id_rol;
END$$

-- Actualizar rol
CREATE PROCEDURE ActualizarRol(
    IN p_id_rol INT,
    IN p_rol VARCHAR(50)
)
BEGIN
    UPDATE rol SET
        rol = p_rol
    WHERE id_rol = p_id_rol;
END$$

-- Eliminar rol
CREATE PROCEDURE EliminarRol(
    IN p_id_rol INT
)
BEGIN
    DELETE FROM rol WHERE id_rol = p_id_rol;
END$$

DELIMITER ;