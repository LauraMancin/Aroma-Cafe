    const tabsContainer = document.querySelector(".tabs");
    const tabs = document.querySelectorAll(
        ".tabs .tab"
    );

    const contents = document.querySelectorAll(
        ".content"
    );


    if (tabsContainer && tabs.length > 0) {

        // Criar linha rosa

        const indicator = document.createElement("div");

        indicator.classList.add("tab-indicator");

        tabsContainer.appendChild(indicator);


        // Posicionar linha rosa

        function posicionarIndicador(tabAtiva) {

            const containerRect =
                tabsContainer.getBoundingClientRect();

            const tabRect =
                tabAtiva.getBoundingClientRect();

            indicator.style.width =
                `${tabRect.width}px`;

            indicator.style.transform =
                `translateX(${tabRect.left - containerRect.left}px)`;

        }


        // Aba ativa inicialmente

        const abaAtivaInicial =
            document.querySelector(
                ".tabs .tab.active"
            ) || tabs[0];


        posicionarIndicador(
            abaAtivaInicial
        );


        // Troca de abas

        tabs.forEach((tab) => {

            tab.addEventListener("click", () => {

                // Remove active das abas

                tabs.forEach((t) => {
                    t.classList.remove("active");
                });


                // Remove active dos conteúdos

                contents.forEach((c) => {
                    c.classList.remove("active");
                });


                // Ativa aba clicada

                tab.classList.add("active");


                // Move linha rosa

                posicionarIndicador(tab);


                // Descobre conteúdo

                const target =
                    tab.getAttribute("data-tab");


                const contentEl =
                    document.getElementById(target);


                // Mostra conteúdo

                if (contentEl) {
                    contentEl.classList.add("active");
                }

            });

        });


        // Reposiciona linha ao redimensionar

        window.addEventListener("resize", () => {

            const tabAtiva =
                document.querySelector(
                    ".tabs .tab.active"
                );

            if (tabAtiva) {
                posicionarIndicador(tabAtiva);
            }

        });

    }