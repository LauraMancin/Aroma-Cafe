(() => {
  "use strict";

  const KEY = "aromaCafe:notificacoes:v1";
  const $ = (s, r = document) => r.querySelector(s);

  const escapeHTML = (valor) => String(valor ?? "").replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])
  );

  const iniciais = [
    {
      id:"n1",
      tipo:"adocao",
      icone:"♥",
      titulo:"Nova solicitação de adoção",
      mensagem:"Mariane demonstrou interesse em conhecer a Amora. Verifique os dados e agende uma visita.",
      tempo:"Há 12 minutos",
      lida:false
    },
    {
      id:"n2",
      tipo:"estoque",
      icone:"☕",
      titulo:"Estoque abaixo do mínimo",
      mensagem:"Café especial: restam 4 unidades. Confira a necessidade de reposição.",
      tempo:"Há 1 hora",
      lida:false
    },
    {
      id:"n3",
      tipo:"reserva",
      icone:"▦",
      titulo:"Reserva confirmada",
      mensagem:"Lucas confirmou uma reserva para hoje às 15h30.",
      tempo:"Há 2 horas",
      lida:false
    },
    {
      id:"n4",
      tipo:"sistema",
      icone:"✓",
      titulo:"Cadastro atualizado",
      mensagem:"As informações do catálogo foram salvas com sucesso.",
      tempo:"Ontem",
      lida:true
    },
    {
      id:"n5",
      tipo:"adocao",
      icone:"♥",
      titulo:"Acompanhamento de adoção",
      mensagem:"A adoção do Mingau foi registrada. Lembre-se de acompanhar a adaptação.",
      tempo:"Ontem",
      lida:true
    }
  ];

  let notificacoes;

  try {
    notificacoes = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(notificacoes)) notificacoes = iniciais;
  } catch {
    notificacoes = iniciais;
  }

  function salvar() {
    try {
      localStorage.setItem(KEY, JSON.stringify(notificacoes));
    } catch {
      alert("Não foi possível salvar as notificações neste navegador.");
    }
  }

  function render() {
    const busca = $("#buscaNotificacao").value.trim().toLocaleLowerCase("pt-BR");
    const tipo = $("#filtroTipo").value;
    const status = $("#filtroStatus").value;

    const filtradas = notificacoes.filter(n => {
      const correspondeBusca =
        `${n.titulo} ${n.mensagem}`.toLocaleLowerCase("pt-BR").includes(busca);

      const correspondeTipo = tipo === "todas" || n.tipo === tipo;

      const correspondeStatus =
        status === "todas" || (status === "lidas" ? n.lida : !n.lida);

      return correspondeBusca && correspondeTipo && correspondeStatus;
    });

    $("#totalNotificacoes").textContent = notificacoes.length;
    $("#naoLidas").textContent = notificacoes.filter(n => !n.lida).length;
    $("#lidas").textContent = notificacoes.filter(n => n.lida).length;

    $("#listaNotificacoes").innerHTML = filtradas.length
      ? filtradas.map(n => `
        <article class="notificacao-item ${n.lida ? "" : "nao-lida"}">
          <div class="notif-icone ${escapeHTML(n.tipo)}">
            ${escapeHTML(n.icone)}
          </div>

          <div class="notif-conteudo">
            <div class="notif-titulo-linha">
              <h3>${escapeHTML(n.titulo)}</h3>
              ${n.lida ? "" : '<span class="ponto-nao-lida" title="Não lida"></span>'}
            </div>

            <p>${escapeHTML(n.mensagem)}</p>
            <small>${escapeHTML(n.tempo)}</small>

            <div class="notif-acoes">
              ${n.lida ? "" : `
                <button type="button" data-acao="ler" data-id="${escapeHTML(n.id)}">
                  Marcar como lida
                </button>
              `}
              <button type="button" data-acao="excluir" data-id="${escapeHTML(n.id)}">
                Excluir
              </button>
            </div>
          </div>
        </article>
      `).join("")
      : '<p class="vazio-notificacoes">Nenhuma notificação encontrada para esse filtro.</p>';
  }

  $("#listaNotificacoes").addEventListener("click", e => {
    const botao = e.target.closest("button[data-acao]");
    if (!botao) return;

    const item = notificacoes.find(n => n.id === botao.dataset.id);
    if (!item) return;

    if (botao.dataset.acao === "ler") {
      item.lida = true;
    }

    if (botao.dataset.acao === "excluir") {
      notificacoes = notificacoes.filter(n => n.id !== item.id);
    }

    salvar();
    render();
  });

  ["buscaNotificacao", "filtroTipo", "filtroStatus"].forEach(id => {
    const evento = id === "buscaNotificacao" ? "input" : "change";
    $("#" + id).addEventListener(evento, render);
  });

  $("#marcarTodas").addEventListener("click", () => {
    notificacoes.forEach(n => n.lida = true);
    salvar();
    render();
  });

  $("#limparLidas").addEventListener("click", () => {
    const quantidade = notificacoes.filter(n => n.lida).length;

    if (!quantidade) return;

    if (!confirm(`Deseja excluir ${quantidade} notificação(ões) já lida(s)?`)) {
      return;
    }

    notificacoes = notificacoes.filter(n => !n.lida);
    salvar();
    render();
  });

  render();
})();