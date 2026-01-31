/**
 * KYC Requirements seed data
 * This data should be loaded into the database on first app setup
 */

export const KYC_REQUIREMENTS_DATA = [
  // INDIA
  { country: 'India', registrationType: 'Individual', requiredDocuments: 'PAN' },
  { country: 'India', registrationType: 'Sole Proprietorship', requiredDocuments: 'PAN, GST (if applicable)' },
  { country: 'India', registrationType: 'Partnership', requiredDocuments: 'Partnership Deed, PAN, GST' },
  { country: 'India', registrationType: 'Private Limited / LLP', requiredDocuments: 'CIN, PAN, GST' },
  { country: 'India', registrationType: 'Trust / NGO', requiredDocuments: 'Trust Deed, PAN' },
  
  // UNITED STATES
  { country: 'United States', registrationType: 'Individual', requiredDocuments: 'SSN' },
  { country: 'United States', registrationType: 'Sole Proprietorship', requiredDocuments: 'SSN or EIN' },
  { country: 'United States', registrationType: 'LLC', requiredDocuments: 'EIN' },
  { country: 'United States', registrationType: 'Corporation (C / S Corp)', requiredDocuments: 'EIN' },
  
  // UNITED KINGDOM
  { country: 'United Kingdom', registrationType: 'Individual', requiredDocuments: 'National Insurance Number' },
  { country: 'United Kingdom', registrationType: 'Sole Trader', requiredDocuments: 'UTR' },
  { country: 'United Kingdom', registrationType: 'Partnership', requiredDocuments: 'Partnership UTR' },
  { country: 'United Kingdom', registrationType: 'Limited Company', requiredDocuments: 'Company Registration No, UTR' },
  
  // GERMANY
  { country: 'Germany', registrationType: 'Individual', requiredDocuments: 'Steuer-ID' },
  { country: 'Germany', registrationType: 'Sole Trader (Einzelunternehmen)', requiredDocuments: 'Steuer-ID, VAT ID' },
  { country: 'Germany', registrationType: 'GmbH', requiredDocuments: 'VAT ID, Company Registration' },
  
  // FRANCE
  { country: 'France', registrationType: 'Individual', requiredDocuments: 'Numéro fiscal' },
  { country: 'France', registrationType: 'Sole Trader (Auto-entrepreneur)', requiredDocuments: 'SIREN' },
  { country: 'France', registrationType: 'Company (SARL / SAS)', requiredDocuments: 'SIREN, VAT ID' },
  
  // ITALY
  { country: 'Italy', registrationType: 'Individual', requiredDocuments: 'Codice Fiscale' },
  { country: 'Italy', registrationType: 'Sole Trader', requiredDocuments: 'VAT Number' },
  { country: 'Italy', registrationType: 'Company (SRL / SPA)', requiredDocuments: 'VAT Number, Registration Cert' },
  
  // SPAIN
  { country: 'Spain', registrationType: 'Individual', requiredDocuments: 'NIE' },
  { country: 'Spain', registrationType: 'Sole Trader', requiredDocuments: 'NIE, VAT' },
  { country: 'Spain', registrationType: 'Company (SL / SA)', requiredDocuments: 'CIF, VAT' },
  
  // CANADA
  { country: 'Canada', registrationType: 'Individual', requiredDocuments: 'SIN' },
  { country: 'Canada', registrationType: 'Sole Proprietor', requiredDocuments: 'SIN or BN' },
  { country: 'Canada', registrationType: 'Corporation', requiredDocuments: 'Business Number (BN)' },
  
  // AUSTRALIA
  { country: 'Australia', registrationType: 'Individual', requiredDocuments: 'TFN' },
  { country: 'Australia', registrationType: 'Sole Trader', requiredDocuments: 'ABN' },
  { country: 'Australia', registrationType: 'Company', requiredDocuments: 'ABN, ACN' },
  
  // SINGAPORE
  { country: 'Singapore', registrationType: 'Individual', requiredDocuments: 'NRIC / FIN' },
  { country: 'Singapore', registrationType: 'Sole Proprietor', requiredDocuments: 'UEN' },
  { country: 'Singapore', registrationType: 'Company (Pte Ltd)', requiredDocuments: 'UEN' },
  
  // UAE
  { country: 'UAE', registrationType: 'Individual', requiredDocuments: 'Emirates ID' },
  { country: 'UAE', registrationType: 'Sole Establishment', requiredDocuments: 'Trade License' },
  { country: 'UAE', registrationType: 'Company', requiredDocuments: 'Trade License' },
  
  // SAUDI ARABIA
  { country: 'Saudi Arabia', registrationType: 'Individual', requiredDocuments: 'National ID' },
  { country: 'Saudi Arabia', registrationType: 'Company', requiredDocuments: 'Commercial Registration (CR)' },
  
  // JAPAN
  { country: 'Japan', registrationType: 'Individual', requiredDocuments: 'My Number' },
  { country: 'Japan', registrationType: 'Sole Proprietor', requiredDocuments: 'My Number' },
  { country: 'Japan', registrationType: 'Company (KK / GK)', requiredDocuments: 'Corporate Number' },
  
  // CHINA
  { country: 'China', registrationType: 'Individual', requiredDocuments: 'Resident ID' },
  { country: 'China', registrationType: 'Company', requiredDocuments: 'Unified Social Credit Code' },
  
  // BRAZIL
  { country: 'Brazil', registrationType: 'Individual', requiredDocuments: 'CPF' },
  { country: 'Brazil', registrationType: 'Sole Proprietor', requiredDocuments: 'CPF' },
  { country: 'Brazil', registrationType: 'Company (LTDA / SA)', requiredDocuments: 'CNPJ' },
  
  // SOUTH AFRICA
  { country: 'South Africa', registrationType: 'Individual', requiredDocuments: 'ID Number' },
  { country: 'South Africa', registrationType: 'Sole Proprietor', requiredDocuments: 'Income Tax Number' },
  { country: 'South Africa', registrationType: 'Company', requiredDocuments: 'Company Registration, VAT' },
];
