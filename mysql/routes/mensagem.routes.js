const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar mensagens de contato
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mensagem_contato ORDER BY data_envio DESC'); //[span_51](start_span)[span_51](end_span)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar mensagens', detalhes: err.message });
  }
});
 
// Enviar mensagem de contato
router.post('/', async (req, res) => {
  try {
    const { nome_cliente, sobrenome_cliente, email, assunto, mensagem } = req.body; //[span_52](start_span)[span_52](end_span)
    const [result] = await db.query(
      `INSERT INTO mensagem_contato (nome_cliente, sobrenome_cliente, email, assunto, mensagem)
       VALUES (?, ?, ?, ?, ?)`, //[span_53](start_span)[span_53](end_span)
      [nome_cliente, sobrenome_cliente, email, assunto, mensagem]
    );
    res.status(201).json({ id_mensagem: result.insertId, status: 'nova' }); //[span_54](start_span)[span_54](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao enviar mensagem', detalhes: err.message });
  }
});
 
// Atualizar status da mensagem (nova, lida, respondida)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; //[span_55](start_span)[span_55](end_span)
    const [result] = await db.query(
      'UPDATE mensagem_contato SET status = ? WHERE id_mensagem = ?', //[span_56](start_span)[span_56](end_span)
      [status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Mensagem não encontrada' });
    res.json({ mensagem: 'Status da mensagem atualizado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar mensagem', detalhes: err.message });
  }
});
 
module.exports = router;