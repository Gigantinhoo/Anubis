# ANUBIS — páginas individuais com os 10 imóveis recuperados

Este pacote foi montado a partir do arquivo `Texto colado.txt` enviado na conversa, que contém o catálogo JSON completo com imagens embutidas.

## O que há no pacote

- `index.html`: homepage institucional sem a lista de imóveis.
- `gerenciar-imoveis.html`: versão do gerenciador antigo, sem o fluxo experimental de publicação via token.
- `admin.html`: página separada com cartões, fotos, disponibilidade e botões para abrir/copiar o link de cada imóvel.
- `imoveis/<slug>/index.html`: dez páginas individuais estáticas.
- `assets/images/imoveis-restaurados/`: as fotos incorporadas no JSON foram extraídas para arquivos de imagem separados.
- `scripts/home.js` e `styles/property.css`: recursos para homepage/páginas individuais.

## Imóveis incluídos

- **Casa Osíris** — `imoveis/casa-osiris/` — Alugado — 3 foto(s)
- **Apartamento Osiris** — `imoveis/apartamento-osiris/` — Disponível — 12 foto(s)
- **Apartamento Aguia** — `imoveis/apartamento-aguia/` — Disponível — 6 foto(s)
- **Sala comercial Aguia** — `imoveis/sala-comercial-aguia/` — Disponível — 5 foto(s)
- **Casa Set** — `imoveis/casa-set/` — Em breve — 1 foto(s)
- **Kitnet Aguia** — `imoveis/kitnet-aguia/` — Disponível — 7 foto(s)
- **Apartamento Aguia 2** — `imoveis/apartamento-aguia-2/` — Alugado — 4 foto(s)
- **Casa Ano Bom Fundos** — `imoveis/casa-ano-bom-fundos/` — Disponibilidade a confirmar — 1 foto(s)
- **Casa Henrique Fuck** — `imoveis/casa-henrique-fuck/` — Alugado — 0 foto(s)
- **Galpão Poço Danta** — `imoveis/galpao-poco-danta/` — Disponível — 0 foto(s)

## Instalação

1. Faça uma cópia de segurança da pasta local do repositório `Anubis`.
2. Extraia este ZIP dentro da pasta do repositório. Aceite substituir `index.html`, `admin.html` e `gerenciar-imoveis.html`; copie também as pastas `imoveis/`, `assets/images/imoveis-restaurados/`, `scripts/home.js` e `styles/property.css`.
3. Preserve `CNAME`, `assets/images/logo-anubis-original.jpeg`, `assets/images/imoveis/` e os arquivos originais `styles/style.css` e `scripts/main.js`.
4. Confira as mudanças no GitHub Desktop, faça commit e `Push origin`.
5. Depois que o GitHub Pages publicar, acesse `https://anubisimoveis.com/admin.html`. Compartilhe com sua mãe a página dos links. Ela pode abrir ou copiar o link de um único imóvel.

## Importante sobre dados e privacidade

- O catálogo recuperado tinha 10 registros. O pacote preserva nome, bairro/região, preço, quartos, banheiros, área, descrição, status e galeria quando disponíveis.
- Os endereços completos que estavam no JSON não são exibidos nas páginas públicas; elas mostram somente a região/bairro.
- Existe uma divergência no registro **Casa Ano Bom Fundos**: o campo `status` está como disponível, mas a etiqueta antiga está `ALUGADA`. O painel assinala para conferir; confirme antes de compartilhar esse anúncio.
- O registro **Casa Henrique Fuck** e **Galpão Poço Danta** não tem fotos no JSON anexado; por isso aparecem com uma área visual de foto em atualização.
- `admin.html` e as páginas individuais usam `noindex`, mas isso não é autenticação. Qualquer pessoa que tenha o link da página de administração pode ver a lista. Para privacidade real, o painel deve ficar atrás de autenticação/servidor privado. Como você pediu uma página simples para enviar à sua mãe, ela não está linkada na homepage.
- Esta versão é manual/estática. Se cadastrar um imóvel novo no gerenciador antigo, ele não criará automaticamente a página HTML. Envie os novos dados e fotos e eu poderei gerar outro pacote de páginas, ou podemos desenhar uma automação depois.
