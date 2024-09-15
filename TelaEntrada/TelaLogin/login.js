class UsuarioService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async login(email, senha) {
        const usuario = { email, senha };
    
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('nomeUsuario', data.nome); // Armazena o nome do usuário
                window.location.href = '/TelaEntrada/TelaTarefas/tarefas.html';
            } else {
                alert('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão.');
        }
    }
    
}

function loginHandler() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    const usuarioService = new UsuarioService('http://localhost:8080');
    usuarioService.login(email, senha);
}