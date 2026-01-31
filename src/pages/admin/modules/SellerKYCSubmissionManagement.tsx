import React from 'react';
import { TableManager } from './TableManager';
import type { TableConfig } from './TableManager';

export const SellerKYCSubmissionManagement: React.FC = () => {
  const config: TableConfig = {
    name: 'Seller KYC Submissions',
    fields: [
      { name: 'sellerId', type: 'text', required: true },
      { name: 'country', type: 'text', required: true },
      { name: 'registrationType', type: 'text', required: true },
      { name: 'status', type: 'text', required: true },
      { name: 'submissionDate', type: 'date' },
      { name: 'reviewedBy', type: 'text' },
      { name: 'reviewDate', type: 'date' },
      { name: 'rejectionReason', type: 'textarea' },
    ],
    onFetch: async () => {
      return [
        {
          id: '1',
          sellerId: 'seller1',
          country: 'India',
          registrationType: 'Individual',
          status: 'pending',
          submissionDate: '2026-01-31',
          reviewedBy: null,
          reviewDate: null,
          rejectionReason: null,
        },
      ];
    },
    onAdd: async (data) => {
      console.log('Add KYC submission:', data);
      return true;
    },
    onEdit: async (id, data) => {
      console.log('Edit KYC submission:', id, data);
      return true;
    },
    onDelete: async (id) => {
      console.log('Delete KYC submission:', id);
      return true;
    },
  };

  return <TableManager config={config} />;
};
