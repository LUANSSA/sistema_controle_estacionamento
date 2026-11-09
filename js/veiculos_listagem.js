// Veículos cadastrados.
// vaga: número da vaga que o veículo ocupa ('' = sem vaga)
const VEICULOS = [
  { placa: 'ABC1D23', modelo: 'Honda Civic',     cor: 'Prata',    tipo: 'carro', nome: 'Marina Costa',   apto: '101 / A', vaga: '01' },
  { placa: 'QWE4R56', modelo: 'Fiat Argo',       cor: 'Vermelho', tipo: 'carro', nome: 'Carlos Mendes',  apto: '204 / B', vaga: '02' },
  { placa: 'RTY7U89', modelo: 'Toyota Corolla',  cor: 'Branco',   tipo: 'carro', nome: 'Fernanda Lima',  apto: '302 / A', vaga: '03' },
  { placa: 'JKL2M34', modelo: 'VW Nivus',        cor: 'Cinza',    tipo: 'carro', nome: 'Paulo Ribeiro',  apto: '405 / C', vaga: '04' },
  { placa: 'MNB5V67', modelo: 'Hyundai HB20',    cor: 'Azul',     tipo: 'carro', nome: 'Aline Souza',    apto: '110 / B', vaga: '05' },
  { placa: 'OPQ8S12', modelo: 'Honda CG 160',    cor: 'Preta',    tipo: 'moto',  nome: 'Renato Alves',   apto: '203 / A', vaga: '07' },
  { placa: 'TUV3W45', modelo: 'Chevrolet Onix',  cor: 'Preto',    tipo: 'carro', nome: 'Juliana Prado',  apto: '501 / C', vaga: '09' },
  { placa: 'XYZ9A87', modelo: 'Yamaha Fazer 250', cor: 'Azul',    tipo: 'moto',  nome: 'Bruno Teixeira', apto: '306 / B', vaga: '' },
  { placa: 'DEF6G54', modelo: 'Renault Kwid',    cor: 'Laranja',  tipo: 'carro', nome: 'Camila Rocha',   apto: '102 / C', vaga: '' }
];

const ICONE_CARRO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14l1-6-2-5H6l-2 5 1 6Z"></path><path d="M4 11h16M7 17v2M17 17v2"></path><circle cx="7.5" cy="14" r="1"></circle><circle cx="16.5" cy="14" r="1"></circle></svg>';
const ICONE_MOTO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="17" r="3"></circle><circle cx="18.5" cy="17" r="3"></circle><path d="M5.5 17 9 9h4l3 8M13 9l-1-3h-2M16 9h2"></path></svg>';

const totalCarros = VEICULOS.filter((v) => v.tipo === 'carro').length;
const totalMotos = VEICULOS.filter((v) => v.tipo === 'moto').length;

let filtroAtual = 'todos';
let termoBusca = '';

const FILTROS = [
  { id: 'todos',  label: 'Todos (' + VEICULOS.length + ')' },
  { id: 'carro',  label: 'Carros (' + totalCarros + ')' },
  { id: 'moto',   label: 'Motos (' + totalMotos + ')' }
];

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

function cardVeiculo(v) {
  const ehMoto = v.tipo === 'moto';
  const vaga = v.vaga
    ? '<span class="vaga-badge">Vaga ' + esc(v.vaga) + '</span>'
    : '<span class="vaga-badge vaga-badge--sem">Sem vaga</span>';

  return `
    <div class="veiculo">
      <div class="veiculo-cabecalho">
        <b class="veiculo-placa">${esc(v.placa)}</b>
        <span class="selo selo--${esc(v.tipo)}">${ehMoto ? 'Moto' : 'Carro'}</span>
      </div>
      <div class="veiculo-dados">
        <div class="veiculo-modelo">${ehMoto ? ICONE_MOTO : ICONE_CARRO}${esc(v.modelo)} <span>· ${esc(v.cor)}</span></div>
        <div class="veiculo-morador">${esc(v.nome)} <span>· Apto ${esc(v.apto)}</span></div>
      </div>
      <div class="veiculo-vaga">
        <span>Vaga utilizada</span>
        ${vaga}
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
      renderVeiculos();
    });
    elFiltros.appendChild(btn);
  });
}

function renderVeiculos() {
  const termo = termoBusca.trim().toLowerCase();

  const lista = VEICULOS.filter((v) => {
    if (filtroAtual !== 'todos' && v.tipo !== filtroAtual) return false;
    if (!termo) return true;
    return [v.placa, v.modelo, v.cor, v.nome, v.apto]
      .some((campo) => campo.toLowerCase().includes(termo));
  });

  elGrade.innerHTML = lista.length
    ? lista.map(cardVeiculo).join('')
    : '<div class="vazio">Nenhum veículo encontrado.</div>';
}

function renderResumo() {
  document.getElementById('stat-totais').textContent = VEICULOS.length;
  document.getElementById('stat-carros').textContent = totalCarros;
  document.getElementById('stat-motos').textContent = totalMotos;
}

elBusca.addEventListener('input', () => {
  termoBusca = elBusca.value;
  renderVeiculos();
});

renderResumo();
renderFiltros();
renderVeiculos();
