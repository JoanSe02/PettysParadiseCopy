DELIMITER $$

-- Crear veterinario
CREATE PROCEDURE CrearVeterinario(
    IN p_id_vet INT,
    IN p_especialidad VARCHAR(100),
    IN p_horario VARCHAR(255)
)
BEGIN
    INSERT INTO veterinarios (id_vet, especialidad, horario)
    VALUES (p_id_vet, p_especialidad, p_horario);
END$$

-- Obtener todos los veterinarios
CREATE PROCEDURE ObtenerVeterinarios()
BEGIN
    SELECT v.id_vet, v.especialidad, v.horario, 
           u.nombre, u.apellido, u.email, u.telefono
    FROM veterinarios v
    JOIN usuarios u ON v.id_vet = u.id_usuario;
END$$

-- Obtener veterinario por ID
CREATE PROCEDURE ObtenerVeterinarioPorId(
    IN p_id_vet INT
)
BEGIN
    SELECT v.id_vet, v.especialidad, v.horario, 
           u.nombre, u.apellido, u.email, u.telefono, u.ciudad, u.direccion
    FROM veterinarios v
    JOIN usuarios u ON v.id_vet = u.id_usuario
    WHERE v.id_vet = p_id_vet;
END$$

-- Actualizar veterinario
CREATE PROCEDURE ActualizarVeterinario(
    IN p_id_vet INT,
    IN p_especialidad VARCHAR(100),
    IN p_horario VARCHAR(255)
)
BEGIN
    UPDATE veterinarios SET
        especialidad = p_especialidad,
        horario = p_horario
    WHERE id_vet = p_id_vet;
END$$

-- Eliminar veterinario
CREATE PROCEDURE EliminarVeterinario(
    IN p_id_vet INT
)
BEGIN
    DELETE FROM veterinarios WHERE id_vet = p_id_vet;
END$$

DELIMITER ;