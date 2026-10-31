# Notas de contexto do projeto

> Este arquivo é lido automaticamente por qualquer sessão do Claude Code que trabalhe
> neste repositório. Serve para não repetir descobertas e erros já resolvidos.

## Usuário

- Prefere respostas em **português**, concisas, com tabelas/tópicos/estrutura visual.

## Publicar páginas com dados externos ao vivo (APIs)

**Problema:** o `Artifact` tool do Claude (claude.ai/artifact) roda em um sandbox com
CSP restrito: `fetch`/`XHR`/`WebSocket` para qualquer domínio externo é **bloqueado**,
exceto scripts de poucos CDNs (cdnjs, jsdelivr, unpkg, Google Fonts). Ou seja, **não dá
para montar um Artifact que consome APIs públicas ao vivo** (ex.: previsão do tempo,
rastreamento de aviões, radar de chuva, satélites).

**O que NÃO funcionou neste ambiente:**
- Deploy via Netlify MCP (`mcp__Netlify__*`) — a rede deste container/ambiente bloqueia
  os hosts `netlify.com` / `api.netlify.com` no egress proxy. Mudar "Network access"
  no ambiente exigiria sessão nova com a config aplicada, e mesmo assim não é garantido
  que o app mobile exponha essa tela (só aparece bem no claude.ai/code via navegador/desktop).

**O que FUNCIONOU:**
1. Fazer commit do HTML/JS/CSS estático direto no repositório GitHub (via
   `mcp__github__create_or_update_file`).
2. Servir a página renderizada (não o código-fonte) via **htmlpreview.github.io**:
   ```
   https://htmlpreview.github.io/?https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>/index.html
   ```
   Isso funciona sem precisar habilitar GitHub Pages e sem builds. A página roda como
   site normal (sem sandbox de Artifact), então `fetch()` para APIs externas funciona
   normalmente (sujeito a CORS de cada API, mas as usadas abaixo liberam CORS).

**Padrão para pedidos futuros de "central/dashboard ao vivo":** ir direto para o
caminho GitHub + htmlpreview, sem tentar Netlify/Artifact primeiro.

## Central de Monitoramento (Caetité, BA)

- Local: `central-monitoramento/index.html`
- Link ao vivo: https://htmlpreview.github.io/?https://raw.githubusercontent.com/gilsonbolivar-maker/Oficina-WhatsApp-/main/central-monitoramento/index.html
- Coordenadas usadas: -14.0694, -42.4825 (Caetité/BA)
- Painéis e fontes (todas sem necessidade de chave de API):
  - **Vento**: Open-Meteo (`api.open-meteo.com`)
  - **Chuva**: Open-Meteo (números) + RainViewer (radar em tiles no mapa)
  - **Satélites**: wheretheiss.at (posição da ISS em tempo real)
  - **Aviões**: OpenSky Network (`opensky-network.org/api/states/all`, bbox ~170km)
  - Mapas: Leaflet + tiles CartoDB Dark Matter (tema escuro)
- Catálogo completo de satélites (passagens visíveis de outros satélites) exigiria
  chave gratuita da N2YO — não implementado, só citado como nota no painel.
