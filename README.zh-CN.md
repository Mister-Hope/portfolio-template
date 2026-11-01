# 🎨 作品集模板

一个现代、响应式且**配置驱动**的作品集模板。专为开发者、研究人员和创作者设计，无需编写代码即可展示你的作品。

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_name=portfolio-template&template_owner=Mister-Hope)

## 特色

- **零代码要求**：通过单个配置文件（`config.yml`、`config.json`、`config.ts` 等）管理所有内容。
- **高度可定制**：轻松进行自定义病添加章节
- **快速且 SEO 友好**：基于 React 和 Vite 构建，支持静态站点生成（SSG），秒级构建与加载。（参见 [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-cheng-shang-me/n71ps5slz1?form_factor=desktop)）
- **多语言支持**：内置国际化支持。

## 🚀 快速开始

### 1. 安装

```bash
# 克隆你创建的仓库
git clone https://github.com/your-username/your-repository.git
cd your-repository

# 安装依赖
pnpm ci
```

### 2. 配置

本项目由配置文件驱动。你**不需要**编辑 `src/` 中的源代码。

1. 从 `examples/` 复制一个示例配置文件到根目录。

   ```bash
   cp examples/config.example.yml config.yml
   # 或
   # cp examples/config.example.json config.json
   # 或
   # cp examples/config.example.ts config.ts
   # 或
   # cp examples/config.example.js config.js
   ```

2. 打开复制的配置文件（例如：`config.yml`）并开始添加你的信息！仓库自带的 `lib/config.schema.json`（已在 `.vscode/settings.json` 中配置）可为 `config.json`、`config.yml`、`config.yaml` 提供校验与自动补全。

关于如何配置每个部分的详细指南：

- [**English Configuration Guide**](./docs/en.md)
- [**中文配置指南**](./docs/zh.md)

### 3. 本地运行

```bash
pnpm run dev
```

打开 <http://localhost:3000> 即可实时查看更改。

## 📖 文档

- [English configuration guide](./docs/en.md)
- [中文配置指南](./docs/zh.md)

## 📦 构建与部署

生产环境构建：

```bash
pnpm run build
```

输出文件将位于 `dist/` 文件夹中，可随时部署到 Vercel、Netlify 或任意静态托管服务。

运行构建集成测试（会构建四种示例配置并校验预渲染结果）：

```bash
pnpm test
```

> [!NOTE]
> 模板默认假设站点部署在**域名根路径**。如果部署在子路径（例如 GitHub Pages 项目页
> `https://<user>.github.io/<repository>/`），请把配置文件中的顶层 `base` 选项设为该子路径
> （例如 `base: "/<repository>/"`）。它会作用于构建产物资源 URL、语言切换链接与配置中的图片路径。
> 详见 [部署与 base 路径](./docs/zh.md#部署与-base-路径)。
>
> 若要生成 `canonical` / `hreflang` / Open Graph / Twitter 标签以及 `sitemap.xml` 与 `robots.txt`，
> 还需把 `siteUrl` 设为站点的公开 URL。构建会自动生成 base-aware 的 `404.html`，
> 也可在配置中覆盖 `favicon`/`ogImage`。

## 🛠️ 技术栈（面向开发者）

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- Iconify

## 📂 项目结构

```text
.
├── config.yml          # <--- 你的配置文件
├── custom.css          # 可选的自定义样式（构建时自动注入）
├── docs/               # 详细文档
├── examples/           # 示例配置
├── lib/                # 配置 Schema 与构建期加载器
├── public/             # 你的静态资源（图片、PDF）
├── src/                # 源代码（除非必要，请勿编辑）
└── ...
```

## 📄 许可

[MIT](./LICENSE) © [Mister-Hope](https://github.com/Mister-Hope)
