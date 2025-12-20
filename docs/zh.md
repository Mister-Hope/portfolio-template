# 全局配置指南

应用程序由单个配置对象控制。

## 🚀 快速开始

1. 从 `examples/` 复制一个示例配置文件到根目录（例如 `cp examples/config.example.yml config.yml`）。
2. 编辑 `config.yml` 以自定义您的作品集。

支持的配置文件格式：`config.ts`, `config.js`, `config.json`, `config.yml`, `config.yaml`。

## 配置结构

配置文件默认导出一个 `Config` 对象，包含以下字段：

- `locales`:
  - 类型: `Record<string, LocaleConfig>`
  - 详情: 多语言配置映射。键是路径前缀 (例如 `"/"`, `"/zh/"`)，值是 `LocaleConfig` 对象。

- `config`:
  - 类型: `GlobalConfig` (可选)
  - 详情: 全局配置。

## 全局配置对象 (`GlobalConfig`)

可选的 `config` 对象包含以下字段：

- `experienceTypes`:
  - 类型: `Record<string, ExperienceTypeConfig>` (可选).
  - 详情:
    自定义经历组件的类型。键是类型标识符，值是包含以下字段的 `ExperienceTypeConfig` 对象：
    - `bgClass`: 字符串。时间轴节点的背景类名 (例如 "bg-indigo-600")。
    - `icon`: 字符串。时间轴节点的图标名称 (例如 "mdi:briefcase")。
    - `iconClass`: 字符串。时间轴节点的图标类名 (例如 "text-white")。

## 多语言配置 (`LocaleConfig`)

- `locales` 条目:
  - 类型: 对象 (Object)
  - 详情: 应用程序使用的语言配置映射。每个条目包含以下字段。

  - `lang`:
    - 类型: 字符串 (String)
    - 详情: 语言代码 (例如 "en", "zh-CN")。

  - `langName`:
    - 类型: 字符串 (String) (可选)
    - 详情: 语言显示名称 (例如 "English", "简体中文")。

  - `title`:
    - 类型: 字符串 (String) (可选)
    - 详情: 在文档标题和页眉中显示的网站标题。

  - `description`:
    - 类型: 字符串 (String) (可选)
    - 详情: 用于 SEO 和社交预览的元描述。

  - `hero`:
    - 类型: 对象 (Object)
    - 详情: 首屏区域配置 (见下文 `首屏区域`)。

  - `navbar`:
    - 类型: 对象 (Object) (可选)
    - 详情: 导航栏配置 (见下文 `导航栏`)。

  - `sections`:
    - 类型: 数组 (Array)
    - 详情: 语言的主要内容章节。每个项目都是一个章节对象 (见 `内容块`)。

  - `footer`:
    - 类型: 对象 (Object) (可选)
    - 详情: 页脚配置 (见下文 `页脚`)。

  - `ui`:
    - 类型: 对象 (Object) (可选)
    - 详情: 界面翻译字符串。
    - `themeToggle`:
      - 类型: 字符串 (String) (可选)
      - 详情: 主题切换控件的提示文本。
    - `contacts`:
      - 类型: 字符串 (String) (可选)
      - 详情: 联系方式章节的标签。
    - `details`:
      - 类型: 字符串 (String)
      - 详情: 详情链接的标签。

## 首屏区域 (`hero`)

- `hero`:
  - 类型: 对象 (Object)
  - 详情: 语言的顶部首屏配置。

  - `name`:
    - 类型: 字符串 (String)
    - 详情: 显著显示的用户姓名。

  - `welcome`:
    - 类型: 字符串 (String)
    - 详情: 简短的欢迎或介绍文本 (例如 "👋 你好，我是")。

  - `titles`:
    - 类型: `Array<string>`
    - 详情: 姓名下方打字机动画的头衔。

  - `avatar`:
    - 类型: `string | { light: string; dark: string }`
    - 详情: 头像图片的 URL (相对于 `public/` 或绝对路径) 或包含浅色/深色模式 URL 的对象。

  - `bgImage`:
    - 类型: `string | { light: string; dark: string }`
    - 详情: 首屏页眉的背景图片 URL 或包含浅色/深色模式 URL 的对象。

  - `medias`:
    - 类型: `Array<HeroMedia>` (可选)
    - 详情: 社交 / 联系链接。
      - `icon`:
        - 类型: 字符串 (String)
        - 详情: 图标名称 (Iconify 或 FontAwesome) 或图片 URL。
      - `name`:
        - 类型: 字符串 (String)
        - 详情: 媒体项目的显示名称。
      - `link`:
        - 类型: 字符串 (String)
        - 详情: 媒体项目的 URL。

## 导航栏 (`navbar`)

