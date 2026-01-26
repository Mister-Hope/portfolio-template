/**
 * Style configuration for experience types
 * 经历类型的样式配置
 */
export interface ExperienceTypeConfig {
  /**
   * Background class for the timeline node (e.g., "bg-indigo-600")
   * 时间轴节点的背景类名
   */
  bgClass: string;
  /**
   * Icon class for the timeline node (e.g., "fa-book-open")
   * 时间轴节点的图标类名
   */
  icon: string;
  /**
   * Background/Text class for the content icon box (e.g., "bg-indigo-50 text-indigo-600")
   * 内容图标框的背景/文本类名
   */
  iconClass: string;
}

export type ExperienceTypesConfig = Record<string, ExperienceTypeConfig>;

export const defaultExperienceTypes: ExperienceTypesConfig = {
  work: {
    bgClass: "bg-emerald-600",
    icon: "briefcase",
    iconClass: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  study: {
    bgClass: "bg-indigo-600",
    icon: "graduation-cap",
    iconClass: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  },
  volunteer: {
    bgClass: "bg-red-600",
    icon: "hand-holding-heart",
    iconClass: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  vacation: {
    bgClass: "bg-sky-500",
    icon: "umbrella-beach",
    iconClass: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  },
  project: {
    bgClass: "bg-purple-600",
    icon: "laptop-code",
    iconClass: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
};
