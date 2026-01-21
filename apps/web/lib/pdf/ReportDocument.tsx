import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { RunResult } from "@/lib/types";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 600,
    },
  ],
});

Font.register({
  family: "DM Serif Display",
  src: "https://fonts.gstatic.com/s/dmserifDisplay/v15/-nFnOHM81r4j6k0gjAW3mujVU2B2K_d709jy92k.woff2",
});

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
    fontFamily: "Inter",
    fontSize: 11,
    color: colors.ink,
  },
  header: {
    marginBottom: 32,
    textAlign: "center",
  },
  logo: {
    fontFamily: "DM Serif Display",
    fontSize: 24,
    color: colors.inkLight,
    marginBottom: 8,
  },
  title: {
    fontFamily: "DM Serif Display",
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
    fontFamily: "DM Serif Display",
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
    fontFamily: "DM Serif Display",
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
    fontFamily: "DM Serif Display",
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

  return (
    <Document>
      {/* Page 1: Cover and Finalists */}
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>namazing</Text>
          <Text style={styles.subtitle}>Your personalized name consultation</Text>
          <Text style={styles.title}>The {surname} Family</Text>
        </View>

        {/* Summary */}
        <Text style={styles.summary}>{result.report.summary}</Text>

        {/* Finalists */}
        <Text style={styles.sectionTitle}>Our Top Picks</Text>
        {result.report.finalists.map((finalist) => {
          const nameCard = nameCardMap.get(finalist.name.toLowerCase());
          return (
            <View key={finalist.name} style={styles.card}>
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

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 2: Combos and Considerations */}
      <Page size="LETTER" style={styles.page}>
        {/* Perfect Pairings */}
        {allCombos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Perfect Pairings</Text>
            <View style={styles.grid}>
              {allCombos.slice(0, 6).map((combo) => (
                <View key={`${combo.first}-${combo.middle}`} style={styles.gridItem}>
                  <View style={[styles.card, { backgroundColor: colors.cream }]}>
                    <Text style={styles.comboName}>
                      {combo.first} {combo.middle}
                    </Text>
                    <Text style={styles.comboWhy}>{combo.why}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Considerations */}
        {result.report.tradeoffs && result.report.tradeoffs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Things to Consider</Text>
            {result.report.tradeoffs.map((tradeoff, index) => (
              <View key={index} style={styles.tradeoffCard}>
                <View style={styles.tradeoffNumber}>
                  <Text style={styles.tradeoffNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tradeoffText}>{tradeoff}</Text>
              </View>
            ))}
          </>
        )}

        {/* Tie-break tips */}
        {result.report.tie_break_tips && result.report.tie_break_tips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>If You&apos;re Stuck</Text>
            <View style={styles.grid}>
              {result.report.tie_break_tips.map((tip, index) => (
                <View key={index} style={styles.gridItem}>
                  <View style={[styles.card, { backgroundColor: colors.cream }]}>
                    <Text style={styles.cardText}>{tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Near Misses */}
        {result.selection.near_misses && result.selection.near_misses.length > 0 && (
          <>
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
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
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
