document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. MÁSCARAS E MÁXIMO DE CARACTERES
    // ==========================================

    // Máscara para CPF (000.000.000-00)

    const cpfInput = document.querySelector(
        'input[placeholder*="CPF"], input[maxlength="12"], input[maxlength="14"]'
    );

    if (cpfInput) {

        cpfInput.setAttribute("maxlength", "14");

        cpfInput.addEventListener("input", (e) => {

            let v = e.target.value.replace(/\D/g, "");

            if (v.length > 11) {
                v = v.slice(0, 11);
            }

            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            e.target.value = v;

        });

    }


    // Máscara para Número/Contato ((11) 99999-9999)

    const telInput = document.querySelector(
        'input[type="tel"], input[placeholder*="99999-9999"]'
    );

    if (telInput) {

        telInput.setAttribute("maxlength", "15");

        telInput.addEventListener("input", (e) => {

            let v = e.target.value.replace(/\D/g, "");

            if (v.length > 11) {
                v = v.slice(0, 11);
            }

            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d)(\d{4})$/, "$1-$2");

            e.target.value = v;

        });

    }


    // Máscara para CEP (00000-000)

    const cepInput = document.querySelector(
        'input[placeholder*="00000-000"]'
    );

    if (cepInput) {

        cepInput.setAttribute("maxlength", "9");

        cepInput.addEventListener("input", (e) => {

            let v = e.target.value.replace(/\D/g, "");

            if (v.length > 8) {
                v = v.slice(0, 8);
            }

            v = v.replace(/^(\d{5})(\d)/, "$1-$2");

            e.target.value = v;

        });

    }


    // Apenas números para campos numéricos

    const inputsNumero = document.querySelectorAll(
        'input[type="number"]'
    );

    inputsNumero.forEach((input) => {

        input.addEventListener("input", (e) => {

            e.target.value = e.target.value.replace(/\D/g, "");

        });

    });

    const tabsContainer = document.querySelector(".tabs");

    const tabs = document.querySelectorAll(
        ".tabs .tab"
    );

    const contents = document.querySelectorAll(
        ".content"
    );


    if (tabsContainer && tabs.length > 0) {

        // Criar linha rosa

        const indicator = document.createElement("div");

        indicator.classList.add("tab-indicator");

        tabsContainer.appendChild(indicator);


        // Posicionar linha rosa

        function posicionarIndicador(tabAtiva) {

            const containerRect =
                tabsContainer.getBoundingClientRect();

            const tabRect =
                tabAtiva.getBoundingClientRect();

            indicator.style.width =
                `${tabRect.width}px`;

            indicator.style.transform =
                `translateX(${tabRect.left - containerRect.left}px)`;

        }


        // Aba ativa inicialmente

        const abaAtivaInicial =
            document.querySelector(
                ".tabs .tab.active"
            ) || tabs[0];


        posicionarIndicador(
            abaAtivaInicial
        );


        // Troca de abas

        tabs.forEach((tab) => {

            tab.addEventListener("click", () => {

                // Remove active das abas

                tabs.forEach((t) => {
                    t.classList.remove("active");
                });


                // Remove active dos conteúdos

                contents.forEach((c) => {
                    c.classList.remove("active");
                });


                // Ativa aba clicada

                tab.classList.add("active");


                // Move linha rosa

                posicionarIndicador(tab);


                // Descobre conteúdo

                const target =
                    tab.getAttribute("data-tab");


                const contentEl =
                    document.getElementById(target);


                // Mostra conteúdo

                if (contentEl) {
                    contentEl.classList.add("active");
                }

            });

        });


        // Reposiciona linha ao redimensionar

        window.addEventListener("resize", () => {

            const tabAtiva =
                document.querySelector(
                    ".tabs .tab.active"
                );

            if (tabAtiva) {
                posicionarIndicador(tabAtiva);
            }

        });

    }


    // API IBGE

    const estadoSelect =
        document.getElementById("estado");


    if (estadoSelect) {

        estadoSelect.addEventListener(
            "change",
            function () {

                const uf = this.value;

                const cidadeSelect =
                    document.getElementById("cidade");


                if (!cidadeSelect) {
                    return;
                }


                if (!uf) {

                    cidadeSelect.innerHTML =
                        '<option value="">Selecione um estado primeiro</option>';

                    return;

                }


                cidadeSelect.innerHTML =
                    "<option>Carregando...</option>";


                fetch(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
                )

                    .then((response) => {

                        if (!response.ok) {
                            throw new Error(
                                "Erro ao buscar cidades"
                            );
                        }

                        return response.json();

                    })

                    .then((cidades) => {

                        cidadeSelect.innerHTML =
                            '<option value="">Selecione</option>';


                        cidades.forEach((cidade) => {

                            const option =
                                document.createElement("option");

                            option.value =
                                cidade.nome;

                            option.textContent =
                                cidade.nome;

                            cidadeSelect.appendChild(
                                option
                            );

                        });

                    })

                    .catch(() => {

                        cidadeSelect.innerHTML =
                            '<option value="">Erro ao carregar cidades</option>';

                    });

            }
        );

    }

    const modal =
        document.getElementById("modal");


    if (modal) {

        modal.addEventListener(
            "click",
            function (e) {

                if (e.target === this) {
                    fecharModal();
                }

            }
        );

    }


    // atualização do nome no perfil

    const inputNome =
        document.getElementById("nome") ||
        document.querySelector(
            'input[name="nome"]'
        );


    const inputSobrenome =
        document.getElementById("sobrenome") ||
        document.querySelector(
            'input[name="sobrenome"]'
        );


    const tituloPerfil =
        document.querySelector(
            ".profile-info h2, .profile-name, .user-info h2"
        ) ||
        document.querySelector(
            ".dados-usuario h2"
        ) ||
        document.querySelector("h2");


    function atualizarNomePerfil() {

        if (!tituloPerfil) {
            return;
        }


        const nome =
            inputNome
                ? inputNome.value.trim()
                : "";


        const sobrenome =
            inputSobrenome
                ? inputSobrenome.value.trim()
                : "";


        if (!nome && !sobrenome) {

            tituloPerfil.textContent =
                "Nome Completo";

        } else {

            tituloPerfil.textContent =
                `${nome} ${sobrenome}`.trim();

        }

    }


    if (inputNome) {
        inputNome.addEventListener(
            "input",
            atualizarNomePerfil
        );
    }


    if (inputSobrenome) {
        inputSobrenome.addEventListener(
            "input",
            atualizarNomePerfil
        );
    }


    // configurações

    const botoesAlterar =
        document.querySelectorAll(
            ".botao-alterar"
        );


    botoesAlterar.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                const item =
                    botao.closest(
                        ".config-item"
                    );


                if (!item) {
                    return;
                }


                const titulo =
                    item.querySelector(
                        ".config-info strong"
                    );


                const valor =
                    item.querySelector(
                        ".config-valor"
                    );


                if (!titulo || !valor) {
                    return;
                }


                const tipo =
                    titulo.textContent.trim();


                if (tipo === "E-mail") {

                    const novoEmail =
                        prompt(
                            "Digite o novo e-mail:",
                            valor.textContent.trim()
                        );


                    if (
                        novoEmail &&
                        novoEmail.trim() !== ""
                    ) {

                        valor.textContent =
                            novoEmail.trim();

                    }

                }


                else if (
                    tipo === "Número de telefone"
                ) {

                    const novoTelefone =
                        prompt(
                            "Digite o novo número de telefone:",
                            valor.textContent.trim()
                        );


                    if (
                        novoTelefone &&
                        novoTelefone.trim() !== ""
                    ) {

                        valor.textContent =
                            novoTelefone.trim();

                    }

                }

            }
        );

    });

    const switches =
        document.querySelectorAll(
            '.config-card .switch input[type="checkbox"]'
        );


    switches.forEach((switchInput) => {

        switchInput.addEventListener(
            "change",
            () => {

                const item =
                    switchInput.closest(
                        ".config-item"
                    );


                if (!item) {
                    return;
                }


                const titulo =
                    item.querySelector(
                        ".config-info strong"
                    );


                if (!titulo) {
                    return;
                }


                const nome =
                    titulo.textContent.trim();


                if (switchInput.checked) {

                    console.log(
                        `${nome}: ativado`
                    );

                } else {

                    console.log(
                        `${nome}: desativado`
                    );

                }

            }
        );

    });


    // alterar senha

    const botoesSeguranca =
        document.querySelectorAll(
            ".botao-seguranca"
        );


    botoesSeguranca.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                const item =
                    botao.closest(
                        ".seguranca-item"
                    );


                if (!item) {
                    return;
                }


                const titulo =
                    item.querySelector(
                        ".seguranca-info strong"
                    );


                if (!titulo) {
                    return;
                }


                const texto =
                    titulo.textContent.trim();


                // ALTERAR SENHA

                if (
                    texto === "Alterar senha"
                ) {

                    const senhaAtual =
                        prompt(
                            "Digite sua senha atual:"
                        );


                    if (!senhaAtual) {
                        return;
                    }


                    const novaSenha =
                        prompt(
                            "Digite sua nova senha:"
                        );


                    if (!novaSenha) {
                        return;
                    }


                    if (
                        novaSenha.length < 8
                    ) {

                        alert(
                            "A nova senha deve possuir pelo menos 8 caracteres."
                        );

                        return;

                    }


                    const confirmarSenha =
                        prompt(
                            "Digite novamente sua nova senha:"
                        );


                    if (
                        novaSenha !==
                        confirmarSenha
                    ) {

                        alert(
                            "As senhas não são iguais."
                        );

                        return;

                    }


                    alert(
                        "Senha alterada com sucesso!"
                    );

                }


                // DISPOSITIVO ATUAL

                else if (
                    texto === "Este dispositivo"
                ) {

                    alert(
                        "Este é o dispositivo que você está usando atualmente."
                    );

                }


                // HISTÓRICO

                else if (
                    texto === "Último acesso"
                ) {

                    alert(
                        "Histórico de acessos:\n\n" +
                        "• Este dispositivo — Acesso recente"
                    );

                }

            }
        );

    });


    // autenticação em duas etapas

    const autenticacao =
        document.querySelector(
            '#security .seguranca-item input[type="checkbox"]'
        );


    if (autenticacao) {

        autenticacao.addEventListener(
            "change",
            function () {

                if (this.checked) {

                    alert(
                        "A autenticação em duas etapas foi ativada."
                    );

                } else {

                    alert(
                        "A autenticação em duas etapas foi desativada."
                    );

                }

            }
        );

    }


    // excluir conta

    const botaoExcluir =
        document.querySelector(
            ".botao-perigo"
        );


    if (botaoExcluir) {

        botaoExcluir.addEventListener(
            "click",
            () => {

                const confirmar =
                    confirm(
                        "Tem certeza que deseja excluir sua conta?\n\n" +
                        "Essa ação não poderá ser desfeita."
                    );


                if (!confirmar) {
                    return;
                }


                const confirmacaoFinal =
                    confirm(
                        "Deseja realmente excluir sua conta?"
                    );


                if (confirmacaoFinal) {

                    alert(
                        "A solicitação de exclusão da conta foi realizada."
                    );

                }

            }
        );

    }


    // tema

    const selectsConfig =
        document.querySelectorAll(
            ".select-config"
        );


    // Primeiro select = Tema

    if (selectsConfig[0]) {

        const selectTema =
            selectsConfig[0];


        selectTema.addEventListener(
            "change",
            function () {

                const tema =
                    this.value;


                if (tema === "Escuro") {

                    document.body.classList.add(
                        "tema-escuro"
                    );

                }


                else if (
                    tema === "Claro"
                ) {

                    document.body.classList.remove(
                        "tema-escuro"
                    );

                }


                else if (
                    tema === "Automático"
                ) {

                    const modoEscuro =
                        window.matchMedia(
                            "(prefers-color-scheme: dark)"
                        ).matches;


                    document.body.classList.toggle(
                        "tema-escuro",
                        modoEscuro
                    );

                }

            }
        );

    }


    // idioma

    if (selectsConfig[1]) {

        const selectIdioma =
            selectsConfig[1];


        selectIdioma.addEventListener(
            "change",
            function () {

                console.log(
                    "Idioma selecionado:",
                    this.value
                );

            }
        );

    }


});

function abrirModal() {

    const modal =
        document.getElementById("modal");


    if (modal) {

        modal.classList.add(
            "ativo"
        );

    }

}


function fecharModal() {

    const modal =
        document.getElementById("modal");


    if (modal) {

        modal.classList.remove(
            "ativo"
        );

    }

}


    // sair da conta

function sairDaConta() {

    localStorage.removeItem(
        "usuarioLogado"
    );


    window.location.href =
        "../homePage_perfil/indexPerfil.html";

}
