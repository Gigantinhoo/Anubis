# ANUBIS Imóveis — estrutura com páginas individuais

## O que muda

- `index.html`: homepage institucional, sem lista de imóveis.
- `admin.html`: painel interno de links com fotos; pede a senha do catálogo criptografado.
- `gerenciar-imoveis.html`: cadastro/edição/exclusão. O botão **Sincronizar catálogo** apenas carrega dados; o botão **Publicar páginas** é o que cria/atualiza `imoveis/<slug>.html` e atualiza o painel.
- `imoveis/casa-suzana.html` e `imoveis/apartamento-aguia.html`: páginas iniciais independentes para os imóveis conhecidos.
- `scripts/home.js`, `scripts/property-page.js`, `styles/property.css`: arquivos necessários para menu, fotos e apresentação das páginas.

O pacote não inclui a pasta existente `assets/` nem substitui `styles/style.css`. Preserve essas pastas do repositório.

## Instalação

1. Feche o gerenciador e faça uma cópia da pasta local do repositório `Anubis`.
2. Extraia este ZIP **dentro da pasta local do repositório**. Aceite substituir `index.html` e `gerenciar-imoveis.html`; adicione as pastas/arquivos incluídos. Preserve `assets/` e `styles/style.css`.
3. Se existir `imoveis.json` na raiz, o gerenciador remove o arquivo do catálogo público ao concluir a primeira publicação. Não o use como painel de administração.
4. No GitHub Desktop, confira as alterações, faça commit e `Push origin`. Resolva `Pull origin` antes se o GitHub avisar que há commit remoto.
5. Espere o GitHub Pages publicar. Abra o site por HTTPS e acesse `gerenciar-imoveis.html`.
6. Clique em **Sincronizar catálogo**. No primeiro uso, se não existir catálogo protegido, o gerenciador carrega os dois cadastros iniciais.
7. Confira os dados. Clique em **Publicar páginas**. Na primeira publicação, informe o token Fine-grained (repositório `Gigantinhoo/Anubis`, permissão `Contents: Read and write`) e crie uma senha forte com pelo menos 12 caracteres. Nunca mande token ou senha no chat.
8. Depois da publicação, a mensagem de sucesso confirma que as páginas foram criadas. Abra `admin.html`, digite a mesma senha e veja os cartões e links individuais para compartilhar.

## Uso recorrente

Para criar um novo imóvel: clique `+ Adicionar imóvel`, preencha o nome, localização, situação, descrição e fotos, clique em salvar e então em **Publicar páginas**. A página será criada com endereço como `imoveis/apartamento-aguia.html`. O botão **Sincronizar catálogo** não publica arquivos.

Para editar um imóvel existente, selecione-o na lista, altere os campos e clique em **Publicar páginas**. Para excluir, remova pelo painel e publique. O gerenciador remove a página antiga no próximo publish.

## Privacidade: limite importante

A homepage não lista imóveis e cada anúncio tem URL própria marcada `noindex`. O painel mostra links somente após senha, usando um catálogo criptografado. Mesmo assim, GitHub Pages em repositório público não é controle de acesso: quem descobrir/conseguir o link individual pode abrir a página, e nomes de arquivos do repositório público podem ser inspecionados. Não coloque endereço completo nem dados pessoais na página pública. O endereço completo fica apenas no catálogo criptografado e é excluído do HTML público.

Apagar o `imoveis.json` atual não apaga valores/endereço de versões antigas no histórico Git. Se havia informação sensível publicada, será necessário limpar o histórico ou migrar para hospedagem/backend privado.
