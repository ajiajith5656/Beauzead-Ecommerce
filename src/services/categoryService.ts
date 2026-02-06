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
      const response: any = await client.graphql({
        query: listCategories,
        variables: { limit },
      });

      const categories = response.data?.listCategories?.items || [];
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
      const response: any = await client.graphql({
        query: getCategory,
        variables: { id: categoryId },
      });

      const cat = response.data?.getCategory;
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

      const response: any = await client.graphql({
        query: createCategory,
        variables: { input },
      });

      const cat = response.data?.createCategory;
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

      const response: any = await client.graphql({
        query: updateCategory,
        variables: { input },
      });

      const cat = response.data?.updateCategory;
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

  /**
   * Get subcategories by category ID
   */
  async getSubCategoriesByCategory(categoryId: string): Promise<any[]> {
    try {
      const query = `
        query ListSubCategories {
          listSubCategories(filter: {categoryId: {eq: "${categoryId}"}, isActive: {eq: true}}) {
            items {
              id
              categoryId
              name
              description
              imageUrl
              isActive
              createdAt
              updatedAt
            }
          }
        }
      `;

      const result: any = await client.graphql({ query });
      return result.data?.listSubCategories?.items || [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  }

  /**
   * Get all subcategories
   */
  async getAllSubCategories(): Promise<any[]> {
    try {
      const query = `
        query ListSubCategories {
          listSubCategories(filter: {isActive: {eq: true}}) {
            items {
              id
              categoryId
              name
              description
              imageUrl
              isActive
              createdAt
              updatedAt
            }
          }
        }
      `;

      const result: any = await client.graphql({ query });
      return result.data?.listSubCategories?.items || [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  }

  /**
   * Create subcategory
   */
  async createSubCategory(
    categoryId: string,
    name: string,
    description?: string,
    imageUrl?: string
  ): Promise<boolean> {
    try {
      const mutation = `
        mutation CreateSubCategory {
          createSubCategory(input: {
            categoryId: "${categoryId}"
            name: "${name}"
            description: "${description || ''}"
            imageUrl: "${imageUrl || ''}"
            isActive: true
          }) {
            id
          }
        }
      `;

      const result: any = await client.graphql({ query: mutation });
      return !!result.data?.createSubCategory?.id;
    } catch (error) {
      console.error('Error creating subcategory:', error);
      return false;
    }
  }

  /**
   * Update subcategory
   */
  async updateSubCategory(
    id: string,
    categoryId: string,
    name: string,
    description?: string,
    imageUrl?: string
  ): Promise<boolean> {
    try {
      const mutation = `
        mutation UpdateSubCategory {
          updateSubCategory(input: {
            id: "${id}"
            categoryId: "${categoryId}"
            name: "${name}"
            description: "${description || ''}"
            imageUrl: "${imageUrl || ''}"
          }) {
            id
          }
        }
      `;

      const result: any = await client.graphql({ query: mutation });
      return !!result.data?.updateSubCategory?.id;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      return false;
    }
  }

  /**
   * Delete subcategory
   */
  async deleteSubCategory(id: string): Promise<boolean> {
    try {
      const mutation = `
        mutation DeleteSubCategory {
          deleteSubCategory(input: {id: "${id}"}) {
            id
          }
        }
      `;

      const result: any = await client.graphql({ query: mutation });
      return !!result.data?.deleteSubCategory?.id;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      return false;
    }
  }
}

export default new CategoryService();
