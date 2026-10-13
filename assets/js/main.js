(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Cabeçalho, botão flutuante e parallax */
  const header = $('.header');
  const fab = $('.fab');
  const parallax = reduceMotion ? [] : $$('[data-parallax]');
  const footer = $('.footer');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const overFooter = footer.getBoundingClientRect().top < window.innerHeight - 80;
    header.classList.toggle('is-scrolled', y > 24);
    fab.classList.toggle('is-visible', y > window.innerHeight * 0.6 && !overFooter);
    if (y < window.innerHeight * 1.2) {
      parallax.forEach((el) => {
        el.style.translate = `0 ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Menu mobile */
  const burger = $('.burger');
  const nav = $('#menu');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', () => setMenu(false));

  /* Entrada dos blocos ao rolar */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* Link ativo no menu */
  const navLinks = $$('.nav__list a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* Abas de tratamentos */
  const tabs = $$('[role="tab"]');
  const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const active = t === tab;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
      panel.classList.toggle('is-entering', active);
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });
  if (tabs.length) selectTab(tabs[0]);

  /* Links de WhatsApp com o assunto já preenchido */
  const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  $$('[data-wa-topic]').forEach((a) => {
    const number = a.href.replace(/\D/g, '');
    a.href = waLink(number, `Olá! Vim pelo site e gostaria de agendar uma avaliação sobre ${a.dataset.waTopic}.`);
  });

  /* Formulário: monta a mensagem e abre o WhatsApp */
  const form = $('#form-contato');
  if (form) {
    const nome = form.elements.nome;
    nome.addEventListener('input', () => nome.closest('.field').classList.remove('is-invalid'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nome.value.trim();
      if (!name) {
        nome.closest('.field').classList.add('is-invalid');
        nome.focus();
        return;
      }
      const extra = form.elements.mensagem.value.trim();
      const text = `Olá! Meu nome é ${name}. Vim pelo site e tenho interesse em ${form.elements.interesse.value}.${extra ? `\n\n${extra}` : ''}`;
      window.open(waLink(form.dataset.whatsapp, text), '_blank', 'noopener');
    });
  }
})();
