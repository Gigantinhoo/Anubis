# Configuração de acesso do painel ANUBIS

O projeto Supabase `cjjeohqshlttsvjcwgmx` já possui as tabelas, as políticas RLS e o bucket `property-photos` preparados. O painel usa exclusivamente **e-mail e senha** do Supabase Auth para o login.

## 1. Contas que já existem

No momento da preparação desta versão, o Supabase Auth contém duas contas confirmadas e com senha cadastrada. As duas foram autorizadas em `public.admin_users` para administrar a ANUBIS.

Os endereços de e-mail do Outlook podem ser usados como nome de usuário, desde que sejam os mesmos e-mails cadastrados em Supabase → Authentication → Users. Criar uma caixa de e-mail no Outlook, por si só, não cria uma conta no Supabase.

## 2. Entrar no painel

1. Publique os arquivos atualizados no GitHub Pages.
2. Acesse `https://anubisimoveis.com/admin.html`.
3. Informe o e-mail e a senha da conta cadastrada no Supabase Auth.
4. Clique em **Entrar**.

O painel valida as credenciais com `signInWithPassword()` e depois confere se o usuário está autorizado na tabela `public.admin_users`.

## 3. Adicionar outro administrador no futuro

1. Abra [Authentication → Users](https://supabase.com/dashboard/project/cjjeohqshlttsvjcwgmx/auth/users).
2. Cadastre o novo usuário e defina uma senha. Confirme o e-mail da conta no Supabase, se necessário.
3. O novo usuário pode entrar no painel com e-mail e senha; caso ainda não esteja na lista de administradores, o painel exibirá um SQL individual para autorizá-lo.
4. Copie esse SQL, execute no [SQL Editor do projeto](https://supabase.com/dashboard/project/cjjeohqshlttsvjcwgmx/sql/new) e clique em **Já autorizei — atualizar**.

Nunca compartilhe ou envie senhas pelo chat. Cada administrador deve usar sua própria senha.

## 4. Importar o catálogo atual

No painel, clique em **Importar / atualizar catálogo antigo**. O processo lê o `imoveis.json` existente, mantém os IDs e slugs dos anúncios, copia as imagens codificadas em base64 para o bucket `property-photos` e grava os dados na tabela `public.properties`.

A importação não apaga o arquivo `imoveis.json` do GitHub. Registros existentes com o mesmo ID serão atualizados. O JSON permanece como backup e como fallback temporário do site.

## Segurança e acesso

- `sb_publishable_...` é uma chave pública de frontend; nunca use uma chave `sb_secret` ou `service_role` no navegador.
- `public.properties` tem RLS habilitado: visitantes leem anúncios que não sejam demonstrativos nem rascunhos; gravações exigem usuário autenticado e cadastrado em `public.admin_users`.
- O bucket `property-photos` é público para exibir as fotografias; upload, atualização e exclusão são restritos aos administradores.
- O painel não oferece cadastro público de usuários.
- Excluir um imóvel não remove automaticamente as imagens antigas do Storage.
