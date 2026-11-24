const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar reservas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, c.nome_cliente, c.sobrenome_cliente, c.telefone
      FROM reserva r
      JOIN cliente c ON r.id_cliente = c.id_cliente
      ORDER BY r.data DESC, r.horario DESC
    `); //[span_44](start_span)[span_44](end_span)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar reservas', detalhes: err.message });
  }
});
 
// Criar reserva
router.post('/', async (req, res) => {
  try {
    const { id_cliente, data, horario, numero_pessoas } = req.body; //[span_45](start_span)[span_45](end_span)
    const [result] = await db.query(
      'INSERT INTO reserva (id_cliente, data, horario, numero_pessoas) VALUES (?, ?, ?, ?)', //[span_46](start_span)[span_46](end_span)
      [id_cliente, data, horario, numero_pessoas]
    );
    res.status(201).json({
      id_reserva: result.insertId,
      id_cliente,
      data,
      horario,
      numero_pessoas,
      status: 'confirmada',
    }); //[span_47](start_span)[span_47](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar reserva', detalhes: err.message });
  }
});
 
// Cancelar ou atualizar status da reserva (confirmada / cancelada)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; //[span_48](start_span)[span_48](end_span)
    const [result] = await db.query(
      'UPDATE reserva SET status = ? WHERE id_reserva = ?', //[span_49](start_span)[span_49](end_span)
      [status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Reserva não encontrada' });
    res.json({ mensagem: 'Status da reserva atualizado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar reserva', detalhes: err.message });
  }
});
 
module.exports = router;