# PLAN MVP — Sistema NFC+QR para reseñas Google

MVP = Producto Mínimo Viable. Es la versión más simple y barata de tu producto que puedes lanzar para **validar** si la gente lo quiere comprar. No necesitas tener TODO funcionando al 100%. Necesitas lo mínimo indispensable para que un cliente pague y lo use.

---

## FASES DEL MVP

### FASE 0: Preparación inicial (1-2 días)
### FASE 1: Servidor + chips (2-3 días)
### FASE 2: Primer producto físico (3-5 días)
### FASE 3: Vender a 5 negocios (1-2 semanas)
### FASE 4: Feedback y mejora (1 semana)

---

## FASE 0: Preparación inicial

### 0.1 Crear cuenta de GitHub (gratis)

GitHub es donde vas a tener el código. Render necesita GitHub para funcionar.

- Ir a https://github.com/signup
- Elegir usuario: ej. "tunegocio" o "reseñasya"
- Email, contraseña, verificar mail
- **No pagar nada** — plan Free

### 0.2 Crear cuenta en Render (gratis)

Render es donde va a correr tu servidor 24/7 (gratis).

- Ir a https://render.com
- Botón **"Sign Up"** → **"Sign up with GitHub"**
- Conectar con tu cuenta de GitHub
- Render te pedirá permisos — aceptar
- Listo, ya tenés cuenta gratis

### 0.3 Comprar dominio (opcional, $10/año)

- Recomendado: **Namecheap** o **Cloudflare Domains**
- Algo como: `tusistema.com` o `resenyasya.net`
- Si no quieres gastar, Render te da una URL gratis como `tuservicio.onrender.com`

---

## FASE 1: Servidor + chips

### 1.1 Desplegar el servidor en Render

**Paso a paso (sin programar):**

1. Entra a tu cuenta de Render
2. Botón **"New +"** → **"Web Service"**
3. Elegí **"Build and deploy from a Git repository"** → conectá tu repo de GitHub
4. Render detecta automáticamente que es Node.js
5. En **"Start Command"** poné: `node servidor.js`
6. Botón **"Create Web Service"**
7. Render lo despliega automáticamente
8. Te dará una URL tipo: `https://tunombre.onrender.com`

### 1.2 El código del servidor (ya está listo)

El código ya está en tu repositorio de GitHub. No necesitas hacer nada.
Render lo toma automáticamente y lo despliega.

Este es el código que corre el servidor:

```js
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
```

Si en el futuro querés cambiar algo, yo edito el código, lo subo a GitHub, y Render se actualiza solo.

### 1.3 Probar que funciona

Abre en tu navegador: `https://tunombre.onrender.com/admin`

Si ves un panel con un formulario, está funcionando.

### 1.4 Comprar chips NFC NTAG213

**Dónde comprar (de más barato a más caro):**

**Opción A — AliExpress (recomendado para MVP):**
- Buscar: "NTAG213 wet inlay 25mm original NXP"
- Precio: ~$10-15 USD por 50 chips (con envío)
- Tiempo: 2-4 semanas
- Buscar vendedores con BUENAS REVIEWS y fotos reales
- Confirmar que diga "original NXP"

**Opción B — Sigma Electrónica (Argentina, más caro pero rápido):**
- https://www.sigmaelectronica.net/producto/ntag213-nfc/
- Precio: ~ARS $800-900 c/u
- Tiempo: 2-3 días hábiles

**Opción C — Shop NFC (España, envían a LATAM):**
- https://shopnfc.com/es/
- Precio: ~€0.50-1.00 c/u
- Envían por correo internacional

### 1.5 Descargar app NFC Tools

- **Android:** Google Play Store → "NFC Tools" de wakdev
- **iPhone:** App Store → "NFC Tools" de wakdev
- Es gratis (versión Pro no necesaria para MVP)

---

## FASE 2: Primer producto físico

### 2.1 Hacer 1 prototipo de expositor

**Materiales (consíguelos localmente):**

- Cartulina gruesa o acrílico transparente 3mm (cortado a 14×11 cm)
- Chip NFC NTAG213 pegatina
- QR impreso en papel
- Pegamento o cinta doble faz
- Opcional: soporte plegable para que se pare en la mesa

**Diseño (puedes imprimir en hoja A4 y pegarla al cartón):**

```
┌──────────────────────────────┐
│                              │
│        [TU LOGO]            │
│                              │
│   📱 ACERCÁ TU MÓVIL        │
│                              │
│    ⟐ NFC AQUÍ               │
│                              │
│   y dejanos tu reseña        │
│   ⭐ en Google ⭐            │
│                              │
│   ┌─────────────────┐        │
│   │   [QR CODE]     │        │
│   │                 │        │
│   └─────────────────┘        │
│                              │
│   También escaneá el QR      │
│                              │
└──────────────────────────────┘
```

