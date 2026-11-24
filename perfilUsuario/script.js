document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ARMAZENAMENTO (localStorage)
       Obs.: é uma solução de front-end para demonstração.
       Quando houver back-end, estes dados devem ir para o servidor.
    ========================================================= */
    const CHAVE_PERFIL = "aromaPerfil";
    const CHAVE_SENHA = "aromaSenha";

    const CAMPOS = [
        "nome", "sobrenome", "nascimento", "cpf", "telefone", "endereco",
        "numero", "complemento", "cep", "moradia", "estado", "cidade", "ambiente"
    ];

    function lerStorage(chave) {
        try {
            return JSON.parse(localStorage.getItem(chave));
        } catch {
            return null;
        }
    }

    function gravarStorage(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch {
            return false;
        }
    }

    const perfil = Object.assign(
        { email: "exemplo@gmail.com", foto: "" },
        lerStorage(CHAVE_PERFIL) || {}
    );

    const $ = (id) => document.getElementById(id);

    /* =========================================================
       MÁSCARAS
    ========================================================= */
    function mascaraCPF(valor) {
        let v = valor.replace(/\D/g, "").slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return v;
    }

    function mascaraTelefone(valor) {
        const v = valor.replace(/\D/g, "").slice(0, 11);
        if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        if (v.length > 6) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        if (v.length > 2) return v.replace(/^(\d{2})(\d*)/, "($1) $2");
        if (v.length > 0) return v.replace(/^(\d*)/, "($1");
        return "";
    }

    function mascaraCEP(valor) {
        return valor.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    }

    $("cpf").addEventListener("input", (e) => { e.target.value = mascaraCPF(e.target.value); });
    $("telefone").addEventListener("input", (e) => { e.target.value = mascaraTelefone(e.target.value); });
    $("cep").addEventListener("input", (e) => { e.target.value = mascaraCEP(e.target.value); });
    $("numero").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });

    /* =========================================================
       MODAIS
    ========================================================= */
    let temporizadorSalvo = null;

    function abrirModal(id) {
        const m = $(id);
        if (m) m.classList.add("ativo");
    }

    function fecharModal(id) {
        const m = $(id);
        if (m) m.classList.remove("ativo");
    }

    function fecharTodos() {
        document.querySelectorAll(".modal-overlay.ativo").forEach((m) => m.classList.remove("ativo"));
    }

    function mostrarSalvo(texto) {
        $("textoSalvo").textContent = texto || "Suas alterações foram salvas com sucesso.";
        abrirModal("modal");
        clearTimeout(temporizadorSalvo);
        temporizadorSalvo = setTimeout(() => fecharModal("modal"), 2500);
    }

    // fechar: botões X / Cancelar, clique no fundo e tecla Esc
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay || e.target.closest("[data-fechar]")) {
                overlay.classList.remove("ativo");
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fecharTodos();
    });

    // deixa as funções acessíveis para onclick no HTML, se precisar
    window.abrirModal = abrirModal;
    window.fecharModal = fecharModal;

    /* =========================================================
       ATUALIZAR A TELA COM OS DADOS SALVOS
    ========================================================= */
    function nomeCompleto() {
        return `${perfil.nome || ""} ${perfil.sobrenome || ""}`.trim();
    }

    function atualizarTela() {
        $("nomePerfil").textContent = nomeCompleto() || "Nome Completo";
        $("emailPerfil").textContent = perfil.email;
        $("valorEmail").textContent = perfil.email;
        $("valorTelefone").textContent = perfil.telefone || "Não informado";
        if (perfil.foto) $("fotoPerfil").src = perfil.foto;
    }

    function preencherFormulario() {
        CAMPOS.forEach((campo) => {
            if (campo === "cidade") return;
            if (perfil[campo] !== undefined) $(campo).value = perfil[campo];
        });
    }

    /* =========================================================
       ESTADO / CIDADE (API IBGE)
    ========================================================= */
    function carregarCidades(uf, cidadeSelecionada) {
        const cidadeSelect = $("cidade");

        if (!uf) {
            cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
            return Promise.resolve();
        }

        cidadeSelect.innerHTML = '<option value="">Carregando...</option>';

        return fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then((r) => {
                if (!r.ok) throw new Error("Erro ao buscar cidades");
                return r.json();
            })
            .then((cidades) => {
                cidadeSelect.innerHTML = '<option value="">Selecione</option>';
                cidades.forEach((c) => {
                    const op = document.createElement("option");
                    op.value = c.nome;
                    op.textContent = c.nome;
                    cidadeSelect.appendChild(op);
                });
                if (cidadeSelecionada) cidadeSelect.value = cidadeSelecionada;
                validarFormulario();
            })
            .catch(() => {
                cidadeSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
                validarFormulario();
            });
    }

    $("estado").addEventListener("change", function () {
        carregarCidades(this.value);
        validarFormulario();
    });

    /* =========================================================
       BOTÃO SALVAR: só ativa com TODOS os campos preenchidos
    ========================================================= */
    function validarFormulario() {
        const completo = CAMPOS.every((campo) => $(campo).value.trim() !== "");
        $("botaoSalvar").disabled = !completo;
        $("avisoSalvar").style.display = completo ? "none" : "block";
        return completo;
    }

    CAMPOS.forEach((campo) => {
        $(campo).addEventListener("input", validarFormulario);
        $(campo).addEventListener("change", validarFormulario);
    });

    /* =========================================================
       SALVAR INFORMAÇÕES PESSOAIS (todos os campos)
    ========================================================= */
    $("botaoSalvar").addEventListener("click", () => {
        if (!validarFormulario()) return;
        CAMPOS.forEach((campo) => {
            perfil[campo] = $(campo).value.trim();
        });

        const ok = gravarStorage(CHAVE_PERFIL, perfil);
        atualizarTela();

        if (ok) {
            mostrarSalvo("Suas informações foram salvas com sucesso.");
        } else {
            mostrarSalvo("Não foi possível salvar neste navegador.");
        }
    });

    /* =========================================================
       ABAS + MENU LATERAL
    ========================================================= */
    const tabsContainer = document.querySelector(".tabs");
    const tabs = document.querySelectorAll(".tabs .tab");
    const contents = document.querySelectorAll(".content");
    const linksMenu = document.querySelectorAll(".nav-link[data-tab]");
    const abasValidas = ["personal", "account", "security"];

    const indicador = document.createElement("div");
    indicador.classList.add("tab-indicator");
    tabsContainer.appendChild(indicador);

    function posicionarIndicador() {
        const ativa = document.querySelector(".tabs .tab.active");
        if (!ativa) return;
        const c = tabsContainer.getBoundingClientRect();
        const t = ativa.getBoundingClientRect();
        indicador.style.width = `${t.width}px`;
        indicador.style.transform = `translateX(${t.left - c.left + tabsContainer.scrollLeft}px)`;
    }

    function ativarAba(id, atualizarHash = true) {
        if (!abasValidas.includes(id)) id = "personal";

        tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === id));
        contents.forEach((c) => c.classList.toggle("active", c.id === id));

        // destaca o item do menu lateral correspondente
        const menuAtivo = id === "account" ? "configuracoes" : "perfil";
        linksMenu.forEach((l) => l.classList.toggle("active", l.dataset.menu === menuAtivo));

        posicionarIndicador();

        if (atualizarHash) history.replaceState(null, "", `#${id}`);
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => ativarAba(tab.dataset.tab));
    });

    linksMenu.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            ativarAba(link.dataset.tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    window.addEventListener("resize", posicionarIndicador);
    window.addEventListener("hashchange", () => ativarAba(location.hash.slice(1), false));

    /* =========================================================
       EDITAR PERFIL (foto, nome, e-mail)
    ========================================================= */
    let fotoTemporaria = "";

    function abrirEditarPerfil() {
        fotoTemporaria = perfil.foto || "";
        $("previaFoto").src = perfil.foto || "./image/user-icon.png";
        $("editNome").value = nomeCompleto();
        $("editEmail").value = perfil.email;
        $("erroPerfil").textContent = "";
        abrirModal("modalPerfil");
    }

    $("botaoEditarPerfil").addEventListener("click", abrirEditarPerfil);
    $("botaoCamera").addEventListener("click", abrirEditarPerfil);

    // redimensiona a imagem para não estourar o limite do localStorage
    $("arquivoFoto").addEventListener("change", (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            $("erroPerfil").textContent = "Escolha um arquivo de imagem.";
            return;
        }

        const leitor = new FileReader();
        leitor.onload = () => {
            const img = new Image();
            img.onload = () => {
                const max = 300;
                const escala = Math.min(1, max / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * escala);
                canvas.height = Math.round(img.height * escala);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                fotoTemporaria = canvas.toDataURL("image/jpeg", 0.85);
                $("previaFoto").src = fotoTemporaria;
                $("erroPerfil").textContent = "";
            };
            img.src = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    });

    $("salvarPerfil").addEventListener("click", () => {
        const nome = $("editNome").value.trim().replace(/\s+/g, " ");
        const email = $("editEmail").value.trim();

        if (!nome) {
            $("erroPerfil").textContent = "Digite seu nome.";
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $("erroPerfil").textContent = "Digite um e-mail válido.";
            return;
        }

        const partes = nome.split(" ");
        perfil.nome = partes.shift();
        perfil.sobrenome = partes.join(" ");
        perfil.email = email;
        perfil.foto = fotoTemporaria;

        $("nome").value = perfil.nome;
        $("sobrenome").value = perfil.sobrenome;

        const ok = gravarStorage(CHAVE_PERFIL, perfil);
        atualizarTela();
        fecharModal("modalPerfil");
        mostrarSalvo(ok ? "Seu perfil foi atualizado." : "Não foi possível salvar neste navegador.");
    });

    /* =========================================================
       CONFIGURAÇÕES: ALTERAR E-MAIL / TELEFONE (com tela)
    ========================================================= */
    let tipoContato = "email";

    function abrirContato(tipo) {
        tipoContato = tipo;
        const campo = $("valorContato");
        $("erroContato").textContent = "";

        if (tipo === "email") {
            $("tituloContato").textContent = "Alterar e-mail";
            $("descricaoContato").textContent = "Informe o novo endereço de e-mail da sua conta.";
            $("labelContato").textContent = "Novo e-mail";
            campo.type = "email";
            campo.placeholder = "exemplo@gmail.com";
            campo.removeAttribute("maxlength");
            campo.value = perfil.email;
        } else {
            $("tituloContato").textContent = "Alterar telefone";
            $("descricaoContato").textContent = "Informe o novo número de telefone da sua conta.";
            $("labelContato").textContent = "Novo telefone";
            campo.type = "tel";
            campo.placeholder = "(11) 99999-9999";
            campo.maxLength = 15;
            campo.value = perfil.telefone || "";
        }

        abrirModal("modalContato");
        setTimeout(() => campo.focus(), 150);
    }

    document.querySelectorAll("[data-alterar]").forEach((botao) => {
        botao.addEventListener("click", () => abrirContato(botao.dataset.alterar));
    });

    $("valorContato").addEventListener("input", (e) => {
        if (tipoContato === "telefone") e.target.value = mascaraTelefone(e.target.value);
    });

    $("salvarContato").addEventListener("click", () => {
        const valor = $("valorContato").value.trim();

        if (tipoContato === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                $("erroContato").textContent = "Digite um e-mail válido.";
                return;
            }
            perfil.email = valor;
        } else {
            if (valor.replace(/\D/g, "").length < 10) {
                $("erroContato").textContent = "Digite um telefone com DDD.";
                return;
            }
            perfil.telefone = valor;
            $("telefone").value = valor;
        }

        const ok = gravarStorage(CHAVE_PERFIL, perfil);
        atualizarTela();
        fecharModal("modalContato");
        mostrarSalvo(
            ok
                ? (tipoContato === "email" ? "Seu e-mail foi alterado." : "Seu telefone foi alterado.")
                : "Não foi possível salvar neste navegador."
        );
    });

    // preferências de notificações (salvas ao mudar)
    const prefs = lerStorage("aromaNotificacoes") || {};
    document.querySelectorAll("[data-notificacao]").forEach((sw) => {
        const chave = sw.dataset.notificacao;
        if (chave in prefs) sw.checked = prefs[chave];
        sw.addEventListener("change", () => {
            prefs[chave] = sw.checked;
            gravarStorage("aromaNotificacoes", prefs);
        });
    });

    /* =========================================================
       ALTERAR SENHA (com tela)
    ========================================================= */
    function abrirSenha() {
        ["senhaAtual", "novaSenha", "confirmarSenha"].forEach((id) => {
            $(id).value = "";
            $(id).type = "password";
        });
        document.querySelectorAll(".ver-senha").forEach((b) => (b.textContent = "Mostrar"));
        $("erroSenha").textContent = "";
        abrirModal("modalSenha");
        setTimeout(() => $("senhaAtual").focus(), 150);
    }

    $("botaoMudarSenha").addEventListener("click", abrirSenha);
    document.querySelector('[data-acao="senha"]').addEventListener("click", abrirSenha);

    document.querySelectorAll(".ver-senha").forEach((botao) => {
        botao.addEventListener("click", () => {
            const campo = $(botao.dataset.ver);
            const mostrar = campo.type === "password";
            campo.type = mostrar ? "text" : "password";
            botao.textContent = mostrar ? "Ocultar" : "Mostrar";
        });
    });

    $("salvarSenha").addEventListener("click", () => {
        const atual = $("senhaAtual").value;
        const nova = $("novaSenha").value;
        const confirmar = $("confirmarSenha").value;
        const erro = $("erroSenha");
        const senhaSalva = lerStorage(CHAVE_SENHA);

        if (!atual) { erro.textContent = "Digite sua senha atual."; return; }
        if (senhaSalva && atual !== senhaSalva) { erro.textContent = "A senha atual está incorreta."; return; }
        if (nova.length < 8) { erro.textContent = "A nova senha precisa ter pelo menos 8 caracteres."; return; }
        if (nova === atual) { erro.textContent = "A nova senha deve ser diferente da atual."; return; }
        if (nova !== confirmar) { erro.textContent = "As senhas não são iguais."; return; }

        const ok = gravarStorage(CHAVE_SENHA, nova);
        fecharModal("modalSenha");
        mostrarSalvo(ok ? "Sua senha foi alterada." : "Não foi possível salvar neste navegador.");
    });

    /* =========================================================
       SEGURANÇA: demais ações
    ========================================================= */
    document.querySelector('[data-acao="dispositivo"]').addEventListener("click", () => {
        alert("Este é o dispositivo que você está usando atualmente.");
    });

    document.querySelector('[data-acao="historico"]').addEventListener("click", () => {
        alert("Histórico de acessos:\n\n• Este dispositivo — Acesso recente");
    });

    const doisFatores = $("doisFatores");
    doisFatores.checked = lerStorage("aromaDoisFatores") === true;
    doisFatores.addEventListener("change", function () {
        gravarStorage("aromaDoisFatores", this.checked);
        alert(this.checked
            ? "A autenticação em duas etapas foi ativada."
            : "A autenticação em duas etapas foi desativada.");
    });

    $("botaoExcluir").addEventListener("click", () => {
        if (!confirm("Tem certeza que deseja excluir sua conta?\n\nEssa ação não poderá ser desfeita.")) return;
        if (confirm("Deseja realmente excluir sua conta?")) {
            alert("A solicitação de exclusão da conta foi realizada.");
        }
    });

    /* =========================================================
       SAIR DA CONTA (com confirmação)
    ========================================================= */
    $("botaoSair").addEventListener("click", () => abrirModal("modalSair"));
    $("confirmarSair").addEventListener("click", sairDaConta);

    /* =========================================================
       INICIALIZAÇÃO
    ========================================================= */
    preencherFormulario();
    atualizarTela();
    validarFormulario();

    if (perfil.estado) {
        carregarCidades(perfil.estado, perfil.cidade);
    }

    const abaInicial = abasValidas.includes(location.hash.slice(1)) ? location.hash.slice(1) : "personal";
    ativarAba(abaInicial, false);

    // garante o posicionamento correto após as fontes carregarem
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(posicionarIndicador);
    }
});

/* =========================================================
   SAIR DA CONTA
========================================================= */
function sairDaConta() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../homePage_perfil/indexPerfil.html";
}