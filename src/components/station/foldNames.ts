// Stable public names for disclosures. Translations and list order can change independently.
const foldNames: Record<string, string> = {
  p035: "languages", p038: "hardware", p042: "compilers", p046: "applications",
  p051: "algorithms", p055: "graphics", p060: "ai-tools", p066: "editors", p069: "debugging",
  p092: "cad-bim", p095: "modeling", p102: "materials", p105: "creative-software",
  p124: "books", p153: "favorite-games", p164: "workstation", p204: "touhou",
};

export function foldName(key: string) {
  return foldNames[key] ?? key;
}
