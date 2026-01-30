import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { RunResult } from "@/lib/types";

// Disable hyphenation (can cause layout issues)
Font.registerHyphenationCallback((word) => [word]);

// Register Playfair Display for headings (serif, premium feel)
Font.register({
  family: "Playfair Display",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd6u3DXbtM.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F2rA0s.ttf",
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
      src: "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjxAwXjeu.ttf",
      fontWeight: 300,
    },
    {
      src: "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwaPGR_p.ttf",
      fontWeight: 700,
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
    padding: 48,
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
  cardName: {
    fontFamily: "Playfair Display",
    fontSize: 22,
    fontWeight: 700,
    color: colors.ink,
    marginBottom: 3,
  },
  cardPronunciation: {
    fontFamily: "Lato",
    fontSize: 9,
    fontWeight: 300,
    color: colors.inkFaint,
    letterSpacing: 0.5,
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
    marginTop: 12,
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
    marginTop: 6,
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

// Strip markdown formatting for plain text display
function stripMarkdown(text: string): string {
  return text
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

// Convert IPA to simple phonetic spelling for font safety
function simplifyPronunciation(name: string, ipa: string | undefined): string | null {
  if (!ipa) return null;
  // If IPA contains characters outside basic Latin + common punctuation,
  // generate a simple phonetic spelling from the name instead
  const hasExoticChars = /[^\x20-\x7E]/.test(ipa);
  if (hasExoticChars) {
    // Build a simple pronunciation guide from the name
    return name.toUpperCase().split('').join('-').replace(/--+/g, '-');
  }
  return ipa;
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

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>namazing</Text>
          <Text style={styles.title}>The {surname} Family</Text>
          <Text style={styles.subtitle}>Your personalized name consultation</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Summary */}
        <Text style={styles.summary}>{cleanSummary}</Text>

        {/* Finalists */}
        <Text style={styles.sectionTitle}>Our Top Picks</Text>
        {result.report.finalists.map((finalist, index) => {
          const nameCard = nameCardMap.get(finalist.name.toLowerCase());
          const pronunciation = simplifyPronunciation(finalist.name, nameCard?.ipa);
          return (
            <View key={finalist.name} style={styles.card} wrap={false}>
              <Text style={styles.cardRank}>
                {index === 0 ? "Top Recommendation" : `#${index + 1}`}
              </Text>
              <Text style={styles.cardName}>{finalist.name}</Text>
              {pronunciation && (
                <Text style={styles.cardPronunciation}>{pronunciation}</Text>
              )}
              {nameCard?.meaning && (
                <Text style={styles.cardMeaning}>
                  Meaning: {nameCard.meaning}
                </Text>
              )}
              <Text style={styles.cardText}>{finalist.why}</Text>
              {finalist.combo && (
                <View style={styles.comboCard}>
                  <Text style={styles.comboLabel}>Suggested pairing</Text>
                  <Text style={styles.comboName}>
                    {finalist.combo.first} {finalist.combo.middle}
                  </Text>
                  <Text style={styles.comboWhy}>{finalist.combo.why}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Perfect Pairings */}
        {allCombos.length > 0 && (
          <View break>
            <Text style={styles.sectionTitle}>First & Middle Name Pairings</Text>
            <View style={styles.grid}>
              {allCombos.slice(0, 6).map((combo) => (
                <View key={`${combo.first}-${combo.middle}`} style={styles.gridItem}>
                  <View style={[styles.card, { padding: 18 }]} wrap={false}>
                    <Text style={styles.comboLabel}>Pairing</Text>
                    <Text style={styles.comboName}>
                      {combo.first} {combo.middle}
                    </Text>
                    <Text style={styles.comboWhy}>{combo.why}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Considerations */}
        {tradeoffs.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Things to Consider</Text>
            {tradeoffs.map((tradeoff, index) => (
              <View key={index} style={styles.tradeoffCard}>
                <View style={styles.tradeoffNumber}>
                  <Text style={styles.tradeoffNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tradeoffText}>{tradeoff}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tie-break tips */}
        {tieBreakTips.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>If You{"'"}re Stuck</Text>
            <View style={styles.grid}>
              {tieBreakTips.map((tip, index) => (
                <View key={index} style={styles.gridItem}>
                  <View style={[styles.card, { padding: 18 }]}>
                    <Text style={styles.cardText}>{tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Near Misses */}
        {result.selection.near_misses && result.selection.near_misses.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Honorable Mentions</Text>
            <View style={styles.grid}>
              {result.selection.near_misses.map((miss) => (
                <View key={miss.name} style={styles.gridItem}>
                  <View style={styles.nearMissCard}>
                    <Text style={styles.nearMissName}>{miss.name}</Text>
                    <Text style={styles.nearMissReason}>{miss.reason}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Crafted with care by namazing
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
