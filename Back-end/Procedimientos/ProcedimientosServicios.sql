DELIMITER $$

-- Crear servicio
CREATE PROCEDURE CrearServicio(
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20,2),
    OUT p_cod_ser INT
)
BEGIN
    INSERT INTO servicios (nom_ser, descrip_ser, precio)
    VALUES (p_nom_ser, p_descrip_ser, p_precio);
    
    SET p_cod_ser = LAST_INSERT_ID();
END$$

-- Obtener todos los servicios
CREATE PROCEDURE ObtenerServicios()
BEGIN
    SELECT * FROM servicios;
END$$

-- Obtener servicio por código
CREATE PROCEDURE ObtenerServicioPorCodigo(
    IN p_cod_ser INT
)
BEGIN
    SELECT * FROM servicios WHERE cod_ser = p_cod_ser;
END$$

-- Actualizar servicio
CREATE PROCEDURE ActualizarServicio(
    IN p_cod_ser INT,
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20,2)
)
BEGIN
    UPDATE servicios SET
        nom_ser = p_nom_ser,
        descrip_ser = p_descrip_ser,
        precio = p_precio
    WHERE cod_ser = p_cod_ser;
END$$

-- Eliminar servicio
CREATE PROCEDURE EliminarServicio(
    IN p_cod_ser INT
)
BEGIN
    DELETE FROM servicios WHERE cod_ser = p_cod_ser;
END$$

DELIMITER ;