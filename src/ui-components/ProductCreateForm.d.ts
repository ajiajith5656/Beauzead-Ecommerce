/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ProductCreateFormInputValues = {
    seller_id?: string;
    category_id?: string;
    sub_category_id?: string;
    name?: string;
    brand_name?: string;
    model_number?: string;
    short_description?: string;
    description?: string;
    highlights?: string[];
    specifications?: string;
    image_url?: string;
    images?: string[];
    videos?: string[];
    price?: number;
    mrp?: number;
    currency?: string;
    stock?: number;
    size_variants?: string;
    color_variants?: string;
    gst_rate?: number;
    platform_fee?: number;
    commission?: number;
    delivery_countries?: string;
    package_weight?: number;
    package_dimensions?: string;
    shipping_type?: string;
    manufacturer_name?: string;
    cancellation_policy_days?: number;
    return_policy_days?: number;
    offer_rules?: string;
    approval_status?: string;
    is_active?: boolean;
    rating?: number;
    review_count?: number;
    created_at?: string;
    updated_at?: string;
};
export declare type ProductCreateFormValidationValues = {
    seller_id?: ValidationFunction<string>;
    category_id?: ValidationFunction<string>;
    sub_category_id?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    brand_name?: ValidationFunction<string>;
    model_number?: ValidationFunction<string>;
    short_description?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    highlights?: ValidationFunction<string>;
    specifications?: ValidationFunction<string>;
    image_url?: ValidationFunction<string>;
    images?: ValidationFunction<string>;
    videos?: ValidationFunction<string>;
    price?: ValidationFunction<number>;
    mrp?: ValidationFunction<number>;
    currency?: ValidationFunction<string>;
    stock?: ValidationFunction<number>;
    size_variants?: ValidationFunction<string>;
    color_variants?: ValidationFunction<string>;
    gst_rate?: ValidationFunction<number>;
    platform_fee?: ValidationFunction<number>;
    commission?: ValidationFunction<number>;
    delivery_countries?: ValidationFunction<string>;
    package_weight?: ValidationFunction<number>;
    package_dimensions?: ValidationFunction<string>;
    shipping_type?: ValidationFunction<string>;
    manufacturer_name?: ValidationFunction<string>;
    cancellation_policy_days?: ValidationFunction<number>;
    return_policy_days?: ValidationFunction<number>;
    offer_rules?: ValidationFunction<string>;
    approval_status?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
    rating?: ValidationFunction<number>;
    review_count?: ValidationFunction<number>;
    created_at?: ValidationFunction<string>;
    updated_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductCreateFormOverridesProps = {
    ProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    seller_id?: PrimitiveOverrideProps<TextFieldProps>;
    category_id?: PrimitiveOverrideProps<TextFieldProps>;
    sub_category_id?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    brand_name?: PrimitiveOverrideProps<TextFieldProps>;
    model_number?: PrimitiveOverrideProps<TextFieldProps>;
    short_description?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    highlights?: PrimitiveOverrideProps<TextFieldProps>;
    specifications?: PrimitiveOverrideProps<TextAreaFieldProps>;
    image_url?: PrimitiveOverrideProps<TextFieldProps>;
    images?: PrimitiveOverrideProps<TextFieldProps>;
    videos?: PrimitiveOverrideProps<TextFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    mrp?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    stock?: PrimitiveOverrideProps<TextFieldProps>;
    size_variants?: PrimitiveOverrideProps<TextAreaFieldProps>;
    color_variants?: PrimitiveOverrideProps<TextAreaFieldProps>;
    gst_rate?: PrimitiveOverrideProps<TextFieldProps>;
    platform_fee?: PrimitiveOverrideProps<TextFieldProps>;
    commission?: PrimitiveOverrideProps<TextFieldProps>;
    delivery_countries?: PrimitiveOverrideProps<TextAreaFieldProps>;
    package_weight?: PrimitiveOverrideProps<TextFieldProps>;
    package_dimensions?: PrimitiveOverrideProps<TextAreaFieldProps>;
    shipping_type?: PrimitiveOverrideProps<TextFieldProps>;
    manufacturer_name?: PrimitiveOverrideProps<TextFieldProps>;
    cancellation_policy_days?: PrimitiveOverrideProps<TextFieldProps>;
    return_policy_days?: PrimitiveOverrideProps<TextFieldProps>;
    offer_rules?: PrimitiveOverrideProps<TextAreaFieldProps>;
    approval_status?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    rating?: PrimitiveOverrideProps<TextFieldProps>;
    review_count?: PrimitiveOverrideProps<TextFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
    updated_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProductCreateFormProps = React.PropsWithChildren<{
    overrides?: ProductCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProductCreateFormInputValues) => ProductCreateFormInputValues;
    onSuccess?: (fields: ProductCreateFormInputValues) => void;
    onError?: (fields: ProductCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductCreateFormInputValues) => ProductCreateFormInputValues;
    onValidate?: ProductCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProductCreateForm(props: ProductCreateFormProps): React.ReactElement;
