function logoutHandler() {
    // Remove o token e o nome do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');

    // Redireciona o usuário para a página de entrada (login)
    window.location.href = '/TelaEntrada/telaEntrada.html';
}

// Função para atualizar a mensagem de boas-vindas
function atualizarBoasVindas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const boasVindasElement = document.getElementById('boasVindas');
    if (nomeUsuario) {
        boasVindasElement.textContent = `Olá, ${nomeUsuario}`;
    } else {
        boasVindasElement.textContent = 'Olá, visitante';
    }
}

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, redirecione para a página de entrada
        window.location.href = '/TelaEntrada/telaEntrada.html';
    }
}

function inicializar() {
    verificarAutenticacao(); // Verifica se o usuário está autenticado
    atualizarBoasVindas();
}

// Adiciona um evento de clique ao botão de logout
document.getElementById('logoutButton').onclick = logoutHandler;

// Chama a função inicializar quando a página é carregada
window.onload = inicializar;


// Obtendo elementos do DOM
const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");

// Quando o usuário clicar no botão, abre o modal
btnCadastrarTarefa.onclick = function() {
    modal.style.display = "block";
}

// Quando o usuário clicar no 'X', fecha o modal
spanCloseModal.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clicar em qualquer lugar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Adicionando a lógica de cadastro da tarefa (opcional)
document.getElementById("formCadastrarTarefa").onsubmit = function(event) {
    event.preventDefault(); // Previne o envio do formulário

    const tarefaNome = document.getElementById("tarefaNome").value;
    const tarefaDescricao = document.getElementById("tarefaDescricao").value;
    const dataFinal = document.getElementById("dataFinal").value;

    // Aqui você pode adicionar a lógica para enviar os dados para o backend ou armazená-los

    console.log("Tarefa Cadastrada:", {
        tarefaNome,
        tarefaDescricao,
        dataFinal
    });

    // Fechar o modal após o cadastro
    modal.style.display = "none";
    
    // Limpar os campos do formulário
    document.getElementById("formCadastrarTarefa").reset();
}
