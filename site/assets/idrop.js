/* idropdigital.com: the menu, the sticky bar, reveals, and the WhatsApp enquiry. */
(() => {
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // nav shadow once the page moves
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-stuck', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // phone menu
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // reveal sections as they come in
  const items = $$('.head, .launch__card, .tile, .way, .why__card, .offer, .care__copy, .wcard, .review, .g, .visit__info, .visit__map, .q, .ask');
  items.forEach((el) => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains('rv'));
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 5) * 70}ms`;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // only one question open at a time
  const qs = $$('.q');
  qs.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) qs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  // a little depth on the hero pieces
  const stage = $('.stage');
  if (stage && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const objs = $$('.obj', stage);
    stage.parentElement.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      objs.forEach((o, i) => {
        const d = o.classList.contains('obj--hero') ? 10 : 18 + (i % 3) * 6;
        o.style.transform = `translate(${(-x * d).toFixed(1)}px, ${(-y * d).toFixed(1)}px)`;
      });
    });
  }

  // enquiry: chips, then WhatsApp with the message ready
  $$('.choices').forEach((group) => {
    group.addEventListener('click', (e) => {
      const b = e.target.closest('.choice');
      if (!b) return;
      $$('.choice', group).forEach((c) => c.classList.toggle('is-on', c === b));
    });
  });
  const form = $('#enquiry');
  if (form) {
    const err = $('.form__err', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      if (!name) { err.hidden = false; form.name.focus(); return; }
      err.hidden = true;
      const pick = (n) => $(`.choices[data-name="${n}"] .is-on`, form)?.textContent.trim() || '';
      const lines = [
        `Hi iDrop, I'm ${name}.`,
        `I'm interested in: ${pick('want')} (${pick('cond')}).`,
      ];
      const phone = form.phone.value.trim();
      if (phone) lines.push(`My number: ${phone}`);
      const msg = form.msg.value.trim();
      if (msg) lines.push(msg);
      window.open(`https://wa.me/918848026572?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  }

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
