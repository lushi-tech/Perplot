
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

        } catch (error) {

            console.error("Gabim gjatë ngarkimit:", error);

        }
    }

});
