// Suas funções de inicialização
function inicializar() {
    verificarAutenticacao();
    atualizarBoasVindas();
    buscarTarefasPorEmail();
}

// Funções auxiliares
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

// Função de logout
function logoutHandler() {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('emailUsuario');
    window.location.href = '/TelaEntrada/telaEntrada.html';
}

// Modal e Manipulação de Tarefas
const modal = document.getElementById("modalCadastrarTarefa");
const btnCadastrarTarefa = document.getElementById("btnCadastrarTarefa");
const spanCloseModal = document.getElementById("closeModal");

// Abre o modal
btnCadastrarTarefa.onclick = function () {
    modal.style.display = "block";
}

// Fecha o modal
spanCloseModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Captura o evento de submit do formulário para cadastrar tarefa
document.getElementById("formCadastrarTarefa").onsubmit = async function (event) {
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

// Função para buscar tarefas por email
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

// Função para mostrar tarefas
function mostrarTarefas(tarefas) {
    const cardTarefa = document.querySelector('.card-tarefa');
    cardTarefa.innerHTML = '';

    tarefas.forEach(tarefa => {
        console.log(`ID da tarefa: ${tarefa.idString}`);
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'tarefa-item';
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

// Função para apagar a tarefa
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
            alert('Erro ao apagar tarefa. Verifique se a tarefa existe.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}
// document.getElementById("formEditarTarefa").onsubmit = async function (event) {
//     event.preventDefault();

//     const tarefaNome = document.getElementById("tarefaNomeEditar").value;
//     const tarefaDescricao = document.getElementById("tarefaDescricaoEditar").value;
//     const dataFinal = document.getElementById("dataFinalEditar").value;
//     const tarefaId = document.getElementById("formEditarTarefa").getAttribute('data-id', tarefa.idString);

//     const token = localStorage.getItem('token');
//     const emailUsuario = localStorage.getItem('emailUsuario');

//     const tarefaAtualizada = {
//         nome: tarefaNome,
//         descricao: tarefaDescricao,
//         dataFinal: dataFinal,
//         concluida: false, 
//         emailUsuario: emailUsuario
//     };

//     try {
//         const response = await fetch(`http://localhost:8080/tarefas/${tarefaId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(tarefaAtualizada)
//         });

//         if (response.ok) {
//             alert('Tarefa editada com sucesso!');
//             document.getElementById("modalEditarTarefa").style.display = "none";
//             buscarTarefasPorEmail();
//         } else {
//             alert('Erro ao editar tarefa.');
//         }
//     } catch (error) {
//         console.error('Erro ao conectar com o servidor:', error);
//         alert('Erro ao conectar com o servidor.');
//     }
// };

// // Função para abrir o modal de edição de tarefa e preencher os campos com os dados da tarefa
// function editarTarefa(id) {
//     const modalEditar = document.getElementById('modalEditarTarefa');
//     modalEditar.style.display = 'block';

//     // Buscar a tarefa pelo ID e preencher o modal com os dados dela
//     fetch(`http://localhost:8080/tarefas/${id}`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//     })
//     .then(response => response.json())
//     .then(tarefa => {
//         document.getElementById('tarefaNomeEditar').value = tarefa.nome;
//         document.getElementById('tarefaDescricaoEditar').value = tarefa.descricao;
//         document.getElementById('dataFinalEditar').value = tarefa.dataFinal;
//         document.getElementById('formEditarTarefa').setAttribute('data-id', tarefa.idString);
//     })
//     .catch(error => {
//         console.error('Erro ao buscar tarefa:', error);
//         alert('Erro ao carregar tarefa para edição.');
//     });
// }

// // Fechar o modal de edição
// document.getElementById('closeModalEditar').onclick = function () {
//     document.getElementById('modalEditarTarefa').style.display = 'none';
// }


// Chama a função de inicialização quando a página é carregada
window.onload = inicializar;
