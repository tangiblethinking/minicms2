export const SAMPLE_SHELL = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Design system sample</title>
  <style>
    :root {
      --surface: #ffffff;
      --ink: #1c1917;
      --muted: #78716c;
      --brand: #9a3412;
      --margin: 32px;
      --pad: 24px;
      --gap: 12px;
      --radius: 16px;
      --root-px: 16px;
      color: var(--ink);
      background: var(--surface);
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: var(--root-px);
    }
    * { box-sizing: border-box; }
    html, body, #root { height: 100%; }
    body { margin: 0; }
    .screen {
      height: 100%;
      min-height: 100%;
      padding: 0;
      background: var(--surface);
    }
    .page {
      height: 100%;
      width: 100%;
      overflow: auto;
      background: var(--surface);
      border-radius: 0;
      padding: var(--pad);
    }
    .swatches { display: flex; flex-wrap: wrap; gap: var(--gap); }
    .swatch { width: 4.75rem; }
    .chip {
      height: 3rem;
      border-radius: var(--radius);
      border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
    }
    .meta, .note {
      margin: 0.35rem 0 0;
      font-size: 12px;
      line-height: 1.3;
      color: var(--muted);
    }
    .types { display: flex; flex-direction: column; gap: 0.2rem; margin-top: 1.75rem; }
    .types p { margin: 0; color: var(--ink); }
    .stack { margin-top: 1.75rem; }
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap);
      padding: 12px;
      border-radius: var(--radius);
      background: color-mix(in srgb, var(--ink) 7%, var(--surface));
    }
    .pill {
      background: var(--surface);
      color: var(--ink);
      border-radius: var(--radius);
      padding: 8px 12px;
    }
    .between {
      width: 100%;
      background: color-mix(in srgb, var(--brand) 28%, transparent);
    }
    .notes { margin-top: 0.85rem; display: flex; flex-direction: column; gap: 0.2rem; }
  </style>
  <style type="text/tailwindcss" id="tw">
    @theme {
      --color-ink: #1c1917;
    }
  </style>
</head>
<body>
  <div id="root"><p class="note">Opening the sample.</p></div>
  <script>
    (function () {
      var TAGS = { h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, span: 1, label: 1, div: 1, small: 1, strong: 1, em: 1 };
      function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
      }
      function loadFonts(fonts) {
        document.querySelectorAll("[data-cc-font]").forEach(function (node) { node.remove(); });
        (fonts || []).forEach(function (font) {
          if (!font || typeof font.source !== "string" || font.source.indexOf("https://") !== 0) return;
          var file = font.source.match(/\.(woff2|woff|ttf|otf)(?:$|[?#])/i);
          if (file) {
            var format = file[1].toLowerCase() === "ttf" ? "truetype" : file[1].toLowerCase() === "otf" ? "opentype" : file[1].toLowerCase();
            var style = document.createElement("style");
            style.setAttribute("data-cc-font", "");
            style.textContent = "@font-face{font-family:" + JSON.stringify(font.family || font.name) + ";src:url(" + JSON.stringify(font.source) + ") format(" + JSON.stringify(format) + ");font-weight:100 900;font-style:normal;font-display:swap;}";
            document.head.appendChild(style);
            return;
          }
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = font.source;
          link.setAttribute("data-cc-font", "");
          document.head.appendChild(link);
        });
      }
      function apply(msg) {
        if (!msg || msg.type !== "cc-sample" || !msg.vars) return;
        loadFonts(msg.fonts);
        var style = document.documentElement.style;
        Object.keys(msg.vars).forEach(function (key) {
          if (key.indexOf("--") === 0 && typeof msg.vars[key] === "string") {
            style.setProperty(key, msg.vars[key]);
          }
        });
        var theme = document.getElementById("tw");
        if (theme && typeof msg.theme === "string") theme.textContent = msg.theme;
        var root = document.getElementById("root");
        root.replaceChildren();
        var screen = el("div", "screen");
        var page = el("div", "page");
        var swatches = el("div", "swatches");
        (msg.swatches || []).forEach(function (swatch) {
          var item = el("div", "swatch");
          var chip = el("div", "chip");
          chip.style.background = swatch.color;
          item.appendChild(chip);
          item.appendChild(el("p", "meta", swatch.name));
          swatches.appendChild(item);
        });
        var types = el("div", "types");
        (msg.types || []).forEach(function (typeStyle) {
          var tag = TAGS[typeStyle.tag] ? typeStyle.tag : "p";
          var line = el(tag, null, typeStyle.name + " · " + typeStyle.fontName);
          line.setAttribute("data-style", typeStyle.name);
          line.setAttribute("data-font", typeStyle.fontName);
          line.style.fontFamily = typeStyle.family;
          line.style.fontSize = typeStyle.sizeCss || (String(typeStyle.sizePt) + "px");
          line.style.lineHeight = String(typeStyle.lineHeight);
          line.style.fontWeight = String(typeStyle.weight);
          line.style.margin = "0";
          types.appendChild(line);
        });
        var stack = el("div", "stack");
        var row = el("div", "row");
        row.appendChild(el("span", "pill", "Mark"));
        row.appendChild(el("span", "pill", "Label"));
        var between = el("div", "between");
        between.style.height = msg.stack.pad;
        var rowTwo = el("div", "row");
        rowTwo.appendChild(el("span", "pill", "Field"));
        var notes = el("div", "notes");
        notes.appendChild(el("p", "note", msg.stack.padNote));
        notes.appendChild(el("p", "note", msg.stack.gapNote));
        notes.appendChild(el("p", "note", msg.stack.marginNote));
        notes.appendChild(el("p", "note", msg.stack.radiusNote));
        stack.appendChild(row);
        stack.appendChild(between);
        stack.appendChild(rowTwo);
        stack.appendChild(notes);
        page.appendChild(swatches);
        page.appendChild(types);
        page.appendChild(stack);
        screen.appendChild(page);
        root.appendChild(screen);
      }
      window.addEventListener("message", function (event) {
        apply(event.data);
      });
      window.parent.postMessage({ type: "cc-sample-ready" }, "*");
    })();
  </script>
  <script src="/vendor/tailwind-browser.js"></script>
</body>
</html>`;
