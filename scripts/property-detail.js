import { supabase } from "./supabase-client.js";

const host = document.querySelector("#property-view");
const WHATSAPP_NUMBER = "5547992024656";
const STATUS_LABELS = { available: "Disponível", unavailable: "Indisponível", soon: "Em breve", rented: "Alugado", draft: "Em preparação", demo: "Demonstração" };
document.querySelector("#year").textContent = new Date().getFullYear();

function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = String(text);
  return el;
}
function fromDatabase(row) {
  return { ...row, bedrooms: row.bedrooms === null ? null : Number(row.bedrooms), bathrooms: row.bathrooms === null ? null : Number(row.bathrooms), price: row.price === null ? null : Number(row.price), demo: Boolean(row.is_demo), availableFrom: row.available_from || "", whatsappMessage: row.whatsapp_message || "" };
}
function money(value) {
  const amount = Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(amount)) return "Valor a confirmar";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(amount) + "/mês";
}
function normalizeGallery(property) {
  const source = Array.isArray(property.gallery) ? property.gallery : [];
  const gallery = source.map((item, index) => typeof item === "string" ? { src: item, alt: "Foto " + (index + 1) } : { src: item?.src || "", alt: item?.alt || "Foto " + (index + 1) }).filter(photo => photo.src);
  if (!gallery.length && property.image) gallery.push({ src: property.image, alt: "Foto de " + (property.title || "imóvel") });
  return gallery;
}
function showError(message) {
  host.replaceChildren();
  const box = node("section", "load-error");
  box.append(node("h1", "", "Não foi possível abrir este imóvel"), node("p", "", message));
  const back = node("a", "contact-button", "Voltar para a ANUBIS");
  back.href = "index.html#imoveis";
  box.append(back);
  host.append(box);
}
function whatsappUrl(property) {
  const template = typeof property.whatsappMessage === "string" && property.whatsappMessage.trim() ? property.whatsappMessage.trim() : "Olá! Gostaria de saber mais informações sobre {{nome}}. Poderia me passar os detalhes e as condições de locação?";
  const values = { nome: property.title || "este imóvel", localizacao: property.neighborhood || "localização a confirmar", valor: money(property.price), quartos: property.bedrooms === null || property.bedrooms === undefined ? "não informado" : String(property.bedrooms), banheiros: property.bathrooms === null || property.bathrooms === undefined ? "não informado" : String(property.bathrooms) };
  const message = template.replace(/\{\{\s*(nome|localizacao|valor|quartos|banheiros)\s*\}\}/gi, (_, key) => values[key.toLowerCase()] || "");
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}
function render(property) {
  document.title = (property.title || "Imóvel") + " | ANUBIS Imóveis";
  host.replaceChildren();
  const layout = node("div", "property-layout");
  const media = node("section", "property-media");
  media.setAttribute("aria-label", "Fotos de " + (property.title || "imóvel"));
  const gallery = normalizeGallery(property);
  if (gallery.length) {
    const main = node("img", "property-main-image");
    main.id = "main-photo"; main.src = gallery[0].src; main.alt = gallery[0].alt || "Foto do imóvel"; main.loading = "eager"; main.decoding = "async";
    media.append(main);
    if (gallery.length > 1) {
      const thumbs = node("div", "property-gallery");
      thumbs.setAttribute("aria-label", "Selecionar foto");
      gallery.forEach((photo, index) => {
        const button = node("button", "property-thumb" + (index === 0 ? " is-active" : ""));
        button.type = "button"; button.setAttribute("aria-label", "Ver foto " + (index + 1));
        const image = node("img"); image.src = photo.src; image.alt = photo.alt || ""; image.loading = "lazy"; image.decoding = "async";
        button.append(image);
        button.addEventListener("click", () => { main.src = photo.src; main.alt = photo.alt || "Foto do imóvel"; thumbs.querySelectorAll("button").forEach((item, i) => item.classList.toggle("is-active", i === index)); });
        thumbs.append(button);
      });
      media.append(thumbs, node("p", "gallery-caption", "Selecione uma miniatura para ver outra foto."));
    }
    main.addEventListener("error", () => { main.alt = "Foto indisponível"; });
  } else {
    const placeholder = node("div", "photo-placeholder");
    placeholder.append(node("span", "", "ANUBIS"), node("small", "", "FOTOS EM PREPARAÇÃO"));
    media.append(placeholder);
  }

  const details = node("section", "property-details");
  details.append(node("p", "eyebrow", "ANUBIS IMÓVEIS · CORUPÁ/SC"));
  details.append(node("span", "property-status status-" + (property.status || "draft"), property.badge || STATUS_LABELS[property.status] || "Imóvel"));
  details.append(node("h1", "", property.title || "Imóvel para locação"));
  if (property.neighborhood) details.append(node("p", "property-location", property.neighborhood));
  details.append(node("p", "property-price", money(property.price)));
  const facts = node("div", "property-facts");
  if (property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms !== "") facts.append(node("span", "", property.bedrooms + (Number(property.bedrooms) === 1 ? " quarto" : " quartos")));
  if (property.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms !== "") facts.append(node("span", "", property.bathrooms + (Number(property.bathrooms) === 1 ? " banheiro" : " banheiros")));
  if (property.area) facts.append(node("span", "", property.area));
  if (facts.childElementCount) details.append(facts);
  if (property.features) details.append(node("p", "property-features", property.features));
  if (property.description) details.append(node("p", "property-description", property.description));
  if (property.availableFrom) details.append(node("p", "property-available", "Disponível a partir de " + new Date(property.availableFrom + "T12:00:00").toLocaleDateString("pt-BR")));
  if (property.status === "available" && !property.demo) {
    const contact = node("a", "contact-button", "Consultar este imóvel pelo WhatsApp ↗");
    contact.href = whatsappUrl(property); contact.target = "_blank"; contact.rel = "noopener noreferrer"; details.append(contact);
  } else {
    details.append(node("p", "status-note", property.status === "rented" ? "Este imóvel está marcado como alugado." : property.status === "soon" ? "Este imóvel está marcado como em breve. Confirme a disponibilidade com a ANUBIS." : "Este imóvel não está marcado como disponível para nova locação."));
  }
  layout.append(media, details); host.append(layout);
  if (property.photoCredit) host.append(node("p", "photo-credit", property.photoCredit));
}
async function loadLegacy(slug) {
  const response = await fetch("imoveis.json?legacy=" + Date.now(), { cache: "no-store" });
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo antigo.");
  const items = await response.json();
  if (!Array.isArray(items)) throw new Error("O catálogo antigo tem um formato inválido.");
  return items.find(item => (item.slug || item.id) === slug && item.demo !== true && item.status !== "draft" && item.status !== "demo");
}
async function loadProperty() {
  const slug = new URLSearchParams(location.search).get("slug") || "";
  if (!slug) { showError("O link não informou qual imóvel deve ser exibido."); return; }
  try {
    const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (data) { render(fromDatabase(data)); return; }
    const legacy = await loadLegacy(slug);
    if (!legacy) throw new Error("Este imóvel não foi encontrado. Confira se o link está correto.");
    render(legacy);
  } catch (error) {
    try { const legacy = await loadLegacy(slug); if (legacy) { render(legacy); return; } } catch (_) { /* fallback falhou */ }
    showError(error?.message || "Tente novamente mais tarde.");
  }
}
loadProperty();
