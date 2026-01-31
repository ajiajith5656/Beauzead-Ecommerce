/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCountryListBzdcore = /* GraphQL */ `
  mutation CreateCountryListBzdcore(
    $input: CreateCountryListBzdcoreInput!
    $condition: ModelCountryListBzdcoreConditionInput
  ) {
    createCountryListBzdcore(input: $input, condition: $condition) {
      id
      countryName
      shortCode
      currency
      dialCode
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCountryListBzdcore = /* GraphQL */ `
  mutation UpdateCountryListBzdcore(
    $input: UpdateCountryListBzdcoreInput!
    $condition: ModelCountryListBzdcoreConditionInput
  ) {
    updateCountryListBzdcore(input: $input, condition: $condition) {
      id
      countryName
      shortCode
      currency
      dialCode
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCountryListBzdcore = /* GraphQL */ `
  mutation DeleteCountryListBzdcore(
    $input: DeleteCountryListBzdcoreInput!
    $condition: ModelCountryListBzdcoreConditionInput
  ) {
    deleteCountryListBzdcore(input: $input, condition: $condition) {
      id
      countryName
      shortCode
      currency
      dialCode
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBusinessTypeBzdcore = /* GraphQL */ `
  mutation CreateBusinessTypeBzdcore(
    $input: CreateBusinessTypeBzdcoreInput!
    $condition: ModelBusinessTypeBzdcoreConditionInput
  ) {
    createBusinessTypeBzdcore(input: $input, condition: $condition) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBusinessTypeBzdcore = /* GraphQL */ `
  mutation UpdateBusinessTypeBzdcore(
    $input: UpdateBusinessTypeBzdcoreInput!
    $condition: ModelBusinessTypeBzdcoreConditionInput
  ) {
    updateBusinessTypeBzdcore(input: $input, condition: $condition) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBusinessTypeBzdcore = /* GraphQL */ `
  mutation DeleteBusinessTypeBzdcore(
    $input: DeleteBusinessTypeBzdcoreInput!
    $condition: ModelBusinessTypeBzdcoreConditionInput
  ) {
    deleteBusinessTypeBzdcore(input: $input, condition: $condition) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
// Category Mutations
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      name
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      name
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      name
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;