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
export declare type CategoryUpdateFormInputValues = {
    name?: string;
    slug?: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
    sub_categories?: string;
    is_active?: boolean;
    sort_order?: number;
    created_at?: string;
};
export declare type CategoryUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    slug?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    image_url?: ValidationFunction<string>;
    parent_id?: ValidationFunction<string>;
    sub_categories?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
    sort_order?: ValidationFunction<number>;
    created_at?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CategoryUpdateFormOverridesProps = {
    CategoryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    slug?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    image_url?: PrimitiveOverrideProps<TextFieldProps>;
    parent_id?: PrimitiveOverrideProps<TextFieldProps>;
    sub_categories?: PrimitiveOverrideProps<TextAreaFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    sort_order?: PrimitiveOverrideProps<TextFieldProps>;
    created_at?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CategoryUpdateFormProps = React.PropsWithChildren<{
    overrides?: CategoryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    category?: any;
    onSubmit?: (fields: CategoryUpdateFormInputValues) => CategoryUpdateFormInputValues;
    onSuccess?: (fields: CategoryUpdateFormInputValues) => void;
    onError?: (fields: CategoryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CategoryUpdateFormInputValues) => CategoryUpdateFormInputValues;
    onValidate?: CategoryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CategoryUpdateForm(props: CategoryUpdateFormProps): React.ReactElement;
