/* idropdigital.com: the menu, the sticky bar, reveals, the finish pickers and the WhatsApp enquiry. */
(() => {
  // send a small report to the shop app; never in the way of WhatsApp or a call
  const APP = 'https://app.idropdigital.com';
  const send = (path, data) => {
    try {
      const body = JSON.stringify({ site: 'idrop', ...data });
      if (navigator.sendBeacon && navigator.sendBeacon(APP + path, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return;
      fetch(APP + path, { method: 'POST', body, keepalive: true, mode: 'no-cors', headers: { 'content-type': 'text/plain;charset=UTF-8' } }).catch(() => {});
    } catch (_) { /* reporting is optional */ }
  };

  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // liquid glass: the nav and the call bar turn dark over the black bands,
  // and a soft light slides along their top edge as the page moves
  const nav = $('.nav');
  const bar = $('.getbar');
  const darks = $$('.hero, .offer, .way--new, .lt--pro, .tile--dark');
  // dark when most of five points along the glass sit over a dark block
  const over = (y) => {
    const xs = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => innerWidth * f);
    const rects = darks.map((s) => s.getBoundingClientRect()).filter((r) => r.top <= y && r.bottom >= y);
    return xs.filter((x) => rects.some((r) => r.left <= x && r.right >= x)).length >= 3;
  };
  const root = document.documentElement.style;
  let queued = false;
  const onScroll = () => {
    queued = false;
    nav.classList.toggle('is-stuck', scrollY > 8);
    nav.classList.toggle('is-dark', over(38));
    if (bar) bar.classList.toggle('is-dark', over(innerHeight - 40));
    root.setProperty('--sheen', `${(12 + ((Math.sin(scrollY / 260) + 1) / 2) * 76).toFixed(1)}%`);
  };
  onScroll();
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);

  // on a computer the light follows the pointer across the nav
  const cap = $('.nav__in');
  cap.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = cap.getBoundingClientRect();
    cap.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
  });
  cap.addEventListener('pointerleave', () => cap.style.removeProperty('--mx'));

  // Chromium can bend the page behind the glass: a displacement map per
  // element pulls the picture inward near the rounded edge, like a lens
  const chromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chromium/.test(b.brand)));
  const calm = matchMedia('(prefers-reduced-transparency: reduce)').matches;
  if (chromium && !calm && 'ResizeObserver' in window) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    document.body.appendChild(svg);
    const lensMap = (w, h, r, edge) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(w, h);
      const d = img.data;
      const hw = w / 2, hh = h / 2;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const px = x + 0.5 - hw, py = y + 0.5 - hh;
          const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
          const depth = r - (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0));
          let dx = 0, dy = 0;
          if (depth > 0 && depth < edge) {
            let nx, ny;
            if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; nx = qx / l; ny = qy / l; }
            else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
            const f = (1 - depth / edge) ** 2;
            dx = -Math.sign(px) * nx * f;
            dy = -Math.sign(py) * ny * f;
          }
          const i = (y * w + x) * 4;
          d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL('image/png');
    };
    const lens = (el, id, edge, scale) => {
      const build = () => {
        const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
        if (!w || !h) return;
        if (el.dataset.lensSize === `${w}x${h}`) return;
        el.dataset.lensSize = `${w}x${h}`;
        const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
        let f = svg.querySelector(`#${id}`);
        if (!f) { f = document.createElementNS(NS, 'filter'); f.id = id; svg.appendChild(f); }
        f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', w); f.setAttribute('height', h);
        f.setAttribute('filterUnits', 'userSpaceOnUse');
        f.setAttribute('color-interpolation-filters', 'sRGB');
        f.innerHTML = `<feImage href="${lensMap(w, h, r, Math.min(edge, h / 2))}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>`
          + `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>`;
        el.style.setProperty('--lf', `url(#${id})`);
      };
      new ResizeObserver(build).observe(el);
      build();
    };
    lens(cap, 'lens-nav', 20, 34);
    if (bar) lens(bar, 'lens-bar', 20, 34);
    lens($('#menu'), 'lens-menu', 26, 40);
    document.documentElement.classList.add('lens');
  }

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
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', (e) => { if (!menu.hidden && !nav.contains(e.target)) setMenu(false); });

  // calm reveals: fade and rise as each block comes in
  const items = $$('.head, .lt, .tile, .way, .why__card, .offer__copy, .care__copy, .wcard, .g, .visit__info, .visit__map, .qs, .terms, .ask__copy, .form');
  items.forEach((el) => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains('rv'));
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 5) * 60}ms`;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // finish pickers on the new iPhones: recolour the drawn phone
  $$('[data-finish]').forEach((card) => {
    const art = $('.ph, .fold', card);
    const name = $('.finish__name', card);
    $$('.dot', card).forEach((dot) => dot.addEventListener('click', () => {
      $$('.dot', card).forEach((d) => {
        d.classList.toggle('is-on', d === dot);
        d.setAttribute('aria-pressed', String(d === dot));
      });
      art.style.setProperty('--f', dot.style.getPropertyValue('--c'));
      name.textContent = dot.getAttribute('aria-label');
    }));
  });

  // only one question open at a time
  const qs = $$('.q');
  qs.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) qs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  // enquiry: chips, then WhatsApp with the message ready
  $$('.choices').forEach((group) => {
    group.addEventListener('click', (e) => {
      const b = e.target.closest('.choice');
      if (!b) return;
      $$('.choice', group).forEach((c) => {
        c.classList.toggle('is-on', c === b);
        c.setAttribute('aria-pressed', String(c === b));
      });
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
      // the shop app keeps the enquiry so the team can follow up
      send('/site/enquiry', {
        name, phone, want: pick('want'), condition: pick('cond'), message: msg,
        page: '#contact', website: form.website ? form.website.value : '',
      });
    });
  }

  // which buttons people tap, by product, for the shop app's reports
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    let kind = '';
    if (href.includes('wa.me/')) {
      const label = a.textContent.toLowerCase();
      kind = label.includes('availability') ? 'availability' : label.includes('enquire') ? 'enquire' : 'whatsapp';
    } else if (href.startsWith('tel:')) kind = 'call';
    else if (href.includes('google.com/maps')) kind = 'directions';
    else if (href.includes('instagram.com')) kind = 'instagram';
    if (!kind) return;
    const tile = a.closest('.lt, .tile, .way');
    const product = tile ? (tile.querySelector('h3')?.textContent.trim() || '') : '';
    const sec = a.closest('section, footer, header, .getbar');
    const where = !sec ? '' : sec.id ? `#${sec.id}` : (sec.classList[0] || sec.tagName.toLowerCase());
    send('/site/tap', { kind, product, page: where });
  }, { capture: true });

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
