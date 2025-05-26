USE mascotas_db;
DELIMITER $$

-- Crear cita
DELIMITER $$
USE mascotas_db;

-- Procedimiento corregido para insertar cita
DELIMITER $$
DROP PROCEDURE IF EXISTS InsertarCita$$
CREATE PROCEDURE InsertarCita (
    IN p_fech_cit DATE,
    IN p_hora TIME,
    IN p_cod_ser INT,
    IN p_id_vet INT,
    IN p_cod_mas INT,
    IN p_id_pro INT,
    IN p_notas TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    INSERT INTO citas (
        fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas
    )
    VALUES (
        p_fech_cit, p_hora, p_cod_ser, p_id_vet, p_cod_mas, p_id_pro, 'PENDIENTE', COALESCE(p_notas, '')
    );

    COMMIT;
    SELECT LAST_INSERT_ID() as cod_cit;
END$$
DELIMITER ;




-- Obtener todas las citas
DELIMITER $$
CREATE PROCEDURE MostrarCitasPorPropietario (
    IN p_id_pro INT
)
BEGIN
    SELECT c.*, 
           m.nom_mas AS mascota,
           s.nom_ser AS servicio,
           CONCAT(u.nombre, ' ', u.apellido) AS veterinario
    FROM citas c
    LEFT JOIN mascotas m ON c.cod_mas = m.cod_mas
    LEFT JOIN servicios s ON c.cod_ser = s.cod_ser
    LEFT JOIN veterinarios v ON c.id_vet = v.id_vet
    LEFT JOIN usuarios u ON v.id_vet = u.id_usuario
    WHERE c.id_pro = p_id_pro
    ORDER BY c.fech_cit DESC, c.hora DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ActualizarCita (
    IN p_cod_cit INT,
    IN p_fech_cit DATE,
    IN p_hora TIME,
    IN p_cod_ser INT,
    IN p_id_vet INT,
    IN p_cod_mas INT,
    IN p_estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA'),
    IN p_notas TEXT
)
BEGIN
    UPDATE citas
    SET fech_cit = p_fech_cit,
        hora = p_hora,
        cod_ser = p_cod_ser,
        id_vet = p_id_vet,
        cod_mas = p_cod_mas,
        estado = p_estado,
        notas = p_notas
    WHERE cod_cit = p_cod_cit;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE CancelarCita (
    IN p_cod_cit INT,
    IN p_id_pro INT
)
BEGIN
    DECLARE cita_valida INT;

    SELECT COUNT(*) INTO cita_valida
    FROM citas
    WHERE cod_cit = p_cod_cit AND id_pro = p_id_pro;

    IF cita_valida = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No tienes permiso para cancelar esta cita.';
    ELSE
        UPDATE citas
        SET estado = 'CANCELADA'
        WHERE cod_cit = p_cod_cit;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE EliminarCita (
    IN p_cod_cit INT
)
BEGIN
    DELETE FROM citas WHERE cod_cit = p_cod_cit;
END$$
DELIMITER ;
