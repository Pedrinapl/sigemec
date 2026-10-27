/* Painel SIGEMEC — prévia navegável com dados fictícios.
   Tudo o que a equipe cadastra aqui fica salvo só neste navegador (localStorage), para demonstração. */
(() => {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const KEY = 'sgm-painel-v3';
  const AUTH = 'sgm-painel-auth';
  const DEMO_CODE = '246810';

  /* ---------- utilitários ---------- */
  const ICONS = {
    plus: 'M12 5v14M5 12h14', download: 'M12 4v11M7 10l5 5 5-5M5 20h14', search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4',
    logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10', ext: 'M7 17 17 7M9 7h8v8', check: 'M5 12l5 5 9-10', x: 'M6 6l12 12M18 6 6 18',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
    eyeoff: 'M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1.1',
    up: 'M6 14l6-6 6 6', down: 'M6 10l6 6 6-6', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', edit: 'M4 20h4L19 9l-4-4L4 16v4z',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5', users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 1 0 0-6M22 20c0-3-2-5-5-5',
    book: 'M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 19V5', chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', home: 'M3 11l9-7 9 7v9h-6v-6H9v6H3z',
    inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5', file: 'M6 3h8l5 5v13H6zM14 3v5h5', upload: 'M12 16V5M7 10l5-5 5 5M5 20h14',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2', pin: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    menu: 'M4 7h16M4 12h16M4 17h16', mail: 'M3 6h18v12H3zM3 7l9 6 9-6', copy: 'M8 8h12v12H8zM4 16V4h12', layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', award: 'M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 14 7 21l5-3 5 3-1.5-7',
    money: 'M3 6h18v12H3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9v.01M18 15v.01', mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
    quote: 'M7 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6', hash: 'M5 9h14M5 15h14M10 4 8 20M16 4l-2 16', send: 'M4 12l16-8-6 16-3-7z'
  };
  function ic(n) {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', 'ic'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', ICONS[n] || ''); s.append(p); return s;
  }
  /* monta elementos sem innerHTML: todo texto entra como texto */
  function h(tag, a, ...kids) {
    const el = document.createElement(tag);
    if (a) for (const k in a) {
      const v = a[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    for (const c of kids.flat(Infinity)) { if (c == null || c === false) continue; el.append(c.nodeType ? c : document.createTextNode(String(c))); }
    return el;
  }
  const uid = () => Math.random().toString(36).slice(2, 9);
  const brl = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const brl2 = v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dBR = iso => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const nowBR = () => { const d = new Date(); return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); };
  const ini = n => (n || '?').split(/\s+/).filter(w => w.length > 2 || /^[A-ZÁÉÍÓÚ]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const digits = s => String(s || '').replace(/\D/g, '');
  const maskCPF = s => { const d = digits(s); return d.length === 11 ? `•••.${d.slice(3, 6)}.${d.slice(6, 9)}-••` : s; };
  const validCPF = s => {
    const d = digits(s); if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    for (const n of [9, 10]) { let t = 0; for (let i = 0; i < n; i++) t += +d[i] * (n + 1 - i); if (((t * 10) % 11) % 10 !== +d[n]) return false; }
    return true;
  };
  const fmtCPF = v => { const d = digits(v).slice(0, 11); return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); };
  const fmtTel = v => { const d = digits(v).slice(0, 11); return d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3') : d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/[-\s(]+$/, ''); };
  const norm = s => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  /* e-mails de exemplo usam o domínio reservado .example: nunca chegam a ninguém de verdade */
  const slug = s => norm(String(s).split('/')[0]).replace(/[^a-z0-9]+/g, '');
  const pessoaEmail = n => norm(n).split(/\s+/).filter(Boolean).filter((w, i, a) => i === 0 || i === a.length - 1).join('.') + '@email.example';
  const isEmail = v => /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(v);

  function countUp(el, to, o = {}) {
    const dec = o.dec || 0, pre = o.pre || '', suf = o.suf || '', dur = o.dur || 1400;
    const f = v => pre + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) { el.textContent = f(to); return; }
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = f(to * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const logo = () => $('#logo').content.firstElementChild.cloneNode(true);

  /* ---------- dados de exemplo ---------- */
  const MOD = { 'Gestão': '#B07E10', 'Educação': '#D9532B', 'Saúde': '#1E7FAE', 'Escola': '#23944A' };
  const ST = { novo: 'Novo', contato: 'Em contato', proposta: 'Proposta enviada', fechado: 'Contrato fechado' };
  const PS = ['Pré-inscrito', 'Validado', 'Pago', 'Isento'];
  const PSC = { 'Pré-inscrito': 'p-mute', 'Validado': 'p-warn', 'Pago': 'p-ok', 'Isento': 'p-info' };
  const UFS = 'AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO'.split(' ');

  function seed() {
    const P = (id, data, mun, orgao, resp, cargo, tipo, mods, status, cpf, email, tel, urg, pop, answers, desc) => ({ id, data, mun, orgao, resp, cargo, tipo, mods, status, cpf, cnpj: '••.•••.•••/0001-•• (validado)', email, tel, urg, pop, answers, desc, notas: [] });
    const d = {
      pedidos: [
        P('p1', '2026-10-26', 'Tianguá/CE', 'Secretaria de Educação', 'Marta Albuquerque', 'Secretária de Educação', 'Pré-diagnóstico', ['Educação', 'Gestão'], 'novo', '•••.318.442-••', 'm.albuquerque@[municipio].gov.br', '(88) 9••••-••12', 'Recurso bloqueado por pendência', '30 a 100 mil', [['PAR Ciclo 5', 'Em andamento'], ['PNAE, PNATE e PDDE', 'Algum com pendência'], ['Escolas na rede', '41']], 'Temos duas obras de creche paradas desde 2022 e a prestação de contas do PNAE de 2024 está em diligência no SIGPC. Precisamos regularizar antes de cadastrar novas ações do PAR.'),
        P('p2', '2026-10-25', 'Salinópolis/PA', 'Prefeitura Municipal', 'José Carvalho', 'Controlador-geral', 'Proposta e ata', ['Gestão'], 'contato', '•••.902.115-••', 'controladoria@[municipio].gov.br', '(91) 9••••-••40', 'Captar novos recursos', '30 a 100 mil', [['Obra ou convênio paralisado', 'Sim, 1 ou 2'], ['Plataformas', 'Transferegov, SIMEC']], 'Queremos a ata vigente e a proposta para aderir ainda neste exercício. A controladoria precisa da pesquisa de preços para anexar ao processo.'),
        P('p3', '2026-10-24', 'Cachoeirinha/RS', 'Secretaria de Educação', 'Paula Menezes', 'Diretora pedagógica', 'Pré-diagnóstico', ['Escola'], 'proposta', '•••.554.870-••', 'p.menezes@[municipio].gov.br', '(51) 9••••-••77', 'Implantar sistema de gestão', '100 a 500 mil', [['Registro de notas hoje', 'Parte em papel'], ['Escolas que usariam', '38']], 'A rede usa planilhas em metade das escolas. Queremos centralizar matrícula e frequência antes do Censo de 2027.'),
        P('p4', '2026-10-23', 'Cururupu/MA', 'Secretaria de Saúde', 'Renata Lima', 'Secretária de Saúde', 'Pré-diagnóstico', ['Saúde', 'Gestão'], 'novo', '•••.230.661-••', 'saude@[municipio].gov.br', '(98) 9••••-••03', 'Prazo de prestação de contas', '30 a 100 mil', [['Plano Municipal de Saúde', 'Em elaboração'], ['RAG e RDQA', 'Com atraso']], 'O RDQA do segundo quadrimestre não foi apresentado na Câmara e o Plano Municipal de Saúde 2026–2029 ainda está em elaboração.'),
        P('p5', '2026-10-22', 'Monteiro/PB', 'Secretaria de Educação', 'Carlos Nóbrega', 'Técnico do PAR', 'Treinamento in company', ['Educação'], 'fechado', '•••.775.304-••', 'par@[municipio].gov.br', '(83) 9••••-••58', 'Organizar e capacitar a equipe', '30 a 100 mil', [['PAR Ciclo 5', 'Concluído'], ['Alunos matriculados', '6.200']], 'Queremos uma turma fechada para 25 técnicos sobre SIGPC Ágil e Fundeb 2027.'),
        P('p6', '2026-10-21', 'Igarassu/PE', 'Prefeitura Municipal', 'Ana Paula Souto', 'Secretária de Planejamento', 'Pré-diagnóstico', ['Gestão', 'Educação', 'Saúde'], 'contato', '•••.418.239-••', 'planejamento@[municipio].gov.br', '(81) 9••••-••91', 'Obra parada', '100 a 500 mil', [['Obra ou convênio paralisado', 'Sim, 3 ou mais'], ['Diagnóstico do PAR', 'Não sei']], 'Três convênios com obra parada e saldo em conta. Precisamos entender se ainda dá para reprogramar ou se teremos de devolver.')
      ],
      cursos: [
        { id: 'gem', nome: 'Gestão Educacional Municipal 2026', cor: '#EA6036', carga: '8 horas', preco: 500, status: 'Inscrições abertas', site: true, publico: 'Secretários, técnicos do PAR e do SIGPC, financeiro e conselheiros',
          turmas: [
            { id: 'gem-belem', cidade: 'Belém', uf: 'PA', data: '2026-10-29', local: 'Auditório central', vagas: 40, base: 22, status: 'Confirmada' },
            { id: 'gem-salin', cidade: 'Salinópolis', uf: 'PA', data: '2026-11-06', local: 'Centro de convenções', vagas: 40, base: 17, status: 'Em formação' }
          ],
          dias: [{ id: uid(), titulo: 'Dia único', sessoes: [
            { id: uid(), hora: '08:00', titulo: 'Credenciamento e abertura', quem: 'Equipe SIGEMEC' },
            { id: uid(), hora: '08:30', titulo: '4% do Fundeb para o Tempo Integral (STN 1071 e 1072)', quem: 'Eder Carlos Dalberto' },
            { id: uid(), hora: '10:30', titulo: 'Censo Escolar, RH, Compras, Financeiro e SIOPE', quem: 'Eder Carlos Dalberto' },
            { id: uid(), hora: '14:00', titulo: 'SIGPC Ágil: prestação de contas do PNAE, PNATE, PDDE', quem: 'Sandra Maria Forti' },
            { id: uid(), hora: '16:00', titulo: 'Regras atualizadas do CACS-Fundeb e do CAE', quem: 'Murilo Prevê' }
          ] }],
          palestrantes: [
            { id: uid(), nome: 'Eder Carlos Dalberto', cargo: 'Instrutor e CEO do SIGEMEC Group' },
            { id: uid(), nome: 'Sandra Maria Forti', cargo: 'Coordenadora técnica' },
            { id: uid(), nome: 'Murilo Prevê', cargo: 'Advogado especialista em gestão pública' }
          ],
          materiais: [
            { id: uid(), nome: 'Apostila — Gestão Educacional 2026', tipo: 'PDF', tam: '4,2 MB' },
            { id: uid(), nome: 'Planilha de cálculo do Fundeb', tipo: 'XLSX', tam: '380 KB' },
            { id: uid(), nome: 'Modelo de prestação de contas PNAE', tipo: 'DOCX', tam: '96 KB' }
          ] },
        { id: 'jep', nome: 'VIII Jornada de Excelência Pedagógica', cor: '#39A9DB', carga: '24 horas', preco: 1000, status: 'Inscrições abertas', site: true, publico: 'Diretores, vice-diretores, coordenadores pedagógicos e conselhos escolares',
          turmas: [{ id: 'jep-salin', cidade: 'Salinópolis', uf: 'PA', data: '2026-11-04', local: 'Centro de convenções', vagas: 35, base: 14, status: 'Em formação' }],
          dias: [
            { id: uid(), titulo: 'Dia 1 · PDDE', sessoes: [{ id: uid(), hora: '08:00', titulo: 'PDDE na prática: do plano à prestação de contas', quem: 'Eder Carlos Dalberto' }, { id: uid(), hora: '14:00', titulo: 'Oficina: plano de aplicação da escola', quem: 'Eder Carlos Dalberto' }] },
            { id: uid(), titulo: 'Dia 2 · Inclusão', sessoes: [{ id: uid(), hora: '08:00', titulo: 'Inclusão na prática: AEE e sala de recursos', quem: 'Sandra Maria Forti' }, { id: uid(), hora: '14:00', titulo: 'Estudos de caso por etapa de ensino', quem: 'Sandra Maria Forti' }] },
            { id: uid(), titulo: 'Dia 3 · Tempo Integral', sessoes: [{ id: uid(), hora: '08:00', titulo: 'Educação em Tempo Integral: organização da rede', quem: 'Sandra Maria Forti' }, { id: uid(), hora: '14:00', titulo: 'Encerramento e entrega dos certificados', quem: 'Equipe SIGEMEC' }] }
          ],
          palestrantes: [{ id: uid(), nome: 'Eder Carlos Dalberto', cargo: 'Instrutor e CEO do SIGEMEC Group' }, { id: uid(), nome: 'Sandra Maria Forti', cargo: 'Coordenadora técnica' }],
          materiais: [{ id: uid(), nome: 'Caderno da Jornada 2026', tipo: 'PDF', tam: '6,8 MB' }] }
      ],
      pessoas: [
        { id: 'a', turma: 'gem-belem', nome: 'Luciana Ferreira', cpf: '•••.442.918-••', funcao: 'Dirigente Municipal de Educação', mun: 'Castanhal/PA', pagador: 'Prefeitura', status: 'Pago', pres: { 0: true }, cert: true },
        { id: 'b', turma: 'gem-belem', nome: 'Rafael Monteiro', cpf: '•••.105.377-••', funcao: 'Técnico(a) Municipal do PAR', mun: 'Castanhal/PA', pagador: 'Prefeitura', status: 'Pago', pres: { 0: true }, cert: false },
        { id: 'c', turma: 'gem-belem', nome: 'Juliana Costa', cpf: '•••.839.020-••', funcao: 'Técnico(a) Municipal do SIGPC', mun: 'Bragança/PA', pagador: 'Prefeitura', status: 'Validado', pres: {}, cert: false },
        { id: 'd', turma: 'gem-belem', nome: 'Marcos Antônio Reis', cpf: '•••.661.473-••', funcao: 'Financeiro ou contabilidade', mun: 'Bragança/PA', pagador: 'Prefeitura', status: 'Validado', pres: {}, cert: false },
        { id: 'e', turma: 'gem-belem', nome: 'Sílvia Rocha', cpf: '•••.270.585-••', funcao: 'Conselheiro(a) CACS-Fundeb', mun: 'Capanema/PA', pagador: 'Pessoa física', status: 'Pré-inscrito', pres: {}, cert: false },
        { id: 'f', turma: 'gem-belem', nome: 'Edson Barros', cpf: '•••.318.006-••', funcao: 'Diretor(a) escolar', mun: 'Vigia/PA', pagador: 'Prefeitura', status: 'Isento', pres: { 0: true }, cert: false },
        { id: 'g', turma: 'gem-salin', nome: 'Patrícia Nunes', cpf: '•••.551.204-••', funcao: 'Técnico(a) Municipal do PAR', mun: 'Salinópolis/PA', pagador: 'Prefeitura', status: 'Validado', pres: {}, cert: false },
        { id: 'i', turma: 'gem-salin', nome: 'Rogério Pantoja', cpf: '•••.083.672-••', funcao: 'Secretário(a) de Educação', mun: 'Maracanã/PA', pagador: 'Prefeitura', status: 'Pago', pres: {}, cert: false },
        { id: 'j', turma: 'jep-salin', nome: 'Helena Quaresma', cpf: '•••.734.118-••', funcao: 'Diretor(a) escolar', mun: 'Salinópolis/PA', pagador: 'Prefeitura', status: 'Pago', pres: { 0: true, 1: true }, cert: false },
        { id: 'k', turma: 'jep-salin', nome: 'Antônio Cardoso', cpf: '•••.290.457-••', funcao: 'Coordenador(a) pedagógico(a)', mun: 'Primavera/PA', pagador: 'Prefeitura', status: 'Validado', pres: { 0: true }, cert: false },
        { id: 'l', turma: 'jep-salin', nome: 'Denise Farias', cpf: '•••.612.903-••', funcao: 'Conselho escolar', mun: 'Salinópolis/PA', pagador: 'Pessoa física', status: 'Pré-inscrito', pres: {}, cert: false }
      ],
      eventos: [
        { id: 'e1', titulo: 'Gestão Educacional Municipal 2026', data: '2026-10-29', cidade: 'Belém/PA', desc: 'Encontro técnico de um dia para secretarias de educação: Fundeb, Tempo Integral, SIGPC Ágil e CACS.', status: 'Publicado', curso: 'gem' },
        { id: 'e2', titulo: 'Gestão Educacional Municipal 2026', data: '2026-11-06', cidade: 'Salinópolis/PA', desc: 'Segunda turma do encontro, com o mesmo programa.', status: 'Publicado', curso: 'gem' },
        { id: 'e3', titulo: 'VIII Jornada de Excelência Pedagógica', data: '2026-11-04', cidade: 'Salinópolis/PA', desc: 'Três dias de exposições, oficinas e estudos de caso para diretores e coordenadores.', status: 'Publicado', curso: 'jep' },
        { id: 'e4', titulo: 'Encontro de Gestão em Saúde Municipal', data: '2027-03-18', cidade: 'A definir', desc: 'Planejamento do SUS, RDQA e prestação de contas. Em planejamento.', status: 'Rascunho', curso: '' }
      ],
      fotos: [
        { id: uid(), src: '../assets/img/p1.jpg', leg: 'Turma em encontro técnico', album: 'Encontros 2025', capa: true },
        { id: uid(), src: '../assets/img/p4.jpg', leg: 'Reunião com secretárias municipais', album: 'Encontros 2025', capa: false },
        { id: uid(), src: '../assets/img/p2.jpg', leg: 'Participantes do encontro técnico', album: 'Encontros 2025', capa: false },
        { id: uid(), src: '../assets/img/p3.jpg', leg: 'Sala de capacitação', album: 'Jornada Pedagógica', capa: false },
        { id: uid(), src: '../assets/img/p5.jpg', leg: 'Equipe SIGEMEC com gestores', album: 'Jornada Pedagógica', capa: false },
        { id: uid(), src: '../assets/img/p6.jpg', leg: 'Grupo ao final do treinamento', album: 'Jornada Pedagógica', capa: false }
      ],
      secoes: [
        ['Início', 'Abertura com os quatro módulos', 'Destaque'], ['Início', 'O problema e os números do setor', 'Texto'], ['Início', 'Quatro módulos, um grupo', 'Cartões'], ['Início', 'Sete etapas até a conta fechar', 'Linha do tempo'],
        ['Início', 'O que já foi feito', 'Números'], ['Início', 'Projetos contemplados', 'Painel'], ['Início', 'Quem está por trás', 'Vídeo'], ['Início', 'Encontros técnicos', 'Chamada'],
        ['Início', 'Para ficar em dia', 'Blog'], ['Início', 'Depoimentos', 'Carrossel'], ['Início', 'Como contratar', 'Diagrama'], ['Início', 'Pré-diagnóstico', 'Formulário'],
        ['Módulos', 'Gestão', 'Módulo'], ['Módulos', 'Educação', 'Módulo'], ['Módulos', 'Saúde', 'Módulo'], ['Módulos', 'Escola', 'Módulo'], ['Módulos', 'Comparativo', 'Tabela'],
        ['Treinamentos', 'Próximo encontro', 'Destaque'], ['Treinamentos', 'Como funciona a inscrição', 'Passos'], ['Treinamentos', 'Encontros e turmas', 'Cartões'], ['Treinamentos', 'Fotos dos encontros', 'Galeria'], ['Treinamentos', 'Pré-inscrição', 'Formulário'],
        ['Sobre nós', 'O que fazemos', 'Texto'], ['Sobre nós', 'O que muda para quem trabalha com a gente', 'Antes e depois'], ['Sobre nós', 'Equipe', 'Cartões'], ['Sobre nós', 'Como trabalhamos', 'Texto']
      ].map(([pagina, titulo, tipo]) => ({ id: uid(), pagina, titulo, tipo, visivel: true })),
      numeros: [['Recursos captados (destaque)', 'R$ 2,5 bi'], ['Municípios atendidos', '500'], ['Estados', '18'], ['Técnicos capacitados', '15000'], ['Cursos realizados', '150'], ['Satisfação nos treinamentos (%)', '98']].map(([label, value]) => ({ id: uid(), label, value })),
      projetos: [['Aquiraz/CE', 2254852.64], ['Monteiro/PB', 1624843.94], ['Anajatuba/MA', 1617679.18], ['Nova Mamoré/RO', 1380194.14], ['Cacoal/RO', 1310815.36], ['Pimenta Bueno/RO', 1304173], ['Novo Oriente/CE', 982243.04], ['Cururupu/MA', 950288.8], ['Novo Horizonte do Oeste/RO', 372596.09], ['Cujubim/RO', 265054.59], ['Bernardino Batista/PB', 214648.8], ['Poço de José de Moura/PB', 152390.25]].map(([mun, valor]) => ({ id: uid(), mun, valor, pago: '2024-04-01', prog: 'Projeto de Educação Infantil' })),
      atas: [],
      depos: [['Luslarlene U. de Souza Fiametti', "Santa Luzia d'Oeste/RO", 'Secretária Municipal de Educação', true], ['Isabel Fonseca', 'Cachoeirinha/RS', 'Secretária de Educação', true], ['Dalva Maria de Carli', 'Santo Antônio da Patrulha/RS', 'Secretária Municipal de Educação', true], ['Gleíza Guerra de Assis Braga', 'Maracanaú/CE', 'Gestora educacional', true], ['Alex Sandro Lima', 'Boa Viagem/CE', 'Secretário Municipal', true], ['Lenilda Campos', 'Frei Miguelinho/PE', 'Secretária Municipal', false]].map(([nome, mun, cargo, on]) => ({ id: uid(), nome, mun, cargo, on, texto: '' })),
      pub: { pend: 0, last: '26/10/2026 às 18:35' }
    };
    d.pedidos.forEach(p => { p.email = p.email.replace('[municipio].gov.br', slug(p.mun) + '.example'); });
    d.pessoas.forEach(p => { p.email = pessoaEmail(p.nome); });
    d.envios = []; d.finEmails = {};
    return d;
  }
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { db = seed(); }
  db.envios = db.envios || []; db.finEmails = db.finEmails || {};
  db.pessoas.forEach(p => { if (!p.email) p.email = pessoaEmail(p.nome); });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { toast('Não foi possível salvar neste navegador (espaço cheio).', true); return false; } };
  const dirty = () => { db.pub.pend++; save(); };

  const allTurmas = () => db.cursos.flatMap(c => c.turmas.map(t => ({ ...t, curso: c })));
  const turmaById = id => allTurmas().find(t => t.id === id);
  const inscritos = t => (t.base || 0) + db.pessoas.filter(p => p.turma === t.id).length;
  const turmaLabel = t => `${t.cidade}/${t.uf} · ${dBR(t.data)}`;

  /* ---------- estado da interface ---------- */
  const S = { view: 'visao', period: '30d', pStatus: 'todos', pSel: 'p1', q: '', iq: '', turma: 'gem-belem', curso: 'gem', cTab: 'resumo', presTurma: '', presDia: 0, sub: 'numeros', secPage: 'Início', album: 'Todos' };

  /* ---------- toasts ---------- */
  function toast(msg, err) {
    const t = h('div', { class: 'toast' + (err ? ' err' : ''), role: 'status' }, ic(err ? 'x' : 'check'), msg);
    $('#toasts').append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
  }

  /* ---------- formulários em janela ---------- */
  const modal = $('#modal');
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  function openModal(title, eyebrow, body) {
    const box = $('#mBox'); box.replaceChildren(
      h('div', { class: 'm-head' }, h('div', null, eyebrow ? h('span', { class: 'mono', text: eyebrow }) : null, h('h2', { id: 'mTitle', text: title })),
        h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Fechar', onclick: () => modal.close() }, ic('x'))),
      body);
    if (!modal.open) modal.showModal();
    const first = box.querySelector('input:not([type=hidden]),select,textarea'); if (first) setTimeout(() => first.focus(), 60);
  }
  /* fields: {name,label,type,options,required,full,placeholder,min,max,help} */
  function openForm({ title, eyebrow = 'Adicionar', fields, values = {}, submit = 'Salvar', onSubmit }) {
    const files = {};
    const form = h('form', { class: 'm-form', novalidate: true });
    for (const f of fields) {
      const v = values[f.name] != null ? values[f.name] : (f.value != null ? f.value : '');
      let ctl;
      if (f.type === 'select') ctl = h('select', { name: f.name }, (f.options || []).map(o => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return h('option', { value: val, text: lab, selected: String(val) === String(v) || null }); }));
      else if (f.type === 'textarea') ctl = h('textarea', { name: f.name, placeholder: f.placeholder || null, maxlength: f.max || 2000 }, String(v));
      else if (f.type === 'checks') ctl = h('div', { class: 'opts' }, f.options.map(o => h('label', null, h('input', { type: 'checkbox', name: f.name, value: o, checked: (v || []).includes(o) }), h('span', null, MOD[o] ? h('i', { style: `width:8px;height:8px;border-radius:50%;background:${MOD[o]}` }) : null, o))));
      else if (f.type === 'file') {
        const prev = h('div', { class: 'prev' });
        ctl = h('div', { class: 'stack' }, h('input', { type: 'file', name: f.name, accept: f.accept || 'image/*', multiple: f.multiple || null, onchange: async e => {
          prev.replaceChildren(); files[f.name] = [];
          for (const file of [...e.target.files].slice(0, 12)) {
            if (f.accept && f.accept.startsWith('image') && !file.type.startsWith('image/')) continue;
            const item = f.accept && f.accept.startsWith('image') ? await shrink(file) : { name: file.name, size: file.size, type: file.type };
            files[f.name].push(item); if (item.src) prev.append(h('img', { src: item.src, alt: '' }));
          }
        } }), prev);
      } else {
        ctl = h('input', { name: f.name, type: f.type === 'cpf' || f.type === 'tel' || f.type === 'money' ? 'text' : (f.type || 'text'), value: String(v), placeholder: f.placeholder || null, inputmode: f.type === 'cpf' || f.type === 'money' ? 'numeric' : (f.type === 'tel' ? 'tel' : null), min: f.min ?? null, maxlength: f.max || 200, autocomplete: 'off' });
        if (f.type === 'cpf') ctl.addEventListener('input', () => { ctl.value = fmtCPF(ctl.value); });
        if (f.type === 'tel') ctl.addEventListener('input', () => { ctl.value = fmtTel(ctl.value); });
      }
      form.append(h('label', { class: 'f' + (f.full || f.type === 'textarea' || f.type === 'checks' || f.type === 'file' ? ' full' : ''), 'data-f': f.name }, h('span', { text: f.label + (f.required ? ' *' : '') }), ctl, f.help ? h('small', { style: 'color:var(--mute);font-size:12px', text: f.help }) : null, h('em', { hidden: true })));
    }
    form.append(h('div', { class: 'm-acts' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => modal.close(), text: 'Cancelar' }), h('button', { type: 'submit', class: 'btn btn-ink' }, ic('check'), submit)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {}; let ok = true;
      for (const f of fields) {
        const wrap = form.querySelector(`[data-f="${f.name}"]`), em = wrap.querySelector('em');
        let val;
        if (f.type === 'checks') val = $$(`input[name="${f.name}"]:checked`, form).map(i => i.value);
        else if (f.type === 'file') val = files[f.name] || [];
        else val = form.elements[f.name].value.trim();
        let err = '';
        if (f.required && (!val || (Array.isArray(val) && !val.length))) err = f.type === 'file' ? 'Escolha pelo menos um arquivo.' : 'Campo obrigatório.';
        else if (val && f.type === 'cpf' && !validCPF(val)) err = 'CPF inválido.';
        else if (val && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err = 'E-mail inválido.';
        else if (val && f.type === 'number' && (isNaN(+val) || +val < (f.min ?? -Infinity))) err = 'Número inválido.';
        else if (val && f.type === 'money' && isNaN(parseFloat(val.replace(/\./g, '').replace(',', '.')))) err = 'Valor inválido.';
        if (f.type === 'money' && val) val = parseFloat(val.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
        wrap.classList.toggle('bad', !!err); em.hidden = !err; em.textContent = err; if (err) ok = false;
        data[f.name] = val;
      }
      if (!ok) { const b = form.querySelector('.bad input,.bad select,.bad textarea'); if (b) b.focus(); return; }
      if (onSubmit(data) !== false) modal.close();
    });
    openModal(title, eyebrow, form);
  }
  /* reduz a foto antes de guardar: 1200px no lado maior, JPEG */
  function shrink(file) {
    return new Promise(res => {
      const rd = new FileReader();
      rd.onload = () => {
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, 1200 / Math.max(img.width, img.height));
          const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res({ src: c.toDataURL('image/jpeg', 0.78), name: file.name });
        };
        img.onerror = () => res({ src: '', name: file.name });
        img.src = rd.result;
      };
      rd.readAsDataURL(file);
    });
  }
  function confirmBox(msg, onYes) {
    openModal('Confirmar', null, h('div', { class: 'm-form' }, h('p', { class: 'full', style: 'margin:0', text: msg }),
      h('div', { class: 'm-acts' }, h('button', { type: 'button', class: 'btn btn-ghost', text: 'Cancelar', onclick: () => modal.close() }), h('button', { type: 'button', class: 'btn btn-ink', text: 'Remover', onclick: () => { modal.close(); onYes(); } }))));
  }
  function csv(name, rows) {
    const esc = v => { const s = String(v ?? ''); return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const blob = new Blob(['﻿' + rows.map(r => r.map(esc).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Planilha gerada: ' + name);
  }

  /* ---------- peças de tela ---------- */
  const btn = (label, icon, onclick, cls = '') => h('button', { type: 'button', class: 'btn ' + cls, onclick }, icon ? ic(icon) : null, label);
  const addBtn = (label, onclick, cls = 'btn-gold') => btn(label, 'plus', onclick, 'btn-add ' + cls);
  const head = (eyebrow, title, sub, acts) => h('header', { class: 'hd' }, h('div', null, h('span', { class: 'mono', text: eyebrow }), h('h1', { text: title }), sub ? h('p', { text: sub }) : null),
    h('div', { class: 'acts' }, h('span', { class: 'tag-demo', text: 'Prévia · dados fictícios' }), acts));
  const card = (title, note, acts, ...body) => h('section', { class: 'card' }, h('div', { class: 'c-head' }, h('div', null, h('h2', { text: title }), note ? h('p', { class: 'note', text: note }) : null), acts ? h('div', { class: 'acts' }, acts) : null), body);
  const chip = (label, on, onclick, count, color) => h('button', { type: 'button', class: 'chip', 'aria-pressed': String(!!on), onclick, style: color ? `--c:${color}` : null }, color ? h('i') : null, label, count != null ? h('small', { text: String(count) }) : null);
  const tabs = (list, cur, set, label) => h('div', { class: 'tabs', role: 'tablist', 'aria-label': label }, list.map(([id, lab, icon]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(cur === id), onclick: () => set(id) }, icon ? ic(icon) : null, lab)));
  const bars = (rows, max) => h('div', { class: 'bars' }, rows.map(([label, v, color, txt]) => h('div', { class: 'bar', title: `${label}: ${txt ?? v}` },
    h('span', null, color ? h('i', { class: 'dot', style: `--c:${color}` }) : null, label), h('span', { class: 'tr' }, h('i', { style: `--w:${Math.max(2, v / (max || 1) * 100)}%;--c:${color || '#B07E10'}` })), h('b', { text: txt ?? String(v) }))));
  const kpi = (label, value, note, color, count) => {
    const b = h('b', { text: value });
    if (count && !reduce) requestAnimationFrame(() => countUp(b, count.to, count));
    return h('div', { class: 'kpi', style: color ? `--c:${color}` : null }, h('span', { text: label }), b, note ? h('small', { class: /^\+/.test(note) ? 'up' : '', text: note }) : null);
  };
  const empty = (msg, icon = 'inbox') => h('div', { class: 'empty' }, ic(icon), h('p', { style: 'margin:0', text: msg }));
  const sw = (label, on, onchange) => h('label', { class: 'sw' }, h('input', { type: 'checkbox', checked: on, onchange: e => onchange(e.target.checked) }), h('i'), h('span', { text: label }));

  /* ---------- navegação ---------- */
  const NAV = [
    ['visao', 'Visão geral', 'home', '#E0A729'], ['pedidos', 'Pedidos', 'inbox', '#39A9DB'], ['inscricoes', 'Inscrições', 'users', '#EA6036'],
    ['cursos', 'Cursos', 'book', '#40C965'], ['conteudo', 'Conteúdo do site', 'layers', '#C3CDDA'], ['relatorios', 'Relatórios', 'file', '#93A3B8']
  ];
  function drawNav() {
    const badge = { pedidos: db.pedidos.filter(p => p.status === 'novo').length + ' novos', inscricoes: String(db.pessoas.length), cursos: String(db.cursos.length), conteudo: db.pub.pend ? String(db.pub.pend) : '' };
    $('#sNav').replaceChildren(...NAV.map(([id, label, icon, c]) => h('button', { type: 'button', style: `--c:${c}`, 'aria-current': S.view === id ? 'page' : null, onclick: () => go(id) }, ic(icon), label, badge[id] ? h('em', { text: badge[id] }) : null)));
  }
  function go(view, extra) {
    Object.assign(S, { view }, extra || {});
    $('#app').classList.remove('nav-open'); $('#navBtn').setAttribute('aria-expanded', 'false');
    render(true); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  let lastView = '';
  function render(fresh) {
    drawNav();
    const act = document.activeElement, keepId = act && act.id, sel = act && act.selectionStart;
    const V = { visao, pedidos, inscricoes, cursos, conteudo, relatorios }[S.view];
    const box = h('div', { class: fresh || lastView !== S.view ? 'v-in' : '' }, V());
    lastView = S.view;
    $('#main').replaceChildren(box);
    if (keepId) { const el = document.getElementById(keepId); if (el) { el.focus(); try { if (sel != null) el.setSelectionRange(sel, sel); } catch (e) {} } }
    /* o destaque de item novo vale só para este desenho */
    [db.pedidos, db.pessoas, db.projetos, db.secoes, ...db.cursos.map(c => c.turmas), ...db.cursos.flatMap(c => c.dias.map(d => d.sessoes))].forEach(l => l.forEach(x => { delete x.fresh; }));
  }

  /* ---------- adicionar rápido ---------- */
  function quickAdd() {
    const opts = [
      ['Pedido', 'Registrar pedido recebido por telefone ou e-mail', 'inbox', '#39A9DB', addPedido],
      ['Participante', 'Inscrever alguém numa turma', 'users', '#EA6036', () => addPessoa()],
      ['Curso', 'Criar um novo curso ou encontro', 'book', '#40C965', addCurso],
      ['Evento', 'Divulgar um evento no site', 'calendar', '#E0A729', addEvento],
      ['Fotos de evento', 'Enviar fotos para a galeria', 'image', '#EA6036', addFotos],
      ['Seção do site', 'Criar um novo bloco numa página', 'layers', '#39A9DB', addSecao]
    ];
    openModal('O que você quer adicionar?', 'Adicionar', h('div', { class: 'qadd' }, opts.map(([t, d, i, c, fn]) => h('button', { type: 'button', style: `--c:${c}`, onclick: () => { modal.close(); setTimeout(fn, 80); } }, ic(i), t, h('small', { text: d })))));
  }

  /* =================== VISÃO GERAL =================== */
  function visao() {
    const K = { '7d': [9, 17, 11500, 94], '30d': [38, 64, 41500, 92], ano: [312, 486, 318000, 89] }[S.period];
    const extraP = Math.max(0, db.pedidos.length - 6), extraI = Math.max(0, db.pessoas.length - 12);
    const prev = allTurmas().reduce((s, t) => s + inscritos(t) * t.curso.preco, 0);
    const mods = { 'Educação': 12, 'Gestão': 10, 'Escola': 8, 'Saúde': 4 }; db.pedidos.forEach(p => p.mods.forEach(m => { mods[m] = (mods[m] || 0) + 1; }));
    const mrows = Object.entries(mods).sort((a, b) => b[1] - a[1]); const mmax = mrows[0][1];
    const wk = [3, 5, 4, 6, 4, 7, 5, 4 + extraP], wmax = Math.max(...wk);
    const ufs = { 'Ceará': 9, 'Pará': 7, 'Rio Grande do Sul': 6, 'Maranhão': 5, 'Paraíba': 4, 'Pernambuco': 4 };
    return [
      head('Painel de controle', 'Visão geral', 'Como o site está gerando pedidos e inscrições para a equipe comercial.', [btn('Exportar planilha', 'download', () => exportArea(['pedidos', 'inscricoes', 'financeiro'])), addBtn('Adicionar', quickAdd)]),
      h('div', { class: 'stack' },
        h('div', { class: 'chips' }, [['7d', '7 dias'], ['30d', '30 dias'], ['ano', '2026']].map(([id, l]) => chip(l, S.period === id, () => { S.period = id; render(); }))),
        h('div', { class: 'grid g4' },
          kpi('Pedidos de pré-diagnóstico', String(K[0] + extraP), '+12% sobre o período anterior', '#39A9DB', { to: K[0] + extraP }),
          kpi('Inscrições em encontros', String(K[1] + extraI), '+8% sobre o período anterior', '#EA6036', { to: K[1] + extraI }),
          kpi('Valor previsto das turmas abertas', brl(prev), 'Antes de isenções de clientes', '#40C965', { to: prev, pre: 'R$ ' }),
          kpi('Respondidos em até 1 dia útil', K[3] + '%', 'Meta: 90%', '#E0A729', { to: K[3], suf: '%' })),
        h('div', { class: 'grid g2' },
          card('Pedidos por módulo', 'Um pedido pode marcar mais de um módulo.', null, bars(mrows.map(([m, v]) => [m, v, MOD[m]]), mmax)),
          card('Pedidos por semana', 'Pré-diagnósticos e propostas recebidos pelo site.', null,
            h('div', { class: 'cols' }, wk.map((v, i) => h('div', { title: `Semana ${i + 36}: ${v} pedidos` }, i === wk.length - 1 ? h('b', { text: String(v) }) : null, h('i', { style: `--h:${v / wmax * 100}%` })))),
            h('div', { class: 'cols-l' }, wk.map((v, i) => h('span', { text: 'S' + (i + 36) })))),
          card('Ocupação das turmas', null, [btn('Ver cursos', 'book', () => go('cursos'), 'btn-sm')], h('div', { class: 'stack' }, allTurmas().map(t => {
            const n = inscritos(t);
            return h('div', { class: 'stack', style: 'gap:6px' }, h('div', { style: 'display:flex;justify-content:space-between;gap:10px;font-size:14px' }, h('span', null, h('b', { text: turmaLabel(t) })), h('span', { style: 'color:var(--body)' }, h('b', { style: 'color:var(--ink)', text: String(n) }), ` de ${t.vagas} vagas`)),
              h('div', { class: 'meter' }, h('i', { style: `--w:${Math.min(100, n / t.vagas * 100)}%;--c:${t.curso.cor}` })), h('small', { style: 'color:var(--body)', text: t.curso.nome }));
          }))),
          card('Pedidos por estado', null, null, bars(Object.entries(ufs), 9))),
        card('Pedidos mais recentes', null, [btn('Ver todos', null, () => go('pedidos'), 'btn-sm')], pedidoTable(db.pedidos.slice(0, 5), true))
      )
    ];
  }

  /* =================== PEDIDOS =================== */
  function pedidoTable(list, compact) {
    if (!list.length) return empty('Nenhum pedido nesta situação.');
    return h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' },
      h('thead', null, h('tr', null, ['Data', 'Município', 'Responsável', 'Módulos', 'Situação'].map(t => h('th', { text: t })))),
      h('tbody', null, list.map(p => h('tr', { class: 'click' + (!compact && p.id === S.pSel ? ' sel' : '') + (p.fresh ? ' row-in' : ''), tabindex: 0, onclick: () => { S.pSel = p.id; if (compact) go('pedidos', { pStatus: 'todos' }); else render(); }, onkeydown: e => { if (e.key === 'Enter') e.currentTarget.click(); } },
        h('td', { class: 'mono-c', text: dBR(p.data).slice(0, 5) }), h('td', null, h('b', { text: p.mun }), h('small', { text: p.orgao })), h('td', null, p.resp, h('small', { text: p.tipo })),
        h('td', null, h('div', { class: 'mods' }, p.mods.map(m => h('span', { class: 'mod', style: `--c:${MOD[m]}` }, h('i'), m)))), h('td', null, h('span', { class: 'pill p-' + p.status, text: ST[p.status] }))))))
    );
  }
  function pedidos() {
    const q = norm(S.q);
    const counts = { todos: db.pedidos.length }; Object.keys(ST).forEach(k => { counts[k] = db.pedidos.filter(p => p.status === k).length; });
    const list = db.pedidos.filter(p => (S.pStatus === 'todos' || p.status === S.pStatus) && (!q || norm([p.mun, p.resp, p.orgao, p.email].join(' ')).includes(q)));
    const s = db.pedidos.find(p => p.id === S.pSel);
    return [
      head('Painel de controle', 'Pedidos', 'Pré-diagnósticos, propostas e treinamentos in company enviados pelo site.', [btn('Exportar planilha', 'download', () => exportArea(['pedidos'])), addBtn('Novo pedido', addPedido)]),
      h('div', { class: 'toolbar' }, [['todos', 'Todos'], ...Object.entries(ST)].map(([id, l]) => chip(l, S.pStatus === id, () => { S.pStatus = id; render(); }, counts[id])),
        h('label', { class: 'search' }, ic('search'), h('span', { class: 'sr', text: 'Buscar pedido' }), h('input', { id: 'qPed', type: 'search', placeholder: 'Município, responsável ou e-mail', value: S.q, oninput: e => { S.q = e.target.value; render(); } }))),
      h('div', { class: 'split' }, h('section', { class: 'card', style: 'padding:8px' }, pedidoTable(list)), s ? detPedido(s) : h('aside', { class: 'det' }, h('p', { style: 'margin:0;color:var(--mute-d)', text: 'Selecione um pedido para ver as respostas do formulário.' })))
    ];
  }
  function detPedido(s) {
    return h('aside', { class: 'det', 'aria-label': 'Detalhe do pedido' },
      h('div', null, h('span', { class: 'mono', text: `${s.tipo} · recebido em ${dBR(s.data)}` }), h('h2', { text: s.mun }), h('span', { style: 'color:var(--mute-d);font-size:14px', text: s.orgao })),
      h('div', { class: 'stack', style: 'gap:8px' }, h('span', { class: 'lbl', text: 'Situação' }), h('div', { class: 'st-opts' }, Object.entries(ST).map(([k, l]) => h('button', { type: 'button', class: s.status === k ? 'p-' + k : '', 'aria-pressed': String(s.status === k), text: l, onclick: () => { s.status = k; s.notas.unshift({ t: nowBR(), txt: 'Situação alterada para ' + l }); save(); render(); toast('Situação atualizada: ' + l); } })))),
      h('dl', { class: 'facts' }, [['Responsável', s.resp], ['Cargo', s.cargo], ['CPF', s.cpf], ['CNPJ do órgão', s.cnpj], ['E-mail', s.email], ['WhatsApp', s.tel], ['Urgência', s.urg], ['População', s.pop]].map(([k, v]) => h('div', null, h('dt', { text: k }), h('dd', { text: v || '—' })))),
      s.answers && s.answers.length ? h('div', null, h('span', { class: 'lbl', text: 'Respostas por módulo' }), s.answers.map(([k, v]) => h('div', { class: 'ans' }, h('span', { text: k }), h('b', { text: v })))) : null,
      h('div', { class: 'stack', style: 'gap:8px' }, h('span', { class: 'lbl', text: 'Situação descrita pelo município' }), h('p', { class: 'desc', text: s.desc || '—' })),
      h('div', { class: 'stack', style: 'gap:8px' }, h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, h('span', { class: 'lbl', text: 'Anotações da equipe' }),
        h('button', { type: 'button', class: 'btn btn-sm btn-add', style: 'background:transparent;color:var(--paper);border-color:rgba(237,240,244,.25)', onclick: () => openForm({ title: 'Nova anotação', eyebrow: s.mun, fields: [{ name: 'txt', label: 'Anotação', type: 'textarea', required: true, placeholder: 'Ex.: Liguei para a secretária, retorno na sexta.' }], onSubmit: d => { s.notas.unshift({ t: nowBR(), txt: d.txt }); save(); render(); toast('Anotação adicionada.'); } }) }, ic('plus'), 'Adicionar')),
        s.notas.length ? h('div', { class: 'tl' }, s.notas.map(n => h('div', null, h('small', { text: n.t }), n.txt))) : h('p', { class: 'lgpd', text: 'Nenhuma anotação ainda.' })),
      h('div', { class: 'acts' }, h('button', { type: 'button', class: 'btn btn-gold', onclick: () => responder(s) }, ic('mail'), 'Responder por e-mail'),
        h('button', { type: 'button', class: 'btn', style: 'background:transparent;color:var(--paper);border-color:rgba(237,240,244,.25)', onclick: () => proposta(s) }, ic('file'), 'Enviar proposta')),
      h('p', { class: 'lgpd', text: 'CPF e telefone aparecem mascarados. O dado completo só abre para quem tem permissão, e cada acesso fica registrado (LGPD).' }));
  }
  function addPedido() {
    openForm({ title: 'Novo pedido', eyebrow: 'Pedidos', fields: [
      { name: 'mun', label: 'Município', required: true, placeholder: 'Ex.: Tianguá' }, { name: 'uf', label: 'UF', type: 'select', options: UFS, value: 'CE' },
      { name: 'orgao', label: 'Órgão', type: 'select', options: ['Prefeitura Municipal', 'Secretaria de Educação', 'Secretaria de Saúde', 'Controladoria', 'Outro'] },
      { name: 'tipo', label: 'Tipo de pedido', type: 'select', options: ['Pré-diagnóstico', 'Proposta e ata', 'Treinamento in company'] },
      { name: 'resp', label: 'Responsável', required: true }, { name: 'cargo', label: 'Cargo' },
      { name: 'cpf', label: 'CPF do responsável', type: 'cpf', placeholder: '000.000.000-00' }, { name: 'tel', label: 'WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
      { name: 'email', label: 'E-mail', type: 'email', full: true },
      { name: 'mods', label: 'Módulos de interesse', type: 'checks', options: Object.keys(MOD), required: true },
      { name: 'urg', label: 'Urgência', type: 'select', options: ['Recurso bloqueado por pendência', 'Prazo de prestação de contas', 'Obra parada', 'Captar novos recursos', 'Organizar e capacitar a equipe'] },
      { name: 'pop', label: 'População', type: 'select', options: ['Até 10 mil', '10 a 30 mil', '30 a 100 mil', '100 a 500 mil', 'Mais de 500 mil'] },
      { name: 'desc', label: 'Situação descrita pelo município', type: 'textarea' }
    ], submit: 'Registrar pedido', onSubmit: d => {
      const p = { id: uid(), data: today(), mun: `${d.mun}/${d.uf}`, orgao: d.orgao, resp: d.resp, cargo: d.cargo, tipo: d.tipo, mods: d.mods, status: 'novo', cpf: d.cpf ? maskCPF(d.cpf) : '—', cnpj: '—', email: d.email || '—', tel: d.tel ? d.tel.replace(/\d(?=\d{2}$)|\d(?=\d{3}-)/g, '•') : '—', urg: d.urg, pop: d.pop, answers: [], desc: d.desc, notas: [{ t: nowBR(), txt: 'Pedido registrado manualmente pelo painel.' }], fresh: true };
      db.pedidos.unshift(p); save(); go('pedidos', { pSel: p.id, pStatus: 'todos', q: '' }); toast('Pedido de ' + p.mun + ' registrado.');
    } });
  }
  const temEmail = s => isEmail(s.email) || (toast('Este pedido não tem e-mail válido cadastrado.', true), false);
  function responder(s) {
    if (!temEmail(s)) return;
    composeMail([{ to: [s.email], cc: [], bcc: [], label: s.mun, subject: `SIGEMEC · ${s.tipo} · ${s.mun}`,
      body: `Olá, ${primeiro(s.resp)},\n\nRecebemos o pedido de ${s.tipo.toLowerCase()} de ${s.mun} (${s.orgao}) e já estamos analisando a situação descrita.\n\nPara agilizar, você tem disponibilidade para uma conversa de 20 minutos nesta semana? Pode responder com o melhor dia e horário.` + ASSINATURA,
      onSent: () => { s.notas.unshift({ t: nowBR(), txt: 'E-mail de retorno enviado para ' + s.email }); if (s.status === 'novo') s.status = 'contato'; } }], { tipo: 'Retorno de pedido' });
  }
  function proposta(s) {
    if (!temEmail(s)) return;
    composeMail([{ to: [s.email], cc: ['comercial@sigemec.com.br'], bcc: [], label: s.mun, subject: `Proposta SIGEMEC · ${s.mods.join(', ')} · ${s.mun}`,
      body: `Olá, ${primeiro(s.resp)},\n\nSegue em anexo a proposta do SIGEMEC para ${s.mun}, com o escopo dos módulos ${s.mods.join(', ')}.\n\nTambém vão anexos a ata de registro de preço vigente, o termo de referência e a pesquisa de preços, para instruir o processo de adesão.\n\nFicamos à disposição para apresentar a proposta à equipe.` + ASSINATURA,
      onSent: () => { s.notas.unshift({ t: nowBR(), txt: 'Proposta enviada por e-mail para ' + s.email }); s.status = 'proposta'; } }], { tipo: 'Proposta', anexo: 'a proposta, a ata e o termo de referência' });
  }

  /* =================== INSCRIÇÕES =================== */
  function inscricoes() {
    const t = turmaById(S.turma) || allTurmas()[0]; S.turma = t.id;
    const q = norm(S.iq);
    const list = db.pessoas.filter(p => p.turma === t.id && (!q || norm(p.nome + ' ' + p.mun + ' ' + p.funcao).includes(q)));
    const n = inscritos(t), pagos = db.pessoas.filter(p => p.turma === t.id && p.status === 'Pago').length;
    return [
      head('Painel de controle', 'Inscrições', 'Pré-inscrições dos encontros técnicos, com participantes e pagamento.', [btn('Exportar planilha', 'download', () => exportArea(['inscricoes', 'financeiro'])), btn('Enviar boletos', 'mail', () => openBoleto(t.id), 'btn-ink'), addBtn('Adicionar participante', () => addPessoa(t.id))]),
      h('div', { class: 'stack' },
        h('div', { class: 'chips' }, allTurmas().map(x => chip(turmaLabel(x), x.id === t.id, () => { S.turma = x.id; render(); }, null, x.curso.cor))),
        h('div', { class: 'grid g4' }, kpi('Inscritos', `${n} / ${t.vagas}`, `${Math.round(n / t.vagas * 100)}% das vagas`, t.curso.cor), kpi('Valor previsto', brl(n * t.curso.preco), brl(t.curso.preco) + ' por participante', '#40C965'), kpi('Pagos nesta lista', String(pagos), null, '#E0A729'), kpi('Situação da turma', t.status, t.curso.nome, '#39A9DB')),
        h('section', { class: 'card', style: 'padding:8px' },
          h('div', { class: 'toolbar', style: 'padding:8px 8px 0' }, h('span', { style: 'font-size:13px;color:var(--body)', text: 'Clique na situação para avançar: pré-inscrito → validado → pago → isento.' }),
            h('label', { class: 'search' }, ic('search'), h('span', { class: 'sr', text: 'Buscar participante' }), h('input', { id: 'qIns', type: 'search', placeholder: 'Nome, função ou município', value: S.iq, oninput: e => { S.iq = e.target.value; render(); } }))),
          list.length ? h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Participante', 'CPF', 'Função', 'Município', 'Pagador', 'Situação', 'Ações'].map(x => h('th', { text: x })))),
            h('tbody', null, list.map(p => h('tr', { class: p.fresh ? 'row-in' : '' }, h('td', null, h('b', { text: p.nome })), h('td', { class: 'mono-c', text: p.cpf }), h('td', { text: p.funcao }), h('td', { text: p.mun }), h('td', { style: 'color:var(--body)', text: p.pagador }),
              h('td', null, h('button', { type: 'button', class: 'pill ' + PSC[p.status], title: 'Avançar situação', text: p.status, onclick: () => { p.status = PS[(PS.indexOf(p.status) + 1) % PS.length]; save(); render(); } })),
              h('td', null, h('div', { class: 'acts', style: 'flex-wrap:nowrap' }, p.boleto ? h('span', { class: 'pill p-info', title: 'Boleto enviado', text: dBR(p.boleto).slice(0, 5) }) : null, p.status !== 'Pago' && p.status !== 'Isento' ? h('button', { type: 'button', class: 'ibtn', title: 'Enviar boleto', 'aria-label': 'Enviar boleto para ' + p.nome, onclick: () => openBoleto(t.id, p.id) }, ic('mail')) : null, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover ' + p.nome, onclick: () => confirmBox(`Remover ${p.nome} desta turma?`, () => { db.pessoas = db.pessoas.filter(x => x !== p); save(); render(); toast('Participante removido.'); }) }, ic('trash'))))))))) : empty('Nenhum participante encontrado.', 'users')),
        h('div', { class: 'acts' }, btn('Gerar lista de presença', 'check', () => go('cursos', { curso: t.curso.id, cTab: 'presenca', presTurma: t.id }), 'btn-ink'), btn('Enviar boletos da turma', 'mail', () => openBoleto(t.id)))
      )
    ];
  }
  function addPessoa(turma) {
    openForm({ title: 'Adicionar participante', eyebrow: 'Inscrições', fields: [
      { name: 'turma', label: 'Turma', type: 'select', options: allTurmas().map(t => [t.id, `${t.curso.nome} · ${turmaLabel(t)}`]), value: turma || S.turma, full: true },
      { name: 'nome', label: 'Nome completo', required: true, full: true }, { name: 'cpf', label: 'CPF', type: 'cpf', required: true, placeholder: '000.000.000-00' },
      { name: 'funcao', label: 'Função', type: 'select', options: ['Dirigente Municipal de Educação', 'Secretário(a) de Educação', 'Técnico(a) Municipal do PAR', 'Técnico(a) Municipal do SIGPC', 'Financeiro ou contabilidade', 'Conselheiro(a) CACS-Fundeb', 'Diretor(a) escolar', 'Coordenador(a) pedagógico(a)', 'Outra'] },
      { name: 'mun', label: 'Município/UF', required: true, placeholder: 'Ex.: Castanhal/PA' }, { name: 'pagador', label: 'Quem paga', type: 'select', options: ['Prefeitura', 'Pessoa física', 'Cliente com contrato (isento)'] },
      { name: 'email', label: 'E-mail', type: 'email' }, { name: 'tel', label: 'WhatsApp', type: 'tel' }
    ], submit: 'Inscrever', onSubmit: d => {
      const isento = d.pagador.startsWith('Cliente');
      db.pessoas.unshift({ id: uid(), turma: d.turma, nome: d.nome, cpf: maskCPF(d.cpf), funcao: d.funcao, mun: d.mun, pagador: isento ? 'Prefeitura' : d.pagador, status: isento ? 'Isento' : 'Pré-inscrito', pres: {}, cert: false, fresh: true });
      save(); if (S.view === 'inscricoes') { S.turma = d.turma; render(); } else render(); toast(d.nome + ' inscrito(a).');
    } });
  }

  /* =================== CURSOS =================== */
  function cursos() {
    const c = db.cursos.find(x => x.id === S.curso) || db.cursos[0];
    if (c) S.curso = c.id;
    return [
      head('Painel de controle', 'Cursos', 'Gestão completa dos cursos e encontros: turmas, programação, palestrantes, presença, certificados, materiais e financeiro.', [addBtn('Novo curso', addCurso)]),
      h('div', { class: 'course-list' },
        db.cursos.map(x => {
          const ts = x.turmas, n = ts.reduce((s, t) => s + inscritos(t), 0), v = ts.reduce((s, t) => s + (+t.vagas || 0), 0) || 1;
          return h('button', { type: 'button', class: 'course', style: `--c:${x.cor}`, 'aria-pressed': String(x.id === S.curso), onclick: () => { S.curso = x.id; S.cTab = 'resumo'; S.presTurma = ''; render(); } },
            h('span', { class: 'pill ' + (x.status === 'Inscrições abertas' ? 'p-ok' : x.status === 'Encerrado' ? 'p-mute' : 'p-warn'), text: x.status }), h('b', { text: x.nome }),
            h('div', { class: 'meta' }, h('span', { text: x.carga }), h('span', { text: brl(x.preco) }), h('span', { text: ts.length + (ts.length === 1 ? ' turma' : ' turmas') })),
            h('div', { class: 'meter' }, h('i', { style: `--w:${Math.min(100, n / v * 100)}%;--c:${x.cor}` })), h('div', { class: 'foot' }, h('span', { text: `${n} inscritos de ${v} vagas` }), h('span', { text: x.site ? 'No site' : 'Oculto' })));
        }),
        h('button', { type: 'button', class: 'course add', onclick: addCurso }, ic('plus'), h('b', { text: 'Novo curso' }), h('span', { style: 'font-size:13px', text: 'Encontro, jornada ou turma in company' }))),
      c ? cursoDet(c) : empty('Nenhum curso cadastrado.', 'book')
    ];
  }
  function cursoDet(c) {
    const T = [['resumo', 'Resumo', 'chart'], ['turmas', 'Turmas', 'calendar'], ['programacao', 'Programação', 'clock'], ['palestrantes', 'Palestrantes', 'mic'], ['presenca', 'Presença', 'check'], ['certificados', 'Certificados', 'award'], ['materiais', 'Materiais', 'file'], ['financeiro', 'Financeiro', 'money']];
    const body = { resumo: cResumo, turmas: cTurmas, programacao: cProg, palestrantes: cPal, presenca: cPres, certificados: cCert, materiais: cMat, financeiro: cFin }[S.cTab](c);
    return h('div', null,
      h('div', { class: 'c-hero', style: `--c:${c.cor}` }, h('div', null, h('span', { class: 'mono', text: `${c.carga} · ${brl(c.preco)} por participante` }), h('h2', { text: c.nome }), h('p', { style: 'margin:6px 0 0;color:#C3CDDA;font-size:14px;max-width:60ch', text: 'Público: ' + (c.publico || '—') })),
        h('div', { class: 'acts' }, sw('Visível no site', c.site, v => { c.site = v; dirty(); render(); toast(v ? 'Curso visível no site.' : 'Curso oculto no site.'); }),
          btn('Editar', 'edit', () => editCurso(c)), btn('Remover', 'trash', () => confirmBox(`Remover o curso "${c.nome}" e suas turmas?`, () => { const ids = c.turmas.map(t => t.id); db.pessoas = db.pessoas.filter(p => !ids.includes(p.turma)); db.cursos = db.cursos.filter(x => x !== c); S.curso = db.cursos[0] ? db.cursos[0].id : ''; save(); render(); toast('Curso removido.'); })))),
      tabs(T, S.cTab, id => { S.cTab = id; render(); }, 'Gestão do curso'),
      h('div', { class: 'v-in', key: S.cTab }, body));
  }
  const cursoPessoas = c => db.pessoas.filter(p => c.turmas.some(t => t.id === p.turma));
  function cResumo(c) {
    const n = c.turmas.reduce((s, t) => s + inscritos(t), 0), v = c.turmas.reduce((s, t) => s + (+t.vagas || 0), 0), ps = cursoPessoas(c);
    const sess = c.dias.reduce((s, d) => s + d.sessoes.length, 0);
    return h('div', { class: 'stack' },
      h('div', { class: 'grid g4' }, kpi('Inscritos', `${n} / ${v || 0}`, v ? Math.round(n / v * 100) + '% das vagas' : 'Sem turmas', c.cor), kpi('Receita prevista', brl(n * c.preco), 'Antes de isenções', '#40C965', { to: n * c.preco, pre: 'R$ ' }),
        kpi('Programação', `${c.dias.length} ${c.dias.length === 1 ? 'dia' : 'dias'}`, `${sess} sessões · ${c.palestrantes.length} palestrantes`, '#39A9DB'), kpi('Certificados emitidos', String(ps.filter(p => p.cert).length), `${ps.length} participantes na lista`, '#E0A729')),
      h('div', { class: 'grid g2' },
        card('Ocupação por turma', null, [addBtn('Turma', () => addTurma(c), 'btn-sm btn-gold')], c.turmas.length ? bars(c.turmas.map(t => [turmaLabel(t), inscritos(t), c.cor, `${inscritos(t)}/${t.vagas}`]), Math.max(...c.turmas.map(t => +t.vagas || 1))) : empty('Nenhuma turma ainda.', 'calendar')),
        card('Próximas datas', null, [addBtn('Sessão', () => addSessao(c), 'btn-sm btn-gold')], h('div', null, c.turmas.slice().sort((a, b) => a.data.localeCompare(b.data)).map(t => {
          const [y, m, d] = t.data.split('-');
          return h('div', { class: 'ev', style: `--c:${c.cor};border:0;padding:8px 0;animation:none` }, h('div', { class: 'd' }, h('div', { class: 'cal' }, h('span', { text: MESES[+m - 1] }), h('b', { text: d })), h('div', null, h('b', { text: `${t.cidade}/${t.uf}` }), h('div', { style: 'font-size:13px;color:var(--body)', text: `${t.local || 'Local a definir'} · ${t.status}` }))));
        }))))
    );
  }
  function cTurmas(c) {
    return card('Turmas', 'Cada turma aparece no site com o selo da situação e abre a pré-inscrição.', [addBtn('Adicionar turma', () => addTurma(c))],
      c.turmas.length ? h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Cidade', 'Data', 'Local', 'Ocupação', 'Situação', ''].map(x => h('th', { text: x })))),
        h('tbody', null, c.turmas.map(t => h('tr', { class: t.fresh ? 'row-in' : '' }, h('td', null, h('b', { text: `${t.cidade}/${t.uf}` })), h('td', { class: 'mono-c', text: dBR(t.data) }), h('td', { text: t.local || '—' }),
          h('td', { style: 'min-width:160px' }, h('div', { class: 'meter' }, h('i', { style: `--w:${Math.min(100, inscritos(t) / t.vagas * 100)}%;--c:${c.cor}` })), h('small', { text: `${inscritos(t)} de ${t.vagas} vagas` })),
          h('td', null, h('select', { class: 'inp', style: 'min-height:38px;font-size:13.5px', 'aria-label': 'Situação da turma', onchange: e => { t.status = e.target.value; dirty(); toast('Turma ' + t.cidade + ': ' + t.status); } }, ['Em formação', 'Confirmada', 'Lotada', 'Encerrada'].map(o => h('option', { value: o, text: o, selected: t.status === o || null })))),
          h('td', null, h('div', { class: 'acts' }, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Editar turma', onclick: () => addTurma(c, t) }, ic('edit')), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover turma', onclick: () => confirmBox(`Remover a turma de ${t.cidade}?`, () => { c.turmas = c.turmas.filter(x => x !== t); db.pessoas = db.pessoas.filter(p => p.turma !== t.id); dirty(); render(); toast('Turma removida.'); }) }, ic('trash'))))))))) : empty('Nenhuma turma ainda. Adicione a primeira.', 'calendar'));
  }
  function addTurma(c, t) {
    openForm({ title: t ? 'Editar turma' : 'Nova turma', eyebrow: c.nome, values: t || {}, fields: [
      { name: 'cidade', label: 'Cidade', required: true }, { name: 'uf', label: 'UF', type: 'select', options: UFS, value: 'PA' },
      { name: 'data', label: 'Data de início', type: 'date', required: true }, { name: 'vagas', label: 'Vagas', type: 'number', min: 1, value: 40, required: true },
      { name: 'local', label: 'Local', full: true, placeholder: 'Ex.: Auditório da Secretaria de Educação' },
      { name: 'status', label: 'Situação', type: 'select', options: ['Em formação', 'Confirmada', 'Lotada', 'Encerrada'] }
    ], submit: t ? 'Salvar turma' : 'Adicionar turma', onSubmit: d => {
      if (t) Object.assign(t, d, { vagas: +d.vagas }); else c.turmas.push({ id: uid(), ...d, vagas: +d.vagas, base: 0, fresh: true });
      dirty(); S.cTab = 'turmas'; render(); c.turmas.forEach(x => delete x.fresh); toast(t ? 'Turma atualizada.' : `Turma de ${d.cidade} criada.`);
    } });
  }
  function cProg(c) {
    return card('Programação', 'Dias e sessões que aparecem na janela de programação do site.', [btn('Adicionar dia', 'calendar', () => openForm({ title: 'Novo dia', eyebrow: c.nome, fields: [{ name: 'titulo', label: 'Título do dia', required: true, placeholder: 'Ex.: Dia 2 · Prestação de contas' }], onSubmit: d => { c.dias.push({ id: uid(), titulo: d.titulo, sessoes: [] }); dirty(); render(); toast('Dia adicionado.'); } })), addBtn('Adicionar sessão', () => addSessao(c))],
      c.dias.length ? h('div', null, c.dias.map((d, di) => h('div', { class: 'day' },
        h('div', { class: 'day-h' }, h('b', { text: d.titulo }), h('div', { class: 'acts' }, h('span', { style: 'font-size:13px;color:var(--body)', text: d.sessoes.length + ' sessões' }), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Adicionar sessão neste dia', onclick: () => addSessao(c, di) }, ic('plus')),
          h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover dia', onclick: () => confirmBox(`Remover "${d.titulo}" e suas sessões?`, () => { c.dias.splice(di, 1); dirty(); render(); }) }, ic('trash')))),
        d.sessoes.slice().sort((a, b) => a.hora.localeCompare(b.hora)).map(s => h('div', { class: 'sess' + (s.fresh ? ' row-in' : '') }, h('time', { text: s.hora }), h('div', null, h('b', { text: s.titulo }), h('small', { text: s.quem || '—' })),
          h('div', { class: 'acts' }, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover sessão', onclick: () => { d.sessoes = d.sessoes.filter(x => x !== s); dirty(); render(); } }, ic('trash')))))))) : empty('Sem programação. Comece adicionando um dia.', 'clock'));
  }
  function addSessao(c, di) {
    if (!c.dias.length) c.dias.push({ id: uid(), titulo: 'Dia 1', sessoes: [] });
    openForm({ title: 'Nova sessão', eyebrow: c.nome, fields: [
      { name: 'dia', label: 'Dia', type: 'select', options: c.dias.map((d, i) => [i, d.titulo]), value: di ?? 0 }, { name: 'hora', label: 'Horário', type: 'time', required: true, value: '08:00' },
      { name: 'titulo', label: 'Título da sessão', required: true, full: true }, { name: 'quem', label: 'Palestrante', type: 'select', options: ['', ...c.palestrantes.map(p => p.nome), 'Equipe SIGEMEC'], full: true }
    ], submit: 'Adicionar sessão', onSubmit: d => { c.dias[+d.dia].sessoes.push({ id: uid(), hora: d.hora, titulo: d.titulo, quem: d.quem, fresh: true }); dirty(); S.cTab = 'programacao'; render(); c.dias.forEach(x => x.sessoes.forEach(s => delete s.fresh)); toast('Sessão adicionada à programação.'); } });
  }
  function cPal(c) {
    return card('Palestrantes', 'Aparecem nos cartões do encontro e na programação.', [addBtn('Adicionar palestrante', () => openForm({ title: 'Novo palestrante', eyebrow: c.nome, fields: [{ name: 'nome', label: 'Nome', required: true, full: true }, { name: 'cargo', label: 'Cargo ou minicurrículo', full: true }], onSubmit: d => { c.palestrantes.push({ id: uid(), ...d }); dirty(); render(); toast(d.nome + ' adicionado(a).'); } }))],
      c.palestrantes.length ? h('div', { class: 'people' }, c.palestrantes.map((p, i) => h('div', { class: 'person', style: `--c:${[c.cor, '#E0A729', '#39A9DB', '#40C965'][i % 4]};animation-delay:${i * 60}ms` }, h('span', { class: 'av', text: ini(p.nome) }), h('div', { style: 'flex:1;min-width:0' }, h('b', { text: p.nome }), h('small', { text: p.cargo || '—' })),
        h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover ' + p.nome, onclick: () => { c.palestrantes = c.palestrantes.filter(x => x !== p); dirty(); render(); } }, ic('trash'))))) : empty('Nenhum palestrante.', 'mic'));
  }
  function cPres(c) {
    if (!c.turmas.length) return card('Presença', null, [addBtn('Adicionar turma', () => addTurma(c))], empty('Cadastre uma turma para controlar a presença.', 'check'));
    const t = c.turmas.find(x => x.id === S.presTurma) || c.turmas[0]; S.presTurma = t.id;
    const dias = c.dias.length || 1; if (S.presDia >= dias) S.presDia = 0;
    const ps = db.pessoas.filter(p => p.turma === t.id);
    const pres = ps.filter(p => p.pres && p.pres[S.presDia]).length, pct = ps.length ? Math.round(pres / ps.length * 100) : 0;
    return h('div', { class: 'stack' },
      h('div', { class: 'chips' }, c.turmas.map(x => chip(turmaLabel(x), x.id === t.id, () => { S.presTurma = x.id; render(); }, null, c.cor)), dias > 1 ? h('span', { style: 'width:12px' }) : null, dias > 1 ? c.dias.map((d, i) => chip(d.titulo.split('·')[0].trim(), S.presDia === i, () => { S.presDia = i; render(); })) : null),
      h('div', { class: 'grid g2' },
        card('Lista de presença', `${ps.length} participantes listados nesta turma. Toque para marcar presença.`, [btn('Marcar todos', 'check', () => { ps.forEach(p => { p.pres = p.pres || {}; p.pres[S.presDia] = true; }); save(); render(); toast('Todos marcados como presentes.'); }, 'btn-sm'), addBtn('Participante', () => addPessoa(t.id), 'btn-sm btn-gold')],
          ps.length ? h('div', null, ps.map(p => h('div', { class: 'att' }, h('span', { class: 'av', text: ini(p.nome) }), h('span', null, h('b', { text: p.nome }), h('small', { text: `${p.funcao} · ${p.mun}` })),
            h('button', { type: 'button', class: 'tick', 'aria-pressed': String(!!(p.pres && p.pres[S.presDia])), 'aria-label': 'Presença de ' + p.nome, onclick: () => { p.pres = p.pres || {}; p.pres[S.presDia] = !p.pres[S.presDia]; save(); render(); } }, ic('check'))))) : empty('Nenhum participante nesta turma.', 'users')),
        card('Resumo do dia', null, [btn('Exportar lista', 'download', () => csv(`presenca-${t.id}-dia${S.presDia + 1}.csv`, [['Participante', 'CPF', 'Município', 'Presente'], ...ps.map(p => [p.nome, p.cpf, p.mun, p.pres && p.pres[S.presDia] ? 'Sim' : 'Não'])]), 'btn-sm')],
          h('div', { style: 'display:flex;gap:20px;align-items:center;flex-wrap:wrap' }, ringP(pct, c.cor), h('div', { class: 'stack', style: 'gap:4px' }, h('b', { style: 'font:800 22px var(--f-display)', text: `${pres} de ${ps.length} presentes` }), h('span', { style: 'color:var(--body);font-size:14px', text: 'Presença mínima para o certificado: 75% da carga horária.' }))))));
  }
  function ringP(pct, color) {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 120 120'); s.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(NS, 'circle'), fg = document.createElementNS(NS, 'circle');
    for (const c of [bg, fg]) { c.setAttribute('cx', 60); c.setAttribute('cy', 60); c.setAttribute('r', 50); }
    bg.setAttribute('class', 'bg'); fg.setAttribute('class', 'fg'); fg.style.strokeDashoffset = 314; s.append(bg, fg);
    requestAnimationFrame(() => requestAnimationFrame(() => { fg.style.strokeDashoffset = String(314 - 314 * pct / 100); }));
    return h('div', { class: 'ring-p', style: `--c:${color}` }, s, h('b', { text: pct + '%' }));
  }
  function cCert(c) {
    const dias = c.dias.length || 1, ps = cursoPessoas(c);
    const freq = p => Math.round(Object.values(p.pres || {}).filter(Boolean).length / dias * 100);
    const eleg = ps.filter(p => !p.cert && freq(p) >= 75 && (p.status === 'Pago' || p.status === 'Isento'));
    return h('div', { class: 'stack' },
      h('div', { class: 'cert' }, h('span', { class: 'av', style: `width:56px;height:56px;background:${c.cor}` }, ic('award')), h('div', { style: 'flex:1' }, h('b', { style: 'font:800 18px var(--f-display)', text: `${eleg.length} certificado(s) pronto(s) para emitir` }), h('div', { style: 'font-size:13.5px;color:var(--body)', text: 'Regra: presença mínima de 75% e inscrição paga ou isenta.' })),
        h('button', { type: 'button', class: 'btn btn-ink', disabled: !eleg.length || null, onclick: () => mailCert(c, eleg) }, ic('mail'), 'Emitir e enviar elegíveis')),
      card('Certificados', null, [addBtn('Certificado avulso', () => openForm({ title: 'Certificado avulso', eyebrow: c.nome, fields: [{ name: 'p', label: 'Participante', type: 'select', options: ps.map(p => [p.id, p.nome]), full: true }, { name: 'obs', label: 'Justificativa', type: 'textarea', placeholder: 'Ex.: Participou on-line pela transmissão.' }], submit: 'Emitir e escrever e-mail', onSubmit: d => { const p = ps.find(x => x.id === d.p); if (p) { mailCert(c, [p]); return false; } } }))],
        ps.length ? h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Participante', 'Turma', 'Presença', 'Inscrição', 'Certificado'].map(x => h('th', { text: x })))),
          h('tbody', null, ps.map(p => { const t = turmaById(p.turma), f = freq(p); return h('tr', null, h('td', null, h('b', { text: p.nome })), h('td', { text: t ? turmaLabel(t) : '—' }), h('td', null, h('span', { class: 'pill ' + (f >= 75 ? 'p-ok' : 'p-late'), text: f + '%' })), h('td', null, h('span', { class: 'pill ' + PSC[p.status], text: p.status })),
            h('td', null, p.cert ? h('span', { class: 'pill p-ok' }, ic('check'), 'Emitido') : h('button', { type: 'button', class: 'btn btn-sm', onclick: () => mailCert(c, [p]) }, ic('mail'), 'Emitir e enviar'))); })))) : empty('Nenhum participante neste curso.', 'award')));
  }
  function mailCert(c, ps) {
    const corpo = `Segue em anexo o seu certificado de participação no ${c.nome} (${c.carga}).\n\nObrigado pela presença e até o próximo encontro.` + ASSINATURA;
    composeMail(ps.length === 1
      ? [{ to: [ps[0].email], cc: [], bcc: [], label: ps[0].nome, subject: `Certificado · ${c.nome}`, body: `Olá, ${primeiro(ps[0].nome)},\n\n` + corpo, onSent: () => { ps[0].cert = true; } }]
      : [{ to: ['comercial@sigemec.com.br'], cc: [], bcc: ps.map(p => p.email), label: ps.length + ' participantes', subject: `Certificado · ${c.nome}`, body: 'Olá,\n\n' + corpo, onSent: () => ps.forEach(p => { p.cert = true; }) }],
      { tipo: 'Certificado', anexo: ps.length === 1 ? 'o certificado (PDF)' : 'os certificados (PDF)' });
  }
  function cMat(c) {
    return card('Materiais do curso', 'Apostilas, planilhas e modelos enviados aos inscritos.', [addBtn('Adicionar material', () => openForm({ title: 'Novo material', eyebrow: c.nome, fields: [{ name: 'nome', label: 'Nome do material', required: true, full: true }, { name: 'arq', label: 'Arquivo', type: 'file', accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip', full: true }], onSubmit: d => {
      const f = d.arq[0]; const ext = f ? (f.name.split('.').pop() || 'arq').toUpperCase() : 'LINK'; const tam = f ? (f.size > 1e6 ? (f.size / 1e6).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(f.size / 1e3)) + ' KB') : '—';
      c.materiais.push({ id: uid(), nome: d.nome, tipo: ext.slice(0, 4), tam }); save(); render(); toast('Material adicionado.');
    } }))],
      c.materiais.length ? h('div', null, c.materiais.map(m => h('div', { class: 'file' }, h('span', { class: 'fi', text: m.tipo }), h('span', null, h('b', { text: m.nome }), h('small', { text: m.tam })),
        btn('Enviar aos inscritos', 'mail', () => { const ps = cursoPessoas(c).filter(p => isEmail(p.email)); if (!ps.length) { toast('Nenhum inscrito com e-mail neste curso.', true); return; } composeMail([{ to: ['comercial@sigemec.com.br'], cc: [], bcc: ps.map(p => p.email), label: m.nome, subject: `Material do curso · ${c.nome}`, body: `Olá,\n\nSegue em anexo o material "${m.nome}" do ${c.nome}.\n\nGuarde este e-mail: o material será usado durante o encontro.` + ASSINATURA }], { tipo: 'Material', anexo: `o arquivo "${m.nome}"` }); }, 'btn-sm'), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover material', onclick: () => { c.materiais = c.materiais.filter(x => x !== m); save(); render(); } }, ic('trash'))))) : empty('Nenhum material.', 'file'));
  }
  function cFin(c) {
    const ps = cursoPessoas(c), cnt = s => ps.filter(p => p.status === s).length;
    const pago = cnt('Pago') * c.preco, val = cnt('Validado') * c.preco, pre = cnt('Pré-inscrito') * c.preco, ise = cnt('Isento');
    const tot = Math.max(1, pago + val + pre);
    return h('div', { class: 'stack' },
      h('div', { class: 'grid g4' }, kpi('Recebido', brl(pago), cnt('Pago') + ' pagamentos', '#40C965', { to: pago, pre: 'R$ ' }), kpi('A receber (validados)', brl(val), 'Boleto enviado', '#E0A729'), kpi('Em pré-inscrição', brl(pre), 'Aguardando validação', '#39A9DB'), kpi('Isentos', String(ise), 'Clientes com contrato', '#EA6036')),
      card('Composição da receita', 'Somente os participantes cadastrados no painel.', [c.turmas.length ? btn('Cobrar pendentes', 'mail', () => openBoleto(c.turmas[0].id), 'btn-sm') : null, btn('Relatório', 'download', () => { S.rf['fin-turma'] = { curso: c.id }; runReport(REPORTS.find(r => r.id === 'fin-turma')); }, 'btn-sm'), addBtn('Registrar pagamento', () => {
        const pend = ps.filter(p => p.status !== 'Pago' && p.status !== 'Isento');
        if (!pend.length) { toast('Não há pagamentos pendentes neste curso.'); return; }
        openForm({ title: 'Registrar pagamento', eyebrow: c.nome, fields: [{ name: 'p', label: 'Participante', type: 'select', options: pend.map(p => [p.id, `${p.nome} · ${p.status}`]), full: true }, { name: 'forma', label: 'Forma', type: 'select', options: ['Boleto', 'PIX', 'Empenho da prefeitura', 'Cartão'] }, { name: 'data', label: 'Data', type: 'date', value: today() }], submit: 'Confirmar pagamento', onSubmit: d => { const p = pend.find(x => x.id === d.p); p.status = 'Pago'; save(); render(); toast(`Pagamento de ${p.nome} registrado (${d.forma}).`); } });
      })],
        h('div', { class: 'stk' }, [[pago, '#23944A'], [val, '#C98A00'], [pre, '#1E7FAE']].map(([v, col]) => v ? h('i', { style: `--w:${v / tot * 100}%;background:${col}` }) : null)),
        h('div', { class: 'chips' }, [['Recebido', pago, '#23944A'], ['A receber', val, '#C98A00'], ['Pré-inscrição', pre, '#1E7FAE']].map(([l, v, col]) => h('span', { class: 'chip', style: `--c:${col};cursor:default` }, h('i'), l, h('small', { text: brl(v) }))))),
      card('Por turma', null, null, h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Turma', 'Inscritos', 'Pagos', 'Previsto', 'Recebido'].map(x => h('th', { text: x })))),
        h('tbody', null, c.turmas.map(t => { const tp = db.pessoas.filter(p => p.turma === t.id); return h('tr', null, h('td', null, h('b', { text: turmaLabel(t) })), h('td', { class: 'num', text: String(inscritos(t)) }), h('td', { class: 'num', text: String(tp.filter(p => p.status === 'Pago').length) }), h('td', { class: 'num', text: brl(inscritos(t) * c.preco) }), h('td', { class: 'num', text: brl(tp.filter(p => p.status === 'Pago').length * c.preco) })); }))))));
  }
  const CORES = [['#EA6036', 'Laranja (Educação)'], ['#39A9DB', 'Azul (Saúde)'], ['#40C965', 'Verde (Escola)'], ['#E0A729', 'Ouro (Gestão)']];
  const cursoFields = [
    { name: 'nome', label: 'Nome do curso', required: true, full: true }, { name: 'carga', label: 'Carga horária', placeholder: 'Ex.: 16 horas', required: true },
    { name: 'preco', label: 'Valor por participante (R$)', type: 'money', required: true, placeholder: '500,00' }, { name: 'cor', label: 'Cor', type: 'select', options: CORES },
    { name: 'status', label: 'Situação', type: 'select', options: ['Inscrições abertas', 'Em planejamento', 'Encerrado'] }, { name: 'publico', label: 'Público', full: true, placeholder: 'Ex.: Diretores e coordenadores pedagógicos' }
  ];
  function addCurso() {
    openForm({ title: 'Novo curso', eyebrow: 'Cursos', fields: [...cursoFields, { name: 'site', label: 'Publicar no site', type: 'select', options: [['1', 'Sim, mostrar no site'], ['0', 'Não, deixar oculto']] }], submit: 'Criar curso', onSubmit: d => {
      const c = { id: uid(), nome: d.nome, carga: d.carga, preco: d.preco, cor: d.cor, status: d.status, publico: d.publico, site: d.site === '1', turmas: [], dias: [], palestrantes: [], materiais: [] };
      db.cursos.push(c); dirty(); go('cursos', { curso: c.id, cTab: 'turmas' }); toast('Curso criado. Agora cadastre as turmas.');
    } });
  }
  function editCurso(c) {
    openForm({ title: 'Editar curso', eyebrow: 'Cursos', values: { ...c, preco: String(c.preco).replace('.', ',') }, fields: cursoFields, onSubmit: d => { Object.assign(c, d); dirty(); render(); toast('Curso atualizado.'); } });
  }

  /* =================== CONTEÚDO DO SITE =================== */
  function conteudo() {
    const T = [['numeros', 'Números', 'hash'], ['projetos', 'Projetos', 'chart'], ['eventos', 'Eventos', 'calendar'], ['fotos', 'Fotos de eventos', 'image'], ['secoes', 'Seções', 'layers'], ['atas', 'Atas', 'file'], ['depo', 'Depoimentos', 'quote']];
    const body = { numeros: tNumeros, projetos: tProjetos, eventos: tEventos, fotos: tFotos, secoes: tSecoes, atas: tAtas, depo: tDepo }[S.sub]();
    return [
      head('Painel de controle', 'Conteúdo do site', 'Altere números, projetos, eventos, fotos, seções, atas e depoimentos sem mexer no código.', [addBtn('Adicionar', () => ({ numeros: addNumero, projetos: addProjeto, eventos: addEvento, fotos: addFotos, secoes: addSecao, atas: addAta, depo: addDepo })[S.sub]())]),
      tabs(T, S.sub, id => { S.sub = id; render(); }, 'Conteúdo do site'),
      h('div', { class: 'v-in' }, body),
      pubBar()
    ];
  }
  function pubBar() {
    const bar = h('div', { class: 'pub', id: 'pub' }, h('span', { class: 'prog' }),
      h('span', { style: 'font-size:14.5px' }, db.pub.pend ? h('span', { class: 'dot' }) : null, db.pub.pend ? `${db.pub.pend} ${db.pub.pend > 1 ? 'alterações aguardando' : 'alteração aguardando'} publicação.` : `Nenhuma alteração pendente. Última publicação: ${db.pub.last}.`),
      h('button', { type: 'button', class: 'btn btn-gold', disabled: !db.pub.pend || null, onclick: e => {
        const b = e.currentTarget; bar.classList.add('busy'); b.disabled = true; b.textContent = 'Publicando…';
        setTimeout(() => { db.pub.pend = 0; db.pub.last = nowBR(); save(); render(); toast('Alterações publicadas. O site já mostra a versão nova.'); }, reduce ? 50 : 1600);
      } }, ic('globe'), 'Publicar alterações no site'));
    return bar;
  }
  function tNumeros() {
    return card('Números do grupo', 'Aparecem na página inicial e em Sobre nós. Os contadores animam até o valor salvo.', [addBtn('Adicionar número', addNumero, 'btn-sm btn-gold')],
      h('div', { class: 'grid g3' }, db.numeros.map(n => h('div', { class: 'lbl-f' }, h('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:6px' }, h('label', { for: 'n-' + n.id, text: n.label }), h('button', { type: 'button', class: 'ibtn', style: 'width:30px;height:30px', 'aria-label': 'Remover ' + n.label, onclick: () => { db.numeros = db.numeros.filter(x => x !== n); dirty(); render(); } }, ic('x'))),
        h('input', { class: 'inp', id: 'n-' + n.id, value: n.value, onchange: e => { n.value = e.target.value; dirty(); render(); } })))));
  }
  function addNumero() { openForm({ title: 'Novo número', eyebrow: 'Conteúdo · Números', fields: [{ name: 'label', label: 'Rótulo', required: true, full: true, placeholder: 'Ex.: Escolas atendidas' }, { name: 'value', label: 'Valor', required: true, placeholder: 'Ex.: 1200' }], onSubmit: d => { db.numeros.push({ id: uid(), ...d }); S.sub = 'numeros'; dirty(); render(); toast('Número adicionado.'); } }); }
  function tProjetos() {
    const tot = db.projetos.reduce((s, p) => s + (+p.valor || 0), 0);
    return card('Projetos contemplados', `${db.projetos.length} projetos · ${brl2(tot)} pagos. Cada projeto alimenta os cartões, os gráficos e a janela de detalhe da home.`, [addBtn('Adicionar projeto', addProjeto, 'btn-sm btn-gold')],
      h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Município', 'Programa', 'Valor pago', 'Pago em', ''].map(x => h('th', { text: x })))),
        h('tbody', null, db.projetos.map(p => h('tr', { class: p.fresh ? 'row-in' : '' }, h('td', null, h('b', { text: p.mun })), h('td', { text: p.prog }), h('td', { class: 'num', text: brl2(p.valor) }), h('td', { class: 'mono-c', text: dBR(p.pago) }),
          h('td', null, h('div', { class: 'acts' }, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Editar', onclick: () => addProjeto(p) }, ic('edit')), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover', onclick: () => confirmBox(`Remover o projeto de ${p.mun}?`, () => { db.projetos = db.projetos.filter(x => x !== p); dirty(); render(); }) }, ic('trash'))))))))));
  }
  function addProjeto(p) {
    openForm({ title: p && p.id ? 'Editar projeto' : 'Novo projeto', eyebrow: 'Conteúdo · Projetos', values: p && p.id ? { ...p, valor: brl2(p.valor).replace('R$ ', '') } : {}, fields: [
      { name: 'mun', label: 'Município/UF', required: true, placeholder: 'Ex.: Aquiraz/CE' }, { name: 'prog', label: 'Programa', value: 'Projeto de Educação Infantil' },
      { name: 'valor', label: 'Valor pago (R$)', type: 'money', required: true, placeholder: '1.000.000,00' }, { name: 'pago', label: 'Pago em', type: 'date', required: true }
    ], onSubmit: d => { if (p && p.id) Object.assign(p, d); else { db.projetos.unshift({ id: uid(), ...d, fresh: true }); } S.sub = 'projetos'; dirty(); render(); db.projetos.forEach(x => delete x.fresh); toast(p && p.id ? 'Projeto atualizado.' : 'Projeto adicionado.'); } });
  }
  function tEventos() {
    const list = db.eventos.slice().sort((a, b) => a.data.localeCompare(b.data));
    return card('Eventos', 'Encontros, jornadas e lives divulgados no site. Rascunhos ficam ocultos até serem publicados.', [addBtn('Adicionar evento', addEvento, 'btn-sm btn-gold')],
      list.length ? h('div', { class: 'grid g3' }, list.map((e, i) => {
        const [, m, d] = e.data.split('-'); const c = db.cursos.find(x => x.id === e.curso);
        return h('article', { class: 'ev', style: `--c:${c ? c.cor : '#E0A729'};animation-delay:${i * 50}ms` }, h('div', { class: 'd' }, h('div', { class: 'cal' }, h('span', { text: MESES[+m - 1] }), h('b', { text: d })), h('div', null, h('h3', { text: e.titulo }), h('div', { style: 'font-size:13px;color:var(--body);display:flex;align-items:center;gap:4px' }, ic('pin'), e.cidade))),
          h('p', { text: e.desc }), h('div', { class: 'row' }, sw(e.status === 'Publicado' ? 'Publicado' : 'Rascunho', e.status === 'Publicado', v => { e.status = v ? 'Publicado' : 'Rascunho'; dirty(); render(); toast(v ? 'Evento publicado.' : 'Evento movido para rascunho.'); }),
            h('div', { class: 'acts' }, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Editar evento', onclick: () => addEvento(e) }, ic('edit')), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover evento', onclick: () => confirmBox(`Remover o evento "${e.titulo}"?`, () => { db.eventos = db.eventos.filter(x => x !== e); dirty(); render(); }) }, ic('trash')))));
      })) : empty('Nenhum evento.', 'calendar'));
  }
  function addEvento(e) {
    const ed = e && e.id;
    openForm({ title: ed ? 'Editar evento' : 'Novo evento', eyebrow: 'Conteúdo · Eventos', values: ed ? e : {}, fields: [
      { name: 'titulo', label: 'Título', required: true, full: true }, { name: 'data', label: 'Data', type: 'date', required: true }, { name: 'cidade', label: 'Cidade/UF', required: true, placeholder: 'Ex.: Belém/PA' },
      { name: 'curso', label: 'Curso vinculado', type: 'select', options: [['', 'Nenhum'], ...db.cursos.map(c => [c.id, c.nome])] }, { name: 'status', label: 'Situação', type: 'select', options: ['Publicado', 'Rascunho'] },
      { name: 'desc', label: 'Descrição', type: 'textarea', required: true }
    ], submit: ed ? 'Salvar evento' : 'Adicionar evento', onSubmit: d => { if (ed) Object.assign(e, d); else db.eventos.push({ id: uid(), ...d }); dirty(); go('conteudo', { sub: 'eventos' }); toast(ed ? 'Evento atualizado.' : 'Evento "' + d.titulo + '" criado.'); } });
  }
  function tFotos() {
    const albums = ['Todos', ...new Set(db.fotos.map(f => f.album))];
    if (!albums.includes(S.album)) S.album = 'Todos';
    const list = db.fotos.filter(f => S.album === 'Todos' || f.album === S.album);
    const drop = h('button', { type: 'button', class: 'drop', onclick: addFotos }, ic('upload'), h('b', { text: 'Enviar fotos' }), h('small', { text: 'Toque aqui ou arraste as imagens' }));
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', async e => { e.preventDefault(); drop.classList.remove('over'); const fs = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')).slice(0, 12); if (!fs.length) return; const imgs = await Promise.all(fs.map(shrink)); pushFotos(imgs, S.album === 'Todos' ? 'Novos envios' : S.album, ''); });
    return card('Fotos de eventos', 'Galeria dos encontros no site. A foto marcada como capa abre o álbum.', [addBtn('Adicionar fotos', addFotos, 'btn-sm btn-gold')],
      h('div', { class: 'chips', style: 'margin-bottom:12px' }, albums.map(a => chip(a, S.album === a, () => { S.album = a; render(); }, a === 'Todos' ? db.fotos.length : db.fotos.filter(f => f.album === a).length))),
      h('div', { class: 'gal' }, drop, list.map((f, i) => h('figure', { class: 'ph', style: `animation-delay:${i * 40}ms` }, h('img', { src: f.src, alt: f.leg, loading: 'lazy' }), f.capa ? h('span', { class: 'capa', text: 'Capa' }) : null,
        h('figcaption', null, f.leg || 'Sem legenda', h('small', { text: f.album })),
        h('div', { class: 'tools' }, h('button', { type: 'button', class: 'ibtn' + (f.capa ? ' on' : ''), 'aria-label': 'Usar como capa do álbum', onclick: () => { db.fotos.forEach(x => { if (x.album === f.album) x.capa = x === f; }); dirty(); render(); toast('Capa do álbum atualizada.'); } }, ic('star')),
          h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Editar legenda', onclick: () => openForm({ title: 'Editar foto', eyebrow: 'Conteúdo · Fotos', values: f, fields: [{ name: 'leg', label: 'Legenda', full: true }, { name: 'album', label: 'Álbum / evento', full: true }], onSubmit: d => { Object.assign(f, d); dirty(); render(); } }) }, ic('edit')),
          h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover foto', onclick: () => confirmBox('Remover esta foto da galeria?', () => { db.fotos = db.fotos.filter(x => x !== f); dirty(); render(); toast('Foto removida.'); }) }, ic('trash')))))));
  }
  function pushFotos(imgs, album, leg) {
    const ok = imgs.filter(i => i.src);
    ok.forEach((i, k) => db.fotos.unshift({ id: uid(), src: i.src, leg: leg || i.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), album, capa: !db.fotos.some(f => f.album === album) && k === 0 }));
    S.sub = 'fotos'; S.album = album; db.pub.pend++;
    save(); render(); toast(ok.length + (ok.length === 1 ? ' foto adicionada' : ' fotos adicionadas') + ' ao álbum ' + album + '.');
  }
  function addFotos() {
    const albums = [...new Set([...db.eventos.map(e => e.titulo + ' · ' + e.cidade), ...db.fotos.map(f => f.album)])];
    openForm({ title: 'Adicionar fotos', eyebrow: 'Conteúdo · Fotos de eventos', fields: [
      { name: 'arq', label: 'Fotos (até 12 por envio)', type: 'file', accept: 'image/*', multiple: true, required: true, help: 'As imagens são reduzidas automaticamente para carregar rápido no site.' },
      { name: 'album', label: 'Álbum / evento', type: 'select', options: albums, value: S.album !== 'Todos' ? S.album : albums[0], full: true },
      { name: 'novo', label: 'Ou crie um álbum novo', full: true, placeholder: 'Ex.: Encontro Belém · 29/10/2026' },
      { name: 'leg', label: 'Legenda (opcional, vale para todas)', full: true }
    ], submit: 'Enviar fotos', onSubmit: d => { pushFotos(d.arq, d.novo || d.album, d.leg); } });
  }
  function tSecoes() {
    const pages = [...new Set(db.secoes.map(s => s.pagina))];
    const list = db.secoes.filter(s => s.pagina === S.secPage);
    return card('Seções das páginas', 'Ligue, desligue e reordene os blocos de cada página. Novas seções entram no fim da página escolhida.', [addBtn('Adicionar seção', addSecao, 'btn-sm btn-gold')],
      h('div', { class: 'chips', style: 'margin-bottom:12px' }, pages.map(p => chip(p, S.secPage === p, () => { S.secPage = p; render(); }, db.secoes.filter(s => s.pagina === p).length))),
      h('div', null, list.map((s, i) => h('div', { class: 'sec-row' + (s.visivel ? '' : ' off') + (s.fresh ? ' row-in' : '') },
        h('div', { class: 'ord' }, h('button', { type: 'button', 'aria-label': 'Subir', disabled: !i || null, onclick: () => moveSec(s, -1) }, ic('up')), h('button', { type: 'button', 'aria-label': 'Descer', disabled: i === list.length - 1 || null, onclick: () => moveSec(s, 1) }, ic('down'))),
        h('div', { style: 'min-width:0' }, h('b', { text: s.titulo }), h('small', { text: `${s.tipo}${s.texto ? ' · ' + s.texto.slice(0, 60) : ''}` })),
        sw(s.visivel ? 'Visível' : 'Oculta', s.visivel, v => { s.visivel = v; dirty(); render(); }),
        h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover seção', onclick: () => confirmBox(`Remover a seção "${s.titulo}"?`, () => { db.secoes = db.secoes.filter(x => x !== s); dirty(); render(); }) }, ic('trash'))))));
  }
  function moveSec(s, d) {
    const list = db.secoes.filter(x => x.pagina === s.pagina), i = list.indexOf(s), j = i + d; if (j < 0 || j >= list.length) return;
    const a = db.secoes.indexOf(list[i]), b = db.secoes.indexOf(list[j]); [db.secoes[a], db.secoes[b]] = [db.secoes[b], db.secoes[a]]; dirty(); render();
  }
  function addSecao() {
    openForm({ title: 'Nova seção', eyebrow: 'Conteúdo · Seções', fields: [
      { name: 'pagina', label: 'Página', type: 'select', options: ['Início', 'Módulos', 'Treinamentos', 'Sobre nós', 'Blog'], value: S.secPage },
      { name: 'tipo', label: 'Tipo de bloco', type: 'select', options: ['Texto', 'Destaque', 'Cartões', 'Galeria', 'Números', 'Chamada', 'Vídeo', 'Formulário'] },
      { name: 'titulo', label: 'Título', required: true, full: true }, { name: 'texto', label: 'Texto', type: 'textarea' },
      { name: 'cta', label: 'Botão (opcional)', placeholder: 'Ex.: Pedir pré-diagnóstico' }, { name: 'link', label: 'Link do botão', placeholder: 'Ex.: #contato' }
    ], submit: 'Adicionar seção', onSubmit: d => { db.secoes.push({ id: uid(), pagina: d.pagina, titulo: d.titulo, tipo: d.tipo, texto: d.texto, visivel: true, fresh: true }); S.sub = 'secoes'; S.secPage = d.pagina; dirty(); go('conteudo'); db.secoes.forEach(x => delete x.fresh); toast('Seção criada em ' + d.pagina + '.'); } });
  }
  function tAtas() {
    return card('Atas de registro de preço', db.atas.length ? 'Atas vigentes mostradas em "Como contratar".' : 'Nenhuma ata cadastrada. Enquanto a lista estiver vazia, o site informa que a ata segue com a proposta.', [addBtn('Adicionar ata', addAta, 'btn-sm btn-gold')],
      db.atas.length ? h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Nº', 'Órgão gerenciador', 'Objeto', 'Validade', ''].map(x => h('th', { text: x })))),
        h('tbody', null, db.atas.map(a => h('tr', null, h('td', null, h('b', { text: a.num })), h('td', { text: a.orgao }), h('td', { text: a.objeto }), h('td', null, h('span', { class: 'pill ' + (a.validade >= today() ? 'p-ok' : 'p-late'), text: dBR(a.validade) })),
          h('td', null, h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Remover ata', onclick: () => { db.atas = db.atas.filter(x => x !== a); dirty(); render(); } }, ic('trash')))))))) : empty('A primeira ata cadastrada aparece aqui e no site.', 'file'));
  }
  function addAta() { openForm({ title: 'Nova ata', eyebrow: 'Conteúdo · Atas', fields: [{ name: 'num', label: 'Nº da ata', required: true, placeholder: 'Ex.: 012/2026' }, { name: 'validade', label: 'Validade', type: 'date', required: true }, { name: 'orgao', label: 'Órgão gerenciador', required: true, full: true }, { name: 'objeto', label: 'Objeto', required: true, full: true, placeholder: 'Ex.: Consultoria em gestão educacional' }, { name: 'pdf', label: 'PDF da ata', type: 'file', accept: 'application/pdf' }], onSubmit: d => { db.atas.push({ id: uid(), num: d.num, validade: d.validade, orgao: d.orgao, objeto: d.objeto }); S.sub = 'atas'; dirty(); render(); toast('Ata ' + d.num + ' adicionada.'); } }); }
  function tDepo() {
    return card('Depoimentos', 'Ligue ou desligue cada depoimento do carrossel do site.', [addBtn('Adicionar depoimento', addDepo, 'btn-sm btn-gold')],
      h('div', { class: 'people' }, db.depos.map((d, i) => h('div', { class: 'person', style: `--c:#0F2744;animation-delay:${i * 40}ms` }, h('span', { class: 'av', style: 'color:var(--gold)', text: ini(d.nome) }), h('div', { style: 'flex:1;min-width:0' }, h('b', { text: d.nome }), h('small', { text: d.mun })), sw('', d.on, v => { d.on = v; dirty(); render(); })))));
  }
  function addDepo() { openForm({ title: 'Novo depoimento', eyebrow: 'Conteúdo · Depoimentos', fields: [{ name: 'nome', label: 'Nome', required: true }, { name: 'cargo', label: 'Cargo' }, { name: 'mun', label: 'Município/UF', required: true, full: true }, { name: 'texto', label: 'Depoimento', type: 'textarea', required: true }, { name: 'foto', label: 'Foto do município (opcional)', type: 'file', accept: 'image/*' }], onSubmit: d => { db.depos.unshift({ id: uid(), nome: d.nome, cargo: d.cargo, mun: d.mun, texto: d.texto, on: true }); S.sub = 'depo'; dirty(); render(); toast('Depoimento adicionado.'); } }); }

  /* =================== E-MAIL ===================
     O painel não envia e-mail sozinho: monta a mensagem e abre no app de e-mail, no Gmail ou no Outlook.
     A equipe anexa o arquivo (boleto, proposta, certificado) e envia de lá. */
  const ASSINATURA = '\n\nEquipe SIGEMEC\ncomercial@sigemec.com.br · (61) 99349-1280';
  const splitMails = v => String(v || '').split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
  function mailUrls(m) {
    const q = o => Object.entries(o).filter(([, v]) => v).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
    const to = m.to.join(','), cc = m.cc.join(','), bcc = m.bcc.join(',');
    return {
      app: 'mailto:' + to + '?' + q({ cc, bcc, subject: m.subject, body: m.body }),
      gmail: 'https://mail.google.com/mail/?' + q({ view: 'cm', fs: '1', to, cc, bcc, su: m.subject, body: m.body }),
      outlook: 'https://outlook.office.com/mail/deeplink/compose?' + q({ to, cc, bcc, subject: m.subject, body: m.body })
    };
  }
  /* queue: [{ to, cc, bcc, subject, body, label, onSent }] — várias mensagens são abertas uma por vez */
  function composeMail(queue, { tipo = 'E-mail', anexo = '' } = {}) {
    let i = 0;
    const draw = () => {
      const m = queue[i];
      const fTo = h('input', { value: m.to.join(', '), placeholder: 'email@exemplo.com', autocomplete: 'off' });
      const fCc = h('input', { value: (m.cc || []).join(', '), autocomplete: 'off' });
      const fBcc = h('input', { value: (m.bcc || []).join(', '), autocomplete: 'off' });
      const fSub = h('input', { value: m.subject, maxlength: 250 });
      const fBody = h('textarea', { style: 'min-height:220px;font-size:14px', maxlength: 6000 }, m.body);
      const err = h('em', { hidden: true });
      const read = () => {
        const msg = { to: splitMails(fTo.value), cc: splitMails(fCc.value), bcc: splitMails(fBcc.value), subject: fSub.value.trim(), body: fBody.value };
        const all = [...msg.to, ...msg.cc, ...msg.bcc], bad = all.filter(x => !isEmail(x));
        err.hidden = false;
        if (!all.length) { err.textContent = 'Informe pelo menos um destinatário.'; return null; }
        if (bad.length) { err.textContent = 'E-mail inválido: ' + bad.join(', '); return null; }
        if (!msg.subject) { err.textContent = 'Informe o assunto.'; return null; }
        err.hidden = true; return msg;
      };
      const done = (msg, via) => {
        db.envios.unshift({ data: nowBR(), tipo, via, para: [...msg.to, ...msg.cc, ...msg.bcc].join(', '), assunto: msg.subject, ref: m.label || '' });
        if (m.onSent) m.onSent(msg);
        save();
        toast(anexo ? `Mensagem aberta (${via}). Anexe ${anexo} e envie.` : `Mensagem aberta (${via}).`);
        if (++i < queue.length) draw(); else { modal.close(); render(); }
      };
      const open = via => () => {
        const msg = read(); if (!msg) return;
        const u = mailUrls(msg);
        if (via === 'app') { const a = h('a', { href: u.app }); document.body.append(a); a.click(); a.remove(); done(msg, 'app de e-mail'); }
        else { window.open(u[via], '_blank', 'noopener,noreferrer'); done(msg, via === 'gmail' ? 'Gmail' : 'Outlook'); }
      };
      const copy = () => { const msg = read(); if (!msg) return; const txt = `Para: ${msg.to.join(', ')}${msg.bcc.length ? '\nCco: ' + msg.bcc.join(', ') : ''}\nAssunto: ${msg.subject}\n\n${msg.body}`; (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Mensagem copiada.'), () => toast('Não foi possível copiar neste navegador.', true)); };
      const field = (label, ctl, full = true) => h('label', { class: 'f' + (full ? ' full' : '') }, h('span', { text: label }), ctl);
      openModal(queue.length > 1 ? `Mensagem ${i + 1} de ${queue.length}` : 'Escrever e-mail', tipo + (m.label ? ' · ' + m.label : ''), h('div', { class: 'm-form' },
        anexo ? h('div', { class: 'hint full', style: 'display:flex;gap:10px;align-items:center' }, ic('file'), h('span', null, 'Anexe ', h('b', { text: anexo }), ' no e-mail antes de enviar. O painel prepara a mensagem; o arquivo vai pelo seu e-mail.')) : null,
        field('Para', fTo), field('Cópia (Cc)', fCc, false), field('Cópia oculta (Cco)', fBcc, false), field('Assunto', fSub), field('Mensagem', fBody),
        h('div', { class: 'full' }, err),
        h('div', { class: 'm-acts', style: 'flex-wrap:wrap' },
          queue.length > 1 ? h('button', { type: 'button', class: 'btn btn-ghost', style: 'margin-right:auto', onclick: () => { if (++i < queue.length) draw(); else modal.close(); } }, 'Pular') : null,
          h('button', { type: 'button', class: 'btn', onclick: copy }, ic('copy'), 'Copiar'),
          h('button', { type: 'button', class: 'btn', onclick: open('outlook') }, 'Outlook'),
          h('button', { type: 'button', class: 'btn', onclick: open('gmail') }, 'Gmail'),
          h('button', { type: 'button', class: 'btn btn-ink', onclick: open('app') }, ic('mail'), 'Abrir no app de e-mail'))));
    };
    draw();
  }

  /* ---------- boletos: por participante ou por município ---------- */
  const finEmail = mun => db.finEmails[mun] || `financeiro@${slug(mun)}.example`;
  const primeiro = n => String(n).split(' ')[0];
  function openBoleto(turmaId, preSel) {
    const B = { turma: turmaId || S.turma || allTurmas()[0].id, modo: 'pessoa', pend: true, fmt: 'um', sel: new Set(preSel ? [preSel] : []) };
    const draw = () => {
      const t = turmaById(B.turma), c = t.curso;
      const ps = db.pessoas.filter(p => p.turma === t.id && p.status !== 'Isento' && (!B.pend || p.status !== 'Pago'));
      const muns = [...new Set(ps.map(p => p.mun))].map(mun => ({ mun, ps: ps.filter(p => p.mun === mun) }));
      const items = B.modo === 'pessoa' ? ps.map(p => p.id) : muns.map(m => m.mun);
      [...B.sel].forEach(k => { if (!items.includes(k)) B.sel.delete(k); });
      const qtd = B.modo === 'pessoa' ? B.sel.size : muns.filter(m => B.sel.has(m.mun)).reduce((s, m) => s + m.ps.length, 0);
      const toggle = k => e => { if (e.target.checked) B.sel.add(k); else B.sel.delete(k); draw(); };
      const row = (k, main, sub, right, extra) => h('div', { class: 'att' }, h('input', { type: 'checkbox', checked: B.sel.has(k), onchange: toggle(k), 'aria-label': 'Selecionar ' + main, style: 'width:20px;height:20px;accent-color:var(--gold)' }),
        h('span', null, h('b', { text: main }), h('small', { text: sub }), extra || null), right);
      const list = B.modo === 'pessoa'
        ? ps.map(p => row(p.id, p.nome, `${p.mun} · ${p.email}`, h('span', { class: 'acts' }, p.boleto ? h('span', { class: 'pill p-info', text: 'Enviado ' + dBR(p.boleto).slice(0, 5) }) : null, h('span', { class: 'pill ' + PSC[p.status], text: p.status }))))
        : muns.map(m => row(m.mun, m.mun, `${m.ps.length} participante(s) · ${brl2(m.ps.length * c.preco)}`, null,
          h('input', { class: 'inp', style: 'margin-top:6px;min-height:38px;font-size:13.5px;font-weight:500', value: finEmail(m.mun), 'aria-label': 'E-mail do financeiro de ' + m.mun, onchange: e => { db.finEmails[m.mun] = e.target.value.trim(); save(); } })));
      const body = h('div', { class: 'm-form' },
        h('label', { class: 'f full' }, h('span', { text: 'Turma' }), h('select', { onchange: e => { B.turma = e.target.value; B.sel.clear(); draw(); } }, allTurmas().map(x => h('option', { value: x.id, text: `${x.curso.nome} · ${turmaLabel(x)}`, selected: x.id === B.turma || null })))),
        h('div', { class: 'full chips' }, chip('Por participante', B.modo === 'pessoa', () => { B.modo = 'pessoa'; B.sel.clear(); draw(); }), chip('Por município', B.modo === 'mun', () => { B.modo = 'mun'; B.sel.clear(); draw(); }),
          h('label', { class: 'sw', style: 'margin-left:auto' }, h('input', { type: 'checkbox', checked: B.pend, onchange: e => { B.pend = e.target.checked; draw(); } }), h('i'), h('span', { text: 'Só quem não pagou' }))),
        h('div', { class: 'full card', style: 'padding:6px 14px;max-height:340px;overflow-y:auto' },
          items.length ? h('div', null, h('div', { class: 'att', style: 'border-top:0' }, h('input', { type: 'checkbox', checked: items.length && items.every(k => B.sel.has(k)), onchange: e => { items.forEach(k => e.target.checked ? B.sel.add(k) : B.sel.delete(k)); draw(); }, 'aria-label': 'Selecionar todos', style: 'width:20px;height:20px;accent-color:var(--gold)' }), h('span', null, h('b', { text: 'Selecionar todos' }), h('small', { text: `${items.length} ${B.modo === 'pessoa' ? 'participante(s)' : 'município(s)'}` }))), list)
            : empty('Ninguém com boleto pendente nesta turma.', 'check')),
        B.modo === 'pessoa' ? h('label', { class: 'f full' }, h('span', { text: 'Formato' }), h('select', { onchange: e => { B.fmt = e.target.value; } }, [['um', 'Um e-mail por participante (boleto individual)'], ['cco', 'Um e-mail só, com todos em cópia oculta']].map(([v, l]) => h('option', { value: v, text: l, selected: B.fmt === v || null })))) : null,
        h('div', { class: 'm-acts', style: 'justify-content:space-between;align-items:center' }, h('span', { style: 'font-size:14px;color:var(--body)' }, h('b', { style: 'color:var(--ink)', text: `${qtd} participante(s)` }), ` · ${brl2(qtd * c.preco)}`),
          h('button', { type: 'button', class: 'btn btn-ink', disabled: !B.sel.size || null, onclick: () => compose(t, c, ps, muns) }, ic('mail'), 'Escrever e-mail')));
      openModal('Enviar boletos por e-mail', 'Inscrições · boletos', body);
    };
    const compose = (t, c, ps, muns) => {
      const assunto = `Boleto de inscrição · ${c.nome} · ${t.cidade}/${t.uf}`;
      const quando = `${t.cidade}/${t.uf}, ${dBR(t.data)}${t.local ? ' · ' + t.local : ''}`;
      const marca = list => () => { list.forEach(p => { p.boleto = today(); if (p.status === 'Pré-inscrito') p.status = 'Validado'; }); };
      let q;
      if (B.modo === 'pessoa') {
        const sel = ps.filter(p => B.sel.has(p.id));
        q = B.fmt === 'cco'
          ? [{ to: ['comercial@sigemec.com.br'], cc: [], bcc: sel.map(p => p.email), subject: assunto, label: `${sel.length} participantes`, onSent: marca(sel),
            body: `Olá,\n\nSegue em anexo o boleto da sua inscrição no ${c.nome} (${quando}).\n\nValor por participante: ${brl2(c.preco)}\nPagamento até a data do encontro.\n\nDepois do pagamento, a inscrição é confirmada e você recebe o link do grupo da turma.\n\nQualquer dúvida, é só responder este e-mail.` + ASSINATURA }]
          : sel.map(p => ({ to: [p.email], cc: [], bcc: [], subject: assunto, label: p.nome, onSent: marca([p]),
            body: `Olá, ${primeiro(p.nome)},\n\nSegue em anexo o boleto da sua inscrição no ${c.nome} (${quando}).\n\nParticipante: ${p.nome} · CPF ${p.cpf}\nValor: ${brl2(c.preco)}\nPagamento até a data do encontro.\n\nDepois do pagamento, a inscrição é confirmada e você recebe o link do grupo da turma.\n\nQualquer dúvida, é só responder este e-mail.` + ASSINATURA }));
      } else {
        q = muns.filter(m => B.sel.has(m.mun)).map(m => ({ to: [finEmail(m.mun)], cc: m.ps.map(p => p.email), bcc: [], subject: `${assunto} · ${m.mun}`, label: m.mun, onSent: marca(m.ps),
          body: `Prezados,\n\nSeguem em anexo os boletos das inscrições de ${m.mun} no ${c.nome} (${quando}).\n\n${m.ps.map((p, k) => `${k + 1}. ${p.nome} · ${p.funcao} · CPF ${p.cpf} · ${brl2(c.preco)}`).join('\n')}\n\nTotal: ${brl2(m.ps.length * c.preco)} (${m.ps.length} participante${m.ps.length > 1 ? 's' : ''})\nPagamento até a data do encontro. Se a prefeitura preferir empenho, responda com a nota de empenho que emitimos a nota fiscal.\n\nQualquer dúvida, é só responder este e-mail.` + ASSINATURA }));
      }
      composeMail(q, { tipo: 'Boleto', anexo: B.modo === 'mun' || B.fmt === 'cco' ? 'os boletos (PDF)' : 'o boleto (PDF)' });
    };
    draw();
  }

  /* =================== RELATÓRIOS (planilhas CSV) =================== */
  const turmaOpts = () => [['', 'Todas as turmas'], ...allTurmas().map(t => [t.id, `${t.curso.nome} · ${turmaLabel(t)}`])];
  const cursoOpts = () => [['', 'Todos os cursos'], ...db.cursos.map(c => [c.id, c.nome])];
  const freqDe = p => { const t = turmaById(p.turma); const n = t && t.curso.dias.length || 1; return Math.round(Object.values(p.pres || {}).filter(Boolean).length / n * 100); };
  const pessoasF = f => db.pessoas.filter(p => (!f.turma || p.turma === f.turma) && (!f.curso || (turmaById(p.turma) || {}).curso?.id === f.curso) && (!f.status || p.status === f.status));
  const AREAS = [['pedidos', 'Pedidos', '#39A9DB'], ['inscricoes', 'Inscrições', '#EA6036'], ['financeiro', 'Financeiro', '#40C965'], ['cursos', 'Cursos', '#B07E10'], ['conteudo', 'Conteúdo do site', '#1E7FAE'], ['envios', 'E-mails', '#33404F']];
  const REPORTS = [
    { id: 'ped-geral', area: 'pedidos', nome: 'Pedidos recebidos', desc: 'Todos os pedidos com contato, módulos, urgência e situação.',
      filtros: [{ k: 'status', label: 'Situação', opts: () => [['', 'Todas'], ...Object.entries(ST)] }],
      cols: ['Data', 'Município', 'UF', 'Órgão', 'Tipo', 'Responsável', 'Cargo', 'E-mail', 'Módulos', 'Urgência', 'População', 'Situação', 'Última anotação'],
      rows: f => db.pedidos.filter(p => !f.status || p.status === f.status).map(p => [dBR(p.data), p.mun.split('/')[0], p.mun.split('/')[1] || '', p.orgao, p.tipo, p.resp, p.cargo, p.email, p.mods.join(', '), p.urg, p.pop, ST[p.status], p.notas[0] ? p.notas[0].txt : '']) },
    { id: 'ped-modulo', area: 'pedidos', nome: 'Funil por módulo', desc: 'Quantos pedidos cada módulo recebeu e quantos viraram contrato.',
      cols: ['Módulo', 'Pedidos', 'Novos', 'Em contato', 'Proposta enviada', 'Contrato fechado', 'Taxa de fechamento'],
      rows: () => Object.keys(MOD).map(m => { const l = db.pedidos.filter(p => p.mods.includes(m)), n = s => l.filter(p => p.status === s).length; return [m, l.length, n('novo'), n('contato'), n('proposta'), n('fechado'), l.length ? Math.round(n('fechado') / l.length * 100) + '%' : '0%']; }) },
    { id: 'ped-uf', area: 'pedidos', nome: 'Pedidos por estado', desc: 'Distribuição geográfica dos pedidos.',
      cols: ['UF', 'Pedidos', 'Contratos fechados', 'Municípios'],
      rows: () => [...new Set(db.pedidos.map(p => p.mun.split('/')[1]))].sort().map(uf => { const l = db.pedidos.filter(p => p.mun.endsWith('/' + uf)); return [uf, l.length, l.filter(p => p.status === 'fechado').length, [...new Set(l.map(p => p.mun.split('/')[0]))].join(', ')]; }) },
    { id: 'ins-lista', area: 'inscricoes', nome: 'Lista de inscritos', desc: 'Participantes por turma, com função, contato e situação do pagamento.',
      filtros: [{ k: 'turma', label: 'Turma', opts: turmaOpts }, { k: 'status', label: 'Situação', opts: () => [['', 'Todas'], ...PS.map(s => [s, s])] }],
      cols: ['Curso', 'Turma', 'Data', 'Participante', 'CPF', 'Função', 'Município', 'E-mail', 'Pagador', 'Situação', 'Boleto enviado em'],
      rows: f => pessoasF(f).map(p => { const t = turmaById(p.turma) || { curso: {} }; return [t.curso.nome, `${t.cidade}/${t.uf}`, dBR(t.data), p.nome, p.cpf, p.funcao, p.mun, p.email, p.pagador, p.status, p.boleto ? dBR(p.boleto) : '']; }) },
    { id: 'ins-mun', area: 'inscricoes', nome: 'Inscrições por município', desc: 'Quantos participantes cada prefeitura inscreveu e quanto deve.',
      filtros: [{ k: 'turma', label: 'Turma', opts: turmaOpts }],
      cols: ['Município', 'Curso', 'Turma', 'Participantes', 'Pagos', 'Pendentes', 'Isentos', 'Valor previsto', 'Valor recebido', 'E-mail do financeiro'],
      rows: f => { const out = []; allTurmas().filter(t => !f.turma || t.id === f.turma).forEach(t => { const ps = db.pessoas.filter(p => p.turma === t.id); [...new Set(ps.map(p => p.mun))].forEach(m => { const l = ps.filter(p => p.mun === m), n = s => l.filter(p => p.status === s).length; out.push([m, t.curso.nome, `${t.cidade}/${t.uf} ${dBR(t.data)}`, l.length, n('Pago'), l.length - n('Pago') - n('Isento'), n('Isento'), brl2((l.length - n('Isento')) * t.curso.preco), brl2(n('Pago') * t.curso.preco), finEmail(m)]); }); }); return out; } },
    { id: 'fin-turma', area: 'financeiro', nome: 'Resumo financeiro por turma', desc: 'Vagas, inscritos, pagos e valores previstos e recebidos.',
      filtros: [{ k: 'curso', label: 'Curso', opts: cursoOpts }],
      cols: ['Curso', 'Turma', 'Data', 'Vagas', 'Inscritos', 'Pagos', 'Validados', 'Pré-inscritos', 'Isentos', 'Previsto', 'Recebido', 'A receber'],
      rows: f => allTurmas().filter(t => !f.curso || t.curso.id === f.curso).map(t => { const l = db.pessoas.filter(p => p.turma === t.id), n = s => l.filter(p => p.status === s).length, pr = t.curso.preco; return [t.curso.nome, `${t.cidade}/${t.uf}`, dBR(t.data), t.vagas, inscritos(t), n('Pago'), n('Validado'), n('Pré-inscrito'), n('Isento'), brl2((inscritos(t) - n('Isento')) * pr), brl2(n('Pago') * pr), brl2((n('Validado') + n('Pré-inscrito')) * pr)]; }) },
    { id: 'fin-boletos', area: 'financeiro', nome: 'Controle de boletos', desc: 'Quem já recebeu boleto, quanto vale e se pagou.',
      filtros: [{ k: 'turma', label: 'Turma', opts: turmaOpts }],
      cols: ['Participante', 'Município', 'Curso', 'Turma', 'Valor', 'Situação', 'Boleto enviado em', 'E-mail'],
      rows: f => pessoasF(f).filter(p => p.status !== 'Isento').map(p => { const t = turmaById(p.turma); return [p.nome, p.mun, t.curso.nome, `${t.cidade}/${t.uf}`, brl2(t.curso.preco), p.status, p.boleto ? dBR(p.boleto) : 'Não enviado', p.email]; }) },
    { id: 'cur-presenca', area: 'cursos', nome: 'Lista de presença', desc: 'Presença por dia e frequência de cada participante.',
      filtros: [{ k: 'turma', label: 'Turma', opts: turmaOpts }],
      cols: f => { const t = f.turma ? turmaById(f.turma) : null, n = t ? Math.max(1, t.curso.dias.length) : 3; return ['Turma', 'Participante', 'CPF', 'Município', ...Array.from({ length: n }, (_, i) => 'Dia ' + (i + 1)), 'Frequência']; },
      rows: f => { const t = f.turma ? turmaById(f.turma) : null, n = t ? Math.max(1, t.curso.dias.length) : 3; return pessoasF(f).map(p => { const tt = turmaById(p.turma); return [`${tt.cidade}/${tt.uf} ${dBR(tt.data)}`, p.nome, p.cpf, p.mun, ...Array.from({ length: n }, (_, i) => i < Math.max(1, tt.curso.dias.length) ? (p.pres && p.pres[i] ? 'Presente' : 'Ausente') : ''), freqDe(p) + '%']; }); } },
    { id: 'cur-cert', area: 'cursos', nome: 'Certificados', desc: 'Frequência, situação da inscrição e certificado emitido.',
      filtros: [{ k: 'curso', label: 'Curso', opts: cursoOpts }],
      cols: ['Participante', 'CPF', 'Curso', 'Carga horária', 'Turma', 'Frequência', 'Inscrição', 'Certificado'],
      rows: f => pessoasF(f).map(p => { const t = turmaById(p.turma); return [p.nome, p.cpf, t.curso.nome, t.curso.carga, `${t.cidade}/${t.uf}`, freqDe(p) + '%', p.status, p.cert ? 'Emitido' : 'Pendente']; }) },
    { id: 'cur-prog', area: 'cursos', nome: 'Programação dos cursos', desc: 'Dias, horários, sessões e palestrantes.',
      filtros: [{ k: 'curso', label: 'Curso', opts: cursoOpts }],
      cols: ['Curso', 'Dia', 'Horário', 'Sessão', 'Palestrante'],
      rows: f => db.cursos.filter(c => !f.curso || c.id === f.curso).flatMap(c => c.dias.flatMap(d => d.sessoes.slice().sort((a, b) => a.hora.localeCompare(b.hora)).map(s => [c.nome, d.titulo, s.hora, s.titulo, s.quem]))) },
    { id: 'con-projetos', area: 'conteudo', nome: 'Projetos contemplados', desc: 'Os projetos mostrados na página inicial.',
      cols: ['Município', 'UF', 'Programa', 'Valor pago', 'Pago em'],
      rows: () => db.projetos.map(p => [p.mun.split('/')[0], p.mun.split('/')[1] || '', p.prog, brl2(p.valor), dBR(p.pago)]) },
    { id: 'con-eventos', area: 'conteudo', nome: 'Eventos', desc: 'Agenda de eventos do site, publicados e rascunhos.',
      cols: ['Data', 'Evento', 'Cidade', 'Curso vinculado', 'Situação', 'Descrição'],
      rows: () => db.eventos.slice().sort((a, b) => a.data.localeCompare(b.data)).map(e => [dBR(e.data), e.titulo, e.cidade, (db.cursos.find(c => c.id === e.curso) || {}).nome || '', e.status, e.desc]) },
    { id: 'con-secoes', area: 'conteudo', nome: 'Mapa das páginas', desc: 'Seções de cada página, na ordem em que aparecem.',
      cols: ['Página', 'Ordem', 'Seção', 'Tipo', 'Visível'],
      rows: () => { const c = {}; return db.secoes.map(s => [s.pagina, (c[s.pagina] = (c[s.pagina] || 0) + 1), s.titulo, s.tipo, s.visivel ? 'Sim' : 'Não']); } },
    { id: 'con-fotos', area: 'conteudo', nome: 'Galeria de fotos', desc: 'Fotos por álbum, com legenda e capa.',
      cols: ['Álbum', 'Legenda', 'Capa'],
      rows: () => db.fotos.map(f => [f.album, f.leg, f.capa ? 'Sim' : '']) },
    { id: 'env-hist', area: 'envios', nome: 'Histórico de e-mails', desc: 'Mensagens preparadas pelo painel: boletos, propostas, materiais e certificados.',
      cols: ['Data', 'Tipo', 'Referência', 'Aberto em', 'Para', 'Assunto'],
      rows: () => db.envios.map(e => [e.data, e.tipo, e.ref, e.via, e.para, e.assunto]) }
  ];
  S.rf = {}; S.rArea = '';
  const rCols = (r, f) => typeof r.cols === 'function' ? r.cols(f) : r.cols;
  function runReport(r) {
    const f = S.rf[r.id] || {};
    const rows = r.rows(f);
    const stamp = today().split('-').reverse().join('-');
    csv(`sigemec-${r.id}-${stamp}.csv`, [rCols(r, f), ...rows]);
  }
  function previewReport(r) {
    const f = S.rf[r.id] || {}, cols = rCols(r, f), rows = r.rows(f);
    openModal(r.nome, `Relatório · ${rows.length} linha(s)`, h('div', { class: 'm-form' },
      h('div', { class: 'full tbl-wrap card', style: 'padding:6px' }, rows.length ? h('table', { class: 'tbl', style: `min-width:${Math.max(560, cols.length * 120)}px` }, h('thead', null, h('tr', null, cols.map(c => h('th', { text: c })))), h('tbody', null, rows.slice(0, 8).map(rw => h('tr', null, rw.map(v => h('td', { text: String(v ?? '') }))))))
        : empty('Sem dados para esses filtros.', 'file')),
      rows.length > 8 ? h('p', { class: 'full', style: 'margin:0;font-size:13px;color:var(--body)', text: `Mostrando 8 de ${rows.length} linhas. A planilha traz todas.` }) : null,
      h('div', { class: 'm-acts' }, h('button', { type: 'button', class: 'btn btn-ghost', text: 'Fechar', onclick: () => modal.close() }), h('button', { type: 'button', class: 'btn btn-ink', onclick: () => { runReport(r); modal.close(); } }, ic('download'), 'Baixar CSV'))));
  }
  function reportCard(r, i) {
    const f = S.rf[r.id] = S.rf[r.id] || {};
    const area = AREAS.find(a => a[0] === r.area);
    return h('article', { class: 'ev', style: `--c:${area[2]};animation-delay:${i * 30}ms` },
      h('div', { class: 'row' }, h('span', { class: 'mod', style: `--c:${area[2]}` }, h('i'), area[1]), h('span', { style: 'font-size:12.5px;color:var(--body)', text: `${r.rows(f).length} linha(s)` })),
      h('h3', { text: r.nome }), h('p', { text: r.desc }),
      h('div', { class: 'mods' }, rCols(r, f).map(c => h('span', { class: 'mod', style: 'background:#fff;border:1px solid var(--line);font-weight:500', text: c }))),
      (r.filtros || []).map(fl => h('label', { class: 'lbl-f' }, fl.label, h('select', { class: 'inp', style: 'min-height:40px;font-size:14px;font-weight:500', onchange: e => { f[fl.k] = e.target.value; render(); } }, fl.opts().map(([v, l]) => h('option', { value: v, text: l, selected: (f[fl.k] || '') === v || null }))))),
      h('div', { class: 'acts', style: 'margin-top:auto' }, btn('Visualizar', 'search', () => previewReport(r), 'btn-sm'), btn('Gerar CSV', 'download', () => runReport(r), 'btn-sm btn-ink')));
  }
  function relatorios() {
    const list = REPORTS.filter(r => !S.rArea || r.area === S.rArea);
    return [
      head('Painel de controle', 'Relatórios', 'Planilhas prontas para cada área. Escolha os filtros, visualize e baixe em CSV (abre no Excel e no Google Planilhas).', null),
      h('div', { class: 'chips', style: 'margin-bottom:14px' }, chip('Todas as áreas', !S.rArea, () => { S.rArea = ''; render(); }, REPORTS.length), AREAS.map(([id, l, c]) => chip(l, S.rArea === id, () => { S.rArea = id; render(); }, REPORTS.filter(r => r.area === id).length, c))),
      h('div', { class: 'grid g3' }, list.map(reportCard))
    ];
  }
  /* botão "Exportar planilha" de cada tela: mostra os relatórios daquela área */
  function exportArea(areas) {
    const list = REPORTS.filter(r => areas.includes(r.area));
    openModal('Exportar planilha', 'Relatórios', h('div', { class: 'qadd' }, list.map(r => h('button', { type: 'button', style: `--c:${AREAS.find(a => a[0] === r.area)[2]}`, onclick: () => { if (r.filtros) { modal.close(); go('relatorios', { rArea: r.area }); toast('Escolha os filtros e gere a planilha.'); } else { runReport(r); modal.close(); } } }, ic('download'), r.nome, h('small', { text: r.desc }))),
      h('button', { type: 'button', style: '--c:var(--ink)', onclick: () => { modal.close(); go('relatorios'); } }, ic('file'), 'Todos os relatórios', h('small', { text: 'Abrir a central de relatórios' }))));
  }

  /* =================== LOGIN =================== */
  function startApp(welcomeName) {
    const app = $('#app'); app.hidden = false; requestAnimationFrame(() => app.classList.add('in'));
    const name = sessionStorage.getItem('sgm-painel-nome') || 'Equipe comercial';
    $('#uName').textContent = name; $('#uAv').textContent = ini(name);
    render(true);
    if (welcomeName) document.body.append(h('div', { class: 'welcome', role: 'status' }, h('span', { class: 'av', text: ini(welcomeName) }), h('span', null, 'Seja bem-vindo aos seus resultados, ', h('b', { text: welcomeName.split(' ')[0] }), '.')));
  }
  function initLogin() {
    const L = $('#login'); L.hidden = false;
    requestAnimationFrame(() => { L.classList.add('ready'); });
    /* título palavra por palavra */
    const hd = $('#lHead'), h1 = hd.querySelector('h1'), parts = [];
    for (const node of [...h1.childNodes]) {
      if (node.nodeType === 3) node.textContent.split(/\s+/).filter(Boolean).forEach(w => parts.push(document.createTextNode(w)));
      else parts.push(node.cloneNode(true));
    }
    h1.replaceChildren(...parts.flatMap((p, i) => [h('span', { class: 'w', 'aria-hidden': 'true' }, h('span', { style: `transition-delay:${200 + i * 90}ms` }, p)), ' ']));
    setTimeout(() => hd.classList.add('in'), 120);
    $('#lTicker').replaceChildren(...[0, 1].flatMap(() => [['Gestão', '#E0A729'], ['PAR · SIMEC', '#EA6036'], ['SIGPC Ágil', '#39A9DB'], ['Fundeb', '#40C965'], ['PNAE · PNATE · PDDE', '#E0A729'], ['RDQA · SUS', '#39A9DB'], ['Educacenso', '#40C965'], ['Transferegov', '#EA6036']].map(([t, c]) => h('span', { style: `--c:${c}` }, h('i'), t))));
    $$('.chip-f').forEach((c, i) => setTimeout(() => c.classList.add('in'), 900 + i * 220));
    setTimeout(() => $$('[data-up]', L).forEach(b => countUp(b, parseFloat(b.dataset.up), { dec: +b.dataset.dec || 0, pre: b.dataset.pre || '', suf: b.dataset.suf || '', dur: 1800 })), 700);
    /* parallax leve com o mouse */
    if (!reduce && matchMedia('(pointer:fine)').matches) {
      const art = $('.l-art'), rings = $('#lRings');
      art.addEventListener('mousemove', e => { const r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; rings.style.transform = `translate(${x * 18}px,${y * 18}px)`; $$('.chip-f').forEach((c, i) => { c.style.transform = `translate(${x * (10 + i * 6)}px,${y * (10 + i * 6)}px)`; }); });
    }
    const eye = $('#lEye'), pass = $('#lPass'); eye.append(ic('eye'));
    eye.addEventListener('click', () => { const show = pass.type === 'password'; pass.type = show ? 'text' : 'password'; eye.replaceChildren(ic(show ? 'eyeoff' : 'eye')); eye.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha'); });
    const step = id => { ['lStep1', 'lStep2', 'lStepF', 'lStepOk'].forEach(s => { $('#' + s).hidden = s !== id; }); };
    let email = '';
    $('#lForm').addEventListener('submit', e => {
      e.preventDefault();
      email = $('#lEmail').value.trim(); const pw = pass.value, err = $('#lErr');
      $('#flEmail').classList.remove('bad'); $('#flPass').classList.remove('bad');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Informe um e-mail válido.'; void $('#flEmail').offsetWidth; $('#flEmail').classList.add('bad'); $('#lEmail').focus(); return; }
      if (pw.length < 6) { err.textContent = 'A senha tem pelo menos 6 caracteres.'; void $('#flPass').offsetWidth; $('#flPass').classList.add('bad'); pass.focus(); return; }
      err.textContent = ''; const b = $('#lGo'); b.classList.add('load');
      setTimeout(() => {
        b.classList.remove('load'); step('lStep2');
        const [u, d] = email.split('@'); $('#lSent').textContent = `Enviamos um código de 6 dígitos para ${u.slice(0, 2)}•••@${d}.`;
        buildCode(); resendTimer();
      }, reduce ? 50 : 1100);
    });
    function buildCode() {
      const box = $('#lCode'); box.classList.remove('bad');
      const ins = Array.from({ length: 6 }, (_, i) => h('input', { type: 'text', inputmode: 'numeric', maxlength: 1, autocomplete: i ? 'off' : 'one-time-code', 'aria-label': `Dígito ${i + 1}` }));
      ins.forEach((inp, i) => {
        inp.addEventListener('input', () => { inp.value = digits(inp.value).slice(-1); if (inp.value && ins[i + 1]) ins[i + 1].focus(); if (ins.every(x => x.value)) $('#lCodeForm').requestSubmit(); });
        inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && ins[i - 1]) ins[i - 1].focus(); if (e.key === 'ArrowLeft' && ins[i - 1]) ins[i - 1].focus(); if (e.key === 'ArrowRight' && ins[i + 1]) ins[i + 1].focus(); });
        inp.addEventListener('paste', e => { const d = digits((e.clipboardData || window.clipboardData).getData('text')).slice(0, 6); if (!d) return; e.preventDefault(); d.split('').forEach((c, k) => { if (ins[k]) ins[k].value = c; }); (ins[d.length] || ins[5]).focus(); if (d.length === 6) $('#lCodeForm').requestSubmit(); });
      });
      box.replaceChildren(...ins); setTimeout(() => ins[0].focus(), 80);
    }
    let rt;
    function resendTimer() {
      const b = $('#lResend'); let s = 30; b.disabled = true; clearInterval(rt);
      const tick = () => { b.textContent = s > 0 ? `Reenviar em ${s}s` : 'Reenviar código'; if (s-- <= 0) { b.disabled = false; clearInterval(rt); } };
      tick(); rt = setInterval(tick, 1000);
    }
    $('#lResend').addEventListener('click', () => { resendTimer(); toast('Novo código enviado.'); });
    $('#lBack').addEventListener('click', () => { step('lStep1'); pass.focus(); });
    $('#lCodeForm').addEventListener('submit', e => {
      e.preventDefault();
      const code = $$('#lCode input').map(i => i.value).join(''), err = $('#lErr2'), box = $('#lCode');
      if (code.length < 6) { err.textContent = 'Digite os 6 dígitos.'; return; }
      const b = $('#lGo2'); b.classList.add('load');
      setTimeout(() => {
        b.classList.remove('load');
        if (code !== DEMO_CODE) { err.textContent = 'Código incorreto. Confira e tente de novo.'; box.classList.remove('bad'); void box.offsetWidth; box.classList.add('bad'); $$('#lCode input').forEach(i => { i.value = ''; }); $('#lCode input').focus(); return; }
        err.textContent = '';
        const nome = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\d+/g, '').trim().replace(/\b\w/g, c => c.toUpperCase()) || 'Equipe';
        sessionStorage.setItem(AUTH, '1'); sessionStorage.setItem('sgm-painel-nome', nome);
        if ($('#lRemember').checked) try { localStorage.setItem(AUTH, '1'); localStorage.setItem('sgm-painel-nome', nome); } catch (e2) {}
        const ok = $('#lStepOk');
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 84 84');
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', 42); c.setAttribute('cy', 42); c.setAttribute('r', 38);
        const p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M26 43l11 11 21-23'); svg.append(c, p);
        ok.replaceChildren(h('div', { class: 'l-ok' }, svg, h('b', { text: `Tudo certo, ${nome.split(' ')[0]}.` }), h('span', { style: 'color:var(--body)', text: 'Carregando seus resultados…' })));
        step('lStepOk');
        setTimeout(() => { L.classList.add('out'); startApp(nome); setTimeout(() => { L.hidden = true; }, 800); }, reduce ? 100 : 1500);
      }, reduce ? 50 : 900);
    });
    $('#lForgot').addEventListener('click', () => { step('lStepF'); $('#lEmailF').value = $('#lEmail').value; $('#lEmailF').focus(); });
    $('#lBackF').addEventListener('click', () => step('lStep1'));
    $('#lForgotForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#lEmailF').value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { $('#lErrF').textContent = 'Informe um e-mail válido.'; return; } $('#lErrF').textContent = ''; toast('Se o e-mail estiver cadastrado, o link chega em instantes.'); step('lStep1'); });
  }

  /* ---------- início ---------- */
  $$('[data-logo]').forEach(el => el.prepend(logo()));
  $('#navBtn').append(ic('menu'));
  $('#siteLink').append(ic('ext'), 'Ver o site');
  $('#resetBtn').append(ic('refresh'), 'Restaurar dados de exemplo');
  $('#logoutBtn').append(ic('logout'), 'Sair');
  $('#navBtn').addEventListener('click', () => { const o = $('#app').classList.toggle('nav-open'); $('#navBtn').setAttribute('aria-expanded', String(o)); });
  $('#scrim').addEventListener('click', () => { $('#app').classList.remove('nav-open'); $('#navBtn').setAttribute('aria-expanded', 'false'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#app').classList.remove('nav-open'); });
  $('#resetBtn').addEventListener('click', () => confirmBox('Apagar o que foi cadastrado nesta prévia e voltar aos dados de exemplo?', () => { db = seed(); save(); render(true); toast('Dados de exemplo restaurados.'); }));
  $('#logoutBtn').addEventListener('click', () => { try { sessionStorage.removeItem(AUTH); localStorage.removeItem(AUTH); } catch (e) {} location.reload(); });

  let logged = false;
  try { logged = sessionStorage.getItem(AUTH) === '1' || localStorage.getItem(AUTH) === '1'; if (logged && !sessionStorage.getItem('sgm-painel-nome')) sessionStorage.setItem('sgm-painel-nome', localStorage.getItem('sgm-painel-nome') || 'Equipe comercial'); } catch (e) {}
  if (logged) startApp(); else initLogin();
})();
