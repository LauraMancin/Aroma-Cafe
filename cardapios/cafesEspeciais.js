const imgCardapio = document.getElementById('imgCardapio')
const nomeProduto = document.getElementById('nomeProduto')
const precoProduto = document.getElementById('precoProduto')
const descricaoProduto = document.getElementById('descricaoProduto')

const uva = JSON.parse(localStorage.getItem('produtos')) || []

let indexChave = 0

fetch('../cardapios.json')
    .then(response => response.json())
    .then(cardapios => {

        cardapios.forEach(cardapio => {
            const ultimoIndex = uva.length - 1

            if(uva[ultimoIndex] <= 6){
                indexChave = uva[ultimoIndex]

                imgCardapio.setAttribute('src', cardapio.cafeEspecial[uva[ultimoIndex]].url)

                nomeProduto.innerText = `${cardapio.cafeEspecial[uva[ultimoIndex]].nome}`

                precoProduto.innerText = cardapio.cafeEspecial[uva[ultimoIndex]].preco
                
                descricaoProduto.innerText = cardapio.cafeEspecial[uva[ultimoIndex]].descricao
            }
            else if(uva[ultimoIndex] <= 13){
                indexChave = uva[ultimoIndex] - cardapio.cafeEspecial.length

                imgCardapio.setAttribute('src', cardapio.bebidaGelada[indexChave].url)

                nomeProduto.innerText = cardapio.bebidaGelada[indexChave].nome

                precoProduto.innerText = cardapio.bebidaGelada[indexChave].preco
                
                descricaoProduto.innerText = cardapio.bebidaGelada[indexChave].descricao
            }
            else{
                indexChave = uva[ultimoIndex] - (cardapio.cafeEspecial.length + cardapio.bebidaGelada.length)

                imgCardapio.setAttribute('src', cardapio.acompanhamento[indexChave].url)

                nomeProduto.innerText = cardapio.acompanhamento[indexChave].nome

                precoProduto.innerText = cardapio.acompanhamento[indexChave].preco
                
                descricaoProduto.innerText = cardapio.acompanhamento[indexChave].descricao
            }
        });
    })
