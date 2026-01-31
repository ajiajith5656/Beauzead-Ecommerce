import { generateClient } from 'aws-amplify/api';
// @ts-ignore
import { createCategory, updateCategory, deleteCategory } from '../graphql/mutations';
// @ts-ignore
import { getCategory, listCategories } from '../graphql/queries';
import type { Category } from '../types';

const client = generateClient();

export interface CategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(limit: number = 100): Promise<Category[] | null> {
    try {
      const response = await client.graphql({
        query: listCategories,
        variables: { limit },
      });

      const categories = (response.data as any).listCategories?.items || [];
      return categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image_url: cat.imageUrl,
        is_active: cat.isActive,
        created_at: cat.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return null;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const response = await client.graphql({
        query: getCategory,
        variables: { id: categoryId },
      });

      const cat = (response.data as any).getCategory;
      if (!cat) return null;

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image_url: cat.imageUrl,
        is_active: cat.isActive,
        created_at: cat.createdAt,
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * Create new category
   */
  async createNewCategory(categoryData: CategoryInput): Promise<Category | null> {
    try {
      const input = {
        name: categoryData.name,
        description: categoryData.description,
        imageUrl: categoryData.imageUrl,
        isActive: categoryData.isActive !== false,
      };

      const response = await client.graphql({
        query: createCategory,
        variables: { input },
      });

      const cat = (response.data as any).createCategory;
      if (!cat) return null;

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image_url: cat.imageUrl,
        is_active: cat.isActive,
        created_at: cat.createdAt,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  /**
   * Update existing category
   */
  async updateExistingCategory(
    categoryId: string,
    categoryData: Partial<CategoryInput>
  ): Promise<Category | null> {
    try {
      const input: any = { id: categoryId };

      if (categoryData.name !== undefined) input.name = categoryData.name;
      if (categoryData.description !== undefined) input.description = categoryData.description;
      if (categoryData.imageUrl !== undefined) input.imageUrl = categoryData.imageUrl;
      if (categoryData.isActive !== undefined) input.isActive = categoryData.isActive;

      const response = await client.graphql({
        query: updateCategory,
        variables: { input },
      });

      const cat = (response.data as any).updateCategory;
      if (!cat) return null;

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image_url: cat.imageUrl,
        is_active: cat.isActive,
        created_at: cat.createdAt,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  /**
   * Delete category
   */
  async deleteExistingCategory(categoryId: string): Promise<boolean> {
    try {
      await client.graphql({
        query: deleteCategory,
        variables: {
          input: { id: categoryId },
        },
      });

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  /**
   * Toggle category active status
   */
  async toggleCategoryStatus(categoryId: string, isActive: boolean): Promise<Category | null> {
    return this.updateExistingCategory(categoryId, { isActive });
  }
}

export default new CategoryService();
