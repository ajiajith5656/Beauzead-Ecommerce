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
export declare type BusinessTypeBzdcoreUpdateFormInputValues = {
    typeName?: string;
    description?: string;
};
export declare type BusinessTypeBzdcoreUpdateFormValidationValues = {
    typeName?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BusinessTypeBzdcoreUpdateFormOverridesProps = {
    BusinessTypeBzdcoreUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    typeName?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BusinessTypeBzdcoreUpdateFormProps = React.PropsWithChildren<{
    overrides?: BusinessTypeBzdcoreUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    businessTypeBzdcore?: any;
    onSubmit?: (fields: BusinessTypeBzdcoreUpdateFormInputValues) => BusinessTypeBzdcoreUpdateFormInputValues;
    onSuccess?: (fields: BusinessTypeBzdcoreUpdateFormInputValues) => void;
    onError?: (fields: BusinessTypeBzdcoreUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BusinessTypeBzdcoreUpdateFormInputValues) => BusinessTypeBzdcoreUpdateFormInputValues;
    onValidate?: BusinessTypeBzdcoreUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BusinessTypeBzdcoreUpdateForm(props: BusinessTypeBzdcoreUpdateFormProps): React.ReactElement;
