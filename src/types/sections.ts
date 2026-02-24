import type { BannerProps } from "../components/Banner.js";
import type { CardItem } from "../components/Cards.js";
import type { ExperienceItem } from "../components/ExperienceItem.js";
import type { GalleryItem } from "../components/GalleryCard.js";
import type { ListItem, ListProps } from "../components/List.js";
import type { MarkdownProps } from "../components/Markdown.js";
import type { ProfileData } from "../components/Profile.js";
import type { SectionBase } from "../components/SectionWrapper.js";
import type { TimelineItem, TimelineProps } from "../components/Timeline.js";

/**
 * Supported Section types
 * 支持的章节类型
 */
export type SectionType =
  | "profile"
  | "experience"
  | "banner"
  | "timeline"
  | "cards"
  | "list"
  | "gallery"
  | "markdown";

export interface ProfileSection extends SectionBase {
  type: "profile";
  data: ProfileData;
}

export interface ExperienceSection extends SectionBase {
  type: "experience";
  data: ExperienceItem[];
}

export interface BannerSection extends SectionBase {
  type: "banner";
  data: BannerProps;
}

export interface TimelineSection extends SectionBase, Omit<TimelineProps, "items"> {
  type: "timeline";
  data: TimelineItem[];
}

export interface CardsSection extends SectionBase {
  type: "cards";
  data: CardItem[];
}

export interface ListSection extends SectionBase, Omit<ListProps, "items"> {
  type: "list";
  data: (ListItem | string)[];
}

export interface GallerySection extends SectionBase {
  type: "gallery";
  data: GalleryItem[];
}

export interface MarkdownSection extends SectionBase {
  type: "markdown";
  data: MarkdownProps;
}

/**
 * Configuration for a Section block
 * 内容块配置
 */
export type Section =
  | MarkdownSection
  | ListSection
  | BannerSection
  | CardsSection
  | TimelineSection
  | ProfileSection
  | ExperienceSection
  | GallerySection;
