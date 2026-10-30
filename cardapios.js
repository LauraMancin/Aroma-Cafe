// Para cada categoria, liga as setas à lista de produtos dela
document.querySelectorAll('.categoria').forEach(categoria => {
    const lista = categoria.querySelector('.produtos');
    const setaEsq = categoria.querySelector('.seta-esq');
    const setaDir = categoria.querySelector('.seta-dir');

    // Quanto rolar a cada clique: a largura de um card + o espaço entre eles
    function passo() {
        const card = lista.querySelector('.produto');
        const gap = parseInt(getComputedStyle(lista).columnGap) || 0;
        return card.offsetWidth + gap;
    }

    // Desativa a seta quando a lista chegou no começo ou no fim
    function atualizarSetas() {
        const fim = lista.scrollWidth - lista.clientWidth;
        setaEsq.disabled = lista.scrollLeft <= 1;
        setaDir.disabled = lista.scrollLeft >= fim - 1;
    }

    setaEsq.addEventListener('click', () => {
        lista.scrollBy({ left: -passo(), behavior: 'smooth' });
    });

    setaDir.addEventListener('click', () => {
        lista.scrollBy({ left: passo(), behavior: 'smooth' });
    });

    // Atualiza ao rolar (inclusive com o dedo no celular) e ao redimensionar a tela
    lista.addEventListener('scroll', atualizarSetas);
    window.addEventListener('resize', atualizarSetas);

    atualizarSetas(); // estado inicial
});