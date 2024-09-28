function atualizarBoasVindas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const boasVindasElement = document.getElementById('boasVindas');
    if (nomeUsuario) {
        boasVindasElement.textContent = `Olá, ${nomeUsuario}`;
    } else {
        boasVindasElement.textContent = 'Olá, visitante';
    }
}

function inicializar() {
    atualizarBoasVindas();
}

window.onload = inicializar;


