// WordPress Author Type
export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

// Article and News Types
export interface Article {
  id: number;
  title: string;
  date: string;
  image: string;
  excerpt?: string;
  comments?: number;
  category?: string;
  content?: string;
  author?: WordPressAuthor;
}

// Featured Slider Types
export interface SlideData {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
}

export interface FeaturedSliderProps {
  slides?: SlideData[];
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdown?: NavigationDropdownItem[];
}

export interface NavigationDropdownItem {
  label: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: NavigationSubmenuItem[];
}

export interface NavigationSubmenuItem {
  label: string;
  href: string;
}

// Component Props Types
export interface HeaderProps {
  className?: string;
}

export interface HomepageProps {
  className?: string;
}

// Comment Types
export interface Comment {
  author: string;
  post: string;
  date?: string;
  email?: string;
}

// Common Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}