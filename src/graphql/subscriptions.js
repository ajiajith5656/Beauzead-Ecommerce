/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCountryListBzdcore = /* GraphQL */ `
  subscription OnCreateCountryListBzdcore(
    $filter: ModelSubscriptionCountryListBzdcoreFilterInput
  ) {
    onCreateCountryListBzdcore(filter: $filter) {
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
export const onUpdateCountryListBzdcore = /* GraphQL */ `
  subscription OnUpdateCountryListBzdcore(
    $filter: ModelSubscriptionCountryListBzdcoreFilterInput
  ) {
    onUpdateCountryListBzdcore(filter: $filter) {
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
export const onDeleteCountryListBzdcore = /* GraphQL */ `
  subscription OnDeleteCountryListBzdcore(
    $filter: ModelSubscriptionCountryListBzdcoreFilterInput
  ) {
    onDeleteCountryListBzdcore(filter: $filter) {
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
export const onCreateBusinessTypeBzdcore = /* GraphQL */ `
  subscription OnCreateBusinessTypeBzdcore(
    $filter: ModelSubscriptionBusinessTypeBzdcoreFilterInput
  ) {
    onCreateBusinessTypeBzdcore(filter: $filter) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBusinessTypeBzdcore = /* GraphQL */ `
  subscription OnUpdateBusinessTypeBzdcore(
    $filter: ModelSubscriptionBusinessTypeBzdcoreFilterInput
  ) {
    onUpdateBusinessTypeBzdcore(filter: $filter) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBusinessTypeBzdcore = /* GraphQL */ `
  subscription OnDeleteBusinessTypeBzdcore(
    $filter: ModelSubscriptionBusinessTypeBzdcoreFilterInput
  ) {
    onDeleteBusinessTypeBzdcore(filter: $filter) {
      id
      typeName
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
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
export const onCreateComplaint = /* GraphQL */ `
  subscription OnCreateComplaint(
    $filter: ModelSubscriptionComplaintFilterInput
  ) {
    onCreateComplaint(filter: $filter) {
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
export const onUpdateComplaint = /* GraphQL */ `
  subscription OnUpdateComplaint(
    $filter: ModelSubscriptionComplaintFilterInput
  ) {
    onUpdateComplaint(filter: $filter) {
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
export const onDeleteComplaint = /* GraphQL */ `
  subscription OnDeleteComplaint(
    $filter: ModelSubscriptionComplaintFilterInput
  ) {
    onDeleteComplaint(filter: $filter) {
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
export const onCreateDashboardMetrics = /* GraphQL */ `
  subscription OnCreateDashboardMetrics(
    $filter: ModelSubscriptionDashboardMetricsFilterInput
  ) {
    onCreateDashboardMetrics(filter: $filter) {
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
export const onUpdateDashboardMetrics = /* GraphQL */ `
  subscription OnUpdateDashboardMetrics(
    $filter: ModelSubscriptionDashboardMetricsFilterInput
  ) {
    onUpdateDashboardMetrics(filter: $filter) {
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
export const onDeleteDashboardMetrics = /* GraphQL */ `
  subscription OnDeleteDashboardMetrics(
    $filter: ModelSubscriptionDashboardMetricsFilterInput
  ) {
    onDeleteDashboardMetrics(filter: $filter) {
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
