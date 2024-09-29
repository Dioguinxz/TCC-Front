
function inicializar() {
    verificarAutenticacao(); // Verifica se o usuário está autenticado
    atualizarBoasVindas();
    buscarTarefas();
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
        // Se não houver token, redireciona para a página de entrada
        window.location.href = '/TelaEntrada/telaEntrada.html';
    } else {
        atualizarBoasVindas(); // Atualiza a mensagem de boas-vindas se o usuário estiver autenticado
    }
}

function logoutHandler() {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('emailUsuario'); // Remover o email do usuário
    window.location.href = '/TelaEntrada/telaEntrada.html';
}

// Certifique-se de que a função inicializar seja sempre chamada quando a página carregar
window.onload = inicializar;



// document.getElementById('logoutButton').onclick = logoutHandler;

// Chama a função inicializar quando a página é carregada
window.onload = inicializar;

// Obtendo elementos do DOM
const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");

// Quando o usuário clicar no botão, abre o modal
btnCadastrarTarefa.onclick = function() {
    btnCadastrarTarefa.onclick = function() {
        console.log("Botão clicado! Abrindo o modal.");
        modal.style.display = "block";
    }
    
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
async function buscarTarefasPorEmail() {
    const token = localStorage.getItem('token');
    const emailUsuario = localStorage.getItem('emailUsuario'); // Obtendo o email do localStorage

    if (!emailUsuario) {
        alert('Email do usuário não encontrado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/tarefas/${emailUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tarefas = await response.json();
            mostrarTarefas(tarefas); // Chama a função que mostra as tarefas
        } else {
            alert('Erro ao carregar tarefas.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão.');
    }
}

function mostrarTarefas(tarefas) {
    const cardTarefa = document.querySelector('.card-tarefa');

    // Limpa o conteúdo atual da card-tarefa antes de adicionar as novas tarefas
    cardTarefa.innerHTML = `
        <div class="nome-tarefa">
            <h3>Tarefas</h3>
        </div>
    `; // Reset the card-tarefa's HTML

    tarefas.forEach(tarefa => {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'tarefa-item';
        tarefaElement.innerHTML = `
            <h4>${tarefa.nome}</h4>
            <p>${tarefa.descricao}</p>
            <p>Data Final: ${tarefa.dataFinal}</p>
            <p>Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
        `;
        cardTarefa.appendChild(tarefaElement);
    });
}

// Certifique-se de chamar a função ao carregar a página ou em um momento apropriado
window.onload = buscarTarefasPorEmail;
