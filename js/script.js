/* ===========================================================
   HOME WORLD — script.js
   Todo el comportamiento del sitio, comentado en español.
   Está dividido en bloques: cada uno controla una sola cosa,
   para que puedas encontrar y ajustar lo que necesites.
=========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. NAV: cambia de estilo al hacer scroll
  --------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---------------------------------------------------------
     2. MENÚ MÓVIL: abrir / cerrar
  --------------------------------------------------------- */
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
  });
  // cerrar el menú móvil al tocar un link
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });
  // cerrar el menú móvil al tocar fuera de él
  document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });

  /* ---------------------------------------------------------
     3. FONDO DEL HERO: efecto de "zoom out" al cargar
  --------------------------------------------------------- */
  var heroBg = document.getElementById('heroBg');
  window.requestAnimationFrame(function () {
    setTimeout(function () { heroBg.classList.add('loaded'); }, 50);
  });

  /* ---------------------------------------------------------
     4. REVEAL ON SCROLL: hace aparecer los bloques con la
     clase "reveal" cuando entran en pantalla.
  --------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (item) { revealObserver.observe(item); });

  /* ---------------------------------------------------------
     5. CONTADORES ANIMADOS (0 → número final)
     Se activan solo la primera vez que el bloque es visible.
     Para cambiar un número final, edita el atributo
     data-target="XXX" directamente en el HTML.
  --------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800; // milisegundos
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easing suave al final
      var value = Math.floor(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix; // asegura el valor exacto al final
      }
    }
    requestAnimationFrame(step);
  }

  // contador de "rango" (ej: 10–20), usado en "Pisos máximo por gestor"
  function animateCounterRange(el) {
    var from = parseInt(el.getAttribute('data-from'), 10);
    var to = parseInt(el.getAttribute('data-to'), 10);
    var duration = 1800;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var a = Math.floor(from * eased);
      var b = Math.floor(to * eased);
      el.textContent = a + '–' + b;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = from + '–' + to;
    }
    requestAnimationFrame(step);
  }

  var countersObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        if (el.classList.contains('counter-range')) {
          animateCounterRange(el);
        } else {
          animateCounter(el);
        }
        countersObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.counter, .counter-range').forEach(function (el) {
    countersObserver.observe(el);
  });

  /* ---------------------------------------------------------
     6. MENÚ ACTIVO: resalta en dorado + subrayado la sección
     de la página en la que está el usuario en este momento.
  --------------------------------------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
    mobileLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ---------------------------------------------------------
     7. GALERÍA / CARRUSEL: click en una foto = ver en grande
     (el carrusel en sí se mueve solo con CSS, ver styles.css)
  --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.slide').forEach(function (slide) {
    slide.addEventListener('click', function () {
      var imgSrc = slide.getAttribute('data-img');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------------------------------------------------
     8. FORMULARIO DE CONTACTO
     NOTA IMPORTANTE: este formulario es solo del lado del
     navegador (front-end). Para que los mensajes te lleguen
     de verdad por correo, hay que conectarlo a un servicio
     como Formspree, EmailJS o Google Forms. Mientras tanto,
     solo muestra el mensaje de "enviado" pero no envía nada
     a ningún lado. Avísame cuando quieras conectarlo.
  --------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(function () {
      formSuccess.classList.add('show');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar solicitud →';
    }, 900);
  });

});
