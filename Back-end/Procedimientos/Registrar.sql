DELIMITER $$

CREATE PROCEDURE InsertarUsuarioYPropietario (
  IN p_id_usuario INT,
  IN p_tipo_doc ENUM('C.C','C.E'),
  IN p_nombre VARCHAR(50),
  IN p_apellido VARCHAR(30),
  IN p_ciudad VARCHAR(50),
  IN p_direccion VARCHAR(100),
  IN p_telefono VARCHAR(20),
  IN p_fecha_nacimiento DATE,
  IN p_email VARCHAR(100),
  IN p_contrasena VARCHAR(255),
  IN p_id_tipo INT,
  IN p_id_rol INT
)
BEGIN
  -- 1. Insertar en la tabla usuarios
  INSERT INTO usuarios (
    id_usuario, tipo_doc, nombre, apellido, ciudad, direccion, telefono, 
    fecha_nacimiento, email, contrasena, id_tipo, id_rol
  ) VALUES (
    p_id_usuario, p_tipo_doc, p_nombre, p_apellido, p_ciudad, p_direccion,
    p_telefono, p_fecha_nacimiento, p_email, p_contrasena, p_id_tipo, p_id_rol
  );

  -- 2. Insertar en la tabla propietarios (solo si el rol es 3)
  IF p_id_rol = 3 THEN
    INSERT INTO propietarios (id_pro) VALUES (p_id_usuario);
  END IF;

END$$

DELIMITER ;
