// ---------- Utilidades ----------

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Mostra ou limpa a mensagem de erro de um campo
function marcarErro(input, mensagem) {
  const elErro = document.getElementById('erro-' + input.id);
  elErro.textContent = mensagem;
  if (mensagem) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
  return mensagem === '';
}

// Liga validação ao sair do campo e revalidação enquanto digita (se já havia erro)
function ligarValidacao(campos, aviso) {
  campos.forEach(({ input, validar }) => {
    input.addEventListener('blur', () => marcarErro(input, validar(input.value)));
    input.addEventListener('input', () => {
      aviso.hidden = true;
      if (input.getAttribute('aria-invalid') === 'true') {
        marcarErro(input, validar(input.value));
      }
    });
  });
}

// Valida todos; devolve true se estiver tudo certo e foca o primeiro inválido
function validarTodos(campos) {
  const invalidos = campos.filter(({ input, validar }) => !marcarErro(input, validar(input.value)));
  if (invalidos.length > 0) {
    invalidos[0].input.focus();
    return false;
  }
  return true;
}

// ---------- Dados do perfil ----------

const formPerfil = document.getElementById('form-perfil');
const sucessoPerfil = document.getElementById('sucesso-perfil');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');

const camposPerfil = [
  {
    input: inputNome,
    validar: (v) => {
      v = v.trim();
      if (!v) return 'Informe seu nome.';
      if (v.length < 3) return 'O nome deve ter ao menos 3 letras.';
      return '';
    }
  },
  {
    input: inputEmail,
    validar: (v) => {
      v = v.trim();
      if (!v) return 'Informe seu e-mail.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'E-mail inválido.';
    }
  },
  {
    input: inputTelefone,
    validar: (v) => {
      if (!v.trim()) return ''; // opcional
      const digitos = v.replace(/\D/g, '');
      return digitos.length === 10 || digitos.length === 11 ? '' : 'Telefone inválido. Use DDD + número.';
    }
  }
];

// Máscara do telefone: (00) 00000-0000
function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

inputTelefone.addEventListener('input', () => {
  inputTelefone.value = mascararTelefone(inputTelefone.value);
});

ligarValidacao(camposPerfil, sucessoPerfil);

formPerfil.addEventListener('submit', (evento) => {
  evento.preventDefault();
  sucessoPerfil.hidden = true;

  if (!validarTodos(camposPerfil)) return;

  const perfil = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    telefone: inputTelefone.value.trim()
  };

  // Simulação: aqui entraria o envio para o servidor
  console.log(perfil);

  // Atualiza o avatar e o nome mostrados no menu e no cabeçalho do cartão
  const sigla = iniciais(perfil.nome);
  document.getElementById('menu-avatar').textContent = sigla;
  document.getElementById('menu-nome').textContent = perfil.nome;
  document.getElementById('perfil-avatar').textContent = sigla;

  sucessoPerfil.hidden = false;
});

// ---------- Alterar senha ----------

const formSenha = document.getElementById('form-senha');
const sucessoSenha = document.getElementById('sucesso-senha');
const inputAtual = document.getElementById('senha-atual');
const inputNova = document.getElementById('senha-nova');
const inputConfirma = document.getElementById('senha-confirma');

const camposSenha = [
  {
    input: inputAtual,
    validar: (v) => (v ? '' : 'Informe sua senha atual.')
  },
  {
    input: inputNova,
    validar: (v) => {
      if (!v) return 'Informe a nova senha.';
      if (v.length < 8) return 'A senha deve ter ao menos 8 caracteres.';
      if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use letras e números na senha.';
      if (v === inputAtual.value) return 'A nova senha deve ser diferente da atual.';
      return '';
    }
  },
  {
    input: inputConfirma,
    validar: (v) => {
      if (!v) return 'Confirme a nova senha.';
      return v === inputNova.value ? '' : 'As senhas não conferem.';
    }
  }
];

ligarValidacao(camposSenha, sucessoSenha);

// Alterar a nova senha também revalida a confirmação, se ela já foi preenchida
inputNova.addEventListener('input', () => {
  if (inputConfirma.value) {
    marcarErro(inputConfirma, inputConfirma.value === inputNova.value ? '' : 'As senhas não conferem.');
  }
});

// Indicador de força da senha
const barraForca = document.getElementById('forca-barra');
const textoForca = document.getElementById('forca-texto');

function calcularForca(senha) {
  if (!senha) return 0;
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  return Math.min(pontos, 4); // 0 a 4
}

const NIVEIS = [
  { texto: '—', classe: '' },
  { texto: 'fraca', classe: 'forca-barra--fraca' },
  { texto: 'média', classe: 'forca-barra--media' },
  { texto: 'boa', classe: 'forca-barra--boa' },
  { texto: 'forte', classe: 'forca-barra--forte' }
];

function atualizarForca() {
  const nivel = calcularForca(inputNova.value);
  barraForca.className = 'forca-barra ' + NIVEIS[nivel].classe;
  barraForca.style.width = (nivel * 25) + '%';
  textoForca.textContent = 'Força da senha: ' + NIVEIS[nivel].texto;
}

inputNova.addEventListener('input', atualizarForca);

// Botões "Mostrar / Ocultar" de cada campo de senha
document.querySelectorAll('.mostrar-senha').forEach((botao) => {
  botao.addEventListener('click', () => {
    const input = document.getElementById(botao.dataset.alvo);
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    botao.textContent = mostrar ? 'Ocultar' : 'Mostrar';
    botao.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
    botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
  });
});

formSenha.addEventListener('submit', (evento) => {
  evento.preventDefault();
  sucessoSenha.hidden = true;

  if (!validarTodos(camposSenha)) return;

  // Simulação: aqui entraria o envio para o servidor (nunca registrar senhas no console)
  formSenha.reset();
  camposSenha.forEach(({ input }) => {
    input.type = 'password';
    marcarErro(input, '');
  });
  document.querySelectorAll('.mostrar-senha').forEach((botao) => {
    botao.textContent = 'Mostrar';
    botao.setAttribute('aria-pressed', 'false');
    botao.setAttribute('aria-label', 'Mostrar senha');
  });
  atualizarForca();

  sucessoSenha.hidden = false;
});
