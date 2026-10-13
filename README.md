# Priscilla Ruiz · Odontologia e Harmonização Orofacial

Site institucional da clínica (Vila Formosa, São Paulo). HTML, CSS e JavaScript puros, sem etapa de build. Hospedado na Vercel, com deploy automático a cada push na branch `main`.

## Estrutura

- `index.html`: todo o conteúdo e os textos do site
- `assets/css/style.css`: identidade visual (cores e fontes ficam nas variáveis do `:root`)
- `assets/js/main.js`: menu, abas, animações e formulário que abre o WhatsApp
- `assets/img/`: logotipo, fotos e ícones
- `vercel.json`: cabeçalhos de cache e segurança

## Rodar localmente

```bash
npx serve .
```

## Onde editar

- **WhatsApp**: procure por `5511961947136` em `index.html` e substitua em todas as ocorrências.
- **Endereço, Instagram e CNPJ**: seções "Contato" e rodapé de `index.html`, além do bloco `application/ld+json` no `<head>`.
- **CRO**: há um comentário no rodapé de `index.html` indicando onde incluir o número de inscrição.
- **Tratamentos**: cada item é um `<li class="treat">` na seção "Tratamentos".
