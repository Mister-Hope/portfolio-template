# AGENTS.md - AI Assistant Instructions for Portfolio Template

## Core Principle

This is a **configuration-driven** portfolio template. All user-facing content, layout, and appearance should be controlled through configuration files by default.

## Mode Detection

**Determine the current context by understanding who is asking:**

### Template Developer Mode

- **Who**: You are helping develop/extend the template itself
- **What**: Working on `src/`, adding new features, improving the template
- **Action**: Full source code access, can modify anything

### User Mode

- **Who**: You are helping an end-user customize their personal portfolio
- **What**: The user is using this template for their own portfolio
- **Action**: Config-first; only modify source files when explicitly requested

---

## User Mode Guidelines (Most Common)

When helping an end-user customize their portfolio:

### Rule 1: Always Prefer Configuration

Guide users to edit their portfolio configuration file first:

- `config.ts`
- `config.js`
- `config.json`
- `config.yml`
- `config.yaml`

**Examples**:

- "Change your name in `config.yml` under `locales[/].hero.name`"
- "Add a new section by editing the `sections` array in your config file"
- "Add custom styles to `custom.css` in the project root (auto-injected at build time)"

### Rule 2: Source Modification Only When Explicitly Requested

Only modify source code (`src/`) when:

1. **Style Customization**: The user explicitly requests visual changes that cannot be achieved via config or `custom.css`
1. **Strong Feature Request**: The user clearly expresses a need that config cannot fulfill

### Rule 3: Minimal Source Changes

When source modification is necessary, follow the **minimalism principle**:

1. **Least invasive**: Prefer CSS / config solutions over component code changes
1. **Non-breaking**: Avoid changes that would affect other users' configurations

**Example Workflow**:

- User: "I want to change the hero background"
- Response: "You can set it in your config file under `hero.bgImage`"
- If config doesn't support it: "Add the override to `custom.css` in the project root — it will be injected automatically"

---

## Common Tasks

### 1. Changing Content (Text, Images, Links)

- **Find**: User's config file in the project root
- **Edit**: The corresponding field in the `locales` object
- **Example**: Change hero title → `hero.titles` in config

### 2. Adding/Removing Sections

- **Find**: `sections` array in config
- **Edit**: Add/remove objects with the appropriate `type`
- **Reference**: See [docs/en.md](docs/en.md) for available section types

### 3. Style Customization

- **Step 1**: Check if config supports it (e.g., `experienceStyles`)
- **Step 2**: If not, suggest creating or editing `custom.css` in the project root
- **Step 3**: Only modify component code as a last resort

### 4. New Feature Requests

- **Step 1**: Check if achievable via config
- **Step 2**: If not, propose `custom.css` in the project root for style changes
- **Step 3**: If still not possible, create a coding plan with minimal changes

---

## Development Setup

This project uses **pnpm** as its package manager (`pnpm-lock.yaml` is the lockfile).

- Install dependencies: `pnpm install --frozen-lockfile`
- Dev server: `pnpm run dev`
- Production build: `pnpm run build`
- Lint + format: `pnpm run lint`

---

## Development Rules (Template Developer Mode)

When developing the template itself:

- Follow standard coding practices
- Maintain backward compatibility
- Add new config options before adding source-code solutions
- Keep components flexible for config-driven customization

---

## Feature Request Workflow

1. **Identify**: Who is asking — template developer or end user?
2. **Analyze**: Can this be done via config?
3. **Guide**: If yes, direct the user to their config file
4. **CSS First**: If a style change is needed, suggest `custom.css` in the project root
5. **Minimal Code**: Only if absolutely necessary, propose a minimal source modification

---

## References

- Configuration documentation: [docs/en.md](docs/en.md)
- Chinese documentation: [docs/zh.md](docs/zh.md)
- Example configs: [examples/](examples/)
- Config schema: [lib/config.schema.json](lib/config.schema.json)
