"""Stub generators for offline/testing mode."""

import re

from namazing.schemas.profile import SessionProfile, HonorNames, Preferences
from namazing.schemas.name_card import (
    NameCard,
    Nickname,
    Popularity,
    NotableBearers,
    SurnameFit,
    SibsetFit,
    Combo,
)
from namazing.schemas.selection import ExpertSelection, Finalist, NearMiss
from namazing.schemas.result import Report
from namazing.tools.phonetics import rough_ipa, count_syllables


# Sample name lanes for stub generation
SAMPLE_LANES_GIRL: dict[str, list[str]] = {
    "traditional feminine": ["Eleanor", "Margot", "Vivienne", "Helena", "Clara"],
    "literary": ["Isolde", "Beatrice", "Ophelia", "Rowena", "Celeste"],
    "nature": ["Iris", "Willow", "Juniper", "Wren", "Marigold"],
    "modern-classic": ["Avery", "Emery", "Sloane", "Quinn", "Maren"],
    "heritage": ["Liora", "Mireille", "Annelise", "Sabine", "Selene"],
}

SAMPLE_LANES_BOY: dict[str, list[str]] = {
    "classic masculine": ["James", "William", "Thomas", "Henry", "Arthur"],
    "literary": ["Atticus", "Holden", "Sawyer", "Finn", "Sebastian"],
    "nature": ["River", "Rowan", "Jasper", "August", "Silas"],
    "modern-classic": ["Hudson", "Asher", "Milo", "Ezra", "Julian"],
    "heritage": ["Killian", "Otto", "Maddox", "Merrick", "Malcolm"],
}

DEFAULT_REGION = "US"


class Candidate:
    """A candidate name from the generator."""

    def __init__(
        self,
        name: str,
        lane: str,
        rationale: str,
        theme_links: list[str] | None = None,
    ):
        self.name = name
        self.lane = lane
        self.rationale = rationale
        self.theme_links = theme_links or []


def stub_profile(brief: str) -> SessionProfile:
    """Generate a stubbed profile from a brief using regex heuristics."""
    surname_match = re.search(r"surname\s*:?\s*([A-Za-z'-]+)", brief, re.IGNORECASE)
    siblings_match = re.search(r"siblings?\s*:?\s*([A-Za-z ,]+)", brief, re.IGNORECASE)
    honor_match = re.search(r"honou?r\s*names?\s*:?\s*([A-Za-z ,]+)", brief, re.IGNORECASE)
    initials_match = re.search(r"initials?\s*:?\s*([A-Z ,]+)", brief, re.IGNORECASE)

    # Simple heuristic for gender
    is_boy = bool(re.search(r"\b(boy|son|brother|male)\b", brief, re.IGNORECASE))
    is_girl = bool(
        re.search(r"\b(girl|daughter|sister|female)\b", brief, re.IGNORECASE)
    ) and not is_boy

    siblings = None
    if siblings_match:
        siblings = [s.strip() for s in siblings_match.group(1).split(",") if s.strip()]

    honor_names = None
    if honor_match:
        honor_names = [h.strip() for h in honor_match.group(1).split(",") if h.strip()]

    initials = None
    if initials_match:
        initials = [i.strip() for i in re.split(r"[,\s]+", initials_match.group(1)) if i.strip()]

    style_lanes = (
        list(SAMPLE_LANES_BOY.keys()) if is_boy else list(SAMPLE_LANES_GIRL.keys())
    )

    return SessionProfile(
        raw_brief=brief,
        family=HonorNames(
            surname=surname_match.group(1).strip() if surname_match else None,
            siblings=siblings,
            honor_names=honor_names,
            special_initials_include=initials,
        ),
        preferences=Preferences(
            style_lanes=style_lanes,
            length_pref="short-to-medium",
            nickname_tolerance="medium",
        ),
        region=[DEFAULT_REGION],
        comments=f"Stubbed profile derived heuristically. Detected gender: {'boy' if is_boy else 'girl'}.",
    )


def stub_candidates(profile: SessionProfile | None = None) -> list[Candidate]:
    """Generate stubbed candidate names based on profile."""
    candidates: list[Candidate] = []

    # Determine which lane set to use
    # Check for girl-specific lane "traditional feminine" vs boy-specific "classic masculine"
    is_girl = False
    if profile and profile.preferences and profile.preferences.style_lanes:
        is_girl = "traditional feminine" in profile.preferences.style_lanes

    source = SAMPLE_LANES_GIRL if is_girl else SAMPLE_LANES_BOY

    for lane, names in source.items():
        for name in names:
            candidates.append(
                Candidate(
                    name=name,
                    lane=lane,
                    rationale=f"{name} carries a {lane} energy that suits the brief.",
                    theme_links=[],
                )
            )

    return candidates


