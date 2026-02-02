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
export declare type BusinessTypeUpdateFormInputValues = {
    name?: string;
    description?: string;
    is_active?: boolean;
};
export declare type BusinessTypeUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BusinessTypeUpdateFormOverridesProps = {
    BusinessTypeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type BusinessTypeUpdateFormProps = React.PropsWithChildren<{
    overrides?: BusinessTypeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    businessType?: any;
    onSubmit?: (fields: BusinessTypeUpdateFormInputValues) => BusinessTypeUpdateFormInputValues;
    onSuccess?: (fields: BusinessTypeUpdateFormInputValues) => void;
    onError?: (fields: BusinessTypeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BusinessTypeUpdateFormInputValues) => BusinessTypeUpdateFormInputValues;
    onValidate?: BusinessTypeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BusinessTypeUpdateForm(props: BusinessTypeUpdateFormProps): React.ReactElement;
