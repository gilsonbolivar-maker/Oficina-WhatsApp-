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

## Detalhes

- **100% offline**: sem servidor, sem CDN, sem rastreamento. Nada sai do aparelho.
- **Fonte**: monoespaçada do sistema (JetBrains Mono / SF Mono / Menlo / Consolas / DejaVu Sans Mono).
- **Tamanhos** P / M / G; textos muito longos reduzem a fonte automaticamente para não gerar imagens gigantes.
- Quebra de linha respeita palavras e as quebras manuais; palavras enormes são cortadas sem estourar a margem.
- Emojis saem em tons de cinza (a imagem é monocromática por definição).
- O rascunho fica salvo no navegador (`localStorage`) até ser substituído.
- **apagar tudo**: limpa o texto, o rascunho salvo e a imagem gerada. Pede confirmação em dois toques (o botão vira *apagar mesmo?* por 4 segundos).
