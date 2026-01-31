/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ComplaintCreateFormInputValues = {
    userId?: string;
    subject?: string;
    description?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    assignedTo?: string;
    resolution?: string;
};
export declare type ComplaintCreateFormValidationValues = {
    userId?: ValidationFunction<string>;
    subject?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    assignedTo?: ValidationFunction<string>;
    resolution?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ComplaintCreateFormOverridesProps = {
    ComplaintCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    subject?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    assignedTo?: PrimitiveOverrideProps<TextFieldProps>;
    resolution?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ComplaintCreateFormProps = React.PropsWithChildren<{
    overrides?: ComplaintCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ComplaintCreateFormInputValues) => ComplaintCreateFormInputValues;
    onSuccess?: (fields: ComplaintCreateFormInputValues) => void;
    onError?: (fields: ComplaintCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ComplaintCreateFormInputValues) => ComplaintCreateFormInputValues;
    onValidate?: ComplaintCreateFormValidationValues;
} & React.CSSProperties>;
export default function ComplaintCreateForm(props: ComplaintCreateFormProps): React.ReactElement;
