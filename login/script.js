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
    // VALIDAÇÃO DO E-MAIL
    // =========================

    function emailValido(valor) {

        // Exemplo válido:
        // nome@gmail.com
        // usuario@hotmail.com

        const formatoEmail =
            /^[^\s@]+@[^\s@]+\.com$/i;

        return formatoEmail.test(valor);
    }


    // =========================
    // MOSTRAR ERRO
    // =========================

    function mostrarErro(campo, mensagem) {

        // Remove erro anterior
        const erroAnterior = campo.nextElementSibling;

        if (
            erroAnterior &&
            erroAnterior.classList.contains('mensagem-erro')
        ) {
            erroAnterior.remove();
        }

        // Cria mensagem
        const erro = document.createElement('small');

        erro.classList.add('mensagem-erro');
        erro.textContent = mensagem;

        // Coloca abaixo do campo
        campo.insertAdjacentElement('afterend', erro);

        // Destaca o campo
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
    // E-MAIL
    // =========================

    email.addEventListener('input', () => {

        removerErro(email);
        verificarCampos();

    });


    // =========================
    // SENHA
    // =========================

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
        // E-MAIL VAZIO
        // -------------------------

        if (email.value.trim() === '') {

            mostrarErro(
                email,
                'Preencha esse campo'
            );

            email.focus();

            return;
        }


        // -------------------------
        // E-MAIL INVÁLIDO
        // -------------------------

        if (!emailValido(email.value.trim())) {

            mostrarErro(
                email,
                'Digite um e-mail válido'
            );

            email.focus();

            return;
        }


        // -------------------------
        // SENHA VAZIA
        // -------------------------

        if (senha.value.trim() === '') {

            mostrarErro(
                senha,
                'Preencha esse campo'
            );

            senha.focus();

            return;
        }


        // -------------------------
        // TUDO CORRETO
        // -------------------------

        window.location.href =
            '../homePage_perfil/indexPerfil.html';

    });


    // =========================
    // ESTADO INICIAL
    // =========================

    verificarCampos();

});