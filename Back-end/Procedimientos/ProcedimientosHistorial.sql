USE mascotas_db;
DELIMITER $$

-- Crear historial médico
CREATE PROCEDURE CrearHistorialMedico(
    IN p_fech_his DATE,
    IN p_descrip_his TEXT,
    IN p_tratamiento TEXT,
    IN p_cod_mas INT,
    OUT p_cod_his INT
)
BEGIN
    INSERT INTO historiales_medicos (fech_his, descrip_his, tratamiento,cod_mas)
    VALUES (p_fech_his, p_descrip_his, p_tratamiento, p_cod_mas);
    
    SET p_cod_his = LAST_INSERT_ID();
END$$

-- Obtener todos los historiales médicos
CREATE PROCEDURE ObtenerHistorialesMedicos()
BEGIN
    SELECT h.*, m.nom_mas AS nombre_mascota, m.especie, m.raza
    FROM historiales_medicos h
    JOIN mascotas m ON h.cod_mas = m.cod_mas;
END$$

-- Obtener historiales médicos por mascota
CREATE PROCEDURE ObtenerHistorialesPorMascota(
    IN p_cod_mas INT
)
BEGIN
    SELECT * FROM historiales_medicos WHERE cod_mas = p_cod_mas
    ORDER BY fecha DESC;
END$$

-- Obtener historial médico por código
CREATE PROCEDURE ObtenerHistorialPorCodigo(
    IN p_cod_his INT,
    IN p_cod_mas INT
)
BEGIN
    SELECT h.*, m.nom_masAS nombre_mascota, m.especie, m.raza
    FROM historiales_medicos h
    JOIN mascotas m ON h.cod_mas = m.cod_mas
    WHERE h.cod_his = p_cod_his AND h.codigo_mascota = p_codigo_mascota;
END$$

-- Actualizar historial médico
CREATE PROCEDURE ActualizarHistorialMedico(
    IN p_cod_his INT,
    IN p_fech_his DATE,
    IN p_descrip_his TEXT,
    IN p_tratamiento TEXT,
    IN p_cod_mas INT
)
BEGIN
    UPDATE historiales_medicos SET
        fech_his = p_fech_his,
        descrip_his = p_descrip_his,
        tratamiento = p_tratamiento
    WHERE cod_his = p_cod_his AND cod_mas = p_cod_mas;
END$$

-- Eliminar historial médico
CREATE PROCEDURE EliminarHistorialMedico(
    IN p_cod_his INT,
    IN p_cod_mas INT
)
BEGIN
    DELETE FROM historiales_medicos 
    WHERE cod_his = p_cod_his AND cod_mas = p_cod_mas;
END$$

DELIMITER ;