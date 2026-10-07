document.addEventListener('DOMContentLoaded', () => {

    const campos = document.querySelectorAll('.input-');
    const botaoEntrar = document.querySelector('.botao-entrar');

    if (campos.length < 2 || !botaoEntrar) {
        return;
    }

    // Campos
    const email = campos[0];
    const senha = campos[1];

    // Cores do botão
    const corNormal = '#DB7093';
    const corApagada = '#d99aae';


    // =========================
    // ATUALIZA O BOTÃO
    // =========================

    function verificarCampos() {

        const emailPreenchido = email.value.trim() !== '';
        const senhaPreenchida = senha.value.trim() !== '';

        if (emailPreenchido && senhaPreenchida) {

            botaoEntrar.style.backgroundColor = corNormal;
            botaoEntrar.style.borderColor = corNormal;
            botaoEntrar.style.opacity = '1';
            botaoEntrar.style.cursor = 'pointer';

        } else {

            botaoEntrar.style.backgroundColor = corApagada;
            botaoEntrar.style.borderColor = corApagada;
            botaoEntrar.style.opacity = '0.7';
            botaoEntrar.style.cursor = 'not-allowed';
        }
    }


    // =========================
    // VALIDAR E-MAIL (Igual ao Cadastro)
    // =========================

    function emailValido(valor) {

        valor = valor.trim().toLowerCase();

        const formato = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;

        if (!formato.test(valor)) {
            return false;
        }

        const dominiosPermitidos = [
            'gmail.com',
            'hotmail.com',
            'outlook.com',
            'yahoo.com',
            'icloud.com',
            'live.com',
            'protonmail.com'
        ];

        const dominio = valor.split('@')[1];

        return dominiosPermitidos.includes(dominio);
    }


    // =========================
    // VALIDAR SENHA (Igual ao Cadastro)
    // =========================

    function senhaValida(valor) {

        // Pelo menos 8 caracteres (sem limite máximo rígido no script)
        const tamanhoMinimo = valor.length >= 8;
        const temMaiuscula = /[A-Z]/.test(valor);
        const temMinuscula = /[a-z]/.test(valor);
        const temNumero = /[0-9]/.test(valor);
        const temSimbolo = /[^A-Za-z0-9]/.test(valor);

        return (
            tamanhoMinimo &&
            temMaiuscula &&
            temMinuscula &&
            temNumero &&
            temSimbolo
        );
    }


    // =========================
    // MOSTRAR ERRO
    // =========================

    function mostrarErro(campo, mensagem) {

        const erroAnterior = campo.nextElementSibling;

        if (
            erroAnterior &&
            erroAnterior.classList.contains('mensagem-erro')
        ) {
            erroAnterior.remove();
        }

        const erro = document.createElement('small');

        erro.classList.add('mensagem-erro');
        erro.textContent = mensagem;

        campo.insertAdjacentElement('afterend', erro);

        campo.classList.add('campo-invalido');
    }


    // =========================
    // REMOVER ERRO
    // =========================

    function removerErro(campo) {

        const erro = campo.nextElementSibling;

        if (
            erro &&
            erro.classList.contains('mensagem-erro')
        ) {
            erro.remove();
        }

        campo.classList.remove('campo-invalido');
    }


    // =========================
    // EVENTOS DE ENTRADA
    // =========================

    email.addEventListener('input', () => {
        removerErro(email);
        verificarCampos();
    });

    senha.addEventListener('input', () => {
        removerErro(senha);
        verificarCampos();
    });


    // =========================
    // BOTÃO ENTRAR
    // =========================

    botaoEntrar.addEventListener('click', (evento) => {

        evento.preventDefault();

        // -------------------------
        // VALIDAÇÃO DO E-MAIL
        // -------------------------

        if (email.value.trim() === '') {
            mostrarErro(email, 'Preencha esse campo');
            email.focus();
            return;
        }

        if (!emailValido(email.value)) {
            mostrarErro(email, 'Digite um e-mail válido');
            email.focus();
            return;
        }

        // -------------------------
        // VALIDAÇÃO DA SENHA
        // -------------------------

        if (senha.value.trim() === '') {
            mostrarErro(senha, 'Preencha esse campo');
            senha.focus();
            return;
        }

        if (!senhaValida(senha.value)) {
            mostrarErro(senha, 'A senha deve ter pelo menos 8 caracteres, contendo letra maiúscula, minúscula, número e símbolo');
            senha.focus();
            return;
        }

        // -------------------------
        // REDIRECIONAMENTO INTELIGENTE BASEADO NA URL ATUAL
        // -------------------------
        
        // Verifica se o caminho do arquivo no navegador possui "loginADM.html"
        if (window.location.pathname.includes('loginADM.html')) {
            
            // LÓGICA DA TELA ADM: Salva as permissões e vai para o painel administrativo
            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("tipoUsuario", "admin");
            window.location.href = '../perfilADM/perfilADM.html';

        } else {
            
            // LÓGICA DA TELA COMUM: Salva como cliente comum e vai para a página inicial
            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("tipoUsuario", "cliente");
            window.location.href = '../homePage_perfil/indexPerfil.html';
        }

    });


    // =========================
    // COMPORTAMENTO INTELIGENTE PARA DADOS DE TESTE
    // =========================
    // Identifica a página para preencher o e-mail ideal automaticamente nos testes locais
    if (window.location.pathname.includes('loginADM.html')) {
        email.value = "testeadm@gmail.com";
    } else {
        email.value = "cliente@gmail.com";
    }
    
    // Ambas usam o mesmo padrão de segurança complexo para a senha
    senha.value = "Admin123@";


    // =========================
    // ESTADO INICIAL
    // =========================

    verificarCampos();

});
