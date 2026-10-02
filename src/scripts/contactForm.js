const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const type = form.type.value;
    const budget = form.budget.value;
    const message = form.message.value.trim();
    const company = form.company ? form.company.value.trim() : '';

    const fields = [form.name, form.email, form.message];
    fields.forEach((f) => f.removeAttribute('aria-invalid'));
    status.classList.remove('is-error');
    status.setAttribute('role', 'status');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const invalid = fields.filter((f) => !f.value.trim() || (f === form.email && !emailOk));
    if (invalid.length) {
      invalid.forEach((f) => f.setAttribute('aria-invalid', 'true'));
      status.classList.add('is-error');
      status.setAttribute('role', 'alert');
      status.textContent = !emailOk && email
        ? "L'adresse email semble invalide. Merci de la vérifier."
        : 'Merci de renseigner votre nom, votre email et un message.';
      invalid[0].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    status.textContent = 'Envoi en cours...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, type, budget, message, company }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        form.reset();
        status.textContent =
          'Message envoyé — vous allez recevoir un email de confirmation, je reviens vers vous sous 24h ouvrées.';
      } else {
        status.classList.add('is-error');
        status.textContent =
          "Une erreur est survenue lors de l'envoi. Vous pouvez réessayer, ou m'écrire directement à contact@antoinebruneau.fr.";
      }
    } catch {
      status.classList.add('is-error');
      status.textContent =
        "Une erreur réseau est survenue. Vous pouvez réessayer, ou m'écrire directement à contact@antoinebruneau.fr.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
}
