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
export declare type ComplaintUpdateFormInputValues = {
    userId?: string;
    subject?: string;
    description?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    assignedTo?: string;
    resolution?: string;
};
export declare type ComplaintUpdateFormValidationValues = {
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
export declare type ComplaintUpdateFormOverridesProps = {
    ComplaintUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    subject?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    assignedTo?: PrimitiveOverrideProps<TextFieldProps>;
    resolution?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ComplaintUpdateFormProps = React.PropsWithChildren<{
    overrides?: ComplaintUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    complaint?: any;
    onSubmit?: (fields: ComplaintUpdateFormInputValues) => ComplaintUpdateFormInputValues;
    onSuccess?: (fields: ComplaintUpdateFormInputValues) => void;
    onError?: (fields: ComplaintUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ComplaintUpdateFormInputValues) => ComplaintUpdateFormInputValues;
    onValidate?: ComplaintUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ComplaintUpdateForm(props: ComplaintUpdateFormProps): React.ReactElement;
