import { supabase } from "./supabase-client.js";

const propertyGrid = document.querySelector("#property-grid");
const searchInput = document.querySelector("#search-text");
const bedroomSelect = document.querySelector("#bedrooms");
const noResults = document.querySelector("#no-results");
let properties = [];

const STATUS_LABELS = {
  available: "DISPONÍVEL", unavailable: "INDISPONÍVEL", soon: "EM BREVE",
  rented: "ALUGADO", draft: "EM PREPARAÇÃO", demo: "DEMONSTRAÇÃO"
};

function normalizeProperty(row) {
  return {
    id: row.id, slug: row.slug, title: row.title,
    price: row.price === null ? null : Number(row.price),
    status: row.status, neighborhood: row.neighborhood || "",
    bedrooms: row.bedrooms === null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms === null ? null : Number(row.bathrooms),
    area: row.area || "", features: row.features || "", description: row.description || "",
    badge: row.badge || "", demo: Boolean(row.is_demo), image: row.image || "",
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    availableFrom: row.available_from || "", whatsappMessage: row.whatsapp_message || ""
  };
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function monthlyPrice(value) {
  const price = Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(price)) return "Valor a consultar";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price) + "/mês";
}

function galleryFor(property) {
  const gallery = Array.isArray(property.gallery) ? property.gallery : [];
  const normalized = gallery.map((photo, index) => typeof photo === "string"
    ? { src: photo, alt: "Foto " + (index + 1) + " de " + property.title }
    : photo
  ).filter(photo => photo && photo.src);
  if (!normalized.length && property.image) normalized.push({ src: property.image, alt: "Foto de " + property.title });
  return normalized;
}

function createCard(property) {
  const card = element("article", "catalog-card");
  const link = element("a", "catalog-card-media");
  link.href = "imovel.html?slug=" + encodeURIComponent(property.slug || property.id);
  link.setAttribute("aria-label", "Ver detalhes de " + (property.title || "imóvel"));

  const gallery = galleryFor(property);
  const cover = property.image || gallery[0]?.src || "";
  if (cover) {
    const image = element("img");
    image.src = cover;
    image.alt = gallery[0]?.alt || "Foto de " + (property.title || "imóvel");
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => { image.classList.add("catalog-image-error"); image.alt = "Imagem indisponível"; }, { once: true });
    link.append(image);
  } else {
    const placeholder = element("div", "catalog-placeholder");
    placeholder.append(element("strong", "", "ANUBIS"), element("small", "", "FOTO EM PREPARAÇÃO"));
    link.append(placeholder);
  }

  link.append(element("span", "catalog-status status-" + (property.status || "draft"), property.badge || STATUS_LABELS[property.status] || "IMÓVEL"));
  card.append(link);
  const body = element("div", "catalog-card-body");
  body.append(element("h3", "", property.title || "Imóvel para locação"));
  body.append(element("p", "catalog-location", property.neighborhood || "Localização a confirmar"));

  const facts = [];
  if (property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms !== "") facts.push(property.bedrooms + (Number(property.bedrooms) === 1 ? " quarto" : " quartos"));
  if (property.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms !== "") facts.push(property.bathrooms + (Number(property.bathrooms) === 1 ? " banheiro" : " banheiros"));
  if (property.area) facts.push(property.area);
  if (facts.length) body.append(element("p", "catalog-facts", facts.join(" · ")));

  const footer = element("div", "catalog-card-footer");
  footer.append(element("strong", "catalog-price", monthlyPrice(property.price)));
  const details = element("a", "catalog-details", "Ver imóvel ↗");
  details.href = link.href;
  footer.append(details);
  body.append(footer);
  card.append(body);
  return card;
}

function render(items) {
  propertyGrid.replaceChildren();
  noResults.hidden = items.length > 0;
  if (!items.length) return;
  const fragment = document.createDocumentFragment();
  items.forEach(property => fragment.append(createCard(property)));
  propertyGrid.append(fragment);
}

function applyFilters() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const minimumBedrooms = Number(bedroomSelect.value || 0);
  const filtered = properties.filter(property => {
    const haystack = [property.title, property.neighborhood, property.features, property.description, property.price].join(" ").toLocaleLowerCase("pt-BR");
    const bedrooms = Number(property.bedrooms);
    return (!term || haystack.includes(term)) && (!minimumBedrooms || (Number.isFinite(bedrooms) && bedrooms >= minimumBedrooms));
  });
  render(filtered);
}

async function loadLegacyCatalog() {
  const response = await fetch("imoveis.json?legacy=" + Date.now(), { cache: "no-store" });
  if (!response.ok) throw new Error("Catálogo de segurança não disponível.");
  const list = await response.json();
  if (!Array.isArray(list)) throw new Error("O catálogo antigo tem um formato inválido.");
  return list.filter(item => item && item.demo !== true && item.status !== "draft" && item.status !== "demo")
    .map(item => ({ ...item, slug: item.slug || item.id, gallery: Array.isArray(item.gallery) ? item.gallery : [] }));
}

async function loadProperties() {
  try {
    const { data, error } = await supabase.from("properties").select("*")
      .eq("is_demo", false).not("status", "in", "(draft,demo)")
      .order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) throw error;
    properties = Array.isArray(data) && data.length ? data.map(normalizeProperty) : await loadLegacyCatalog();
    render(properties);
  } catch (error) {
    console.error("Falha ao consultar o catálogo Supabase:", error);
    try { properties = await loadLegacyCatalog(); render(properties); }
    catch (_) {
      propertyGrid.replaceChildren();
      noResults.hidden = false;
      noResults.textContent = "Não foi possível carregar os imóveis. Atualize a página ou fale com a ANUBIS.";
    }
  }
}

document.querySelector("#filter-form").addEventListener("submit", event => { event.preventDefault(); applyFilters(); });
searchInput.addEventListener("input", applyFilters);
bedroomSelect.addEventListener("change", applyFilters);
loadProperties();
