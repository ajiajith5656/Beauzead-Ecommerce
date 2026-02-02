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
export declare type CountryUpdateFormInputValues = {
    name?: string;
    code?: string;
    currency?: string;
    dial_code?: string;
    is_active?: boolean;
};
export declare type CountryUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    code?: ValidationFunction<string>;
    currency?: ValidationFunction<string>;
    dial_code?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CountryUpdateFormOverridesProps = {
    CountryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    code?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    dial_code?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type CountryUpdateFormProps = React.PropsWithChildren<{
    overrides?: CountryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    country?: any;
    onSubmit?: (fields: CountryUpdateFormInputValues) => CountryUpdateFormInputValues;
    onSuccess?: (fields: CountryUpdateFormInputValues) => void;
    onError?: (fields: CountryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CountryUpdateFormInputValues) => CountryUpdateFormInputValues;
    onValidate?: CountryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CountryUpdateForm(props: CountryUpdateFormProps): React.ReactElement;
