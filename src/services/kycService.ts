import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export interface KYCRequirement {
  id: string;
  country: string;
  registrationType: string;
  requiredDocuments: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch KYC requirements for a specific country
 */
export const getKYCRequirementsByCountry = async (country: string): Promise<KYCRequirement[]> => {
  try {
    const query = `
      query ListKYCRequirements {
        listKYCRequirements(filter: {country: {eq: "${country}"}, isActive: {eq: true}}) {
          items {
            id
            country
            registrationType
            requiredDocuments
            description
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result: any = await client.graphql({ query });
    return result.data?.listKYCRequirements?.items || [];
  } catch (error) {
    console.error('Error fetching KYC requirements:', error);
    return [];
  }
};

/**
 * Fetch all KYC requirements (for admin)
 */
export const getAllKYCRequirements = async (): Promise<KYCRequirement[]> => {
  try {
    const query = `
      query ListAllKYCRequirements {
        listKYCRequirements {
          items {
            id
            country
            registrationType
            requiredDocuments
            description
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result: any = await client.graphql({ query });
    return result.data?.listKYCRequirements?.items || [];
  } catch (error) {
    console.error('Error fetching all KYC requirements:', error);
    return [];
  }
};

/**
 * Create new KYC requirement (Admin only)
 */
export const createKYCRequirement = async (
  country: string,
  registrationType: string,
  requiredDocuments: string,
  description?: string
): Promise<KYCRequirement | null> => {
  try {
    const mutation = `
      mutation CreateKYCReq {
        createKYCRequirement(input: {
          country: "${country}"
          registrationType: "${registrationType}"
          requiredDocuments: "${requiredDocuments}"
          description: "${description || ''}"
          isActive: true
        }) {
          id
          country
          registrationType
          requiredDocuments
          description
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    const result: any = await client.graphql({ query: mutation });
    return result.data?.createKYCRequirement || null;
  } catch (error) {
    console.error('Error creating KYC requirement:', error);
    return null;
  }
};

/**
 * Update KYC requirement (Admin only)
 */
export const updateKYCRequirement = async (
  id: string,
  country?: string,
  registrationType?: string,
  requiredDocuments?: string,
  description?: string,
  isActive?: boolean
): Promise<KYCRequirement | null> => {
  try {
    const updates: Record<string, any> = { id };
    if (country !== undefined) updates.country = country;
    if (registrationType !== undefined) updates.registrationType = registrationType;
    if (requiredDocuments !== undefined) updates.requiredDocuments = requiredDocuments;
    if (description !== undefined) updates.description = description;
    if (isActive !== undefined) updates.isActive = isActive;

    const mutation = `
      mutation UpdateKYCReq {
        updateKYCRequirement(input: ${JSON.stringify(updates).replace(/"/g, '\\"')}) {
          id
          country
          registrationType
          requiredDocuments
          description
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    const result: any = await client.graphql({ query: mutation });
    return result.data?.updateKYCRequirement || null;
  } catch (error) {
    console.error('Error updating KYC requirement:', error);
    return null;
  }
};

/**
 * Delete KYC requirement (Admin only)
 */
export const deleteKYCRequirement = async (id: string): Promise<boolean> => {
  try {
    const mutation = `
      mutation DeleteKYCReq {
        deleteKYCRequirement(input: {id: "${id}"}) {
          id
        }
      }
    `;

    await client.graphql({ query: mutation });
    return true;
  } catch (error) {
    console.error('Error deleting KYC requirement:', error);
    return false;
  }
};
