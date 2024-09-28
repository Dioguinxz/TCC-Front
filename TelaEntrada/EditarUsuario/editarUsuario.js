async function editarUsuarioHandler() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuarioData = {
        nome: name,
        email: email,
        senha: password // Se não quiser mudar a senha, pode deixar vazio
    };

    const token = localStorage.getItem("token"); // Assume que você armazena o token no localStorage

    try {
        const response = await fetch("http://localhost:8080/usuario", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuarioData)
        });

        if (response.ok) {
            const usuarioAtualizado = await response.json();
            alert("Usuário atualizado com sucesso!");
            // Você pode redirecionar ou atualizar a UI conforme necessário
        } else {
            throw new Error("Erro ao atualizar usuário");
        }
    } catch (error) {
        alert(error.message);
    }
}