**Instrucciones de montaje:**

1. Corta el cartón o acrílico a 14×11 cm
2. Imprime el diseño en una hoja A4
3. Recorta el diseño al tamaño justo y pégalo al cartón
4. Pega el chip NFC en la zona marcada "NFC AQUÍ" (detrás del diseño)
5. Asegúrate de que el chip quede plano (sin burbujas)
6. Si es acrílico: usa un soporte de pie trasero para que se pare

### 2.2 Programar el chip NFC del prototipo

1. Abre la app **NFC Tools** en tu celular
2. Botón **"Escribir"** (en la parte inferior)
3. Botón **"Añadir registro"**
4. Elegir **"URL/URI"**
5. Escribir: `https://tunombre.onrender.com/t/PROTO-001`
6. Botón **"OK"** (arriba a la derecha)
7. Botón **"Escribir"** (abajo)
8. Acercar el chip NFC a la parte trasera del teléfono
9. Esperar confirmación: aparece ✅ o "Escritura completada"
10. Verificar: volver al inicio, tocar "Leer", acercar el chip

**Nota sobre iPhones:** En iPhone (desde iOS 14+), la lectura NFC es automática sin abrir la app. Solo acerca el teléfono al chip con la pantalla encendida.

### 2.3 Obtener la URL de Google Reviews de un negocio

Para configurar un chip necesitas la URL exacta del perfil de Google del negocio.

**Método manual (el que usarás para MVP):**

1. Abre Google Chrome (en PC)
2. Busca el negocio en Google Maps
3. Haz clic en el negocio (se abre el panel lateral)
4. Busca la sección **"Reseñas"**
5. Debe aparecer un botón/nube de texto que dice algo como: "¿Qué opinas de este lugar?"
6. NO existe un botón "Compartir reseña" en versiones recientes de Google Maps

**Método alternativo para obtener la URL:**

Opción A — Google Place ID:
1. Busca el negocio en Google Maps
2. La URL se ve así: `https://www.google.com/maps/place/Nombre+Negocio/@-34.123,-58.456,17z`
3. Fíjate que tiene un número largo entre `/place/` y `@`. Ese es el Place ID parcial

Opción B — Place ID Finder:
1. Ve a: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Usa la herramienta "Place ID Finder" de Google
3. Busca el negocio por nombre
4. Copia el Place ID (ej: `ChIJN1t...DeHms`)

Opción C — URL directa de reseña (recomendada):
```
https://search.google.com/local/writereview?placeid=ChIJN1t...DeHms
```
Solo reemplaza `ChIJN1t...DeHms` por el Place ID de tu negocio.

### 2.4 Configurar el chip desde tu navegador

1. Abre: `https://tunombre.onrender.com/admin`
2. En el formulario:
   - UID: `PROTO-001`
   - URL: `https://search.google.com/local/writereview?placeid=ChIJN1t...`
3. Botón **"Configurar"**
4. Deberías ver: `✅ PROTO-001 → https://search.google.com/...`

### 2.5 Probar end-to-end con un amigo que tenga un negocio

1. Lleva tu prototipo al negocio
2. Colócalo en la mesa/mostrador
3. Pide a 2-3 clientes que acerquen su teléfono
4. Observa:
   - ¿Funciona en iPhone y Android?
   - ¿La gente entiende qué hacer?
   - ¿Cuánto tardan en dejar la reseña?
   - ¿Tienen dudas o miedos?
5. **Pregunta al dueño:** ¿Pagarías por esto? ¿Cuánto?

---

## FASE 3: Vender a 5 negocios

### 3.1 Hacer 5 expositores decentes

Ya sabes hacer el prototipo. Ahora haz 5 con mejor calidad:

- Remplaza el cartón por **acrílico 3mm** (lo cortan en vidrierías)
- O compra portarretratos pequeños (los de写真, tipo marco de foto)
- O mejor aún: busca un **impresor local** que haga acrílico serigrafiado
- Pega el chip NFC detrás del diseño

Costo estimado por unidad (Argentina, 2026):
| Item | Costo |
|---|---|
| Acrílico 14×11 cm corte | ~$500 ARS |
| Impresión del diseño | ~$300 ARS |
| Chip NFC NTAG213 | ~$800 ARS |
| Soporte pie | ~$200 ARS |
| **Total** | **~$1,800 ARS (~$1.5 USD)** |

### 3.2 Definir precio

**Benchmark (precios de competidores):**
| Competencia | Producto similar | Precio |
|---|---|---|
| Tapstar (España) | Expositor Google Reviews | ~€39 |
| QRLynk (Amazon US) | NFC Google Review Stand | ~$17 |
| TapFive | NFC Review Stand | ~$30 |
| Genérico AliExpress | NFC Review Stand | ~$15 |

**Sugerencia para MVP en Argentina:**
- Precio de venta: **$15,000-25,000 ARS** (~$12-20 USD al blue)
- Costo unitario: ~$1,800 ARS
- Margen bruto: ~**88-93%**

