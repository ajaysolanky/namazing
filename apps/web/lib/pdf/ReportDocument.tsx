import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { RunResult } from "@/lib/types";

// Use Hyphenation callback to disable it (can cause issues)
Font.registerHyphenationCallback((word) => [word]);

// Note: Using built-in Helvetica font family for compatibility
// Custom fonts can be added later with proper TTF files

// Design tokens
const colors = {
  sand: "#f5efe6",
  ink: "#1f2933",
  rose: "#f8d4d8",
  sage: "#d7e3d4",
  cream: "#faf8f5",
  inkLight: "#1f293399",
  inkLighter: "#1f293366",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.sand,
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: colors.ink,
  },
  header: {
    marginBottom: 32,
    textAlign: "center",
  },
  logo: {
    fontFamily: "Times-Roman",
    fontSize: 24,
    color: colors.inkLight,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 32,
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: colors.inkLight,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summary: {
    fontSize: 12,
    color: colors.inkLight,
    lineHeight: 1.6,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: "Times-Roman",
    fontSize: 20,
    color: colors.ink,
    marginBottom: 16,
    marginTop: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardName: {
    fontFamily: "Times-Roman",
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  cardIpa: {
    fontSize: 10,
    color: colors.inkLighter,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 10,
    color: colors.inkLight,
    lineHeight: 1.5,
  },
  comboCard: {
    backgroundColor: colors.cream,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  comboName: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: colors.ink,
    marginBottom: 4,
  },
  comboWhy: {
    fontSize: 9,
    color: colors.inkLight,
  },
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
  tradeoffCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
  },
  tradeoffNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.rose,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tradeoffNumberText: {
    fontSize: 9,
    color: colors.inkLight,
  },
  tradeoffText: {
    flex: 1,
    fontSize: 10,
    color: colors.inkLight,
    lineHeight: 1.5,
  },
  nearMissCard: {
    backgroundColor: colors.sand,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  nearMissName: {
    fontWeight: 600,
    fontSize: 10,
    color: colors.ink,
    marginBottom: 2,
  },
  nearMissReason: {
    fontSize: 9,
    color: colors.inkLighter,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: colors.inkLighter,
  },
  pageNumber: {
    fontSize: 9,
    color: colors.inkLighter,
    textAlign: "center",
    marginTop: 8,
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
      {/* Single flowing page - react-pdf will create page breaks automatically */}
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>namazing</Text>
          <Text style={styles.subtitle}>Your personalized name consultation</Text>
          <Text style={styles.title}>The {surname} Family</Text>
        </View>

        {/* Summary */}
        <Text style={styles.summary}>{cleanSummary}</Text>

        {/* Finalists */}
        <Text style={styles.sectionTitle}>Our Top Picks</Text>
        {result.report.finalists.map((finalist) => {
          const nameCard = nameCardMap.get(finalist.name.toLowerCase());
          return (
            <View key={finalist.name} style={styles.card} wrap={false}>
              <Text style={styles.cardName}>{finalist.name}</Text>
              {nameCard?.ipa && (
                <Text style={styles.cardIpa}>{nameCard.ipa}</Text>
              )}
              <Text style={styles.cardText}>{finalist.why}</Text>
              {nameCard?.meaning && (
                <Text style={[styles.cardText, { marginTop: 4 }]}>
                  Meaning: {nameCard.meaning}
                </Text>
              )}
              {finalist.combo && (
                <View style={styles.comboCard}>
                  <Text style={styles.comboName}>
                    {finalist.combo.first} {finalist.combo.middle}
                  </Text>
                  <Text style={styles.comboWhy}>{finalist.combo.why}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Perfect Pairings - force page break before this section */}
        {allCombos.length > 0 && (
          <View break>
            <Text style={styles.sectionTitle}>First & Middle Name Pairings</Text>
            <View style={styles.grid}>
              {allCombos.slice(0, 6).map((combo) => (
                <View key={`${combo.first}-${combo.middle}`} style={styles.gridItem}>
                  <View style={[styles.card, { backgroundColor: colors.cream }]} wrap={false}>
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
                  <View style={[styles.card, { backgroundColor: colors.cream }]}>
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
            Generated by namazing - Finding the perfect name for your little one
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
