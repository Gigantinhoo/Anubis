# ANUBIS Imóveis

Site institucional responsivo para aluguel residencial em Corupá, Santa Catarina.

## Como editar casas e valores (jeito fácil)

Abra o arquivo `scripts/imoveis-data.js`. Cada bloco entre chaves representa uma casa. Para mudar o aluguel, altere o número em `price`; por exemplo, `price: 1200` mostra R$ 1.200/mês. Para mudar a foto principal, altere `image`. Para a galeria, adicione ou remova itens dentro de `gallery`. Para cadastrar uma casa nova, copie um bloco completo e dê a ele um `id` único.

Depois de salvar as alterações, faça upload/commit no GitHub. O GitHub Pages atualiza o site depois de concluir a publicação.

## Estrutura

- `index.html`: estrutura da página.
- `styles/style.css`: identidade visual preta e dourada e layout responsivo.
- `scripts/imoveis-data.js`: **lista de imóveis, preços, fotos e textos que você altera no dia a dia**.
- `scripts/main.js`: renderização do catálogo, filtros, galeria e links de WhatsApp.
- `assets/images/logo-anubis-original.jpeg`: logotipo enviado.
- `assets/images/imoveis/casa-teste/`: as três fotos de teste enviadas pelo usuário.

## Dados de demonstração

Este catálogo tem quatro anúncios demonstrativos: a primeira casa usa as três fotos de teste enviadas e o valor de R$ 1.200/mês pedido para testar o layout. As outras três casas são fictícias, com valores de R$ 1.000, R$ 1.450 e R$ 1.700/mês, e fotos ilustrativas do Pexels. Nada disso deve ser apresentado como disponibilidade real. As imagens ilustrativas têm crédito e link para a página da foto.

Os botões de WhatsApp usam o número informado: +55 47 99202-4656.

## Publicação

Abra `Settings → Pages`, selecione a branch `main` e a pasta `/(root)`.
