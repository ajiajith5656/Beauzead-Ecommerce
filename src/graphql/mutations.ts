/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      phone
      first_name
      last_name
      profile_type
      avatar_url
      address
      is_verified
      is_banned
      created_at
      updated_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      phone
      first_name
      last_name
      profile_type
      avatar_url
      address
      is_verified
      is_banned
      created_at
      updated_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      phone
      first_name
      last_name
      profile_type
      avatar_url
      address
      is_verified
      is_banned
      created_at
      updated_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createSeller = /* GraphQL */ `
  mutation CreateSeller(
    $input: CreateSellerInput!
    $condition: ModelSellerConditionInput
  ) {
    createSeller(input: $input, condition: $condition) {
      id
      user_id
      email
      business_name
      business_type
      gst_number
      pan_number
      phone
      address
      bank_details
      kyc_status
      kyc_documents
      badge
      is_approved
      is_active
      created_at
      updated_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateSeller = /* GraphQL */ `
  mutation UpdateSeller(
    $input: UpdateSellerInput!
    $condition: ModelSellerConditionInput
  ) {
    updateSeller(input: $input, condition: $condition) {
      id
      user_id
      email
      business_name
      business_type
      gst_number
      pan_number
      phone
      address
      bank_details
      kyc_status
      kyc_documents
      badge
      is_approved
      is_active
      created_at
      updated_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteSeller = /* GraphQL */ `
  mutation DeleteSeller(
    $input: DeleteSellerInput!
    $condition: ModelSellerConditionInput
  ) {
    deleteSeller(input: $input, condition: $condition) {
      id
      user_id
      email
      business_name
      business_type
      gst_number
      pan_number
      phone
      address
      bank_details
      kyc_status
      kyc_documents
      badge
      is_approved
      is_active
      created_at
      updated_at
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
      seller_id
      category_id
      sub_category_id
      name
      brand_name
      model_number
      short_description
      description
      highlights
      specifications
      image_url
      images
      videos
      price
      mrp
      currency
      stock
      size_variants
      color_variants
      gst_rate
      platform_fee
      commission
      delivery_countries
      package_weight
      package_dimensions
      shipping_type
      manufacturer_name
      cancellation_policy_days
      return_policy_days
      offer_rules
      approval_status
      is_active
      rating
      review_count
      created_at
      updated_at
      createdAt
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
      seller_id
      category_id
      sub_category_id
      name
      brand_name
      model_number
      short_description
      description
      highlights
      specifications
      image_url
      images
      videos
      price
      mrp
      currency
      stock
      size_variants
      color_variants
      gst_rate
      platform_fee
      commission
      delivery_countries
      package_weight
      package_dimensions
      shipping_type
      manufacturer_name
      cancellation_policy_days
      return_policy_days
      offer_rules
      approval_status
      is_active
      rating
      review_count
      created_at
      updated_at
      createdAt
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
      seller_id
      category_id
      sub_category_id
      name
      brand_name
      model_number
      short_description
      description
      highlights
      specifications
      image_url
      images
      videos
      price
      mrp
      currency
      stock
      size_variants
      color_variants
      gst_rate
      platform_fee
      commission
      delivery_countries
      package_weight
      package_dimensions
      shipping_type
      manufacturer_name
      cancellation_policy_days
      return_policy_days
      offer_rules
      approval_status
      is_active
      rating
      review_count
      created_at
      updated_at
      createdAt
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
      user_id
      seller_id
      order_number
      status
      items
      subtotal
      shipping_cost
      tax_amount
      discount_amount
      total_amount
      currency
      shipping_address
      billing_address
      payment_method
      payment_status
      payment_intent_id
      tracking_number
      created_at
      updated_at
      createdAt
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
      user_id
      seller_id
      order_number
      status
      items
      subtotal
      shipping_cost
      tax_amount
      discount_amount
      total_amount
      currency
      shipping_address
      billing_address
      payment_method
      payment_status
      payment_intent_id
      tracking_number
      created_at
      updated_at
      createdAt
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
      user_id
      seller_id
      order_number
      status
      items
      subtotal
      shipping_cost
      tax_amount
      discount_amount
      total_amount
      currency
      shipping_address
      billing_address
      payment_method
      payment_status
      payment_intent_id
      tracking_number
      created_at
      updated_at
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
      slug
      description
      image_url
      parent_id
      sub_categories
      is_active
      sort_order
      created_at
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
      slug
      description
      image_url
      parent_id
      sub_categories
      is_active
      sort_order
      created_at
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
      slug
      description
      image_url
      parent_id
      sub_categories
      is_active
      sort_order
      created_at
      createdAt
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
      product_id
      user_id
      rating
      title
      comment
      images
      is_verified_purchase
      created_at
      createdAt
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
      product_id
      user_id
      rating
      title
      comment
      images
      is_verified_purchase
      created_at
      createdAt
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
      product_id
      user_id
      rating
      title
      comment
      images
      is_verified_purchase
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBanner = /* GraphQL */ `
  mutation CreateBanner(
    $input: CreateBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    createBanner(input: $input, condition: $condition) {
      id
      title
      subtitle
      image_url
      link_url
      position
      is_active
      sort_order
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBanner = /* GraphQL */ `
  mutation UpdateBanner(
    $input: UpdateBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    updateBanner(input: $input, condition: $condition) {
      id
      title
      subtitle
      image_url
      link_url
      position
      is_active
      sort_order
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBanner = /* GraphQL */ `
  mutation DeleteBanner(
    $input: DeleteBannerInput!
    $condition: ModelBannerConditionInput
  ) {
    deleteBanner(input: $input, condition: $condition) {
      id
      title
      subtitle
      image_url
      link_url
      position
      is_active
      sort_order
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPromotion = /* GraphQL */ `
  mutation CreatePromotion(
    $input: CreatePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    createPromotion(input: $input, condition: $condition) {
      id
      code
      name
      discount_type
      discount_value
      min_order_amount
      max_discount
      usage_limit
      used_count
      is_active
      start_date
      end_date
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePromotion = /* GraphQL */ `
  mutation UpdatePromotion(
    $input: UpdatePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    updatePromotion(input: $input, condition: $condition) {
      id
      code
      name
      discount_type
      discount_value
      min_order_amount
      max_discount
      usage_limit
      used_count
      is_active
      start_date
      end_date
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePromotion = /* GraphQL */ `
  mutation DeletePromotion(
    $input: DeletePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    deletePromotion(input: $input, condition: $condition) {
      id
      code
      name
      discount_type
      discount_value
      min_order_amount
      max_discount
      usage_limit
      used_count
      is_active
      start_date
      end_date
      created_at
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCountry = /* GraphQL */ `
  mutation CreateCountry(
    $input: CreateCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    createCountry(input: $input, condition: $condition) {
      id
      name
      code
      currency
      dial_code
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCountry = /* GraphQL */ `
  mutation UpdateCountry(
    $input: UpdateCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    updateCountry(input: $input, condition: $condition) {
      id
      name
      code
      currency
      dial_code
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCountry = /* GraphQL */ `
  mutation DeleteCountry(
    $input: DeleteCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    deleteCountry(input: $input, condition: $condition) {
      id
      name
      code
      currency
      dial_code
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBusinessType = /* GraphQL */ `
  mutation CreateBusinessType(
    $input: CreateBusinessTypeInput!
    $condition: ModelBusinessTypeConditionInput
  ) {
    createBusinessType(input: $input, condition: $condition) {
      id
      name
      description
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBusinessType = /* GraphQL */ `
  mutation UpdateBusinessType(
    $input: UpdateBusinessTypeInput!
    $condition: ModelBusinessTypeConditionInput
  ) {
    updateBusinessType(input: $input, condition: $condition) {
      id
      name
      description
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBusinessType = /* GraphQL */ `
  mutation DeleteBusinessType(
    $input: DeleteBusinessTypeInput!
    $condition: ModelBusinessTypeConditionInput
  ) {
    deleteBusinessType(input: $input, condition: $condition) {
      id
      name
      description
      is_active
      createdAt
      updatedAt
      __typename
    }
  }
`;

// ===== Stripe Payment & Checkout Mutations =====

export const createStripePaymentIntent = /* GraphQL */ `
  mutation CreateStripePaymentIntent($input: CreatePaymentIntentInput!) {
    createStripePaymentIntent(input: $input) {
      success
      clientSecret
      paymentIntentId
      status
      amount
      error
    }
  }
`;

export const confirmPaymentAndCreateOrder = /* GraphQL */ `
  mutation ConfirmPaymentAndCreateOrder($input: ConfirmPaymentInput!) {
    confirmPaymentAndCreateOrder(input: $input) {
      success
      orderId
      status
      paymentStatus
      error
    }
  }
`;

export const processRefund = /* GraphQL */ `
  mutation ProcessRefund($input: ProcessRefundInput!) {
    processRefund(input: $input) {
      success
      refundId
      status
      amount
      error
    }
  }
`;

export const processSellerPayout = /* GraphQL */ `
  mutation ProcessSellerPayout($input: ProcessPayoutInput!) {
    processSellerPayout(input: $input) {
      success
      payoutId
      amount
      ordersProcessed
      grossEarnings
      platformFee
      netPayout
      error
    }
  }
`;
