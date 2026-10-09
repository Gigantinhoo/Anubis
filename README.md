# ANUBIS Imóveis

Site responsivo para locação residencial em Corupá, Santa Catarina.

## Disponibilidade e botão do WhatsApp

No arquivo `imoveis.json`, cada imóvel tem um campo `status`. Use:

- `"available"`: mostra o botão do WhatsApp.
- `"unavailable"`: oculta o botão.
- `"soon"`: mostra o anúncio como em breve e oculta o botão.
- `"rented"`: mostra o anúncio como alugado e oculta o botão.

No gerenciador visual, escolha a disponibilidade no menu “Disponibilidade e botão de contato”. Marcar um anúncio como demonstração é independente da disponibilidade.

## Mensagem personalizada do WhatsApp

No gerenciador, o campo “Mensagem pronta do WhatsApp” permite configurar uma mensagem diferente para cada imóvel. O campo `whatsappMessage` do `imoveis.json` guarda o texto. Use `{{nome}}` para inserir automaticamente o título do imóvel. Também estão disponíveis `{{localizacao}}`, `{{valor}}`, `{{quartos}}` e `{{banheiros}}`. Se o campo ficar vazio, o site usa a mensagem padrão.

Exemplo:

`Olá! Gostaria de saber mais informações sobre {{nome}}. Poderia me passar os detalhes e as condições de locação?`

## Atualização

1. Abra `gerenciar-imoveis.html` ou acesse a ferramenta publicada.
2. Clique em **Carregar catálogo publicado** ou importe o arquivo `imoveis.json`.
3. Edite o imóvel, a disponibilidade e a mensagem pronta.
4. Clique em **Salvar dados desta casa** e depois em **Baixar catálogo atualizado**.
5. Envie o `imoveis.json` baixado para a raiz deste repositório e faça commit. O GitHub Pages publica a alteração após concluir o deploy.

O catálogo demonstrativo mantém a casa com fotos de teste marcada como disponível para permitir testar o botão. Os outros anúncios de exemplo estão como indisponíveis, pois são fictícios. Revise os dados antes de usar comercialmente.

Contato comercial: +55 47 99202-4656.
