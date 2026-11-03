// Lista dos itens que tem no carrinho
const carrinho = JSON.parse(localStorage.getItem('carrinho'))

const infoQuantidadeTotal = document.getElementById('infoQuantidadeTotal')

const listaItens = document.getElementById('lista-itens')

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
})

if(carrinho.length > 1){
    infoQuantidadeTotal.innerText = `${carrinho.length} itens`
}
else{
    infoQuantidadeTotal.innerText = `${carrinho.length} item`
}

const botaoRemover = document.querySelectorAll('.btn-remover')

botaoRemover.forEach((botao, index) => {
    botao.addEventListener('click', () => {
        alert('O produto foi removido do carrinho')
        carrinho.splice(index, 1)

        localStorage.setItem('carrinho', JSON.stringify(carrinho))

        location.reload()
    })
})