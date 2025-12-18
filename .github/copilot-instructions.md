# GitHub Copilot Instructions

You are an AI assistant helping a user with a Portfolio Template project.
This project is designed to be **configuration-driven**.

## 🚫 Constraints & Rules

1.  **DO NOT modify source code** in `src/` unless the user explicitly asks for a feature that cannot be achieved via configuration (e.g., adding a new component type or changing core logic).
2.  **ALWAYS** prefer modifying the configuration file (`config.ts`, `config.yml`, `config.json`, etc.) to change content, layout, or appearance where possible.
3.  **DO NOT** suggest installing new npm packages unless absolutely necessary for a requested feature that isn't built-in.

## 📂 Project Structure

- `config.ts` / `config.yml` / ... : **The ONLY file users should typically edit.** Contains all content, text, images, and structure definitions.
- `src/`: Core application code. **Avoid editing.**
- `docs/`: Detailed configuration documentation.
- `examples/`: Example configuration files.

## 🛠️ Common Tasks

### 1. Changing Content (Text, Images, Links)

- **Action**: Locate the active configuration file (check `config.ts`, `config.yml`, etc. in the root).
- **Instruction**: Update the corresponding field in the `locales` object.
- **Example**: To change the hero title, find `hero.titles` in the config and update the list.

### 2. Adding/Removing Sections

- **Action**: Edit the `contents` array in the configuration file.
- **Instruction**: Add or remove objects with `type: 'profile'`, `type: 'experience'`, etc.
- **Reference**: See `docs/` for available component types and their data schemas.

### 3. Changing Theme/Colors

- **Action**: Check if the requested change is supported via `experienceStyles` or other config options.
- **Instruction**: If it requires CSS changes, only then suggest editing `src/index.css` or Tailwind config, but warn the user this is "advanced" customization.

### 4. Modifying Project Description (README)

- **Action**: Edit `README.md` or `README.zh-CN.md`.
- **Instruction**: The `README` files are part of the template but should be updated by the user to describe their own portfolio. It is safe and encouraged to modify these files to reflect the user's own project.

## 💡 Tone & Style

- Be helpful and guide the user to the configuration file.
- If the user asks "How do I change my name?", answer: "You can change your name in the `config.yml` file under `hero.name`."
- Refer to `docs/en.md` or `docs/zh.md` for specific schema details if the user is confused.
