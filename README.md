# 🎨 Portfolio Template

> [🇨🇳 中文版 README](./README.zh-CN.md)

A modern, responsive, and **configuration-driven** portfolio template. Designed for developers, researchers, and creators to showcase their work without writing code.

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)

## Highlights

- **Zero Code Required**: Manage all content via a single configuration file (`config.yml`, `config.json`, `config.ts`, …).
- **Highly Customizable**: Make customizations and add sections easily.
- **Fast & SEO Friendly**: Built with React & Vite, supporting Static Site Generation (SSG), built and loaded in seconds. (See [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-cheng-shang-me/n71ps5slz1?form_factor=desktop))
- **Multi-language**: Built-in i18n support.

## 🚀 Getting Started

### 1. Installation

Click the button below to use this template:

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=portfolio-template&template_owner=Mister-Hope)

```bash
# Clone your created repository
git clone https://github.com/your-username/your-repository.git
cd your-repository

# Install dependencies
pnpm ci
```

### 2. Configuration

This project is driven by a configuration file. You **do not** need to edit the source code in `src/`.

1. Copy an example config file from `examples/` to the root directory.

   ```bash
   cp examples/config.example.yml config.yml
   # or
   # cp examples/config.example.json config.json
   # or
   # cp examples/config.example.ts config.ts
   # or
   # cp examples/config.example.js config.js
   ```

2. Open the copied config file (e.g.: `config.yml`) and start adding your information! The shipped `lib/config.schema.json` (wired up in `.vscode/settings.json`) provides validation and autocomplete for `config.json`, `config.yml` and `config.yaml`.

Detailed guides on how to configure every section:

- [**English Configuration Guide**](./docs/en.md)
- [**中文配置指南**](./docs/zh.md)

### 3. Run Locally

```bash
pnpm run dev
```

Open <http://localhost:3000> to see your changes instantly.

## 📖 Documentation

- [English configuration guide](./docs/en.md)
- [中文配置指南](./docs/zh.md)

## 📦 Build & Deploy

To build for production:

```bash
pnpm run build
```

The output will be in the `dist/` folder, ready to deploy to Vercel, Netlify or any static host.

Run the build integration tests (builds every example config and asserts the prerendered output):

```bash
pnpm test
```

> [!NOTE]
> This template assumes the site is served from the **domain root**. If you deploy under a sub-path
> (for example a GitHub Pages project site at `https://<user>.github.io/<repository>/`), set the
> top-level `base` option in your config file to that path (e.g. `base: "/<repository>/"`). It is
> applied to built asset URLs, language links and config image paths. See
> [Deployment and base path](./docs/en.md#deployment-and-base-path).
>
> To emit `canonical`/`hreflang`/Open Graph/Twitter tags plus `sitemap.xml` and `robots.txt`, also
> set `siteUrl` to the public URL of the deployed site.

## 🛠️ Tech Stack (For Developers)

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- Iconify

## 📂 Project Structure

```text
.
├── config.yml          # <--- YOUR CONFIGURATION FILE
├── custom.css          # Optional custom styles (auto-injected at build time)
├── docs/               # Detailed documentation
├── examples/           # Example configurations
├── lib/                # Config schema and build-time loaders
├── public/             # Your static assets (images, pdfs)
├── src/                # Source code (Do not edit unless necessary)
└── ...
```
