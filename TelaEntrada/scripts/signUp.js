class UsuarioService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async criarConta(nome, email, senha) {
        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                alert('Conta criada com sucesso!');
                window.location.href = '../TelaLogin/login.html'; 
            } else if (response.status === 409) {
                alert('Este email já está registrado.');
            } else {
                alert('Erro ao criar conta.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão.');
        }
    }
}

function criarContaHandler() {
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    const usuarioService = new UsuarioService('http://localhost:8080');
    usuarioService.criarConta(nome, email, senha);
}