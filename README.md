# Mensagem → Imagem (WhatsApp / visualização única)

Página única (`index.html`) que transforma o texto digitado em uma **imagem PNG
preta com fonte de terminal branca**, pronta para enviar no WhatsApp como
*visualização única*.

## Como usar

1. Abra o arquivo `index.html` no navegador (celular ou computador).
2. Digite a mensagem na caixa (`Ctrl`/`Cmd` + `Enter` também gera).
3. Toque em **Gerar imagem** — o PNG é criado na hora.
4. Use um dos botões:

| Botão | O que faz | Onde funciona melhor |
|---|---|---|
| **Enviar** | Abre o compartilhamento do sistema (WhatsApp aparece na lista) | Celular (Android/iOS) |
| **Baixar** | Salva o PNG no aparelho | Todos |
| **Copiar** | Copia a imagem para a área de transferência | WhatsApp Web / desktop |

5. No WhatsApp: anexe a imagem, toque no ícone **1** (visualização única) e envie.

## Por que a imagem fica leve

| Escolha técnica | Efeito |
|---|---|
| PNG **4 bits em escala de cinza** (16 tons), gerado à mão no navegador | ~45% menor que o PNG padrão do canvas, sem perda visual |
| Filtro de linha **Up** + `CompressionStream("deflate")` | Áreas pretas viram zeros → compressão máxima |
| Largura fixa de **1080 px** | Nítido no WhatsApp sem recompressão pesada |

Referência: mensagem de ~10 linhas ≈ **8 KB**; texto longo de 800 px de altura ≈ **28 KB**.

## Publicar no GitHub Pages (recomendado)

Servido por HTTPS, os botões **Baixar**, **Enviar** e **Copiar** funcionam sem restrição.

1. **Settings → Pages → Source: _Deploy from a branch_ → Branch: `main` / `(root)` → Save**
2. Aguarde cerca de um minuto e acesse `https://<usuário>.github.io/Oficina-WhatsApp-/`

### Instalar como app

A página é um PWA: no celular, use *Adicionar à tela de início* (o app abre em tela cheia,
com ícone próprio e sem barra do navegador). Depois da primeira visita o
`sw.js` guarda os arquivos em cache e **o app abre e gera imagens sem internet**.

Para publicar uma versão nova, mude `VERSAO` em `sw.js` (ex.: `-v2`) — assim o cache antigo
é descartado no próximo acesso.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | O app inteiro: interface, renderização e codificador PNG |
| `sw.js` | Service worker — cache dos arquivos para uso offline |
| `manifest.webmanifest` | Nome, cores e ícones do app instalado |
| `icons/` | Ícones 192, 512 (também *maskable*) e 180 (iOS) |

## Detalhes

- **Nada sai do aparelho**: a imagem é gerada localmente; não há backend nem rastreamento. A única requisição externa é a fonte (Google Fonts), que fica em cache depois da primeira visita.
- **Fonte**: JetBrains Mono, com as monoespaçadas do sistema como reserva (SF Mono / Menlo / Consolas / DejaVu Sans Mono). A imagem só é desenhada depois que a fonte carrega, para o resultado ser igual em qualquer aparelho.
- **Tamanhos** P / M / G; textos muito longos reduzem a fonte automaticamente para não gerar imagens gigantes.
- Quebra de linha respeita palavras e as quebras manuais; palavras enormes são cortadas sem estourar a margem.
- Emojis saem em tons de cinza (a imagem é monocromática por definição).
- O rascunho fica salvo no navegador (`localStorage`) até ser substituído.
- **apagar tudo**: limpa o texto, o rascunho salvo e a imagem gerada. Pede confirmação em dois toques (o botão vira *apagar mesmo?* por 4 segundos).
