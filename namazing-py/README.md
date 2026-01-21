# Namazing

AI-powered baby naming service.

## Installation

```bash
pip install -e ".[dev]"
```

## Usage

```bash
# Run the naming pipeline
namazing run "We're looking for a name for our daughter. Surname: Thompson."

# Options
namazing run "brief" --mode serial    # Quick preview mode
namazing run "brief" --mode parallel  # Full analysis mode
namazing run "brief" --quiet          # Suppress progress output
namazing run "brief" --output results.json  # Save results to file

# Show version
namazing version
```

## Environment Variables

```bash
OPENROUTER_API_KEY=xxx     # Required for live mode (stubs used without it)
SERPAPI_KEY=xxx            # Optional: web search capability
AGENT_CONCURRENCY=8        # Parallel workers (default: 8)
DATA_DIR=./data            # CSV data location
```

## Development

```bash
# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Run tests with coverage
pytest tests/ -v --cov=namazing
```

## Project Structure

```
namazing-py/
├── src/namazing/
│   ├── schemas/          # Pydantic models
│   ├── tools/            # Research utilities
│   ├── orchestrator/     # Pipeline service
│   ├── prompts/          # Agent prompts
│   └── cli/              # CLI application
├── tests/                # Test suite
└── data/                 # CSV data files
```
