import React from 'react';
import { TableManager } from './TableManager';
import type { TableConfig } from './TableManager';

export const BusinessTypeManagement: React.FC = () => {
  const config: TableConfig = {
    name: 'Business Types',
    fields: [
      { name: 'typeName', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
    ],
    onFetch: async () => {
      return [
        {
          id: '1',
          typeName: 'Individual',
          description: 'Solo seller or freelancer',
        },
        {
          id: '2',
          typeName: 'Partnership',
          description: 'Business partnership',
        },
        {
          id: '3',
          typeName: 'Company',
          description: 'Registered company',
        },
      ];
    },
    onAdd: async (data) => {
      console.log('Add business type:', data);
      return true;
    },
    onEdit: async (id, data) => {
      console.log('Edit business type:', id, data);
      return true;
    },
    onDelete: async (id) => {
      console.log('Delete business type:', id);
      return true;
    },
  };

  return <TableManager config={config} />;
};
