/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCountryListBzdcore = /* GraphQL */ `
  query GetCountryListBzdcore($id: ID!) {
    getCountryListBzdcore(id: $id) {
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
export const listCountryListBzdcores = /* GraphQL */ `
  query ListCountryListBzdcores(
    $filter: ModelCountryListBzdcoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCountryListBzdcores(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        countryName
        shortCode
        currency
        dialCode
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBusinessTypeBzdcore = /* GraphQL */ `
  query GetBusinessTypeBzdcore($id: ID!) {
    getBusinessTypeBzdcore(id: $id) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBusinessTypeBzdcores = /* GraphQL */ `
  query ListBusinessTypeBzdcores(
    $filter: ModelBusinessTypeBzdcoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBusinessTypeBzdcores(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        typeName
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
