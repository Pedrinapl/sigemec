/* SIGEMEC — comportamentos compartilhados. Cada bloco só roda se a página tiver o elemento. */

/* ============ DADOS DO SITE (edite aqui) ============ */

/* Envio dos formulários. Cole a URL do formulário (ex.: https://formspree.io/f/abcdwxyz).
   Vazio: o envio abre o e-mail do visitante já preenchido. */
const FORM_ENDPOINT = "";
const FORM_EMAIL = "comercial@sigemec.com.br";
/* Endereços aceitos para FORM_ENDPOINT. Ao trocar de serviço, inclua o novo também em CSP (build.py). */
const FORM_HOSTS = ["formspree.io"];

/* Números do grupo: alimentam o hero e os contadores (data-ind / data-count). */
const INDICADORES = {
  recursos:  { valor: 2.5, dec: 1, texto: "R$ 2,5 bi" },
  estados:   { valor: 18 },
  municipios:{ valor: 500 },
  tecnicos:  { valor: 15000 },
  cursos:    { valor: 150 },
  satisfacao:{ valor: 98 }
};

/* Projetos contemplados: valor pago e data do pagamento. */
const PROJETOS = [
  { municipio: "Aquiraz", uf: "CE", programa: "Projeto de Educação Infantil", valor: 2254852.64, pago: "01/04/2024" },
  { municipio: "Monteiro", uf: "PB", programa: "Projeto de Educação Infantil", valor: 1624843.94, pago: "01/04/2024" },
  { municipio: "Anajatuba", uf: "MA", programa: "Projeto de Educação Infantil", valor: 1617679.18, pago: "01/04/2024" },
  { municipio: "Nova Mamoré", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1380194.14, pago: "01/04/2024" },
  { municipio: "Cacoal", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1310815.36, pago: "01/04/2024" },
  { municipio: "Pimenta Bueno", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1304173.00, pago: "01/04/2024" },
  { municipio: "Novo Oriente", uf: "CE", programa: "Projeto de Educação Infantil", valor: 982243.04, pago: "01/04/2024" },
  { municipio: "Cururupu", uf: "MA", programa: "Projeto de Educação Infantil", valor: 950288.80, pago: "01/04/2024" },
  { municipio: "Novo Horizonte do Oeste", uf: "RO", programa: "Projeto de Educação Infantil", valor: 372596.09, pago: "01/04/2024" },
  { municipio: "Cujubim", uf: "RO", programa: "Projeto de Educação Infantil", valor: 265054.59, pago: "01/04/2024" },
  { municipio: "Bernardino Batista", uf: "PB", programa: "Projeto de Educação Infantil", valor: 214648.80, pago: "01/04/2024" },
  { municipio: "Poço de José de Moura", uf: "PB", programa: "Projeto de Educação Infantil", valor: 152390.25, pago: "01/04/2024" }
];
const NOMES_UF = { CE: "Ceará", MA: "Maranhão", PB: "Paraíba", RO: "Rondônia" };

/* Turmas dos encontros técnicos.
   status: "confirmada" → origem "Inscrição curso" · "em formação" → origem "Interesse curso" */
const TURMAS = [
  { evento: "gem", cidade: "Belém", uf: "PA", datas: "29/10/2026", status: "em formação" },
  { evento: "gem", cidade: "Salinópolis", uf: "PA", datas: "06/11/2026", status: "em formação" },
  { evento: "jep", cidade: "Salinópolis", uf: "PA", datas: "04, 05 e 06/11/2026", status: "em formação" }
];
const EVENTOS = {
  gem: { nome: "Gestão Educacional Municipal 2026", preco: 500 },
  jep: { nome: "VIII Jornada de Excelência Pedagógica 2026", preco: 1000 }
};
const MAX_PARTICIPANTES = 4;

/* Atas de registro de preço vigentes, para adesão. Enquanto a lista estiver vazia,
   o site mostra que a ata é enviada junto com a proposta.
   Exemplo: { numero: "012/2026", orgao: "Consórcio X", objeto: "Consultoria em gestão educacional", validade: "31/12/2026", pdf: "assets/atas/ata-012-2026.pdf" } */
const ATAS = [];

/* Painéis de exemplo da página de módulos (dados fictícios, apenas para ilustrar). */
const DEMO = {
  gestaoKpis: [
    { v: "14", l: "convênios acompanhados" },
    { v: "R$ 9,8 mi", l: "em execução" },
    { v: "11", l: "em dia", st: "ok" },
    { v: "3", l: "pedem atenção", st: "warn" }
  ],
  gestaoStatus: [
    { label: "Em dia", value: 11, st: "ok" },
    { label: "Atenção", value: 2, st: "warn" },
    { label: "Atrasado", value: 1, st: "late" }
  ],
  gestaoExec: [
    { label: "Ônibus escolar", value: 100, st: "ok" },
    { label: "Mobiliário escolar", value: 93, st: "ok" },
    { label: "Creche Proinfância", value: 86, st: "ok" },
    { label: "Quadra coberta", value: 64, st: "ok" },
    { label: "Reforma de 3 escolas", value: 41, st: "warn" },
    { label: "UBS Porte I", value: 22, st: "late" }
  ],
  eduMinimos: [
    { label: "Manutenção e desenvolvimento do ensino", value: 26.8, min: 25, max: 35 },
    { label: "Fundeb na remuneração dos profissionais", value: 74.2, min: 70, max: 100 }
  ],
  eduProgramas: [
    { label: "PDDE", value: 91 },
    { label: "PNAE", value: 82 },
    { label: "PNATE", value: 64 },
    { label: "Escola em Tempo Integral", value: 47 }
  ],
  saudeMinimo: [
    { label: "Ações e serviços públicos de saúde", value: 17.4, min: 15, max: 25 }
  ],
  escolaFreq: [
    { label: "E.M. Centro", value: 92 },
    { label: "CMEI Pequeno Príncipe", value: 90 },
    { label: "E.M. Vila Nova", value: 88 },
    { label: "E.M. Jardim", value: 84 },
    { label: "E.M. Boa Esperança", value: 79 },
    { label: "E.M. Rural São José", value: 71 }
  ]
};

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

