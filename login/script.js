document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.input-principal');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const botaoEntrar = document.querySelector('.botao-entrar');

    if (!form || !email || !senha || !botaoEntrar) {
        return;
    }

    const tipo = document.body.dataset.tipo === 'admin' ? 'admin' : 'cliente';

    const DESTINOS = {
        admin: '../perfilADM/perfilADM.html',
        cliente: '../homePage_perfil/indexPerfil.html'
    };

    
    // localhost 
    const MODO_TESTE = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

    const CONTAS_TESTE = {
        cliente: { email: 'cliente@gmail.com', senha: 'Admin123@' },
        admin: { email: 'testeadm@gmail.com', senha: 'Admin123@' }
    };

    if (MODO_TESTE) {
        email.value = CONTAS_TESTE[tipo].email;
        senha.value = CONTAS_TESTE[tipo].senha;
    }



    function emailValido(valor) {
        valor = valor.trim();
        return valor.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    }


    // -- msg de erro

    function removerErro(campo) {
        const erro = document.getElementById(campo.id + '-erro');
        if (erro) erro.remove();
        campo.classList.remove('campo-invalido');
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-describedby');
    }

    function mostrarErro(campo, mensagem) {
        removerErro(campo);

        const erro = document.createElement('small');
        erro.id = campo.id + '-erro';
        erro.className = 'mensagem-erro';
        erro.setAttribute('role', 'alert');
        erro.textContent = mensagem; // textContent = seguro contra injeção de código

        campo.insertAdjacentElement('afterend', erro);
        campo.classList.add('campo-invalido');
        campo.setAttribute('aria-invalid', 'true');
        campo.setAttribute('aria-describedby', erro.id);
    }

    function verificarCampos() {
        const preenchidos = email.value.trim() !== '' && senha.value !== '';
        botaoEntrar.classList.toggle('inativo', !preenchidos);
    }

    email.addEventListener('input', () => { removerErro(email); verificarCampos(); });
    senha.addEventListener('input', () => { removerErro(senha); verificarCampos(); });


    function autenticar(emailDigitado, senhaDigitada) {
        if (MODO_TESTE) {
            const conta = CONTAS_TESTE[tipo];
            return emailDigitado.trim().toLowerCase() === conta.email &&
                   senhaDigitada === conta.senha;
        }
        return null;
    }


    // -- envio forms 

    form.addEventListener('submit', (evento) => {

        evento.preventDefault();

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

        if (senha.value === '') {
            mostrarErro(senha, 'Preencha esse campo');
            senha.focus();
            return;
        }

        const resultado = autenticar(email.value, senha.value);

        if (resultado === null) {
            mostrarErro(senha, 'Login indisponível: servidor ainda não conectado.');
            return;
        }

        if (resultado === false) {
            mostrarErro(senha, 'E-mail ou senha incorretos');
            senha.focus();
            return;
        }

        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('tipoUsuario', tipo);
        window.location.href = DESTINOS[tipo];
    });

    verificarCampos();
});