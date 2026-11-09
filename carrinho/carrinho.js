// Lista dos itens que tem no carrinho
const carrinho = JSON.parse(localStorage.getItem('carrinho'))

const infoQuantidadeTotal = document.getElementById('infoQuantidadeTotal')

const listaItens = document.getElementById('lista-itens')

let valorProdutos = 0

carrinho.forEach(item => {
    listaItens.innerHTML += `
    <article class="item-carrinho">
        <div class="item-icone">
        <img src="../cardapios/${item.url}" alt="Gatoccino">
        </div>
        <div class="item-info">
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <span class="tag-lactose">Contém lactose</span>
        </div>
        <div class="quantidade">
            <button type="button" class="btn-qtd" aria-label="Diminuir quantidade">−</button>
            <span class="qtd-valor">1</span>
            <button type="button" class="btn-qtd" aria-label="Aumentar quantidade">+</button>
        </div>
        <div class="item-preco">
            <small>R$ ${item.preco} un.</small>
            <strong>R$ ${item.preco}</strong>
        </div>
        <button type="button" class="btn-remover" aria-label="Remover item">×</button>
    </article>
    `
    valorProdutos += Number(item.preco.replace(',', '.'))
})

// Mudança na quantidade de itens que tem no carrinho
if(carrinho.length > 1){
    infoQuantidadeTotal.innerText = `${carrinho.length} itens`
}
else{
    infoQuantidadeTotal.innerText = `${carrinho.length} item`
}

// Função do botão remover do carrinho
const botaoRemover = document.querySelectorAll('.btn-remover')

botaoRemover.forEach((botao, index) => {
    botao.addEventListener('click', () => {
        alert('O produto foi removido do carrinho')
        carrinho.splice(index, 1)

        localStorage.setItem('carrinho', JSON.stringify(carrinho))

        location.reload()
    })
})

// Função de esvaziar o carrinho
const esvaziarCarrinho = document.getElementById('esvaziarCarrinho')

esvaziarCarrinho.addEventListener('click', () => {
    for(const index in carrinho){
        carrinho.splice(index, 1)
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho))

    location.reload()
    alert('Carrinho foi esvaziado')
})

// Função de adicionar desconto quando tem o código correto
const valorPedido = document.getElementById('valorPedido')
const campoCupom = document.getElementById('campoCupom')
const aplicarCupom = document.getElementById('aplicarCupom')
const valorDesconto = document.getElementById('valorDesconto')
const valorTotal = document.getElementById('valorTotal')

valorPedido.innerText = valorProdutos.toFixed(2)
valorTotal.innerText = valorProdutos.toFixed(2)

fetch('./cupons.json')
    .then(response => response.json())
    .then(cupons => {

        cupons.forEach((cupom) => {
            aplicarCupom.addEventListener('click', () => {
                if(Object.keys(cupom).includes(campoCupom.value)){
                    let uva = campoCupom.value
                    
                    let porcentagemDesconto = cupom[uva]
                    
                    let desconto = (valorProdutos*porcentagemDesconto).toFixed(2)

                    valorDesconto.innerText = desconto

                    valorTotal.innerText = (valorProdutos - desconto).toFixed(2)

                    campoCupom.value = ''
                }
                else{
                    campoCupom.value = ''
                    alert('Este código de desconto está expirado')
                }
            })
        })
    })