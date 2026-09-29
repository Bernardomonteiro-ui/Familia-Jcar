/* ==========================================================================
   Família JCar — main.js (sem bibliotecas)
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: fundo sólido ao rolar ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Vídeo do hero ---------- */
  const video = document.getElementById('heroVideo');
  if (video) {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) {
      // Mantém só o poster: sem movimento e sem gastar dados
      video.removeAttribute('autoplay');
      video.pause();
      video.preload = 'none';
    } else {
      // Pausa quando o hero sai da tela (economiza bateria/CPU)
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }, { threshold: 0.1 }).observe(video);
    }
  }

  /* ---------- Animações de entrada ao rolar ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // Pequeno atraso em cascata para itens irmãos (cards, passos...)
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 0.08}s`);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Slider antes/depois ---------- */
  document.querySelectorAll('[data-ba]').forEach((ba) => {
    const handle = ba.querySelector('.ba__handle');
    let pos = 50;

    const set = (value) => {
      pos = Math.max(0, Math.min(100, value));
      ba.style.setProperty('--pos', `${pos}%`);
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    };

    const fromPointer = (e) => {
      const rect = ba.getBoundingClientRect();
      set(((e.clientX - rect.left) / rect.width) * 100);
    };

    ba.addEventListener('pointerdown', (e) => {
      ba.setPointerCapture(e.pointerId);
      ba.classList.add('is-dragging');
      fromPointer(e);
    });
    ba.addEventListener('pointermove', (e) => {
      if (ba.hasPointerCapture(e.pointerId)) fromPointer(e);
    });
    const stop = (e) => {
      if (ba.hasPointerCapture(e.pointerId)) ba.releasePointerCapture(e.pointerId);
      ba.classList.remove('is-dragging');
    };
    ba.addEventListener('pointerup', stop);
    ba.addEventListener('pointercancel', stop);

    // Teclado: setas, Home, End
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 5;
      const keys = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, Home: 0, End: 100 };
      if (e.key in keys) { e.preventDefault(); set(keys[e.key]); }
    });
  });

  /* ---------- Ano no rodapé ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
