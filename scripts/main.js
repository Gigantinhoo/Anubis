const WHATSAPP_NUMBER = "5547992024656";
const properties = Array.isArray(window.ANUBIS_IMOVEIS) ? window.ANUBIS_IMOVEIS : [];

const propertyGrid = document.querySelector("#property-grid");
const searchInput = document.querySelector("#search-text");
const bedroomSelect = document.querySelector("#bedrooms");
const noResults = document.querySelector("#no-results");

function makeWhatsAppUrl(propertyTitle) {
  const message = 'Olá! Gostaria de informações sobre "' + propertyTitle +
    '" da ANUBIS Imóveis em Corupá.';
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function formatMonthlyPrice(price) {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "Consulte o valor";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(price) + "/mês";
}

function normalizeGallery(property) {
  if (Array.isArray(property.gallery) && property.gallery.length) {
    return property.gallery.map(function (item) {
      if (typeof item === "string") {
        return { src: item, alt: "Foto ilustrativa de " + property.title };
      }
      return item;
    });
  }

  return [{ src: property.image, alt: "Foto ilustrativa de " + property.title }];
}

function renderProperties(items) {
  propertyGrid.innerHTML = "";
  noResults.hidden = items.length > 0;

  items.forEach(function (property) {
    const gallery = normalizeGallery(property);
    const card = document.createElement("article");
    card.className = "property-card";
    card.dataset.search = [
      property.title,
      property.neighborhood,
      property.features,
      String(property.price || "")
    ].join(" ").toLocaleLowerCase("pt-BR");

    const imageWrap = document.createElement("div");
    imageWrap.className = "property-image";

    const image = document.createElement("img");
    image.src = property.image || gallery[0].src;
    image.alt = gallery[0].alt || "Foto de " + property.title;
    image.loading = "lazy";
    image.decoding = "async";
    imageWrap.appendChild(image);

    const imageLabel = document.createElement("span");
    imageLabel.className = "image-label";
    imageLabel.textContent = property.badge || (property.demo ? "DEMONSTRAÇÃO" : "IMÓVEL");
    imageWrap.appendChild(imageLabel);
    card.appendChild(imageWrap);

    if (gallery.length > 1) {
      const thumbnails = document.createElement("div");
      thumbnails.className = "property-thumbnails";
      thumbnails.setAttribute("aria-label", "Fotos de " + property.title);

      gallery.forEach(function (photo, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "property-thumb" + (index === 0 ? " is-active" : "");
        button.setAttribute("aria-label", "Ver foto " + (index + 1) + " de " + gallery.length);
        button.setAttribute("aria-pressed", String(index === 0));

        const thumb = document.createElement("img");
        thumb.src = photo.src;
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.decoding = "async";
        button.appendChild(thumb);

        button.addEventListener("click", function () {
          image.src = photo.src;
          image.alt = photo.alt || "Foto de " + property.title;
          thumbnails.querySelectorAll(".property-thumb").forEach(function (otherButton) {
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

    const title = document.createElement("h3");
    title.textContent = property.title;

    const location = document.createElement("p");
    location.textContent = property.neighborhood;

    const meta = document.createElement("div");
    meta.className = "property-meta";

    const details = document.createElement("span");
    details.textContent = property.features || "Consulte detalhes";

    const price = document.createElement("strong");
    price.textContent = formatMonthlyPrice(property.price);
    meta.append(details, price);
    content.append(title, location, meta);

    if (property.photoCredit) {
      const credit = document.createElement("p");
      credit.className = "photo-credit";
      credit.appendChild(document.createTextNode(property.photoCredit));
      if (property.photoSource) {
        const source = document.createElement("a");
        source.href = property.photoSource;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = " · Fonte";
        source.setAttribute("aria-label", "Abrir fonte da foto em nova aba");
        credit.appendChild(source);
      }
      content.appendChild(credit);
    }

    const contact = document.createElement("a");
    contact.className = "contact-card";
    contact.href = makeWhatsAppUrl(property.title);
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
  const filtered = properties.filter(function (property) {
    const searchable = [
      property.title,
      property.neighborhood,
      property.features,
      String(property.price || "")
    ].join(" ").toLocaleLowerCase("pt-BR");

    const textMatches = !term || searchable.includes(term);
    const bedroomsMatch = !minimumBedrooms ||
      (typeof property.bedrooms === "number" && property.bedrooms >= minimumBedrooms);

    return textMatches && bedroomsMatch;
  });

  renderProperties(filtered);
}

document.querySelector("#filter-form").addEventListener("submit", applyFilters);
searchInput.addEventListener("input", applyFilters);
bedroomSelect.addEventListener("change", applyFilters);
document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

renderProperties(properties);
