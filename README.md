# ANUBIS Imóveis — integração Supabase

O site continua estático no GitHub Pages. O catálogo público agora consulta a tabela `public.properties`; o painel `admin.html` permite autenticação administrativa e operações de cadastro, edição, exclusão e upload das fotografias.

## Arquitetura

- `scripts/supabase-client.js`: cliente Supabase com a chave pública `sb_publishable_...`.
- `scripts/public-properties.js`: catálogo público, filtros e fallback para o `imoveis.json` atual.
- `scripts/property-detail.js`: página dinâmica do imóvel por `?slug=` com fallback para o JSON legado.
- `scripts/admin-supabase.js`: painel protegido por Supabase Auth, CRUD e importação do catálogo antigo.
- `styles/catalog.css`: estilos do catálogo público.
- `admin.html`: painel administrativo.
- `SUPABASE_SETUP.md`: primeiros passos para cadastrar e autorizar o administrador.

## Publicar os arquivos

1. Extraia o pacote na raiz do repositório `Gigantinhoo/Anubis`.
2. Mescle as pastas e substitua `index.html`, `imovel.html` e `admin.html`; adicione os novos arquivos nas pastas `scripts/` e `styles/`.
3. Não apague `imoveis.json`, `assets/`, `imoveis/`, `CNAME` ou os demais arquivos existentes.
4. Faça commit e push para `main`. O GitHub Pages publicará o site após o deploy.

## Acesso ao painel

O painel usa login com e-mail e senha via Supabase Auth. As duas contas confirmadas e com senha já existentes no projeto `cjjeohqshlttsvjcwgmx` foram autorizadas em `public.admin_users`. Novos administradores devem ser cadastrados no Supabase Auth e autorizados conforme o arquivo `SUPABASE_SETUP.md`.

Depois do login, use **Importar / atualizar catálogo antigo** uma vez para trazer os anúncios do `imoveis.json` para o banco e as imagens base64 para o Storage. O arquivo JSON original permanece no repositório como backup e fallback.

## Migrações SQL

As três migrações em `supabase/migrations/` correspondem ao esquema, aos ajustes de segurança e à autorização das duas contas atuais, já aplicados no projeto Supabase conectado. O banco não precisa ser recriado nem ter essas instruções executadas manualmente. Elas ficam no repositório para manter o histórico e facilitar o controle da estrutura.

## Segurança

A chave publishable é pública por definição e pode estar no JavaScript do navegador. Não coloque `sb_secret`, `service_role`, JWT secret ou qualquer credencial administrativa no repositório. O banco e o Storage usam Row Level Security; apenas IDs cadastrados em `public.admin_users` podem alterar anúncios ou enviar fotos.

## Contato comercial

+55 47 99202-4656