### 3.3 Encontrar los primeros 5 clientes

**Método más barato:**
1. Abre Google Maps
2. Busca: "restaurantes [tu_zona]" / "cafeterías" / "peluquerías"
3. Ve a los que tengan **menos de 50 reseñas** o **puntuación entre 4.0-4.5**
4. Esos necesitan más reseñas — son tu target ideal

**Script para WhatsApp/presencial:**

> *"Hola, soy [tu nombre], tengo un dispositivo que permite a tus clientes dejarte reseña en Google con solo acercar el móvil. Lo probás sin compromiso durante 7 días. Si te sirve, me lo pagás. ¿Te interesa?"*

### 3.4 Entregar y configurar

Cuando consigas un cliente:

1. Él te paga (transferencia/efectivo)
2. Recibe el expositor
3. Te dice su negocio (envía el link de Google Maps)
4. Tú obtienes el Place ID (ver paso 2.3)
5. Entras a tu panel admin: `https://tunombre.onrender.com/admin`
6. Configuras el UID correspondiente con la URL de Google
7. El cliente coloca el expositor en su local
8. Cada vez que alguien toca, va directo a sus reseñas

### 3.5 Hacer seguimiento de las estadísticas (sin panel automático)

Al principio, con los datos que tienes en Render no hay persistencia (cuando el servidor se reinicia, los datos se pierden). Para el MVP no importa. Pero para las estadísticas básicas:

- **Pregunta al cliente directamente:** "¿Cuántas reseñas recibiste esta semana?"
- **Mira en Google Maps** cuántas reseñas tiene y su promedio
- **Compara antes/después** para tener casos de éxito

---

## FASE 4: Feedback y mejora

### 4.1 Preguntas clave a tus primeros 5 clientes

Después de 2-3 semanas, pregúntales:

1. ¿Recibiste más reseñas desde que usás el dispositivo?
2. ¿Tus clientes lo usaron? ¿Te dijeron algo?
3. ¿Fue fácil de configurar?
4. ¿Qué cambiarías?
5. ¿Se lo recomendarías a otro negocio?
6. ¿Volverías a comprar más unidades?

### 4.2 Mejoras típicas post-MVP

Según la respuesta, prioriza:

| Problema detectado | Solución |
|---|---|
| "No sé cuántas veces lo usaron" | Agregar contador simple (próxima sesión) |
| "El QR no funciona bien" | Mejorar contraste, usar QR dinámico |
| "No entienden qué hacer" | Mejorar el diseño con instrucciones visuales |
| "Quiero uno para Instagram también" | OFRECER la opción de redirigir a Instagram |
| "Quiero para todo el equipo" | Ofrecer tarjetas individuales (más baratas) |

---

## PRESUPUESTO TOTAL MVP

| Item | Costo |
|---|---|
| Render (gratis) | $0 |
| Chips NFC 50 uds (AliExpress) | ~$15 USD |
| Materiales 5 expositores | ~$10 USD |
| App NFC Tools | $0 |
| Dominio (opcional) | ~$10 USD/año |
| **Total inversión MVP** | **~$25-35 USD** |

---

## CHECKLIST RÁPIDO

- [ ] Cuenta GitHub creada
- [ ] Servidor Render funcionando con URL
- [ ] Código en GitHub y servidor activo en Render
- [ ] Panel admin funciona en `[tunombre].onrender.com/admin`
- [ ] Chips NFC comprados (AliExpress o local)
- [ ] App NFC Tools instalada en el celular
- [ ] 1 chip programado y probado
- [ ] 1 prototipo físico armado
- [ ] URL de Google Reviews de negocio de prueba obtenida
- [ ] Chip configurado desde panel admin
- [ ] Prueba end-to-end: tocar NFC → redirigir a Google
- [ ] 5 expositores armados
- [ ] 5 clientes encontrados y vendidos
- [ ] Feedback recolectado
- [ ] Decisión: pivotar o escalar

---

## NOTAS PARA PRÓXIMAS SESIONES

**Sesión 2 — Persistencia de datos:**
- Agregar SQLite para que los datos no se pierdan al reiniciar el servidor
- Agregar conteo de toques (analytics básico)
- Agregar QR dinámico (generar QR para imprimir desde el panel)

**Sesión 3 — Mejora de producto:**
- Investigar fabricación en serie (acrílico cortado láser)
- Diseño profesional del expositor (contratar diseñador)
- Opción tarjetas individuales (formato credencial)

**Sesión 4 — Escalar:**
- Landing page para vender online
- Redes sociales (TikTok, Instagram)
- Programa de afiliados/referidos
- Multi-idioma para expansión a otros países

---

*Documento generado el 2 de Julio de 2026*
*Próxima sesión: configurar Render + programar el primer chip*
