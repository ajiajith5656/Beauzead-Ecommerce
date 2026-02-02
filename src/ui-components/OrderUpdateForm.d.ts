/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type OrderUpdateFormInputValues = {
    user_id?: string;
    seller_id?: string;
    order_number?: string;
    status?: string;
    items?: string;
    subtotal?: number;
    shipping_cost?: number;
    tax_amount?: number;
    discount_amount?: number;
    total_amount?: number;
    currency?: string;
    shipping_address?: string;
    billing_address?: string;
    payment_method?: string;
    payment_status?: string;
    payment_intent_id?: string;
    tracking_number?: string;
    created_at?: string;
    updated_at?: string;
};
export declare type OrderUpdateFormValidationValues = {
    user_id?: ValidationFunction<string>;
    seller_id?: ValidationFunction<string>;
    order_number?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    items?: ValidationFunction<string>;
    subtotal?: ValidationFunction<number>;
    shipping_cost?: ValidationFunction<number>;
    tax_amount?: ValidationFunction<number>;
    discount_amount?: ValidationFunction<number>;
    total_amount?: ValidationFunction<number>;
    currency?: ValidationFunction<string>;
    shipping_address?: ValidationFunction<string>;
    billing_address?: ValidationFunction<string>;
    payment_method?: ValidationFunction<string>;
    payment_status?: ValidationFunction<string>;
    payment_intent_id?: ValidationFunction<string>;
    tracking_number?: ValidationFunction<string>;
    created_at?: ValidationFunction<string>;
    updated_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OrderUpdateFormOverridesProps = {
    OrderUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    user_id?: PrimitiveOverrideProps<TextFieldProps>;
    seller_id?: PrimitiveOverrideProps<TextFieldProps>;
    order_number?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    items?: PrimitiveOverrideProps<TextAreaFieldProps>;
    subtotal?: PrimitiveOverrideProps<TextFieldProps>;
    shipping_cost?: PrimitiveOverrideProps<TextFieldProps>;
    tax_amount?: PrimitiveOverrideProps<TextFieldProps>;
    discount_amount?: PrimitiveOverrideProps<TextFieldProps>;
    total_amount?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    shipping_address?: PrimitiveOverrideProps<TextAreaFieldProps>;
    billing_address?: PrimitiveOverrideProps<TextAreaFieldProps>;
    payment_method?: PrimitiveOverrideProps<TextFieldProps>;
    payment_status?: PrimitiveOverrideProps<TextFieldProps>;
    payment_intent_id?: PrimitiveOverrideProps<TextFieldProps>;
    tracking_number?: PrimitiveOverrideProps<TextFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
    updated_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type OrderUpdateFormProps = React.PropsWithChildren<{
    overrides?: OrderUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    order?: any;
    onSubmit?: (fields: OrderUpdateFormInputValues) => OrderUpdateFormInputValues;
    onSuccess?: (fields: OrderUpdateFormInputValues) => void;
    onError?: (fields: OrderUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OrderUpdateFormInputValues) => OrderUpdateFormInputValues;
    onValidate?: OrderUpdateFormValidationValues;
} & React.CSSProperties>;
export default function OrderUpdateForm(props: OrderUpdateFormProps): React.ReactElement;
