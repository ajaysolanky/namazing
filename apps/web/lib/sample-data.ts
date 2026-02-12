import type { RunResult } from "@/lib/types";

export const SAMPLE_REPORTS: Record<string, RunResult> = {
  amara: {
    profile: {
      raw_brief:
        "We're looking for a name with deep cultural roots and a graceful sound for our baby girl. We love names that carry meaning across multiple traditions. Our surname is Okafor and we have a son named Ezra. We'd like something that works in both Nigerian and American contexts.",
      gender: "girl",
      family: {
        surname: "Okafor",
        middle_names: { girl: "Chidinma" },
        siblings: ["Ezra"],
        honor_names: ["Chidinma"],
      },
      preferences: {
        naming_themes: ["Cross-Cultural", "Graceful & Meaningful"],
        nickname_tolerance: "medium",
        length_pref: "short-to-medium",
        cultural_bounds: ["Igbo", "Sanskrit", "Pan-African"],
      },
      names_considering: ["Amara", "Adaeze", "Nia"],
      themes: ["Cross-Cultural", "Graceful & Meaningful"],
      vetoes: {
        hard: ["Blessing", "Precious"],
        soft: ["Ada"],
      },
      region: ["United States", "Nigeria"],
      target_popularity_band: "top 100-500",
      comments:
        "We want a name that carries weight in Igbo tradition but also feels at home in the U.S. It should pair well with Ezra.",
    },
    candidates: [
      {
        name: "Amara",
        theme: "Cross-Cultural",
        ipa: "/əˈmɑː.ɹə/",
        syllables: 3,
        meaning: "Grace, mercy (Igbo); immortal, eternal (Sanskrit)",
        origins: ["Igbo", "Sanskrit", "Arabic"],
        variants: ["Amarachi", "Amari"],
        nicknames: {
          intended: ["Mara", "Ami"],
          likely: ["Ama"],
          avoid: [],
        },
        popularity: {
          latest_rank: 182,
          trend_notes:
            "Steadily rising in the U.S. since 2010. Well-known across African, South Asian, and Latin American communities. A true global name.",
        },
        notable_bearers: {
          positive: [
            "Amara La Negra, Afro-Latina singer and activist",
            "Amara Karan, British actress of Sri Lankan heritage",
          ],
          fictional: ["Amara in Marvel's The Eternals"],
        },
        cultural_notes: [
          "In Igbo, Amara means 'grace' or 'mercy' and is often part of longer names like Amarachi ('God's grace')",
          "In Sanskrit, it means 'immortal' or 'eternal,' connecting to Hindu philosophical traditions",
          "The name resonates across Africa, South Asia, and the Americas, making it genuinely cross-cultural",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Amara Okafor is melodic and rooted. The three-syllable first name mirrors the three-syllable surname, creating a balanced, harmonious rhythm.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Amara share a warm, open vowel quality. Both are cross-cultural names that feel modern and timeless simultaneously.",
        },
        combo_suggestions: [
          {
            first: "Amara",
            middle: "Chidinma",
            why: "Amara Chidinma Okafor honors the family beautifully. 'Grace' and 'God is good' together create a powerful Igbo blessing.",
          },
          {
            first: "Amara",
            middle: "Joy",
            why: "Amara Joy Okafor is bright and uplifting, with a concise middle name that balances the flowing first name.",
          },
        ],
      },
      {
        name: "Adaeze",
        theme: "Graceful & Meaningful",
        ipa: "/ˌɑː.dɑːˈeɪ.zeɪ/",
        syllables: 4,
        meaning: "First daughter of the king; princess",
        origins: ["Igbo"],
        variants: ["Ada", "Adaora"],
        nicknames: {
          intended: ["Ada", "Eze"],
          likely: ["Dede"],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Not ranked in the U.S. top 1000 but well-known in Nigerian communities. A distinctive choice that carries royal weight.",
        },
        notable_bearers: {
          positive: [
            "Adaeze Igwe, Miss Nigeria and philanthropist",
          ],
          fictional: [],
        },
        cultural_notes: [
          "A deeply respected Igbo name that conveys royalty and the importance of firstborn daughters",
          "May require pronunciation help in non-Nigerian contexts",
          "The nickname Ada is widely accessible and beautiful on its own",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Adaeze Okafor is proudly Igbo and rhythmically strong. A name that announces its heritage with confidence.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Adaeze both carry cultural gravitas. The Hebrew-Igbo pairing reflects the family's multicultural identity.",
        },
        combo_suggestions: [
          {
            first: "Adaeze",
            middle: "Chidinma",
            why: "Adaeze Chidinma Okafor is a full Igbo name of great beauty and meaning.",
          },
        ],
      },
      {
        name: "Nia",
        theme: "Graceful & Meaningful",
        ipa: "/ˈniː.ə/",
        syllables: 2,
        meaning: "Purpose (Swahili); brightness, radiance (Welsh)",
        origins: ["Swahili", "Welsh"],
        variants: ["Niah", "Nya"],
        nicknames: {
          intended: [],
          likely: [],
          avoid: [],
        },
        popularity: {
          latest_rank: 352,
          trend_notes:
            "A steady presence in the 300-400 range. Popular in the African American community since the rise of Kwanzaa, where Nia is the fifth principle.",
        },
        notable_bearers: {
          positive: [
            "Nia Long, actress",
            "Nia Ali, Olympic hurdler",
          ],
          fictional: [],
        },
        cultural_notes: [
          "One of the seven principles of Kwanzaa, representing purpose",
          "Also a Welsh name meaning brightness, giving it dual cultural resonance",
          "Short and universally easy to pronounce",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Nia Okafor is crisp and elegant. The short first name provides a clean contrast to the three-syllable surname.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Nia are both short, punchy, and cross-cultural. A modern, efficient pairing.",
        },
        combo_suggestions: [
          {
            first: "Nia",
            middle: "Chidinma",
            why: "Nia Chidinma Okafor pairs a concise first name with a rich, meaningful middle.",
          },
        ],
      },
      {
        name: "Zuri",
        theme: "Graceful & Meaningful",
        ipa: "/ˈzʊ.ɹi/",
        syllables: 2,
        meaning: "Beautiful, good (Swahili)",
        origins: ["Swahili"],
        variants: ["Zuria"],
        nicknames: {
          intended: ["Zu"],
          likely: ["Zuri-bird"],
          avoid: [],
        },
        popularity: {
          latest_rank: 198,
          trend_notes:
            "Rising steadily, especially since Black Panther featured a character named Shuri. Part of a broader trend toward East African names in the U.S.",
        },
        notable_bearers: {
          positive: [
            "Zuri Hall, TV host and entertainment journalist",
          ],
          fictional: ["Zuri Ross in the Disney Channel series Jessie"],
        },
        cultural_notes: [
          "A Swahili name that is warm and immediately appealing across cultures",
          "The Z-start gives it a contemporary, energetic feel",
          "Simple to spell and pronounce in any context",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Zuri Okafor has a vibrant, joyful sound. The two-syllable rhythm bounces nicely into the three-syllable surname.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Zuri share a Z sound that creates a playful echo without being matchy. Both feel fresh and modern.",
        },
        combo_suggestions: [
          {
            first: "Zuri",
            middle: "Chidinma",
            why: "Zuri Chidinma Okafor layers Swahili beauty with Igbo blessing.",
          },
        ],
      },
      {
        name: "Chioma",
        theme: "Graceful & Meaningful",
        ipa: "/tʃiˈoʊ.mə/",
        syllables: 3,
        meaning: "Good God; God is good (Igbo)",
        origins: ["Igbo"],
        variants: ["Chidinma", "Chi"],
        nicknames: {
          intended: ["Chi"],
          likely: ["Oma"],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Not ranked in the U.S. top 1000 but extremely popular in Nigeria. Gaining visibility through the Nigerian diaspora.",
        },
        notable_bearers: {
          positive: [
            "Chioma Ajunwa, Nigerian Olympic gold medalist",
          ],
          fictional: [],
        },
        cultural_notes: [
          "A deeply spiritual Igbo name that expresses gratitude to God -- a cornerstone of Igbo naming philosophy",
          "The 'Chi' prefix refers to one's personal god or life force in Igbo cosmology",
          "Widely used across southeastern Nigeria and immediately signals Igbo heritage",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Chioma Okafor is a harmonious all-Igbo name. The three syllables of each create a balanced, flowing rhythm.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Chioma pair a Hebrew classic with a proudly Igbo name, reflecting the family's multicultural roots.",
        },
        combo_suggestions: [
          {
            first: "Chioma",
            middle: "Grace",
            why: "Chioma Grace Okafor bridges Igbo spirituality with an English virtue name, creating a name that translates its own meaning.",
          },
        ],
      },
      {
        name: "Ayana",
        theme: "Cross-Cultural",
        ipa: "/aɪˈɑː.nə/",
        syllables: 3,
        meaning: "Beautiful flower (Amharic); eternal blossom (Japanese reading)",
        origins: ["Amharic", "Japanese", "Arabic"],
        variants: ["Ayanna", "Ayan"],
        nicknames: {
          intended: ["Aya"],
          likely: ["Ana"],
          avoid: [],
        },
        popularity: {
          latest_rank: 487,
          trend_notes:
            "Gently rising in the U.S. Known across Ethiopian, Japanese, and Arabic-speaking communities. A quiet global name.",
        },
        notable_bearers: {
          positive: [
            "Ayana Elizabeth Johnson, marine biologist and climate policy expert",
          ],
          fictional: [],
        },
        cultural_notes: [
          "In Amharic (Ethiopian), Ayana means 'beautiful flower' -- one of Ethiopia's most beloved girls' names",
          "Can also be read as a Japanese name (彩菜), giving it genuine East Asian resonance",
          "The nickname Aya is used independently across Arabic, Japanese, and West African cultures",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Ayana Okafor is warm and melodic. The three-syllable rhythm matches beautifully, and the open vowels create a flowing sound.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Ayana share an open, vowel-rich quality. Both feel globally minded and culturally grounded.",
        },
        combo_suggestions: [
          {
            first: "Ayana",
            middle: "Chidinma",
            why: "Ayana Chidinma Okafor layers Ethiopian beauty with Igbo blessing -- a pan-African celebration.",
          },
        ],
      },
      {
        name: "Ife",
        theme: "Graceful & Meaningful",
        ipa: "/ˈiː.feɪ/",
        syllables: 2,
        meaning: "Love (Yoruba)",
        origins: ["Yoruba"],
        variants: ["Ifeoma", "Ifeanyi"],
        nicknames: {
          intended: [],
          likely: [],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Rare in the U.S. but immediately recognized in Nigerian communities. The ancient city of Ife (Ile-Ife) is considered the cradle of Yoruba civilization.",
        },
        notable_bearers: {
          positive: [
            "Ife is the name of the ancient Yoruba holy city, Ile-Ife, the spiritual heartland of the Yoruba people",
          ],
          fictional: [],
        },
        cultural_notes: [
          "Ile-Ife is where Yoruba creation mythology begins -- the spot where the gods descended to earth",
          "As a name, Ife simply means 'love,' making it one of the most direct and powerful name meanings possible",
          "Short, elegant, and easy to pronounce in any language while being unmistakably Nigerian",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Ife Okafor is short and striking. The two-syllable first name creates a crisp, confident pairing with the surname.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Ife are both short, ancient, and meaningful. A pair of names rooted in deep tradition.",
        },
        combo_suggestions: [
          {
            first: "Ife",
            middle: "Chidinma",
            why: "Ife Chidinma Okafor means 'Love, God is good' -- a complete Igbo-Yoruba blessing.",
          },
        ],
      },
      {
        name: "Asha",
        theme: "Cross-Cultural",
        ipa: "/ˈɑː.ʃə/",
        syllables: 2,
        meaning: "Hope, life (Swahili); wish, desire (Sanskrit)",
        origins: ["Swahili", "Sanskrit", "Arabic"],
        variants: ["Aisha", "Ashanti"],
        nicknames: {
          intended: [],
          likely: ["Ash"],
          avoid: [],
        },
        popularity: {
          latest_rank: 641,
          trend_notes:
            "Familiar but never overused. Known globally through both East African and South Asian communities.",
        },
        notable_bearers: {
          positive: [
            "Asha Bhosle, legendary Indian playback singer with a career spanning seven decades",
          ],
          fictional: [],
        },
        cultural_notes: [
          "Bridges the family's two cultural interests perfectly: Swahili (Pan-African) and Sanskrit",
          "In Swahili, Asha means 'hope' or 'life' -- a name of profound optimism",
          "In Sanskrit, it means 'wish' or 'desire,' connecting to Hindu philosophical traditions",
          "Simple enough for any context yet rich enough to spark conversation",
        ],
        surname_fit: {
          surname: "Okafor",
          notes:
            "Asha Okafor is gentle yet grounded. The soft 'sh' sound gives it a warm, inviting quality against the stronger surname.",
        },
        sibset_fit: {
          siblings: ["Ezra"],
          notes:
            "Ezra and Asha both carry meaning across cultures. Short, warm, and complementary without being matchy.",
        },
        combo_suggestions: [
          {
            first: "Asha",
            middle: "Chidinma",
            why: "Asha Chidinma Okafor weaves Swahili hope with Igbo gratitude -- a cross-continental blessing.",
          },
        ],
      },
    ],
    selection: {
      finalists: [
        { name: "Amara", why: "The most genuinely cross-cultural option, carrying deep meaning in both Igbo and Sanskrit traditions." },
        { name: "Adaeze", why: "The proudest cultural choice -- a royal Igbo name with commanding presence." },
        { name: "Nia", why: "Short, purposeful, and resonant across African and Welsh traditions." },
        { name: "Zuri", why: "Bright and contemporary with Swahili warmth." },
        { name: "Chioma", why: "Deeply spiritual Igbo name expressing gratitude to God -- as rooted as it gets." },
        { name: "Ayana", why: "A pan-African flower name with unexpected Japanese resonance." },
        { name: "Ife", why: "The most direct meaning possible: love. Ancient, Nigerian, and unforgettable." },
        { name: "Asha", why: "Bridges Swahili and Sanskrit perfectly -- hope in two syllables." },
      ],
      near_misses: [
        { name: "Chiamaka", reason: "Beautiful Igbo name but felt too long alongside Okafor for everyday use." },
        { name: "Imani", reason: "Lovely Swahili name but slightly more common than the family preferred." },
        { name: "Nneka", reason: "Powerful meaning ('mother is supreme') but the double-N start posed pronunciation challenges outside Nigeria." },
      ],
    },
    report: {
      summary:
        "Your family has a gift for choosing names that bridge cultures with grace. Ezra set a wonderful precedent -- a name rooted in Hebrew tradition that feels completely at home anywhere. Amara continues that legacy beautifully. It means 'grace' in Igbo and 'eternal' in Sanskrit, giving your daughter a name that carries meaning across continents. Amara Chidinma Okafor is a name of profound beauty, honoring your family while standing confidently in any room.",
      finalists: [
        {
          name: "Amara",
          why: "Grace and eternity in one name. Cross-cultural in the deepest sense, carrying weight in Igbo, Sanskrit, and Arabic traditions. Pairs beautifully with Ezra.",
          combo: { first: "Amara", middle: "Chidinma", why: "Amara Chidinma Okafor combines 'grace' with 'God is good' -- a powerful Igbo blessing that honors grandmother Chidinma." },
        },
        {
          name: "Adaeze",
          why: "The name that most proudly proclaims your Igbo heritage. 'First daughter of the king' is a meaning your daughter will carry with pride.",
          combo: { first: "Adaeze", middle: "Chidinma", why: "Adaeze Chidinma Okafor is a fully Igbo name of royal beauty." },
        },
        {
          name: "Nia",
          why: "For the family that values simplicity and purpose. The Kwanzaa connection adds communal meaning.",
          combo: { first: "Nia", middle: "Chidinma", why: "Nia Chidinma Okafor balances brevity with depth." },
        },
        {
          name: "Zuri",
          why: "The sunniest option. Zuri is pure joy in two syllables, and the Z-echo with Ezra is delightful.",
          combo: { first: "Zuri", middle: "Chidinma", why: "Zuri Chidinma Okafor is vibrant, beautiful, and rooted." },
        },
        {
          name: "Chioma",
          why: "The most spiritually grounded option. 'God is good' is a name your daughter will grow into with deepening appreciation.",
          combo: { first: "Chioma", middle: "Grace", why: "Chioma Grace Okafor translates its own meaning -- a name that speaks in two languages at once." },
        },
        {
          name: "Ayana",
          why: "A beautiful flower that blooms across continents. Ethiopian roots with Japanese possibility make this the quiet cosmopolitan choice.",
          combo: { first: "Ayana", middle: "Chidinma", why: "Ayana Chidinma Okafor layers Ethiopian beauty with Igbo blessing." },
        },
        {
          name: "Ife",
          why: "Two syllables, one meaning: love. Connected to the ancient holy city of Ile-Ife, the cradle of Yoruba civilization.",
          combo: { first: "Ife", middle: "Chidinma", why: "Ife Chidinma Okafor means 'Love, God is good' -- a complete Nigerian blessing." },
        },
        {
          name: "Asha",
          why: "Hope in Swahili, wish in Sanskrit -- the only name on this list that perfectly bridges both of the family's cultural priorities.",
          combo: { first: "Asha", middle: "Chidinma", why: "Asha Chidinma Okafor weaves East African hope with Igbo gratitude." },
        },
      ],
      tradeoffs: [
        "Amara's cross-cultural reach is a strength, but some may prefer a name with a single, unambiguous cultural origin.",
        "Adaeze is the most distinctly Igbo option but will require pronunciation guidance in many American contexts.",
        "Nia is accessible but may feel too simple for parents seeking a name with more cultural weight.",
        "Zuri is trendy and rising quickly -- it may feel less unique in five years.",
        "Chioma requires a 'ch' as in 'church' pronunciation that English speakers may default to -- but it's an easy correction.",
        "Ayana's multiple cultural origins mean no single community will claim it fully, which is either a feature or a limitation.",
        "Ife is strikingly short and may feel incomplete to those unfamiliar with Yoruba naming. The city association adds weight once explained.",
        "Asha's similarity to Aisha may cause occasional mix-ups, though the names have different origins and meanings.",
      ],
      tie_break_tips: [
        "Say 'Ezra and ___' at a family gathering. The name that gets the warmest smiles is the one.",
        "Consider which name your daughter would most enjoy explaining the meaning of when she's older.",
        "If bilingual use between the U.S. and Nigeria matters most, Amara, Adaeze, and Chioma are the strongest choices.",
        "Write each full name on a card and leave them on your nightstand for a week. The one you keep picking up first is your answer.",
      ],
    },
  },

  rowan: {
    profile: {
      raw_brief:
        "We want a nature-inspired, gender-neutral name for our baby. We don't know the sex yet and want something that works beautifully either way. Our surname is Anderson and we have a son named Sage. We love earthy, grounded names with a poetic feel.",
      gender: "unknown",
      family: {
        surname: "Anderson",
        siblings: ["Sage"],
        honor_names: [],
      },
      preferences: {
        naming_themes: ["Nature & Earth", "Gender-Neutral"],
        nickname_tolerance: "low",
        length_pref: "short-to-medium",
        cultural_bounds: ["Celtic", "English", "Scandinavian"],
      },
      names_considering: ["Rowan", "Juniper", "Linden"],
      themes: ["Nature & Earth", "Gender-Neutral"],
      vetoes: {
        hard: ["River", "Hunter"],
        soft: ["Ash"],
      },
      region: ["United States", "United Kingdom"],
      target_popularity_band: "top 100-300",
      comments:
        "We're a family that spends a lot of time outdoors. The name should feel at home in the woods as much as in a boardroom.",
    },
    candidates: [
      {
        name: "Rowan",
        theme: "Nature & Earth",
        ipa: "/ˈɹoʊ.ən/",
        syllables: 2,
        meaning: "Little red-haired one; also the rowan tree, known for protection",
        origins: ["Irish", "Scottish Gaelic", "English"],
        variants: ["Rowen", "Roan"],
        nicknames: {
          intended: ["Row"],
          likely: ["Ro"],
          avoid: [],
        },
        popularity: {
          latest_rank: 109,
          peak_rank: 99,
          trend_notes:
            "Top 150 for boys and top 200 for girls. A true crossover name that leans slightly masculine but is increasingly popular for girls.",
        },
        notable_bearers: {
          positive: [
            "Rowan Atkinson, beloved British comedian",
            "Rowan Blanchard, actress and activist",
          ],
          fictional: ["Rowan Whitethorn from the Throne of Glass series"],
        },
        cultural_notes: [
          "The rowan tree has deep Celtic mythology -- it was believed to ward off enchantment and evil spirits",
          "In Scandinavian tradition, rowan trees are associated with Thor",
          "Works across genders without feeling forced in either direction",
        ],
        surname_fit: {
          surname: "Anderson",
          notes:
            "Rowan Anderson has a strong, grounded feel. The two-syllable first name pairs naturally with the three-syllable surname.",
        },
        sibset_fit: {
          siblings: ["Sage"],
          notes:
            "Sage and Rowan is a nature-lover's dream sibset. Both are botanical, short, and gender-neutral without being matchy.",
        },
        combo_suggestions: [
          {
            first: "Rowan",
            middle: "James",
            why: "Rowan James Anderson is sturdy and classic. James anchors the nature name with tradition.",
          },
          {
            first: "Rowan",
            middle: "Elise",
            why: "Rowan Elise Anderson works beautifully if baby is a girl. Elise adds a touch of French elegance.",
          },
        ],
      },
      {
        name: "Linden",
        theme: "Nature & Earth",
        ipa: "/ˈlɪn.dən/",
        syllables: 2,
        meaning: "Linden tree; associated with love and community in European folklore",
        origins: ["English", "Germanic"],
        variants: ["Lyndon", "Lynden"],
        nicknames: {
          intended: ["Lin"],
          likely: ["Lindy"],
          avoid: [],
        },
        popularity: {
          latest_rank: 648,
          trend_notes:
            "Still under the radar. Rare enough to be distinctive but recognizable and easy to spell.",
        },
        notable_bearers: {
          positive: ["Lyndon B. Johnson, U.S. President (variant spelling)"],
          fictional: [],
        },
        cultural_notes: [
          "Linden trees line the famous Unter den Linden boulevard in Berlin",
          "In Slavic mythology, the linden tree is sacred and symbolizes love",
        ],
        surname_fit: {
          surname: "Anderson",
          notes:
            "Linden Anderson has a warm, approachable sound. The -en endings create a gentle echo.",
        },
        sibset_fit: {
          siblings: ["Sage"],
          notes:
            "Sage and Linden are both botanical and understated. A very harmonious pair.",
        },
        combo_suggestions: [
          {
            first: "Linden",
            middle: "Grey",
            why: "Linden Grey Anderson is earthy and distinctive.",
          },
        ],
      },
      {
        name: "Juniper",
        theme: "Nature & Earth",
        ipa: "/ˈdʒuː.nɪ.pɚ/",
        syllables: 3,
        meaning: "The juniper tree or bush; evergreen, resilient",
        origins: ["Latin", "English"],
        variants: ["Junipero"],
        nicknames: {
          intended: ["Juno", "June"],
          likely: ["Juni"],
          avoid: ["Nip"],
        },
        popularity: {
          latest_rank: 138,
          trend_notes:
            "Exploded in popularity over the last decade. Primarily used for girls but beginning to appear for boys.",
        },
        notable_bearers: {
          positive: ["Junipero Serra, historical missionary (variant)"],
          fictional: ["Juniper from the animated film"],
        },
        cultural_notes: [
          "Juniper berries are used in gin production and traditional medicine",
          "The tree symbolizes protection and purification in many cultures",
          "Leans more feminine than masculine currently",
        ],
        surname_fit: {
          surname: "Anderson",
          notes:
            "Juniper Anderson is spirited and energetic. The three syllables create a lively rhythm with Anderson.",
        },
        sibset_fit: {
          siblings: ["Sage"],
          notes:
            "Sage and Juniper are both herbal/botanical. Lovely together but could feel like a theme pushed too far for some.",
        },
        combo_suggestions: [
          {
            first: "Juniper",
            middle: "Wren",
            why: "Juniper Wren Anderson layers nature imagery beautifully.",
          },
        ],
      },
      {
        name: "Hazel",
        theme: "Nature & Earth",
        ipa: "/ˈheɪ.zəl/",
        syllables: 2,
        meaning: "The hazel tree; associated with wisdom and inspiration",
        origins: ["English", "Old English"],
        variants: ["Hazelle"],
        nicknames: {
          intended: [],
          likely: ["Haze"],
          avoid: [],
        },
        popularity: {
          latest_rank: 28,
          trend_notes:
            "Very popular right now. Part of the vintage revival wave along with Violet and Ivy.",
        },
        notable_bearers: {
          positive: ["Hazel Scott, legendary jazz pianist"],
          fictional: ["Hazel Grace Lancaster from The Fault in Our Stars"],
        },
        cultural_notes: [
          "In Celtic tradition, the hazel tree is associated with wisdom and poetic inspiration",
          "Currently reads almost exclusively as feminine",
        ],
        surname_fit: {
          surname: "Anderson",
          notes:
            "Hazel Anderson is warm and classic. Very easy on the ear.",
        },
        sibset_fit: {
          siblings: ["Sage"],
          notes:
            "Sage and Hazel are a gorgeous nature pair. However, Hazel leans heavily feminine which may not suit a gender-neutral goal.",
        },
        combo_suggestions: [
          {
            first: "Hazel",
            middle: "Quinn",
            why: "Hazel Quinn Anderson is short, punchy, and modern.",
          },
        ],
      },
    ],
    selection: {
      finalists: [
        { name: "Rowan", why: "The strongest gender-neutral option with deep Celtic roots and a perfect fit alongside Sage." },
        { name: "Linden", why: "The most unique choice -- under the radar but instantly recognizable." },
        { name: "Juniper", why: "Joyful and energetic with great nickname potential (Juno, June)." },
        { name: "Hazel", why: "A warm classic, though it leans more feminine than the family may want." },
      ],
      near_misses: [
        { name: "Briar", reason: "Lovely but the 'Br' start felt slightly harsh with 'Anderson.'" },
        { name: "Alder", reason: "Great tree name but too similar in sound to 'Anderson.'" },
      ],
    },
    report: {
      summary:
        "Your family already nailed it once with Sage, and you clearly have an instinct for names that are grounded, poetic, and genuinely unisex. Rowan is our top pick because it delivers on every front: it's a real tree with rich Celtic mythology, it works effortlessly for any gender, and Sage and Rowan together is the kind of sibset that makes other parents quietly jealous.",
      finalists: [
        {
          name: "Rowan",
          why: "The complete package: nature roots, gender-neutral ease, Celtic depth, and a perfect match with Sage and Anderson.",
          combo: { first: "Rowan", middle: "James", why: "Rowan James Anderson works for a boy; Rowan Elise Anderson for a girl. Both are grounded and elegant." },
        },
        {
          name: "Linden",
          why: "For the family that wants to be truly distinctive. Linden is recognizable but rare, with beautiful European folklore behind it.",
          combo: { first: "Linden", middle: "Grey", why: "Linden Grey Anderson is understated and cool." },
        },
        {
          name: "Juniper",
          why: "The sunniest option. Juniper brings energy and warmth, with built-in nicknames like Juno or June.",
          combo: { first: "Juniper", middle: "Wren", why: "Juniper Wren Anderson is poetic and layered." },
        },
        {
          name: "Hazel",
          why: "The most popular option, beloved for good reason. Best if you're less concerned about strict gender neutrality.",
          combo: { first: "Hazel", middle: "Quinn", why: "Hazel Quinn Anderson is crisp and modern." },
        },
      ],
      tradeoffs: [
        "Rowan is the most balanced gender-neutral option but is also the most common of the group (#109).",
        "Linden's -en ending echoes Anderson's -son ending, which some may find slightly repetitive.",
        "Juniper currently leans feminine in usage, which may matter if gender neutrality is a priority.",
        "Hazel is popular (#28) and reads almost exclusively as a girl's name.",
      ],
      tie_break_tips: [
        "If you find out the sex before birth, revisit the list. Rowan and Linden hold up best across genders.",
        "Write 'Sage and ___' on a piece of paper and stick it on the fridge for a week. The one that still makes you smile wins.",
        "Consider the playground test: can you easily call this name across a park without feeling self-conscious?",
        "If one name keeps popping into your head when you picture your child at age 5, trust that instinct — it's your subconscious doing the work.",
      ],
    },
  },

  kenji: {
    profile: {
      raw_brief:
        "We're expecting a boy and want a name that honors our Japanese heritage while feeling natural in an English-speaking environment. Our surname is Tanaka and our daughter is named Hana. We value names with strong meaning and understated elegance.",
      gender: "boy",
      family: {
        surname: "Tanaka",
        siblings: ["Hana"],
        honor_names: ["Kenji (grandfather)"],
      },
      preferences: {
        naming_themes: ["Japanese Heritage", "Cross-Cultural Elegance"],
        nickname_tolerance: "low",
        length_pref: "short",
        cultural_bounds: ["Japanese"],
      },
      names_considering: ["Kenji", "Ren", "Haruki"],
      themes: ["Japanese Heritage", "Cross-Cultural Elegance"],
      vetoes: {
        hard: ["Ken"],
        soft: ["Kai"],
      },
      region: ["United States", "Japan"],
      target_popularity_band: "outside top 500",
      comments:
        "We want a name our son can wear proudly in both Tokyo and New York. It should be easy to pronounce in English but unmistakably Japanese.",
    },
    candidates: [
      {
        name: "Kenji",
        theme: "Japanese Heritage",
        ipa: "/ˈkɛn.dʒi/",
        syllables: 2,
        meaning: "Intelligent second son; also 'strong and vigorous' depending on kanji (賢二 or 健児)",
        origins: ["Japanese"],
        variants: ["Kenshi", "Kenta"],
        nicknames: {
          intended: [],
          likely: ["Ken"],
          avoid: ["Kenny"],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Not in the U.S. top 1000 but widely recognized thanks to cultural exports. Familiar to English speakers without being common.",
        },
        notable_bearers: {
          positive: [
            "Kenji Mizoguchi, legendary film director",
            "J. Kenji López-Alt, celebrated chef and food science writer",
          ],
          fictional: ["Kenji in various anime and manga series"],
        },
        cultural_notes: [
          "The meaning changes significantly depending on which kanji characters are chosen -- an important decision for Japanese families",
          "賢二 (wise second son) honors grandfather Kenji while potentially giving different kanji",
          "Immediately recognizable as Japanese but effortlessly pronounceable in English",
          "Has gained familiarity in the U.S. through Japanese food culture and media",
        ],
        surname_fit: {
          surname: "Tanaka",
          notes:
            "Kenji Tanaka is a classic, strong Japanese name. The two-syllable rhythm of both names creates a clean, balanced cadence.",
        },
        sibset_fit: {
          siblings: ["Hana"],
          notes:
            "Hana and Kenji are a beautiful Japanese sibling pair. Both are two syllables, unmistakably Japanese, and easy to say in any language.",
        },
        combo_suggestions: [
          {
            first: "Kenji",
            middle: "Hiro",
            why: "Kenji Hiro Tanaka layers Japanese heritage with a middle name meaning 'generous' or 'abundant.'",
          },
          {
            first: "Kenji",
            middle: "Alexander",
            why: "Kenji Alexander Tanaka bridges Japanese and Western traditions, giving flexibility in formal contexts.",
          },
        ],
      },
      {
        name: "Ren",
        theme: "Cross-Cultural Elegance",
        ipa: "/ɹɛn/",
        syllables: 1,
        meaning: "Lotus; love (depending on kanji: 蓮 or 恋)",
        origins: ["Japanese"],
        variants: ["Ren (蓮)", "Ren (恋)"],
        nicknames: {
          intended: [],
          likely: [],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Ren has been the #1 boys' name in Japan for several recent years. Not ranked in the U.S. top 1000 but gaining recognition.",
        },
        notable_bearers: {
          positive: [
            "Ren Hang, Chinese contemporary photographer and poet",
          ],
          fictional: ["Ren in Star Wars: The Force Awakens (Kylo Ren)"],
        },
        cultural_notes: [
          "The lotus (蓮) is a profound Buddhist symbol of purity and enlightenment",
          "Extremely popular in contemporary Japan -- the most-chosen boys' name in recent years",
          "Short enough to work as a standalone name in any language",
          "The Star Wars association (Kylo Ren) exists but the name's Japanese roots are much deeper",
        ],
        surname_fit: {
          surname: "Tanaka",
          notes:
            "Ren Tanaka is minimalist and modern. The one-syllable first name gives the full name a crisp, contemporary feel.",
        },
        sibset_fit: {
          siblings: ["Hana"],
          notes:
            "Hana and Ren are both short, nature-connected Japanese names. Hana (flower) and Ren (lotus) create a botanical pair.",
        },
        combo_suggestions: [
          {
            first: "Ren",
            middle: "Takeshi",
            why: "Ren Takeshi Tanaka adds weight and tradition to the spare first name.",
          },
        ],
      },
      {
        name: "Haruki",
        theme: "Japanese Heritage",
        ipa: "/hɑːˈɹuː.ki/",
        syllables: 3,
        meaning: "Spring child; radiance (春樹 or 陽輝)",
        origins: ["Japanese"],
        variants: ["Haru"],
        nicknames: {
          intended: ["Haru"],
          likely: ["Ruki"],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Not ranked in the U.S. but strongly associated with Haruki Murakami, one of the world's most-read living authors.",
        },
        notable_bearers: {
          positive: [
            "Haruki Murakami, internationally acclaimed novelist",
          ],
          fictional: [],
        },
        cultural_notes: [
          "The literary association with Murakami is strong and almost universally positive",
          "Spring (haru) symbolizes new beginnings and hope in Japanese culture",
          "Three syllables give the name a melodic quality while remaining easy for English speakers",
        ],
        surname_fit: {
          surname: "Tanaka",
          notes:
            "Haruki Tanaka is warm and literary. The three-syllable first name creates a flowing rhythm.",
        },
        sibset_fit: {
          siblings: ["Hana"],
          notes:
            "Hana and Haruki share the 'Ha-' start, which creates cohesion but may feel slightly too similar for some families.",
        },
        combo_suggestions: [
          {
            first: "Haruki",
            middle: "James",
            why: "Haruki James Tanaka blends Japanese literary tradition with Western classic.",
          },
        ],
      },
      {
        name: "Sora",
        theme: "Cross-Cultural Elegance",
        ipa: "/ˈsɔː.ɹə/",
        syllables: 2,
        meaning: "Sky (空)",
        origins: ["Japanese"],
        variants: [],
        nicknames: {
          intended: [],
          likely: [],
          avoid: [],
        },
        popularity: {
          latest_rank: 0,
          trend_notes:
            "Rising in Japan and gaining international recognition through the video game Kingdom Hearts.",
        },
        notable_bearers: {
          positive: [],
          fictional: ["Sora, protagonist of the Kingdom Hearts video game series"],
        },
        cultural_notes: [
          "Sky (空) is a nature name that transcends gender in Japanese",
          "The Kingdom Hearts connection makes it recognizable to younger generations worldwide",
          "Simple, open, and luminous in sound",
        ],
        surname_fit: {
          surname: "Tanaka",
          notes:
            "Sora Tanaka is airy and modern. The open vowels create a gentle, flowing name.",
        },
        sibset_fit: {
          siblings: ["Hana"],
          notes:
            "Hana (flower) and Sora (sky) are a poetic nature pair -- earth and sky together.",
        },
        combo_suggestions: [
          {
            first: "Sora",
            middle: "Kenji",
            why: "Sora Kenji Tanaka pairs the ethereal with the grounded.",
          },
        ],
      },
    ],
    selection: {
      finalists: [
        { name: "Kenji", why: "Honors grandfather, unmistakably Japanese, effortlessly pronounceable worldwide." },
        { name: "Ren", why: "Japan's most popular boys' name with profound Buddhist symbolism. Minimalist and modern." },
        { name: "Haruki", why: "Literary gravitas via Murakami. The nickname Haru is warm and accessible." },
        { name: "Sora", why: "Poetic and gender-fluid. Sky and flower (with Hana) make a stunning sibset." },
      ],
      near_misses: [
        { name: "Akira", reason: "Iconic but the strong film association may overshadow the child's own identity." },
        { name: "Yuki", reason: "Beautiful but leans more feminine in Western perception despite being unisex in Japanese." },
      ],
    },
    report: {
      summary:
        "Hana set a beautiful standard: a name that is authentically Japanese and universally accessible. Kenji carries that same dual strength. It honors grandfather Kenji while giving your son a name that commands respect in both Tokyo and New York. The name is instantly recognizable as Japanese, easy to pronounce in any language, and carries meanings of intelligence and vitality depending on the kanji you choose.",
      finalists: [
        {
          name: "Kenji",
          why: "The name that honors family and heritage simultaneously. Strong, intelligent, and globally accessible. Hana and Kenji is a sibling pair of quiet perfection.",
          combo: { first: "Kenji", middle: "Hiro", why: "Kenji Hiro Tanaka means 'intelligent, generous' -- a blessing in name form." },
        },
        {
          name: "Ren",
          why: "The modern minimalist choice. One syllable that carries the weight of Buddhist philosophy. Ren Tanaka is crisp and unforgettable.",
          combo: { first: "Ren", middle: "Takeshi", why: "Ren Takeshi Tanaka adds depth and tradition to the spare elegance of Ren." },
        },
        {
          name: "Haruki",
          why: "For the literary family. Murakami's name lends an air of creative sophistication, and the nickname Haru is sunshine itself.",
          combo: { first: "Haruki", middle: "James", why: "Haruki James Tanaka bridges two literary traditions beautifully." },
        },
        {
          name: "Sora",
          why: "The most poetic option. Hana and Sora -- flower and sky -- is the kind of sibset that takes your breath away.",
          combo: { first: "Sora", middle: "Kenji", why: "Sora Kenji Tanaka could still honor grandfather while choosing the more ethereal first name." },
        },
      ],
      tradeoffs: [
        "Kenji's 'Ken' nickname may emerge naturally, which the family wants to avoid. Setting the expectation early helps.",
        "Ren's single syllable may feel too spare for formal occasions, though Ren Tanaka has a quiet authority.",
        "Haruki shares the 'Ha-' start with Hana, which some families love (cohesion) and others avoid (too similar).",
        "Sora's gaming association (Kingdom Hearts) may date the name for some, though the Japanese meaning is timeless.",
      ],
      tie_break_tips: [
        "Ask family in Japan which name resonates most. Cultural reception at home matters.",
        "Consider the kanji carefully -- the written form of the name carries as much weight as the sound in Japanese naming tradition.",
        "Introduce yourself as 'Hi, I'm ___ Tanaka' in both English and Japanese. The name that feels most natural in both wins.",
        "If honoring grandfather is the top priority, Kenji is the clear choice. If you want to forge a new path, Ren or Sora offer fresh starts.",
      ],
    },
  },

  zara: {
    profile: {
      raw_brief:
        "We're expecting a girl and want a name that reflects our Middle Eastern heritage while feeling modern and global. Our surname is Hassan and our son is named Omar. We want something short, strong, and beautiful.",
      gender: "girl",
      family: {
        surname: "Hassan",
        siblings: ["Omar"],
        honor_names: ["Fatima (grandmother)"],
      },
      preferences: {
        naming_themes: ["Modern & Global", "Arabic Heritage"],
        nickname_tolerance: "low",
        length_pref: "short",
        cultural_bounds: ["Arabic", "Hebrew", "Persian"],
      },
      names_considering: ["Zara", "Layla", "Nadia"],
      themes: ["Modern & Global", "Arabic Heritage"],
      vetoes: {
        hard: ["Aaliyah"],
        soft: ["Yasmin"],
      },
      region: ["United States", "Jordan"],
      target_popularity_band: "top 50-300",
      comments:
        "We travel between Amman and Chicago. The name needs to sound beautiful in Arabic and English equally. Short names are our preference.",
    },
    candidates: [
      {
        name: "Zara",
        theme: "Modern & Global",
        ipa: "/ˈzɑː.ɹə/",
        syllables: 2,
        meaning: "Blooming flower (Arabic); princess (Hebrew); dawn/radiance (multiple traditions)",
        origins: ["Arabic", "Hebrew", "Persian"],
        variants: ["Zahra", "Zahrah", "Sara"],
        nicknames: {
          intended: [],
          likely: ["Z"],
          avoid: [],
        },
        popularity: {
          latest_rank: 89,
          trend_notes:
            "Rising steadily in the U.S. and already popular in the UK (thanks to Zara Phillips/Tindall and the fashion brand). A genuinely international name.",
        },
        notable_bearers: {
          positive: [
            "Zara Tindall (née Phillips), British royal and Olympic equestrian",
            "Zara Larsson, Swedish pop star",
          ],
          fictional: [],
        },
        cultural_notes: [
          "In Arabic, Zahra (زهراء) means 'blooming' or 'radiant' and is one of the titles of Fatima, the Prophet's daughter",
          "The simplified spelling 'Zara' has become a global name that transcends any single culture",
          "The fashion brand Zara has made the name universally recognizable",
          "Works perfectly in Arabic, English, French, Spanish, and many other languages",
        ],
        surname_fit: {
          surname: "Hassan",
          notes:
            "Zara Hassan is crisp, confident, and melodic. The two-syllable rhythm of both names creates a balanced, elegant pair.",
        },
        sibset_fit: {
          siblings: ["Omar"],
          notes:
            "Omar and Zara are both short, strong Arabic names with global appeal. They match in length, energy, and cultural grounding.",
        },
        combo_suggestions: [
          {
            first: "Zara",
            middle: "Fatima",
            why: "Zara Fatima Hassan honors grandmother Fatima. The connection to Fatima al-Zahra makes this pairing especially meaningful in Islamic tradition.",
          },
          {
            first: "Zara",
            middle: "Noelle",
            why: "Zara Noelle Hassan bridges Arabic and French, reflecting a cosmopolitan family.",
          },
        ],
      },
      {
        name: "Layla",
        theme: "Arabic Heritage",
        ipa: "/ˈleɪ.lə/",
        syllables: 2,
        meaning: "Night, dark beauty",
        origins: ["Arabic", "Persian"],
        variants: ["Leila", "Laila", "Laylah"],
        nicknames: {
          intended: [],
          likely: ["Lay"],
          avoid: [],
        },
        popularity: {
          latest_rank: 24,
          trend_notes:
            "Very popular right now. Has been in the top 30 for several years, boosted by both its Arabic beauty and the Eric Clapton song.",
        },
        notable_bearers: {
          positive: [
            "Layla al-Akhyaliyyah, celebrated 7th-century Arabic poet",
          ],
          fictional: ["Layla in the classic Arabic love story Layla and Majnun"],
        },
        cultural_notes: [
          "Layla and Majnun is one of the great love stories of Arabic and Persian literature",
          "The Eric Clapton song 'Layla' brought the name to Western mainstream attention",
          "Multiple spelling variants can cause minor confusion",
        ],
        surname_fit: {
          surname: "Hassan",
          notes:
            "Layla Hassan is beautiful and flowing. The soft L-sounds and open vowels create a name that sings.",
        },
        sibset_fit: {
          siblings: ["Omar"],
          notes:
            "Omar and Layla are a classic Arabic pairing. Both are deeply rooted in Arabic literary tradition.",
        },
        combo_suggestions: [
          {
            first: "Layla",
            middle: "Fatima",
            why: "Layla Fatima Hassan is rich in Arabic literary and spiritual heritage.",
          },
        ],
      },
      {
        name: "Nadia",
        theme: "Modern & Global",
        ipa: "/ˈnɑː.di.ə/",
        syllables: 3,
        meaning: "Caller, announcer (Arabic); hope (Slavic)",
        origins: ["Arabic", "Slavic", "French"],
        variants: ["Nadya", "Nadiya"],
        nicknames: {
          intended: ["Nadi"],
          likely: ["Nad"],
          avoid: [],
        },
        popularity: {
          latest_rank: 412,
          trend_notes:
            "A vintage choice that peaked in the 1980s-90s and is now gently rising again. Familiar but not overused.",
        },
        notable_bearers: {
          positive: [
            "Nadia Comaneci, legendary Olympic gymnast",
            "Nadia Murad, Nobel Peace Prize laureate",
          ],
          fictional: ["Nadia in the Netflix series Russian Doll"],
        },
        cultural_notes: [
          "One of the most successfully cross-cultural Arabic names, used widely in Europe, the Americas, and the Middle East",
          "The Slavic meaning 'hope' adds a second layer of beautiful meaning",
          "Has an effortlessly elegant, cosmopolitan feel",
        ],
        surname_fit: {
          surname: "Hassan",
          notes:
            "Nadia Hassan is smooth and sophisticated. The three-syllable first name flows naturally into the two-syllable surname.",
        },
        sibset_fit: {
          siblings: ["Omar"],
          notes:
            "Omar and Nadia are both Arabic names with wide international recognition. A polished, worldly pair.",
        },
        combo_suggestions: [
          {
            first: "Nadia",
            middle: "Fatima",
            why: "Nadia Fatima Hassan is graceful and honors the family beautifully.",
          },
        ],
      },
      {
        name: "Leena",
        theme: "Arabic Heritage",
        ipa: "/ˈliː.nə/",
        syllables: 2,
        meaning: "Tender, delicate; also a type of palm tree (Arabic: لينة)",
        origins: ["Arabic", "Finnish", "Sanskrit"],
        variants: ["Lina", "Lena"],
        nicknames: {
          intended: [],
          likely: ["Lee"],
          avoid: [],
        },
        popularity: {
          latest_rank: 587,
          trend_notes:
            "The 'Leena' spelling is less common than 'Lina' in the U.S. but gaining ground. Popular across the Middle East and Scandinavia.",
        },
        notable_bearers: {
          positive: [
            "Lena Headey, actress (variant spelling)",
          ],
          fictional: [],
        },
        cultural_notes: [
          "Mentioned in the Quran (59:5) -- the word refers to a type of palm tree",
          "Cross-cultural appeal: it works as an Arabic, Scandinavian, and South Asian name",
          "Simple, gentle, and universally easy to pronounce",
        ],
        surname_fit: {
          surname: "Hassan",
          notes:
            "Leena Hassan is gentle and melodic. The double-E sound gives it a soft, inviting quality.",
        },
        sibset_fit: {
          siblings: ["Omar"],
          notes:
            "Omar and Leena balance strength with tenderness. A complementary pair.",
        },
        combo_suggestions: [
          {
            first: "Leena",
            middle: "Fatima",
            why: "Leena Fatima Hassan is delicate, spiritual, and grounded in tradition.",
          },
        ],
      },
    ],
    selection: {
      finalists: [
        { name: "Zara", why: "Short, radiant, and genuinely global. Works flawlessly in Arabic and English." },
        { name: "Layla", why: "The most romantic choice, steeped in Arabic literary tradition." },
        { name: "Nadia", why: "Cosmopolitan and elegant, with cross-cultural meaning (caller + hope)." },
        { name: "Leena", why: "Gentle and Quranic, with a universal softness." },
      ],
      near_misses: [
        { name: "Aisha", reason: "Beautiful and deeply meaningful but very common in Arabic-speaking communities." },
        { name: "Samira", reason: "Lovely but felt slightly dated compared to the family's modern preference." },
      ],
    },
    report: {
      summary:
        "Omar set the bar high: a name that is unmistakably Arabic, instantly global, and ages beautifully. Zara meets that standard with grace. It carries the radiance of its Arabic root (Zahra, 'blooming'), the strength of its Hebrew meaning ('princess'), and the sleek modernity of its simplified spelling. Zara Fatima Hassan is especially poignant -- the connection between Zahra and Fatima echoes one of Islam's most beloved figures, Fatima al-Zahra.",
      finalists: [
        {
          name: "Zara",
          why: "Two syllables that carry a world of meaning. Radiant in Arabic, regal in Hebrew, and recognized everywhere. Omar and Zara is a power sibset.",
          combo: { first: "Zara", middle: "Fatima", why: "Zara Fatima Hassan echoes Fatima al-Zahra, connecting bloom and radiance in a name of spiritual depth." },
        },
        {
          name: "Layla",
          why: "The poet's choice. Layla and Majnun is one of literature's great love stories, and the name carries that romantic weight beautifully.",
          combo: { first: "Layla", middle: "Fatima", why: "Layla Fatima Hassan is rich in Arabic literary and spiritual heritage." },
        },
        {
          name: "Nadia",
          why: "The diplomat's name. Recognized from Amman to Chicago to Paris, Nadia moves through the world with effortless grace.",
          combo: { first: "Nadia", middle: "Fatima", why: "Nadia Fatima Hassan is sophisticated and deeply rooted." },
        },
        {
          name: "Leena",
          why: "The gentlest option. A Quranic name meaning tender, with the softness of a palm tree bending in the breeze.",
          combo: { first: "Leena", middle: "Fatima", why: "Leena Fatima Hassan is delicate, spiritual, and quietly powerful." },
        },
      ],
      tradeoffs: [
        "Zara at #89 is the most popular option. If you want your daughter to be the only Zara in her class, Leena (#587) offers more rarity.",
        "Layla at #24 is very popular in the U.S. -- she may share the name with classmates.",
        "Nadia may be perceived as more Eastern European than Arabic by some Americans, though its Arabic roots are primary.",
        "Leena's simplified spelling may be confused with 'Lena' or 'Lina' and require occasional correction.",
      ],
      tie_break_tips: [
        "Say each name in both Arabic and English five times. The one that feels equally beautiful in both languages is your answer.",
        "Consider how the name will be received in Amman and Chicago equally. Zara and Layla excel in both; Nadia leans slightly Western.",
        "If the Fatima al-Zahra connection matters deeply to your family, Zara makes that link most directly.",
        "Ask Omar to say his sister's name. The one a toddler can pronounce most easily will be the one you hear most often.",
      ],
    },
  },
} satisfies Record<string, RunResult>;
