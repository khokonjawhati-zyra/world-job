import { Injectable } from '@nestjs/common';
import { Category, CategoryTree } from './category.model';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];

  constructor() {
    this.seedGlobalCategories();
  }

  // Huge optimization: In a real DB, these would be separate tables or indexed columns.
  // Here we simulate a massive dataset initialization.
  private seedGlobalCategories() {
    // 1. Digital & Tech (Root)
    this.addCategory('cat_digital', 'Digital & Technology', null, 'INDUSTRY');
    this.addCategory(
      'sec_dev',
      'Software Development',
      'cat_digital',
      'SECTOR',
    );
    this.addCategory('sk_react', 'React.js', 'sec_dev', 'SKILL');
    this.addCategory('sk_node', 'Node.js', 'sec_dev', 'SKILL');
    this.addCategory('sk_py', 'Python', 'sec_dev', 'SKILL');
    this.addCategory('sk_ai', 'Artificial Intelligence', 'sec_dev', 'SKILL');
    this.addCategory('sec_cyber', 'Cybersecurity', 'cat_digital', 'SECTOR');
    this.addCategory('sk_pentest', 'Penetration Testing', 'sec_cyber', 'SKILL');
    this.addCategory('sec_data', 'Data Science', 'cat_digital', 'SECTOR');

    // 2. Creative & Design (Root)
    this.addCategory('cat_creative', 'Creative & Design', null, 'INDUSTRY');
    this.addCategory('sec_graphic', 'Graphic Design', 'cat_creative', 'SECTOR');
    this.addCategory('sk_logo', 'Logo Design', 'sec_graphic', 'SKILL');
    this.addCategory('sk_uiux', 'UI/UX Design', 'sec_graphic', 'SKILL');
    this.addCategory('sec_mm', 'Multimedia', 'cat_creative', 'SECTOR');
    this.addCategory('sk_vid', 'Video Editing', 'sec_mm', 'SKILL');

    // 3. Physical & Onsite (Root) - Expanding scope as requested
    this.addCategory('cat_physical', 'Physical & Trades', null, 'INDUSTRY');
    this.addCategory('sec_const', 'Construction', 'cat_physical', 'SECTOR');
    this.addCategory('sk_plumb', 'Plumbing', 'sec_const', 'SKILL');
    this.addCategory('sk_elec', 'Electrical Wiring', 'sec_const', 'SKILL');
    this.addCategory('sk_carp', 'Carpentry', 'sec_const', 'SKILL');
    this.addCategory(
      'sec_logis',
      'Logistics & Transport',
      'cat_physical',
      'SECTOR',
    );
    this.addCategory('sk_drive', 'Heavy Vehicle Driving', 'sec_logis', 'SKILL');
    this.addCategory('sk_ware', 'Warehouse Management', 'sec_logis', 'SKILL');

    // 4. Professional Services (Root)
    this.addCategory('cat_prof', 'Professional Services', null, 'INDUSTRY');
    this.addCategory('sec_legal', 'Legal', 'cat_prof', 'SECTOR');
    this.addCategory('sk_contract', 'Contract Law', 'sec_legal', 'SKILL');
    this.addCategory('sec_fin', 'Finance & Accounting', 'cat_prof', 'SECTOR');
    this.addCategory('sk_tax', 'Tax Preparation', 'sec_fin', 'SKILL');

    // 5. Hospitality & Tourism (Root)
    this.addCategory('cat_hosp', 'Hospitality & Tourism', null, 'INDUSTRY');
    this.addCategory('sec_fnb', 'Food & Beverage', 'cat_hosp', 'SECTOR');
    this.addCategory('sk_chef', 'Culinary Arts', 'sec_fnb', 'SKILL');

    // ... Imagine thousands more loaded from a JSON or DB
  }

  private addCategory(
    id: string,
    name: string,
    parentId: string | null,
    type: 'INDUSTRY' | 'SECTOR' | 'SKILL',
  ) {
    this.categories.push(new Category(id, name, parentId, type));
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  // O(n) construction of tree - Optimized for frontend consumption
  getCategoryTree(): CategoryTree[] {
    const buildTree = (parentId: string | null): CategoryTree[] => {
      return this.categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          type: cat.type,
          children: buildTree(cat.id),
        }));
    };
    return buildTree(null);
  }

  // Fast search for autocomplete
  searchCategories(query: string): Category[] {
    const lowerQ = query.toLowerCase();
    return this.categories.filter((c) => c.name.toLowerCase().includes(lowerQ));
  }

  addCustomCategory(
    name: string,
    parentId: string,
    type: 'INDUSTRY' | 'SECTOR' | 'SKILL',
  ): Category {
    const id = 'cust_' + Math.random().toString(36).substr(2, 9);
    const newCat = new Category(id, name, parentId, type);
    this.categories.push(newCat);
    return newCat;
  }
}
