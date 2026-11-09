// Residências cadastradas.
// veiculos: lista de { placa, vaga } — vaga '' = veículo sem vaga
const RESIDENCIAS = [
  { apto: '101', bloco: 'A', responsavel: 'Marina Costa',   moradores: 3, veiculos: [{ placa: 'ABC1D23', vaga: '01' }] },
  { apto: '102', bloco: 'C', responsavel: 'Camila Rocha',   moradores: 2, veiculos: [{ placa: 'DEF6G54', vaga: '' }] },
  { apto: '103', bloco: 'A', responsavel: 'Helena Duarte',  moradores: 1, veiculos: [] },
  { apto: '110', bloco: 'B', responsavel: 'Aline Souza',    moradores: 2, veiculos: [{ placa: 'MNB5V67', vaga: '05' }] },
  { apto: '201', bloco: 'B', responsavel: 'Patrícia Gomes', moradores: 4, veiculos: [] },
  { apto: '203', bloco: 'A', responsavel: 'Renato Alves',   moradores: 1, veiculos: [{ placa: 'OPQ8S12', vaga: '07' }] },
  { apto: '204', bloco: 'B', responsavel: 'Carlos Mendes',  moradores: 3, veiculos: [{ placa: 'QWE4R56', vaga: '02' }] },
  { apto: '302', bloco: 'A', responsavel: 'Fernanda Lima',  moradores: 2, veiculos: [{ placa: 'RTY7U89', vaga: '03' }] },
  { apto: '306', bloco: 'B', responsavel: 'Bruno Teixeira', moradores: 1, veiculos: [{ placa: 'XYZ9A87', vaga: '' }] },
  { apto: '404', bloco: 'C', responsavel: 'Lucas Martins',  moradores: 2, veiculos: [] },
  { apto: '405', bloco: 'C', responsavel: 'Paulo Ribeiro',  moradores: 4, veiculos: [{ placa: 'JKL2M34', vaga: '04' }] },
  { apto: '501', bloco: 'C', responsavel: 'Juliana Prado',  moradores: 2, veiculos: [{ placa: 'TUV3W45', vaga: '09' }] }
];

const ICONE_PESSOA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>';

const BLOCOS = [...new Set(RESIDENCIAS.map((r) => r.bloco))].sort();

const totalMoradores = RESIDENCIAS.reduce((soma, r) => soma + r.moradores, 0);
const totalVeiculos = RESIDENCIAS.reduce((soma, r) => soma + r.veiculos.length, 0);

let filtroAtual = 'todas';
let termoBusca = '';

const FILTROS = [{ id: 'todas', label: 'Todas (' + RESIDENCIAS.length + ')' }].concat(
  BLOCOS.map((b) => ({
    id: b,
    label: 'Bloco ' + b + ' (' + RESIDENCIAS.filter((r) => r.bloco === b).length + ')'
  }))
);

const elFiltros = document.getElementById('filtros');
const elGrade = document.getElementById('grade');
const elBusca = document.getElementById('busca');

// Evita que dados com caracteres especiais quebrem o HTML
function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Selo do rodapé: vagas usadas, veículo sem vaga ou nenhum veículo
function badgeVaga(r) {
  if (r.veiculos.length === 0) {
    return '<span class="vaga-badge vaga-badge--nenhum">Sem veículo</span>';
  }
  const vagas = r.veiculos.map((v) => v.vaga).filter(Boolean);
  if (vagas.length === 0) {
    return '<span class="vaga-badge vaga-badge--sem">Sem vaga</span>';
  }
  const rotulo = vagas.length > 1 ? 'Vagas ' : 'Vaga ';
  return '<span class="vaga-badge">' + rotulo + esc(vagas.join(', ')) + '</span>';
}

function cardResidencia(r) {
  const placas = r.veiculos.length
    ? '<span class="residencia-placas">' + esc(r.veiculos.map((v) => v.placa).join(' · ')) + '</span>'
    : '<span class="residencia-placas residencia-placas--vazio">Nenhum veículo</span>';

  return `
    <div class="residencia">
      <div class="residencia-cabecalho">
        <b class="residencia-apto">Apto ${esc(r.apto)}</b>
        <span class="selo selo--bloco">Bloco ${esc(r.bloco)}</span>
      </div>
      <div class="residencia-dados">
        <div class="residencia-responsavel">${ICONE_PESSOA}${esc(r.responsavel)}</div>
        <div class="residencia-moradores">${r.moradores} ${r.moradores === 1 ? 'morador' : 'moradores'}</div>
      </div>
      <div class="residencia-rodape">
        ${placas}
        ${badgeVaga(r)}
      </div>
    </div>`;
}

function renderFiltros() {
  elFiltros.innerHTML = '';
  FILTROS.forEach((f) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = f.label;
    btn.setAttribute('aria-pressed', filtroAtual === f.id ? 'true' : 'false');
    btn.addEventListener('click', () => {
      filtroAtual = f.id;
      renderFiltros();
      renderResidencias();
    });
    elFiltros.appendChild(btn);
  });
}

function renderResidencias() {
  const termo = termoBusca.trim().toLowerCase();

  const lista = RESIDENCIAS.filter((r) => {
    if (filtroAtual !== 'todas' && r.bloco !== filtroAtual) return false;
    if (!termo) return true;
    const placas = r.veiculos.map((v) => v.placa).join(' ');
    return [r.apto, r.bloco, r.responsavel, placas]
      .some((campo) => campo.toLowerCase().includes(termo));
  });

  elGrade.innerHTML = lista.length
    ? lista.map(cardResidencia).join('')
    : '<div class="vazio">Nenhuma residência encontrada.</div>';
}

function renderResumo() {
  document.getElementById('stat-residencias').textContent = RESIDENCIAS.length;
  document.getElementById('stat-moradores').textContent = totalMoradores;
  document.getElementById('stat-veiculos').textContent = totalVeiculos;
}

elBusca.addEventListener('input', () => {
  termoBusca = elBusca.value;
  renderResidencias();
});

renderResumo();
renderFiltros();
renderResidencias();
