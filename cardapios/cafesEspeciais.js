const imgCardapio = document.getElementById('imgCardapio')
const nomeProduto = document.getElementById('nomeProduto')
const precoProduto = document.getElementById('precoProduto')
const descricaoProduto = document.getElementById('descricaoProduto')

const uva = JSON.parse(localStorage.getItem('produtos'))

fetch('../cardapios.json')
    .then(response => response.json())
    .then(cardapios => {

        cardapios.forEach(cardapio => {
            
            imgCardapio.setAttribute('src', cardapio.cafeEspecial[uva[uva.length - 1]].url)

            nomeProduto.innerText = `${cardapio.cafeEspecial[uva[uva.length - 1]].nome}`

            precoProduto.innerText = cardapio.cafeEspecial[uva[uva.length - 1]].preco
            
            descricaoProduto.innerText = cardapio.cafeEspecial[uva[uva.length - 1]].descricao
        });
    })
