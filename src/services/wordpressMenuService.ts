interface WordPressMenuItem {
  id: number;
  title: {
    rendered: string;
  };
  status: string;
  url: string;
  parent: number;
  menu_order: number;
  type: string;
  type_label: string;
  object: string;
  object_id: number;
}

interface ParsedMenuItem {
  id: number;
  label: string;
  href: string;
  hasDropdown: boolean;
  submenu?: ParsedMenuItem[];
}

interface MenuStructure {
  mainItems: ParsedMenuItem[];
}

class WordPressMenuService {
  private readonly API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';
  private readonly AUTH_HEADER: string;

  constructor() {
    // Using application password authentication
    const username = 'oliverwen.sydney@gmail.com';
    const appPassword = 'UDCX Qq5E aCls lusr d9BM LZ0Q';
    this.AUTH_HEADER = 'Basic ' + btoa(`${username}:${appPassword}`);
  }

  async fetchMenuItems(): Promise<WordPressMenuItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('WordPress menu request timeout after 15 seconds');
        controller.abort();
      }, 15000); // Increased to 15 seconds

      const response = await fetch(`${this.API_BASE}/menu-items`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('WordPress menu request was aborted (timeout or cancelled)');
        } else {
          console.error('Error fetching WordPress menu items:', error.message);
        }
      } else {
        console.error('Unknown error fetching WordPress menu items:', error);
      }
      throw error;
    }
  }

  private buildMenuHierarchy(items: WordPressMenuItem[]): ParsedMenuItem[] {
    const itemMap = new Map<number, ParsedMenuItem>();
    const rootItems: ParsedMenuItem[] = [];

    // First pass: create all items
    items
      .sort((a, b) => a.menu_order - b.menu_order)
      .forEach(item => {
        const parsedItem: ParsedMenuItem = {
          id: item.id,
          label: item.title.rendered,
          href: this.normalizeUrl(item.url),
          hasDropdown: false,
          submenu: []
        };
        itemMap.set(item.id, parsedItem);
      });

    // Second pass: build hierarchy
    items.forEach(item => {
      const parsedItem = itemMap.get(item.id);
      if (!parsedItem) return;

      if (item.parent === 0) {
        // Root level item
        rootItems.push(parsedItem);
      } else {
        // Child item
        const parentItem = itemMap.get(item.parent);
        if (parentItem) {
          if (!parentItem.submenu) {
            parentItem.submenu = [];
          }
          parentItem.submenu.push(parsedItem);
          parentItem.hasDropdown = true;
        }
      }
    });

    return rootItems;
  }

  private normalizeUrl(url: string): string {
    // Convert absolute URLs to relative paths
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      // If URL parsing fails, return as-is
      return url;
    }
  }

  async getMenuStructure(): Promise<MenuStructure> {
    try {
      const menuItems = await this.fetchMenuItems();
      const mainItems = this.buildMenuHierarchy(menuItems);

      return {
        mainItems
      };
    } catch (error) {
      console.error('Error building menu structure:', error);
      // Return empty structure as fallback
      return {
        mainItems: []
      };
    }
  }

  // Method to get menu items with nested structure matching current implementation
  async getFormattedMenuData() {
    try {
      const structure = await this.getMenuStructure();
      
      // Transform WordPress menu into our current navigation format
      const navigationItems = structure.mainItems.map(item => ({
        label: item.label,
        href: item.href,
        hasDropdown: item.hasDropdown
      }));

      // Extract specific category data for dropdown menus
      const newsCategories = this.extractCategoriesByParent(structure.mainItems, 'News');
      const lifestyleCategories = this.extractCategoriesByParent(structure.mainItems, 'Lifestyle');
      const artsCategories = this.extractCategoriesByParent(structure.mainItems, 'Arts and Entertainment');

      return {
        navigationItems,
        newsCategories,
        lifestyleCategories,
        artsCategories
      };
    } catch (error) {
      console.error('Error getting formatted menu data:', error);
      return null;
    }
  }

  private extractCategoriesByParent(items: ParsedMenuItem[], parentLabel: string) {
    const parentItem = items.find(item => item.label === parentLabel);
    if (!parentItem?.submenu) return [];

    return parentItem.submenu.map(subitem => {
      const hasSubmenu = subitem.submenu && subitem.submenu.length > 0;
      return {
        label: subitem.label,
        href: subitem.href,
        hasSubmenu,
        submenu: hasSubmenu && subitem.submenu ? subitem.submenu.map(sub => ({
          label: sub.label,
          href: sub.href
        })) : undefined
      };
    });
  }
}

export default WordPressMenuService;
export type { ParsedMenuItem, MenuStructure };