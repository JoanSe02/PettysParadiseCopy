// verificarRol.js
module.exports = function (rolesPermitidos = []) {
    return (req, res, next) => {
      const { rol } = req.user;
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ message: 'Acceso no autorizado' });
      }
      next();
    };
  };