def _honour_combos(name: str, honor_names: list[str]) -> list[Combo]:
    """Generate combo suggestions honoring family names."""
    if not honor_names:
        return [
            Combo(
                first=name,
                middle="Elise",
                why="Balances cadence with a nod to classic elegance.",
            ),
            Combo(
                first=name,
                middle="Ren",
                why="Honors Irene-like sounds while keeping things light.",
            ),
        ]

    return [
        Combo(
            first=name,
            middle=source,
            why=f"Directly honors {source} while keeping rhythm gentle.",
        )
        for source in honor_names[:3]
    ]


def stub_card(name: str, lane: str, profile: SessionProfile) -> NameCard:
    """Generate a stubbed NameCard for a candidate."""
    syllables = count_syllables(name)
    ipa = rough_ipa(name)
    honor_names = (
        profile.family.honor_names if profile.family and profile.family.honor_names else []
    )
    combo_suggestions = _honour_combos(name, honor_names)

    surname = (
        profile.family.surname if profile.family else None
    ) or "family surname"
    siblings = profile.family.siblings if profile.family else None

    sibset_notes = (
        f"{name} complements {', '.join(siblings)} without repeating initials."
        if siblings
        else "No siblings listed; assuming flexible fit."
    )

    return NameCard(
        name=name,
        ipa=ipa,
        syllables=syllables,
        meaning=f"{lane} inspired meaning placeholder for {name}.",
        origins=["Stub"],
        variants=[f"{name}a", f"{name}e"],
        nicknames=Nickname(
            intended=[name[:3]],
            likely=[name[:4]],
            avoid=[],
        ),
        popularity=Popularity(
            latest_rank=None,
            peak_rank=None,
            trend_notes="classic and steady (assumed)",
        ),
        notable_bearers=NotableBearers(
            positive=[
                f"{name} Example, pioneering artist",
                f"{name} Fictional, beloved literary heroine",
            ],
            fictional=[f"{name} from a sample novel"],
        ),
        cultural_notes=[
            "Cultural context requires verification; replace with Cultural Guard agent output."
        ],
        surname_fit=SurnameFit(
            surname=surname,
            notes=f"{name} shares a {syllables}-syllable cadence with the surname, offering smooth flow.",
        ),
        sibset_fit=SibsetFit(
            siblings=siblings,
            notes=sibset_notes,
        ),
        honor_mapping=[f"{h} → {name}" for h in honor_names],
        combo_suggestions=combo_suggestions,
        eliminations=[],
        research_log=[
            "Stubbed: generated via static data.",
            "Replace with live research once agents are enabled.",
        ],
    )


def stub_selection(cards: list[NameCard]) -> ExpertSelection:
    """Generate a stubbed expert selection from name cards."""
    finalists = [
        Finalist(
            name=card.name,
            why=f"{card.name} balances the brief with its {card.meaning or 'thoughtful'} tone and easy cadence with the surname.",
            combo=card.combo_suggestions[0] if card.combo_suggestions else None,
        )
        for card in cards[:8]
    ]

    near_misses = [
        NearMiss(
            name=card.name,
            reason=f"{card.name} is compelling but overlaps with another finalist in style or initial.",
        )
        for card in cards[8:12]
    ]

    return ExpertSelection(
        finalists=finalists,
        near_misses=near_misses,
    )


def stub_report(profile: SessionProfile, selection: ExpertSelection) -> Report:
    """Generate a stubbed report from profile and selection."""
    combos = [
        f.combo for f in selection.finalists if f.combo is not None
    ]

    return Report(
        summary="Stub report summarising the AI studio run. Swap in Report Composer agent output once live.",
        loved_names=[],
        finalists=selection.finalists,
        combos=combos,
        tradeoffs=[
            "Nicknames are inferred; validate with the family for preference.",
            "Popularity trends are qualitative placeholders until SSA integration lands.",
        ],
        tie_break_tips=[
            "Say each finalist aloud with the sibling set and surname.",
            "Consider monogram balance with honour initials.",
        ],
    )
