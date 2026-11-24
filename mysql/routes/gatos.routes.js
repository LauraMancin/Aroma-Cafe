const express = require('express');
const router = express.Router();
const db = require('../db');
 
// Listar gatos (filtro opcional por status: disponivel, em_processo, adotado)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; //[span_21](start_span)[span_21](end_span)
    let sql = 'SELECT * FROM gato WHERE 1=1'; //[span_22](start_span)[span_22](end_span)
    const params = [];
 
    if (status) {
      sql += ' AND status = ?'; //[span_23](start_span)[span_23](end_span)
      params.push(status);
    }
 
    sql += ' ORDER BY id_gato'; //[span_24](start_span)[span_24](end_span)
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar gatos', detalhes: err.message });
  }
});
 
// Buscar gato por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gato WHERE id_gato = ?', [req.params.id]); //[span_25](start_span)[span_25](end_span)
    if (!rows.length) return res.status(404).json({ erro: 'Gato não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar gato', detalhes: err.message });
  }
});
 
// Cadastrar gato
router.post('/', async (req, res) => {
  try {
    const {
      nome_gato,
      sexo,
      raca,
      pelagem,
      cor_olhos,
      nascimento,
      possui_deficiencia = false,
      descricao_deficiencia,
      descricao,
      foto,
      status = 'disponivel',
    } = req.body; //[span_26](start_span)[span_26](end_span)
 
    const [result] = await db.query(
      `INSERT INTO gato
        (nome_gato, sexo, raca, pelagem, cor_olhos, nascimento, possui_deficiencia, descricao_deficiencia, descricao, foto, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, //[span_27](start_span)[span_27](end_span)
      [
        nome_gato,
        sexo,
        raca ?? null,
        pelagem ?? null,
        cor_olhos ?? null,
        nascimento ?? null,
        Boolean(possui_deficiencia),
        descricao_deficiencia ?? null,
        descricao ?? null,
        foto ?? null,
        status,
      ]
    );
 
    res.status(201).json({ id_gato: result.insertId, ...req.body }); //[span_28](start_span)[span_28](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar gato', detalhes: err.message });
  }
});
 
// Atualizar status ou dados do gato
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; //[span_29](start_span)[span_29](end_span)
    const [result] = await db.query('UPDATE gato SET status = ? WHERE id_gato = ?', [status, req.params.id]); //[span_30](start_span)[span_30](end_span)
    if (!result.affectedRows) return res.status(404).json({ erro: 'Gato não encontrado' });
    res.json({ mensagem: 'Status do gato atualizado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status do gato', detalhes: err.message });
  }
});
 
module.exports = router;
routes/clientes.routes.js (cliente)
const express = require('express');
const route = express.Router();
const db = require('../db');
 
// Listar clientes (sem expor senha_hash)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_cliente, email, nome_cliente, sobrenome_cliente, provedor, id_externo,
             data_nascimento, telefone, cep, logradouro, numero, complemento,
             bairro, cidade, estado, pais, data_criacao, consentimento_lgpd
      FROM cliente
      ORDER BY id_cliente
    `); //[span_32](start_span)[span_32](end_span)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar clientes', detalhes: err.message });
  }
});
 
// Cadastrar cliente (recebe senha_hash já gerada ou via serviço de hash)
router.post('/', async (req, res) => {
  try {
    const {
      email,
      nome_cliente,
      sobrenome_cliente,
      senha_hash,
      provedor,
      id_externo,
      data_nascimento,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pais = 'brasil',
      consentimento_lgpd = true,
    } = req.body; //[span_33](start_span)[span_33](end_span)
 
    const [result] = await db.query(
      `INSERT INTO cliente
        (email, nome_cliente, sobrenome_cliente, senha_hash, provedor, id_externo,
         data_nascimento, telefone, cep, logradouro, numero, complemento,
         bairro, cidade, estado, pais, consentimento_lgpd)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, //[span_34](start_span)[span_34](end_span)
      [
        email,
        nome_cliente,
        sobrenome_cliente,
        senha_hash ?? null,
        provedor ?? null,
        id_externo ?? null,
        data_nascimento,
        telefone,
        cep,
        logradouro,
        numero,
        complemento ?? null,
        bairro,
        cidade,
        estado,
        pais,
        Boolean(consentimento_lgpd),
      ]
    );
 
    res.status(201).json({ id_cliente: result.insertId, email, nome_cliente, sobrenome_cliente }); //[span_35](start_span)[span_35](end_span)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar cliente', detalhes: err.message });
  }
});
 
module.exports = router;