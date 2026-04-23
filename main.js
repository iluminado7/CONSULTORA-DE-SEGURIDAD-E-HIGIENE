// Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Skill bars animation
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

  // Form submit → WhatsApp
  // ⚠️ Reemplazar con el número real de Fabián (código de país + número, sin + ni espacios)
  const WA_NUMBER = '5491168733223';

  function submitForm() {
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
    document.querySelector('.form-submit').disabled = true;
    document.querySelector('.form-submit').textContent = '✓ Abriendo WhatsApp…';
    document.querySelector('.form-submit').style.background = '#2a5280';

    setTimeout(() => window.open(url, '_blank'), 400);
  }
