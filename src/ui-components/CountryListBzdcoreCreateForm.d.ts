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
export declare type CountryListBzdcoreCreateFormInputValues = {
    countryName?: string;
    shortCode?: string;
    currency?: string;
    dialCode?: string;
};
export declare type CountryListBzdcoreCreateFormValidationValues = {
    countryName?: ValidationFunction<string>;
    shortCode?: ValidationFunction<string>;
    currency?: ValidationFunction<string>;
    dialCode?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CountryListBzdcoreCreateFormOverridesProps = {
    CountryListBzdcoreCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    countryName?: PrimitiveOverrideProps<TextFieldProps>;
    shortCode?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    dialCode?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CountryListBzdcoreCreateFormProps = React.PropsWithChildren<{
    overrides?: CountryListBzdcoreCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CountryListBzdcoreCreateFormInputValues) => CountryListBzdcoreCreateFormInputValues;
    onSuccess?: (fields: CountryListBzdcoreCreateFormInputValues) => void;
    onError?: (fields: CountryListBzdcoreCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CountryListBzdcoreCreateFormInputValues) => CountryListBzdcoreCreateFormInputValues;
    onValidate?: CountryListBzdcoreCreateFormValidationValues;
} & React.CSSProperties>;
export default function CountryListBzdcoreCreateForm(props: CountryListBzdcoreCreateFormProps): React.ReactElement;
