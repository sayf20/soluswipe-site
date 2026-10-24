// Thème CHOISI appliqué avant la première peinture (05/10). Script classique externe,
// bloquant, autorisé par la CSP (script-src 'self' — aucun script inline, m57) ; hors du
// bundle (public/), donc exécuté bien avant main.tsx. Même règle que initializeTheme
// (src/main.tsx) : localStorage.theme, sinon le réglage système.
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    // stockage indisponible : la feuille de style inline suit le réglage système
  }
})();
