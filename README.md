# ANUBIS Imóveis

Site responsivo para locação residencial em Corupá, Santa Catarina.

## Editar imóveis sem programar

Use a ferramenta separada `gerenciar-imoveis.html` do pacote **ANUBIS - Ferramenta de Catálogo**. Não é preciso abrir nem alterar código.

1. Baixe o `imoveis.json` atual no GitHub e abra a ferramenta local no navegador.
2. Clique em **Importar arquivo JSON** e escolha esse arquivo.
3. Selecione a casa para alterar preço, localização, datas, quartos e descrição.
4. Para colocar várias fotos na mesma casa, selecione todas em **Adicionar fotos**. A ferramenta reduz as imagens automaticamente; a primeira fica como capa. Você pode trocar a capa, remover imagens e adicionar mais.
5. Clique em **Salvar dados desta casa** e depois em **Baixar catálogo atualizado**.
6. Envie o `imoveis.json` baixado para a raiz deste repositório, substituindo o arquivo anterior.

O editor local não grava diretamente no GitHub. O site só recebe alterações quando o novo `imoveis.json` é enviado e o GitHub Pages conclui a publicação.

## Estrutura

- `index.html`: site público.
- `styles/style.css`: identidade visual preta e dourada e layout responsivo.
- `scripts/main.js`: catálogo, filtros, galeria, datas e links para WhatsApp.
- `imoveis.json`: **arquivo de dados editado pela ferramenta visual**.
- `assets/images/logo-anubis-original.jpeg`: logotipo enviado.
- `assets/images/imoveis/casa-teste/`: as três fotos de teste recebidas para uma mesma casa.

## Anúncios demonstrativos

O catálogo inicial contém quatro exemplos: R$ 1.200/mês na casa das fotos enviadas e exemplos fictícios de R$ 1.000, R$ 1.450 e R$ 1.700/mês. Os exemplos não são ofertas reais. Substitua-os antes de usar comercialmente.

Contato comercial: +55 47 99202-4656.

## GitHub Pages

Em `Settings → Pages`, selecione a branch `main` e a pasta `/(root)`.
