// abrir modais
document.querySelectorAll('[data-modal]').forEach(el => {
    const abrir = () => document.getElementById(el.dataset.modal).showModal();
    el.addEventListener('click', abrir);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(); });
});

// fechar: botões ×/aancelar e clique no fundo
document.querySelectorAll('.modal').forEach(m => {
    m.querySelectorAll('.fechar').forEach(b => b.addEventListener('click', () => m.close()));
    m.addEventListener('click', e => { if (e.target === m) m.close(); });
    m.addEventListener('close', () => m.querySelector('form').reset());
});

// máscara de CPF
const cpf = document.getElementById('cpf');
cpf.addEventListener('input', () => {
    let v = cpf.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpf.value = v;
});

// aviso de sucesso
function mostrarAviso(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('visivel');
    setTimeout(() => t.classList.remove('visivel'), 3000);
}

// envio dos formulários (ligar o back-end depois)
function tratarEnvio(idForm, idModal, msg) {
    document.getElementById(idForm).addEventListener('submit', e => {
        e.preventDefault();
        if (idForm === 'formAdocao' && cpf.value.length < 14) {
            cpf.setCustomValidity('Informe o CPF completo');
            cpf.reportValidity();
            return;
        }
        const dados = Object.fromEntries(new FormData(e.target));
        console.log(dados);
        document.getElementById(idModal).close();
        mostrarAviso(msg);
    });
}
cpf.addEventListener('input', () => cpf.setCustomValidity(''));
tratarEnvio('formProduto', 'modalProduto', 'Produto salvo com sucesso');
tratarEnvio('formAdocao', 'modalAdocao', 'Adoção registrada com sucesso');

// sair da conta 
function sairDaConta() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../homePage_perfil/indexPerfil.html';
}