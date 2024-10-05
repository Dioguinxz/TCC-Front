function inicializar() {
    verificarAutenticacao(); 
    atualizarBoasVindas();   
    buscarTarefasPorEmail(); 
}

function atualizarBoasVindas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const boasVindasElement = document.getElementById('boasVindas');
    boasVindasElement.textContent = nomeUsuario ? `Olá, ${nomeUsuario}` : 'Olá, visitante';
}

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/TelaEntrada/telaEntrada.html';
    } else {
        atualizarBoasVindas();
    }
}

function logoutHandler() {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('emailUsuario'); 
    window.location.href = '/TelaEntrada/telaEntrada.html';
}

// Modal logic
const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");

btnCadastrarTarefa.onclick = function () {
    modal.style.display = "block";
}

spanCloseModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById("formCadastrarTarefa").onsubmit = async function (event) {
    event.preventDefault(); // Previne o envio do formulário

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


            buscarTarefasPorEmail();
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
            mostrarTarefas(tarefas);
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
    cardTarefa.innerHTML = '';

    tarefas.forEach(tarefa => {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'tarefa-item';
        tarefaElement.innerHTML = `
     <h2>${tarefa.nome}</h2>
        <p><span class="bold">Descrição:</span> ${tarefa.descricao}</p>
        <p><span class="bold">Data Final:</span> ${tarefa.dataFinal}</p>
        <div class="pendentes">
            <p><span class="bold">Status:</span> ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
            <label class="checkbox-container">
                <input type="checkbox" class="custom-checkbox" onchange="atualizarStatus(${tarefa.id}, this.checked)" ${tarefa.concluida ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
        </div>
            <button class="btn-editar-tarefa" onclick="editarTarefa(${tarefa.id})">Editar</button>
            <button class="btn-apagar-tarefa" onclick="apagarTarefa(${tarefa.id})">Apagar</button>
            
            
        `;
        cardTarefa.appendChild(tarefaElement);
    });
}


async function apagarTarefa(id) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/tarefas/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert('Tarefa apagada com sucesso!');
        buscarTarefasPorEmail();
    } else {
        console.error('Erro ao apagar a tarefa:', response.statusText);
        alert('Erro ao apagar a tarefa.');
    }
}




window.onload = inicializar;
