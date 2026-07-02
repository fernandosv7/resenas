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
    .select('url_destino, toques, activo')
    .eq('uid', uid)
    .single();

  if (!data || !data.activo) return res.send('Aún no configurado');

  await supabase
    .from('chips')
    .update({
      toques: (data.toques || 0) + 1,
      ultimo_toque: new Date().toISOString()
    })
    .eq('uid', uid);

  await supabase
    .from('toques_log')
    .insert({
      uid,
      ip: req.ip || '',
      dispositivo: (req.headers['user-agent'] || '').substring(0, 200)
    });

  res.redirect(302, data.url_destino);
});

app.get('/admin/set', async (req, res) => {
  const { uid, url, negocio = '', cliente = '', telefono = '' } = req.query;
  if (!uid || !url) return res.send('Faltan uid y url');

  const { error } = await supabase
    .from('chips')
    .upsert(
      { uid, url_destino: url, negocio, cliente, telefono, toques: 0, activo: true },
      { onConflict: 'uid' }
    );

  if (error) return res.send('Error: ' + error.message);
  res.send(`✅ ${uid} → ${url} (${negocio})`);
});

app.get('/admin', async (req, res) => {
  const { data: chips } = await supabase
    .from('chips')
    .select('*')
    .order('created_at', { ascending: false });

  const lista = (chips || []).map(c => {
    const ultimo = c.ultimo_toque
      ? new Date(c.ultimo_toque).toLocaleString('es-AR')
      : 'Nunca';
    return `<li>
      <b>${c.uid}</b> → ${c.url_destino}
      <br>${c.negocio} | Cliente: ${c.cliente || '-'} | Tel: ${c.telefono || '-'}
      <br>📊 ${c.toques} toques | Último: ${ultimo} ${c.activo ? '✅' : '❌'}
    </li>`;
  }).join('');

  res.send(`
    <h1>Panel</h1>
    <p>${(chips || []).length} chips configurados</p>
    <ul>${lista || '<li>Ninguno</li>'}</ul>
    <h3>Configurar nuevo chip</h3>
    <form action="/admin/set">
      UID: <input name="uid" required><br>
      URL destino: <input name="url" size="50" required><br>
      Negocio: <input name="negocio"><br>
      Cliente: <input name="cliente"><br>
      Teléfono: <input name="telefono"><br>
      <button>Guardar</button>
    </form>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo'));
