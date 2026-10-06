document.addEventListener('DOMContentLoaded', () => {

    const campos = document.querySelectorAll('.input-');
    const check = document.querySelector('.check');
    const botao = document.querySelector('.botao-entrar');

    if (campos.length < 6 || !botao) {
        return;
    }

    // Campos na ordem do seu HTML
    const email = campos[0];
    const confirmarEmail = campos[1];
    const senha = campos[2];
    const confirmarSenha = campos[3];
    const dataNascimento = campos[4];
    const telefone = campos[5];

    const corNormal = '#DB7093';
    const corApagada = '#d99aae';

    // =========================
    // MÁSCARA DO TELEFONE
    // =========================

    telefone.addEventListener('input', () => {

        // Remove tudo que não for número
        let valor = telefone.value.replace(/\D/g, '');

        // Limita a 11 números
        valor = valor.substring(0, 11);

        // Formata o telefone
        if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                '($1) $2-$3'
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d{0,5})/,
                '($1) $2'
            );

        } else {

            valor = valor.replace(
                /^(\d*)/,
                '($1'
            );
        }

        telefone.value = valor;

        atualizarBotao();
    });


    // =========================
    // VERIFICA SE ESTÁ TUDO PREENCHIDO
    // =========================

    function atualizarBotao() {

        const todosPreenchidos = Array.from(campos).every(
            campo => campo.value.trim() !== ''
        );

        const termosAceitos = check ? check.checked : false;

        if (todosPreenchidos && termosAceitos) {

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


    // Atualiza o botão enquanto o usuário digita
    campos.forEach(campo => {
        campo.addEventListener('input', atualizarBotao);
    });

    if (check) {
        check.addEventListener('change', atualizarBotao);
    }


    // =========================
    // MOSTRAR ERRO
    // =========================

    function mostrarErro(campo, mensagem = 'Preencha esse campo') {

        // Evita criar várias mensagens
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
    // REMOVER ERROS ANTIGOS
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
    // BOTÃO CADASTRAR
    // =========================

    botao.addEventListener('click', (evento) => {

        evento.preventDefault();

        limparErros();


        // E-mail
        if (email.value.trim() === '') {

            mostrarErro(email);
            email.focus();
            return;
        }


        // Confirmação do e-mail
        if (confirmarEmail.value.trim() === '') {

            mostrarErro(confirmarEmail);
            confirmarEmail.focus();
            return;
        }


        // Verifica se os e-mails são iguais
        if (email.value.trim() !== confirmarEmail.value.trim()) {

            mostrarErro(
                confirmarEmail,
                'Os e-mails não coincidem'
            );

            confirmarEmail.focus();
            return;
        }


        // Senha
        if (senha.value.trim() === '') {

            mostrarErro(senha);
            senha.focus();
            return;
        }


        // Confirmação da senha
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


        // Data de nascimento
        if (dataNascimento.value.trim() === '') {

            mostrarErro(dataNascimento);
            dataNascimento.focus();
            return;
        }


        // Telefone
        if (telefone.value.trim() === '') {

            mostrarErro(telefone);
            telefone.focus();
            return;
        }


        // Verifica se o telefone tem 11 números
        const numeroTelefone = telefone.value.replace(/\D/g, '');

        if (numeroTelefone.length < 11) {

            mostrarErro(
                telefone,
                'Digite um telefone válido'
            );

            telefone.focus();
            return;
        }


        // Termos
        if (!check || !check.checked) {

            if (check) {
                check.focus();
            }

            alert('Você precisa aceitar os termos de privacidade.');
            return;
        }


        // =========================
        // CADASTRO CONCLUÍDO
        // =========================

        // Só marca como logado depois de passar por todas as validações
        localStorage.setItem('usuarioLogado', 'true');

        // Vai para a tela de login
        window.location.href = '../login/login.html';
    });


    // Estado inicial do botão
    atualizarBotao();

});