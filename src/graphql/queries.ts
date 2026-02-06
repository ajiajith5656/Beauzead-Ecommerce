/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getSeller = /* GraphQL */ `
  query GetSeller($id: ID!) {
    getSeller(id: $id) {
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
export const listSellers = /* GraphQL */ `
  query ListSellers(
    $filter: ModelSellerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSellers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
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
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getBanner = /* GraphQL */ `
  query GetBanner($id: ID!) {
    getBanner(id: $id) {
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
export const listBanners = /* GraphQL */ `
  query ListBanners(
    $filter: ModelBannerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBanners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getPromotion = /* GraphQL */ `
  query GetPromotion($id: ID!) {
    getPromotion(id: $id) {
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
export const listPromotions = /* GraphQL */ `
  query ListPromotions(
    $filter: ModelPromotionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPromotions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getCountry = /* GraphQL */ `
  query GetCountry($id: ID!) {
    getCountry(id: $id) {
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
export const listCountries = /* GraphQL */ `
  query ListCountries(
    $filter: ModelCountryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCountries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getBusinessType = /* GraphQL */ `
  query GetBusinessType($id: ID!) {
    getBusinessType(id: $id) {
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
export const listBusinessTypes = /* GraphQL */ `
  query ListBusinessTypes(
    $filter: ModelBusinessTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBusinessTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        is_active
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userByEmail = /* GraphQL */ `
  query UserByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const userByPhone = /* GraphQL */ `
  query UserByPhone(
    $phone: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByPhone(
      phone: $phone
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const sellerByUserId = /* GraphQL */ `
  query SellerByUserId(
    $user_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSellerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sellerByUserId(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const sellerByEmail = /* GraphQL */ `
  query SellerByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSellerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sellerByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const productsBySeller = /* GraphQL */ `
  query ProductsBySeller(
    $seller_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    productsBySeller(
      seller_id: $seller_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const productsByCategory = /* GraphQL */ `
  query ProductsByCategory(
    $category_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    productsByCategory(
      category_id: $category_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ordersByUser = /* GraphQL */ `
  query OrdersByUser(
    $user_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ordersByUser(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ordersBySeller = /* GraphQL */ `
  query OrdersBySeller(
    $seller_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ordersBySeller(
      seller_id: $seller_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const reviewsByProduct = /* GraphQL */ `
  query ReviewsByProduct(
    $product_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByProduct(
      product_id: $product_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
