const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Remove classes ativas
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        // Ativa aba clicada
        tab.classList.add("active");

        // Mostra conteúdo correspondente
        const target = tab.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
    });
});

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

function sairDaConta() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../homePage_perfil/indexPerfil.html';
}