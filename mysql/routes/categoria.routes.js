const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar categorias
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categoria_cafe ORDER BY id_categoria'); //[span_3](start_span)[span_3](end_span)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar categorias', detalhes: err.message });
  }
});
 
// Criar categoria
router.post('/', async (req, res) => {
  try {
    const { nome_categoria } = req.body; //[span_4](start_span)[span_4](end_span)
    const [result] = await db.query(
      'INSERT INTO categoria_cafe (nome_categoria) VALUES (?)', //[span_5](start_span)[span_5](end_span)
      [nome_categoria]
    );
    res.status(201).json({ id_categoria: result.insertId, nome_categoria }); //[span_6](start_span)[span_6](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar categoria', detalhes: err.message });
  }
});
 
module.exports = router;