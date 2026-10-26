(function () {
  'use strict';
  var TOKEN = /\{\{\s*([\w.$]+)\s*\}\}/g;
  var ONLY = /^\{\{\s*([\w.$]+)\s*\}\}$/;

  function lookup(scope, path) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    var parts = path.split('.'), v = scope[parts[0]];
    for (var i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function interp(str, scope) {
    return str.replace(TOKEN, function (_, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  function value(str, scope) {
    var m = ONLY.exec(str.trim());
    return m ? lookup(scope, m[1]) : interp(str, scope);
  }
  function child(scope, name, item) {
    var s = Object.create(scope); s[name] = item; return s;
  }

  var EVENTS = { 'data-click': 'click', 'data-input': 'input', 'data-change': 'change' };

  function renderNodes(nodes, scope, parent) {
    for (var i = 0; i < nodes.length; i++) renderNode(nodes[i], scope, parent);
  }
  function renderNode(node, scope, parent) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();
    if (tag === 'sc-for') {
      var list = value(node.getAttribute('list'), scope) || [], as = node.getAttribute('as');
      for (var j = 0; j < list.length; j++) renderNodes(node.childNodes, child(scope, as, list[j]), parent);
      return;
    }
    if (tag === 'sc-if') {
      if (value(node.getAttribute('value'), scope)) renderNodes(node.childNodes, scope, parent);
      return;
    }
    var el = node.namespaceURI === 'http://www.w3.org/2000/svg'
      ? document.createElementNS(node.namespaceURI, node.tagName)
      : document.createElement(tag);
    for (var k = 0; k < node.attributes.length; k++) {
      var a = node.attributes[k];
      if (EVENTS[a.name]) {
        var fn = value(a.value, scope);
        if (typeof fn === 'function') el.addEventListener(EVENTS[a.name], fn);
      } else if (a.name === 'data-value') {
        el.value = String(value(a.value, scope));
        el.setAttribute('value', el.value);
      } else if (a.name === 'data-checked') {
        el.checked = !!value(a.value, scope);
      } else {
        el.setAttribute(a.name, interp(a.value, scope));
      }
    }
    renderNodes((tag === 'template' ? node.content : node).childNodes, scope, el);
    if (tag === 'select' && node.getAttribute('data-value')) el.value = String(value(node.getAttribute('data-value'), scope));
    parent.appendChild(el);
  }

  function View(props) { this.props = props || {}; this.state = {}; }
  View.prototype.setState = function (patch) {
    for (var k in patch) this.state[k] = patch[k];
    schedule();
  };

class Component extends View {
  constructor(props) {
    super(props);
    this.state = { tab: 'visao', period: '30d', status: 'todos', selId: 'p1', overrides: {}, turma: 'gem-belem', ctab: 'numeros', dirty: 0, published: false, peopleStatus: {} };
  }
  renderVals() {
    const S = this.state;
    const set = o => this.setState(o);
    const MOD = { 'Gestão': '#B07E10', 'Educação': '#D9532B', 'Saúde': '#1E7FAE', 'Escola': '#23944A' };
    const ST = {
      novo: { label: 'Novo', bg: '#CDEAF7', fg: '#135775' },
      contato: { label: 'Em contato', bg: '#F7E7BF', fg: '#5E450B' },
      proposta: { label: 'Proposta enviada', bg: '#FBD9CC', fg: '#7A2710' },
      fechado: { label: 'Contrato fechado', bg: '#CFF2D9', fg: '#155A2B' }
    };
    const pill = s => `display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; background: ${ST[s].bg}; color: ${ST[s].fg}`;
    const chip = (on, dark) => `min-height: 44px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; border: 1.5px solid ${on ? '#0A1525' : 'rgba(10,21,37,.16)'}; background: ${on ? '#0A1525' : (dark ? 'transparent' : '#fff')}; color: ${on ? '#EDF0F4' : '#0A1525'}`;

    const PEDIDOS = [
      { id: 'p1', data: '26/10', mun: 'Tianguá/CE', orgao: 'Secretaria de Educação', resp: 'Marta Albuquerque', cargo: 'Secretária de Educação', tipo: 'Pré-diagnóstico', mods: ['Educação', 'Gestão'], status: 'novo', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.318.442-••', email: 'm.albuquerque@[municipio].gov.br', tel: '(88) 9••••-••12', urg: 'Recurso bloqueado por pendência', pop: '30 a 100 mil', answers: [['PAR Ciclo 5', 'Em andamento'], ['PNAE, PNATE e PDDE', 'Algum com pendência'], ['Escolas na rede', '41'], ['Prestação de contas pendente', 'Sim']], desc: 'Temos duas obras de creche paradas desde 2022 e a prestação de contas do PNAE de 2024 está em diligência no SIGPC. Precisamos regularizar antes de cadastrar novas ações do PAR.' },
      { id: 'p2', data: '25/10', mun: 'Salinópolis/PA', orgao: 'Prefeitura Municipal', resp: 'José Carvalho', cargo: 'Controlador-geral', tipo: 'Proposta e ata', mods: ['Gestão'], status: 'contato', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.902.115-••', email: 'controladoria@[municipio].gov.br', tel: '(91) 9••••-••40', urg: 'Captar novos recursos', pop: '30 a 100 mil', answers: [['Obra ou convênio paralisado', 'Sim, 1 ou 2'], ['Plataformas', 'Transferegov, SIMEC'], ['Equipe de convênios', '1 pessoa']], desc: 'Queremos a ata vigente e a proposta para aderir ainda neste exercício. A controladoria precisa da pesquisa de preços para anexar ao processo.' },
      { id: 'p3', data: '24/10', mun: 'Cachoeirinha/RS', orgao: 'Secretaria de Educação', resp: 'Paula Menezes', cargo: 'Diretora pedagógica', tipo: 'Pré-diagnóstico', mods: ['Escola'], status: 'proposta', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.554.870-••', email: 'p.menezes@[municipio].gov.br', tel: '(51) 9••••-••77', urg: 'Implantar sistema de gestão', pop: '100 a 500 mil', answers: [['Registro de notas hoje', 'Parte em sistema, parte em papel'], ['Escolas que usariam', '38'], ['Opcionais', 'Central de Matrículas, Transporte']], desc: 'A rede usa planilhas em metade das escolas. Queremos centralizar matrícula e frequência antes do Censo de 2027.' },
      { id: 'p4', data: '23/10', mun: 'Cururupu/MA', orgao: 'Secretaria de Saúde', resp: 'Renata Lima', cargo: 'Secretária de Saúde', tipo: 'Pré-diagnóstico', mods: ['Saúde', 'Gestão'], status: 'novo', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.230.661-••', email: 'saude@[municipio].gov.br', tel: '(98) 9••••-••03', urg: 'Prazo de prestação de contas', pop: '30 a 100 mil', answers: [['Plano Municipal de Saúde', 'Em elaboração'], ['RAG e RDQA', 'Com atraso'], ['Unidades de saúde', '12']], desc: 'O RDQA do segundo quadrimestre não foi apresentado na Câmara e o Plano Municipal de Saúde 2026–2029 ainda está em elaboração.' },
      { id: 'p5', data: '22/10', mun: 'Monteiro/PB', orgao: 'Secretaria de Educação', resp: 'Carlos Nóbrega', cargo: 'Técnico do PAR', tipo: 'Treinamento in company', mods: ['Educação'], status: 'fechado', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.775.304-••', email: 'par@[municipio].gov.br', tel: '(83) 9••••-••58', urg: 'Organizar e capacitar a equipe', pop: '30 a 100 mil', answers: [['PAR Ciclo 5', 'Concluído'], ['PNAE, PNATE e PDDE', 'Todos em dia'], ['Alunos matriculados', '6.200']], desc: 'Queremos uma turma fechada para 25 técnicos sobre SIGPC Ágil e Fundeb 2027.' },
      { id: 'p6', data: '21/10', mun: 'Igarassu/PE', orgao: 'Prefeitura Municipal', resp: 'Ana Paula Souto', cargo: 'Secretária de Planejamento', tipo: 'Pré-diagnóstico', mods: ['Gestão', 'Educação', 'Saúde'], status: 'contato', cnpj: '••.•••.•••/0001-•• (validado)', cpf: '•••.418.239-••', email: 'planejamento@[municipio].gov.br', tel: '(81) 9••••-••91', urg: 'Obra parada', pop: '100 a 500 mil', answers: [['Obra ou convênio paralisado', 'Sim, 3 ou mais'], ['Diagnóstico do PAR', 'Não sei'], ['Plano Municipal de Saúde', 'Sim']], desc: 'Três convênios com obra parada e saldo em conta. Precisamos entender se ainda dá para reprogramar ou se teremos de devolver.' }
    ];
    PEDIDOS.forEach(p => { if (S.overrides[p.id]) p.status = S.overrides[p.id]; });

    const nav = [
      { id: 'visao', label: 'Visão geral', dot: '#E0A729', badge: '' },
      { id: 'pedidos', label: 'Pedidos', dot: '#39A9DB', badge: String(PEDIDOS.filter(p => p.status === 'novo').length) + ' novos' },
      { id: 'inscricoes', label: 'Inscrições', dot: '#EA6036', badge: '64' },
      { id: 'conteudo', label: 'Conteúdo do site', dot: '#40C965', badge: '' }
    ].map(n => ({ ...n, current: S.tab === n.id ? 'page' : 'false', go: () => set({ tab: n.id }),
      style: `min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 0 12px; border-radius: 12px; border: 0; cursor: pointer; text-align: left; font-size: 15px; font-weight: 600; color: #EDF0F4; background: ${S.tab === n.id ? 'rgba(237,240,244,.1)' : 'transparent'}; box-shadow: ${S.tab === n.id ? 'inset 0 0 0 1px rgba(237,240,244,.18)' : 'none'}` }));

    const TITLES = {
      visao: ['Visão geral', 'Como o site está gerando pedidos e inscrições para a equipe comercial.'],
      pedidos: ['Pedidos', 'Pré-diagnósticos, propostas e treinamentos in company enviados pelo site.'],
      inscricoes: ['Inscrições', 'Pré-inscrições dos encontros técnicos, com participantes e pagamento.'],
      conteudo: ['Conteúdo do site', 'Altere números, projetos, turmas, atas e depoimentos sem mexer no código.']
    };

    const periods = [['7d', '7 dias'], ['30d', '30 dias'], ['ano', '2026']].map(([id, label]) => ({ label, on: String(S.period === id), pick: () => set({ period: id }), style: chip(S.period === id) }));
    const K = { '7d': ['9', '17', 'R$ 11.500', '94%'], '30d': ['38', '64', 'R$ 41.500', '92%'], 'ano': ['312', '486', 'R$ 318.000', '89%'] }[S.period];
    const kpis = [
      { label: 'Pedidos de pré-diagnóstico', value: K[0], delta: '+12% sobre o período anterior', deltaColor: '#155A2B' },
      { label: 'Inscrições em encontros', value: K[1], delta: '+8% sobre o período anterior', deltaColor: '#155A2B' },
      { label: 'Valor previsto dos encontros', value: K[2], delta: 'Antes de isenções de clientes', deltaColor: '#4A586B' },
      { label: 'Respondidos em até 1 dia útil', value: K[3], delta: 'Meta: 90%', deltaColor: '#4A586B' }
    ];
    const bm = [['Educação', 17], ['Gestão', 14], ['Escola', 9], ['Saúde', 5]];
    const byModule = bm.map(([label, v]) => ({ label, value: v, color: MOD[label], tip: `${label}: ${v} pedidos`,
      bar: `display: block; height: 16px; width: ${v / 17 * 100}%; background: ${MOD[label]}; border-radius: 0 4px 4px 0` }));
    const wk = [3, 5, 4, 6, 4, 7, 5, 4];
    const weeks = wk.map((v, i) => ({ name: 'S' + (i + 36), label: i === wk.length - 1 ? String(v) : '', tip: `Semana ${i + 36}: ${v} pedidos`,
      bar: `display: block; width: 100%; max-width: 28px; height: ${v / 7 * 118}px; border-radius: 4px 4px 0 0; background: ${i === wk.length - 1 ? '#B07E10' : '#D9C08A'}` }));
    const TURMAS = [
      { id: 'gem-belem', cidade: 'Belém/PA', data: '29/10/2026', evento: 'Gestão Educacional Municipal 2026', inscritos: 28, vagas: 40, preco: 500, status: 'Confirmada' },
      { id: 'gem-salin', cidade: 'Salinópolis/PA', data: '06/11/2026', evento: 'Gestão Educacional Municipal 2026', inscritos: 19, vagas: 40, preco: 500, status: 'Em formação' },
      { id: 'jep-salin', cidade: 'Salinópolis/PA', data: '04 a 06/11/2026', evento: 'VIII Jornada de Excelência Pedagógica', inscritos: 17, vagas: 35, preco: 1000, status: 'Em formação' }
    ];
    const turmas = TURMAS.map(t => ({ ...t, bar: `height: 100%; width: ${t.inscritos / t.vagas * 100}%; background: #D9532B; border-radius: 0 4px 4px 0` }));
    const bu = [['Ceará', 9], ['Pará', 7], ['Rio Grande do Sul', 6], ['Maranhão', 5], ['Paraíba', 4], ['Pernambuco', 4]];
    const byUF = bu.map(([label, v]) => ({ label, value: v, bar: `display: block; height: 16px; width: ${v / 9 * 100}%; background: #B07E10; border-radius: 0 4px 4px 0` }));
    const open = id => () => set({ tab: 'pedidos', selId: id, status: 'todos' });
    const recent = PEDIDOS.slice(0, 4).map(p => ({ ...p, open: open(p.id), pill: pill(p.status), statusLabel: ST[p.status].label }));

    const counts = { todos: PEDIDOS.length };
    Object.keys(ST).forEach(k => { counts[k] = PEDIDOS.filter(p => p.status === k).length; });
    const statusChips = [['todos', 'Todos'], ...Object.keys(ST).map(k => [k, ST[k].label])].map(([id, label]) => ({ label, count: counts[id], on: String(S.status === id), pick: () => set({ status: id }), style: chip(S.status === id) }));
    const list = PEDIDOS.filter(p => S.status === 'todos' || p.status === S.status);
    const rows = list.map(p => ({ ...p, sel: String(p.id === S.selId), open: () => set({ selId: p.id }), pill: pill(p.status), statusLabel: ST[p.status].label,
      mods: p.mods.map(m => ({ label: m, color: MOD[m] })),
      rowStyle: `width: 100%; min-height: 64px; display: grid; grid-template-columns: 70px minmax(150px, 1.3fr) minmax(130px, 1fr) 150px 130px; gap: 12px; align-items: center; padding: 10px 14px; border: 0; border-top: 1px solid rgba(10,21,37,.1); border-radius: 12px; text-align: left; cursor: pointer; font-size: 14.5px; color: #0A1525; background: ${p.id === S.selId ? 'rgba(224,167,41,.16)' : 'transparent'}` }));
    const s0 = PEDIDOS.find(p => p.id === S.selId);
    const sel = s0 ? { ...s0,
      statusOpts: Object.keys(ST).map(k => ({ label: ST[k].label, on: String(s0.status === k), pick: () => set({ overrides: { ...S.overrides, [s0.id]: k } }),
        style: `min-height: 40px; padding: 0 12px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1.5px solid ${s0.status === k ? ST[k].bg : 'rgba(237,240,244,.2)'}; background: ${s0.status === k ? ST[k].bg : 'transparent'}; color: ${s0.status === k ? ST[k].fg : '#EDF0F4'}` })),
      facts: [{ k: 'Responsável', v: s0.resp }, { k: 'Cargo', v: s0.cargo }, { k: 'CPF', v: s0.cpf }, { k: 'CNPJ do órgão', v: s0.cnpj }, { k: 'E-mail', v: s0.email }, { k: 'WhatsApp', v: s0.tel }, { k: 'Urgência', v: s0.urg }, { k: 'População', v: s0.pop }],
      answers: s0.answers.map(([k, v]) => ({ k, v })) } : { statusOpts: [], facts: [], answers: [] };

    const tc = TURMAS.find(t => t.id === S.turma);
    const turmaChips = TURMAS.map(t => ({ label: `${t.cidade} · ${t.data}`, on: String(S.turma === t.id), pick: () => set({ turma: t.id }), style: chip(S.turma === t.id) }));
    const PS = ['Pré-inscrito', 'Validado', 'Pago'];
    const PSC = { 'Pré-inscrito': ['#E3E8EF', '#33404F'], 'Validado': ['#F7E7BF', '#5E450B'], 'Pago': ['#CFF2D9', '#155A2B'] };
    const BASE = [
      { id: 'a', nome: 'Luciana Ferreira', cpf: '•••.442.918-••', funcao: 'Dirigente Municipal de Educação', mun: 'Castanhal/PA', pagador: 'Prefeitura', status: 'Pago' },
      { id: 'b', nome: 'Rafael Monteiro', cpf: '•••.105.377-••', funcao: 'Técnico(a) Municipal do PAR', mun: 'Castanhal/PA', pagador: 'Prefeitura', status: 'Pago' },
      { id: 'c', nome: 'Juliana Costa', cpf: '•••.839.020-••', funcao: 'Técnico(a) Municipal do SIGPC', mun: 'Bragança/PA', pagador: 'Prefeitura', status: 'Validado' },
      { id: 'd', nome: 'Marcos Antônio Reis', cpf: '•••.661.473-••', funcao: 'Financeiro ou contabilidade', mun: 'Bragança/PA', pagador: 'Prefeitura', status: 'Validado' },
      { id: 'e', nome: 'Sílvia Rocha', cpf: '•••.270.585-••', funcao: 'Conselheiro(a) CACS-Fundeb', mun: 'Capanema/PA', pagador: 'Pessoa física', status: 'Pré-inscrito' },
      { id: 'f', nome: 'Edson Barros', cpf: '•••.318.006-••', funcao: 'Diretor(a) escolar', mun: 'Vigia/PA', pagador: 'Prefeitura', status: 'Pré-inscrito' }
    ];
    const people = BASE.map(p => {
      const st = S.peopleStatus[p.id] || p.status;
      const c = PSC[st];
      return { ...p, status: st, next: () => set({ peopleStatus: { ...S.peopleStatus, [p.id]: PS[(PS.indexOf(st) + 1) % PS.length] } }),
        pill: `min-height: 36px; padding: 0 12px; border-radius: 999px; border: 0; cursor: pointer; font-size: 12.5px; font-weight: 700; background: ${c[0]}; color: ${c[1]}` };
    });
    const pagos = people.filter(p => p.status === 'Pago').length;
    const brl = v => 'R$ ' + v.toLocaleString('pt-BR');
    const turmaKpis = [
      { label: 'Inscritos', value: `${tc.inscritos} / ${tc.vagas}` },
      { label: 'Valor previsto', value: brl(tc.inscritos * tc.preco) },
      { label: 'Pagos nesta lista', value: String(pagos) },
      { label: 'Situação da turma', value: tc.status }
    ];

    const ctabs = [['numeros', 'Números'], ['projetos', 'Projetos'], ['turmas', 'Turmas'], ['atas', 'Atas'], ['depo', 'Depoimentos']].map(([id, label]) => ({ label, on: String(S.ctab === id), pick: () => set({ ctab: id }),
      style: `min-height: 40px; padding: 0 16px; border-radius: 999px; border: 0; font-size: 14px; font-weight: 600; cursor: pointer; background: ${S.ctab === id ? '#0A1525' : 'transparent'}; color: ${S.ctab === id ? '#EDF0F4' : '#0A1525'}` }));
    const numeros = [['Recursos captados (texto do destaque)', 'R$ 2,5 bi'], ['Municípios atendidos', '500'], ['Estados', '18'], ['Técnicos capacitados', '15000'], ['Cursos realizados', '150'], ['Satisfação nos treinamentos (%)', '98']].map(([label, value]) => ({ label, value }));
    const projetos = [['Aquiraz/CE', 'R$ 2.254.852,64'], ['Monteiro/PB', 'R$ 1.624.843,94'], ['Anajatuba/MA', 'R$ 1.617.679,18'], ['Nova Mamoré/RO', 'R$ 1.380.194,14'], ['Cacoal/RO', 'R$ 1.310.815,36'], ['Pimenta Bueno/RO', 'R$ 1.304.173,00']].map(([mun, valor]) => ({ mun, valor, pago: '01/04/2024' }));
    const depos = [['LF', 'Luslarlene U. de Souza Fiametti', "Santa Luzia d'Oeste/RO", true], ['IF', 'Isabel Fonseca', 'Cachoeirinha/RS', true], ['DC', 'Dalva Maria de Carli', 'Santo Antônio da Patrulha/RS', true], ['GB', 'Gleíza Guerra de Assis Braga', 'Maracanaú/CE', true], ['AL', 'Alex Sandro Lima', 'Boa Viagem/CE', true], ['LC', 'Lenilda Campos', 'Frei Miguelinho/PE', false]].map(([ini, nome, mun, on]) => ({ ini, nome, mun, on }));
    const publishMsg = S.published ? 'Alterações publicadas. O site já mostra a versão nova.' : (S.dirty ? `${S.dirty} ${S.dirty > 1 ? 'alterações' : 'alteração'} aguardando publicação.` : 'Nenhuma alteração pendente. Última publicação: 26/10/2026 às 18:35.');

    return {
      nav, pageTitle: TITLES[S.tab][0], pageSub: TITLES[S.tab][1],
      isVisao: S.tab === 'visao', isPedidos: S.tab === 'pedidos', isInscricoes: S.tab === 'inscricoes', isConteudo: S.tab === 'conteudo',
      periods, kpis, byModule, weeks, turmas, byUF, recent, goPedidos: () => set({ tab: 'pedidos' }),
      statusChips, rows, noRows: rows.length === 0, sel, hasSel: !!s0, noSel: !s0,
      turmaChips, turmaKpis, people,
      ctabs, cNumeros: S.ctab === 'numeros', cProjetos: S.ctab === 'projetos', cTurmas: S.ctab === 'turmas', cAtas: S.ctab === 'atas', cDepo: S.ctab === 'depo',
      numeros, projetos, depos, publishMsg,
      markDirty: () => set({ dirty: S.dirty + 1, published: false }),
      publish: () => set({ dirty: 0, published: true })
    };
  }
}

  var tpl, app, comp, queued = false;
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  function draw() {
    queued = false;
    var key = comp.state.tab + '/' + comp.state.ctab, keep = [];
    if (draw.key === key) keep = [].map.call(app.querySelectorAll('main input:not([type=file]), main select'), function (f) { return f.type === 'checkbox' ? f.checked : f.value; });
    var frag = document.createDocumentFragment();
    renderNodes(tpl.content.childNodes, comp.renderVals(), frag);
    app.replaceChildren(frag);
    if (keep.length) [].forEach.call(app.querySelectorAll('main input:not([type=file]), main select'), function (f, i) {
      if (i < keep.length) { if (f.type === 'checkbox') f.checked = keep[i]; else f.value = keep[i]; }
    });
    draw.key = key;
  }
  function start() {
    tpl = document.getElementById('tpl'); app = document.getElementById('app');
    comp = new Component({}); draw();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
