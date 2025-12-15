
# Content Block Components

The `contents` field in the main configuration is an array of component objects. Each object follows this general structure:

```ts
{
  type: string;   // The component identifier
  id: string;     // Unique identifier (used for navbar anchors)
  title: string;  // Section heading
  icon: string;   // FontAwesome class (e.g., 'fa-user-tie')
  data: any;      // Component-specific data
  config?: any;   // Component-specific display options
}
```

## Supported Components

### 1. Profile (`profile`)
Displays main affiliation, clickable contact info, and a list of interests.
- **Data Schema**:
  - `affiliation`: String (markdown supported).
  - `contact`: Array of `{ label: string, value: string }`.
  - `interests`: Array of strings.

### 2. Experience (`experience`)
A vertical timeline highlighting work history and academic background.
- **Data Schema**: Array of items:
  - `type`: `'study'` or `'work'`.
  - `place`: String.
  - `time`: String (e.g., '2021 - 2024').
  - `title`: String (markdown supported).
  - `content`: String (markdown supported).
  - `description`: String (markdown supported).
  - `icon`: Optional FontAwesome icon class.

### 3. Timeline / News (`timeline`)
A clean, horizontally-aligned list of events or news updates.
- **Data Schema**: Array of items:
  - `year`: String.
  - `content`: String (markdown supported).
  - `link`: Optional URL.
  - `linkText`: Optional label for the link.

### 4. Banner (`banner`)
A call-to-action block with high visual impact.
- **Data Schema**:
  - `subtitle`: String.
  - `content`: String (markdown supported).
  - `deadline`: Optional string.
  - `actions`: Array of `{ label: string, link: string, primary: boolean }`.

### 5. Cards (`cards`)
A grid of high-level cards for projects or dissertations.
- **Data Schema**: Array of items:
  - `title`: String (markdown supported).
  - `subtitle`: String (markdown supported).
  - `link`: URL.

### 6. List (`list`)
A versatile component for lists like Publications or Awards.
- **Config**:
  - `listType`: `'ul'` (bulleted) or `'ol'` (numbered).
  - `listStyle`: `'check'`, `'circle'`, `'square'`, or `'none'`.
- **Data Schema**: Array of items:
  - `text`: String (markdown supported).
  - `link`: Optional URL.

### 7. Gallery (`gallery`)
A masonry-style photo wall with an interactive lightbox.
- **Data Schema**: Array of items:
  - `url`: Image URL.
  - `title`: Image title.
  - `location`: Optional location string.
  - `date`: Optional date string.
  - `description`: Optional long-form story (markdown supported).
