const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar solicitações de adoção
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, c.nome_cliente, c.sobrenome_cliente, c.email, g.nome_gato, g.status AS status_gato
      FROM solicitacao_adocao s
      JOIN cliente c ON s.id_cliente = c.id_cliente
      JOIN gato g ON s.id_gato = g.id_gato
      ORDER BY s.data_solicitacao DESC
    `); //[span_37](start_span)[span_37](end_span)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar solicitações', detalhes: err.message });
  }
});
 
// Criar solicitação de adoção
router.post('/', async (req, res) => {
  try {
    const { id_cliente, id_gato } = req.body; //[span_38](start_span)[span_38](end_span)
    const [result] = await db.query(
      'INSERT INTO solicitacao_adocao (id_cliente, id_gato) VALUES (?, ?)', //[span_39](start_span)[span_39](end_span)
      [id_cliente, id_gato]
    );
    res.status(201).json({ id_solicitacao: result.insertId, id_cliente, id_gato, status: 'pendente' }); //[span_40](start_span)[span_40](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar solicitação de adoção', detalhes: err.message });
  }
});
 
// Atualizar status da solicitação (pendente, aprovada, recusada)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; //[span_41](start_span)[span_41](end_span)
    const [result] = await db.query(
      'UPDATE solicitacao_adocao SET status = ? WHERE id_solicitacao = ?', //[span_42](start_span)[span_42](end_span)
      [status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Solicitação não encontrada' });
    res.json({ mensagem: 'Status da solicitação atualizado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar solicitação', detalhes: err.message });
  }
});
 
module.exports = router;

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pendente', 'aprovada', 'recusada'].includes(status))
    return res.status(400).json({ erro: 'Status inválido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      'UPDATE solicitacao_adocao SET status = ? WHERE id_solicitacao = ?',
      [status, req.params.id]);
    if (!r.affectedRows) { await conn.rollback(); return res.status(404).json({ erro: 'Solicitação não encontrada' }); }

    if (status === 'aprovada') {
      await conn.query(
        `UPDATE gato SET status = 'adotado'
         WHERE id_gato = (SELECT id_gato FROM solicitacao_adocao WHERE id_solicitacao = ?)`,
        [req.params.id]);
    }
    await conn.commit();
    res.json({ mensagem: 'Status atualizado' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ erro: 'Erro ao atualizar solicitação' });
  } finally {
    conn.release();
  }
});