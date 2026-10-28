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
  recursos:  { valor: 2, texto: "+R$ 2 bi" },  /* ISTOÉ, 12/06/2024: "mais de 2 bilhões de reais" */
  estados:   { valor: 17 },                    /* ISTOÉ: clientes em 17 estados */
  municipios:{ valor: 250 },                   /* ISTOÉ: mais de 250 municípios */
  tecnicos:  { valor: 3000 },
  anos:      { valor: 10 },                    /* desde 2016 */
  projetos:  { valor: 18 }                     /* projetos de Educação Infantil pagos (edercarlosdalberto.com.br) */
};

/* Projetos contemplados: valor pago e data do pagamento. */
const PROJETOS = [
  { municipio: "Aquiraz", uf: "CE", programa: "Projeto de Educação Infantil", valor: 2254852.64, pago: "01/04/2024" },
  { municipio: "Monteiro", uf: "PB", programa: "Projeto de Educação Infantil", valor: 1624843.94, pago: "01/04/2024" },
  { municipio: "Anajatuba", uf: "MA", programa: "Projeto de Educação Infantil", valor: 1617679.18, pago: "01/04/2024" },
  { municipio: "Palmeira", uf: "PR", programa: "Projeto de Educação Infantil", valor: 1479877.51, pago: "01/04/2024" },
  { municipio: "Nova Mamoré", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1380194.14, pago: "01/04/2024" },
  { municipio: "Cacoal", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1310815.36, pago: "01/04/2024" },
  { municipio: "Pimenta Bueno", uf: "RO", programa: "Projeto de Educação Infantil", valor: 1304173.00, pago: "01/04/2024" },
  { municipio: "Novo Oriente", uf: "CE", programa: "Projeto de Educação Infantil", valor: 982243.04, pago: "01/04/2024" },
  { municipio: "Cururupu", uf: "MA", programa: "Projeto de Educação Infantil", valor: 950288.80, pago: "01/04/2024" },
  { municipio: "Lajeado", uf: "RS", programa: "Projeto de Educação Infantil", valor: 801915.99, pago: "01/04/2024" },
  { municipio: "Chapadão do Céu", uf: "GO", programa: "Projeto de Educação Infantil", valor: 640039.04, pago: "01/04/2024" },
  { municipio: "Barro", uf: "CE", programa: "Projeto de Educação Infantil", valor: 523336.19, pago: "01/04/2024" },
  { municipio: "Corumbiara", uf: "RO", programa: "Projeto de Educação Infantil", valor: 502757.01, pago: "01/04/2024" },
  { municipio: "Uauá", uf: "BA", programa: "Projeto de Educação Infantil", valor: 465636.44, pago: "01/04/2024" },
  { municipio: "Novo Horizonte do Oeste", uf: "RO", programa: "Projeto de Educação Infantil", valor: 372596.09, pago: "01/04/2024" },
  { municipio: "Cujubim", uf: "RO", programa: "Projeto de Educação Infantil", valor: 265054.59, pago: "01/04/2024" },
  { municipio: "Bernardino Batista", uf: "PB", programa: "Projeto de Educação Infantil", valor: 214648.80, pago: "01/04/2024" },
  { municipio: "Poço de José de Moura", uf: "PB", programa: "Projeto de Educação Infantil", valor: 152390.25, pago: "01/04/2024" }
];
const NOMES_UF = { BA: "Bahia", CE: "Ceará", GO: "Goiás", MA: "Maranhão", PB: "Paraíba", PR: "Paraná", RO: "Rondônia", RS: "Rio Grande do Sul" };

/* Turmas dos encontros técnicos.
   status: "confirmada" → origem "Inscrição curso" · "em formação" → origem "Interesse curso" */
