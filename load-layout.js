
document.addEventListener("DOMContentLoaded", async () => {

    const components = [
        {
            selector: "#header-placeholder",
            file: "components/header.html"
        },
        {
            selector: "#footer-placeholder",
            file: "components/footer.html"
        }
    ];

    for (const component of components) {

        const element = document.querySelector(component.selector);

        if (!element) {
            console.warn("Nuk u gjet elementi:", component.selector);
            continue;
        }

        try {

            const response = await fetch(component.file);

            if (!response.ok) {
                throw new Error(
                    `Gabim ${response.status}: ${component.file}`
                );
            }

            const html = await response.text();

            element.innerHTML = html;

            console.log("U ngarkua me sukses:", component.file);

            // ==================================
            // ACTIVE NAVBAR AFTER HEADER LOAD
            // ==================================

            if (component.selector === "#header-placeholder") {

                const currentPage = window.location.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();

                const activePage = currentPage === ""
                    ? "index.html"
                    : currentPage;

                const navLinks = element.querySelectorAll("#nevbar a[href]");

                navLinks.forEach(link => {

                    const linkPage = link.getAttribute("href")
                        .split("/")
                        .pop()
                        .toLowerCase();

                    if (linkPage === activePage) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }

                });

                console.log("Navbar aktivizuar për:", activePage);
            }

        } catch (error) {

            console.error("Gabim gjatë ngarkimit:", error);

        }
    }

});
