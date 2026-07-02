const express = require('express');
const app = express();
app.use(express.json());

const db = {};

app.get('/t/:uid', (req, res) => {
  const destino = db[req.params.uid];
  if (!destino) return res.send('Aún no configurado');
  res.redirect(302, destino);
});

app.get('/admin/set', (req, res) => {
  const { uid, url } = req.query;
  if (!uid || !url) return res.send('Faltan uid y url');
  db[uid] = url;
  res.send(`✅ ${uid} → ${url}`);
});

app.get('/admin', (req, res) => {
  const chips = Object.entries(db).map(([uid, url]) =>
    `<li><b>${uid}</b> → ${url}</li>`).join('');
  res.send(`
    <h1>Panel</h1>
    <p>${Object.keys(db).length} chips configurados</p>
    <ul>${chips || '<li>Ninguno</li>'}</ul>
    <form action="/admin/set">
      UID: <input name="uid" required><br>
      URL: <input name="url" size="50" required><br>
      <button>Configurar</button>
    </form>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo'));