const TURMAS = [
  { evento: "gem", cidade: "Belém", uf: "PA", datas: "29/10/2026", status: "em formação" },
  { evento: "gem", cidade: "Salinópolis", uf: "PA", datas: "06/11/2026", status: "em formação" },
  { evento: "jep", cidade: "Salinópolis", uf: "PA", datas: "04, 05 e 06/11/2026", status: "em formação" }
];
const EVENTOS = {
  gem: { nome: "Gestão Educacional Municipal 2026" },
  jep: { nome: "VIII Jornada de Excelência Pedagógica 2026" }
};
const MAX_PARTICIPANTES = 4;

/* Atas de registro de preço vigentes, para adesão. Enquanto a lista estiver vazia,
   o site mostra que a ata é enviada junto com a proposta.
   Exemplo: { numero: "012/2026", orgao: "Consórcio X", objeto: "Consultoria em gestão educacional", validade: "31/12/2026", pdf: "assets/atas/ata-012-2026.pdf" } */
const ATAS = [];

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

/* ==================================================== */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const brlShort = v => v >= 1e6 ? 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' mi' : 'R$ ' + Math.round(v / 1e3).toLocaleString('pt-BR') + ' mil';
  const slug = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const onScroll = fn => { addEventListener('scroll', fn, { passive: true }); fn(); };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const session = {
    take(k) { try { const v = sessionStorage.getItem(k); sessionStorage.removeItem(k); return v; } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
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

  /* ---------- rolagem ---------- */
  const nav = $('#nav'), subnav = $('.subnav');
  const headH = () => (nav ? nav.offsetHeight : 0) + (subnav ? subnav.offsetHeight : 0) + 12;
  const goTo = (el, smooth = true) => {
    const top = el.id === 'topo' ? 0 : el.getBoundingClientRect().top + scrollY - headH();
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? 'smooth' : 'auto' });
  };
  const lockScroll = on => { document.documentElement.classList.toggle('locked', on); };

  /* ---------- histórico: voltar e avançar funcionam em todo o site ----------
     Âncoras da mesma página criam uma entrada no histórico; janelas, menu e políticas também,
     para que o botão "voltar" do navegador ou do celular feche o que estiver aberto em vez de sair do site. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const overlays = new Map();
  let ignorePop = 0, pendingNav = null;
  const saveY = () => { try { history.replaceState(Object.assign({}, history.state, { y: scrollY }), ''); } catch (e) {} };
  function overlayOpened(name, close, url) {
    if (overlays.has(name)) return;
    overlays.set(name, close);
    saveY();
    history.pushState({ ov: name, y: scrollY }, '', url || location.href);
  }
  function overlayClosed(name) {
    if (!overlays.has(name)) return;
    overlays.delete(name);
    if (history.state && history.state.ov === name) { ignorePop++; history.back(); }
  }
  addEventListener('popstate', e => {
    if (ignorePop) {
      ignorePop--;
      if (pendingNav) { const u = pendingNav; pendingNav = null; location.href = u; }
      return;
    }
    let closed = false;
    overlays.forEach((close, name) => { if (!(e.state && e.state.ov === name)) { overlays.delete(name); close(); closed = true; } });
    if (closed) return;
    if (e.state && e.state.ov) return;
    const id = location.hash.slice(1);
    if (/^projeto-[a-z0-9-]+$/.test(id)) { openProjeto(id.slice(8), true); return; }
    if (e.state && e.state.y != null) { window.scrollTo(0, e.state.y); return; }
    const el = id && /^[\w-]+$/.test(id) && document.getElementById(id);
    if (el && el.tagName !== 'DIALOG') goTo(el, false); else if (!id) window.scrollTo(0, 0);
  });
  addEventListener('pagehide', saveY);
  /* página restaurada do cache do navegador: nada fica travado aberto */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    document.body.classList.remove('menu-open');
    $$('dialog[open]').forEach(d => d.close());
    lockScroll(false);
    overlays.clear();
  });
  /* links "Voltar": volta para a página anterior do site; sem histórico, vai para o início */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-back]'); if (!a) return;
    let same = false;
    try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) {}
    if (same && history.length > 1) { e.preventDefault(); history.back(); }
  });

  /* ---------- janelas (dialog) ---------- */
  const openDlg = (d, url) => {
    if (!d || d.open) return;
    d.showModal(); lockScroll(true);
    overlayOpened('dlg-' + d.id, () => { if (d.open) d.close(); }, url);
  };
  $$('dialog.dlg').forEach(d => {
    d.addEventListener('close', () => { lockScroll(false); overlayClosed('dlg-' + d.id); d.dispatchEvent(new CustomEvent('dlg:closed')); });
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    openDlg(document.getElementById(b.dataset.open));
  });

  /* ---------- âncoras da mesma página ---------- */
  const samePageTarget = raw => {
    const i = raw.indexOf('#'); if (i < 0) return null;
    const file = raw.slice(0, i), id = raw.slice(i + 1);
    const here = location.pathname.split('/').pop() || 'index.html';
    if (file && file !== here) return null;
    const el = id && document.getElementById(id);
    return el && el.tagName !== 'DIALOG' ? el : null;
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (a.dataset.route !== undefined || a.dataset.legal !== undefined) return;
    const raw = a.getAttribute('href');
    if (a.dataset.tipo) { setTipo(a.dataset.tipo); session.set('sig-tipo', a.dataset.tipo); }
    const el = samePageTarget(raw);
    if (!el) return;
    e.preventDefault();
    const inOverlay = a.closest('dialog, #sheet');
    if (inOverlay) { if (a.closest('#sheet')) closeMenu(); }
    else { saveY(); history.pushState({ a: 1 }, '', '#' + el.id); }
    goTo(el);
  });
  addEventListener('load', () => {
    const t = session.take('sig-tipo'); if (t) setTipo(t);
    if (history.state && history.state.y != null) { window.scrollTo(0, history.state.y); return; }
    const id = location.hash.slice(1);
    if (/^projeto-[a-z0-9-]+$/.test(id)) { history.replaceState(null, '', location.pathname); return openProjeto(id.slice(8)); }
    const el = id && /^[\w-]+$/.test(id) && document.getElementById(id);
    if (el && el.tagName !== 'DIALOG') setTimeout(() => goTo(el, false), 60);
  });

  /* ---------- menu do celular ---------- */
  const menuBtn = $('#menuBtn');
  function setMenu(open) {
    if (!menuBtn || document.body.classList.contains('menu-open') === open) return;
    if (open && nav) document.documentElement.style.setProperty('--sheet-top', Math.max(0, nav.getBoundingClientRect().bottom) + 'px');
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    lockScroll(open);
    if (open) overlayOpened('menu', () => setMenu(false)); else overlayClosed('menu');
  }
  function closeMenu() { setMenu(false); }
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    /* link para outra página: primeiro desfaz a entrada do menu no histórico, depois navega */
    $$('#sheet a').forEach(a => a.addEventListener('click', e => {
      if (a.target === '_blank' || samePageTarget(a.getAttribute('href'))) return;
      if (history.state && history.state.ov === 'menu') {
        e.preventDefault();
        if (a.dataset.tipo) session.set('sig-tipo', a.dataset.tipo);
        pendingNav = a.href;
        overlays.delete('menu'); ignorePop++; history.back();
        setTimeout(() => { if (pendingNav) { const u = pendingNav; pendingNav = null; location.href = u; } }, 400);
      }
    }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    matchMedia('(min-width:1100px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }
  if (nav) onScroll(() => nav.classList.toggle('scrolled', scrollY > 8));

  /* ---------- acessar o sistema ---------- */
  const accBtn = $('#accBtn'), accMenu = $('#accMenu');
  function setAcc(o) { if (!accBtn) return; accMenu.hidden = !o; accBtn.setAttribute('aria-expanded', String(o)); }
  if (accBtn) {
    accBtn.addEventListener('click', e => { e.stopPropagation(); setAcc(accMenu.hidden); if (!accMenu.hidden) { const f = accMenu.querySelector('a'); if (f) f.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.acc')) setAcc(false); });
    accMenu.addEventListener('click', e => { if (e.target.closest('a')) setAcc(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !accMenu.hidden) { setAcc(false); accBtn.focus(); } });
  }

  /* ---------- sub-navegação da página de áreas ---------- */
  const subLinks = $$('.subnav a');
  if (subLinks.length) {
    const secs = subLinks.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    onScroll(() => {
      let idx = 0;
      secs.forEach((m, i) => { if (m && m.getBoundingClientRect().top < innerHeight * 0.4) idx = i; });
      subLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
    });
  }

  /* ---------- barra de leitura do blog ---------- */
  const readBar = $('#readBar');
  if (readBar) onScroll(() => {
    const art = $('#post');
    if (!art || art.hidden) { readBar.style.transform = 'scaleX(0)'; return; }
    const r = art.getBoundingClientRect();
    readBar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))})`;
  });

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

  /* barras horizontais: rows [{label, value, sub?}] */
  function hbars(box, rows, o = {}) {
    const max = o.max || Math.max(...rows.map(r => r.value)) || 1;
    const f = o.fmt || (v => v);
    box.textContent = '';
    const wrap = h('div', { class: 'hb' });
    rows.forEach(r => {
      const bar = h('i', { style: `width:${Math.max(0.8, r.value / max * 100)}%` });
      const row = h('div', { class: 'hb-row' }, h('span', { class: 'hb-l', text: r.label }), h('span', { class: 'hb-t' }, bar), h('span', { class: 'hb-v', text: f(r.value) }));
      bindTip(row, () => [r.label, o.tipFmt ? o.tipFmt(r) : f(r.value), ...(r.sub ? [r.sub] : [])]);
      if (o.onPick) { row.classList.add('pick'); row.addEventListener('click', () => o.onPick(r)); row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.onPick(r); } }); }
      wrap.append(row);
    });
    box.append(wrap);
    dataTable(box, o.head || ['Item', 'Valor'], rows.map(r => [r.label, o.tipFmt ? o.tipFmt(r) : String(f(r.value))]));
  }
  function kpis(box, list) {
    box.textContent = '';
    list.forEach(k => box.append(h('div', { class: 'kpi' }, h('b', { text: k.v }), h('span', { text: k.l }))));
  }

  /* ---------- projetos contemplados ---------- */
  PROJETOS.forEach(p => { p.slug = slug(p.municipio + '-' + p.uf); });
  const projBox = $('#projList'), projUF = $('#projUF'), projDlg = $('#projDlg');
  function openProjeto(s, fromHistory) {
    const p = PROJETOS.find(x => x.slug === s); if (!p || !projDlg) return;
    const mesmaUF = PROJETOS.filter(x => x.uf === p.uf);
    const totalUF = mesmaUF.reduce((a, x) => a + x.valor, 0);
    const body = $('#projDlgBody');
    body.textContent = '';
    body.append(
      h('p', { class: 'eyebrow', text: 'Projeto contemplado' }),
      h('h2', { id: 'projDlgT', text: `${p.municipio}/${p.uf}` }),
      h('dl', { class: 'proj-facts' },
        h('div', null, h('dt', { text: 'Valor pago' }), h('dd', { text: brl(p.valor) })),
        h('div', null, h('dt', { text: 'Data do pagamento' }), h('dd', { text: p.pago })),
        h('div', null, h('dt', { text: 'Programa' }), h('dd', { text: p.programa })),
        h('div', null, h('dt', { text: 'Situação' }), h('dd', null, h('span', { class: 'paid', text: 'PAGO' })))),
      h('h3', { text: `Projetos pagos em ${NOMES_UF[p.uf] || p.uf}` }),
      h('div', { class: 'chart', id: 'chDlg' }),
      h('p', { class: 'chart-note', text: `${mesmaUF.length} ${mesmaUF.length > 1 ? 'projetos somam' : 'projeto soma'} ${brl(totalUF)} no estado.` }),
      h('div', { class: 'dlg-acts' },
        h('a', { class: 'btn btn-gold', href: '#contato', 'data-close': '', 'data-tipo': 'Diagnóstico gratuito' }, 'Quero um resultado assim', svgUse('i-arr', 'arr'))));
    hbars($('#chDlg'), mesmaUF.map(x => ({ label: x.municipio, value: x.valor })), { fmt: brlShort, tipFmt: r => brl(r.value), head: ['Município', 'Valor pago'] });
    $$('#chDlg .hb-row').forEach((r, i) => r.classList.toggle('cur', mesmaUF[i].slug === p.slug));
    if (fromHistory) { projDlg.showModal(); lockScroll(true); overlays.set('dlg-projDlg', () => { if (projDlg.open) projDlg.close(); }); }
    else openDlg(projDlg, '#projeto-' + p.slug);
  }
  if (projUF) {
    const ufBox = projUF;
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
      if (projBox) projBox.textContent = '';
      if (projBox) list.forEach(p => projBox.append(h('button', { type: 'button', class: 'proj', 'data-proj': p.slug },
        h('span', { class: 'paid', text: 'PAGO' }),
        h('b', { text: `${p.municipio}/${p.uf}` }),
        h('span', { class: 'prog', text: p.programa }),
        h('span', { class: 'val', text: brl(p.valor) }))));
    };
    ufBox.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      ufBox.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw(b.dataset.uf);
    });
    if (projBox) projBox.addEventListener('click', e => { const b = e.target.closest('[data-proj]'); if (b) openProjeto(b.dataset.proj); });
    draw('');
  }

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
      atasBox.append(h('h3', { text: 'Documentos para a adesão' }),
        h('p', { text: 'A ata vigente, o termo de referência e a pesquisa de preços são enviados com a proposta comercial, prontos para anexar ao processo de adesão.' }),
        h('ul', { class: 'checks' }, ['Ata de registro de preços', 'Termo de referência', 'Pesquisa de preços', 'Modelo de justificativa da vantagem'].map(t => h('li', { text: t }))));
    }
  }

  /* ---------- turmas dos eventos ---------- */
  const turmaLabel = t => `${EVENTOS[t.evento].nome} · ${t.cidade}/${t.uf} · ${t.datas}`;
  const origemDe = t => t.status === 'confirmada' ? 'Inscrição curso' : 'Interesse curso';
  $$('[data-turmas]').forEach(box => {
    TURMAS.filter(t => t.evento === box.dataset.turmas).forEach(t => box.append(
      h('button', { type: 'button', class: 'turma', 'data-pick': turmaLabel(t) }, h('b', { text: `${t.cidade}/${t.uf}` }), h('small', { text: t.datas }),
        h('em', { class: t.status === 'confirmada' ? 'conf' : '', text: t.status === 'confirmada' ? 'Turma confirmada' : 'Inscrições abertas' }))));
  });
  const turmaSel = $('#f-turma');
  if (turmaSel) {
    turmaSel.append(h('option', { value: '' }, 'Escolha o evento, a cidade e a data'));
    TURMAS.forEach(t => turmaSel.append(h('option', { value: turmaLabel(t), 'data-origem': origemDe(t), 'data-evento': t.evento }, turmaLabel(t))));
  }
  const syncOrigem = () => {
    const f = turmaSel && turmaSel.form; if (!f || !f.origem) return;
    const o = turmaSel.selectedOptions[0]; f.origem.value = (o && o.dataset.origem) || 'Interesse curso';
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]'); if (!b || !turmaSel) return;
    turmaSel.value = b.dataset.pick; syncOrigem(); turmaSel.dispatchEvent(new Event('change'));
    const d = b.closest('dialog'); if (d) d.close();
    else { saveY(); history.pushState({ a: 1 }, '', '#inscricao'); }
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
    if (m === 'tel' && !/^\d{10,11}$/.test(digits(v))) return 'Informe o telefone com DDD.';
    if (el.minLength > 0 && v.length < el.minLength) return `Escreva pelo menos ${el.minLength} caracteres.`;
    if (el.type === 'number' && v && (+v < +(el.min || 0) || (el.max && +v > +el.max))) return 'Número fora do intervalo permitido.';
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
  /* o aviso some enquanto a pessoa corrige o campo: assim o layout não pula na hora de clicar em "Continuar" */
  document.addEventListener('input', e => { const el = e.target; if (el.matches && el.matches('form.lead .bad input, form.lead .bad textarea') && !fieldError(el)) mark(el, ''); });

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
      return say(`Abrimos o seu e-mail com a mensagem preenchida. Confira e clique em enviar. Se ele não abrir, escreva para ${FORM_EMAIL}.`);
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
      say(`Não foi possível enviar agora. Tente de novo ou escreva para ${FORM_EMAIL}.`, true);
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

  /* ---------- formulário de contato em etapas ---------- */
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
      if (wiz.getBoundingClientRect().top < 0) goTo(wiz);
    });
    prev.addEventListener('click', () => go(cur - 1));
    marks.forEach((m, k) => m.addEventListener('click', () => { if (k < cur) go(k); }));
    /* áreas marcadas abrem as perguntas de cada área */
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
    const people = $('#people'), tpl = $('#personTpl'), out = $('#t-qtd'), maxTxt = $('#t-qtd-max');
    const FIELDS = ['nome', 'cpf', 'funcao', 'email', 'telefone'];
    const resp = { nome: $('#t-rnome'), email: $('#t-rmail'), telefone: $('#t-rtel') };
    let n = 1;
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
      }
      while (people.children.length > n) people.lastElementChild.remove();
      out.value = out.textContent = String(n);
      $('[data-qty="-1"]', insc).disabled = n <= 1;
      $('[data-qty="1"]', insc).disabled = n >= MAX_PARTICIPANTES;
      maxTxt.textContent = `Até ${MAX_PARTICIPANTES} por município`;
    };
    insc.addEventListener('click', e => {
      const b = e.target.closest('[data-qty]'); if (!b) return;
      n = Math.min(MAX_PARTICIPANTES, Math.max(1, n + +b.dataset.qty)); render();
      if (+b.dataset.qty > 0) { const f = people.lastElementChild.querySelector('input'); if (f) f.focus({ preventScroll: true }); }
    });
    insc.addEventListener('change', e => { if (e.target === turmaSel) syncOrigem(); });
    Object.values(resp).forEach(i => i.addEventListener('input', () => { const c = people.firstElementChild; if (c) copyResp(c); }));
    insc.addEventListener('sig:reset', () => { n = 1; people.textContent = ''; render(); syncOrigem(); });
    render();
  }

  /* ---------- políticas (janela) ---------- */
  const legal = $('#legal');
  if (legal) {
    const tabs = $$('.legal-tabs button', legal), panels = $$('[data-panel]', legal);
    const TABS = tabs.map(b => b.dataset.tab);
    const tab = t => { tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t))); panels.forEach(p => { p.hidden = p.dataset.panel !== t; }); $('.legal-body', legal).scrollTop = 0; };
    let lastFocus = null;
    const hide = () => { legal.hidden = true; lockScroll(false); if (lastFocus) lastFocus.focus(); };
    const open = t => {
      lastFocus = document.activeElement; tab(TABS.includes(t) ? t : 'privacidade');
      if (!legal.hidden) return;
      legal.hidden = false; lockScroll(true); $('#legalClose').focus();
      overlayOpened('legal', hide);
    };
    const close = () => { if (legal.hidden) return; hide(); overlayClosed('legal'); };
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
    if (TABS.includes(location.hash.slice(1))) { history.replaceState(null, '', location.pathname); open(location.hash.slice(1)); }
  }

  /* ---------- barra de cookies (escolha guardada por 30 dias) ---------- */
  const bar = $('#cookiebar');
  if (bar) {
    const KEY = 'sigemec-cookies', DAYS30 = 30 * 864e5;
    const saved = store.get(KEY);
    const fresh = saved && Date.now() - saved.t < DAYS30;
    if (!fresh) { bar.hidden = false; document.body.classList.add('has-cookie'); }
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
})();
