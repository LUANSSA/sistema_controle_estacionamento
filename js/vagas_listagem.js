// Dados das vagas ocupadas: número -> [placa, nome, apartamento]
const OCUPADAS = {
  1: ['ABC1D23', 'Marina Costa', '101 / A'],
  2: ['QWE4R56', 'Carlos Mendes', '204 / B'],
  3: ['RTY7U89', 'Fernanda Lima', '302 / A'],
  4: ['JKL2M34', 'Paulo Ribeiro', '405 / C'],
  5: ['MNB5V67', 'Aline Souza', '110 / B'],
  7: ['OPQ8S12', 'Renato Alves', '203 / A'],
  9: ['TUV3W45', 'Juliana Prado', '501 / C']
};

const TOTAL_VAGAS = 12;

// Monta a lista completa de vagas
const vagas = [];
for (let i = 1; i <= TOTAL_VAGAS; i++) {
  const d = OCUPADAS[i];
  vagas.push({
    n: String(i).padStart(2, '0'),
    ocupada: Boolean(d),
    placa: d ? d[0] : '',
    nome: d ? d[1] : '',
    apto: d ? d[2] : ''
  });
}

const totalOcupadas = vagas.filter((v) => v.ocupada).length;
const totalLivres = vagas.length - totalOcupadas;

let filtroAtual = 'todas';

const FILTROS = [
  { id: 'todas', label: 'Todas (' + vagas.length + ')' },
  { id: 'livres', label: 'Livres (' + totalLivres + ')' },
  { id: 'ocupadas', label: 'Ocupadas (' + totalOcupadas + ')' }
];

const elFiltros = document.getElementById('filtros');
const elGrade = document.getElementById('grade');

function cardOcupada(v) {
  return `
    <div class="vaga vaga--ocupada">
      <div class="vaga-cabecalho">
        <b class="vaga-numero">Vaga ${v.n}</b>
        <span class="selo">Ocupada</span>
      </div>
      <div class="vaga-dados">
        <div class="vaga-placa">${v.placa}</div>
        <div class="vaga-morador">${v.nome} <span>· Apto ${v.apto}</span></div>
      </div>
    </div>`;
}

function cardLivre(v) {
  return `
    <div class="vaga vaga--livre">
      <div class="vaga-cabecalho">
        <b class="vaga-numero">Vaga ${v.n}</b>
        <span class="selo">Livre</span>
      </div>
      <div class="vaga-disponivel">Disponível para reserva</div>
      <a href="Main.dc.html" class="vaga-reservar">Reservar esta vaga</a>
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
      renderVagas();
    });
    elFiltros.appendChild(btn);
  });
}

function renderVagas() {
  let lista = vagas;
  if (filtroAtual === 'livres') lista = vagas.filter((v) => !v.ocupada);
  if (filtroAtual === 'ocupadas') lista = vagas.filter((v) => v.ocupada);
  elGrade.innerHTML = lista.map((v) => (v.ocupada ? cardOcupada(v) : cardLivre(v))).join('');
}

function renderResumo() {
  document.getElementById('stat-totais').textContent = vagas.length;
  document.getElementById('stat-ocupadas').textContent = totalOcupadas;
  document.getElementById('stat-livres').textContent = totalLivres;
}

renderResumo();
renderFiltros();
renderVagas();
