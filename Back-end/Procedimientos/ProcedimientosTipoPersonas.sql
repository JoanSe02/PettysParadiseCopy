DELIMITER $$

-- Crear tipo persona
CREATE PROCEDURE CrearTipoPersona(
    IN p_id_tipo INT,
    IN p_tipo VARCHAR(50)
)
BEGIN
    INSERT INTO tipo_persona (id_tipo, tipo)
    VALUES (p_id_tipo, p_tipo);
END$$

-- Obtener todos los tipos de persona
CREATE PROCEDURE ObtenerTiposPersona()
BEGIN
    SELECT * FROM tipo_persona;
END$$

-- Obtener tipo persona por ID
CREATE PROCEDURE ObtenerTipoPersonaPorId(
    IN p_id_tipo INT
)
BEGIN
    SELECT * FROM tipo_persona WHERE id_tipo = p_id_tipo;
END$$

-- Actualizar tipo persona
CREATE PROCEDURE ActualizarTipoPersona(
    IN p_id_tipo INT,
    IN p_tipo VARCHAR(50)
)
BEGIN
    UPDATE tipo_persona SET
        tipo = p_tipo
    WHERE id_tipo = p_id_tipo;
END$$

-- Eliminar tipo persona
CREATE PROCEDURE EliminarTipoPersona(
    IN p_id_tipo INT
)
BEGIN
    DELETE FROM tipo_persona WHERE id_tipo = p_id_tipo;
END$$

DELIMITER ;