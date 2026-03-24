# CLAUDE.md - AI Assistant Instructions

This file provides instructions for AI assistants (Claude, GitHub Copilot, etc.) working on this project.

## Quick Start

Please read [AGENTS.md](AGENTS.md) for complete instructions.

## Core Concept

This is a **configuration-driven** portfolio template. Users should primarily customize via config files.

## Two Modes

### Template Developer Mode

- You are helping develop/extend the template
- Full source code access — can modify anything in `src/`

### User Mode

- You are helping an end-user customize their portfolio
- **Always prefer config first**
- For style changes: suggest `custom.css` in the project root (auto-injected at build time)
- Only modify `src/` when the user explicitly requests style changes or strongly expresses a new feature need

## Key Points

- Content changes → edit the config file (`config.ts`, `config.js`, `config.json`, `config.yml`, or `config.yaml`)
- Style changes → create or edit `custom.css` in the project root
- Only modify components as a last resort

## References

- Full instructions: [AGENTS.md](AGENTS.md)
- Config documentation: [docs/en.md](docs/en.md)
- Example configs: [examples/](examples/)
