(function verificarLogin() {
        const logado = localStorage.getItem('usuarioLogado') === 'true';
        const linkLogin   = document.getElementById('linkLogin');
        const linkUsuario = document.getElementById('linkUsuario');

        const botaoSair = document.getElementById('botaoSair');

        if (logado) {
          // Logado: esconde "Entre", mostra ícone e botão de sair
            linkLogin.style.display   = 'none';
            linkUsuario.style.display = 'inline-flex';
            botaoSair.style.display   = 'inline-flex';
        } else {
          // Deslogado: mostra "Entre", esconde ícone e botão de sair
            linkLogin.style.display   = 'inline-flex';
            linkUsuario.style.display = 'none';
            botaoSair.style.display   = 'none';
        }
        })();

      // alerta antes de sair da conta e redireciona para a página princiapl
        function sairDaConta() {
            const desejaSair = confirm("Tem certeza que deseja sair da sua conta?");
            
            if (!desejaSair) {
                return; 
            }
            localStorage.removeItem('usuarioLogado');
            window.location.href = '../homePage_perfil/indexPerfil.html';
        }