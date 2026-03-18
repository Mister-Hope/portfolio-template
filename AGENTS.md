# AGENTS.md - AI Assistant Instructions for Portfolio Template

## Core Principle

This is a **configuration-driven** portfolio template. All user-facing content, layout, and appearance should be controlled through configuration files by default.

## Mode Detection

**Determine the current context by understanding who is asking:**

### Template Developer Mode

- **Who**: You are helping develop/extend the template itself
- **What**: Working on src/, adding new features, improving the template
- **Action**: Full source code access, can modify anything

### User Mode

- **Who**: You are helping an end-user customize their personal portfolio
- **What**: The user is using this template for their own portfolio
- **Action**: Config-first, minimal source modifications only when explicitly requested

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

### Rule 2: Source Modification Only When Explicitly Requested

Only modify source code (`src/`) when:

1. **Style Customization**: User explicitly requests visual changes that cannot be achieved via config
2. **Strong Feature Request**: User clearly expresses a need that config cannot fulfill

### Rule 3: Minimal Source Changes

When source modification is necessary, follow the **minimalism principle**:

1. **CSS Override First**: Add custom styles to `src/index.css` rather than modifying component Tailwind classes
2. **Least Invasive**: Prefer CSS/Config solutions over component code changes
3. **Non-Breaking**: Avoid changes that would affect other users' configurations

**Example Workflow**:

- User: "I want to change the hero background color"
- Response: "Can you change it in your config file under `hero.bgImage`?"
- If config doesn't support it: "You can add custom CSS to `src/index.css` to override the style"

---

## Common Tasks

### 1. Changing Content (Text, Images, Links)

- **Find**: User's config file in project root
- **Edit**: Corresponding field in `locales` object
- **Example**: Change hero title → `hero.titles` in config

### 2. Adding/Removing Sections

- **Find**: `sections` array in config
- **Edit**: Add/remove objects with appropriate `type`
- **Reference**: See [docs/en.md](docs/en.md) for available section types

### 3. Style Customization

- **Step 1**: Check if config supports it (e.g., `experienceStyles`)
- **Step 2**: If not, suggest CSS override in `src/index.css`
- **Step 3**: Only modify component code as last resort

### 4. New Feature Requests

- **Step 1**: Check if achievable via config
- **Step 2**: If not, propose CSS-based solution
- **Step 3**: If still not possible, create a coding plan with minimal changes

---

## Development Rules (Template Developer Mode)

When developing the template itself:

- Follow standard coding practices
- Maintain backward compatibility
- Add new config options before adding source code solutions
- Keep components flexible for config-driven customization

---

## Feature Request Workflow

1. **Identify**: Who is asking — template developer or end user?
2. **Analyze**: Can this be done via config?
3. **Guide**: If yes, direct user to their config file
4. **CSS First**: If style change needed, suggest `src/index.css` override
5. **Minimal Code**: Only if absolutely necessary, propose minimal source modification

---

## References

- Configuration documentation: [docs/en.md](docs/en.md)
- Chinese documentation: [docs/zh.md](docs/zh.md)
- Example configs: [examples/](examples/)
- Config schema: [lib/config.schema.json](lib/config.schema.json)
