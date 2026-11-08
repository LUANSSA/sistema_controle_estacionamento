// Formulário
const form = document.getElementById('form-residencia');
// Mensagem aviso
const avisoSucesso = document.getElementById('sucesso');

// Campos
const campos = {
  apto: document.getElementById('apto'),
  bloco: document.getElementById('bloco'),
  moradores: document.getElementById('moradores'),
  responsavel: document.getElementById('responsavel'),
  telefone: document.getElementById('telefone'),
  email: document.getElementById('email')
};

// Validadores
// Cada validador devolve a mensagem de erro, ou '' se o campo está válido
const validadores = {
  apto(valor) {
    if (!valor) return 'Informe o número do apartamento.';
    if (!/^\d{1,4}$/.test(valor)) return 'Use apenas números (até 4 dígitos).';
    return '';
  },
  bloco(valor) {
    return valor ? '' : 'Selecione o bloco.';
  },
  moradores(valor) {
    const n = Number(valor);
    if (!valor) return 'Informe o número de moradores.';
    if (!Number.isInteger(n) || n < 1 || n > 20) return 'Informe um valor entre 1 e 20.';
    return '';
  },
  responsavel(valor) {
    if (!valor) return 'Informe o nome do responsável.';
    if (valor.length < 3) return 'O nome deve ter ao menos 3 letras.';
    return '';
  },
  telefone(valor) {
    if (!valor) return ''; // opcional
    const digitos = valor.replace(/\D/g, '');
    return digitos.length === 10 || digitos.length === 11 ? '' : 'Telefone inválido. Use DDD + número.';
  },
  email(valor) {
    if (!valor) return ''; // opcional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ? '' : 'E-mail inválido.';
  }
};

// Função responsável por validar campos e exibir mensagens
function validarCampo(nome) {
  const input = campos[nome];
  const erro = validadores[nome](input.value.trim());
  const elErro = document.getElementById('erro-' + nome);

  elErro.textContent = erro;
  if (erro) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
  return erro === '';
}

// Máscara do telefone: (00) 00000-0000
function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

// Campo telefone
campos.telefone.addEventListener('input', () => {
  campos.telefone.value = mascararTelefone(campos.telefone.value);
});

// Apartamento aceita só dígitos
campos.apto.addEventListener('input', () => {
  campos.apto.value = campos.apto.value.replace(/\D/g, '');
});

// Valida ao sair do campo e revalida enquanto digita, se já estava com erro
Object.keys(campos).forEach((nome) => {
  const input = campos[nome];
  // Dispara um evento quando o elemento(campo) perde o foco.
  input.addEventListener('blur', () => validarCampo(nome));
  // Dispara um evento quando o valor de um elemento(campo) muda.
  input.addEventListener('input', () => {
    avisoSucesso.hidden = true;
    if (input.getAttribute('aria-invalid') === 'true') validarCampo(nome);
  });
});

// Envia o formulário
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  avisoSucesso.hidden = true;

  const nomes = Object.keys(campos);
  const invalidos = nomes.filter((nome) => !validarCampo(nome));

  if (invalidos.length > 0) {
    campos[invalidos[0]].focus();
    return;
  }

  // Objeto com todos os dados de residência
  const residencia = {
    apto: campos.apto.value.trim(),
    bloco: campos.bloco.value,
    moradores: Number(campos.moradores.value),
    responsavel: campos.responsavel.value.trim(),
    telefone: campos.telefone.value.trim(),
    email: campos.email.value.trim(),
    status: document.getElementById('status').value,
    observacoes: document.getElementById('observacoes').value.trim()
  };

  // Simulação: aqui entraria o envio para o servidor
  console.log(residencia);

  form.reset();
  nomes.forEach((nome) => {
    campos[nome].removeAttribute('aria-invalid');
    document.getElementById('erro-' + nome).textContent = '';
  });

  avisoSucesso.hidden = false;
  avisoSucesso.scrollIntoView({ block: 'nearest' });
});
