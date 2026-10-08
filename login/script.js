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


    // validar e-amail 

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


    // validar senha

    function senhaValida(valor) {

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


    // mostra erro caso não tenha tudo completo

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


    // remove o erro

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


    email.addEventListener('input', () => {
        removerErro(email);
        verificarCampos();
    });

    senha.addEventListener('input', () => {
        removerErro(senha);
        verificarCampos();
    });


    // botão entrar

    botaoEntrar.addEventListener('click', (evento) => {

        evento.preventDefault();

        // validação e-mail

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

        // validação senha

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
        
        // Verifica se o caminho do arquivo no navegador possui "loginADM.html"
        if (window.location.pathname.includes('loginADM.html')) {
            
            // Salva as permissões e vai para o painel administrativo
            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("tipoUsuario", "admin");
            window.location.href = '../perfilADM/perfilADM.html';

        } else {
            
            // Salva como cliente comum e vai para a página inicial
            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("tipoUsuario", "cliente");
            window.location.href = '../homePage_perfil/indexPerfil.html';
        }

    });

    // e-mail e senha do ADM para testes
    if (window.location.pathname.includes('loginADM.html')) {
        email.value = "testeadm@gmail.com";
    } else {
        email.value = "cliente@gmail.com";
    }
    
    senha.value = "Admin123@";


    verificarCampos();

});
