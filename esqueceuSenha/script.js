document.addEventListener('DOMContentLoaded', () => {

    const campos = document.querySelectorAll('.input-');
    const botao = document.querySelector('.botao-entrar');

    if (campos.length < 3 || !botao) {
        return;
    }

    // Campos na ordem do HTML
    const email = campos[0];
    const senha = campos[1];
    const confirmarSenha = campos[2];

    const corNormal = '#DB7093';
    const corApagada = '#d99aae';


    // =========================
    // ATUALIZA A COR DO BOTÃO
    // =========================

    function atualizarBotao() {

        const tudoPreenchido =
            email.value.trim() !== '' &&
            senha.value.trim() !== '' &&
            confirmarSenha.value.trim() !== '';

        if (tudoPreenchido) {

            botao.style.backgroundColor = corNormal;
            botao.style.borderColor = corNormal;
            botao.style.opacity = '1';
            botao.style.cursor = 'pointer';

        } else {

            botao.style.backgroundColor = corApagada;
            botao.style.borderColor = corApagada;
            botao.style.opacity = '0.7';
            botao.style.cursor = 'not-allowed';
        }
    }


    // Atualiza enquanto digita
    campos.forEach(campo => {
        campo.addEventListener('input', atualizarBotao);
    });


    // =========================
    // MOSTRAR ERRO
    // =========================

    function mostrarErro(campo, mensagem = 'Preencha esse campo') {

        if (
            campo.nextElementSibling &&
            campo.nextElementSibling.classList.contains('mensagem-erro')
        ) {
            return;
        }

        const erro = document.createElement('small');

        erro.classList.add('mensagem-erro');
        erro.textContent = mensagem;

        campo.insertAdjacentElement('afterend', erro);

        campo.style.borderColor = corNormal;

        campo.addEventListener('input', () => {

            if (erro) {
                erro.remove();
            }

            campo.style.borderColor = '';

        }, { once: true });
    }


    // =========================
    // LIMPAR ERROS
    // =========================

    function limparErros() {

        document.querySelectorAll('.mensagem-erro').forEach(erro => {
            erro.remove();
        });

        campos.forEach(campo => {
            campo.style.borderColor = '';
        });
    }


    // =========================
    // POP-UP
    // =========================

    function mostrarPopup() {

        const fundo = document.createElement('div');
        fundo.classList.add('popup-fundo');

        const popup = document.createElement('div');
        popup.classList.add('popup');

        popup.innerHTML = `
            <h2>Senha alterada!</h2>

            <p>
                Sua solicitação de alteração de senha foi realizada.
            </p>

            <p>
                Para garantir que foi você quem solicitou a alteração
                e evitar golpes, acesse o <strong>e-mail cadastrado</strong>
                e confirme a alteração.
            </p>

            <button class="popup-botao" type="button">
                Entendi
            </button>
        `;

        fundo.appendChild(popup);
        document.body.appendChild(fundo);

        const botaoPopup = popup.querySelector('.popup-botao');

        botaoPopup.addEventListener('click', () => {

            window.location.href = '../login/login.html';

        });
    }


    // =========================
    // BOTÃO ENTRAR
    // =========================

    botao.addEventListener('click', (evento) => {

        evento.preventDefault();

        limparErros();


        // E-mail vazio
        if (email.value.trim() === '') {

            mostrarErro(email);
            email.focus();
            return;
        }


        // Senha vazia
        if (senha.value.trim() === '') {

            mostrarErro(senha);
            senha.focus();
            return;
        }


        // Confirmação vazia
        if (confirmarSenha.value.trim() === '') {

            mostrarErro(confirmarSenha);
            confirmarSenha.focus();
            return;
        }


        // Verifica se as senhas são iguais
        if (senha.value !== confirmarSenha.value) {

            mostrarErro(
                confirmarSenha,
                'As senhas não coincidem'
            );

            confirmarSenha.focus();
            return;
        }


        // =========================
        // TUDO CERTO
        // =========================

        mostrarPopup();
    });


    // Estado inicial do botão
    atualizarBotao();

});