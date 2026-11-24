(() => {
  "use strict";

  const KEY = "aromaCafe:configuracoes:v1";
  const $ = (s, r = document) => r.querySelector(s);

  const padrao = {
    perfil: {
      nome:"",
      email:"",
      telefone:"",
      cargo:"Administrador"
    },

    notificacoes: {
      estoque:true,
      adocao:true,
      reservas:true,
      sistema:true
    },

    geral: {
      idioma:"pt-BR",
      formatoData:"dd/mm/aaaa",
      manterSessao:false
    }
  };

  let dados;

  try {
    const salvo = JSON.parse(localStorage.getItem(KEY));

    dados = salvo && typeof salvo === "object"
      ? {
          perfil:{...padrao.perfil,...salvo.perfil},
          notificacoes:{...padrao.notificacoes,...salvo.notificacoes},
          geral:{...padrao.geral,...salvo.geral}
        }
      : structuredClone(padrao);

  } catch {
    dados = structuredClone(padrao);
  }

  let timer;

  function toast(mensagem) {
    const elemento = $("#toast");

    elemento.textContent = mensagem;
    elemento.classList.add("visivel");

    clearTimeout(timer);

    timer = setTimeout(() => {
      elemento.classList.remove("visivel");
    }, 2800);
  }

  function salvar() {
    try {
      localStorage.setItem(KEY, JSON.stringify(dados));
      return true;

    } catch {
      toast("Não foi possível salvar as configurações neste navegador.");
      return false;
    }
  }

  function preencherFormulario(form, valores) {
    Object.entries(valores).forEach(([chave, valor]) => {
      const campo = form.elements.namedItem(chave);

      if (!campo) return;

      if (campo.type === "checkbox") {
        campo.checked = Boolean(valor);
      } else {
        campo.value = valor ?? "";
      }
    });
  }

  function lerFormulario(form) {
    const valores = {};

    for (const campo of form.elements) {
      if (!campo.name) continue;

      valores[campo.name] =
        campo.type === "checkbox"
          ? campo.checked
          : campo.value.trim();
    }

    return valores;
  }

  const formPerfil = $("#formPerfil");
  const formPreferencias = $("#formPreferencias");
  const formGeral = $("#formGeral");

  preencherFormulario(formPerfil, dados.perfil);
  preencherFormulario(formPreferencias, dados.notificacoes);
  preencherFormulario(formGeral, dados.geral);

  // Salvar perfil administrativo
  formPerfil.addEventListener("submit", e => {
    e.preventDefault();

    dados.perfil = {
      ...dados.perfil,
      ...lerFormulario(formPerfil)
    };

    if (salvar()) {
      toast("Perfil administrativo atualizado!");
    }
  });

  // Salvar preferências de notificações
  formPreferencias.addEventListener("submit", e => {
    e.preventDefault();

    dados.notificacoes = lerFormulario(formPreferencias);

    if (salvar()) {
      toast("Preferências de notificações salvas!");
    }
  });

  // Salvar configurações gerais
  formGeral.addEventListener("submit", e => {
    e.preventDefault();

    dados.geral = lerFormulario(formGeral);

    if (salvar()) {
      toast("Configurações gerais salvas!");
    }
  });

  // Restaurar configurações padrão
  $("#restaurarPadrao").addEventListener("click", () => {
    if (!confirm("Deseja restaurar as preferências padrão? Os dados do perfil também serão limpos.")) {
      return;
    }

    dados = structuredClone(padrao);

    preencherFormulario(formPerfil, dados.perfil);
    preencherFormulario(formPreferencias, dados.notificacoes);
    preencherFormulario(formGeral, dados.geral);

    if (salvar()) {
      toast("Preferências restauradas.");
    }
  });

})();