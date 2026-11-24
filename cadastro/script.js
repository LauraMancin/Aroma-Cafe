document.addEventListener('DOMContentLoaded', () => {

    const campos = document.querySelectorAll('.input-');
    const check = document.querySelector('.check');
    const botao = document.querySelector('.botao-entrar');

    if (campos.length < 6 || !botao) {
        return;
    }

    const email = campos[0];
    const confirmarEmail = campos[1];
    const senha = campos[2];
    const confirmarSenha = campos[3];
    const dataNascimento = campos[4];
    const telefone = campos[5];

    const corNormal = '#DB7093';
    const corApagada = '#d99aae';


    // =========================
    // VERIFICAR BOTÃO
    // =========================

    function atualizarBotao() {

        const todosPreenchidos = Array.from(campos).every(
            campo => campo.value.trim() !== ''
        );

        const termosAceitos = check && check.checked;

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


    // =========================
    // VALIDAR E-MAIL
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
    // VALIDAR SENHA
    // =========================

    function senhaValida(valor) {

        // Pelo menos 8 caracteres (pode ter mais)
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
    // VALIDAR MAIORIDADE (18 ANOS)
    // =========================

    function tem18AnosOuMais(dataValor) {
        if (!dataValor) return false;
        
        const hoje = new Date();
        const nascimento = new Date(dataValor);
        
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade >= 18;
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
    // MÁSCARA DO TELEFONE
    // =========================

    telefone.addEventListener('input', () => {

        let valor = telefone.value.replace(/\D/g, '');

        valor = valor.substring(0, 11);

        if (valor.length > 6) {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            valor = valor.replace(/^(\d*)/, '($1');
        }

        telefone.value = valor;
        atualizarBotao();
    });


    // =========================
    // INPUTS
    // =========================

    campos.forEach(campo => {
        campo.addEventListener('input', () => {
            removerErro(campo);
            atualizarBotao();
        });
    });

    if (check) {
        check.addEventListener('change', () => {
            atualizarBotao();
        });
    }


    // =========================
    // BOTÃO CADASTRAR
    // =========================

    botao.addEventListener('click', (evento) => {

        evento.preventDefault();

        // -------------------------
        // E-MAIL
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
        // CONFIRMAR E-MAIL
        // -------------------------
        if (confirmarEmail.value.trim() === '') {
            mostrarErro(confirmarEmail, 'Preencha esse campo');
            confirmarEmail.focus();
            return;
        }

        if (email.value.trim().toLowerCase() !== confirmarEmail.value.trim().toLowerCase()) {
            mostrarErro(confirmarEmail, 'Os e-mails não coincidem');
            confirmarEmail.focus();
            return;
        }

        // -------------------------
        // SENHA
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
        // CONFIRMAR SENHA
        // -------------------------
        if (confirmarSenha.value.trim() === '') {
            mostrarErro(confirmarSenha, 'Preencha esse campo');
            confirmarSenha.focus();
            return;
        }

        if (senha.value !== confirmarSenha.value) {
            mostrarErro(confirmarSenha, 'As senhas não coincidem');
            confirmarSenha.focus();
            return;
        }

        // -------------------------
        // DATA DE NASCIMENTO
        // -------------------------
        if (dataNascimento.value === '') {
            mostrarErro(dataNascimento, 'Preencha esse campo');
            dataNascimento.focus();
            return;
        }

        if (!tem18AnosOuMais(dataNascimento.value)) {
            mostrarErro(dataNascimento, 'Você precisa ter 18 anos ou mais para realizar compras no site');
            dataNascimento.focus();
            return;
        }

        // -------------------------
        // TUDO CORRETO - SIMULAÇÃO DE SUCESSO
        // -------------------------
        alert('Cadastro realizado com sucesso!');
        window.location.href = '../login/login.html';
    });

    // Estado inicial do botão
    atualizarBotao();
});
