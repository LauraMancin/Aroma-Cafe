function abrirModal() {
    document.getElementById('modal').classList.add('ativo');
}

function fecharModal(){
    document.getElementById('modal').classList.remove('ativo');
}


//fecha se o usuario clicar fora do popup
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
})