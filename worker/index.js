// Worker Cloudflare : sert les fichiers statiques du site (dist/) et gère
// l'unique route dynamique /api/contact pour l'envoi réel du formulaire de
// contact via l'API Resend (aucun impact sur les MX/emails existants du
// domaine : c'est un simple appel HTTPS sortant, pas de routage email).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function sendEmail(env, { to, subject, html, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}

async function handleContact(request, env) {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const name = String(data.name || '').trim().slice(0, 200);
  const email = String(data.email || '').trim().slice(0, 320);
  const type = String(data.type || '').trim().slice(0, 200);
  const budget = String(data.budget || '').trim().slice(0, 200);
  const message = String(data.message || '').trim().slice(0, 5000);
  const honeypot = String(data.company || '').trim();

  // Champ honeypot invisible pour les humains — s'il est rempli, c'est un bot.
  if (honeypot) {
    return json({ ok: true });
  }

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(type);
  const safeBudget = escapeHtml(budget);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  try {
    await sendEmail(env, {
      to: env.EMAIL_TO,
      subject: `Nouveau projet — ${type || 'contact'} (${name})`,
      replyTo: email,
      html: `
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Type de projet :</strong> ${safeType}</p>
        <p><strong>Budget estimé :</strong> ${safeBudget}</p>
        <p><strong>Message :</strong><br />${safeMessage}</p>
      `,
    });

    await sendEmail(env, {
      to: email,
      subject: 'Votre message a bien été reçu — Antoine Bruneau',
      html: `
        <p>Bonjour ${safeName},</p>
        <p>Merci pour votre message, je vous confirme sa bonne réception. Je reviens vers vous sous 24h ouvrées.</p>
        <p>Récapitulatif de votre demande :</p>
        <p><strong>Type de projet :</strong> ${safeType}</p>
        <p><strong>Budget estimé :</strong> ${safeBudget}</p>
        <p><strong>Message :</strong><br />${safeMessage}</p>
        <p>À très vite,<br />Antoine Bruneau</p>
      `,
    });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
