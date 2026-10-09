/*
  ARQUIVO FÁCIL DE EDITAR: dados dos imóveis da ANUBIS.
  Para alterar um aluguel, mude somente o número em "price".
  Para mudar a foto principal, altere "image".
  Para a galeria, adicione ou remova itens dentro de "gallery".
  Para cadastrar uma casa nova, copie um objeto inteiro e altere o "id".
  Enquanto "demo" for true, o site marca o anúncio como demonstração.
*/
window.ANUBIS_IMOVEIS = [
  {
    id: "casa-teste-anubis",
    title: "Casa de teste ANUBIS",
    neighborhood: "Corupá, SC · localização a confirmar",
    bedrooms: null,
    price: 1200,
    features: "3 fotos de teste enviadas por você",
    badge: "FOTOS DE TESTE",
    demo: true,
    image: "assets/images/imoveis/casa-teste/fachada-teste.jpeg",
    gallery: [
      {
        src: "assets/images/imoveis/casa-teste/fachada-teste.jpeg",
        alt: "Fachada da casa enviada para demonstração"
      },
      {
        src: "assets/images/imoveis/casa-teste/area-coberta-teste.jpg",
        alt: "Área externa coberta da casa de demonstração"
      },
      {
        src: "assets/images/imoveis/casa-teste/patio-teste.jpg",
        alt: "Pátio e acesso para veículos da casa de demonstração"
      }
    ],
    photoCredit: "Fotos de teste fornecidas por você",
    photoSource: ""
  },
  {
    id: "casa-demo-02",
    title: "Casa demonstrativa 02",
    neighborhood: "Anúncio fictício · não disponível para locação",
    bedrooms: 2,
    price: 1000,
    features: "2 quartos · dados fictícios",
    badge: "IMÓVEL FICTÍCIO",
    demo: true,
    image: "https://images.pexels.com/photos/7587880/pexels-photo-7587880.jpeg?auto=compress&cs=tinysrgb&w=1000",
    gallery: [
      {
        src: "https://images.pexels.com/photos/7587880/pexels-photo-7587880.jpeg?auto=compress&cs=tinysrgb&w=1000",
        alt: "Imagem ilustrativa de casa contemporânea com jardim"
      }
    ],
    photoCredit: "Foto ilustrativa de Max Vakhtbovych / Pexels",
    photoSource: "https://www.pexels.com/photo/modern-house-exterior-7587880/"
  },
  {
    id: "casa-demo-03",
    title: "Casa demonstrativa 03",
    neighborhood: "Anúncio fictício · não disponível para locação",
    bedrooms: 3,
    price: 1450,
    features: "3 quartos · dados fictícios",
    badge: "IMÓVEL FICTÍCIO",
    demo: true,
    image: "https://images.pexels.com/photos/10610731/pexels-photo-10610731.jpeg?auto=compress&cs=tinysrgb&w=1000",
    gallery: [
      {
        src: "https://images.pexels.com/photos/10610731/pexels-photo-10610731.jpeg?auto=compress&cs=tinysrgb&w=1000",
        alt: "Imagem ilustrativa de residência moderna"
      }
    ],
    photoCredit: "Foto ilustrativa de alleksana / Pexels",
    photoSource: "https://www.pexels.com/photo/modern-house-facade-10610731/"
  },
  {
    id: "casa-demo-04",
    title: "Casa demonstrativa 04",
    neighborhood: "Anúncio fictício · não disponível para locação",
    bedrooms: 2,
    price: 1700,
    features: "2 quartos · dados fictícios",
    badge: "IMÓVEL FICTÍCIO",
    demo: true,
    image: "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1000",
    gallery: [
      {
        src: "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1000",
        alt: "Imagem ilustrativa de casa contemporânea com acesso pavimentado"
      }
    ],
    photoCredit: "Foto ilustrativa de Max Vakhtbovych / Pexels",
    photoSource: "https://www.pexels.com/photo/modern-house-exterior-design-8134821/"
  }
];
