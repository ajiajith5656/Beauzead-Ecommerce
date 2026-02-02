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
export declare type BannerCreateFormInputValues = {
    title?: string;
    subtitle?: string;
    image_url?: string;
    link_url?: string;
    position?: string;
    is_active?: boolean;
    sort_order?: number;
    created_at?: string;
};
export declare type BannerCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    subtitle?: ValidationFunction<string>;
    image_url?: ValidationFunction<string>;
    link_url?: ValidationFunction<string>;
    position?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
    sort_order?: ValidationFunction<number>;
    created_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BannerCreateFormOverridesProps = {
    BannerCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    subtitle?: PrimitiveOverrideProps<TextFieldProps>;
    image_url?: PrimitiveOverrideProps<TextFieldProps>;
    link_url?: PrimitiveOverrideProps<TextFieldProps>;
    position?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    sort_order?: PrimitiveOverrideProps<TextFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BannerCreateFormProps = React.PropsWithChildren<{
    overrides?: BannerCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BannerCreateFormInputValues) => BannerCreateFormInputValues;
    onSuccess?: (fields: BannerCreateFormInputValues) => void;
    onError?: (fields: BannerCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BannerCreateFormInputValues) => BannerCreateFormInputValues;
    onValidate?: BannerCreateFormValidationValues;
} & React.CSSProperties>;
export default function BannerCreateForm(props: BannerCreateFormProps): React.ReactElement;
