document.addEventListener("DOMContentLoaded", () => {

    const campos = document.querySelectorAll(
      ".contatoForm input, .contatoForm textarea"
    );
  
    const botaoEnviar = document.querySelector(".botaoEnviar");
  
    if (!botaoEnviar || campos.length === 0) {
      console.error("Formulário de contato não encontrado.");
      return;
    }
  
    // =========================
    // VALIDAÇÃO DE E-MAIL
    // =========================
  
    function emailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // =========================
    // REMOVER ERRO
    // =========================
  
    function removerMensagemErro(campo) {
  
      campo.classList.remove("campo-invalido-contato");
  
      const erro = campo.parentElement.querySelector(
        ".mensagem-erro-contato"
      );
  
      if (erro) {
        erro.remove();
      }
    }
  
    // =========================
    // MOSTRAR ERRO
    // =========================
  
    function mostrarErro(campo, mensagem) {
  
      removerMensagemErro(campo);
  
      campo.classList.add("campo-invalido-contato");
  
      const erro = document.createElement("span");
  
      erro.className = "mensagem-erro-contato";
      erro.textContent = mensagem;
  
      campo.parentElement.appendChild(erro);
    }
  
    // =========================
    // VALIDAR CAMPO
    // =========================
  
    function validarCampo(campo) {
  
      const valor = campo.value.trim();
  
      removerMensagemErro(campo);
  
      if (valor === "") {
        mostrarErro(campo, "Preencha esse campo");
        return false;
      }
  
      if (campo.type === "email" && !emailValido(valor)) {
        mostrarErro(campo, "Digite um e-mail válido");
        return false;
      }
  
      return true;
    }
  
    // =========================
    // VERIFICAR BOTÃO
    // =========================
  
    function atualizarBotao() {
  
      const todosPreenchidos = [...campos].every(
        (campo) => campo.value.trim() !== ""
      );
  
      if (todosPreenchidos) {
  
        botaoEnviar.style.opacity = "1";
        botaoEnviar.style.cursor = "pointer";
  
      } else {
  
        botaoEnviar.style.opacity = "0.7";
        botaoEnviar.style.cursor = "not-allowed";
  
      }
    }
  
    // =========================
    // DIGITAÇÃO NOS CAMPOS
    // =========================
  
    campos.forEach((campo) => {
  
      campo.addEventListener("input", () => {
  
        if (campo.value.trim() !== "") {
          validarCampo(campo);
        } else {
          removerMensagemErro(campo);
        }
  
        atualizarBotao();
      });
  
      campo.addEventListener("blur", () => {
  
        validarCampo(campo);
        atualizarBotao();
  
      });
  
    });
  
    // =========================
    // CLIQUE EM ENVIAR
    // =========================
  
    botaoEnviar.addEventListener("click", (event) => {
  
      event.preventDefault();
  
      let formularioValido = true;
  
      campos.forEach((campo) => {
  
        const valido = validarCampo(campo);
  
        if (!valido) {
          formularioValido = false;
        }
  
      });
  
      atualizarBotao();
  
      // Se tiver algum erro, não envia
      if (!formularioValido) {
        return;
      }
  
      // Tudo correto
      mostrarPopup();
  
      // Limpa os campos
      campos.forEach((campo) => {
        campo.value = "";
        removerMensagemErro(campo);
      });
  
      atualizarBotao();
  
    });
  
    // =========================
    // POPUP
    // =========================
  
    function mostrarPopup() {
  
      const overlay = document.createElement("div");
  
      overlay.className = "popup-overlay-contato";
  
      overlay.innerHTML = `
        <div class="popup-contato">
  
          <button
            class="popup-fechar"
            type="button"
            aria-label="Fechar"
          >
            &times;
          </button>
  
          <div class="popup-icone">
            ✓
          </div>
  
          <h2>Mensagem enviada!</h2>
  
          <p>
            Sua mensagem foi enviada com sucesso.
          </p>
  
          <p class="popup-texto-secundario">
            Agradecemos pelo contato. Em breve nossa equipe
            entrará em contato com você.
          </p>
  
          <button
            class="popup-ok"
            type="button"
          >
            Entendi
          </button>
  
        </div>
      `;
  
      document.body.appendChild(overlay);
  
      // Fechar pelo X
      const botaoFechar = overlay.querySelector(".popup-fechar");
  
      botaoFechar.addEventListener("click", () => {
        overlay.remove();
      });
  
      // Fechar pelo botão Entendi
      const botaoOk = overlay.querySelector(".popup-ok");
  
      botaoOk.addEventListener("click", () => {
        overlay.remove();
      });
  
      // Fechar clicando fora do popup
      overlay.addEventListener("click", (event) => {
  
        if (event.target === overlay) {
          overlay.remove();
        }
  
      });
  
    }
  
    // =========================
    // ESTADO INICIAL
    // =========================
  
    atualizarBotao();
  
  });