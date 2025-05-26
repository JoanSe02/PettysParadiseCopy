DELIMITER $$

CREATE PROCEDURE LoginUsuario(IN p_email VARCHAR(100))
BEGIN
  SELECT u.id_usuario, u.email, u.contrasena, r.rol
  FROM usuarios u
  JOIN rol r ON u.id_rol = r.id_rol
  WHERE u.email = p_email;
END $$

DELIMITER ;
