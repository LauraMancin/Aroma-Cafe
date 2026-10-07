document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. MÁSCARAS E MÁXIMO DE CARACTERES
    // ==========================================

    // Máscara para CPF (000.000.000-00)
    const cpfInput = document.querySelector('input[placeholder*="CPF"], input[maxlength="12"], input[maxlength="14"]');
    if (cpfInput) {
        cpfInput.setAttribute("maxlength", "14");
        cpfInput.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // Máscara para Número/Contato ((11) 99999-9999)
    const telInput = document.querySelector('input[type="tel"], input[placeholder*="99999-9999"]');
    if (telInput) {
        telInput.setAttribute("maxlength", "15");
        telInput.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d)(\d{4})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // Máscara para CEP (00000-000)
    const cepInput = document.querySelector('input[placeholder*="00000-000"]');
    if (cepInput) {
        cepInput.setAttribute("maxlength", "9");
        cepInput.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 8) v = v.slice(0, 8);
            v = v.replace(/^(\d{5})(\d)/, "$1-$2");
            e.target.value = v;
        });
    }

    // Apenas números para campos numéricos
    const inputsNumero = document.querySelectorAll('input[type="number"]');
    inputsNumero.forEach((input) => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
        });
    });

    // ==========================================
    // 2. SISTEMA DE ABAS + LINHA ROSA DESLIZANTE
    // ==========================================
    const tabsContainer = document.querySelector(".tabs");
    const tabs = document.querySelectorAll(".tabs .tab");
    const contents = document.querySelectorAll(".content");

    if (tabsContainer && tabs.length > 0) {
        // Criar elemento dinâmico da linha rosa indicador
        const indicator = document.createElement("div");
        indicator.classList.add("tab-indicator");
        tabsContainer.appendChild(indicator);

        // Função para calcular e deslizar o indicador
        function posicionarIndicador(tabAtiva) {
            const containerRect = tabsContainer.getBoundingClientRect();
            const tabRect = tabAtiva.getBoundingClientRect();

            indicator.style.width = `${tabRect.width}px`;
            indicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
        }

        // Posiciona a linha na aba ativa inicial ao carregar a página
        const abaAtivaInicial = document.querySelector(".tabs .tab.active") || tabs[0];
        posicionarIndicador(abaAtivaInicial);

        // Troca de abas ao clicar
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                // Remove ativas das abas e conteúdos
                tabs.forEach((t) => t.classList.remove("active"));
                contents.forEach((c) => c.classList.remove("active"));

                // Ativa a aba atual
                tab.classList.add("active");

                // Move a linha rosa com animação
                posicionarIndicador(tab);

                // Mostra o conteúdo correspondente
                const target = tab.getAttribute("data-tab");
                const contentEl = document.getElementById(target);
                if (contentEl) {
                    contentEl.classList.add("active");
                }
            });
        });

        // Reposiciona a linha caso o usuário redimensione a janela
        window.addEventListener("resize", () => {
            const tabAtiva = document.querySelector(".tabs .tab.active");
            if (tabAtiva) posicionarIndicador(tabAtiva);
        });
    }

    // ==========================================
    // 3. SELEÇÃO DE ESTADOS E CIDADES (IBGE API)
    // ==========================================
    const estadoSelect = document.getElementById("estado");
    if (estadoSelect) {
        estadoSelect.addEventListener("change", function () {
            let uf = this.value;
            let cidadeSelect = document.getElementById("cidade");

            if (!uf) {
                cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
                return;
            }

            cidadeSelect.innerHTML = "<option>Carregando...</option>";

            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
                .then((response) => response.json())
                .then((cidades) => {
                    cidadeSelect.innerHTML = '<option value="">Selecione</option>';
                    cidades.forEach((cidade) => {
                        let option = document.createElement("option");
                        option.value = cidade.nome;
                        option.textContent = cidade.nome;
                        cidadeSelect.appendChild(option);
                    });
                })
                .catch(() => {
                    cidadeSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
                });
        });
    }

    // ==========================================
    // 4. EVENTOS DO MODAL
    // ==========================================
    const modal = document.getElementById("modal");
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === this) fecharModal();
        });
    }

    // ==========================================
    // 5. ATUALIZAÇÃO DO NOME DO PERFIL EM TEMPO REAL
    // ==========================================
    // Tenta encontrar os campos de nome e sobrenome
    const inputNome = document.getElementById("nome") || document.querySelector('input[name="nome"]');
    const inputSobrenome = document.getElementById("sobrenome") || document.querySelector('input[name="sobrenome"]');
    // Seleciona o elemento do título do perfil lá em cima (ex: <h2> ou <h3>)
    const tituloPerfil = document.querySelector(".profile-info h2, .profile-name, .user-info h2") || document.querySelector("h2");

    function atualizarNomePerfil() {
        if (!tituloPerfil) return;

        const nome = inputNome ? inputNome.value.trim() : "";
        const sobrenome = inputSobrenome ? inputSobrenome.value.trim() : "";

        // Se ambos estiverem vazios, mantém "Nome Completo", senão junta Nome + Sobrenome
        if (!nome && !sobrenome) {
            tituloPerfil.textContent = "Nome Completo";
        } else {
            tituloPerfil.textContent = `${nome} ${sobrenome}`.trim();
        }
    }

    if (inputNome) inputNome.addEventListener("input", atualizarNomePerfil);
    if (inputSobrenome) inputSobrenome.addEventListener("input", atualizarNomePerfil);
});

// ==========================================
// FUNÇÕES GLOBAIS (MODAL E LOGOUT)
// ==========================================
function abrirModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("ativo");
}

function fecharModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("ativo");
}

function sairDaConta() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../homePage_perfil/indexPerfil.html";
}