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

// ---------------------------------------------------------------------------------------------------------------------
// Anti-spam du formulaire (aucune action demandée au visiteur : pas de case à cocher, pas de calcul) :
//  1. piège à robots : un champ « company » invisible, que seuls les robots remplissent ;
//  2. jeton signé : la page demande un jeton à /api/form-token au chargement (horodaté, signé HMAC) ; il n'est accepté qu'après 3 s et
//     avant 2 h (un humain ne remplit pas ce formulaire en moins de 3 s, un robot qui poste à l'aveugle n'a pas de jeton) ;
//  3. même origine : l'en-tête Origin doit être celui du site (pas de formulaire posté depuis un autre domaine) ;
//  4. débit : au plus 5 envois par adresse IP et par 10 minutes (par instance du worker : complété par une règle de limitation de débit
//     Cloudflare, voir README) ;
//  5. contenu : pas plus de deux liens dans le message, aucun lien dans le nom ;
//  6. Cloudflare Turnstile (mode invisible), si les clés TURNSTILE_SECRET (worker) et PUBLIC_TURNSTILE_SITEKEY (build) sont définies.
// Un robot reconnu reçoit une réponse « ok » : il ne sait pas pourquoi il a été écarté.
// ---------------------------------------------------------------------------------------------------------------------
const MIN_FILL_MS = 3000;
const MAX_AGE_MS = 2 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MAX_BODY_BYTES = 20000;
const URL_RE = /(https?:\/\/|www\.)/gi;
const HAS_URL_RE = /(https?:\/\/|www\.)/i;
const hits = new Map();

function tooManyRequests(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return recent.length > RATE_MAX;
}

async function sign(env, text) {
  const secret = env.FORM_SECRET || env.RESEND_API_KEY || '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function issueToken(env) {
  const ts = String(Date.now());
  return `${ts}.${await sign(env, ts)}`;
}

async function tokenIsValid(env, token) {
  const [ts, sig] = String(token || '').split('.');
  if (!ts || !sig || !/^\d{13}$/.test(ts)) return false;
  const expected = await sign(env, ts);
  // comparaison à durée constante
  let diff = expected.length ^ sig.length;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ (sig.charCodeAt(i) || 0);
  const age = Date.now() - Number(ts);
  return diff === 0 && age >= MIN_FILL_MS && age <= MAX_AGE_MS;
}

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(token), remoteip: ip });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

// retire les retours à la ligne et caractères de contrôle : ces valeurs finissent dans l'objet du courriel
function oneLine(text) {
  return String(text).replace(/[\x00-\x1f\x7f]+/g, ' ').trim();
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

async function handleContact(request, env, url) {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  // même origine, JSON, corps de taille raisonnable
  if (request.headers.get('origin') !== url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'invalid_body' }, 415);
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (!data || typeof data !== 'object') return json({ ok: false, error: 'invalid_body' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (tooManyRequests(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  const name = String(data.name || '').trim().slice(0, 200);
  const email = String(data.email || '').trim().slice(0, 320);
  const type = String(data.type || '').trim().slice(0, 200);
  const message = String(data.message || '').trim().slice(0, 5000);
  const honeypot = String(data.company || '').trim();

  // Écartés sans le dire : piège rempli, jeton absent, trop rapide ou périmé, contenu typique du spam.
  if (honeypot) return json({ ok: true });
  if (!(await tokenIsValid(env, data.token))) return json({ ok: true });
  if (!(await turnstileOk(env, data['cf-turnstile-response'], ip))) return json({ ok: true });
  if ((message.match(URL_RE) || []).length > 2 || HAS_URL_RE.test(name)) return json({ ok: true });

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(type);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  try {
    await sendEmail(env, {
      to: env.EMAIL_TO,
      subject: `Nouveau projet — ${oneLine(type) || 'contact'} (${oneLine(name)})`,
      replyTo: email,
      html: `
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Type de projet :</strong> ${safeType}</p>
        <p><strong>Message :</strong><br />${safeMessage}</p>
      `,
    });

    await sendEmail(env, {
      to: email,
      subject: 'Votre message a bien été reçu — Antoine Bruneau',
      html: `
        <p>Bonjour ${safeName},</p>
        <p>Merci pour votre message, je vous confirme sa bonne réception. Je vous réponds généralement sous deux jours ouvrés.</p>
        <p>Récapitulatif de votre demande :</p>
        <p><strong>Type de projet :</strong> ${safeType}</p>
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

// Pages d'erreur : le Worker les sert depuis les ressources (/erreurs/<code>/), avec le bon statut HTTP, sans cache et sans indexation. Si même cela échoue,
// une réponse texte minimale part.
async function errorPage(request, env, status, extra = {}) {
  try {
    const res = await env.ASSETS.fetch(new Request(new URL(`/erreurs/${status}/`, request.url)));
    if (res.ok) {
      const headers = new Headers(res.headers);
      headers.set('cache-control', 'no-store');
      headers.set('x-robots-tag', 'noindex');
      for (const [k, v] of Object.entries(extra)) headers.set(k, v);
      return new Response(request.method === 'HEAD' ? null : res.body, { status, headers });
    }
  } catch (err) {
    console.error(err);
  }
  return new Response(`Erreur ${status}`, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra },
  });
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const isApi = url.pathname.startsWith('/api/');

      // maintenance : variable MAINTENANCE=1 sur le Worker (tableau de bord Cloudflare) ; tout répond 503, avec une invitation à réessayer
      if (env.MAINTENANCE === '1') {
        if (isApi) return new Response(JSON.stringify({ ok: false, error: 'maintenance' }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8', 'retry-after': '600', 'cache-control': 'no-store' } });
        if (!url.pathname.startsWith('/erreurs/')) return errorPage(request, env, 503, { 'retry-after': '600' });
      }

      if (isApi) {
        if (url.pathname === '/api/form-token') {
          if (request.method !== 'GET') return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405, headers: { allow: 'GET', 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
          return json({ ok: true, token: await issueToken(env) });
        }
        if (url.pathname === '/api/contact') {
          if (request.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405, headers: { allow: 'POST', 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
          return handleContact(request, env, url);
        }
        return json({ ok: false, error: 'not_found' }, 404);
      }

      // le reste est statique : lecture seule
      if (request.method !== 'GET' && request.method !== 'HEAD') return errorPage(request, env, 405, { allow: 'GET, HEAD' });

      const res = await env.ASSETS.fetch(request);
      if (res.status === 404) return errorPage(request, env, 404);
      return res;
    } catch (err) {
      console.error(err);
      return errorPage(request, env, 500);
    }
  },
};
