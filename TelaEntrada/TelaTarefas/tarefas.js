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


