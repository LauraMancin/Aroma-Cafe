function abrirModal() {
    document.getElementById('modal').classList.add('ativo');
}

function fecharModal(){
    document.getElementById('modal').classList.remove('ativo');
}

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
})