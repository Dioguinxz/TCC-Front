function inicializar() {
    verificarAutenticacao(); // Verifica se o usuário está autenticado
    atualizarBoasVindas();   // Atualiza a mensagem de boas-vindas
    buscarTarefasPorEmail(); // Busca as tarefas do usuário
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

// Modal logic
const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");

btnCadastrarTarefa.onclick = function() {
    modal.style.display = "block";
}

spanCloseModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para cadastrar a tarefa
document.getElementById("formCadastrarTarefa").onsubmit = async function(event) {
    event.preventDefault();

    const tarefaNome = document.getElementById("tarefaNome").value;
    const tarefaDescricao = document.getElementById("tarefaDescricao").value;
    const dataFinal = document.getElementById("dataFinal").value;

    const token = localStorage.getItem('token');
    const emailUsuario = localStorage.getItem('emailUsuario');

    const tarefa = {
        nome: tarefaNome,
        descricao: tarefaDescricao,
        dataFinal: dataFinal,
        concluida: false,
        emailUsuario: emailUsuario
    };

    try {
        const response = await fetch('http://localhost:8080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tarefa)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Tarefa cadastrada com sucesso!');
            modal.style.display = "none";
            document.getElementById("formCadastrarTarefa").reset();
        } else {
            alert('Erro ao cadastrar tarefa.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
};

// Função para buscar tarefas
async function buscarTarefasPorEmail() {
    const token = localStorage.getItem('token');
    const emailUsuario = localStorage.getItem('emailUsuario');

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

// Função para mostrar as tarefas
function mostrarTarefas(tarefas) {
    const cardTarefa = document.querySelector('.card-tarefa');
    cardTarefa.innerHTML = ''; // Limpa o conteúdo atual antes de adicionar as novas tarefas

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

// Certifique-se de que a função inicializar seja chamada ao carregar a página
window.onload = inicializar;
