
// Dados do estacionamento
// Estes valores espelham a listagem de vagas (12 vagas; 7 já ocupadas).
const TODAS_VAGAS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const VAGAS_OCUPADAS = ['01', '02', '03', '04', '05', '07', '09'];

// Elementos da página
const form = document.getElementById('form-reserva');

// Campos do formulário
const campos = {
  placa: document.getElementById('placa'),
  proprietario: document.getElementById('proprietario'),
  apartamento: document.getElementById('apartamento'),
  bloco: document.getElementById('bloco'),
  modelo: document.getElementById('modelo'),
  cor: document.getElementById('cor'),
  vaga: document.getElementById('vaga')
};

// Modal que exibe reserva
const modal = document.getElementById('modal-reserva');

// Vagas livres
function vagasLivres() {
  return TODAS_VAGAS.filter((v) => !VAGAS_OCUPADAS.includes(v));
}

function renderVagas() {
  const livres = vagasLivres();
  const select = campos.vaga;
  const dica = document.getElementById('dica-vaga');

  select.innerHTML = '';
  const primeira = document.createElement('option');
  primeira.value = '';
  primeira.selected = true;
  primeira.disabled = true;
  primeira.textContent = livres.length ? 'Selecione a vaga' : 'Nenhuma vaga livre';
  select.appendChild(primeira);

  livres.forEach((v) => {
    const opcao = document.createElement('option');
    opcao.value = v;
    opcao.textContent = 'Vaga ' + v;
    select.appendChild(opcao);
  });

  select.disabled = livres.length === 0;
  dica.textContent = livres.length === 0
    ? 'Todas as vagas estão ocupadas.'
    : livres.length === 1 ? '1 vaga livre.' : livres.length + ' vagas livres.';
}

// Validação
const validadores = {
  placa(valor) {
    if (!valor) return 'Informe a placa do veículo.';
    if (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(valor)) return 'Placa inválida. Ex.: ABC1D23 ou ABC1234.';
    return '';
  },
  proprietario(valor) {
    if (!valor) return 'Informe o nome do proprietário.';
    if (valor.length < 3) return 'O nome deve ter ao menos 3 letras.';
    return '';
  },
  apartamento(valor) {
    if (!valor) return 'Informe o número do apartamento.';
    if (!/^\d{1,4}$/.test(valor)) return 'Use apenas números (até 4 dígitos).';
    return '';
  },
  bloco(valor) {
    return valor ? '' : 'Selecione o bloco.';
  },
  modelo(valor) {
    if (!valor) return 'Informe o modelo do veículo.';
    if (valor.length < 2) return 'O modelo deve ter ao menos 2 letras.';
    return '';
  },
  cor(valor) {
    if (!valor) return 'Informe a cor do veículo.';
    if (valor.length < 3) return 'A cor deve ter ao menos 3 letras.';
    return '';
  },
  vaga(valor) {
    if (!valor) return vagasLivres().length ? 'Selecione a vaga.' : 'Não há vagas livres.';
    return '';
  }
};

function validarCampo(nome) {
  const input = campos[nome];
  const erro = validadores[nome](input.value.trim());
  document.getElementById('erro-' + nome).textContent = erro;

  if (erro) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
  return erro === '';
}

// Placa sempre em maiúsculas e sem símbolos; apartamento só com dígitos
campos.placa.addEventListener('input', () => {
  campos.placa.value = campos.placa.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

campos.apartamento.addEventListener('input', () => {
  campos.apartamento.value = campos.apartamento.value.replace(/\D/g, '');
});

// Valida ao sair do campo e revalida enquanto digita, se já estava com erro
Object.keys(campos).forEach((nome) => {
  const input = campos[nome];
  input.addEventListener('blur', () => validarCampo(nome));
  ['input', 'change'].forEach((evento) => {
    input.addEventListener(evento, () => {
      if (input.getAttribute('aria-invalid') === 'true') validarCampo(nome);
    });
  });
});

// Modal de confirmação
function formatarData(data) {
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function preencherModal(r) {
  document.getElementById('m-data').textContent = formatarData(r.data);
  document.getElementById('m-vaga').textContent = 'Vaga ' + r.vaga;
  document.getElementById('m-placa').textContent = r.placa;
  document.getElementById('m-veiculo').textContent = r.modelo + ' · ' + r.cor;
  document.getElementById('m-proprietario').textContent = r.proprietario;
  document.getElementById('m-residencia').textContent = 'Apto ' + r.apartamento + ' · Bloco ' + r.bloco;
}

function limparFormulario() {
  form.reset();
  Object.keys(campos).forEach((nome) => {
    campos[nome].removeAttribute('aria-invalid');
    document.getElementById('erro-' + nome).textContent = '';
  });
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const invalidos = Object.keys(campos).filter((nome) => !validarCampo(nome));

  if (invalidos.length > 0) {
    campos[invalidos[0]].focus();
    return;
  }

  const reserva = {
    data: new Date(),
    placa: campos.placa.value.trim(),
    proprietario: campos.proprietario.value.trim(),
    apartamento: campos.apartamento.value.trim(),
    bloco: campos.bloco.value,
    modelo: campos.modelo.value.trim(),
    cor: campos.cor.value.trim(),
    vaga: campos.vaga.value
  };

  preencherModal(reserva);
  modal.showModal();
});

// Ao fechar o modal (botão, Esc ou clique fora) o formulário é limpo
modal.addEventListener('close', () => {
  limparFormulario();
  campos.placa.focus();
});

document.getElementById('modal-fechar').addEventListener('click', () => modal.close());

modal.addEventListener('click', (evento) => {
  if (evento.target === modal) modal.close();
});

// Início
renderVagas();
