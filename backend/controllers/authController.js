const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { nombre, correo, clave } = req.body;
  const claveHash = await bcrypt.hash(clave, 10);
  const nuevoUsuario = new Usuario({ nombre, correo, clave: claveHash });
  await nuevoUsuario.save();
  res.json({ mensaje: 'Usuario registrado' });
};

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const claveValida = await bcrypt.compare(clave, usuario.clave);
  if (!claveValida) return res.status(401).json({ mensaje: 'Clave incorrecta' });

  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);
  res.json({ token });
};
