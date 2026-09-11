const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const type = form.type.value;
    const budget = form.budget.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Merci de renseigner votre nom, votre email et un message.';
      return;
    }

    const subject = `Nouveau projet — ${type} (${name})`;
    const body =
      `Nom : ${name}\n` +
      `Email : ${email}\n` +
      `Type de projet : ${type}\n` +
      `Budget estimé : ${budget}\n\n` +
      `Message :\n${message}`;

    const mailto =
      'mailto:antoine.bruneau@protonmail.com' +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    status.textContent = "Votre client email va s'ouvrir avec le message pré-rempli — il ne reste qu'à l'envoyer.";
  });
}