- `navbar`:
  - 类型: 对象 (Object) (可选)
  - 详情: 语言的粘性导航栏配置。

  - `links`:
    - 类型: `Array<NavLink>`
    - 详情: 导航链接。
      - `label`:
        - 类型: 字符串 (String)
        - 详情: 导航栏中显示的标签。
      - `anchor`:
        - 类型: 字符串 (String)
        - 详情: 目标内容块 id (带 `#` 前缀，例如 `#profile`)。

## 内容块 (`sections`)

- `sections`:
  - 类型: 数组 (Array)
  - 详情: 页面的主要章节。每个项目都是一个具有以下字段的章节对象：

  - `type`:
    - 类型: 字符串 (String)
    - 详情: 组件标识符 (例如 'profile', 'experience', 'cards')。

  - `id`:
    - 类型: 字符串 (String)
    - 详情: 用于导航锚点的唯一 id。

  - `title`:
    - 类型: 字符串 (String)
    - 详情: 页面上显示的章节标题。

  - `icon`:
    - 类型: 字符串 (String) (可选)
    - 详情: 章节页眉的图标类名。

  - `data`:
    - 类型: 任意 (Any)
    - 详情: 组件特定负载。有关架构，请参见下面的每个组件类型。

## 支持的组件

- `profile` (类型: `profile`):
  - 类型: 组件 (Component)
  - 详情: 个人信息章节。

  - `data`:
    - `fields`:
      - 类型: `Array<ProfileField>` (可选)
      - 详情: 自定义字段，如位置、技能等。
        - `title`:
          - 类型: 字符串 (String)
          - 详情: 字段标签。
        - `value`:
          - 类型: `string | Array<string>`
          - 详情: 字段值 (支持 markdown 或标签列表)。
        - `icon`:
          - 类型: 字符串 (String) (可选)
          - 详情: 字段的图标名称。

    - `contacts`:
      - 类型: `Array<ProfileContactItem>` (可选)
      - 详情: 联系条目。
        - `label`:
          - 类型: 字符串 (String)
          - 详情: 联系标签 (例如 'Email')。
        - `value`:
          - 类型: 字符串 (String)
          - 详情: 联系值 (电子邮件、电话等)。
        - `link`:
          - 类型: 字符串 (String) (可选)
          - 详情: 显式 URL；如果省略，将自动检测电子邮件地址。
        - `icon`:
          - 类型: 字符串 (String) (可选)
          - 详情: 图标名称。

    - `slogan`:
      - 类型: 字符串 (String) (可选)
      - 详情: 个人座右铭 (支持 markdown)。

- `experience` (类型: `experience`):
  - 类型: 组件 (Component)
  - 详情: 工作、学习、志愿者、项目条目的垂直时间轴。

  - `data`: `Array<ExperienceItem>`
    - 项目架构 (ExperienceItem):
      - `type`:
        - 类型: 字符串 (String)
        - 详情: 经历类别 (内置 'study' | 'work' | 'volunteer'，或自定义)。
      - `place`:
        - 类型: 字符串 (String)
        - 详情: 机构或公司名称。
      - `title`:
        - 类型: 字符串 (String) (可选)
        - 详情: 职位或学位。
      - `time`:
        - 类型: 字符串 (String)
        - 详情: 时间段 (例如 '2021 - 2024')。
      - `content`:
        - 类型: 字符串 (String) (可选)
        - 详情: 主要内容 (支持 markdown)。
      - `description`:
        - 类型: 字符串 (String) (可选)
        - 详情: 额外细节或详细描述。
      - `icon`:
        - 类型: 字符串 (String) (可选)
        - 详情: 时间轴节点的覆盖图标。

- `banner` (类型: `banner`):
  - 类型: 组件 (Component)
  - 详情: 具有视觉冲击力的号召性用语块。

  - `data`:
    - `header`:
      - 类型: 字符串 (String) (可选)
      - 详情: 横幅标题文本。

    - `tags` :
      - 类型: `string | string[]` (可选)
      - 详情: 显示在标题上方的标签或标签列表。

    - `content`:
      - 类型: 字符串 (String) (可选)
      - 详情: 主要内容 (支持 markdown)。

    - `footer`:
      - 类型: 字符串 (String) (可选)
      - 详情: 显示在内容下方的页脚文本。

    - `actions`:
      - 类型: `Array<BannerAction>` (可选)
      - 详情: 操作按钮。
        - `label`:
          - 类型: 字符串 (String)
          - 详情: 按钮标签。
        - `link`:
          - 类型: 字符串 (String)
          - 详情: 目标 URL。
        - `primary`:
          - 类型: 布尔值 (Boolean) (可选)
          - 详情: 为 true 时使用强调样式。

