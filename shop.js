// ==================================
// SHOP - filtrimi i kategorive
// ==================================

document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("category-search-input");
    const cards = document.querySelectorAll(".category-card");
    const emptyMessage = document.getElementById("no-category");

    if (!input || cards.length === 0) return;

    // Heq shenjat diakritike: "Pikturë" -> "pikture"
    const normalize = (text) =>
        text.toLowerCase().trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    function filterCategories() {
        const query = normalize(input.value);
        let visible = 0;

        cards.forEach(card => {
            const text = normalize(card.dataset.name + " " + card.textContent);
            const match = text.includes(query);
            card.style.display = match ? "" : "none";
            if (match) visible++;
        });

        if (emptyMessage) emptyMessage.hidden = visible !== 0;
    }

    input.addEventListener("input", filterCategories);
});