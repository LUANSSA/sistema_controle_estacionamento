const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const btnEntrar = document.getElementById('btn-entrar');
const aviso = document.getElementById('aviso');

function esconderAviso() {
  aviso.hidden = true;
}

// Ao editar qualquer campo, o aviso de sucesso some
inputEmail.addEventListener('input', esconderAviso);
inputSenha.addEventListener('input', esconderAviso);

btnEntrar.addEventListener('click', () => {
  console.log({ email: inputEmail.value });
  aviso.hidden = false;
});


function redirecionar(){
  window.location.href = "./vagas_listagem.html"
}
