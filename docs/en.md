# Global Configuration Guide

The application is controlled by a single configuration object.

## 🚀 Quick Start

1. Copy an example config from `examples/` to the root directory (e.g., `cp examples/config.example.yml config.yml`).
2. Edit `config.yml` to customize your portfolio.

Supported configuration formats: `config.ts`, `config.js`, `config.json`, `config.yml`, `config.yaml`.

## Configuration

The configuration file exports a `Config` object by default, containing the following fields:

- `locales`:
  - Type: `Record<string, LocaleConfig>`
  - Details: Multi-language configuration map. Keys are path prefixes (e.g., `"/"`, `"/zh/"`), and values are `LocaleConfig` object

- `config`：
  - Type: `GlobalConfig` (optional)
  - Details: Global configuration.

## Global Config Object

The optional `config` object contains the following fields:

- `experienceTypes`:
  - Type: `Record<string, ExperienceTypeConfig>` (optional).
  - Details:
    Customize types for experience component. Keys are type identifiers, and values are `ExperienceTypeConfig` objects with:
    - `bgClass`: String. Background class for the timeline node (e.g., "bg-indigo-600").
    - `icon`: String. Icon name for the timeline node (e.g., "mdi:briefcase").
    - `iconClass`: String. Icon class for the timeline node (e.g., "text-white").

## Locale Configuration

- `locales` entry:
  - Type: Object
  - Details: Language configuration mapping used by the app. Each entry contains fields described below.

  - `lang`:
    - Type: String
    - Details: Language code (e.g., "en", "zh-CN").

  - `langName`:
    - Type: String (optional)
    - Details: Language display name (e.g., "English", "简体中文").

  - `title`:
    - Type: String (optional)
    - Details: Website title shown in the document title and header.

  - `description`:
    - Type: String (optional)
    - Details: Meta description for SEO and social previews.

  - `hero`:
    - Type: Object
    - Details: Hero section configuration (see `Hero Section` below).

  - `navbar`:
    - Type: Object (optional)
    - Details: Navigation bar configuration (see `Navigation Bar` below).

  - `sections`:
    - Type: Array
    - Details: Main content sections for the locale. Each item is a section object (see `Content Blocks`).

  - `footer`:
    - Type: Object (optional)
    - Details: Footer configuration (see `Footer` below).

  - `ui`:
    - Type: Object (optional)
    - Details: UI translation strings.
    - `themeToggle`:
      - Type: String (optional)
      - Details: Tooltip text for the theme toggle control.
    - `contacts`:
      - Type: String (optional)
      - Details: Label for the contact section.
    - `details`:
      - Type: String
      - Details: Label for the detail link.

## Hero Section (`hero`)

- `hero`:
  - Type: Object
  - Details: Top hero configuration for the locale.

  - `name`:
    - Type: String
    - Details: The user's name displayed prominently.

  - `welcome`:
    - Type: String
    - Details: Short welcome or intro text (e.g., "👋 Hi, I am").

  - `titles`:
    - Type: `Array<string>`
    - Details: Titles for the typewriter animation under the name.

  - `avatar`:
    - Type: `string | { light: string; dark: string }`
    - Details: URL to the avatar image (relative to `public/` or absolute) or an object with light/dark mode URLs.

  - `bgImage`:
    - Type: `string | { light: string; dark: string }`
    - Details: Background image URL for the hero header or an object with light/dark mode URLs.

  - `medias`:
    - Type: `Array<HeroMedia>` (optional)
    - Details: Social / contact links.
      - `icon`:
        - Type: String
        - Details: Icon name (Iconify or FontAwesome) or image URL.
      - `name`:
        - Type: String
        - Details: Display name for the media item.
      - `link`:
        - Type: String
        - Details: URL for the media item.

## Navigation Bar (`navbar`)

