const FONT_FILE = /\.(woff2|woff|ttf|otf)(?:$|[?#])/i;

export function googleFontStylesheet(family: string): string {
  const name = family.trim().replace(/^["']+|["']+$/g, "");
  const query = encodeURIComponent(name).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${query}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;
}

export function fontStackFor(name: string): string {
  const family = name.trim() || "Untitled";
  return `"${family.replace(/["\\]/g, "")}", ui-sans-serif, system-ui, sans-serif`;
}

export function safeFontSource(value: string): string {
  const next = value.trim();
  if (!next) return "";
  try {
    const url = new URL(next);
    if (url.protocol !== "https:") return "";
    if (url.username || url.password) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function fontFileFormat(source: string): string | null {
  const match = FONT_FILE.exec(source);
  if (!match) return null;
  if (match[1].toLowerCase() === "ttf") return "truetype";
  if (match[1].toLowerCase() === "otf") return "opentype";
  return match[1].toLowerCase();
}

export function fontFaceFamily(name: string, stack: string): string {
  const quoted = stack.match(/"([^"]+)"|'([^']+)'/);
  const named = quoted?.[1] || quoted?.[2];
  return (named || name || "Untitled").replace(/["\\]/g, "").slice(0, 80);
}
