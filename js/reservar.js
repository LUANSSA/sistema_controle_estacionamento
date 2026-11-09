const formulario = document.getElementById("form-reserva");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const dadosReserva = {
        placa: document.getElementById("placa").value,
        proprietario: document.getElementById("proprietario").value,
        apartamento: document.getElementById("apartamento").value,
        bloco: document.getElementById("bloco").value,
        modelo: document.getElementById("modelo").value,
        cor: document.getElementById("cor").value,
        vaga: document.getElementById("vaga").value
    };

    console.log("Dados da reserva:", dadosReserva);

    alert("Reserva cadastrada com sucesso!");
});
