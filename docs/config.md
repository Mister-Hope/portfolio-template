
# Global Configuration Guide

The application is controlled by a single configuration object (defined in `config.ts`).

## Top-Level Fields

- `name`: String. The primary name shown in the header and navbar.
- `welcome`: String. The welcome message shown above the name in the header (e.g., "👋 Hi there, I am").
- `titles`: Array of strings. Animated titles shown under the name using a typewriter effect.
- `avatar`: URL. Profile picture.
- `bgImage`: URL. Full-screen background image for the header.
- `medias`: Array of `PortfolioMedia`. Social media or contact links.
  - `icon`: FontAwesome class (e.g., 'fa-brands fa-google').
  - `name`: Display name.
  - `link`: URL (or `mailto:`).
- `footer`: String. Markdown-supported text for the footer.

## Navigation Bar (`navbar`)

The sticky navbar configuration.
- `links`: Array of `NavLink`.
  - `label`: Localized text for the link.
  - `anchor`: The `id` of the target content block (prefixed with `#`, e.g., `#profile`).

## Content Blocks (`contents`)

This is the core of the portfolio. It is an array of component configurations.
**For detailed configuration of each block, see [components.md](./components.md).**

Example:
```ts
contents: [
  {
    type: "profile",
    id: "profile",
    title: "Profile",
    icon: "fa-user-tie",
    data: { ... }
  },
  {
    type: "experience",
    id: "education",
    title: "Education",
    ...
  }
]
```
