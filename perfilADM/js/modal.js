// Abertura e fechamento dos modais
window.Modal = {
  mostrar(id) {
    const d = document.getElementById(id);
    if (d && !d.open) d.showModal();
  },
};

document.addEventListener("click", (e) => {
  // botões de fechar / cancelar
  if (e.target.closest(".fechar")) {
    e.target.closest("dialog")?.close();
    return;
  }

  // botões "+ Novo ..." (cards.js prepara o formulário e abre o modal)
  const abrir = e.target.closest("[data-modal]");
  if (abrir) {
    document.dispatchEvent(new CustomEvent("modal:novo", { detail: abrir.dataset.modal }));
    return;
  }

  // clique fora da caixa (no fundo escurecido)
  if (e.target.tagName === "DIALOG") {
    const r = e.target.getBoundingClientRect();
    const fora = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (fora) e.target.close();
  }
});