# ANUBIS Imóveis — nova estrutura

Esta atualização troca a homepage por uma apresentação institucional, sem cards de imóveis, e cria uma página HTML individual por imóvel. O gerenciador publica páginas novas/atualizadas automaticamente por meio da API do GitHub.

## Arquivos do pacote

- `index.html`: homepage institucional, sem anúncios de imóveis.
- `admin.html`: painel de links com fotos; pede a senha do catálogo criptografado.
- `gerenciar-imoveis.html`: gerenciador para cadastrar, editar e excluir imóveis e publicar páginas HTML individuais.
- `imoveis/`: as páginas HTML individuais são criadas automaticamente na primeira publicação.
- `scripts/home.js`, `scripts/property-page.js`, `styles/property.css`: suporte das páginas.

O pacote usa o arquivo existente `styles/style.css` da ANUBIS na homepage e as imagens existentes em `assets/images/`; não substitua nem exclua essas pastas.

## Instalação no GitHub Desktop

1. Faça uma cópia de segurança da pasta local atual do repositório `Anubis`.
2. Extraia o ZIP **dentro da pasta local do repositório**, preservando as pastas. Aceite substituir `index.html` e `gerenciar-imoveis.html`; adicione os demais arquivos.
3. Se houver um arquivo antigo `admin/catalogo.json` em texto aberto, remova-o. Não deixe esse catálogo sem criptografia no repositório público.
4. No GitHub Desktop, confira a lista de arquivos alterados. Faça commit e `Push origin`.
5. Abra `https://anubisimoveis.com/gerenciar-imoveis.html` pelo domínio publicado, não pelo arquivo local. Clique em “Sincronizar catálogo”; na primeira execução, ele importa os imóveis e fotos do antigo `imoveis.json` que já estão no site. Não pule esta migração.
6. Clique em “Publicar páginas”. Na primeira publicação, o sistema converte as fotos embutidas em arquivos de imagem, cria um HTML para cada imóvel e só então remove o arquivo de catálogo antigo. Defina uma senha forte para o catálogo, guarde-a e compartilhe-a com sua mãe. Quando solicitado, use um token Fine-grained do GitHub limitado ao repositório `Gigantinhoo/Anubis` com `Contents: Read and write`. O token fica apenas na memória da aba.
7. Para ver os links depois, acesse `https://anubisimoveis.com/admin.html` e digite a senha do catálogo. O painel mostra os cartões dos imóveis e permite abrir/copiar cada link individual.

## Como usar depois

No gerenciador, escolha um imóvel para editar ou clique em `+ Adicionar imóvel`. Adicione várias fotos de uma vez, salve e clique em `Publicar páginas`. O sistema cria/atualiza `imoveis/<identificador>.html`, atualiza o catálogo criptografado e remove a página HTML de imóveis excluídos. Não é necessário criar HTML manualmente.

A senha do catálogo protege a lista administrativa e os dados internos, inclusive o campo de endereço completo. As páginas públicas recebem apenas os campos próprios do anúncio; o endereço completo é removido antes de gerar o HTML público. Os nomes dos arquivos individuais são identificadores aleatórios, para não expor o nome do imóvel na URL.

## Privacidade, sem promessas mágicas

- A homepage não mostra imóveis nem contém um link público para o painel.
- A lista administrativa é armazenada criptografada com AES-GCM, com chave derivada da senha via PBKDF2. Na primeira migração, o gerenciador lê o antigo `imoveis.json`; publique a migração logo após instalar os arquivos para remover o catálogo antigo da versão atual do site. A senha não está no código e não é salva pelo navegador.
- Cada página individual pode ser acessada por quem tiver o link. O `noindex` ajuda a evitar indexação, mas não é controle de acesso.
- O repositório GitHub é público: alguém pode navegar pela pasta de páginas no próprio GitHub, mesmo que a homepage não liste os imóveis. Os nomes dos HTMLs são aleatórios e o catálogo administrativo fica criptografado, mas isso não torna as páginas individuais privadas.
- O histórico de commits antigos pode continuar mostrando o antigo `imoveis.json` e dados publicados antes. Apagar um arquivo não apaga sua versão do histórico. Como o catálogo antigo contém informações internas, a privacidade total exige limpar o histórico público ou mover o repositório/catálogo para uma arquitetura privada.

## Nota técnica

O gerenciador precisa ser aberto por HTTPS para a API do GitHub e para a criptografia Web Crypto. Nunca cole o token do GitHub em conversas ou salve-o no código. Use permissões mínimas e revogue o token se achar que foi exposto.
