(() => {
  const dataNode = document.querySelector("#property-data");
  const root = document.querySelector("#property-view");
  if (!dataNode || !root) return;
  let property;
  try { property = JSON.parse(dataNode.textContent); }
  catch (error) { root.textContent = "Não foi possível carregar os dados deste imóvel."; return; }
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const fmtPrice = value => typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL",maximumFractionDigits:0}).format(value) + "/mês"
    : "Consulte as condições";
  const statuses = {available:"Disponível",unavailable:"Indisponível",soon:"Em breve",rented:"Alugado",draft:"Informações em atualização"};
  const photos = (Array.isArray(property.gallery) ? property.gallery : []).filter(photo => photo && photo.src);
  const pathForPage = src => String(src || "").startsWith("assets/") ? "../" + src : src;
  const info = [];
  if (property.bedrooms !== null && property.bedrooms !== "" && property.bedrooms !== undefined) info.push(`<span class="fact">${esc(property.bedrooms)} quarto(s)</span>`);
  if (property.bathrooms !== null && property.bathrooms !== "" && property.bathrooms !== undefined) info.push(`<span class="fact">${esc(property.bathrooms)} banheiro(s)</span>`);
  if (property.area) info.push(`<span class="fact">${esc(property.area)}</span>`);
  const mainPhoto = photos[0]?.src || property.image || "";
  const contactVisible = property.status === "available";
  const statusNote = property.status === "rented" ? "Este imóvel está marcado como alugado no momento." : property.status === "draft" ? "As informações deste imóvel estão sendo atualizadas. Entre em contato para confirmar os detalhes." : property.status === "unavailable" ? "Este imóvel não está disponível para novas locações no momento." : property.status === "soon" ? "Este imóvel estará disponível em breve. Consulte nossa equipe." : "Fale com a ANUBIS para confirmar as condições e agendar uma visita.";
  root.innerHTML = `
    <section class="property-head">
      <div><p class="eyebrow">ANUBIS · LOCAÇÃO RESIDENCIAL</p><h1>${esc(property.title || "Imóvel para locação")}</h1><p class="location">${esc(property.neighborhood || "Localização sob consulta")}</p></div>
      <span class="badge">${esc(property.badge || statuses[property.status] || "Imóvel")}</span>
    </section>
    ${mainPhoto ? `<img class="hero-photo" id="main-photo" src="${esc(pathForPage(mainPhoto))}" alt="${esc(photos[0]?.alt || property.title)}">` : `<div class="empty-gallery">Fotos em atualização.</div>`}
    ${photos.length > 1 ? `<div class="thumbs" aria-label="Galeria de fotos">${photos.map((photo,index)=>`<button type="button" class="thumb ${index===0?'active':''}" data-photo-index="${index}" aria-label="Ver foto ${index+1}"><img src="${esc(pathForPage(photo.src))}" alt=""></button>`).join("")}</div>` : ""}
    <section class="detail-grid">
      <div class="details"><h2>Sobre o imóvel</h2><p>${esc(property.description || "Entre em contato para consultar os detalhes deste imóvel.")}</p><div class="facts">${info.join("")}</div>${property.features ? `<p><strong>Características:</strong> ${esc(property.features)}</p>` : ""}<div class="status-note">${esc(statusNote)}</div></div>
      <aside class="contact-card"><span class="price-label">Valor mensal</span><strong class="price">${esc(fmtPrice(property.price))}</strong><p style="color:var(--muted);font-size:13px;margin:0">Consulte disponibilidade e condições diretamente com a ANUBIS.</p>${contactVisible ? `<a class="button" href="${esc(makeWhatsapp(property))}" target="_blank" rel="noopener">Consultar pelo WhatsApp <span>↗</span></a>` : `<a class="button secondary" href="https://wa.me/5547992024656?text=${encodeURIComponent('Olá! Gostaria de consultar informações sobre ' + (property.title || 'um imóvel') + '.') }" target="_blank" rel="noopener">Falar com a ANUBIS <span>↗</span></a>`}</aside>
    </section>`;
  root.querySelectorAll("[data-photo-index]").forEach(button => button.addEventListener("click", () => {
    const photo = photos[Number(button.dataset.photoIndex)];
    const image = root.querySelector("#main-photo");
    if (!photo || !image) return;
    image.src = pathForPage(photo.src); image.alt = photo.alt || property.title;
    root.querySelectorAll(".thumb").forEach(other => other.classList.toggle("active", other === button));
  }));
  const year = document.querySelector("#year"); if (year) year.textContent = new Date().getFullYear();
  function makeWhatsapp(p) {
    const fallback = "Olá! Gostaria de saber mais informações sobre {{nome}}.";
    const template = typeof p.whatsappMessage === "string" && p.whatsappMessage.trim() ? p.whatsappMessage.trim() : fallback;
    const value = key => ({nome:p.title || "um imóvel",localizacao:p.neighborhood || "localização a confirmar",valor:fmtPrice(p.price),quartos:p.bedrooms ?? "não informado",banheiros:p.bathrooms ?? "não informado"})[key.toLowerCase()] ?? "";
    const message = template.replace(/\{\{\s*(nome|localizacao|valor|quartos|banheiros)\s*\}\}/gi,(_,key)=>value(key));
    return "https://wa.me/5547992024656?text=" + encodeURIComponent(message);
  }
})();
