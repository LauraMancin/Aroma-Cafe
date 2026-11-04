const imgCardapio = document.getElementById('imgCardapio')
const nomeProduto = document.getElementById('nomeProduto')
const precoProduto = document.getElementById('precoProduto')
const descricaoProduto = document.getElementById('descricaoProduto')

const botaoCarrinho = document.getElementById('botaoCarrinho')

const produtosInformacoes = JSON.parse(localStorage.getItem('produtos')) || []

let indexChave = 0
let precoMonetario = 0

function adicionarCarrinho(nome, descricao, preco, url){
    // Recupera os usuários existentes
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
    
    // Cria o novo item
    const novoItem = {
        nome: nome,
        descricao: descricao,
        preco: preco,
        url: url
    }

    // Adiciona item ao array
    carrinho.push(novoItem)

    // Atualiza o localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho))
}

fetch('../cardapios.json')
    .then(response => response.json())
    .then(cardapios => {

        cardapios.forEach(cardapio => {
            const ultimoIndex = produtosInformacoes.length - 1

            let carrinho = []

            if(uva[ultimoIndex] <= cardapio.cafeEspecial.length - 1){
                indexChave = uva[ultimoIndex]

                imgCardapio.setAttribute('src', cardapio.cafeEspecial[produtosInformacoes[ultimoIndex]].url)

                nomeProduto.innerText = `${cardapio.cafeEspecial[produtosInformacoes[ultimoIndex]].nome}`

                precoMonetario = cardapio.cafeEspecial[produtosInformacoes[ultimoIndex]].preco

                precoProduto.innerText += precoMonetario.toFixed(2).replace('.', ',')
                
                descricaoProduto.innerText = cardapio.cafeEspecial[produtosInformacoes[ultimoIndex]].descricao
            }
            else if(uva[ultimoIndex] <= (cardapio.cafeEspecial.length - 1) + (cardapio.bebidaGelada.length - 1)){
                indexChave = uva[ultimoIndex] - cardapio.cafeEspecial.length

                imgCardapio.setAttribute('src', cardapio.bebidaGelada[indexChave].url)

                nomeProduto.innerText = cardapio.bebidaGelada[indexChave].nome

                precoMonetario = cardapio.bebidaGelada[indexChave].preco

                precoProduto.innerText += precoMonetario.toFixed(2).replace('.', ',')
                
                descricaoProduto.innerText = cardapio.bebidaGelada[indexChave].descricao
            }
            else{
                indexChave = produtosInformacoes[ultimoIndex] - (cardapio.cafeEspecial.length + cardapio.bebidaGelada.length)

                imgCardapio.setAttribute('src', cardapio.acompanhamento[indexChave].url)

                nomeProduto.innerText = cardapio.acompanhamento[indexChave].nome

                precoMonetario = cardapio.acompanhamento[indexChave].preco

                precoProduto.innerText += precoMonetario.toFixed(2).replace('.', ',')
                
                descricaoProduto.innerText = cardapio.acompanhamento[indexChave].descricao
            }

            botaoCarrinho.addEventListener('click', () => {
                alert('O produto foi adicionado')
                
                let nome = nomeProduto.innerText
                let descricao = descricaoProduto.innerText
                let preco = precoMonetario.toFixed(2).replace('.', ',')
                let url = imgCardapio.getAttribute('src')

                adicionarCarrinho(nome, descricao, preco, url)
            })

        });
    })