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
export declare type ReviewUpdateFormInputValues = {
    productId?: string;
    userId?: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
    isVerified?: boolean;
    isFlagged?: boolean;
};
export declare type ReviewUpdateFormValidationValues = {
    productId?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    rating?: ValidationFunction<number>;
    comment?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    isVerified?: ValidationFunction<boolean>;
    isFlagged?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ReviewUpdateFormOverridesProps = {
    ReviewUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    productId?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    rating?: PrimitiveOverrideProps<TextFieldProps>;
    comment?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    isVerified?: PrimitiveOverrideProps<SwitchFieldProps>;
    isFlagged?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ReviewUpdateFormProps = React.PropsWithChildren<{
    overrides?: ReviewUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    review?: any;
    onSubmit?: (fields: ReviewUpdateFormInputValues) => ReviewUpdateFormInputValues;
    onSuccess?: (fields: ReviewUpdateFormInputValues) => void;
    onError?: (fields: ReviewUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ReviewUpdateFormInputValues) => ReviewUpdateFormInputValues;
    onValidate?: ReviewUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ReviewUpdateForm(props: ReviewUpdateFormProps): React.ReactElement;
