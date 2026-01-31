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
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
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
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        imageUrl
        isActive
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      price
      currency
      imageUrl
      sellerId
      categoryId
      stock
      approved
      createdAt
      approvalStatus
      isActive
      updatedAt
      __typename
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        price
        currency
        imageUrl
        sellerId
        categoryId
        stock
        approved
        createdAt
        approvalStatus
        isActive
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      userId
      total
      currency
      status
      createdAt
      address
      phone
      paymentStatus
      updatedAt
      __typename
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        total
        currency
        status
        createdAt
        address
        phone
        paymentStatus
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      id
      productId
      userId
      rating
      comment
      createdAt
      isVerified
      isFlagged
      updatedAt
      __typename
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productId
        userId
        rating
        comment
        createdAt
        isVerified
        isFlagged
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComplaint = /* GraphQL */ `
  query GetComplaint($id: ID!) {
    getComplaint(id: $id) {
      id
      userId
      subject
      description
      status
      createdAt
      updatedAt
      assignedTo
      resolution
      __typename
    }
  }
`;
export const listComplaints = /* GraphQL */ `
  query ListComplaints(
    $filter: ModelComplaintFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComplaints(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        subject
        description
        status
        createdAt
        updatedAt
        assignedTo
        resolution
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDashboardMetrics = /* GraphQL */ `
  query GetDashboardMetrics($id: ID!) {
    getDashboardMetrics(id: $id) {
      id
      totalSales
      totalExpenses
      totalProducts
      totalUsers
      totalSellers
      totalBookings
      ongoingOrders
      returnsCancellations
      userRegistrations
      primeMembers
      sellerRegistrations
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDashboardMetrics = /* GraphQL */ `
  query ListDashboardMetrics(
    $filter: ModelDashboardMetricsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDashboardMetrics(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        totalSales
        totalExpenses
        totalProducts
        totalUsers
        totalSellers
        totalBookings
        ongoingOrders
        returnsCancellations
        userRegistrations
        primeMembers
        sellerRegistrations
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
