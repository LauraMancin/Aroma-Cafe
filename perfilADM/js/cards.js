(() => {
  "use strict";

  /* ================= utilidades ================= */
  const KEY = "aromaCafe:estoque:v1";
  const $ = (s, r = document) => r.querySelector(s);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const norm = (t) => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const moeda = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (t) =>
    String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vazio = (msg) => `<p class="vazio">${msg}</p>`;

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("visivel");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visivel"), 2800);
  }

  /* ================= dados (localStorage) ================= */
  function seed() {
    const forn = ["Torrifação Serra", "Laticínios do Vale", "Atacado Central", "Granja Santa Rita", "Embalagens Bom Pack"].map(
      (nome, i) => ({ id: uid() + i, nome, tipo: i === 0 ? "Café" : i === 1 ? "Bebida" : "Outro", telefone: "", detalhes: "" })
    );
    const graos = { id: uid() + "g", nome: "Grão de café", fornecedor: forn[0].id, preco: 60, unidade: "kg", estoque: 8, minimo: 2, detalhes: "" };
    const leite = { id: uid() + "l", nome: "Leite integral", fornecedor: forn[1].id, preco: 5, unidade: "L", estoque: 30, minimo: 10, detalhes: "" };
    const gatoccino = {
      id: uid() + "p", nome: "Gatoccino", tipo: "Café", preco: 12, estoque: 24, minimo: 30, imagem: "", detalhes: "",
      receita: [{ ingId: graos.id, qtd: 18, un: "g" }, { ingId: leite.id, qtd: 200, un: "ml" }],
    };
    return { produtos: [gatoccino], ingredientes: [graos, leite], fornecedores: forn };
  }

  function carregar() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.produtos && s.ingredientes && s.fornecedores) return s;
    } catch {}
    return seed();
  }

  let estado = carregar();

  function persistir() {
    try {
      localStorage.setItem(KEY, JSON.stringify(estado));
    } catch {
      toast("Não foi possível salvar (armazenamento cheio). Use uma imagem menor.");
    }
  }

  /* ================= status do estoque ================= */
  // faltando (vermelho): 0 | baixo (laranja): abaixo do mínimo | em estoque (verde)
  function status(item) {
    const e = Number(item.estoque) || 0;
    const m = Number(item.minimo) || 0;
    if (e <= 0) return { txt: "Faltando", cls: "faltando" };
    if (e < m) return { txt: "Baixo", cls: "baixo" };
    return { txt: "Em estoque", cls: "ok" };
  }

  /* ================= cards ================= */
  const nomeFornecedor = (id) => estado.fornecedores.find((f) => f.id === id)?.nome || "Sem fornecedor";
  const btnEditar = (tipo, id) => `<button class="btn-editar" data-editar="${tipo}" data-id="${id}">Editar</button>`;
  const linha = (titulo, valor) =>
    `<div class="linha"><span class="titulo">${titulo}</span>${valor}</div>`;

  function cardProduto(p) {
    const s = status(p);
    return `<article class="card-produto">
      ${p.imagem ? `<img src="${p.imagem}" alt="${esc(p.nome)}" />` : `<div class="sem-imagem">☕</div>`}
      <div class="detalhes">
        <div class="linha">
          <div class="nome-categoria">
            <span class="rotulo">${esc(p.nome)}</span>
            <span class="categoria">${esc(p.tipo)}</span>
          </div>
          <span class="valor">${moeda(p.preco)}</span>
        </div>
        ${linha("Estoque", `<span class="status ${s.cls}">${s.txt}</span>`)}
        ${linha("Porções", `<span class="qntd">${p.estoque}</span>`)}
      </div>
      ${btnEditar("produto", p.id)}
    </article>`;
  }

  function cardIngrediente(i) {
    const s = status(i);
    return `<article class="card-produto">
      <div class="sem-imagem">🧂</div>
      <div class="detalhes">
        <div class="linha">
          <div class="nome-categoria">
            <span class="rotulo">${esc(i.nome)}</span>
            <span class="categoria">${esc(nomeFornecedor(i.fornecedor))}</span>
          </div>
          <span class="valor">${moeda(i.preco)}/${esc(i.unidade)}</span>
        </div>
        ${linha("Estoque", `<span class="status ${s.cls}">${s.txt}</span>`)}
        ${linha("Quantidade", `<span class="qntd">${i.estoque} ${esc(i.unidade)}</span>`)}
      </div>
      ${btnEditar("ingrediente", i.id)}
    </article>`;
  }

  function cardFornecedor(f) {
    const digitos = (f.telefone || "").replace(/\D/g, "");
    const zap = digitos
      ? `<a href="https://wa.me/55${digitos}" target="_blank" rel="noopener">${esc(f.telefone)}</a>`
      : "Não informado";
    const usados = estado.ingredientes.filter((i) => i.fornecedor === f.id).length;
    return `<article class="card-produto">
      <div class="sem-imagem">🚚</div>
      <div class="detalhes">
        <div class="linha">
          <div class="nome-categoria">
            <span class="rotulo">${esc(f.nome)}</span>
            <span class="categoria">${esc(f.tipo)}</span>
          </div>
        </div>
        ${linha("WhatsApp", `<span class="texto-detalhe">${zap}</span>`)}
        ${linha("Ingredientes", `<span class="qntd">${usados}</span>`)}
      </div>
      ${btnEditar("fornecedor", f.id)}
    </article>`;
  }

  /* ================= renderização + filtros ================= */
  function renderProdutos() {
    const busca = norm($("#buscaProduto").value);
    const cat = $("#filtroCategoria").value;
    const lista = estado.produtos.filter(
      (p) => (!cat || p.tipo === cat) && norm(`${p.nome} ${p.tipo} ${p.detalhes}`).includes(busca)
    );
    $("#listaProdutos").innerHTML = lista.length ? lista.map(cardProduto).join("") : vazio("Nenhum produto encontrado.");
  }

  function renderIngredientes() {
    const busca = norm($("#buscaIngrediente").value);
    const lista = estado.ingredientes.filter((i) =>
      norm(`${i.nome} ${nomeFornecedor(i.fornecedor)} ${i.detalhes}`).includes(busca)
    );
    $("#listaIngredientes").innerHTML = lista.length ? lista.map(cardIngrediente).join("") : vazio("Nenhum ingrediente encontrado.");
  }

  function renderFornecedores() {
    const busca = norm($("#buscaFornecedor").value);
    const lista = estado.fornecedores.filter((f) => norm(`${f.nome} ${f.tipo} ${f.detalhes}`).includes(busca));
    $("#listaFornecedores").innerHTML = lista.length ? lista.map(cardFornecedor).join("") : vazio("Nenhum fornecedor encontrado.");
  }

  const render = () => {
    renderProdutos();
    renderIngredientes();
    renderFornecedores();
  };

  $("#buscaProduto").addEventListener("input", renderProdutos);
  $("#filtroCategoria").addEventListener("change", renderProdutos);
  $("#buscaIngrediente").addEventListener("input", renderIngredientes);
  $("#buscaFornecedor").addEventListener("input", renderFornecedores);

  /* ================= imagem do produto ================= */
  let imgAtual = "";

  function mostrarPreview() {
    const img = $("#previewImg");
    img.hidden = !imgAtual;
    if (imgAtual) img.src = imgAtual;
  }

  // redimensiona para caber no localStorage
  function lerImagem(file) {
    return new Promise((ok, erro) => {
      const leitor = new FileReader();
      leitor.onerror = erro;
      leitor.onload = () => {
        const im = new Image();
        im.onerror = erro;
        im.onload = () => {
          const esc = Math.min(1, 700 / Math.max(im.width, im.height));
          const c = document.createElement("canvas");
          c.width = im.width * esc;
          c.height = im.height * esc;
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          ok(c.toDataURL("image/jpeg", 0.82));
        };
        im.src = leitor.result;
      };
      leitor.readAsDataURL(file);
    });
  }

  $("#imagemProduto").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      imgAtual = await lerImagem(file);
      mostrarPreview();
    } catch {
      toast("Não foi possível ler essa imagem.");
    }
  });

  /* ================= ingredientes do produto (receita) ================= */
  let receitaAtual = [];

  function popularIngredientes() {
    $("#recIng").innerHTML = estado.ingredientes.length
      ? estado.ingredientes.map((i) => `<option value="${i.id}" data-un="${esc(i.unidade)}">${esc(i.nome)}</option>`).join("")
      : `<option value="">Cadastre ingredientes primeiro</option>`;
    sincronizarUnidade();
  }

  function sincronizarUnidade() {
    const un = $("#recIng").selectedOptions[0]?.dataset.un;
    if (un) $("#recUn").value = un;
  }
  $("#recIng").addEventListener("change", sincronizarUnidade);

  function renderReceita() {
    const itens = receitaAtual
      .map((r, idx) => {
        const ing = estado.ingredientes.find((i) => i.id === r.ingId);
        return ing
          ? `<li><span>${esc(ing.nome)} — <strong>${r.qtd} ${esc(r.un)}</strong></span>
             <button type="button" data-remover="${idx}">Excluir</button></li>`
          : "";
      })
      .join("");
    $("#listaReceita").innerHTML = itens || `<li class="vazio-receita">Nenhum ingrediente adicionado.</li>`;
  }

  $("#btnAddIng").addEventListener("click", () => {
    const ingId = $("#recIng").value;
    const qtd = Number($("#recQtd").value);
    const un = $("#recUn").value;
    if (!ingId || !(qtd > 0)) return toast("Escolha o ingrediente e informe uma quantidade maior que zero.");
    const existente = receitaAtual.findIndex((r) => r.ingId === ingId);
    if (existente >= 0) receitaAtual[existente] = { ingId, qtd, un };
    else receitaAtual.push({ ingId, qtd, un });
    $("#recQtd").value = "";
    renderReceita();
  });

  $("#listaReceita").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remover]");
    if (!b) return;
    receitaAtual.splice(Number(b.dataset.remover), 1);
    renderReceita();
  });

  /* ================= formulários (novo / editar / excluir) ================= */
  const CFG = {
    produto: { lista: "produtos", modal: "modalProduto", form: "#formProduto", textos: ["Novo produto", "Editar produto", "Salvar produto", "Salvar alterações"] },
    ingrediente: { lista: "ingredientes", modal: "modalIngrediente", form: "#formIngrediente", textos: ["Novo ingrediente", "Editar ingrediente", "Salvar ingrediente", "Salvar alterações"] },
    fornecedor: { lista: "fornecedores", modal: "modalFornecedor", form: "#formFornecedor", textos: ["Novo fornecedor", "Editar fornecedor", "Salvar fornecedor", "Salvar alterações"] },
  };
  const tipoPorModal = Object.fromEntries(Object.entries(CFG).map(([t, c]) => [c.modal, t]));

  function popularFornecedores() {
    $("#selFornecedor").innerHTML =
      `<option value="">Sem fornecedor</option>` +
      estado.fornecedores.map((f) => `<option value="${f.id}">${esc(f.nome)}</option>`).join("");
  }

  function abrir(tipo, item) {
    const c = CFG[tipo];
    const dlg = $("#" + c.modal);
    const f = $(c.form);
    f.reset();

    if (tipo === "ingrediente") popularFornecedores();
    if (tipo === "produto") {
      imgAtual = item?.imagem || "";
      receitaAtual = structuredClone(item?.receita || []);
      popularIngredientes();
      mostrarPreview();
      renderReceita();
    }

    f.elements["id"].value = item?.id || "";
    if (item) {
      for (const [k, v] of Object.entries(item)) {
        const el = f.elements[k];
        if (el && typeof v !== "object") el.value = v;
      }
    }

    const novo = item ? 1 : 0;
    $("h2", dlg).textContent = c.textos[novo];
    $(".btn-salvar", dlg).textContent = c.textos[novo + 2];
    $(".btn-excluir", dlg).hidden = !item;
    Modal.mostrar(c.modal);
  }

  // botões "+ Novo ..."
  document.addEventListener("modal:novo", (e) => abrir(tipoPorModal[e.detail]));

  // botões "Editar" dos cards
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-editar]");
    if (!b) return;
    const tipo = b.dataset.editar;
    const item = estado[CFG[tipo].lista].find((x) => x.id === b.dataset.id);
    if (item) abrir(tipo, item);
  });

  // salvar
  Object.entries(CFG).forEach(([tipo, c]) => {
    $(c.form).addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const d = Object.fromEntries(new FormData(f));
      ["preco", "estoque", "minimo"].forEach((k) => {
        if (k in d) d[k] = d[k] === "" ? 0 : Number(d[k]);
      });
      if (tipo === "produto") {
        d.imagem = imgAtual;
        d.receita = receitaAtual;
      }
      const lista = estado[c.lista];
      const i = lista.findIndex((x) => x.id === d.id);
      if (i >= 0) lista[i] = { ...lista[i], ...d };
      else lista.push({ ...d, id: uid() });

      persistir();
      render();
      $("#" + c.modal).close();
      toast(i >= 0 ? "Alterações salvas!" : "Cadastrado com sucesso!");
    });
  });

  // excluir
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-excluir]");
    if (!b) return;
    const tipo = b.dataset.excluir;
    const c = CFG[tipo];
    const id = $(c.form).elements["id"].value;
    if (!id || !confirm("Tem certeza que deseja excluir? Essa ação não pode ser desfeita.")) return;

    estado[c.lista] = estado[c.lista].filter((x) => x.id !== id);
    if (tipo === "ingrediente") estado.produtos.forEach((p) => (p.receita = (p.receita || []).filter((r) => r.ingId !== id)));
    if (tipo === "fornecedor") estado.ingredientes.forEach((i) => i.fornecedor === id && (i.fornecedor = ""));

    persistir();
    render();
    $("#" + c.modal).close();
    toast("Item excluído.");
  });

  /* ================= máscara do WhatsApp ================= */
  $("#telefone").addEventListener("input", (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = d.length > 10
      ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
      : d.length > 6
      ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
      : d.length > 2
      ? `(${d.slice(0, 2)}) ${d.slice(2)}`
      : d;
  });

  render();
})();