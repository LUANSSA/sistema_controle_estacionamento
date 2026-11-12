
// Formulário
const form = document.getElementById("form-vaga");


// Envio do formulário
form.addEventListener("submit", async (evento) =>{
    // cancela envio
    evento.preventDefault();

    // Campos do formulário
    const campos = {
        id: document.getElementById("numero").value,
        bloco: document.getElementById("bloco").value,
        andar: document.getElementById("andar").value,
        tipo: document.getElementById("tipo").value,
        localizacao: document.getElementById("localizacao").value,
        status: document.getElementById("status").value,
        observacoes: document.getElementById("observacoes").value 
    }

    try {
        // Insere vaga
        const resposta = await inserirVaga(campos);
        alert("Cadastro realizado com sucesso!");

        const listagem = await listarVaga();
        console.log(listagem);
        
        // window.location.href = "listagem_vaga.html";

    } catch (error) {
        // Mensagem de erro
        console.error("Erro ao cadastrar vaga:", erro);
        alert("Não foi possível cadastrar a vaga.");

    }

})
