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

document.getElementById("estado").addEventListener("change", function() {
    
    let uf = this.value;
    let cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = "<option>Carregando...</option>";

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    
    .then(response => response.json())
    
    .then(cidades => {
        
        cidadeSelect.innerHTML = '<option value="">Selecione</option>';

        cidades.forEach(cidade => {
            let option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            cidadeSelect.appendChild(option);
        });

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