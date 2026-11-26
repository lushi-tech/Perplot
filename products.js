// ==================================
// PERPLOT - PRODUKTET ME ULJE
// ==================================
// Për të shtuar ose ndryshuar një produkt, edito vetëm listën më poshtë.
// price = çmimi i vjetër, salePrice = çmimi me ulje, stock = sasia në stok

const dealProducts = [
    { id: 1,  name: "Set blloqesh ndërtimi 500 copë",   category: "Lojra",       price: 2800, salePrice: 2100, stock: 14, img: "images/prove/feature1.avif" },
    { id: 2,  name: "Enigmë me 1000 pjesë",             category: "Lojra",       price: 1500, salePrice: 1100, stock: 20, img: "images/prove/feature1.avif" },
    { id: 3,  name: "Set kancelarie për shkollë",       category: "Kancelarike", price: 1200, salePrice: 850,  stock: 35, img: "images/prove/feature1.avif" },
    { id: 4,  name: "Çantë shkolle me rrota",           category: "Kancelarike", price: 4500, salePrice: 3600, stock: 8,  img: "images/prove/feature1.avif" },
    { id: 5,  name: "Tabletë edukative për fëmijë",     category: "Elektronike", price: 9900, salePrice: 7900, stock: 6,  img: "images/prove/feature1.avif" },
    { id: 6,  name: "Kufje pa tela për fëmijë",         category: "Elektronike", price: 3200, salePrice: 2400, stock: 12, img: "images/prove/feature1.avif" },
    { id: 7,  name: "Libër me përralla të ilustruara",  category: "Libra",       price: 900,  salePrice: 650,  stock: 40, img: "images/prove/feature1.avif" },
    { id: 8,  name: "Libër për ngjyrosje + 24 laps",    category: "Libra",       price: 700,  salePrice: 500,  stock: 50, img: "images/prove/feature1.avif" },
    { id: 9,  name: "Set dekorimesh festive",           category: "Festive",     price: 2000, salePrice: 1400, stock: 18, img: "images/prove/feature1.avif" },
    { id: 10, name: "Kalendar Advent me surpriza",      category: "Festive",     price: 3500, salePrice: 2700, stock: 5,  img: "images/prove/feature1.avif" },
];

const CART_KEY = "perplotCart";

document.addEventListener("DOMContentLoaded", function () {

    const grid = document.getElementById("product-grid");

    if (!grid) {
        console.warn("PRODUCTS.JS: nuk u gjet #product-grid në këtë faqe.");
        return;
    }

    console.log("PRODUCTS.JS U NGARKUA - produkte:", dealProducts.length);

    const formatPrice = (n) => n.toLocaleString("de-DE") + " Lekë";

    // ---------- Ndërtimi i kartave ----------
    grid.innerHTML = dealProducts.map(function (p) {

        const discount = Math.round((1 - p.salePrice / p.price) * 100);
        const lowStock = p.stock <= 8;

        return `
        <article class="deal-card" data-id="${p.id}" data-stock="${p.stock}">
            <div class="deal-media">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <span class="discount-badge">-${discount}%</span>
            </div>

            <div class="deal-info">
                <p class="deal-category">${p.category}</p>
                <h3 class="deal-name">${p.name}</h3>

                <div class="deal-price">
                    <span class="price-new">${formatPrice(p.salePrice)}</span>
                    <span class="price-old">${formatPrice(p.price)}</span>
                </div>

                <p class="deal-stock ${lowStock ? "low" : ""}">
                    ${lowStock ? "Vetëm " + p.stock + " copë në stok" : "Në stok: " + p.stock + " copë"}
                </p>

                <div class="deal-actions">
                    <div class="qty-control">
                        <button type="button" data-action="minus" aria-label="Zvogëlo sasinë">&minus;</button>
                        <span class="qty-value" aria-live="polite">1</span>
                        <button type="button" data-action="plus" aria-label="Rrit sasinë">+</button>
                    </div>

                    <button type="button" class="deal-add-to-cart" data-action="add">
                        <i class="fas fa-shopping-cart"></i> Shto në shportë
                    </button>
                </div>
            </div>
        </article>`;
    }).join("");


    // ---------- Shporta (localStorage) ----------
    function readCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (e) {
            console.warn("Shporta nuk u ruajt:", e);
        }
    }

    function addToCart(product, qty) {
        const cart = readCart();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.qty = Math.min(existing.qty + qty, product.stock);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.salePrice,
                img: product.img,
                qty: qty
            });
        }

        saveCart(cart);
    }


    // ---------- Njoftimi ----------
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }


    // ---------- Klikimet (sasia + shto në shportë) ----------
    grid.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const card = button.closest(".deal-card");
        const qtyEl = card.querySelector(".qty-value");
        const stock = Number(card.dataset.stock);
        let qty = Number(qtyEl.textContent);

        const action = button.dataset.action;

        if (action === "plus") {
            if (qty < stock) qty++;
            qtyEl.textContent = qty;
        }

        if (action === "minus") {
            if (qty > 1) qty--;
            qtyEl.textContent = qty;
        }

        if (action === "add") {
            const product = dealProducts.find(p => p.id === Number(card.dataset.id));
            addToCart(product, qty);
            showToast(qty + " × " + product.name + " u shtua në shportë.");
            qtyEl.textContent = 1;
        }
    });

    // ---------- Shigjetat e karuselit ----------
    const prevArrow = document.querySelector(".carousel-arrow.prev");
    const nextArrow = document.querySelector(".carousel-arrow.next");

    function updateArrows() {
        if (!prevArrow || !nextArrow) return;

        const maxScroll = grid.scrollWidth - grid.clientWidth;

        prevArrow.disabled = grid.scrollLeft <= 5;
        nextArrow.disabled = grid.scrollLeft >= maxScroll - 5;
    }

    function scrollCarousel(direction) {
        const card = grid.querySelector(".deal-card");
        if (!card) return;

        const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
        const step = card.offsetWidth + gap;

        // lëviz sa numri i produkteve që shihen njëkohësisht
        const visible = Math.max(1, Math.round(grid.clientWidth / step));

        grid.scrollBy({ left: direction * step * visible });
    }

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener("click", () => scrollCarousel(-1));
        nextArrow.addEventListener("click", () => scrollCarousel(1));
        grid.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        updateArrows();
    }
});