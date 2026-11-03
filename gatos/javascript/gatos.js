const gatos = document.querySelectorAll('.gatos')

let gatosInformacoes = []

gatos.forEach((gato, index) => {
    gato.addEventListener('click', () => {
        gatosInformacoes.push(index)

        localStorage.setItem('gatos', JSON.stringify(gatosInformacoes))   
    })
})