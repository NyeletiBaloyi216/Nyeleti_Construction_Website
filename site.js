document.addEventListener("DOMContentLoaded", function () {
    // Keep the copyright year current.
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Back-to-top button.
    const topButton = document.getElementById("backToTop");
    if (topButton) {
        const updateTopButton = () => { topButton.style.display = window.scrollY > 250 ? "block" : "none"; };
        window.addEventListener("scroll", updateTopButton, { passive: true });
        updateTopButton();
        topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // Search this page and provide matching pages from the website.
    const searchForm = document.getElementById("siteSearchForm");
    const searchInput = document.getElementById("siteSearchInput");
    const searchStatus = document.getElementById("siteSearchStatus");
    const clearSearch = document.getElementById("clearSiteSearch");
    const searchable = Array.from(document.querySelectorAll("main section, main article, main .card"));
    const websitePages = [
        { name: "Home", url: "home page.html", words: "home welcome introduction company Nyeleti Construction" },
        { name: "About Us", url: "About us.html", words: "about story history mission vision values established 2017" },
        { name: "Services", url: "Services.html", words: "services renovations extensions new builds maintenance commercial fit-outs" },
        { name: "Enquiry", url: "Enquiry.html", words: "enquiry quote quotation project request form" },
        { name: "Contact Us", url: "Contact us.html", words: "contact phone email address location Katlehong Gauteng" },
        { name: "Gallery", url: "Gallery page.html", words: "gallery photos images projects construction materials" }
    ];
    let searchResults = document.getElementById("siteSearchPageResults");
    if (searchForm && !searchResults) {
        searchResults = document.createElement("div");
        searchResults.id = "siteSearchPageResults";
        searchResults.className = "search-page-results";
        searchStatus?.insertAdjacentElement("afterend", searchResults);
    }
    function runSearch(term) {
        const query = term.trim().toLowerCase();
        let matches = 0;
        searchable.forEach(section => {
            const found = !query || section.innerText.toLowerCase().includes(query);
            section.hidden = !found;
            if (found && query) matches++;
        });
        const pageMatches = query ? websitePages.filter(page => (page.name + " " + page.words).toLowerCase().includes(query)) : [];
        if (searchStatus) {
            searchStatus.textContent = !query ? "Enter a word to search this website." :
                (matches + " matching section(s) on this page; " + pageMatches.length + " matching page(s) on the website.");
        }
        if (searchResults) {
            searchResults.replaceChildren();
            pageMatches.forEach(page => {
                const link = document.createElement("a");
                link.href = page.url;
                link.textContent = page.name;
                searchResults.appendChild(link);
            });
        }
    }
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", event => { event.preventDefault(); runSearch(searchInput.value); });
        searchInput.addEventListener("input", () => { if (!searchInput.value.trim()) runSearch(""); });
    }
    if (clearSearch) clearSearch.addEventListener("click", () => { searchInput.value = ""; runSearch(""); searchInput.focus(); });

    // Gallery lightbox with previous/next controls and keyboard support.
    const galleryImages = Array.from(document.querySelectorAll(".lightbox-image"));
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const caption = document.getElementById("lightboxCaption");
    let currentImage = 0;
    function showImage(index) {
        if (!galleryImages.length || !lightbox) return;
        currentImage = (index + galleryImages.length) % galleryImages.length;
        const source = galleryImages[currentImage];
        lightboxImage.src = source.src;
        lightboxImage.alt = source.alt || "Nyeleti Construction gallery image";
        caption.textContent = source.alt || "Nyeleti Construction project";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
    }
    galleryImages.forEach((img, index) => {
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Open image: " + (img.alt || "gallery image"));
        img.addEventListener("click", () => showImage(index));
        img.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showImage(index); } });
    });
    if (lightbox) {
        lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
        lightbox.querySelector(".lightbox-prev")?.addEventListener("click", () => showImage(currentImage - 1));
        lightbox.querySelector(".lightbox-next")?.addEventListener("click", () => showImage(currentImage + 1));
        lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
        document.addEventListener("keydown", event => {
            if (!lightbox.classList.contains("open")) return;
            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowLeft") showImage(currentImage - 1);
            if (event.key === "ArrowRight") showImage(currentImage + 1);
        });
    }

    // Use built-in browser validation for required form controls.
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
            }
        });
    });
});
