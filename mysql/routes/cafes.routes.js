const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar cafés (com filtro opcional por categoria ou disponibilidade)
router.get('/', async (req, res) => {
  try {
    const { id_categoria, disponivel } = req.query; //[span_8](start_span)[span_8](end_span)
    let sql = `
      SELECT c.*, cat.nome_categoria
      FROM cafe c
      JOIN categoria_cafe cat ON c.id_categoria = cat.id_categoria
      WHERE 1=1
    `; //[span_9](start_span)[span_9](end_span)
    const params = [];
 
    if (id_categoria) {
      sql += ' AND c.id_categoria = ?'; //[span_10](start_span)[span_10](end_span)
      params.push(id_categoria);
    }
    if (disponivel !== undefined) {
      sql += ' AND c.disponivel = ?'; //[span_11](start_span)[span_11](end_span)
      params.push(disponivel === 'true' || disponivel === '1' ? 1 : 0);
    }
 
    sql += ' ORDER BY c.id_cafe'; //[span_12](start_span)[span_12](end_span)
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar cafés', detalhes: err.message });
  }
});
 
// Buscar café por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cafe WHERE id_cafe = ?', [req.params.id]); //[span_13](start_span)[span_13](end_span)
    if (!rows.length) return res.status(404).json({ erro: 'Café não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar café', detalhes: err.message });
  }
});
 
// Criar café
router.post('/', async (req, res) => {
  try {
    const {
      nome_cafe,
      id_categoria,
      preco,
      contem_lactose,
      descricao,
      disponivel = true,
      foto,
    } = req.body; //[span_14](start_span)[span_14](end_span)
 
    const [result] = await db.query(
      `INSERT INTO cafe
        (nome_cafe, id_categoria, preco, contem_lactose, descricao, disponivel, foto)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, //[span_15](start_span)[span_15](end_span)
      [nome_cafe, id_categoria, preco, Boolean(contem_lactose), descricao ?? null, Boolean(disponivel), foto ?? null]
    );
 
    res.status(201).json({ id_cafe: result.insertId, ...req.body }); //[span_16](start_span)[span_16](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar café', detalhes: err.message });
  }
});
 
// Atualizar café
router.put('/:id', async (req, res) => {
  try {
    const { nome_cafe, id_categoria, preco, contem_lactose, descricao, disponivel, foto } = req.body; //[span_17](start_span)[span_17](end_span)
    const [result] = await db.query(
      `UPDATE cafe
       SET nome_cafe = ?, id_categoria = ?, preco = ?, contem_lactose = ?, descricao = ?, disponivel = ?, foto = ?
       WHERE id_cafe = ?`, //[span_18](start_span)[span_18](end_span)
      [nome_cafe, id_categoria, preco, Boolean(contem_lactose), descricao ?? null, Boolean(disponivel), foto ?? null, req.params.id]
    );
 
    if (!result.affectedRows) return res.status(404).json({ erro: 'Café não encontrado' });
    res.json({ mensagem: 'Café atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar café', detalhes: err.message });
  }
});
 
// Remover café
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM cafe WHERE id_cafe = ?', [req.params.id]); //[span_19](start_span)[span_19](end_span)
    if (!result.affectedRows) return res.status(404).json({ erro: 'Café não encontrado' });
    res.json({ mensagem: 'Café removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover café', detalhes: err.message });
  }
});
 
module.exports = router;