const express = require('express');
const { ObjectId } = require('mongodb');
const connectDB = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await connectDB();
  const productos = await db.collection('productos').find().toArray();
  res.json(productos);
});

router.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;

    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre y precio' });
    }

    const db = await connectDB();
    const resultado = await db.collection('productos').insertOne(nuevoProducto);

    res.status(201).json({
      mensaje: 'Producto agregado correctamente',
      productoId: resultado.insertedId
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    const db = await connectDB();
    const resultado = await db.collection('productos').deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;
