const API_URL = "https://6af1439411a6aa866e80154a.mockapi.io/estacionamento/api/v1/vagas";


// Inserir
async function inserirVaga(novaVaga) {
    
    // Insere
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaVaga)
    });

    // Retorna resposta
    return await resposta.json();
}

// Listar
async function listarVaga() {
    
    // Consulta
    const resposta = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    // Retornar respsota
    return await resposta.json();
}