/* ==================================================== */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => matchMedia('(min-width: 900px)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const brlShort = v => v >= 1e6 ? 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' mi' : 'R$ ' + Math.round(v / 1e3).toLocaleString('pt-BR') + ' mil';
  const pct = v => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
  const slug = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const onScroll = fn => { addEventListener('scroll', fn, { passive: true }); fn(); };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* Monta elementos sem innerHTML: textos entram sempre como texto. */
  function h(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.setAttribute('style', v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => { if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c))); });
    return n;
  }
  const svgUse = (id, cls) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (cls) s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  };

  /* ---------- rolagem suave ---------- */
  let lenis = null, velocity = 0;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', e => { velocity = e.velocity || 0; if (hasGsap) ScrollTrigger.update(); });
    if (hasGsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const goTo = (el, offset = -90) => {
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: reduce ? 'auto' : 'smooth' });
  };
  const lockScroll = on => { document.body.style.overflow = on ? 'hidden' : ''; if (lenis) on ? lenis.stop() : lenis.start(); };

  /* ---------- janelas (dialog) ---------- */
  const openDlg = d => { if (!d || d.open) return; d.showModal(); lockScroll(true); };
  $$('dialog.dlg').forEach(d => {
    d.addEventListener('close', () => { lockScroll(false); d.dispatchEvent(new CustomEvent('dlg:closed')); });
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    openDlg(document.getElementById(b.dataset.open));
  });

  /* ---------- âncoras da mesma página ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"], a[href^="index.html#"]');
    if (!a) return;
    const raw = a.getAttribute('href');
    const samePage = raw.startsWith('#') || (raw.startsWith('index.html#') && $('#contato'));
    if (!samePage || a.dataset.route !== undefined || a.dataset.legal !== undefined) return;
    const id = raw.slice(raw.indexOf('#') + 1);
    const el = id && document.getElementById(id);
    if (!el || el.tagName === 'DIALOG') return;
    e.preventDefault();
    closeMenu();
    const dlg = a.closest('dialog'); if (dlg) { dlg.close(); lockScroll(false); }
    if (a.dataset.tipo) setTipo(a.dataset.tipo);
    goTo(el, id === 'topo' ? 0 : -90);
  });
  addEventListener('load', () => {
    const id = location.hash.slice(1);
    if (/^projeto-[a-z0-9-]+$/.test(id)) return openProjeto(id.slice(8));
    const el = id && /^[\w-]+$/.test(id) && document.getElementById(id);
    if (el && el.tagName !== 'DIALOG') setTimeout(() => goTo(el), 150);
  });

  /* ---------- menu mobile e nav que some ao descer ---------- */
  const menuBtn = $('#menuBtn');
  function closeMenu() { document.body.classList.remove('menu-open'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); }
  if (menuBtn) menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  const nav = $('#nav');
  let lastY = 0;
  onScroll(() => {
    const y = scrollY;
    const hide = y > lastY && y > 300 && !document.body.classList.contains('menu-open');
    if (nav) nav.classList.toggle('hide', hide);
    if (hide) setAcc(false);
    lastY = y;
  });

  /* ---------- área do cliente ---------- */
  const accBtn = $('#accBtn'), accMenu = $('#accMenu');
  function setAcc(o) { if (!accBtn) return; accMenu.hidden = !o; accBtn.setAttribute('aria-expanded', String(o)); }
  if (accBtn) {
    accBtn.addEventListener('click', e => { e.stopPropagation(); setAcc(accMenu.hidden); if (!accMenu.hidden) { const f = accMenu.querySelector('a'); if (f) f.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.acc')) setAcc(false); });
    accMenu.addEventListener('click', e => { if (e.target.closest('a')) setAcc(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !accMenu.hidden) { setAcc(false); accBtn.focus(); } });
  }

  /* ---------- faixas de logos ---------- */
  const rows = $$('.mq-row').map(row => {
    const track = row.querySelector('.mq-track');
    row.appendChild(track.cloneNode(true)); row.appendChild(track.cloneNode(true));
    return { row, track, x: 0, base: parseFloat(row.dataset.speed) };
  });
  if (rows.length) {
    let skew = 0;
    const tick = () => {
      const v = Math.max(-40, Math.min(40, velocity));
      skew += ((-v * 0.25) - skew) * 0.12;
      rows.forEach(r => {
        const w = r.track.offsetWidth;
        const dir = Math.sign(r.base) * (v < -2 ? -1 : 1);
        if (!reduce) r.x -= (Math.abs(r.base) * 0.9 + Math.abs(v) * 0.35) * dir;
        if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
        r.row.style.transform = `translateX(${r.x}px) skewX(${skew}deg)`;
      });
      velocity *= 0.9;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- frase que acende palavra por palavra ---------- */
  const say = $('#say');
  if (say) {
    const hl = (say.dataset.hl || '').split('|');
    const words = say.textContent.trim().split(/\s+/);
    say.textContent = '';
    words.forEach((w, i) => { say.append(h('span', { class: 'w' + (hl.includes(w) ? ' hl' : ''), text: w })); if (i < words.length - 1) say.append(' '); });
    const spans = $$('.w', say);
    onScroll(() => {
      const r = say.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const n = Math.round(p * spans.length);
      spans.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  }

  /* ---------- trilho horizontal do método ---------- */
  const method = $('#metodo'), track = $('#track'), mBar = $('#methodBar');
  const sizeMethod = () => {
    if (!method) return;
    if (!desktop()) { method.style.height = ''; track.style.transform = ''; return; }
    const dist = Math.max(0, track.scrollWidth - innerWidth);
    method.style.height = (innerHeight + dist) + 'px';
    method.dataset.dist = dist;
  };
  const methodScroll = () => {
    if (!method || !desktop()) return;
    const dist = +method.dataset.dist || 0;
    const p = Math.min(1, Math.max(0, -method.getBoundingClientRect().top / Math.max(1, dist)));
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    if (mBar) mBar.style.transform = `scaleX(${p})`;
  };
  if (method) addEventListener('scroll', methodScroll, { passive: true });

  /* ---------- fotos andando de lado ---------- */
  const photos = $('#photos');
  const photoScroll = () => {
    if (!photos || reduce) return;
    const r = photos.getBoundingClientRect();
    const dist = Math.max(0, photos.scrollWidth - innerWidth + 32);
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    photos.style.transform = `translate3d(${-p * dist}px,0,0)`;
  };
  if (photos) addEventListener('scroll', photoScroll, { passive: true });

  /* ---------- sub-navegação da página de módulos ---------- */
  const subLinks = $$('.subnav a');
  if (subLinks.length) {
    const mods = subLinks.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    onScroll(() => {
      let idx = 0;
      mods.forEach((m, i) => { if (m.getBoundingClientRect().top < innerHeight * 0.45) idx = i; });
      subLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
      document.documentElement.style.setProperty('--arm', getComputedStyle(mods[idx]).getPropertyValue('--c'));
    });
  }

  /* ---------- barra de leitura ---------- */
  const readBar = $('#readBar');
  if (readBar) onScroll(() => {
    const art = $('#post');
    if (!art || art.hidden) { readBar.style.transform = 'scaleX(0)'; return; }
    const r = art.getBoundingClientRect();
    readBar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))})`;
  });

  /* ---------- GSAP: anéis, títulos, letreiro do rodapé ---------- */
  if (hasGsap && !reduce) {
    $$('.rings .rg').forEach(g => {
      const k = parseFloat(g.dataset.rot);
      gsap.set(g, { svgOrigin: '300 300' });
      gsap.to(g, { rotation: '+=' + 360 * Math.sign(k), duration: 60 / Math.abs(k), repeat: -1, ease: 'none' });
    });
    if ($('.rings')) gsap.to('.rings svg', { rotation: 90, ease: 'none', scrollTrigger: { trigger: '.rings', start: 'top top', end: 'bottom top', scrub: 0.6 } });
    gsap.from('h1 .ln > span', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
    if ($('.giant')) gsap.from('.giant span', { yPercent: 45, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
    $$('.photos img').forEach(img => gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '#photos', start: 'top bottom', end: 'bottom top', scrub: true } }));
  }

  /* ---------- indicadores e contadores ---------- */
  $$('[data-ind]').forEach(el => {
    const ind = INDICADORES[el.dataset.ind]; if (!ind) return;
    if (el.hasAttribute('data-count')) { el.dataset.count = ind.valor; if (ind.dec) el.dataset.dec = ind.dec; el.textContent = fmt(ind.valor, ind.dec); }
    else el.textContent = el.dataset.fmt === 'texto' && ind.texto ? ind.texto : fmt(ind.valor, ind.dec);
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (reduce) return;
    const el = e.target, to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1600); el.textContent = fmt(to * (1 - Math.pow(1 - k, 4)), dec); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('.stat [data-count]').forEach(el => io.observe(el));

  /* ---------- depoimentos ---------- */
  const qs = $$('#qStage .q');
  if (qs.length) {
    const dotsBox = $('#qDots'), qCount = $('#qCount'), stage = $('#qStage');
    qs.forEach(() => dotsBox.append(h('i')));
    const dots = $$('i', dotsBox);
    let qi = 0, timer, paused = false;
    const show = i => {
      qi = (i + qs.length) % qs.length;
      qs.forEach((q, k) => { q.classList.toggle('is-active', k === qi); q.setAttribute('aria-hidden', String(k !== qi)); });
      dots.forEach((d, k) => { d.classList.remove('on'); if (k === qi) { void d.offsetWidth; d.classList.add('on'); } });
      qCount.textContent = String(qi + 1).padStart(2, '0') + ' / ' + String(qs.length).padStart(2, '0');
      clearTimeout(timer); if (!paused) timer = setTimeout(() => show(qi + 1), 8000);
    };
    const pause = p => { paused = p; stage.classList.toggle('paused', p); if (p) clearTimeout(timer); else show(qi); };
    stage.addEventListener('mouseenter', () => pause(true));
    stage.addEventListener('mouseleave', () => pause(false));
    $('#qPrev').addEventListener('click', () => show(qi - 1));
    $('#qNext').addEventListener('click', () => show(qi + 1));
    show(0);
  }

  /* ============ GRÁFICOS ============ */
  const tip = h('div', { class: 'tip', role: 'tooltip', hidden: true });
  document.body.append(tip);
  const showTip = (el, lines) => {
    tip.textContent = '';
    lines.forEach((l, i) => tip.append(h(i ? 'span' : 'b', { text: l })));
    tip.hidden = false;
    const r = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
    const x = Math.min(innerWidth - t.width - 12, Math.max(12, r.left + r.width / 2 - t.width / 2));
    const y = r.top - t.height - 10 < 8 ? r.bottom + 10 : r.top - t.height - 10;
    tip.style.transform = `translate(${x}px,${y}px)`;
  };
  const hideTip = () => { tip.hidden = true; };
  const bindTip = (el, lines) => {
    el.tabIndex = 0;
    el.addEventListener('mouseenter', () => showTip(el, lines()));
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', () => showTip(el, lines()));
    el.addEventListener('blur', hideTip);
  };
  addEventListener('scroll', hideTip, { passive: true });

  const ST = { ok: { label: 'Em dia', icon: 'i-ok' }, warn: { label: 'Atenção', icon: 'i-warn' }, late: { label: 'Atrasado', icon: 'i-late' } };
  const stBadge = st => h('span', { class: 'st st-' + st }, svgUse(ST[st].icon), ST[st].label);

  /* tabela acessível ao lado de cada gráfico (botão "Ver tabela") */
  function dataTable(box, head, rows) {
    const old = box.parentNode.querySelector(`table[data-of="${box.id}"]`); if (old) old.remove();
    if (!box.id) return;
    const t = h('table', { class: 'data-tbl sr', 'data-of': box.id },
      h('thead', null, h('tr', null, head.map(c => h('th', { scope: 'col', text: c })))),
      h('tbody', null, rows.map(r => h('tr', null, r.map((c, i) => h(i ? 'td' : 'th', i ? { text: c } : { scope: 'row', text: c }))))));
    box.after(t);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.tbl-toggle'); if (!b) return;
    const t = document.querySelector(`table[data-of="${b.dataset.for}"]`); if (!t) return;
    const on = t.classList.toggle('sr');
    b.setAttribute('aria-pressed', String(!on));
    b.textContent = on ? 'Ver tabela' : 'Ocultar tabela';
  });

  /* barras horizontais: rows [{label, value, st?, sub?}] */
  function hbars(box, rows, o = {}) {
    const max = o.max || Math.max(...rows.map(r => r.value)) || 1;
    const f = o.fmt || (v => v);
    box.textContent = '';
    const wrap = h('div', { class: 'hb' + (o.ref != null ? ' hb-wrap-ref' : ''), style: `--bc:${o.color || 'var(--chart-1)'}` });
    if (o.ref != null) wrap.append(h('div', { class: 'hb-ref', style: `--x:${o.ref / max * 100}%` }, h('span', { text: o.refLabel || f(o.ref) })));
    rows.forEach(r => {
      const bar = h('i', { style: `width:${Math.max(0.8, r.value / max * 100)}%` });
      const row = h('div', { class: 'hb-row' + (r.st ? ' is-' + r.st : '') + (o.ref != null && r.value < o.ref ? ' below' : '') },
        h('span', { class: 'hb-l', text: r.label }),
        h('span', { class: 'hb-t' }, bar),
        h('span', { class: 'hb-v' }, f(r.value), r.st && r.st !== 'ok' ? svgUse(ST[r.st].icon, 'hb-ic') : null));
      bindTip(row, () => [r.label, o.tipFmt ? o.tipFmt(r) : f(r.value), ...(r.sub ? [r.sub] : []), ...(r.st ? [ST[r.st].label] : [])]);
      if (o.onPick) { row.classList.add('pick'); row.addEventListener('click', () => o.onPick(r)); row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.onPick(r); } }); }
      wrap.append(row);
    });
    box.append(wrap);
    dataTable(box, o.head || ['Item', 'Valor'], rows.map(r => [r.label, o.tipFmt ? o.tipFmt(r) : String(f(r.value))]));
  }

  /* barra única dividida por situação, com legenda (ícone + rótulo + número) */
  function stack(box, parts) {
    const total = parts.reduce((s, p) => s + p.value, 0);
    box.textContent = '';
    const bar = h('div', { class: 'stk' });
    parts.forEach(p => {
      const seg = h('i', { class: 'st-bg-' + p.st, style: `flex:${p.value}` });
      bindTip(seg, () => [p.label, `${p.value} de ${total} convênios`]);
      bar.append(seg);
    });
    const leg = h('ul', { class: 'stk-leg' }, parts.map(p => h('li', null, stBadge(p.st), h('b', { text: String(p.value) }))));
    box.append(bar, leg);
  }

  /* marcador de mínimo legal: items [{label, value, min, max}] */
  function bullets(box, items) {
    box.textContent = '';
    items.forEach(it => {
      const ok = it.value >= it.min;
      const row = h('div', { class: 'bl' },
        h('div', { class: 'bl-top' }, h('span', { text: it.label }), h('b', { text: pct(it.value) }), stBadge(ok ? 'ok' : 'late')),
        h('div', { class: 'bl-track' },
          h('i', { class: 'bl-val' + (ok ? '' : ' low'), style: `width:${it.value / it.max * 100}%` }),
          h('span', { class: 'bl-min', style: `left:${it.min / it.max * 100}%` }, h('em', { text: 'mínimo ' + pct(it.min) }))));
      bindTip(row, () => [it.label, 'Aplicado: ' + pct(it.value), 'Mínimo legal: ' + pct(it.min)]);
      box.append(row);
    });
  }

  function kpis(box, list) {
    box.textContent = '';
    list.forEach(k => box.append(h('div', { class: 'kpi' }, h('b', null, k.st ? svgUse(ST[k.st].icon, 'kpi-ic st-c-' + k.st) : null, k.v), h('span', { text: k.l }))));
  }

  /* ---------- projetos contemplados ---------- */
  PROJETOS.forEach(p => { p.slug = slug(p.municipio + '-' + p.uf); });
  const projBox = $('#projList'), projDlg = $('#projDlg');
  function openProjeto(s) {
    const p = PROJETOS.find(x => x.slug === s); if (!p || !projDlg) return;
    const body = $('#projDlgBody'); body.textContent = '';
    const mesmaUF = PROJETOS.filter(x => x.uf === p.uf);
    const totalUF = mesmaUF.reduce((a, x) => a + x.valor, 0);
    body.append(
      h('span', { class: 'mono', text: 'Projeto contemplado · ' + (NOMES_UF[p.uf] || p.uf) }),
      h('h2', { id: 'projDlgT', text: `${p.municipio}/${p.uf}` }),
      h('p', { class: 'dlg-lead', text: `${p.programa} aprovado e pago no valor de ${brl(p.valor)} para o Município de ${p.municipio}/${p.uf}.` }),
      h('dl', { class: 'facts-dl' },
        h('div', null, h('dt', { text: 'Valor pago' }), h('dd', { text: brl(p.valor) })),
        h('div', null, h('dt', { text: 'Pago em' }), h('dd', { text: p.pago })),
        h('div', null, h('dt', { text: 'Programa' }), h('dd', { text: p.programa })),
        h('div', null, h('dt', { text: 'Situação' }), h('dd', null, h('span', { class: 'paid', text: 'PAGO' })))),
      h('h3', { text: `Projetos pagos em ${NOMES_UF[p.uf] || p.uf}` }),
      h('div', { class: 'chart', id: 'chDlg' }),
      h('p', { class: 'chart-note', text: `${mesmaUF.length} ${mesmaUF.length > 1 ? 'projetos somam' : 'projeto soma'} ${brl(totalUF)} no estado.` }),
      h('div', { class: 'dlg-acts' },
        h('a', { class: 'btn btn-gold', href: '#contato', 'data-close': '', 'data-tipo': 'Pré-diagnóstico' }, 'Quero um resultado assim', svgUse('i-arr', 'arr'))));
    hbars($('#chDlg'), mesmaUF.map(x => ({ label: x.municipio, value: x.valor, cur: x.slug === p.slug })), { fmt: brlShort, tipFmt: r => brl(r.value), head: ['Município', 'Valor pago'] });
    $$('#chDlg .hb-row').forEach((r, i) => r.classList.toggle('cur', mesmaUF[i].slug === p.slug));
    openDlg(projDlg);
    history.replaceState(null, '', '#projeto-' + p.slug);
  }
  if (projDlg) {
    projDlg.addEventListener('dlg:closed', () => { if (location.hash.startsWith('#projeto-')) history.replaceState(null, '', location.pathname + location.search); });
    addEventListener('hashchange', () => { const id = location.hash.slice(1); if (/^projeto-/.test(id)) openProjeto(id.slice(8)); });
  }
  if (projBox) {
    const ufBox = $('#projUF');
    const ufs = [...new Set(PROJETOS.map(p => p.uf))].sort();
    ufBox.append(h('button', { type: 'button', 'aria-pressed': 'true', 'data-uf': '' }, 'Todos'));
    ufs.forEach(u => ufBox.append(h('button', { type: 'button', 'aria-pressed': 'false', 'data-uf': u, title: NOMES_UF[u] }, u)));
    const draw = uf => {
      const list = PROJETOS.filter(p => !uf || p.uf === uf);
      const total = list.reduce((a, p) => a + p.valor, 0);
      const maior = list.reduce((a, p) => p.valor > a.valor ? p : a, list[0]);
      kpis($('#projKpis'), [
        { v: brlShort(total), l: 'pagos aos municípios' },
        { v: String(list.length), l: list.length > 1 ? 'projetos contemplados' : 'projeto contemplado' },
        { v: brlShort(total / list.length), l: 'em média por projeto' },
        { v: brlShort(maior.valor), l: `maior projeto · ${maior.municipio}/${maior.uf}` }
      ]);
      hbars($('#chMun'), list.map(p => ({ label: `${p.municipio}/${p.uf}`, value: p.valor, slug: p.slug, sub: 'Clique para ver o projeto' })),
        { fmt: brlShort, tipFmt: r => brl(r.value), head: ['Município', 'Valor pago'], onPick: r => openProjeto(r.slug) });
      const porUF = ufs.map(u => { const l = PROJETOS.filter(p => p.uf === u); return { label: NOMES_UF[u] || u, uf: u, value: l.reduce((a, p) => a + p.valor, 0), sub: `${l.length} ${l.length > 1 ? 'projetos' : 'projeto'}` }; }).sort((a, b) => b.value - a.value);
      hbars($('#chUF'), porUF, { fmt: brlShort, tipFmt: r => brl(r.value), head: ['Estado', 'Total pago'] });
      $$('#chUF .hb-row').forEach((r, i) => r.classList.toggle('dim', !!uf && porUF[i].uf !== uf));
      projBox.textContent = '';
      list.forEach(p => projBox.append(h('button', { type: 'button', class: 'proj', 'data-proj': p.slug },
        h('div', { class: 'top' }, h('span', { class: 'mono', text: p.uf }), h('span', { class: 'paid', text: 'PAGO' })),
        h('b', { text: `${p.municipio}/${p.uf}` }),
        h('span', { class: 'prog', text: p.programa }),
        h('span', { class: 'val', text: brl(p.valor) }),
        h('span', { class: 'go' }, 'Ver projeto', svgUse('i-arr')))));
    };
    ufBox.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      ufBox.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw(b.dataset.uf);
    });
    projBox.addEventListener('click', e => { const b = e.target.closest('[data-proj]'); if (b) openProjeto(b.dataset.proj); });
    draw('');
  }

  /* ---------- painéis de exemplo dos módulos ---------- */
  $$('[data-demo-kpis]').forEach(b => kpis(b, DEMO[b.dataset.demoKpis + 'Kpis'] || []));
  $$('[data-demo]').forEach(b => {
    const k = b.dataset.demo, d = DEMO[k];
    if (k === 'gestaoStatus') stack(b, d);
    else if (k === 'gestaoExec') hbars(b, d, { max: 100, fmt: pct, color: 'var(--chart-gestao)', head: ['Convênio', 'Executado'] });
    else if (k === 'eduMinimos' || k === 'saudeMinimo') bullets(b, d);
    else if (k === 'eduProgramas') hbars(b, d, { max: 100, fmt: pct, color: 'var(--chart-edu)', head: ['Programa', 'Executado'] });
    else if (k === 'escolaFreq') hbars(b, d, { max: 100, fmt: pct, color: 'var(--chart-esc)', ref: 75, refLabel: 'mínimo 75%', head: ['Escola', 'Frequência média'] });
  });

  /* ---------- atas de registro de preço ---------- */
  const atasBox = $('#atasBox');
  if (atasBox) {
    const safePdf = u => /^(assets\/atas\/[\w.-]+\.pdf)$/.test(u || '') ? u : '';
    if (ATAS.length) {
      atasBox.append(h('h3', { text: 'Atas vigentes para adesão' }));
      const t = h('table', { class: 'atas-tbl' }, h('thead', null, h('tr', null, ['Ata nº', 'Órgão gerenciador', 'Objeto', 'Validade', 'Documento'].map(c => h('th', { scope: 'col', text: c })))));
      const tb = h('tbody');
      ATAS.forEach(a => {
        const pdf = safePdf(a.pdf);
        tb.append(h('tr', null, h('td', { text: a.numero }), h('td', { text: a.orgao }), h('td', { text: a.objeto }), h('td', { text: a.validade }),
          h('td', null, pdf ? h('a', { href: pdf, download: '' }, 'Baixar PDF') : 'Enviada com a proposta')));
      });
      t.append(tb); atasBox.append(h('div', { class: 'atas' }, t));
    } else {
      atasBox.append(h('h3', { text: 'Ata vigente para adesão' }),
        h('p', { text: 'A ata vigente, o termo de referência e a pesquisa de preços seguem junto com a proposta comercial, prontos para anexar ao processo de adesão.' }),
        h('ul', { class: 'atas-docs' }, ['Ata de registro de preços', 'Termo de referência', 'Pesquisa de preços', 'Modelo de justificativa da vantagem'].map(t => h('li', { text: t }))));
    }
  }

  /* ---------- turmas dos encontros ---------- */
  const turmaLabel = t => `${EVENTOS[t.evento].nome} · ${t.cidade}/${t.uf} · ${t.datas}`;
  const origemDe = t => t.status === 'confirmada' ? 'Inscrição curso' : 'Interesse curso';
  $$('[data-turmas]').forEach(box => {
    TURMAS.filter(t => t.evento === box.dataset.turmas).forEach(t => box.append(
      h('button', { type: 'button', class: 'turma', 'data-pick': turmaLabel(t) }, `${t.cidade}/${t.uf}`, h('small', { text: t.datas }),
        h('em', { class: t.status === 'confirmada' ? 'conf' : '', text: t.status === 'confirmada' ? 'Turma confirmada' : 'Em formação' }))));
  });
  const turmaSel = $('#f-turma');
  if (turmaSel) {
    turmaSel.append(h('option', { value: '' }, 'Escolha o encontro e a cidade'));
    TURMAS.forEach(t => turmaSel.append(h('option', { value: turmaLabel(t), 'data-origem': origemDe(t), 'data-evento': t.evento }, turmaLabel(t))));
  }
  const syncOrigem = () => {
    const f = turmaSel && turmaSel.form; if (!f || !f.origem) return;
    const o = turmaSel.selectedOptions[0]; f.origem.value = (o && o.dataset.origem) || 'Interesse curso';
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]'); if (!b || !turmaSel) return;
    turmaSel.value = b.dataset.pick; syncOrigem(); turmaSel.dispatchEvent(new Event('change'));
    const d = b.closest('dialog'); if (d) { d.close(); lockScroll(false); }
    goTo($('#inscricao'));
  });

  /* ============ FORMULÁRIOS ============ */
  $$('select[data-ufs]').forEach(s => { s.append(h('option', { value: '' }, 'UF')); UFS.forEach(u => s.append(h('option', { value: u }, u))); });

  const digits = v => (v || '').replace(/\D/g, '');
  function validCPF(v) {
    const c = digits(v);
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
    for (let t = 9; t < 11; t++) {
      let s = 0;
      for (let i = 0; i < t; i++) s += +c[i] * (t + 1 - i);
      if (+c[t] !== ((s * 10) % 11) % 10) return false;
    }
    return true;
  }
  function validCNPJ(v) {
    const c = digits(v);
    if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
    const calc = n => { let s = 0, w = n - 7; for (let i = 0; i < n; i++) { s += +c[i] * w--; if (w < 2) w = 9; } const r = s % 11; return r < 2 ? 0 : 11 - r; };
    return calc(12) === +c[12] && calc(13) === +c[13];
  }
  const MASKS = {
    cpf: d => d.slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
    cnpj: d => d.slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2'),
    tel: d => {
      d = d.slice(0, 11);
      if (d.length <= 2) return '(' + d;
      const r = d.slice(2), cut = d.length > 10 ? 5 : 4;
      return `(${d.slice(0, 2)}) ${r.slice(0, cut)}${r.length > cut ? '-' + r.slice(cut) : ''}`;
    }
  };
  document.addEventListener('input', e => {
    const i = e.target; const m = i.dataset && i.dataset.mask; if (!m || !MASKS[m]) return;
    const d = digits(i.value); i.value = d ? MASKS[m](d) : '';
  });

  const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  const visible = el => !el.disabled && !el.closest('[hidden]');
  function fieldError(el) {
    const v = (el.value || '').trim();
    if (el.type === 'checkbox') return el.required && !el.checked ? 'Marque para continuar.' : '';
    if (el.required && !v) return 'Campo obrigatório.';
    if (!v) return '';
    if (el.type === 'email' && !EMAIL.test(v)) return 'E-mail inválido.';
    const m = el.dataset.mask;
    if (m === 'cpf' && !validCPF(v)) return 'CPF inválido.';
    if (m === 'cnpj' && !validCNPJ(v)) return 'CNPJ inválido.';
    if (m === 'tel' && !/^\d{10,11}$/.test(digits(v))) return 'Telefone com DDD.';
    if (el.minLength > 0 && v.length < el.minLength) return `Escreva pelo menos ${el.minLength} caracteres.`;
    if (el.type === 'number' && v && (+v < +(el.min || 0) || (el.max && +v > +el.max))) return 'Número fora do intervalo.';
    return '';
  }
  function mark(el, msg) {
    const box = el.closest('.field') || el.closest('.consent') || el.parentNode;
    let m = box.querySelector(':scope > .err-msg');
    if (msg) {
      if (!m) { m = h('span', { class: 'err-msg', id: (el.id || el.name || 'f') + '-err' }); box.append(m); }
      m.textContent = msg; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', m.id); box.classList.add('bad');
    } else if (m) { m.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); box.classList.remove('bad'); }
  }
  function validate(scope) {
    let first = null;
    $$('input, select, textarea', scope).filter(el => visible(el) && el.type !== 'hidden' && !el.closest('.hp')).forEach(el => {
      if (el.type === 'radio' || (el.type === 'checkbox' && !el.required)) return;
      const msg = fieldError(el); mark(el, msg); if (msg && !first) first = el;
    });
    $$('[data-min]', scope).filter(visible).forEach(g => {
      const n = $$('input:checked', g).length, need = +g.dataset.min;
      const field = g.closest('.field'); let m = field.querySelector('.err-msg');
      if (n < need) { if (!m) { m = h('span', { class: 'err-msg' }); field.append(m); } m.textContent = g.dataset.errMsg || 'Escolha uma opção.'; field.classList.add('bad'); if (!first) first = g.querySelector('input'); }
      else if (m) { m.remove(); field.classList.remove('bad'); }
    });
    const cpfs = $$('input[data-mask="cpf"]', scope).filter(visible).filter(i => i.closest('.person'));
    const seen = {};
    cpfs.forEach(i => { const d = digits(i.value); if (d && seen[d]) { mark(i, 'CPF repetido entre os participantes.'); if (!first) first = i; } seen[d] = 1; });
    return first;
  }
  document.addEventListener('focusout', e => {
    const el = e.target;
    if (el.matches && el.matches('form.lead input, form.lead select, form.lead textarea') && el.type !== 'radio' && el.closest('.field.bad, .consent.bad')) mark(el, fieldError(el));
  });
  document.addEventListener('change', e => { const el = e.target; if (el.matches && el.matches('form.lead .bad input, form.lead .bad select')) mark(el, fieldError(el)); });

  /* contador de caracteres */
  $$('textarea[data-count]').forEach(t => {
    const c = document.getElementById(t.dataset.count);
    const upd = () => { c.textContent = `${t.value.length} / ${t.maxLength}`; };
    t.addEventListener('input', upd); upd();
  });

  /* limpeza do texto antes do envio */
  const clean = (v, multi) => {
    let s = String(v).normalize('NFC').replace(multi ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '');
    s = multi ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ');
    return s.trim().slice(0, 3000);
  };
  function collect(form) {
    const data = {};
    $$('input, select, textarea, output', form).forEach(el => {
      if (!el.name || el.disabled || el.closest('.hp')) return;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      const v = clean(el.tagName === 'OUTPUT' ? el.value || el.textContent : el.value, el.tagName === 'TEXTAREA');
      if (!v) return;
      data[el.name] = data[el.name] ? data[el.name] + ', ' + v : v;
    });
    return data;
  }

  const endpointOk = () => {
    try { const u = new URL(FORM_ENDPOINT); return u.protocol === 'https:' && FORM_HOSTS.includes(u.hostname); } catch (e) { return false; }
  };
  const COOLDOWN = 60e3;
  async function send(form, data) {
    const ok = form.querySelector('.ok'), btn = form.querySelector('button[type=submit]');
    const say = (msg, err) => { ok.hidden = false; ok.classList.toggle('err', !!err); ok.textContent = msg; };
    if (form.querySelector('.hp input').value) { say(form.dataset.ok); form.reset(); return; }
    if (Date.now() - (+form.dataset.t0 || 0) < 4000) return say('Confira os dados e envie novamente em alguns segundos.', true);
    const key = 'sigemec-envio-' + form.id, last = store.get(key);
    if (last && Date.now() - last < COOLDOWN) return say('Recebemos um envio deste navegador há menos de um minuto. Aguarde um instante para enviar de novo.', true);
    const assunto = `${form.dataset.subject} – ${data.municipio || ''}${data.uf ? '/' + data.uf : ''}`;
    if (!endpointOk()) {
      const corpo = Object.entries(data).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n');
      location.href = `mailto:${FORM_EMAIL}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
      store.set(key, Date.now());
      return say(`Abrimos o seu e-mail com o pedido preenchido. Confira e clique em enviar. Se ele não abrir, escreva para ${FORM_EMAIL}.`);
    }
    btn.disabled = true; btn.setAttribute('aria-busy', 'true');
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 15000);
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, _subject: assunto }), credentials: 'omit', signal: ctl.signal });
      if (!r.ok) throw new Error(String(r.status));
      store.set(key, Date.now());
      say(form.dataset.ok);
      form.reset(); form.dispatchEvent(new Event('sig:reset'));
    } catch (err) {
      say(`Não conseguimos enviar agora. Tente de novo ou escreva para ${FORM_EMAIL}.`, true);
    } finally { clearTimeout(to); btn.disabled = false; btn.removeAttribute('aria-busy'); }
  }
  $$('form.lead').forEach(f => {
    f.dataset.t0 = Date.now();
    f.addEventListener('submit', e => {
      e.preventDefault();
      const bad = validate(f);
      const ok = f.querySelector('.ok');
      if (bad) { ok.hidden = false; ok.classList.add('err'); ok.textContent = 'Confira os campos destacados.'; bad.focus(); return; }
      ok.hidden = true;
      send(f, collect(f));
    });
  });

  /* ---------- pré-diagnóstico em etapas ---------- */
  const wiz = $('#diagForm');
  function setTipo(v) {
    if (!wiz) return;
    const r = $$('input[name="tipo"]', wiz).find(i => i.value === v); if (r) r.checked = true;
  }
  if (wiz) {
    const panes = $$('.wiz-pane', wiz), marks = $$('.wiz-steps li', wiz);
    const prev = $('[data-wiz="prev"]', wiz), next = $('[data-wiz="next"]', wiz), sub = $('button[type=submit]', wiz);
    let cur = 0;
    const go = i => {
      cur = i;
      panes.forEach((p, k) => { p.hidden = k !== i; });
      marks.forEach((m, k) => { m.classList.toggle('on', k === i); m.classList.toggle('done', k < i); if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current'); });
      prev.hidden = i === 0; next.hidden = i === panes.length - 1; sub.hidden = i !== panes.length - 1;
    };
    next.addEventListener('click', () => {
      const bad = validate(panes[cur]);
      if (bad) { bad.focus(); return; }
      go(cur + 1);
      const f = panes[cur].querySelector('input:not([type=radio]):not([type=checkbox]), select, textarea'); if (f) f.focus({ preventScroll: true });
      if (wiz.getBoundingClientRect().top < 0) goTo(wiz, -100);
    });
    prev.addEventListener('click', () => go(cur - 1));
    marks.forEach((m, k) => m.addEventListener('click', () => { if (k < cur) go(k); }));
    /* módulos marcados abrem as perguntas de cada módulo */
    const syncMods = () => $$('[data-modq]', wiz).forEach(q => {
      const on = !!$(`input[data-mod="${q.dataset.modq}"]:checked`, wiz);
      q.hidden = !on; $$('input, select, textarea', q).forEach(i => { i.disabled = !on; });
    });
    wiz.addEventListener('change', e => { if (e.target.dataset.mod) syncMods(); });
    wiz.addEventListener('sig:reset', () => { syncMods(); go(0); });
    syncMods(); go(0);
  }

  /* ---------- inscrição com vários participantes ---------- */
  const insc = $('#inscForm');
  if (insc) {
    const people = $('#people'), tpl = $('#personTpl'), out = $('#t-qtd'), maxTxt = $('#t-qtd-max'), totalBox = $('#t-total');
    const FIELDS = ['nome', 'cpf', 'funcao', 'email', 'telefone'];
    const resp = { nome: $('#t-rnome'), email: $('#t-rmail'), telefone: $('#t-rtel') };
    let n = 1;
    const isPF = () => !!$('input[name="pagador"][data-payer="pf"]:checked', insc);
    const maxN = () => isPF() ? 1 : MAX_PARTICIPANTES;
    const copyResp = card => {
      const same = card.querySelector('[data-same]'); if (!same || !same.checked) return;
      Object.keys(resp).forEach(k => { const i = card.querySelector(`[data-f="${k}"]`); i.value = resp[k].value; i.readOnly = true; });
    };
    const render = () => {
      while (people.children.length < n) {
        const k = people.children.length + 1;
        const card = tpl.content.firstElementChild.cloneNode(true);
        card.querySelector('[data-n]').textContent = k;
        FIELDS.forEach(f => {
          const i = card.querySelector(`[data-f="${f}"]`), id = `p${k}-${f}`;
          i.id = id; i.name = `participante_${k}_${f}`;
          i.closest('.field').querySelector('label').htmlFor = id;
          if (f === 'nome') i.autocomplete = 'off';
        });
        if (k === 1) {
          const same = card.querySelector('.same'); same.hidden = false;
          same.querySelector('input').addEventListener('change', e => {
            if (e.target.checked) copyResp(card);
            else Object.keys(resp).forEach(f => { card.querySelector(`[data-f="${f}"]`).readOnly = false; });
          });
        }
        people.append(card);
        if (!reduce && k > 1) card.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      while (people.children.length > n) people.lastElementChild.remove();
      out.value = out.textContent = String(n);
      $('[data-qty="-1"]', insc).disabled = n <= 1;
      $('[data-qty="1"]', insc).disabled = n >= maxN();
      maxTxt.textContent = isPF() ? 'Pessoa física: inscrição individual' : `Até ${MAX_PARTICIPANTES} por município`;
      total();
    };
    const total = () => {
      const o = turmaSel && turmaSel.selectedOptions[0], ev = o && EVENTOS[o.dataset.evento];
      totalBox.textContent = '';
      if (!ev) { totalBox.append(h('span', { text: 'Escolha a turma para ver o valor.' })); return; }
      totalBox.append(h('span', { text: `${n} × ${brl(ev.preco)}` }), h('b', { text: brl(n * ev.preco) }));
      const cli = $('input[name="contrato"]:checked', insc);
      if (cli && cli.value === 'Sim') totalBox.append(h('small', { text: 'Municípios com contrato vigente e em dia podem ter isenção pelo link exclusivo. A equipe confirma na validação.' }));
    };
    insc.addEventListener('click', e => {
      const b = e.target.closest('[data-qty]'); if (!b) return;
      n = Math.min(maxN(), Math.max(1, n + +b.dataset.qty)); render();
      if (+b.dataset.qty > 0) { const f = people.lastElementChild.querySelector('input'); if (f) f.focus({ preventScroll: true }); }
    });
    const syncPayer = () => {
      const pf = isPF();
      $$('[data-payer-pj]', insc).forEach(el => { el.hidden = pf; $$('input', el).forEach(i => { i.disabled = pf; }); });
      $$('[data-payer-pf]', insc).forEach(el => { el.hidden = !pf; });
      if (pf) n = 1; render();
    };
    insc.addEventListener('change', e => {
      if (e.target.name === 'pagador') syncPayer();
      if (e.target.name === 'contrato' || e.target === turmaSel) { syncOrigem(); total(); }
    });
    Object.values(resp).forEach(i => i.addEventListener('input', () => { const c = people.firstElementChild; if (c) copyResp(c); }));
    insc.addEventListener('sig:reset', () => { n = 1; people.textContent = ''; syncPayer(); syncOrigem(); });
    syncPayer();
  }

  /* ---------- políticas (modal) ---------- */
  const legal = $('#legal');
  if (legal) {
    const tabs = $$('.legal-tabs button', legal), panels = $$('[data-panel]', legal);
    const TABS = tabs.map(b => b.dataset.tab);
    const tab = t => { tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t))); panels.forEach(p => { p.hidden = p.dataset.panel !== t; }); $('.legal-body', legal).scrollTop = 0; };
    let lastFocus = null;
    const open = t => { lastFocus = document.activeElement; tab(TABS.includes(t) ? t : 'privacidade'); legal.hidden = false; lockScroll(true); $('#legalClose').focus(); };
    const close = () => { legal.hidden = true; lockScroll(false); if (lastFocus) lastFocus.focus(); };
    document.addEventListener('click', e => { const a = e.target.closest('[data-legal]'); if (!a) return; e.preventDefault(); open(a.dataset.legal); });
    tabs.forEach(b => b.addEventListener('click', () => tab(b.dataset.tab)));
    $('#legalClose').addEventListener('click', close);
    legal.addEventListener('click', e => { if (e.target === legal) close(); });
    addEventListener('keydown', e => {
      if (legal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', legal).filter(x => !x.closest('[hidden]'));
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    if (TABS.includes(location.hash.slice(1))) open(location.hash.slice(1));
  }

  /* ---------- barra de cookies (escolha guardada por 30 dias) ---------- */
  const bar = $('#cookiebar');
  if (bar) {
    const KEY = 'sigemec-cookies', DAYS30 = 30 * 864e5;
    const saved = store.get(KEY);
    const fresh = saved && Date.now() - saved.t < DAYS30;
    const place = () => document.documentElement.style.setProperty('--cookie-h', bar.offsetHeight + 'px');
    if (!fresh) { bar.hidden = false; document.body.classList.add('has-cookie'); place(); addEventListener('resize', place); }
    $('#cookieOk').addEventListener('click', () => { store.set(KEY, { ok: true, t: Date.now() }); bar.hidden = true; document.body.classList.remove('has-cookie'); });
  }

  /* ---------- vídeo: miniatura primeiro, player só no clique ---------- */
  $$('.video[data-yt]').forEach(v => {
    const id = v.dataset.yt;
    if (!/^[\w-]{11}$/.test(id)) return;
    v.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/maxresdefault.jpg)`;
    v.addEventListener('click', () => {
      const f = h('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
        title: 'Vídeo institucional SIGEMEC', allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: true,
        referrerpolicy: 'strict-origin-when-cross-origin', loading: 'lazy',
        sandbox: 'allow-scripts allow-same-origin allow-presentation'
      });
      v.textContent = ''; v.append(f);
    }, { once: true });
  });

  /* ---------- cursor ---------- */
  const cur = $('.cursor');
  if (cur && matchMedia('(pointer: fine)').matches && !reduce) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const loop = () => { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,label,summary,.hb-row')));
  } else if (cur) cur.remove();

  const onResize = () => { sizeMethod(); methodScroll(); photoScroll(); if (hasGsap) ScrollTrigger.refresh(); };
  addEventListener('resize', onResize);
  addEventListener('load', onResize);
  onResize();
})();
