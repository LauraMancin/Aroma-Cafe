(() => {
  "use strict";

  /* ================= utilidades ================= */
  const KEY = "aromaCafe:gatos:v1";
  const $ = (s, r = document) => r.querySelector(s);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const norm = (t) => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const esc = (t) =>
    String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vazio = (m) => `<p class="vazio">${m}</p>`;
  const linha = (t, v) => `<div class="linha"><span class="titulo">${t}</span>${v}</div>`;

  $("#dataHoje").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  let timer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("visivel");
    clearTimeout(timer);
    timer = setTimeout(() => t.classList.remove("visivel"), 2800);
  }

  /* ================= dados ================= */
  function seed() {
    return {
      gatos: [
        { id: uid() + "a", nome: "Mingau", raca: "SRD", nascimento: "2023-03-10", olhos: "Verde", pelagem: "Branca, curta", deficiencia: "", situacao: "Disponível", foto: "", detalhes: "" },
        { id: uid() + "b", nome: "Pipoca", raca: "Siamês", nascimento: "2021-08-02", olhos: "Azul", pelagem: "Creme, média", deficiencia: "Cego de um olho", situacao: "Em processo", foto: "", detalhes: "" },
      ],
      itens: [
        { id: uid() + "c", nome: "Areia higiênica", unidade: "kg", estoque: 12, minimo: 10, consumo: 1 },
        { id: uid() + "d", nome: "Ração", unidade: "kg", estoque: 4, minimo: 6, consumo: 0.8 },
        { id: uid() + "e", nome: "Sachê", unidade: "un", estoque: 0, minimo: 20, consumo: 5 },
        { id: uid() + "f", nome: "Água", unidade: "L", estoque: 40, minimo: 15, consumo: 3 },
      ],
      vets: [],
      ongs: [],
    };
  }

  function carregar() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.gatos && s.itens && s.vets && s.ongs) return s;
    } catch {}
    return seed();
  }

  let estado = carregar();
  function persistir() {
    try {
      localStorage.setItem(KEY, JSON.stringify(estado));
    } catch {
      toast("Não foi possível salvar (armazenamento cheio). Use uma foto menor.");
    }
  }

  /* ================= regras ================= */
  // faltando (vermelho): 0 | baixo (laranja): abaixo do mínimo | em estoque (verde)
  function statusItem(i) {
    const e = Number(i.estoque) || 0;
    if (e <= 0) return { txt: "Faltando", cls: "faltando" };
    if (e < (Number(i.minimo) || 0)) return { txt: "Baixo", cls: "baixo" };
    return { txt: "Em estoque", cls: "ok" };
  }

  const SITUACAO = { "Disponível": "disponivel", "Em processo": "processo", "Adotado": "adotado" };

  function idade(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    const hoje = new Date();
    let meses = (hoje.getFullYear() - a) * 12 + hoje.getMonth() - (m - 1);
    if (hoje.getDate() < d) meses--;
    if (meses < 1) return "Menos de 1 mês";
    if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
    const anos = Math.floor(meses / 12);
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  const dataBR = (iso) => iso.split("-").reverse().join("/");
  const digitos = (t) => (t || "").replace(/\D/g, "");
  const zap = (t) => `<a href="https://wa.me/55${digitos(t)}" target="_blank" rel="noopener">${esc(t)}</a>`;
  const btnEditar = (tipo, id) => `<button class="btn-editar" data-editar="${tipo}" data-id="${id}">Editar</button>`;
  const cabeca = (nome, sub, dir = "") =>
    `<div class="linha"><div class="nome-categoria"><span class="rotulo">${esc(nome)}</span><span class="categoria">${esc(sub)}</span></div>${dir}</div>`;
  const num = (n) => Number(Number(n).toFixed(2));

  /* ================= cards ================= */
  function cardGato(g) {
    return `<article class="card-produto">
      ${g.foto ? `<img src="${g.foto}" alt="${esc(g.nome)}" />` : `<div class="sem-imagem">🐱</div>`}
      <div class="detalhes">
        ${cabeca(g.nome, g.raca)}
        ${linha("Situação", `<span class="status ${SITUACAO[g.situacao]}">${esc(g.situacao)}</span>`)}
        ${linha("Idade", `<span class="qntd" title="Nasc.: ${dataBR(g.nascimento)}">${idade(g.nascimento)}</span>`)}
        ${linha("Olhos", `<span class="qntd">${esc(g.olhos)}</span>`)}
        ${linha("Pelagem", `<span class="qntd">${esc(g.pelagem)}</span>`)}
        ${linha("Deficiência", g.deficiencia ? `<span class="qntd status sim">${esc(g.deficiencia)}</span>` : `<span class="status nao">Nenhuma</span>`)}
      </div>
      ${btnEditar("gato", g.id)}
    </article>`;
  }

  function cardItem(i) {
    const s = statusItem(i);
    const topo = Math.max((Number(i.minimo) || 0) * 2, Number(i.estoque) || 0, 1);
    const pct = Math.min(100, ((Number(i.estoque) || 0) / topo) * 100);
    const dias = i.consumo > 0 ? Math.floor(i.estoque / i.consumo) : null;
    const icone = { "Areia": "🪣", "Ração": "🥣", "Sachê": "🐟", "Água": "💧" };
    const emoji = Object.entries(icone).find(([k]) => norm(i.nome).includes(norm(k)))?.[1] || "📦";
    return `<article class="card-produto">
      <div class="sem-imagem">${emoji}</div>
      <div class="detalhes">
        ${cabeca(i.nome, `Mínimo: ${i.minimo || 0} ${i.unidade}`)}
        ${linha("Estoque", `<span class="status ${s.cls}">${s.txt}</span>`)}
        ${linha("Quantidade", `<span class="qntd">${num(i.estoque)} ${esc(i.unidade)}</span>`)}
        ${dias !== null ? linha("Duração", `<span class="qntd">~${dias} ${dias === 1 ? "dia" : "dias"}</span>`) : ""}
        <div class="barra ${s.cls}" aria-hidden="true"><span style="width:${pct}%"></span></div>
      </div>
      <div class="ajuste">
        <button type="button" data-ajuste="${i.id}" data-delta="-1" aria-label="Usar 1">−</button>
        <button type="button" data-ajuste="${i.id}" data-delta="1" aria-label="Repor 1">+</button>
      </div>
      ${btnEditar("item", i.id)}
    </article>`;
  }

  function cardVet(v) {
    return `<article class="card-produto">
      <div class="sem-imagem">🩺</div>
      <div class="detalhes">
        ${cabeca(v.nome, v.endereco || "Endereço não informado")}
        ${linha("Atende 24h", `<span class="status ${v.urgencia === "Sim" ? "ok" : "nao"}">${v.urgencia}</span>`)}
        ${linha("WhatsApp", `<span class="texto-detalhe">${zap(v.telefone)}</span>`)}
        ${v.detalhes ? `<span class="texto-detalhe">${esc(v.detalhes)}</span>` : ""}
      </div>
      ${btnEditar("vet", v.id)}
    </article>`;
  }

  function cardOng(o) {
    return `<article class="card-produto">
      <div class="sem-imagem">🐾</div>
      <div class="detalhes">
        ${cabeca(o.nome, o.cidade || "Cidade não informada")}
        ${linha("WhatsApp", `<span class="texto-detalhe">${zap(o.telefone)}</span>`)}
        ${o.contato ? linha("Contato", `<span class="texto-detalhe">${esc(o.contato)}</span>`) : ""}
        ${o.detalhes ? `<span class="texto-detalhe">${esc(o.detalhes)}</span>` : ""}
      </div>
      ${btnEditar("ong", o.id)}
    </article>`;
  }

  /* ================= renderização + busca/filtro ================= */
  function lista(sel, itens, card, msg) {
    $(sel).innerHTML = itens.length ? itens.map(card).join("") : vazio(msg);
  }
  const busca = (id, obj, campos) => norm(campos.map((c) => obj[c]).join(" ")).includes(norm($(id).value));

  function render() {
    const sit = $("#filtroSituacao").value;
    lista("#listaGatos", estado.gatos.filter((g) => (!sit || g.situacao === sit) && busca("#buscaGato", g, ["nome", "raca", "pelagem", "olhos", "deficiencia"])), cardGato, "Nenhum gato encontrado.");
    lista("#listaItens", estado.itens.filter((i) => busca("#buscaItem", i, ["nome"])), cardItem, "Nenhum item encontrado.");
    lista("#listaVets", estado.vets.filter((v) => busca("#buscaVet", v, ["nome", "endereco", "detalhes"])), cardVet, "Nenhuma veterinária cadastrada.");
    lista("#listaOngs", estado.ongs.filter((o) => busca("#buscaOng", o, ["nome", "cidade", "detalhes"])), cardOng, "Nenhuma ONG cadastrada.");
  }

  ["#buscaGato", "#buscaItem", "#buscaVet", "#buscaOng"].forEach((s) => $(s).addEventListener("input", render));
  $("#filtroSituacao").addEventListener("change", render);

  /* ================= foto ================= */
  let fotoAtual = "";
  function mostrarPreview() {
    const img = $("#previewImg");
    img.hidden = !fotoAtual;
    if (fotoAtual) img.src = fotoAtual;
  }

  function lerImagem(file) {
    return new Promise((ok, erro) => {
      const r = new FileReader();
      r.onerror = erro;
      r.onload = () => {
        const im = new Image();
        im.onerror = erro;
        im.onload = () => {
          const e = Math.min(1, 700 / Math.max(im.width, im.height));
          const c = document.createElement("canvas");
          c.width = im.width * e;
          c.height = im.height * e;
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          ok(c.toDataURL("image/jpeg", 0.82));
        };
        im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }

  $("#fotoGato").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      fotoAtual = await lerImagem(f);
      mostrarPreview();
    } catch {
      toast("Não foi possível ler essa imagem.");
    }
  });

  /* ================= formulários: novo / editar / excluir ================= */
  const CFG = {
    gato: { lista: "gatos", modal: "modalGato", form: "#formGato", nome: "gato" },
    item: { lista: "itens", modal: "modalItem", form: "#formItem", nome: "item" },
    vet: { lista: "vets", modal: "modalVet", form: "#formVet", nome: "veterinária" },
    ong: { lista: "ongs", modal: "modalOng", form: "#formOng", nome: "ONG" },
  };
  const tipoPorModal = Object.fromEntries(Object.entries(CFG).map(([t, c]) => [c.modal, t]));
  const artigo = { gato: "o", item: "o", vet: "a", ong: "a" };

  function abrir(tipo, item) {
    const c = CFG[tipo];
    const dlg = $("#" + c.modal);
    const f = $(c.form);
    f.reset();
    if (tipo === "gato") {
      fotoAtual = item?.foto || "";
      mostrarPreview();
    }
    f.elements["id"].value = item?.id || "";
    if (item) for (const [k, v] of Object.entries(item)) if (f.elements[k] && k !== "foto") f.elements[k].value = v;

    $("h2", dlg).textContent = (item ? "Editar " : "Nov" + artigo[tipo] + " ") + c.nome;
    $(".btn-salvar", dlg).textContent = item ? "Salvar alterações" : "Salvar " + c.nome;
    $(".btn-excluir", dlg).hidden = !item;
    Modal.mostrar(c.modal);
  }

  document.addEventListener("modal:novo", (e) => abrir(tipoPorModal[e.detail]));

  document.addEventListener("click", (e) => {
    const ed = e.target.closest("[data-editar]");
    if (ed) {
      const item = estado[CFG[ed.dataset.editar].lista].find((x) => x.id === ed.dataset.id);
      if (item) abrir(ed.dataset.editar, item);
      return;
    }

    // ajuste rápido do estoque (− usar / + repor)
    const aj = e.target.closest("[data-ajuste]");
    if (aj) {
      const item = estado.itens.find((x) => x.id === aj.dataset.ajuste);
      if (!item) return;
      item.estoque = Math.max(0, num(Number(item.estoque) + Number(aj.dataset.delta)));
      persistir();
      render();
      return;
    }

    const ex = e.target.closest("[data-excluir]");
    if (ex) {
      const c = CFG[ex.dataset.excluir];
      const id = $(c.form).elements["id"].value;
      if (!id || !confirm("Tem certeza que deseja excluir? Essa ação não pode ser desfeita.")) return;
      estado[c.lista] = estado[c.lista].filter((x) => x.id !== id);
      persistir();
      render();
      $("#" + c.modal).close();
      toast("Item excluído.");
    }
  });

  Object.entries(CFG).forEach(([tipo, c]) => {
    $(c.form).addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      ["estoque", "minimo", "consumo"].forEach((k) => {
        if (k in d) d[k] = d[k] === "" ? 0 : Number(d[k]);
      });
      if (tipo === "gato") d.foto = fotoAtual;
      const l = estado[c.lista];
      const i = l.findIndex((x) => x.id === d.id);
      if (i >= 0) l[i] = { ...l[i], ...d };
      else l.push({ ...d, id: uid() });
      persistir();
      render();
      $("#" + c.modal).close();
      toast(i >= 0 ? "Alterações salvas!" : "Cadastrado com sucesso!");
    });
  });

  /* ================= máscara de telefone ================= */
  document.querySelectorAll(".mascara-tel").forEach((inp) =>
    inp.addEventListener("input", () => {
      const d = inp.value.replace(/\D/g, "").slice(0, 11);
      inp.value =
        d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
        : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
        : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
        : d;
    })
  );

  render();
})();