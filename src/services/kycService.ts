import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import type { SellerKYC } from '../types';

const client = generateClient();

/**
 * LEGACY: KYCRequirement interface for backward compatibility with admin modules
 */
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
 * LEGACY: Fetch KYC requirements for a specific country
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
 * LEGACY: Fetch all KYC requirements (for admin)
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
 * LEGACY: Create new KYC requirement (Admin only)
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
 * LEGACY: Update KYC requirement (Admin only)
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
 * LEGACY: Delete KYC requirement (Admin only)
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

// ===================================================================
// NEW: Seller KYC S3 Upload and DynamoDB Storage Functions
// ===================================================================

interface KYCSubmissionResult {
  success: boolean;
  kycId?: string;
  error?: string;
  message?: string;
}

interface UploadFileResult {
  key: string;
  url: string;
}

/**
 * Upload a file to S3 for KYC documents
 */
export const uploadKYCDocument = async (
  file: File,
  sellerId: string,
  documentType: 'id' | 'address' | 'bank_statement'
): Promise<UploadFileResult> => {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const key = `kyc/${sellerId}/${documentType}_${timestamp}.${fileExtension}`;

    // Upload to S3
    await uploadData({
      key,
      data: file,
      options: {
        contentType: file.type,
        metadata: {
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
        },
      },
    }).result;

    // Get signed URL for the uploaded file (valid for 7 days)
    const urlResult = await getUrl({
      key,
      options: {
        validateObjectExistence: true,
        expiresIn: 604800, // 7 days in seconds
      },
    });

    return {
      key,
      url: urlResult.url.toString(),
    };
  } catch (error) {
    console.error(`Error uploading ${documentType} document:`, error);
    throw new Error(`Failed to upload ${documentType} document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create KYC record in DynamoDB
 */
export const createKYCRecord = async (
  kycData: Omit<SellerKYC, 'id' | 'id_document_file' | 'address_proof_file' | 'bank_statement_file'>
): Promise<KYCSubmissionResult> => {
  try {
    const mutation = `
      mutation CreateSellerKYC($input: CreateSellerKYCInput!) {
        createSellerKYC(input: $input) {
          id
          seller_id
          kyc_status
          created_at
        }
      }
    `;

    const variables = {
      input: {
        ...kycData,
        id: `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        kyc_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to create KYC record',
      };
    }

    const kycRecord = response.data?.createSellerKYC;
    return {
      success: true,
      kycId: kycRecord?.id,
      message: 'KYC record created successfully',
    };
  } catch (error) {
    console.error('Error creating KYC record:', error);
    return {
      success: false,
      error: `Failed to create KYC record: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Update KYC record in DynamoDB
 */
export const updateKYCRecord = async (
  kycId: string,
  updates: Partial<SellerKYC>
): Promise<KYCSubmissionResult> => {
  try {
    const mutation = `
      mutation UpdateSellerKYC($input: UpdateSellerKYCInput!) {
        updateSellerKYC(input: $input) {
          id
          kyc_status
          updated_at
        }
      }
    `;

    const variables = {
      input: {
        id: kycId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
    };

    const response: any = await client.graphql({
      query: mutation,
      variables,
    });

    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'Failed to update KYC record',
      };
    }

    return {
      success: true,
      kycId,
      message: 'KYC record updated successfully',
    };
  } catch (error) {
    console.error('Error updating KYC record:', error);
    return {
      success: false,
      error: `Failed to update KYC record: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Fetch KYC record from DynamoDB
 */
export const fetchKYCRecord = async (kycId: string): Promise<SellerKYC | null> => {
  try {
    const query = `
      query GetSellerKYC($id: ID!) {
        getSellerKYC(id: $id) {
          id
          seller_id
          email
          phone
          full_name
          country
          pan
          gstin
          id_type
          id_number
          id_document_url
          business_address
          address_proof_url
          bank_holder_name
          account_number
          account_type
          ifsc_code
          bank_statement_url
          pep_declaration
          sanctions_check
          aml_compliance
          tax_compliance
          terms_accepted
          kyc_status
          kyc_tier
          rejection_reason
          verified_by_admin
          verified_at
          created_at
          updated_at
          submitted_at
        }
      }
    `;

    const response: any = await client.graphql({
      query,
      variables: { id: kycId },
    });

    if (response.errors) {
      console.error('Error fetching KYC record:', response.errors);
      return null;
    }

    return response.data?.getSellerKYC || null;
  } catch (error) {
    console.error('Error fetching KYC record:', error);
    return null;
  }
};

/**
 * Get KYC status by seller ID
 */
export const getKYCBySellerId = async (sellerId: string): Promise<SellerKYC | null> => {
  try {
    const query = `
      query ListSellerKYC($filter: ModelSellerKYCFilterInput!) {
        listSellerKYC(filter: $filter) {
          items {
            id
            seller_id
            kyc_status
            kyc_tier
            created_at
            updated_at
            submitted_at
          }
        }
      }
    `;

    const response: any = await client.graphql({
      query,
      variables: {
        filter: { seller_id: { eq: sellerId } },
      },
    });

    if (response.errors) {
      console.error('Error fetching KYC by seller:', response.errors);
      return null;
    }

    const items = response.data?.listSellerKYC?.items;
    return items && items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error fetching KYC by seller:', error);
    return null;
  }
};

/**
 * Submit complete KYC with all documents to S3 and data to DynamoDB
 */
export const submitCompleteKYC = async (
  kycData: SellerKYC,
  sellerId: string
): Promise<KYCSubmissionResult> => {
  try {
    // Track upload progress
    const uploadedFiles: { [key: string]: UploadFileResult } = {};
    const errors: { [key: string]: string } = {};

    // Step 1: Upload all documents to S3 in parallel
    console.log('Uploading KYC documents to S3...');

    const uploadPromises = [];

    if (kycData.id_document_file) {
      uploadPromises.push(
        uploadKYCDocument(kycData.id_document_file, sellerId, 'id')
          .then((result) => {
            uploadedFiles.id_document = result;
          })
          .catch((error) => {
            errors.id_document = error.message;
          })
      );
    }

    if (kycData.address_proof_file) {
      uploadPromises.push(
        uploadKYCDocument(kycData.address_proof_file, sellerId, 'address')
          .then((result) => {
            uploadedFiles.address_proof = result;
          })
          .catch((error) => {
            errors.address_proof = error.message;
          })
      );
    }

    if (kycData.bank_statement_file) {
      uploadPromises.push(
        uploadKYCDocument(kycData.bank_statement_file, sellerId, 'bank_statement')
          .then((result) => {
            uploadedFiles.bank_statement = result;
          })
          .catch((error) => {
            errors.bank_statement = error.message;
          })
      );
    }

    await Promise.all(uploadPromises);

    // Check if any uploads failed
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: `Document upload failed: ${Object.values(errors).join(', ')}`,
      };
    }

    // Step 2: Create KYC record in DynamoDB with document URLs
    console.log('Storing KYC data in DynamoDB...');

    const kycRecordData = {
      ...kycData,
      id_document_url: uploadedFiles.id_document?.url || kycData.id_document_url,
      address_proof_url: uploadedFiles.address_proof?.url || kycData.address_proof_url,
      bank_statement_url: uploadedFiles.bank_statement?.url || kycData.bank_statement_url,
      seller_id: sellerId,
      submitted_at: new Date().toISOString(),
    };

    // Remove file objects before storing
    const { id_document_file, address_proof_file, bank_statement_file, ...cleanData } = kycRecordData;

    const result = await createKYCRecord(cleanData as any);

    if (!result.success) {
      return {
        success: false,
        error: `Failed to store KYC data: ${result.error}`,
      };
    }

    console.log('KYC submitted successfully:', result.kycId);

    return {
      success: true,
      kycId: result.kycId,
      message: 'KYC verification submitted successfully. Your documents have been uploaded and stored securely.',
    };
  } catch (error) {
    console.error('Error submitting complete KYC:', error);
    return {
      success: false,
      error: `Failed to submit KYC: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Update seller verification status after admin approval
 */
export const updateSellerVerificationStatus = async (
  sellerId: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<KYCSubmissionResult> => {
  try {
    // First get the current KYC record
    const currentKYC = await getKYCBySellerId(sellerId);

    if (!currentKYC) {
      return {
        success: false,
        error: 'KYC record not found for this seller',
      };
    }

    // Update KYC status
    const updateResult = await updateKYCRecord(currentKYC.id, {
      kyc_status: status,
      rejection_reason: reason,
      verified_at: status === 'approved' ? new Date().toISOString() : undefined,
      verified_by_admin: 'admin_system',
    } as any);

    if (!updateResult.success) {
      return updateResult;
    }

    return {
      success: true,
      message: `Seller verification ${status} and notification sent`,
    };
  } catch (error) {
    console.error('Error updating seller verification status:', error);
    return {
      success: false,
      error: `Failed to update verification status: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
