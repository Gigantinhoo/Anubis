(() => {
  'use strict';
  const host = document.querySelector('#property-view');
  const dataNode = document.querySelector('#property-data');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  if (!host || !dataNode) return;
  const escapeText = value => String(value ?? '');
  const money = value => typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0}).format(value) + '/mês'
    : 'Valor a confirmar';
  const statusLabels = {available:'Disponível', unavailable:'Indisponível', soon:'Em breve', rented:'Alugado', draft:'Em preparação'};
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  };
  try {
    const p = JSON.parse(dataNode.textContent || '{}');
    const gallery = Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery.map(photo => typeof photo === 'string' ? {src:photo, alt:'Foto de ' + (p.title || 'imóvel')} : photo).filter(photo => photo && photo.src)
      : (p.image ? [{src:p.image, alt:'Foto de ' + (p.title || 'imóvel')}] : []);
    host.innerHTML = '';
    const layout = el('div', 'property-layout');
    const media = el('section', 'property-media');
    const mainImage = el('img', 'property-main-image');
    mainImage.alt = gallery[0]?.alt || 'Foto do imóvel';
    mainImage.loading = 'eager';
    mainImage.decoding = 'async';
    if (gallery[0]) mainImage.src = gallery[0].src;
    media.append(mainImage);
    if (gallery.length > 1) {
      const thumbs = el('div', 'property-gallery');
      gallery.forEach((photo, index) => {
        const button = el('button', 'property-thumb' + (index === 0 ? ' is-active' : ''));
        button.type = 'button';
        button.setAttribute('aria-label', 'Ver foto ' + (index + 1));
        const thumb = el('img'); thumb.src = photo.src; thumb.alt = photo.alt || ''; thumb.loading = 'lazy';
        button.append(thumb);
        button.addEventListener('click', () => {
          mainImage.src = photo.src; mainImage.alt = photo.alt || 'Foto do imóvel';
          thumbs.querySelectorAll('button').forEach((item, i) => item.classList.toggle('is-active', i === index));
        });
        thumbs.append(button);
      });
      media.append(thumbs);
    }
    const content = el('section', 'property-details');
    content.append(el('p', 'eyebrow', 'ANUBIS IMÓVEIS · CORUPÁ/SC'));
    content.append(el('span', 'property-status status-' + (p.status || 'draft'), p.badge || statusLabels[p.status] || 'Imóvel'));
    content.append(el('h1', '', p.title || 'Imóvel para locação'));
    if (p.neighborhood) content.append(el('p', 'property-location', p.neighborhood));
    content.append(el('p', 'property-price', money(p.price)));
    const facts = el('div', 'property-facts');
    const bedrooms = p.bedrooms === null || p.bedrooms === undefined || p.bedrooms === '' ? null : Number(p.bedrooms);
    const bathrooms = p.bathrooms === null || p.bathrooms === undefined || p.bathrooms === '' ? null : Number(p.bathrooms);
    if (bedrooms !== null && Number.isFinite(bedrooms)) facts.append(el('span', '', bedrooms + (bedrooms === 1 ? ' quarto' : ' quartos')));
    if (bathrooms !== null && Number.isFinite(bathrooms)) facts.append(el('span', '', bathrooms + (bathrooms === 1 ? ' banheiro' : ' banheiros')));
    if (p.area) facts.append(el('span', '', p.area));
    if (facts.childElementCount) content.append(facts);
    if (p.features) content.append(el('p', 'property-features', p.features));
    if (p.description) content.append(el('p', 'property-description', p.description));
    if (p.availableFrom) content.append(el('p', 'property-available', 'Disponível a partir de ' + new Date(p.availableFrom + 'T12:00:00').toLocaleDateString('pt-BR')));
    if (p.status === 'available') {
      const template = typeof p.whatsappMessage === 'string' && p.whatsappMessage.trim() ? p.whatsappMessage : 'Olá! Gostaria de saber mais sobre {{nome}}.';
      const message = template.replace(/\{\{\s*(nome|localizacao|valor|quartos|banheiros)\s*\}\}/gi, (_, key) => ({
        nome: p.title || 'este imóvel', localizacao: p.neighborhood || 'localização a confirmar', valor: money(p.price),
        quartos: bedrooms === null || !Number.isFinite(bedrooms) ? 'não informado' : String(bedrooms),
        banheiros: bathrooms === null || !Number.isFinite(bathrooms) ? 'não informado' : String(bathrooms)
      })[key.toLowerCase()] || '');
      const link = el('a', 'contact-button', 'Consultar este imóvel pelo WhatsApp ↗');
      link.href = 'https://wa.me/5547992024656?text=' + encodeURIComponent(message);
      link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(link);
    } else {
      content.append(el('p', 'status-note', p.status === 'rented' ? 'Este imóvel está marcado como alugado.' : p.status === 'unavailable' ? 'Este imóvel não está disponível no momento.' : 'As informações deste imóvel estão sendo atualizadas.'));
    }
    layout.append(media, content); host.append(layout);
    if (p.photoCredit) host.append(el('p', 'photo-credit', p.photoCredit));
  } catch (error) {
    host.innerHTML = '<p class="status-note">Não foi possível carregar as informações deste imóvel.</p>';
    console.error('Falha ao renderizar imóvel:', error);
  }
})();
