
function inicializar() {
    verificarAutenticacao();
    buscarTarefasPorEmail();
}


function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/TelaEntrada/telaEntrada.html';
    } else {
        atualizarBoasVindas();
    }
}

function atualizarBoasVindas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const boasVindasElement = document.getElementById('boasVindas');
    boasVindasElement.textContent = nomeUsuario ? `Olá, ${nomeUsuario}` : 'Olá, visitante';
}

function logoutHandler() {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('emailUsuario');
    window.location.href = '/TelaEntrada/telaEntrada.html';
}


const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");


btnCadastrarTarefa.onclick = () => abrirModal(modal);
spanCloseModal.onclick = () => fecharModal(modal);


window.onclick = (event) => {
    if (event.target === modal) {
        fecharModal(modal);
    }
};


function abrirModal(modal) {
    modal.style.display = "block";
}


function fecharModal(modal) {
    modal.style.display = "none";
}


document.getElementById("formCadastrarTarefa").onsubmit = async function (event) {
    event.preventDefault();

    const tarefa = {
        nome: document.getElementById("tarefaNome").value,
        descricao: document.getElementById("tarefaDescricao").value,
        dataFinal: document.getElementById("dataFinal").value,
        concluida: false,
        emailUsuario: localStorage.getItem('emailUsuario')
    };

    try {
        const response = await fetch('http://localhost:8080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(tarefa)
        });

        if (response.ok) {
            alert('Tarefa cadastrada com sucesso!');
            fecharModal(modal);
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
        const response = await fetch(`http://localhost:8080/tarefas/buscarPorEmail/${emailUsuario}`, {
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
    }
}


function mostrarTarefas(tarefas) {
    const cardTarefa = document.querySelector('.card-tarefa');
    cardTarefa.innerHTML = '';

    tarefas.sort((a, b) => a.concluida - b.concluida);

    tarefas.forEach(tarefa => {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'tarefa-item';
        
        
        if (tarefa.concluida) {
            tarefaElement.classList.add('tarefa-concluida');
        }

        tarefaElement.innerHTML = `
            <h2>${tarefa.nome}</h2>
            <p><span class="bold">Descrição:</span> ${tarefa.descricao}</p>
            <p><span class="bold">Data Final:</span> ${tarefa.dataFinal}</p>
            <div class="pendentes">
                <p><span class="bold">Status:</span> ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
                <label class="checkbox-container">
                    <input type="checkbox" class="custom-checkbox" onchange="atualizarStatus('${tarefa.idString}', this.checked)" ${tarefa.concluida ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
            </div>
            <button class="btn-editar-tarefa" onclick="editarTarefa('${tarefa.idString}')">Editar</button>
            <button class="btn-apagar-tarefa" onclick="apagarTarefa('${tarefa.idString}')">Apagar</button>
        `;

        cardTarefa.appendChild(tarefaElement);
    });
}


async function apagarTarefa(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Usuário não autenticado. Por favor, faça login.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Tarefa apagada com sucesso!');
            buscarTarefasPorEmail();
        } else {
            alert('Erro ao apagar tarefa.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

document.getElementById("formEditarTarefa").onsubmit = async function (event) {
    event.preventDefault();

    const tarefaId = document.getElementById("formEditarTarefa").getAttribute('data-id');

    const tarefaAtualizada = {
        nome: document.getElementById("tarefaNomeEditar").value,
        descricao: document.getElementById("tarefaDescricaoEditar").value,
        dataFinal: document.getElementById("dataFinalEditar").value,
        concluida: false,
        emailUsuario: localStorage.getItem('emailUsuario')
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/tarefas/${tarefaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tarefaAtualizada)
        });

        if (response.ok) {
            alert('Tarefa editada com sucesso!');
            document.getElementById('modalEditarTarefa').style.display = 'none';
            buscarTarefasPorEmail();
        } else {
            alert('Erro ao editar tarefa.');
        }
    } catch (error) {
        console.error('Erro ao editar tarefa:', error);
        alert('Erro ao conectar com o servidor.');
    }
};


function editarTarefa(id) {
    const modalEditar = document.getElementById('modalEditarTarefa');
    modalEditar.style.display = 'block';

    fetch(`http://localhost:8080/tarefas/buscarPorId/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(async response => {
            if (response.ok) {
                const tarefa = await response.json();
                document.getElementById('tarefaNomeEditar').value = tarefa.nome;
                document.getElementById('tarefaDescricaoEditar').value = tarefa.descricao;
                document.getElementById('dataFinalEditar').value = tarefa.dataFinal;
                document.getElementById('formEditarTarefa').setAttribute('data-id', tarefa.idString);
            } else {
                throw new Error(`Erro ao buscar tarefa. Status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar tarefa:', error);
            alert('Erro ao carregar tarefa para edição.');
        });
}


document.getElementById('closeModalEditar').onclick = () => {
    document.getElementById('modalEditarTarefa').style.display = 'none';
};
        


async function atualizarStatus(id, concluida) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Usuário não autenticado. Por favor, faça login.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/tarefas/${id}/status?concluida=${concluida}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Status da tarefa atualizado com sucesso!');
            buscarTarefasPorEmail();
        } else {
            alert('Erro ao atualizar o status da tarefa.');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao conectar com o servidor.');
    }
}


    inicializar();
