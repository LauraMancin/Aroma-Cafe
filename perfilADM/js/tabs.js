// Abas (Produtos / Ingredientes / Fornecedores) com indicador rosa
(() => {
  const barra = document.querySelector(".tabs");
  const abas = [...document.querySelectorAll(".tab")];
  const indicador = document.createElement("span");
  indicador.className = "tab-indicator";
  barra.appendChild(indicador);

  const mover = (aba) => {
    indicador.style.width = aba.offsetWidth + "px";
    indicador.style.transform = `translateX(${aba.offsetLeft}px)`;
  };

  abas.forEach((aba) =>
    aba.addEventListener("click", () => {
      abas.forEach((a) => a.classList.toggle("active", a === aba));
      document
        .querySelectorAll(".content")
        .forEach((c) => c.classList.toggle("active", c.id === aba.dataset.tab));
      mover(aba);
    })
  );

  const ativa = () => abas.find((a) => a.classList.contains("active"));
  mover(ativa());
  window.addEventListener("load", () => mover(ativa()));
  window.addEventListener("resize", () => mover(ativa()));
})();