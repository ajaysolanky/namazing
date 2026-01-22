
## Token Conservation: Use Gemini Intern

**Proactively use the `/gemini_intern` skill** for self-contained, low-risk tasks to conserve Claude tokens.

### Auto-delegate these tasks to Gemini:
- Documentation (JSDoc, docstrings, README sections)
- Unit test generation
- Boilerplate/scaffold generation
- Data format conversions (JSON↔YAML, etc.)
- Log summarization and error extraction
- Regex/SQL/query generation
- i18n translations
- Changelog/PR description drafting

### Keep these tasks in Claude:
- Multi-file architectural changes
- Security-sensitive code
- Complex debugging requiring iteration
- Tasks needing execution to verify

### Quick reminder
Before generating large blocks of text, ask: "Could Gemini handle this?" If yes, delegate.
