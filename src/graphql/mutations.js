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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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
export const createComplaint = /* GraphQL */ `
  mutation CreateComplaint(
    $input: CreateComplaintInput!
    $condition: ModelComplaintConditionInput
  ) {
    createComplaint(input: $input, condition: $condition) {
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
export const updateComplaint = /* GraphQL */ `
  mutation UpdateComplaint(
    $input: UpdateComplaintInput!
    $condition: ModelComplaintConditionInput
  ) {
    updateComplaint(input: $input, condition: $condition) {
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
export const deleteComplaint = /* GraphQL */ `
  mutation DeleteComplaint(
    $input: DeleteComplaintInput!
    $condition: ModelComplaintConditionInput
  ) {
    deleteComplaint(input: $input, condition: $condition) {
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
export const createDashboardMetrics = /* GraphQL */ `
  mutation CreateDashboardMetrics(
    $input: CreateDashboardMetricsInput!
    $condition: ModelDashboardMetricsConditionInput
  ) {
    createDashboardMetrics(input: $input, condition: $condition) {
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
export const updateDashboardMetrics = /* GraphQL */ `
  mutation UpdateDashboardMetrics(
    $input: UpdateDashboardMetricsInput!
    $condition: ModelDashboardMetricsConditionInput
  ) {
    updateDashboardMetrics(input: $input, condition: $condition) {
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
export const deleteDashboardMetrics = /* GraphQL */ `
  mutation DeleteDashboardMetrics(
    $input: DeleteDashboardMetricsInput!
    $condition: ModelDashboardMetricsConditionInput
  ) {
    deleteDashboardMetrics(input: $input, condition: $condition) {
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