- `navbar`:
  - Type: Object (optional)
  - Details: Sticky navigation bar configuration for the locale.

  - `links`:
    - Type: `Array<NavLink>`
    - Details: Navigation links.
      - `label`:
        - Type: String
        - Details: Display label shown in the navbar.
      - `anchor`:
        - Type: String
        - Details: Target content block id (prefixed with `#`, e.g., `#profile`).

## Content Blocks (`sections`)

- `sections`:
  - Type: Array
  - Details: Main sections for the page. Each item is a section object with the following fields:

  - `type`:
    - Type: String
    - Details: Component identifier (e.g., 'profile', 'experience', 'cards').

  - `id`:
    - Type: String
    - Details: Unique id used for navigation anchors.

  - `title`:
    - Type: String
    - Details: Section heading shown on the page.

  - `icon`:
    - Type: String (optional)
    - Details: Icon class for the section header.

  - `data`:
    - Type: Any
    - Details: Component-specific payload. See each component type below for schema.

## Supported Components

- `profile` (type: `profile`):
  - Type: Component
  - Details: Personal information section.

  - `data`:
    - `fields`:
      - Type: `Array<ProfileField>` (optional)
      - Details: Custom fields such as location, skills, etc.
        - `title`:
          - Type: String
          - Details: Field label.
        - `value`:
          - Type: `string | Array<string>`
          - Details: Field value (markdown supported or tag list).
        - `icon`:
          - Type: String (optional)
          - Details: Icon name for the field.

    - `contacts`:
      - Type: `Array<ProfileContactItem>` (optional)
      - Details: Contact entries.
        - `label`:
          - Type: String
          - Details: Contact label (e.g., 'Email').
        - `value`:
          - Type: String
          - Details: Contact value (email, phone, etc.).
        - `link`:
          - Type: String (optional)
          - Details: Explicit URL; if omitted email addresses are auto-detected.
        - `icon`:
          - Type: String (optional)
          - Details: Icon name.

    - `slogan`:
      - Type: String (optional)
      - Details: Personal motto (markdown supported).

- `experience` (type: `experience`):
  - Type: Component
  - Details: Vertical timeline for work, study, volunteer, project entries.

  - `data`: `Array<ExperienceItem>`
    - Item schema (ExperienceItem):
      - `type`:
        - Type: String
        - Details: Experience category (built-in 'study' | 'work' | 'volunteer', or custom).
      - `place`:
        - Type: String
        - Details: Institution or company name.
      - `title`:
        - Type: String (optional)
        - Details: Role or degree.
      - `time`:
        - Type: String
        - Details: Time period (e.g., '2021 - 2024').
      - `content`:
        - Type: String (optional)
        - Details: Main content (markdown supported).
      - `description`:
        - Type: String (optional)
        - Details: Additional details or long description.
      - `icon`:
        - Type: String (optional)
        - Details: Override icon for the timeline node.

- `banner` (type: `banner`):
  - Type: Component
  - Details: High-impact call-to-action block.

  - `data`:
    - `header`:
      - Type: String (optional)
      - Details: Banner header text.

    - `tags` :
      - Type: `string | string[]` (optional)
      - Details: Tag or tag list displayed above the header.

    - `content`:
      - Type: String (optional)
      - Details: Main content (markdown supported).

    - `footer`:
      - Type: String (optional)
      - Details: Footer text displayed below content.

    - `actions`:
      - Type: `Array<BannerAction>` (optional)
      - Details: Action buttons.
        - `label`:
          - Type: String
          - Details: Button label.
        - `link`:
          - Type: String
          - Details: Target URL.
        - `primary`:
          - Type: Boolean (optional)
          - Details: Use emphasized style when true.

- `timeline` (type: `timeline`):
  - Type: Component
  - Details: Horizontal timeline or news list.

  - `data`: `Array<TimelineItem>`
    - Item schema:
      - `year`:
        - Type: `string | number`
        - Details: Year or date string.
      - `content`:
        - Type: String
        - Details: Event description (markdown supported).
      - `link`:
        - Type: String (optional)
        - Details: URL associated with the event.
      - `linkText`:
        - Type: String (optional)
        - Details: Link label to show.

