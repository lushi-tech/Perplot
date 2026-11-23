
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. HERO SLIDER
    // ==========================================

    const track = document.querySelector(".hero-track");
    const slides = document.querySelectorAll(".hero-slide");

    const next = document.querySelector(".slider-arrow.next");
    const prev = document.querySelector(".slider-arrow.prev");

    let currentIndex = 0;
    let sliderInterval;

    function showSlide(index) {

        if (!track || slides.length === 0) return;

        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startSlider() {
        if (slides.length <= 1) return;

        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(sliderInterval);
        startSlider();
    }

    // Kontrollojmë nëse shigjetat ekzistojnë
    if (track && slides.length > 0) {

        showSlide(0);
        startSlider();

        if (next) {
            next.addEventListener("click", function () {
                nextSlide();
                resetSlider();
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                prevSlide();
                resetSlider();
            });
        }
    }


    // ==========================================
    // 2. SEARCH FORM
    // ==========================================

    const searchForm = document.querySelector("#search-form");
    const searchInput = document.querySelector("#search-input");

    if (searchForm && searchInput) {

        searchForm.addEventListener("submit", function (event) {

            const searchValue = searchInput.value.trim();

            if (searchValue === "") {
                event.preventDefault();
                searchInput.focus();
            }

        });
    }


    // ==========================================
    // 3. SEARCH PRODUCTS
    // ==========================================

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q");

    const productCards = document.querySelectorAll(".pro, .product-card");

    if (searchQuery && productCards.length > 0) {

        if (searchInput) {
            searchInput.value = searchQuery;
        }

        const query = searchQuery.toLowerCase();

        productCards.forEach(function (product) {

            const productName = product.textContent.toLowerCase();

            if (productName.includes(query)) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }

        });
    }




console.log("SCRIPT.JS U NGARKUA");

console.log("FAQJA AKTUALE:", window.location.pathname);

console.log("NAVBAR:", document.querySelector("#nevbar"));

console.log("LINKET:", document.querySelectorAll("#nevbar a").length);

});