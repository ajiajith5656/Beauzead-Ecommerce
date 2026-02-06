/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateSeller = /* GraphQL */ `
  subscription OnCreateSeller($filter: ModelSubscriptionSellerFilterInput) {
    onCreateSeller(filter: $filter) {
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
export const onUpdateSeller = /* GraphQL */ `
  subscription OnUpdateSeller($filter: ModelSubscriptionSellerFilterInput) {
    onUpdateSeller(filter: $filter) {
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
export const onDeleteSeller = /* GraphQL */ `
  subscription OnDeleteSeller($filter: ModelSubscriptionSellerFilterInput) {
    onDeleteSeller(filter: $filter) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
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
export const onCreateBanner = /* GraphQL */ `
  subscription OnCreateBanner($filter: ModelSubscriptionBannerFilterInput) {
    onCreateBanner(filter: $filter) {
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
export const onUpdateBanner = /* GraphQL */ `
  subscription OnUpdateBanner($filter: ModelSubscriptionBannerFilterInput) {
    onUpdateBanner(filter: $filter) {
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
export const onDeleteBanner = /* GraphQL */ `
  subscription OnDeleteBanner($filter: ModelSubscriptionBannerFilterInput) {
    onDeleteBanner(filter: $filter) {
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
export const onCreatePromotion = /* GraphQL */ `
  subscription OnCreatePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
  ) {
    onCreatePromotion(filter: $filter) {
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
export const onUpdatePromotion = /* GraphQL */ `
  subscription OnUpdatePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
  ) {
    onUpdatePromotion(filter: $filter) {
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
export const onDeletePromotion = /* GraphQL */ `
  subscription OnDeletePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
  ) {
    onDeletePromotion(filter: $filter) {
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
export const onCreateCountry = /* GraphQL */ `
  subscription OnCreateCountry($filter: ModelSubscriptionCountryFilterInput) {
    onCreateCountry(filter: $filter) {
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
export const onUpdateCountry = /* GraphQL */ `
  subscription OnUpdateCountry($filter: ModelSubscriptionCountryFilterInput) {
    onUpdateCountry(filter: $filter) {
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
export const onDeleteCountry = /* GraphQL */ `
  subscription OnDeleteCountry($filter: ModelSubscriptionCountryFilterInput) {
    onDeleteCountry(filter: $filter) {
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
export const onCreateBusinessType = /* GraphQL */ `
  subscription OnCreateBusinessType(
    $filter: ModelSubscriptionBusinessTypeFilterInput
  ) {
    onCreateBusinessType(filter: $filter) {
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
export const onUpdateBusinessType = /* GraphQL */ `
  subscription OnUpdateBusinessType(
    $filter: ModelSubscriptionBusinessTypeFilterInput
  ) {
    onUpdateBusinessType(filter: $filter) {
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
export const onDeleteBusinessType = /* GraphQL */ `
  subscription OnDeleteBusinessType(
    $filter: ModelSubscriptionBusinessTypeFilterInput
  ) {
    onDeleteBusinessType(filter: $filter) {
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
