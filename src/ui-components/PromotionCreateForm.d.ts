/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type PromotionCreateFormInputValues = {
    code?: string;
    name?: string;
    discount_type?: string;
    discount_value?: number;
    min_order_amount?: number;
    max_discount?: number;
    usage_limit?: number;
    used_count?: number;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
    created_at?: string;
};
export declare type PromotionCreateFormValidationValues = {
    code?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    discount_type?: ValidationFunction<string>;
    discount_value?: ValidationFunction<number>;
    min_order_amount?: ValidationFunction<number>;
    max_discount?: ValidationFunction<number>;
    usage_limit?: ValidationFunction<number>;
    used_count?: ValidationFunction<number>;
    is_active?: ValidationFunction<boolean>;
    start_date?: ValidationFunction<string>;
    end_date?: ValidationFunction<string>;
    created_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PromotionCreateFormOverridesProps = {
    PromotionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    code?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    discount_type?: PrimitiveOverrideProps<TextFieldProps>;
    discount_value?: PrimitiveOverrideProps<TextFieldProps>;
    min_order_amount?: PrimitiveOverrideProps<TextFieldProps>;
    max_discount?: PrimitiveOverrideProps<TextFieldProps>;
    usage_limit?: PrimitiveOverrideProps<TextFieldProps>;
    used_count?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    start_date?: PrimitiveOverrideProps<TextFieldProps>;
    end_date?: PrimitiveOverrideProps<TextFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PromotionCreateFormProps = React.PropsWithChildren<{
    overrides?: PromotionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PromotionCreateFormInputValues) => PromotionCreateFormInputValues;
    onSuccess?: (fields: PromotionCreateFormInputValues) => void;
    onError?: (fields: PromotionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PromotionCreateFormInputValues) => PromotionCreateFormInputValues;
    onValidate?: PromotionCreateFormValidationValues;
} & React.CSSProperties>;
export default function PromotionCreateForm(props: PromotionCreateFormProps): React.ReactElement;