- `timeline` (类型: `timeline`):
  - 类型: 组件 (Component)
  - 详情: 水平时间轴或新闻列表。

  - `data`: `Array<TimelineItem>`
    - 项目架构:
      - `year`:
        - 类型: `string | number`
        - 详情: 年份或日期字符串。
      - `content`:
        - 类型: 字符串 (String)
        - 详情: 事件描述 (支持 markdown)。
      - `link`:
        - 类型: 字符串 (String) (可选)
        - 详情: 与事件关联的 URL。
      - `linkText`:
        - 类型: 字符串 (String) (可选)
        - 详情: 要显示的链接标签。

- `cards` (类型: `cards`):
  - 类型: 组件 (Component)
  - 详情: 项目或工作卡片的网格布局。

  - `data`: `Array<CardItem>`
    - 卡片架构:
      - `title`:
        - 类型: 字符串 (String)
        - 详情: 卡片标题。
      - `logo`:
        - 类型: `string | { light: string; dark: string }` (可选)
        - 详情: Logo URL 或包含浅色/深色模式 URL 的对象。
      - `category`:
        - 类型: 字符串 (String) (可选)
        - 详情: 类别标签。
      - `description`:
        - 类型: 字符串 (String) (可选)
        - 详情: 卡片描述。
      - `actions`:
        - 类型: `Array<CardAction>` (可选)
        - 详情: 操作按钮
          - `text`:
            - 类型: 字符串 (String)
            - 详情: 按钮标签。
          - `link`:
            - 类型: 字符串 (String) (可选)
            - 详情: 操作链接。
          - `icon`:
            - 类型: 字符串 (String) (可选)
            - 详情: 操作按钮的图标名称。

- `list` (类型: `list`):
  - 类型: 组件 (Component)
  - 详情: 用于出版物、奖项等的灵活列表。

  - `dot`:
    - 类型: 字符串 (String) (可选)
    - 详情: 标记样式 ('circle', 'square', 'diamond', 'check', 'none', 'number')。默认值: 'number'。

  - `data`: `Array<ListItem | string>`
    - 项目架构:
      - 字符串:
        - 类型: 字符串 (String)
        - 详情: 支持 markdown 的内容。
      - 对象:
        - `text`:
          - 类型: 字符串 (String)
          - 详情: 内容文本 (支持 markdown)。
        - `link`:
          - 类型: 字符串 (String) (可选)
          - 详情: 列表项的可选 URL。

- `gallery` (类型: `gallery`):
  - 类型: 组件 (Component)
  - 详情: 带有灯箱的瀑布流照片墙。

  - `data`: `Array<GalleryItem>`
    - 项目架构 (GalleryItem):
      - `url`:
        - 类型: 字符串 (String)
        - 详情: 图片 URL。
      - `title`:
        - 类型: 字符串 (String)
        - 详情: 图片标题。
      - `location`:
        - 类型: 字符串 (String) (可选)
        - 详情: 位置元数据。
      - `date`:
        - 类型: `string | number` (可选)
        - 详情: 日期元数据。
      - `description`:
        - 类型: 字符串 (String) (可选)
        - 详情: 长篇故事 (支持 markdown)。

- `markdown` (类型: `markdown`):
  - 类型: 组件 (Component)
  - 详情: 简单的 Markdown/HTML 内容块。

  - `data`:
    - `content`:
      - 类型: 字符串 (String)
      - 详情: 文本内容 (支持 Markdown 或 HTML)。
    - `card`:
      - 类型: 布尔值 (Boolean) (可选)
      - 详情: 是否将段落渲染为卡片 (默认值: false)。

## 页脚 (`footer`)

- `footer`:
  - 类型: 对象 (Object)
  - 详情: 语言的页脚配置。

  - `copyright`:
    - 类型: 字符串 (String)
    - 详情: 版权文本。
  - `description`:
    - 类型: 字符串 (String) (可选)
    - 详情: 页脚描述或简短介绍。

## 图片和图标

您可以始终为图标和图片使用完整 URL (例如 `https://example.com/icon.png`)，或相对于 `public/` 目录的路径 (例如 `/images/icon.png` 对应 `public/images/icon.png`)。

我们支持来自 [iconify](https://iconify.design/) 的所有图标名称，您可以直接使用 FontAwesome 7 实心图标名称 (例如 `book` 对应 `fa7-solid:book`)，或使用完整的图标名称 (例如 `mdi:github`)。

## 自定义主题色

项目的主题色通过 CSS 变量定义，系统会自动根据基础色生成完整的色板。

你可以在 `src/index.css` 文件中修改以下变量来改变主题色：

```css
:root {
  /* 
    在此处定义你的品牌颜色。
    系统将根据这些颜色自动生成调色板。
  */
  --primary-base: #3b82f6; /* 主色调 (默认蓝色) */
  --secondary-base: #6366f1; /* 次要色调 (默认靛青色) */
}
```

修改后，Tailwind CSS 会自动生成对应的 `primary-50` 到 `primary-950` 以及 `secondary-50` 到 `secondary-950` 的色阶。
