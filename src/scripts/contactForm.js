// Les valeurs sont les libellés des options de #fType (contact.astro) ; les clés sont celles des liens « ?sujet= » des pages de service.
const sujets = {
  site: 'Création de site',
  refonte: 'Refonte de site',
  interface: 'Interface ou logiciel',
  audit: 'Audit UX/UI',
  renfort: 'Renfort d’équipe',
};
const sujetParam = new URLSearchParams(window.location.search).get('sujet');
const wanted = sujetParam && Object.hasOwn(sujets, sujetParam) ? sujets[sujetParam] : null;
const typeSelect = document.getElementById('fType');
if (wanted && typeSelect) typeSelect.value = wanted;

// Le canevas suit le type de projet : quatre choses à dire, et un début de message qu'un clic insère (seulement si le message est encore vide).
const guides = [...document.querySelectorAll('.ct-guide')];
const messageField = document.getElementById('fMessage');
const guidesBox = document.getElementById('ctGuides');
const syncGuide = () => {
  if (!typeSelect) return;
  guides.forEach((g) => {
    g.hidden = g.dataset.type !== typeSelect.value;
  });
  const shown = guides.find((g) => !g.hidden);
  const use = shown && shown.querySelector('.ct-guide-use');
  if (use && messageField) use.disabled = messageField.value.trim() !== '';
  // le bouton occupe sa place dès le départ (visibility, pas hidden) : il apparaît ici sans rien décaler
  if (guidesBox) guidesBox.classList.add('is-ready');
};
guides.forEach((g) => {
  const use = g.querySelector('.ct-guide-use');
  if (!use) return;
  use.addEventListener('click', () => {
    if (!messageField || messageField.value.trim() !== '') return;
    messageField.value = g.dataset.template || '';
    messageField.dispatchEvent(new Event('input', { bubbles: true }));
    messageField.focus();
    // le premier « … » est sélectionné : on tape directement à sa place
    const first = messageField.value.indexOf('…');
    if (first > -1) messageField.setSelectionRange(first, first + 1);
    else messageField.setSelectionRange(messageField.value.length, messageField.value.length);
    use.disabled = true;
  });
});
if (typeSelect) typeSelect.addEventListener('change', syncGuide);
if (messageField) messageField.addEventListener('input', syncGuide);
syncGuide();

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

// Anti-spam (voir worker/index.js) : un jeton signé et horodaté, demandé au chargement de la page. Le worker ne l'accepte qu'après 3 s : un
// robot qui poste à l'aveugle n'en a pas, et un robot trop pressé est écarté. Le visiteur ne fait rien.
let token = '';
let tokenAt = 0;
const loadToken = () =>
  fetch('/api/form-token', { cache: 'no-store' })
    .then((r) => r.json())
    .then((d) => {
      token = d && d.token ? d.token : '';
      tokenAt = Date.now();
    })
    .catch(() => {});
let tokenReady = loadToken();

if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const type = form.type.value;
    const message = form.message.value.trim();
    const company = form.company ? form.company.value.trim() : '';

    const fields = [form.name, form.email, form.message];
    fields.forEach((f) => {
      f.removeAttribute('aria-invalid');
      const err = document.getElementById(f.id + 'Err');
      if (err) {
        err.hidden = true;
        err.textContent = '';
      }
    });
    status.classList.remove('is-error');
    status.setAttribute('role', 'status');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const invalid = fields.filter((f) => !f.value.trim() || (f === form.email && !emailOk));
    if (invalid.length) {
      invalid.forEach((f) => {
        f.setAttribute('aria-invalid', 'true');
        // le message est placé sous le champ concerné (et relié par aria-describedby)
        const err = document.getElementById(f.id + 'Err');
        if (err) {
          err.textContent = !f.value.trim()
            ? { fName: 'Indiquez votre nom.', fEmail: 'Indiquez votre adresse e-mail.', fMessage: 'Décrivez votre besoin en quelques lignes.' }[f.id]
            : 'Cette adresse e-mail semble invalide.';
          err.hidden = false;
        }
      });
      status.classList.add('is-error');
      status.setAttribute('role', 'alert');
      status.textContent = !emailOk && email
        ? 'L’adresse e-mail semble invalide. Merci de la vérifier.'
        : 'Merci de renseigner votre nom, votre e-mail et un message.';
      invalid[0].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.removeAttribute('data-state');
    status.textContent = 'Envoi en cours…';

    try {
      // un onglet resté ouvert longtemps : le jeton (valable 2 h) est renouvelé avant l'envoi, pour qu'un vrai message ne soit jamais écarté
      if (Date.now() - tokenAt > 90 * 60 * 1000) tokenReady = loadToken();
      await tokenReady;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, type, message, company, token, 'cf-turnstile-response': form['cf-turnstile-response'] ? form['cf-turnstile-response'].value : '' }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        form.reset();
        submitBtn.setAttribute('data-state', 'sent');
        setTimeout(() => submitBtn.removeAttribute('data-state'), 3200);
        status.textContent =
          'Message envoyé. Vous allez recevoir un e-mail de confirmation, et je vous réponds généralement sous deux jours ouvrés.';
      } else {
        status.classList.add('is-error');
        status.textContent =
          res.status === 429
            ? 'Trop d’envois en peu de temps. Patientez quelques minutes, ou écrivez-moi directement à contact@antoinebruneau.fr.'
            : 'Une erreur est survenue lors de l’envoi. Vous pouvez réessayer, ou m’écrire directement à contact@antoinebruneau.fr.';
      }
    } catch {
      status.classList.add('is-error');
      status.textContent =
        'Une erreur réseau est survenue. Vous pouvez réessayer, ou m’écrire directement à contact@antoinebruneau.fr.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
}
