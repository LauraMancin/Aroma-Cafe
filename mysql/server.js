const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const categoriasRoutes = require('./routes/categorias.routes');
const cafesRoutes = require('./routes/cafes.routes');
const gatosRoutes = require('./routes/gatos.routes');
const clientesRoutes = require('./routes/clientes.routes');
const adocoesRoutes = require('./routes/adocoes.routes');
const reservasRoutes = require('./routes/reservas.routes');
const mensagensRoutes = require('./routes/mensagens.routes');
 
const app = express();
app.use(cors());
app.use(express.json());
 
app.use('/api/categorias', categoriasRoutes);
app.use('/api/cafes', cafesRoutes);
app.use('/api/gatos', gatosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/adocoes', adocoesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/mensagens', mensagensRoutes);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Aroma Café rodando na porta ${PORT}`);
});

const db = require('./db');

app.get('/api/health', async (req, res) => {
  try { await db.query('SELECT 1'); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false }); }
});

app.listen(PORT, async () => {
  try { await db.query('SELECT 1'); console.log('✔ MySQL conectado'); }
  catch (e) { console.error('✖ Falha no MySQL:', e.message); }
  console.log(`Servidor Aroma Café na porta ${PORT}`);
});