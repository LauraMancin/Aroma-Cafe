document.addEventListener('DOMContentLoaded', () => {

    const campos = document.querySelectorAll('.input-');
    const botao = document.querySelector('.botao-entrar');

    if (campos.length < 2 || !botao) {
        return;
    }

    const senha = campos[0];
    const confirmarSenha = campos[1];

    const corNormal = '#DB7093';
    const corApagada = '#d99aae';


    // =========================
    // ATUALIZA A COR DO BOTÃO
    // =========================

    function atualizarBotao() {

        const senhaPreenchida = senha.value.trim() !== '';
        const confirmarPreenchida = confirmarSenha.value.trim() !== '';

        if (senhaPreenchida && confirmarPreenchida) {

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
    senha.addEventListener('input', atualizarBotao);
    confirmarSenha.addEventListener('input', atualizarBotao);


    // =========================
    // MOSTRAR ERRO
    // =========================

    function mostrarErro(campo, mensagem) {

        const erroExistente = campo.nextElementSibling;

        if (
            erroExistente &&
            erroExistente.classList.contains('mensagem-erro')
        ) {
            erroExistente.remove();
        }

        const erro = document.createElement('small');

        erro.classList.add('mensagem-erro');
        erro.textContent = mensagem;

        campo.insertAdjacentElement('afterend', erro);

        campo.style.borderColor = corNormal;
    }


    // =========================
    // BOTÃO
    // =========================

    botao.addEventListener('click', (evento) => {

        evento.preventDefault();


        // Verifica senha
        if (senha.value.trim() === '') {

            mostrarErro(
                senha,
                'Preencha esse campo'
            );

            senha.focus();

            return;
        }


        // Verifica confirmação
        if (confirmarSenha.value.trim() === '') {

            mostrarErro(
                confirmarSenha,
                'Preencha esse campo'
            );

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
        // SENHA CORRETA
        // =========================

        mostrarPopup();

    });


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
                Sua senha foi alterada com sucesso.
            </p>

            <p>
                Para sua segurança, acesse o
                <strong>e-mail cadastrado</strong>
                e confirme a alteração.
            </p>

            <p>
                Essa confirmação ajuda a proteger sua conta
                contra golpes e alterações não autorizadas.
            </p>

            <button type="button" class="popup-botao">
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


    // Estado inicial
    atualizarBotao();

});