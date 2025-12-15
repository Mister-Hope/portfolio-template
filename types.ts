
export interface PortfolioMedia {
  icon: string;
  name: string;
  link: string;
}

export type ContentBlockType = 
  | 'profile' 
  | 'experience' 
  | 'banner' 
  | 'timeline' 
  | 'cards' 
  | 'list' 
  | 'gallery';

export interface ExperienceItem {
  type: 'study' | 'work';
  place: string;
  title?: string;
  time: string;
  content?: string;
  description?: string;
  icon?: string;
}

export interface CardItem {
  title: string;
  subtitle: string;
  link: string;
  description?: string;
}

export interface TimelineItem {
  year: string;
  content: string;
  link?: string;
  linkText?: string;
}

export interface ListItem {
  text: string;
  link?: string;
}

export interface GalleryItem {
  url: string;
  title: string;
  location?: string;
  date?: string;
  description?: string;
}

export interface ContentBlock {
  type: ContentBlockType;
  id: string;
  title: string;
  icon?: string;
  subtitle?: string;
  data?: any;
  config?: {
    listType?: 'ul' | 'ol';
    listStyle?: 'circle' | 'square' | 'check' | 'none';
    columns?: number;
    accentColor?: string;
  };
}

export interface NavLink {
  label: string;
  anchor: string;
}

export interface Config {
  name: string;
  welcome: string;
  titles: string[];
  avatar: string;
  bgImage: string;
  medias: PortfolioMedia[];
  contents: ContentBlock[];
  footer: string;
  navbar?: {
    links: NavLink[];
  };
}
