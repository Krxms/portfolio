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

    if (!name || !email || !message) {
      status.textContent = 'Merci de renseigner votre nom, votre email et un message.';
      return;
    }

    submitBtn.disabled = true;
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
        status.textContent =
          "Une erreur est survenue lors de l'envoi. Vous pouvez réessayer, ou m'écrire directement à contact@antoinebruneau.fr.";
      }
    } catch {
      status.textContent =
        "Une erreur réseau est survenue. Vous pouvez réessayer, ou m'écrire directement à contact@antoinebruneau.fr.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
