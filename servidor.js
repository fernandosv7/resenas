const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get('/t/:uid', async (req, res) => {
  const uid = req.params.uid;

  const { data } = await supabase
    .from('chips')
    .select('url_destino, toques')
    .eq('uid', uid)
    .single();

  if (!data) return res.send('Aún no configurado');

  await supabase
    .from('chips')
    .update({ toques: (data.toques || 0) + 1 })
    .eq('uid', uid);

  res.redirect(302, data.url_destino);
});

app.get('/admin/set', async (req, res) => {
  const { uid, url } = req.query;
  if (!uid || !url) return res.send('Faltan uid y url');

  const { error } = await supabase
    .from('chips')
    .upsert({ uid, url_destino: url, toques: 0 }, { onConflict: 'uid' });

  if (error) return res.send('Error: ' + error.message);
  res.send(`✅ ${uid} → ${url}`);
});

app.get('/admin', async (req, res) => {
  const { data: chips } = await supabase
    .from('chips')
    .select('*')
    .order('created_at', { ascending: false });

  const lista = (chips || []).map(c =>
    `<li><b>${c.uid}</b> → ${c.url_destino} (${c.toques} toques)</li>`
  ).join('');

  res.send(`
    <h1>Panel</h1>
    <p>${(chips || []).length} chips configurados</p>
    <ul>${lista || '<li>Ninguno</li>'}</ul>
    <form action="/admin/set">
      UID: <input name="uid" required><br>
      URL: <input name="url" size="50" required><br>
      <button>Configurar</button>
    </form>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo'));
