// Função para buscar o usuário pelo email armazenado no localStorage
async function buscarUsuarioPorEmail() {
    const emailDoUsuario = localStorage.getItem("emailUsuario"); // Recupera o email do localStorage
    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    if (!emailDoUsuario) {
        throw new Error("Email não encontrado no localStorage");
    }

    const response = await fetch(`http://localhost:8080/usuario/${emailDoUsuario}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error("Usuário não encontrado");
    }

    return await response.json();
}

// Função para preencher o formulário com os dados do usuário
async function preencherFormulario() {
    try {
        const usuario = await buscarUsuarioPorEmail();
        document.getElementById("name").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
    } catch (error) {
        console.error(error.message);
        alert("Erro ao buscar usuário: " + error.message);
    }
}

// Chama a função para preencher o formulário quando a página carrega
window.onload = preencherFormulario;

// Função para editar o usuário
async function editarUsuarioHandler() {
    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const usuarioAtualizado = {
        nome,
        email,
        senha
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/usuario/${email}`, { // Usando o email para a edição
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuarioAtualizado),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Erro ${response.status}: ${errorResponse.message || 'Erro ao editar usuário'}`);
        }

        alert("Usuário atualizado com sucesso!");
        localStorage.setItem("emailUsuario", usuarioAtualizado.email); // Atualiza o email
        localStorage.setItem("nomeUsuario", usuarioAtualizado.nome);
        window.location.href = "/TelaEntrada/TelaTarefas/tarefas.html"; // Redirecionar para a tela de tarefas
    } catch (error) {
        console.error(error.message);
        alert("Erro ao editar usuário: " + error.message);
    }
}

// Adiciona um listener ao botão de edição
document.getElementById("editarButton").addEventListener("click", editarUsuarioHandler);


async function excluirUsuario() {
    const emailDoUsuario = localStorage.getItem("emailUsuario"); // Recupera o email do localStorage
    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    if (!emailDoUsuario) {
        alert("Email do usuário não encontrado.");
        return;
    }

    const confirmacao = confirm("Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
        try {
            const response = await fetch(`http://localhost:8080/usuario/excluirPorEmail/${emailDoUsuario}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Erro ${response.status}: ${errorResponse.message || 'Erro ao excluir usuário'}`);
            }

            alert("Usuário excluído com sucesso!");
            localStorage.removeItem("emailUsuario"); // Remove o email do localStorage
            localStorage.removeItem("token"); // Remove o token do localStorage
            window.location.href = "/TelaEntrada/telaEntrada.html"; // Redireciona para a tela de entrada

        } catch (error) {
            console.error(error.message);
            alert("Erro ao excluir usuário: " + error.message);
        }
    }
}
