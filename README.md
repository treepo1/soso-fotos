# 📸 Fotos do aniversário — QR code → Google Drive

Os convidados leem o QR code e abrem um site com dois botões, **Tirar foto** e
**Escolher da galeria**. As fotos vão direto para uma pasta do seu Google Drive.
Não precisa de servidor, não tem custo e os convidados não precisam fazer login.

| Arquivo       | O que é                                                    |
|---------------|------------------------------------------------------------|
| `Code.gs`     | Backend (Google Apps Script): salva as fotos no Drive      |
| `Index.html`  | Página que os convidados veem no celular                   |
| `qrcode.html` | Gera um cartaz A5 com o QR code para imprimir              |

## Publicação atual

- **Site (link do QR code):** https://treepo1.github.io/soso-fotos/ (GitHub Pages, pasta `docs/`)
- **API que salva no Drive (Apps Script):** https://script.google.com/macros/s/AKfycbzCPuVDbEgNhgDQT7e3atpElBt1qA5RzUxax8zKJyWAgazJbK84FOGGS2OTgzgQT3DeJw/exec
- **Editor do script:** https://script.google.com/d/10RxhSqJkiJNhKTdfP3XEsKv1zN6OzTQvcgTsf4VdDzOak1Acofxh0LmK/edit
- **Fotos:** pasta "Fotos - Soso faz 1 aninho!" no Google Drive (criada automaticamente)

Para gerar o cartaz, abra `qrcode.html` no navegador e clique em **Imprimir**.

> O site fica fora do Google de propósito: páginas servidas pelo Apps Script rodam
> dentro de iframes do Google e o Safari do iPhone costuma bloqueá-las. A página em
> `docs/index.html` envia as fotos para o `doPost` do Apps Script via `fetch`.

## Alterações depois de publicado

Mudanças na página (`docs/index.html`): faça commit e `git push`; o GitHub Pages
atualiza em ~1 minuto.

Mudanças no backend (`Code.gs`), publicado com o [clasp](https://github.com/google/clasp). Para atualizar mantendo a
mesma URL da API:

```sh
clasp push
clasp update-deployment AKfycbzCPuVDbEgNhgDQT7e3atpElBt1qA5RzUxax8zKJyWAgazJbK84FOGGS2OTgzgQT3DeJw
```

## Detalhes

- As fotos são redimensionadas para no máximo 2400px (JPEG). O upload fica rápido
  mesmo no 4G e a qualidade continua ótima para álbum e impressão.
- Os arquivos são nomeados com `data_hora_nome-do-convidado_xxxx.jpg`.
- Se um envio falhar, o site tenta de novo sozinho. Se ainda assim falhar, o
  convidado pode tocar na miniatura para reenviar.
- No topo da página aparece um aviso cinza do Google ("Este aplicativo foi criado
  por um usuário do Google Apps Script"). É padrão do Apps Script e não atrapalha.
- Cotas da conta gratuita: cerca de 20 mil chamadas por dia e até 30 envios
  simultâneos, mais do que suficiente para uma festa.
