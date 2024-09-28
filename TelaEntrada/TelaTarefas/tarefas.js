function logoutHandler() {
    // Remove o token e o nome do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('emailUsuario'); // Remover o email do usuário

    // Redireciona o usuário para a página de entrada (login)
    window.location.href = '/TelaEntrada/telaEntrada.html';
}

// Função para atualizar a mensagem de boas-vindas
function atualizarBoasVindas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const boasVindasElement = document.getElementById('boasVindas');
    boasVindasElement.textContent = nomeUsuario ? `Olá, ${nomeUsuario}` : 'Olá, visitante';
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

// Função para cadastrar a tarefa
document.getElementById("formCadastrarTarefa").onsubmit = async function(event) {
    event.preventDefault(); // Previne o envio do formulário

    const tarefaNome = document.getElementById("tarefaNome").value;
    const tarefaDescricao = document.getElementById("tarefaDescricao").value;
    const dataFinal = document.getElementById("dataFinal").value;

    // Obtem o token e o usuarioId do localStorage
    const token = localStorage.getItem('token');
    const emailUsuario = localStorage.getItem('emailUsuario'); // email do usuário logado

    const tarefa = {
        nome: tarefaNome,
        descricao: tarefaDescricao,
        dataFinal: dataFinal,
        concluida: false, // Tarefa inicialmente não concluída
        emailUsuario: emailUsuario // ID do usuário logado
    };

    try {
        const response = await fetch('http://localhost:8080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token de autorização
            },
            body: JSON.stringify(tarefa) // Envia os dados da tarefa como JSON
        });

        if (response.ok) {
            const data = await response.json();
            alert('Tarefa cadastrada com sucesso!');

            // Fechar o modal após o cadastro
            modal.style.display = "none";

            // Limpar os campos do formulário
            document.getElementById("formCadastrarTarefa").reset();

            // Aqui você pode redirecionar ou atualizar a lista de tarefas, se necessário
        } else {
            alert('Erro ao cadastrar tarefa.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
};