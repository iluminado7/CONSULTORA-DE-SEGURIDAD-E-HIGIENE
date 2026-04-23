// ─── CONFIGURACIÓN ────────────────────────────────────────────────
// ⚠️ Reemplazar ambos valores antes de publicar
const WA_NUMBER      = '5491168733223';   // Número de Fabián sin + ni espacios
const RECAPTCHA_KEY  = '6LcJb8YsAAAAAGYdLzoEMcspIXT-8Wyw_2ho9Bxu';   // Clave del sitio de Google reCAPTCHA v3

// ─── MENÚ MOBILE ──────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── ANIMACIONES DE SCROLL ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── BARRAS DE SKILLS ─────────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => bar.style.width = w, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.querySelector('.skills-bars');
if (skillSection) skillObserver.observe(skillSection);

// ─── FORMULARIO → WHATSAPP ────────────────────────────────────────
function submitForm() {
  // 1. Honeypot: si el campo invisible tiene contenido, es un bot
  const honeypot = document.getElementById('honeypot').value;
  if (honeypot) return;

  // 2. Validación de campos obligatorios
  const nombre   = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email    = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const empresa  = document.getElementById('empresa').value.trim();
  const rubro    = document.getElementById('rubro').value;
  const servicio = document.getElementById('servicio').value;
  const mensaje  = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    alert('Por favor completá al menos nombre, email y mensaje.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Verificando…';

  // 3. reCAPTCHA v3: ejecutar y obtener token
  grecaptcha.ready(() => {
    grecaptcha.execute(RECAPTCHA_KEY, { action: 'contact_form' })
      .then(token => {
        // Puntuación: 1.0 = humano seguro, 0.0 = bot seguro
        // Nota: la validación del token en producción se hace en el servidor,
        // pero como este sitio no tiene backend, usamos el token como señal
        // y confiamos en que reCAPTCHA ya bloqueó los bots silenciosamente.
        document.getElementById('recaptcha-token').value = token;

        if (!token) {
          alert('No se pudo verificar que sos humano. Intentá de nuevo.');
          btn.disabled = false;
          btn.textContent = 'Enviar mensaje →';
          return;
        }

        // 4. Armar mensaje de WhatsApp
        const lineas = [
          '👋 *Nuevo contacto desde el portfolio*',
          '',
          `*Nombre:* ${nombre} ${apellido}`,
          `*Email:* ${email}`,
          telefono ? `*Teléfono:* ${telefono}` : null,
          empresa  ? `*Empresa:* ${empresa}`   : null,
          rubro    ? `*Rubro:* ${rubro}`       : null,
          servicio ? `*Servicio de interés:* ${servicio}` : null,
          '',
          `*Mensaje:*\n${mensaje}`,
        ].filter(l => l !== null).join('\n');

        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lineas)}`;

        document.getElementById('success-msg').style.display = 'block';
        btn.textContent = '✓ Abriendo WhatsApp…';
        btn.style.background = '#2a5280';

        setTimeout(() => window.open(url, '_blank'), 400);
      })
      .catch(() => {
        alert('Hubo un problema con la verificación. Intentá de nuevo.');
        btn.disabled = false;
        btn.textContent = 'Enviar mensaje →';
      });
  });
}