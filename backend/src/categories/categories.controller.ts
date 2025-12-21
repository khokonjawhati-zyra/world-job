import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.getAllCategories();
  }

  @Get('tree')
  getTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.categoriesService.searchCategories(query);
  }

  @Post()
  addCategory(
    @Body()
    body: {
      name: string;
      parentId: string;
      type: 'INDUSTRY' | 'SECTOR' | 'SKILL';
    },
  ) {
    return this.categoriesService.addCustomCategory(
      body.name,
      body.parentId,
      body.type,
    );
  }
}
