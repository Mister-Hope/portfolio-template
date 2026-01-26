import type { FooterProps } from "./components/Footer.js";
import type {
  BannerSection,
  CardsSection,
  Config,
  ExperienceSection,
  GallerySection,
  HeroConfig,
  ListSection,
  MarkdownSection,
  NavbarConfig,
  ProfileSection,
  Section,
  TimelineSection,
} from "./types/index.js";

/**
 * Helper function to define configuration with type safety
 * 定义配置的辅助函数，提供类型安全
 *
 * @param config - The configuration object to define
 * @returns The provided configuration object
 */
export const defineConfig = (config: Config): Config => config;

export const defineHeroConfig = (config: HeroConfig): HeroConfig => config;

export const defineNavbarConfig = (config: NavbarConfig): NavbarConfig => config;

export const defineSections = (config: Section[]): Section[] => config;

export const defineFooterConfig = (config: Partial<FooterProps>): Partial<FooterProps> => config;

export const defineProfileSection = (config: ProfileSection): ProfileSection => config;

export const defineExperienceSection = (config: ExperienceSection): ExperienceSection => config;

export const defineBannerSection = (config: BannerSection): BannerSection => config;

export const defineTimelineSection = (config: TimelineSection): TimelineSection => config;

export const defineCardsSection = (config: CardsSection): CardsSection => config;

export const defineListSection = (config: ListSection): ListSection => config;

export const defineGallerySection = (config: GallerySection): GallerySection => config;

export const defineMarkdownSection = (config: MarkdownSection): MarkdownSection => config;
