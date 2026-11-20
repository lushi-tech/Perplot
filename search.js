
// ==================================
// PERPLOT - GLOBAL SEARCH
// ==================================

// 1. Te dhenat e faqeve qe mund te kerkohen

const searchData = [

    {
        title: "Përplot - Faqja kryesore",
        description: "Mirë se vini në Përplot. Zbuloni botën e lodrave dhe produkteve tona.",
        keywords: "perplot kryefaqja home fillimi lodra produkte",
        url: "Index.html"
    },

    {
        title: "Kategoritë",
        description: "Eksploroni kategoritë e produkteve dhe lodrave.",
        keywords: "kategori kategorite produkte lodra shop dyqan",
        url: "shop.html"
    },

    {
        title: "Rreth nesh",
        description: "Mësoni më shumë rreth Përplot dhe historisë sonë.",
        keywords: "rreth nesh about historia perplot",
        url: "about.html"
    },

    {
        title: "Kontakti",
        description: "Kontaktoni me ekipin e Përplot për çdo pyetje.",
        keywords: "kontakt kontakti email telefon adresa ndihme",
        url: "contact.html"
    },

    {
        title: "Shporta",
        description: "Shikoni produktet që keni shtuar në shportë.",
        keywords: "shporte shporta cart blerje produkte",
        url: "cart.html"
    }

];


// 2. Marrim elementet HTML

const searchParams = new URLSearchParams(window.location.search);

const searchQuery = searchParams.get("q");

const message = document.getElementById("search-message");

const resultsContainer = document.getElementById("results-container");

const searchInput = document.getElementById("search-input");


// 3. Funksioni i kerkimit

function searchPages(query) {

    const normalizedQuery = query
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return searchData.filter(page => {

        const searchableText = (
            page.title + " " +
            page.description + " " +
            page.keywords
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

        return searchableText.includes(normalizedQuery);

    });

}


// 4. Shfaqja e rezultateve ne HTML

function displayResults(results, query) {

    resultsContainer.innerHTML = "";

    if (query.trim() === "") {

        message.textContent = "Ju lutem shkruani diçka për të kërkuar.";

        return;
    }

    if (results.length === 0) {

        message.textContent = `Nuk u gjet asnjë rezultat për "${query}".`;

        return;
    }

    message.textContent = `U gjetën ${results.length} rezultate për "${query}":`;

    results.forEach(page => {

        const resultCard = document.createElement("div");

        resultCard.classList.add("search-result");

        resultCard.innerHTML = `
            <h3>${page.title}</h3>
            <p>${page.description}</p>
            <a href="${page.url}">Vizito faqen</a>
        `;

        resultsContainer.appendChild(resultCard);

    });

}


// 5. Ekzekutojme kerkimin kur hapet search.html

if (resultsContainer && message) {

    if (searchQuery !== null) {

        if (searchInput) {
            searchInput.value = searchQuery;
        }

        const results = searchPages(searchQuery);

        displayResults(results, searchQuery);

    } else {

        message.textContent = "Shkruani një fjalë në kutinë e kërkimit.";

    }

}
