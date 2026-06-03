export const dynamic = "force-dynamic";

function hashString(value = "") {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function sanitizeText(value = "") {
  return String(value)
    .replaceAll("&", "et")
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll('"', "")
    .slice(0, 120);
}

function createFallbackSvg(query, category) {
  const palette = {
    Match: ["#bef264", "#22d3ee", "#052e16"],
    Blessures: ["#fb7185", "#f97316", "#450a0a"],
    Moral: ["#38bdf8", "#22d3ee", "#082f49"],
    Vestiaire: ["#c084fc", "#f0abfc", "#2e1065"],
    Médias: ["#facc15", "#fb923c", "#451a03"],
    Supporters: ["#fb7185", "#f43f5e", "#4c0519"],
    Direction: ["#e2e8f0", "#94a3b8", "#020617"],
    Finances: ["#34d399", "#2dd4bf", "#052e16"],
    Mercato: ["#60a5fa", "#818cf8", "#172554"],
    Formation: ["#86efac", "#bef264", "#052e16"],
    Staff: ["#a78bfa", "#60a5fa", "#1e1b4b"],
    Compétitions: ["#fbbf24", "#fb923c", "#431407"],
  };

  const colors = palette[category] || palette.Match;
  const primary = colors[0];
  const secondary = colors[1];
  const dark = colors[2];

  const safeQuery = sanitizeText(query || "Career Event");
  const safeCategory = sanitizeText(category || "Event");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="45%" stop-color="${secondary}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
      <radialGradient id="light" cx="25%" cy="18%" r="55%">
        <stop offset="0%" stop-color="white" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1400" height="900" fill="url(#bg)"/>
    <rect width="1400" height="900" fill="url(#light)"/>

    <g opacity="0.18">
      <rect x="120" y="135" width="1160" height="620" rx="64" fill="none" stroke="white" stroke-width="8"/>
      <line x1="700" y1="135" x2="700" y2="755" stroke="white" stroke-width="7"/>
      <circle cx="700" cy="445" r="130" fill="none" stroke="white" stroke-width="7"/>
    </g>

    <rect x="90" y="90" width="1220" height="220" rx="54" fill="rgba(0,0,0,0.35)"/>
    <text x="140" y="180" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="white" letter-spacing="8">${safeCategory}</text>
    <text x="140" y="250" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="white">${safeQuery}</text>

    <rect x="90" y="650" width="1220" height="145" rx="46" fill="rgba(0,0,0,0.38)"/>
    <text x="140" y="735" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" fill="rgba(255,255,255,.9)">Illustration générative fallback</text>
  </svg>`;

  return svg;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;

  const query = searchParams.get("query") || "football stadium";
  const category = searchParams.get("category") || "Match";
  const seed = searchParams.get("seed") || query;

  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return new Response(createFallbackSvg(query, category), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    const page = (hashString(seed) % 8) + 1;

    const pexelsUrl = new URL("https://api.pexels.com/v1/search");
    pexelsUrl.searchParams.set("query", query);
    pexelsUrl.searchParams.set("orientation", "landscape");
    pexelsUrl.searchParams.set("per_page", "12");
    pexelsUrl.searchParams.set("page", String(page));
    pexelsUrl.searchParams.set("locale", "fr-FR");

    const response = await fetch(pexelsUrl, {
      headers: {
        Authorization: apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Pexels API error");
    }

    const data = await response.json();
    const photos = Array.isArray(data.photos) ? data.photos : [];

    if (!photos.length) {
      throw new Error("No photo found");
    }

    const index = hashString(seed + query) % photos.length;
    const photo = photos[index];

    const imageUrl =
      photo?.src?.large2x ||
      photo?.src?.large ||
      photo?.src?.landscape ||
      photo?.src?.medium;

    if (!imageUrl) {
      throw new Error("No valid image URL");
    }

    return Response.redirect(imageUrl, 302);
  } catch {
    return new Response(createFallbackSvg(query, category), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  }
}