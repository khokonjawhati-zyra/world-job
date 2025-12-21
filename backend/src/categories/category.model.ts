export class Category {
  constructor(
    public id: string,
    public name: string,
    public parentId: string | null = null, // null for Root Categories
    public type: 'INDUSTRY' | 'SECTOR' | 'SKILL', // Hierarchy levels: Industry -> Sector -> Skill
    public tags: string[] = [], // For searchable keywords
  ) {}
}

export interface CategoryTree {
  id: string;
  name: string;
  type: string;
  children: CategoryTree[];
}
