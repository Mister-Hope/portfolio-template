# CLAUDE.md - AI Assistant Instructions

This file provides instructions for AI assistants (Claude, GitHub Copilot, etc.) working on this project.

## Quick Start

Please read [AGENTS.md](AGENTS.md) for complete instructions.

## Core Concept

This is a **configuration-driven** portfolio template. Users should primarily customize via config files.

## Two Modes

### Template Developer Mode

- You are helping develop/extend the template
- Full source code access
- Can modify anything in src/

### User Mode

- You are helping an end-user customize their portfolio
- **Always prefer config first**
- Only modify src/ when user explicitly requests style changes or strongly expresses a new feature need
- Follow minimalism: CSS override (src/index.css) before component changes

## Key Points

- Users should edit their config file (`config.ts`, `config.js`, `config.json`, `config.yml`, or `config.yaml`)
- For style changes: suggest CSS override in `src/index.css` first
- Only modify components as last resort

## References

- Full instructions: [AGENTS.md](AGENTS.md)
- Config documentation: [docs/en.md](docs/en.md)
- Example configs: [examples/](examples/)
