const WHATSAPP_NUMBER = "5547992024656";
const propertyGrid = document.querySelector("#property-grid");
const searchInput = document.querySelector("#search-text");
const bedroomSelect = document.querySelector("#bedrooms");
const noResults = document.querySelector("#no-results");
let properties = [];

function makeWhatsAppUrl(propertyTitle) {
  const message = `Olá! Gostaria de informações sobre "${propertyTitle}" da ANUBIS Imóveis em Corupá.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatMonthlyPrice(price) {
  if (typeof price !== "number" || !Number.isFinite(price)) return "Consulte o valor";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0
  }).format(price) + "/mês";
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  const parts = dateValue.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateValue;
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("pt-BR");
}

function normalizeGallery(property) {
  if (Array.isArray(property.gallery) && property.gallery.length) {
    return property.gallery.map((photo) => typeof photo === "string"
      ? { src: photo, alt: `Foto de ${property.title}` }
      : photo).filter((photo) => photo && photo.src);
  }
  return property.image ? [{ src: property.image, alt: `Foto de ${property.title}` }] : [];
}

function numericField(value) {
  // Aceita tanto números (2) quanto textos numéricos ("2") vindos do JSON.
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function makeTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderProperties(items) {
  propertyGrid.innerHTML = "";
  noResults.hidden = items.length > 0;

  items.forEach((property) => {
    const gallery = normalizeGallery(property);
    const card = document.createElement("article");
    card.className = "property-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "property-image";
    const image = document.createElement("img");
    image.src = property.image || (gallery[0] && gallery[0].src) || "";
    image.alt = (gallery[0] && gallery[0].alt) || `Foto de ${property.title}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.classList.add("image-unavailable");
      image.alt = "Foto ilustrativa indisponível. Atualize a imagem no cadastro do imóvel.";
    }, { once: true });
    imageWrap.appendChild(image);

    const statusText = property.demo
      ? (property.id === "casa-teste-anubis" ? "FOTOS DE TESTE" : "IMÓVEL FICTÍCIO")
      : ({ available: "DISPONÍVEL", soon: "EM BREVE", rented: "ALUGADO" }[property.status] || "IMÓVEL");
    imageWrap.appendChild(makeTextElement("span", "image-label", property.badge || statusText));
    card.appendChild(imageWrap);

    if (gallery.length > 1) {
      const thumbnails = document.createElement("div");
      thumbnails.className = "property-thumbnails";
      thumbnails.setAttribute("aria-label", `Fotos de ${property.title}`);
      gallery.forEach((photo, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "property-thumb" + (index === 0 ? " is-active" : "");
        button.setAttribute("aria-label", `Ver foto ${index + 1} de ${gallery.length}`);
        button.setAttribute("aria-pressed", String(index === 0));
        const thumb = document.createElement("img");
        thumb.src = photo.src;
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.decoding = "async";
        thumb.addEventListener("error", () => button.classList.add("thumb-unavailable"), { once: true });
        button.appendChild(thumb);
        button.addEventListener("click", () => {
          image.src = photo.src;
          image.alt = photo.alt || `Foto de ${property.title}`;
          thumbnails.querySelectorAll(".property-thumb").forEach((otherButton) => {
            const active = otherButton === button;
            otherButton.classList.toggle("is-active", active);
            otherButton.setAttribute("aria-pressed", String(active));
          });
        });
        thumbnails.appendChild(button);
      });
      card.appendChild(thumbnails);
    }

    const content = document.createElement("div");
    content.className = "property-content";
    content.appendChild(makeTextElement("h3", "", property.title || "Imóvel para alugar"));
    content.appendChild(makeTextElement("p", "property-location", property.neighborhood || "Localização a informar"));

    const dates = [];
    if (property.availableFrom) dates.push(`Disponível a partir de ${formatDate(property.availableFrom)}`);
    else if (property.dateListed) dates.push(`Anúncio em ${formatDate(property.dateListed)}`);
    if (dates.length) content.appendChild(makeTextElement("p", "property-date", dates.join(" · ")));

    const meta = document.createElement("div");
    meta.className = "property-meta";
    const details = [];
    const bedrooms = numericField(property.bedrooms);
    if (bedrooms !== null) details.push(`${bedrooms} quarto${bedrooms === 1 ? "" : "s"}`);
    const bathrooms = numericField(property.bathrooms);
    if (bathrooms !== null) details.push(`${bathrooms} banheiro${bathrooms === 1 ? "" : "s"}`);
    if (property.area) details.push(property.area);
    if (!details.length) details.push(property.features || "Consulte detalhes");
    meta.appendChild(makeTextElement("span", "property-details", details.join(" · ")));
    meta.appendChild(makeTextElement("strong", "", formatMonthlyPrice(property.price)));
    content.appendChild(meta);

    if (property.description) content.appendChild(makeTextElement("p", "property-description", property.description));
    if (property.photoCredit) {
      const credit = makeTextElement("p", "photo-credit", property.photoCredit);
      if (property.photoSource) {
        const source = document.createElement("a");
        source.href = property.photoSource;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = " · Fonte";
        credit.appendChild(source);
      }
      content.appendChild(credit);
    }

    const contact = document.createElement("a");
    contact.className = "contact-card";
    contact.href = makeWhatsAppUrl(property.title || "uma casa para alugar");
    contact.innerHTML = "<span>Consultar pelo WhatsApp</span><span aria-hidden='true'>↗</span>";
    content.appendChild(contact);
    card.appendChild(content);
    propertyGrid.appendChild(card);
  });
}

function applyFilters(event) {
  if (event) event.preventDefault();
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const minimumBedrooms = Number(bedroomSelect.value || 0);
  const filtered = properties.filter((property) => {
    const searchable = [property.title, property.neighborhood, property.features, property.description, property.price].join(" ").toLocaleLowerCase("pt-BR");
    const textMatches = !term || searchable.includes(term);
    const bedrooms = numericField(property.bedrooms);
    const bedroomsMatch = !minimumBedrooms || (bedrooms !== null && bedrooms >= minimumBedrooms);
    return textMatches && bedroomsMatch;
  });
  renderProperties(filtered);
}

async function loadProperties() {
  try {
    const response = await fetch("imoveis.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const loaded = await response.json();
    if (!Array.isArray(loaded)) throw new Error("O arquivo imoveis.json precisa conter uma lista de imóveis.");
    properties = loaded;
    renderProperties(properties);
  } catch (error) {
    console.error("Não foi possível carregar imoveis.json:", error);
    propertyGrid.innerHTML = "";
    noResults.hidden = false;
    noResults.textContent = "Não foi possível carregar o catálogo. Confira se o arquivo imoveis.json está na raiz do repositório.";
  }
}

document.querySelector("#filter-form").addEventListener("submit", applyFilters);
searchInput.addEventListener("input", applyFilters);
bedroomSelect.addEventListener("change", applyFilters);
document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}));

loadProperties();
