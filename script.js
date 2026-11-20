
const track = document.querySelector(".hero-track");
const slides = document.querySelectorAll(".hero-slide");

const next = document.querySelector(".slider-arrow.next");
const prev = document.querySelector(".slider-arrow.prev");

let currentIndex = 0;
let sliderInterval;

function showSlide(index) {

    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
}

function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
}

next.addEventListener("click", () => {
    nextSlide();
    resetSlider();
});

prev.addEventListener("click", () => {
    prevSlide();
    resetSlider();
});

startSlider();


if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function(event){
        const searchValue = searchInput.value.trim();

        if(searchValue === ""){
            event.preventDefault();
            searchInput.focus();
            return;
        }
    });
}

const params= new URLSearchParams(window.location.search);
const searchQuery = params.get("q");

const productCards = document.querySelectorAll("pro");
if(searchQuery){
    if(serachInput){
        searchInput.value = searchQuery;
    }

    const query = searchQuery.toLowerCase();
    productCards.forEach(product =>{
        const productName = product.textContent.toLowerCase();
        if(productName.includes(query)){
            product.style.display = "";
        }else{
            product.style.display = "none";
        }
    });
}