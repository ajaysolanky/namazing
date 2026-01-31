import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import type { RunResult } from "@/lib/types";

// Disable hyphenation (can cause layout issues)
Font.registerHyphenationCallback((word) => [word]);

// Resolve font paths relative to project root (server-side only)
const fontsDir = path.join(process.cwd(), "public", "fonts");

// Register Playfair Display for headings (serif, premium feel)
Font.register({
  family: "Playfair Display",
  fonts: [
    {
      src: path.join(fontsDir, "playfair-400.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(fontsDir, "playfair-700.ttf"),
      fontWeight: 700,
    },
    {
      src: path.join(fontsDir, "playfair-400i.ttf"),
      fontStyle: "italic",
      fontWeight: 400,
    },
  ],
});

// Register Lato for body text (clean sans-serif)
Font.register({
  family: "Lato",
  fonts: [
    {
      src: path.join(fontsDir, "lato-300.ttf"),
      fontWeight: 300,
    },
    {
      src: path.join(fontsDir, "lato-400.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(fontsDir, "lato-700.ttf"),
      fontWeight: 700,
    },
  ],
});

// Noto Sans — used for IPA pronunciation (has full Unicode/IPA glyph coverage)
Font.register({
  family: "Noto Sans",
  fonts: [
    {
      src: path.join(fontsDir, "noto-sans-400.ttf"),
      fontWeight: 400,
    },
  ],
});

// Design tokens — refined palette
const colors = {
  background: "#FAF9F6",
  ink: "#2D2D2D",
  inkBody: "#4A4A4A",
  inkMuted: "#6B6B6B",
  inkFaint: "#9B9B9B",
  rose: "#f0d0d4",
  sage: "#8BA889",
  terracotta: "#C4725A",
  cream: "#F5F2ED",
  white: "#FFFFFF",
  border: "rgba(0,0,0,0.06)",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    paddingTop: 48,
    paddingHorizontal: 48,
    paddingBottom: 72,
    fontFamily: "Lato",
    fontSize: 10.5,
    fontWeight: 300,
    color: colors.inkBody,
  },

  // Header
  header: {
    marginBottom: 36,
    textAlign: "center",
  },
  logo: {
    fontFamily: "Lato",
    fontSize: 8,
    fontWeight: 400,
    color: colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Playfair Display",
    fontSize: 36,
    fontWeight: 700,
    color: colors.ink,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Lato",
    fontSize: 10,
    fontWeight: 300,
    color: colors.inkMuted,
    letterSpacing: 0.5,
  },

  // Summary
  summary: {
    fontFamily: "Lato",
    fontSize: 11,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.7,
    textAlign: "center",
    marginBottom: 36,
    paddingHorizontal: 48,
    maxWidth: 480,
    alignSelf: "center",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
    marginHorizontal: 80,
  },

  // Section titles
  sectionTitle: {
    fontFamily: "Playfair Display",
    fontSize: 22,
    fontWeight: 400,
    color: colors.ink,
    marginBottom: 16,
    marginTop: 28,
  },

  // Name cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 28,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
  },
  cardRank: {
    fontFamily: "Lato",
    fontSize: 8,
    fontWeight: 400,
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardRankNumber: {
    letterSpacing: 0,
  },
  cardName: {
    fontFamily: "Playfair Display",
    fontSize: 22,
    fontWeight: 700,
    color: colors.ink,
    marginBottom: 3,
  },
  cardPronunciation: {
    fontFamily: "Noto Sans",
    fontSize: 9,
    fontWeight: 400,
    color: colors.inkFaint,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  cardMeaning: {
    fontFamily: "Lato",
    fontSize: 9.5,
    fontWeight: 400,
    color: colors.terracotta,
    marginBottom: 6,
  },
  cardText: {
    fontFamily: "Lato",
    fontSize: 10,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.6,
  },

  // Combo / pairing box
  comboCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  comboLabel: {
    fontFamily: "Lato",
    fontSize: 7.5,
    fontWeight: 400,
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  comboName: {
    fontFamily: "Playfair Display",
    fontStyle: "italic",
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  comboWhy: {
    fontFamily: "Lato",
    fontSize: 9,
    fontWeight: 300,
    color: colors.inkMuted,
    lineHeight: 1.5,
  },

  // Grid layout
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  // Tradeoffs
  tradeoffCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
  },
  tradeoffNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.rose,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tradeoffNumberText: {
    fontFamily: "Lato",
    fontSize: 9,
    fontWeight: 400,
    color: colors.inkBody,
  },
  tradeoffText: {
    flex: 1,
    fontFamily: "Lato",
    fontSize: 10,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.6,
  },

  // Near misses
  nearMissCard: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  nearMissName: {
    fontFamily: "Playfair Display",
    fontSize: 11,
    fontWeight: 400,
    color: colors.ink,
    marginBottom: 2,
  },
  nearMissReason: {
    fontFamily: "Lato",
    fontSize: 9,
    fontWeight: 300,
    color: colors.inkMuted,
    lineHeight: 1.4,
  },

  // Detail styles for expanded finalist cards
  detailLabel: {
    fontFamily: "Lato",
    fontSize: 8,
    fontWeight: 400,
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 3,
    marginTop: 10,
  },
  detailValue: {
    fontFamily: "Lato",
    fontSize: 9.5,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.5,
  },
  factRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
  },
  factItem: {
    marginRight: 24,
  },
  nicknameBadge: {
    fontFamily: "Lato",
    fontSize: 8.5,
    fontWeight: 400,
    color: colors.ink,
    backgroundColor: colors.cream,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  nicknameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  bulletItem: {
    fontFamily: "Lato",
    fontSize: 9.5,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 8,
  },

  // Full report markdown section
  reportHeading: {
    fontFamily: "Playfair Display",
    fontSize: 16,
    fontWeight: 400,
    color: colors.ink,
    marginBottom: 8,
    marginTop: 18,
  },
  reportBody: {
    fontFamily: "Lato",
    fontSize: 10,
    fontWeight: 300,
    color: colors.inkBody,
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: "center",
  },
  footerText: {
    fontFamily: "Lato",
    fontSize: 8,
    fontWeight: 300,
    color: colors.inkFaint,
    letterSpacing: 0.3,
  },
  pageNumber: {
    fontFamily: "Lato",
    fontSize: 8,
    fontWeight: 300,
    color: colors.inkFaint,
    textAlign: "center",
    marginBottom: 4,
  },
});

interface ReportDocumentProps {
  result: RunResult;
}

// Placeholder texts to filter out
const PLACEHOLDER_TEXTS = [
  "Review the report for tradeoffs.",
  "Read the report for tie-break tips.",
];

function isPlaceholder(text: string): boolean {
  return PLACEHOLDER_TEXTS.some(p => text.toLowerCase().includes(p.toLowerCase()));
}

function filterPlaceholders(items: string[] | undefined): string[] {
  if (!items) return [];
  return items.filter(item => !isPlaceholder(item));
}

// Normalize Unicode whitespace (e.g. U+202F narrow no-break space) to ASCII space.
// Subset PDF fonts lack glyphs for exotic spaces, causing garbled output.
function sanitizeText(text: string): string {
  let t = text.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ');

  // Replace non-breaking hyphens (U+2011) and similar with ASCII hyphen
  // (react-pdf fonts often lack glyphs for U+2011, causing silent character drops)
  t = t.replace(/[\u2011\u2010\uFE63\uFF0D]/g, '-');

  // Fix common missing-hyphen compound words from LLM output
  t = t.replace(/\bshorttomedium\b/gi, 'short-to-medium');
  t = t.replace(/\bmediumlength\b/gi, 'medium-length');
  t = t.replace(/\bcountrygarden\b/gi, 'country-garden');
  t = t.replace(/\bsoftconsonantrich\b/gi, 'soft-consonant-rich');
  t = t.replace(/\bsoftconsonant\b/gi, 'soft-consonant');
  t = t.replace(/\btwosyllable\b/gi, 'two-syllable');
  t = t.replace(/\bthreesyllable\b/gi, 'three-syllable');
  t = t.replace(/\bsinglesyllable\b/gi, 'single-syllable');
  t = t.replace(/\bnatureinspired\b/gi, 'nature-inspired');
  t = t.replace(/\bwellknown\b/gi, 'well-known');
  t = t.replace(/\bnontrendy\b/gi, 'non-trendy');
  t = t.replace(/\bontrend\b/gi, 'on-trend');
  t = t.replace(/\btop(\d+)\b/g, 'top-$1');          // top10 -> top-10
  t = t.replace(/(\d{4})s(\d{4})/g, '$1s\u2013$2');  // 1940s1950s -> 1940s–1950s
  t = t.replace(/(\d+(?:st|nd|rd|th))century/gi, '$1-century'); // 19thcentury -> 19th-century

  // Strip inline IPA notation (e.g. /ˈlɪl.jən/) — Lato lacks IPA glyphs
  t = t.replace(/\/[^/]*[ˈˌɪɛæɑɒʌʊəɔːʃʒθðŋɹɾ][^/]*\//g, '');
  // Clean up any resulting double spaces
  t = t.replace(/  +/g, ' ');

  return t;
}

// Strip markdown formatting for plain text display
function stripMarkdown(text: string): string {
  return sanitizeText(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')       // *italic* -> italic
    .replace(/__([^_]+)__/g, '$1')       // __bold__ -> bold
    .replace(/_([^_]+)_/g, '$1')         // _italic_ -> italic
    .replace(/~~([^~]+)~~/g, '$1')       // ~~strike~~ -> strike
    .replace(/`([^`]+)`/g, '$1')         // `code` -> code
    .replace(/^#+\s*/gm, '')             // # headers -> text
    .replace(/^\s*[-*+]\s+/gm, '• ')     // - list -> bullet
    .replace(/^\s*\d+\.\s+/gm, '')       // numbered list -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [link](url) -> link
    .trim();
}

// Shorthand: sanitize any string for PDF-safe rendering
const s = sanitizeText;

// ---------------------------------------------------------------------------
// IPA-to-phonetic conversion
// ---------------------------------------------------------------------------

// Trigraphs — checked first (before digraphs) for longer matches
const IPA_TRIGRAPHS: [string, string][] = [
  // R-colored long vowels: ɑːɹ → "ar", ɑːr → "ar", ɔːɹ → "or"
  ["\u0251\u02D0\u0279", "ar"], ["\u0251\u02D0r", "ar"],
  ["\u0254\u02D0\u0279", "or"], ["\u0254\u02D0r", "or"],
  ["\u025C\u02D0\u0279", "ur"], ["\u025C\u02D0r", "ur"],
];

const IPA_DIGRAPHS: [string, string][] = [
  // R-colored vowels (short): ɑɹ → "ar", ɑr → "ar"
  ["\u0251\u0279", "ar"], ["\u0251r", "ar"],
  ["\u0254\u0279", "or"], ["\u0254r", "or"],
  // Long vowels
  ["i\u02D0", "ee"], ["u\u02D0", "oo"], ["\u0251\u02D0", "ar"],
  ["\u0254\u02D0", "aw"], ["\u025C\u02D0", "ur"],
  // Diphthongs
  ["a\u026A", "eye"], ["e\u026A", "ay"], ["\u0254\u026A", "oy"],
  ["a\u028A", "ow"], ["o\u028A", "oh"],
  // R-colored vowels
  ["\u026A\u0259", "eer"], ["\u025B\u0259", "air"], ["\u028A\u0259", "oor"],
  // Consonant digraphs
  ["t\u0283", "ch"], ["d\u0292", "j"],
];

const IPA_SINGLES: [string, string][] = [
  // Vowels
  ["\u0259", "uh"], ["\u026A", "ih"], ["\u025B", "eh"],
  ["\u00E6", "a"], ["\u0251", "ah"], ["\u0252", "aw"],
  ["\u028A", "oo"], ["\u028C", "uh"], ["\u0254", "aw"],
  ["\u025C", "ur"], ["\u025D", "ur"],
  // Consonants
  ["\u0283", "sh"], ["\u0292", "zh"], ["\u03B8", "th"],
  ["\u00F0", "th"], ["\u014B", "ng"], ["\u0279", "r"],
  ["\u0261", "g"],  // IPA script-g
  ["\u027E", "r"],  // IPA flap
  ["j", "y"],
];

// IPA vowel characters (used for auto-syllable splitting)
const IPA_VOWELS = new Set([
  "a", "e", "i", "o", "u",
  "\u0259", "\u026A", "\u025B", "\u00E6", "\u0251", "\u0252",
  "\u028A", "\u028C", "\u0254", "\u025C", "\u025D",
]);

function isIpaVowel(ch: string): boolean {
  return IPA_VOWELS.has(ch);
}

function ipaToPhonetic(ipa: string | undefined): string | null {
  if (!ipa) return null;

  // Strip slashes and trim
  let text = ipa.replace(/\//g, "").trim();
  if (!text) return null;

  // If no syllable dots, insert them heuristically.
  // Strategy: split at consonant+vowel boundaries, but keep the onset
  // consonant with the following vowel (insert dot BEFORE the consonant).
  // Skip insertion right after a stress mark (the consonant is onset of
  // the stressed syllable and belongs with it).
  const hasDots = text.includes(".");
  if (!hasDots) {
    let patched = "";
    for (let j = 0; j < text.length; j++) {
      const ch = text[j];
      // Skip stress marks and length marks for analysis
      if (ch === "\u02C8" || ch === "\u02CC" || ch === "\u02D0") {
        patched += ch;
        continue;
      }
      // Check: is this a consonant that starts a new syllable?
      if (j > 0 && !isIpaVowel(ch) && ch !== "\u02C8" && ch !== "\u02CC" && ch !== "\u02D0") {
        // Look ahead: is the next non-mark char a vowel?
        let nextReal = "";
        for (let k = j + 1; k < text.length; k++) {
          const nk = text[k];
          if (nk !== "\u02D0" && nk !== "\u02C8" && nk !== "\u02CC") {
            nextReal = nk;
            break;
          }
        }
        // Look back: was the previous real char a vowel (or diphthong end)?
        let prevReal = "";
        let prevIsStressMark = false;
        for (let k = patched.length - 1; k >= 0; k--) {
          const pk = patched[k];
          if (pk === "\u02C8" || pk === "\u02CC") {
            prevIsStressMark = true;
            break;
          }
          if (pk !== "\u02D0" && pk !== ".") {
            prevReal = pk;
            break;
          }
        }
        // Only insert dot if prev was a vowel AND next is a vowel
        // AND we're not immediately after a stress mark
        if (!prevIsStressMark && prevReal && isIpaVowel(prevReal) && nextReal && isIpaVowel(nextReal)) {
          patched += ".";
        }
      }
      patched += ch;
    }
    text = patched;
  }

  // Build syllables: collect characters into syllable groups,
  // then uppercase stressed syllables entirely.
  const syllables: { chars: string; stressed: boolean }[] = [];
  let current = "";
  let stressed = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    // Primary stress mark — marks next syllable as stressed
    if (ch === "\u02C8") {
      if (current) {
        syllables.push({ chars: current, stressed });
        current = "";
      }
      stressed = true;
      i++;
      continue;
    }

    // Secondary stress — start new syllable
    if (ch === "\u02CC") {
      if (current) {
        syllables.push({ chars: current, stressed });
        current = "";
        stressed = false;
      }
      i++;
      continue;
    }

    // Syllable dot — boundary
    if (ch === ".") {
      if (current) {
        syllables.push({ chars: current, stressed });
        current = "";
        stressed = false;
      }
      i++;
      continue;
    }

    // Length mark — skip
    if (ch === "\u02D0") {
      i++;
      continue;
    }

    // Try trigraph match first (longest match wins)
    let matched = false;
    if (i + 2 < text.length) {
      const triple = text.slice(i, i + 3);
      for (const [from, to] of IPA_TRIGRAPHS) {
        if (triple === from) {
          current += to;
          matched = true;
          i += 3;
          break;
        }
      }
    }

    // Then try digraph match
    if (!matched && i + 1 < text.length) {
      const pair = text.slice(i, i + 2);
      for (const [from, to] of IPA_DIGRAPHS) {
        if (pair === from) {
          current += to;
          matched = true;
          i += 2;
          break;
        }
      }
    }

    if (!matched) {
      let singleMatched = false;
      for (const [from, to] of IPA_SINGLES) {
        if (ch === from) {
          current += to;
          singleMatched = true;
          i++;
          break;
        }
      }

      if (!singleMatched) {
        if (/[a-zA-Z]/.test(ch)) {
          current += ch.toLowerCase();
        }
        i++;
      }
    }
  }

  // Push final syllable
  if (current) {
    syllables.push({ chars: current, stressed });
  }

  if (syllables.length === 0) return null;

  // Join syllables with hyphens, uppercase stressed ones
  const result = syllables
    .map(syl => syl.stressed ? syl.chars.toUpperCase() : syl.chars)
    .join("-");

  return result || null;
}

// ---------------------------------------------------------------------------
// Render helpers for expanded finalist cards
// ---------------------------------------------------------------------------

function NicknameSection({ label, names }: { label: string; names?: string[] }) {
  if (!names || names.length === 0) return null;
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{ fontFamily: "Lato", fontSize: 8, fontWeight: 400, color: colors.inkMuted, marginBottom: 2 }}>
        {label}
      </Text>
      <View style={styles.nicknameRow}>
        {names.map((n) => (
          <Text key={n} style={styles.nicknameBadge}>{n}</Text>
        ))}
      </View>
    </View>
  );
}

// Theme-to-color mapping for visual badges
const themeColors: Record<string, { bg: string; text: string }> = {
  classic: { bg: "#E8EDE7", text: "#4A6741" },    // sage
  nature: { bg: "#F0D0D4", text: "#8B4A53" },      // rose
  literary: { bg: "#F5E6D8", text: "#8B5E3C" },    // warm terracotta
  heritage: { bg: "#E0DDD7", text: "#5A5545" },    // warm stone
  contemporary: { bg: "#DDE5EE", text: "#3E5470" }, // soft blue
  distinctive: { bg: "#E8DDE8", text: "#5E4060" },  // lavender
};

function getThemeColor(theme?: string): { bg: string; text: string } {
  if (!theme) return { bg: colors.cream, text: colors.inkMuted };
  const key = theme.toLowerCase().replace(/[^a-z]/g, "");
  for (const [k, v] of Object.entries(themeColors)) {
    if (key.includes(k)) return v;
  }
  return { bg: colors.cream, text: colors.inkMuted };
}

export function ReportDocument({ result }: ReportDocumentProps) {
  const surname = result.profile.family?.surname || "Family";

  // Create a map of name cards
  const nameCardMap = new Map(
    result.candidates.map((card) => [card.name.toLowerCase(), card])
  );

  // Get unique combos
  const allCombos: { first: string; middle: string; why: string }[] = [];
  const seenCombos = new Set<string>();

  if (result.report.combos) {
    result.report.combos.forEach((combo) => {
      const key = `${combo.first}-${combo.middle}`;
      if (!seenCombos.has(key)) {
        seenCombos.add(key);
        allCombos.push(combo);
      }
    });
  }

  result.report.finalists.forEach((finalist) => {
    if (finalist.combo) {
      const key = `${finalist.combo.first}-${finalist.combo.middle}`;
      if (!seenCombos.has(key)) {
        seenCombos.add(key);
        allCombos.push(finalist.combo);
      }
    }
  });

  // Filter out placeholder content
  const tradeoffs = filterPlaceholders(result.report.tradeoffs);
  const tieBreakTips = filterPlaceholders(result.report.tie_break_tips);

  // Clean the summary
  const cleanSummary = stripMarkdown(result.report.summary || "");

  // Get top-3 finalist names for cover page preview
  const top3Names = result.report.finalists.slice(0, 3).map(f => f.name);

  // Build a date string for the consultation
  const consultationDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      {/* ---- Cover Page ---- */}
      <Page size="LETTER" style={[styles.page, { justifyContent: "center", paddingBottom: 72 }]}>
        {/* Top accent bar */}
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: colors.terracotta,
        }} />

        <View style={{ alignItems: "center" }}>
          {/* Brand */}
          <Text style={[styles.logo, { marginBottom: 24 }]}>namazing</Text>

          {/* Decorative accent line */}
          <View style={{
            width: 40,
            height: 1.5,
            backgroundColor: colors.terracotta,
            marginBottom: 28,
          }} />

          {/* Family name */}
          <Text style={[styles.title, { fontSize: 42, marginBottom: 8 }]}>
            The {surname} Family
          </Text>
          <Text style={[styles.subtitle, { marginBottom: 40 }]}>
            Your personalized name consultation
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { marginHorizontal: 120, marginBottom: 36 }]} />

          {/* Summary paragraph */}
          <Text style={[styles.summary, { marginBottom: 44, paddingHorizontal: 32 }]}>{cleanSummary}</Text>

          {/* What's Inside preview */}
          <View style={{
            backgroundColor: colors.white,
            borderRadius: 14,
            padding: 28,
            paddingHorizontal: 48,
            alignItems: "center",
            width: "80%",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.06,
            shadowRadius: 20,
          }}>
            <Text style={{
              fontFamily: "Lato",
              fontSize: 7.5,
              fontWeight: 400,
              color: colors.inkFaint,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
            }}>
              Inside Your Report
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              {top3Names.map((name, i) => (
                <View key={name} style={{ flexDirection: "row", alignItems: "center" }}>
                  {i > 0 && (
                    <Text style={{ fontFamily: "Lato", fontSize: 10, color: colors.inkFaint, marginHorizontal: 10 }}>
                      {"\u00B7"}
                    </Text>
                  )}
                  <Text style={{
                    fontFamily: "Playfair Display",
                    fontSize: 16,
                    fontWeight: 700,
                    color: colors.ink,
                  }}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{
              fontFamily: "Lato",
              fontSize: 9,
              fontWeight: 300,
              color: colors.inkMuted,
            }}>
              {result.report.finalists.length} curated names with full research, pairings, and expert notes
            </Text>
          </View>

          {/* Date */}
          <Text style={{
            fontFamily: "Lato",
            fontSize: 8,
            fontWeight: 300,
            color: colors.inkFaint,
            marginTop: 36,
          }}>
            Prepared on {consultationDate}
          </Text>
        </View>

        <Footer />
      </Page>

      {/* ---- Finalist Cards (flowing, not one-per-page) ---- */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Our Top Picks</Text>

        {result.report.finalists.map((finalist, index) => {
          const nameCard = nameCardMap.get(finalist.name.toLowerCase());
          const pronunciation = nameCard?.ipa || null;
          const bestCombo = finalist.combo || nameCard?.combo_suggestions?.[0];
          const theme = nameCard?.theme;
          const themeColor = getThemeColor(theme);

          const isHero = index === 0;

          return (
            <View key={finalist.name} style={[
              styles.card,
              isHero && {
                backgroundColor: "#FDF6F0",
                borderWidth: 1.5,
                borderColor: colors.terracotta,
                padding: 32,
                marginBottom: 18,
              },
            ]}>
              {/* Card header — kept together with "Why This Name" via minPresenceAhead
                  so the header never appears orphaned at the bottom of a page */}
              <View minPresenceAhead={120}>
                {/* Rank row with theme badge */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={[
                    styles.cardRank,
                    isHero && { color: colors.terracotta, fontSize: 9, fontWeight: 700 },
                  ]}>
                    {isHero ? "Our Top Recommendation" : `# ${index + 1}`}
                  </Text>
                  {theme && (
                    <View style={{
                      backgroundColor: themeColor.bg,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}>
                      <Text style={{
                        fontFamily: "Lato",
                        fontSize: 7,
                        fontWeight: 700,
                        color: themeColor.text,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}>
                        {theme}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[
                  styles.cardName,
                  isHero && { fontSize: 28, marginBottom: 4 },
                ]}>
                  {finalist.name}
                </Text>
                {pronunciation && (
                  <Text style={styles.cardPronunciation}>{pronunciation}</Text>
                )}

                {/* Meaning on its own line */}
                {nameCard?.meaning && (
                  <Text style={styles.cardMeaning}>{s(nameCard.meaning)}</Text>
                )}

                {/* Origins + Syllables side by side */}
                <View style={styles.factRow}>
                  {nameCard?.origins && nameCard.origins.length > 0 && (
                    <View style={styles.factItem}>
                      <Text style={styles.detailLabel}>Origins</Text>
                      <Text style={styles.detailValue}>{nameCard.origins.join(", ")}</Text>
                    </View>
                  )}
                  {nameCard?.syllables != null && (
                    <View style={styles.factItem}>
                      <Text style={styles.detailLabel}>Syllables</Text>
                      <Text style={styles.detailValue}>{String(nameCard.syllables)}</Text>
                    </View>
                  )}
                </View>

                {/* Why chosen */}
                <Text style={styles.detailLabel}>Why This Name</Text>
                <Text style={styles.cardText}>{s(finalist.why)}</Text>
              </View>

              {/* Nicknames */}
              {nameCard?.nicknames && (
                (nameCard.nicknames.intended?.length ?? 0) > 0 ||
                (nameCard.nicknames.likely?.length ?? 0) > 0 ||
                (nameCard.nicknames.avoid?.length ?? 0) > 0
              ) && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Nicknames</Text>
                  <NicknameSection label="Intended" names={nameCard.nicknames.intended} />
                  <NicknameSection label="Likely" names={nameCard.nicknames.likely} />
                  <NicknameSection label="Avoid" names={nameCard.nicknames.avoid} />
                </View>
              )}

              {/* Surname fit */}
              {nameCard?.surname_fit?.notes && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Surname Fit</Text>
                  <Text style={styles.detailValue}>{s(nameCard.surname_fit.notes)}</Text>
                </View>
              )}

              {/* Sibling fit */}
              {nameCard?.sibset_fit?.notes && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Sibling Fit</Text>
                  <Text style={styles.detailValue}>{s(nameCard.sibset_fit.notes)}</Text>
                </View>
              )}

              {/* Popularity */}
              {nameCard?.popularity?.trend_notes && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Popularity</Text>
                  <Text style={styles.detailValue}>{s(nameCard.popularity.trend_notes)}</Text>
                </View>
              )}

              {/* Notable bearers */}
              {nameCard?.notable_bearers?.positive && nameCard.notable_bearers.positive.length > 0 && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Notable Bearers</Text>
                  {nameCard.notable_bearers.positive.map((bearer, bi) => (
                    <Text key={bi} style={styles.bulletItem}>{"  \u2022  "}{s(bearer)}</Text>
                  ))}
                </View>
              )}

              {/* Cultural notes */}
              {nameCard?.cultural_notes && nameCard.cultural_notes.length > 0 && (
                <View wrap={false}>
                  <Text style={styles.detailLabel}>Cultural Notes</Text>
                  {nameCard.cultural_notes.map((note, ni) => (
                    <Text key={ni} style={styles.bulletItem}>{"  \u2022  "}{s(note)}</Text>
                  ))}
                </View>
              )}

              {/* Brief combo mention — full pairings on dedicated page */}
              {bestCombo && (
                <View wrap={false} style={[
                  styles.comboCard,
                  isHero && { backgroundColor: colors.white, borderColor: colors.rose },
                ]}>
                  <Text style={styles.comboLabel}>Suggested Pairing</Text>
                  <Text style={{
                    fontFamily: "Playfair Display",
                    fontStyle: "italic",
                    fontSize: isHero ? 16 : 12,
                    color: colors.ink,
                    marginBottom: 2,
                  }}>
                    {bestCombo.first} {bestCombo.middle}
                  </Text>
                  <Text style={styles.comboWhy}>{s(bestCombo.why)}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Footer />
      </Page>

      {/* ---- Pairings, Considerations, Tie-breaks & Honorable Mentions ---- */}
      {/* Combined into a single flowing page so react-pdf auto-paginates without blank gaps */}
      {(allCombos.length > 0 || tradeoffs.length > 0 || tieBreakTips.length > 0 ||
        (result.selection.near_misses && result.selection.near_misses.length > 0)) && (
        <Page size="LETTER" style={styles.page}>
          {allCombos.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>First & Middle Name Pairings</Text>
              <View style={styles.grid}>
                {allCombos.map((combo) => (
                  <View key={`${combo.first}-${combo.middle}`} style={styles.gridItem}>
                    <View style={[styles.card, { padding: 18 }]} wrap={false}>
                      <Text style={styles.comboLabel}>Pairing</Text>
                      <Text style={styles.comboName}>
                        {combo.first} {combo.middle}
                      </Text>
                      <Text style={styles.comboWhy}>{s(combo.why)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tradeoffs.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, allCombos.length > 0 ? { marginTop: 24 } : {}]}>Things to Consider</Text>
              {tradeoffs.map((tradeoff, index) => (
                <View key={index} style={styles.tradeoffCard} wrap={false}>
                  <View style={styles.tradeoffNumber}>
                    <Text style={styles.tradeoffNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tradeoffText}>{s(tradeoff)}</Text>
                </View>
              ))}
            </View>
          )}

          {tieBreakTips.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>If You{"'"}re Stuck</Text>
              <View style={styles.grid}>
                {tieBreakTips.map((tip, index) => (
                  <View key={index} style={styles.gridItem}>
                    <View style={[styles.card, { padding: 18 }]} wrap={false}>
                      <Text style={styles.cardText}>{s(tip)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {result.selection.near_misses && result.selection.near_misses.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Honorable Mentions</Text>
              <View style={styles.grid}>
                {result.selection.near_misses.map((miss) => (
                  <View key={miss.name} style={styles.gridItem}>
                    <View style={styles.nearMissCard}>
                      <Text style={styles.nearMissName}>{miss.name}</Text>
                      <Text style={styles.nearMissReason}>{s(miss.reason)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Footer />
        </Page>
      )}

      {/* ---- Closing Page ---- */}
      <Page size="LETTER" style={[styles.page, { justifyContent: "center" }]}>
        {/* Top accent bar */}
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: colors.terracotta,
        }} />

        <View style={{ alignItems: "center" }}>
          <View style={{
            width: 40,
            height: 1.5,
            backgroundColor: colors.rose,
            marginBottom: 24,
          }} />
          <Text style={{
            fontFamily: "Playfair Display",
            fontSize: 26,
            fontWeight: 400,
            color: colors.ink,
            textAlign: "center",
            marginBottom: 12,
          }}>
            Wishing you joy on this journey
          </Text>
          <Text style={{
            fontFamily: "Lato",
            fontSize: 10.5,
            fontWeight: 300,
            color: colors.inkMuted,
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 340,
            marginBottom: 28,
          }}>
            We hope these names spark the conversations and daydreams that lead to the perfect choice for your family.
          </Text>
          <View style={{
            width: 40,
            height: 1.5,
            backgroundColor: colors.rose,
            marginBottom: 20,
          }} />
          <Text style={{
            fontFamily: "Lato",
            fontSize: 9,
            fontWeight: 400,
            color: colors.inkMuted,
            letterSpacing: 0.5,
          }}>
            With warmth,
          </Text>
          <Text style={{
            fontFamily: "Playfair Display",
            fontStyle: "italic",
            fontSize: 14,
            color: colors.ink,
            marginTop: 4,
          }}>
            The Namazing Team
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} of ${totalPages}`
        }
      />
      <Text style={styles.footerText}>
        Crafted with care by namazing
      </Text>
    </View>
  );
}
