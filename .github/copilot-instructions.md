<!-- .github/copilot-instructions.md -->
# Instruções rápidas para agentes de código (wr-sneakerss-site)

Objetivo curto: este repositório é um site estático unilateral (Single Page) para a lavanderia "wr.sneakerss". Forneça mudanças seguras para HTML/CSS/JS, preserve nomes de arquivo de mídia por padrão e atualize links externos (WhatsApp, Google Fonts, CDN) quando necessário.

Resumo da arquitetura (o essencial)
- Tipo: site estático (HTML + CSS + JS). Não há build tool, bundler ou backend no repositório.
- Arquivos principais:
  - `index.html` — a única página; contém seções com ids: `#home`, `#servicos`, `#qualidade`, `#sobre`, `#contato`.
  - `style.css` — estilos globais; usa variáveis CSS em `:root` para cores e temas.
  - `script.js` — interatividade; depende de GSAP (CDN) e gerencia scroll suave, estado ativo do menu e efeitos no header.
  - `img/` e `video/` — ativos estáticos; há também `sneakers.mp4` na raiz (observe duplicação de vídeos em caminhos diferentes).

Fluxos e comandos importantes
- Não existe build: para testar localmente, abra `index.html` no navegador OU rode um servidor estático (recomendado para testes de vídeo/fontes):

  - Python: `python -m http.server 8000`
  - Node (serve): `npx serve`

- Deploy: qualquer host de arquivos estáticos (Netlify, GitHub Pages, Vercel estático, S3). Garanta que arquivos de mídia (ex: `sneakers.mp4`, `img/etiqueta.png`, `video/sneakers.mp4`) sejam preservados nos caminhos relativos usados em `index.html`.

Padrões e convenções do projeto (extratos e exemplos)
- Estrutura visual e componentes são baseados em classes CSS reutilizáveis:
  - Container centralizador: `.container` (max-width:1200px)
  - Cards de serviço: `.services-grid` > `.service-card` (título em `.service-title`, preço em `.service-price`). Para adicionar serviço, copie um `.service-card` e atualize o conteúdo.
  - Botões: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp` e botão flutuante `.floating-whatsapp`.

- Temas/cores:
  - Mude as cores no topo de `style.css` dentro de `:root` (ex.: `--primary`, `--bg`, `--text`).

- Responsividade:
  - Ponto de corte principal: `@media (max-width: 768px)` — comportamento móvel: menu escondido, grid passa a 1 coluna, mídia é ordenada acima do texto.

- JavaScript:
  - `script.js` assume que o GSAP já foi carregado. Em `index.html` o script do GSAP está incluído no `<head>` e `script.js` no final do `<body>` — preserve essa ordem para evitar erros de referência.
  - Navegação ativa: as âncoras (`a[href^="#"]`) correspondem a `section[id]`. O código adiciona/removes a classe `.active` nas `.nav-link`.

Pontos sensíveis / Atenção rápida

- Link do WhatsApp: o mesmo URL (`https://wa.me/message/4MSU6Z2FAURLA1`) aparece várias vezes em `index.html`. Atualize todas as ocorrências ao trocar o número/fluxo — use busca no repo.
- Vídeo duplicado: existe `sneakers.mp4` na raiz e `video/sneakers.mp4` em `video/`. Mantenha nomes e caminhos consistentes. Se renomear, atualize ambas as tags <video> e o `<source>` correspondente.
- Fonts & CDN: `index.html` carrega Inter via Google Fonts e GSAP via CDN (`gsap 3.12.5`). Preserve a ordem: carregue GSAP antes de `script.js`.
- Header & navegação: `header` (id="header") é manipulado por `script.js` para sombras; `.nav-link` recebe `.active` com base nas `section[id]`. Ao renomear seções, atualize âncoras e IDs juntos.

Checklist rápido para mudanças seguras

1. Texto/ conteúdo: edite `index.html` diretamente. Procure por strings exemplo:
  - Título hero: `<h1 class="hero-title">...`;
  - Cards: `.services-grid` > `.service-card` (título `.service-title`, preço `.service-price`).
2. Estilos: alterar variáveis em `:root` no `style.css` (e.g. `--primary`, `--bg`).
3. Assets: preserve nomes de arquivos em `img/` e `video/` por padrão. Atualize referências relativas em `index.html` se mover/renomear.
4. JS: não mover `script.js` para o head sem carregar primeiro a dependência GSAP; testes rápidos dependem do comportamento de animação.
5. Teste local: abra `index.html` no navegador OU rode um servidor estático para testar vídeo/poster corretamente (ex.: `python -m http.server 8000`).

Exemplos de padrões detectados

- Botões: classes compostas `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`. O botão flutuante é `.floating-whatsapp` com SVG inline.
- Grid de serviços: para adicionar um serviço, copie um bloco `.service-card` em `index.html` — o CSS já trata responsividade em `@media (max-width: 768px)`.
- Mídia no hero/qualidade: use `hero-video-wrapper` e `media-wrapper`; existe uma badge (`.hero-video-badge`) que referencia `img/etiqueta.png`.

Debug rápido e problemas comuns

- Se as animações não rodarem, verifique se o CDN do GSAP carregou (network tab). Erro JS típico vem de `gsap` undefined.
- Se vídeos não carregarem localmente, rode um servidor HTTP (navegadores limitam alguns recursos via file://).
- Se a navegação âncora não ativar o `.active`, confirme que as `section` têm `id` exatamente iguais às hrefs dos links.

Quando mesclar/atualizar este arquivo

- Se já existe `.github/copilot-instructions.md`, preserve os blocos com instruções operacionais (comandos de teste, links externos) e atualize exemplos específicos (ex.: novo URL do WhatsApp, renomeação de assets).

Pergunta final

Revisei e documentei os pontos essenciais; quer que eu detalhe scripts de deploy (GitHub Pages / Netlify) ou adicione um pequeno checklist de QA visual (tamanhos de imagem, testes mobile)?