/* Service worker: deixa o app abrir offline depois da primeira visita.
   Estratégia: cache primeiro para os arquivos do app (são estáticos e pequenos);
   a rede só é usada para preencher o cache e para as fontes do Google. */
var VERSAO = "imagem-messenger-v9";
var ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSAO)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (n) {
        return n === VERSAO ? null : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  // Navegação: cache primeiro, com a rede atualizando a cópia em segundo plano.
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html").then(function (hit) {
        var rede = fetch(req).then(function (res) {
          caches.open(VERSAO).then(function (c) { c.put("./index.html", res.clone()); });
          return res;
        }).catch(function () { return hit; });
        return hit || rede;
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        // guarda o que der (inclui as fontes do Google, em respostas opacas)
        if (res && (res.ok || res.type === "opaque")) {
          var copia = res.clone();
          caches.open(VERSAO).then(function (c) { c.put(req, copia); });
        }
        return res;
      });
    })
  );
});
