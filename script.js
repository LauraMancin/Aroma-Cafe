const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Remove classes ativas
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        // Ativa aba clicada
        tab.classList.add("active");

        // Mostra conteúdo correspondente
        const target = tab.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
    });
});