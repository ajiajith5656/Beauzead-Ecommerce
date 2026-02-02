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
export declare type SellerUpdateFormInputValues = {
    user_id?: string;
    email?: string;
    business_name?: string;
    business_type?: string;
    gst_number?: string;
    pan_number?: string;
    phone?: string;
    address?: string;
    bank_details?: string;
    kyc_status?: string;
    kyc_documents?: string;
    badge?: string;
    is_approved?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};
export declare type SellerUpdateFormValidationValues = {
    user_id?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    business_name?: ValidationFunction<string>;
    business_type?: ValidationFunction<string>;
    gst_number?: ValidationFunction<string>;
    pan_number?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    bank_details?: ValidationFunction<string>;
    kyc_status?: ValidationFunction<string>;
    kyc_documents?: ValidationFunction<string>;
    badge?: ValidationFunction<string>;
    is_approved?: ValidationFunction<boolean>;
    is_active?: ValidationFunction<boolean>;
    created_at?: ValidationFunction<string>;
    updated_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SellerUpdateFormOverridesProps = {
    SellerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    user_id?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    business_name?: PrimitiveOverrideProps<TextFieldProps>;
    business_type?: PrimitiveOverrideProps<TextFieldProps>;
    gst_number?: PrimitiveOverrideProps<TextFieldProps>;
    pan_number?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextAreaFieldProps>;
    bank_details?: PrimitiveOverrideProps<TextAreaFieldProps>;
    kyc_status?: PrimitiveOverrideProps<TextFieldProps>;
    kyc_documents?: PrimitiveOverrideProps<TextAreaFieldProps>;
    badge?: PrimitiveOverrideProps<TextFieldProps>;
    is_approved?: PrimitiveOverrideProps<SwitchFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
    updated_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SellerUpdateFormProps = React.PropsWithChildren<{
    overrides?: SellerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    seller?: any;
    onSubmit?: (fields: SellerUpdateFormInputValues) => SellerUpdateFormInputValues;
    onSuccess?: (fields: SellerUpdateFormInputValues) => void;
    onError?: (fields: SellerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SellerUpdateFormInputValues) => SellerUpdateFormInputValues;
    onValidate?: SellerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SellerUpdateForm(props: SellerUpdateFormProps): React.ReactElement;