- `cards` (type: `cards`):
  - Type: Component
  - Details: Grid layout for project or work cards.

  - `data`: `Array<CardItem>`
    - Card schema:
      - `title`:
        - Type: String
        - Details: Card title.
      - `logo`:
        - Type: `string | { light: string; dark: string }` (optional)
        - Details: Logo URL or object with light/dark mode URLs.
      - `category`:
        - Type: String (optional)
        - Details: Category label.
      - `description`:
        - Type: String (optional)
        - Details: Card description.
      - `actions`:
        - Type: `Array<CardAction>` (optional)
        - Details: Action buttons
          - `text`:
            - Type: String
            - Details: Button label.
          - `link`:
            - Type: String (optional)
            - Details: Action link.
          - `icon`:
            - Type: String (optional)
            - Details: Icon name for the action.

- `list` (type: `list`):
  - Type: Component
  - Details: Flexible list for publications, awards, etc.

  - `dot`:
    - Type: String (optional)
    - Details: Marker style ('circle', 'square', 'diamond', 'check', 'none', 'number'). Default: 'number'.

  - `data`: `Array<ListItem | string>`
    - Item schema:
      - String:
        - Type: String
        - Details: Markdown-supported content.
      - Object:
        - `text`:
          - Type: String
          - Details: Content text (markdown supported).
        - `link`:
          - Type: String (optional)
          - Details: Optional URL for the list item.

- `gallery` (type: `gallery`):
  - Type: Component
  - Details: Masonry photo wall with lightbox.

  - `data`: `Array<GalleryItem>`
    - Item schema (GalleryItem):
      - `url`:
        - Type: String
        - Details: Image URL.
      - `title`:
        - Type: String
        - Details: Image title.
      - `location`:
        - Type: String (optional)
        - Details: Location metadata.
      - `date`:
        - Type: `string | number` (optional)
        - Details: Date metadata.
      - `description`:
        - Type: String (optional)
        - Details: Long-form story (markdown supported).

- `markdown` (type: `markdown`):
  - Type: Component
  - Details: Simple Markdown/HTML content block.

  - `data`:
    - `content`:
      - Type: String
      - Details: Text content (Markdown or HTML supported).
    - `card`:
      - Type: Boolean (optional)
      - Details: Whether to render the paragraph as a card (default: false).

## Footer (`footer`)

- `footer`:
  - Type: Object
  - Details: Footer configuration for the locale.

  - `copyright`:
    - Type: String
    - Details: Copyright text.
  - `description`:
    - Type: String (optional)
    - Details: Footer description or short blurb.

## Image and icons

You can always use a full URL for icons and images (e.g., `https://example.com/icon.png`), or a relative path to the `public/` directory starting with `/` (e.g., `/images/icon.png` for `public/images/icon.png`).

We support all icon name from [iconify](https://iconify.design/), and you can either use FontAwesome 7 solid icons directly with its name (e.g.: `book` for `fa7-solid:book`), or use the full icon name (e.g., `mdi:github`).

## Customizing Theme Colors

The project's theme colors are defined via CSS variables, and the system automatically generates a complete color palette based on the base colors.

You can modify the following variables in `src/index.css` to change the theme colors:

```css
:root {
  /**
   * Define your default font family here.
   */
  --font:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 
    Define your brand colors here. 
    The system will automatically generate the palette based on these colors.
  */
  --primary-base: #3b82f6; /* Primary color (Default Blue) */
  --secondary-base: #6366f1; /* Secondary color (Default Indigo) */
}
```

After modification, Tailwind CSS will automatically generate the corresponding color scales from `primary-50` to `primary-950` and `secondary-50` to `secondary-950`.
