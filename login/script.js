document.addEventListener('DOMContentLoaded', () => {

    // Pega os campos da página
    const campos = document.querySelectorAll('.input-');
    const botaoEntrar = document.querySelector('.botao-entrar');

    // Se a página não tiver esses elementos, não faz nada
    if (campos.length < 2 || !botaoEntrar) {
        return;
    }

    const email = campos[0];
    const senha = campos[1];

    // Cores
    const corNormal = '#DB7093';
    const corApagada = '#d99aae';


    // ==============================
    // VERIFICA OS CAMPOS
    // ==============================

    function verificarCampos() {

        const emailPreenchido = email.value.trim() !== '';
        const senhaPreenchida = senha.value.trim() !== '';

        if (emailPreenchido && senhaPreenchida) {

            // Tudo preenchido → botão normal
            botaoEntrar.style.backgroundColor = corNormal;
            botaoEntrar.style.borderColor = corNormal;
            botaoEntrar.style.opacity = '1';
            botaoEntrar.style.cursor = 'pointer';

        } else {

            // Algum campo vazio → botão apagado
            botaoEntrar.style.backgroundColor = corApagada;
            botaoEntrar.style.borderColor = corApagada;
            botaoEntrar.style.opacity = '0.7';
            botaoEntrar.style.cursor = 'not-allowed';
        }
    }


    // ==============================
    // ENQUANTO DIGITA
    // ==============================

    email.addEventListener('input', verificarCampos);
    senha.addEventListener('input', verificarCampos);


    // ==============================
    // CLICOU EM ENTRAR
    // ==============================

    botaoEntrar.addEventListener('click', (evento) => {

        const emailPreenchido = email.value.trim() !== '';
        const senhaPreenchida = senha.value.trim() !== '';


        // ------------------------------
        // OS DOIS ESTÃO VAZIOS
        // ------------------------------

        if (!emailPreenchido && !senhaPreenchida) {

            evento.preventDefault();

            mostrarErro(email);

            email.focus();

            return;
        }


        // ------------------------------
        // SÓ O E-MAIL ESTÁ PREENCHIDO
        // ------------------------------

        if (emailPreenchido && !senhaPreenchida) {

            evento.preventDefault();

            mostrarErro(senha);

            senha.focus();

            return;
        }


        // ------------------------------
        // SÓ A SENHA ESTÁ PREENCHIDA
        // ------------------------------

        if (!emailPreenchido && senhaPreenchida) {

            evento.preventDefault();

            mostrarErro(email);

            email.focus();

            return;
        }


        // ------------------------------
        // TUDO PREENCHIDO
        // ------------------------------

        // Aqui o login pode continuar normalmente.
        // Se o botão estiver dentro de um <a>,
        // o link será seguido normalmente.
    });


    // ==============================
    // MOSTRAR ERRO
    // ==============================

    function mostrarErro(campo) {

        // Não cria duas mensagens
        if (
            campo.nextElementSibling &&
            campo.nextElementSibling.classList.contains('mensagem-erro')
        ) {
            return;
        }

        const mensagem = document.createElement('small');

        mensagem.classList.add('mensagem-erro');

        mensagem.textContent = 'Preencha esse campo';

        campo.insertAdjacentElement('afterend', mensagem);

        campo.style.borderColor = corNormal;


        // Quando começar a digitar,
        // remove a mensagem
        campo.addEventListener('input', () => {

            if (mensagem) {
                mensagem.remove();
            }

            campo.style.borderColor = '';

        }, { once: true });
    }


    // ==============================
    // ESTADO INICIAL
    // ==============================

    verificarCampos();

});
