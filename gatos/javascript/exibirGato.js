const fotoGato = document.getElementById('fotoGato')
const nomeGato = document.getElementById('nomeGato')

const iconeSexo = document.getElementById('iconeSexo')
const sexoGato = document.getElementById('sexoGato')

const iconeRaca = document.getElementById('iconeRaca')
const racaGato = document.getElementById('racaGato')

const iconePelagem = document.getElementById('iconePelagem')
const tipoPelagem = document.getElementById('tipoPelagem')

const iconeOlhos = document.getElementById('iconeOlhos')
const corOlhos = document.getElementById('corOlhos')

const iconeNascimento = document.getElementById('iconeNascimento')
const dataNascimento = document.getElementById('dataNascimento')

const descricao = document.getElementById('descricao')


const gatosInformacoes = JSON.parse(localStorage.getItem('gatos')) || []    


fetch('./javascript/gatos.json')
    .then(response => response.json())
    .then(gatos => {

        gatos.forEach(gato => {
            const ultimoIndex = gatosInformacoes.length - 1

            fotoGato.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].url)

            nomeGato.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].nome

            iconeSexo.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].sexo[0])

            sexoGato.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].sexo[1]

            iconeRaca.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].raca[0])

            racaGato.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].raca[1]

            iconePelagem.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].pelagem[0])

            tipoPelagem.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].pelagem[1]
            
            iconeOlhos.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].olhos[0])

            corOlhos.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].olhos[1]

            iconeNascimento.setAttribute('src', gato.gatos[gatosInformacoes[ultimoIndex]].nascimento[0])

            dataNascimento.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].nascimento[1]

            descricao.innerText = gato.gatos[gatosInformacoes[ultimoIndex]].descricao
        });
    }).catch(error => {
        console.error("Erro ao carregar json", error)
    })