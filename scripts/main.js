const WHATSAPP_NUMBER = '5547992024656';
const initialMessage = 'Olá! Gostaria de informações sobre casas para alugar em Corupá.';
const demoProperties = [
  {
    id: 'casa-teste',
    title: 'Casa para demonstração',
    neighborhood: 'Corupá, SC · localização a confirmar',
    bedrooms: null,
    image: 'assets/images/imoveis/casa-teste/fachada-teste.jpeg',
    features: 'Fotos de teste recebidas',
    demo: true,
    gallery: [
      'assets/images/imoveis/casa-teste/fachada-teste.jpeg',
      'assets/images/imoveis/casa-teste/area-coberta-teste.jpg',
      'assets/images/imoveis/casa-teste/patio-teste.jpg'
    ]
  }
];

const propertyGrid = document.querySelector('#property-grid');
const searchInput = document.querySelector('#search-text');
const bedroomSelect = document.querySelector('#bedrooms');
const noResults = document.querySelector('#no-results');

function makeWhatsAppUrl(propertyTitle) {
  const message = `Olá! Gostaria de informações sobre ${propertyTitle} da ANUBIS Imóveis em Corupá. ${initialMessage}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderProperties(properties) {
  propertyGrid.innerHTML = '';
  noResults.hidden = properties.length > 0;

  properties.forEach((property) => {
    const card = document.createElement('article');
    card.className = 'property-card';
    card.dataset.search = `${property.title} ${property.neighborhood} ${property.features}`.toLocaleLowerCase('pt-BR');

    const imageWrap = document.createElement('div');
    imageWrap.className = 'property-image';
    const image = document.createElement('img');
    image.src = property.image;
    image.alt = `${property.title} — fotografia ilustrativa de teste`;
    image.loading = 'lazy';
    imageWrap.appendChild(image);
    const imageLabel = document.createElement('span');
    imageLabel.className = 'image-label';
    imageLabel.textContent = 'FOTOS DE TESTE';
    imageWrap.appendChild(imageLabel);

    const content = document.createElement('div');
    content.className = 'property-content';
    const title = document.createElement('h3');
    title.textContent = property.title;
    const location = document.createElement('p');
    location.textContent = property.neighborhood;
    const meta = document.createElement('div');
    meta.className = 'property-meta';
    const details = document.createElement('span');
    details.textContent = property.features;
    const price = document.createElement('strong');
    price.textContent = 'Valor a informar';
    meta.append(details, price);
    const contact = document.createElement('a');
    contact.className = 'contact-card';
    contact.href = makeWhatsAppUrl(property.title);
    contact.target = '_blank';
    contact.rel = 'noopener noreferrer';
    contact.innerHTML = '<span>Consultar informações</span><span aria-hidden="true">↗</span>';
    content.append(title, location, meta, contact);
    card.append(imageWrap, content);
    propertyGrid.appendChild(card);
  });
}

function applyFilters(event) {
  if (event) event.preventDefault();
  const term = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const minimumBedrooms = Number(bedroomSelect.value || 0);
  const filtered = demoProperties.filter((property) => {
    const textMatches = !term || `${property.title} ${property.neighborhood} ${property.features}`.toLocaleLowerCase('pt-BR').includes(term);
    const bedroomsMatch = !minimumBedrooms || (property.bedrooms !== null && property.bedrooms >= minimumBedrooms);
    return textMatches && bedroomsMatch;
  });
  renderProperties(filtered);
}

document.querySelector('#filter-form').addEventListener('submit', applyFilters);
searchInput.addEventListener('input', applyFilters);
bedroomSelect.addEventListener('change', applyFilters);
document.querySelector('#year').textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}));

renderProperties(demoProperties);
