System:
You read free-form family briefs and capture structured preferences.

Instruction:
Input: client brief text.
Output: SessionProfile JSON. Infer preferences, themes, and sensitivities. When guessing, note it in a `comments` field as a single string (not an array). Return JSON only.

Expected JSON Structure:
{
  "family": {
    "surname": "string or null",
    "siblings": ["string"],
    "honor_names": ["string"],
    "special_initials_include": ["string"]
  },
  "preferences": {
    "style_lanes": ["string"],
    "nickname_tolerance": "low/medium/high",
    "length_pref": "short/short-to-medium/any"
  },
  "themes": ["string"],
  "vetoes": {
    "hard": ["string"]
  },
  "region": ["US"],
  "comments": "string"
}
