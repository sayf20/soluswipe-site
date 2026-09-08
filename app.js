/* SoluSwipe — vitrine : micro-interactions (aucune dépendance).
   Respecte « réduire les animations » du système. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Apparition au scroll */
  var revealed = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealed.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealed.forEach(function (el) { io.observe(el); });
  }

  /* Compteur animé (bande de stats) */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!target || reduced) { el.textContent = '+' + (target || 0).toLocaleString('fr-FR'); return; }
    var start = null, dur = 1600;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = '+' + Math.round(target * eased).toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* Téléphone : légère inclinaison qui suit la souris (desktop uniquement) */
  var phone = document.getElementById('phone');
  var scene = document.querySelector('.phone-scene');
  if (phone && scene && !reduced && window.matchMedia('(pointer: fine)').matches) {
    scene.addEventListener('mousemove', function (ev) {
      var r = scene.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      phone.style.transform =
        'rotateY(' + (-14 + x * 10) + 'deg) rotateX(' + (7 - y * 8) + 'deg) rotateZ(1.5deg)';
    });
    scene.addEventListener('mouseleave', function () {
      phone.style.transform = '';
    });
  }
})();
