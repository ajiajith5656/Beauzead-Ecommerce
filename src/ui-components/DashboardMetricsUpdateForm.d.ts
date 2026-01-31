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
export declare type DashboardMetricsUpdateFormInputValues = {
    totalSales?: number;
    totalExpenses?: number;
    totalProducts?: number;
    totalUsers?: number;
    totalSellers?: number;
    totalBookings?: number;
    ongoingOrders?: number;
    returnsCancellations?: number;
    userRegistrations?: number;
    primeMembers?: number;
    sellerRegistrations?: number;
    createdAt?: string;
    updatedAt?: string;
};
export declare type DashboardMetricsUpdateFormValidationValues = {
    totalSales?: ValidationFunction<number>;
    totalExpenses?: ValidationFunction<number>;
    totalProducts?: ValidationFunction<number>;
    totalUsers?: ValidationFunction<number>;
    totalSellers?: ValidationFunction<number>;
    totalBookings?: ValidationFunction<number>;
    ongoingOrders?: ValidationFunction<number>;
    returnsCancellations?: ValidationFunction<number>;
    userRegistrations?: ValidationFunction<number>;
    primeMembers?: ValidationFunction<number>;
    sellerRegistrations?: ValidationFunction<number>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DashboardMetricsUpdateFormOverridesProps = {
    DashboardMetricsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    totalSales?: PrimitiveOverrideProps<TextFieldProps>;
    totalExpenses?: PrimitiveOverrideProps<TextFieldProps>;
    totalProducts?: PrimitiveOverrideProps<TextFieldProps>;
    totalUsers?: PrimitiveOverrideProps<TextFieldProps>;
    totalSellers?: PrimitiveOverrideProps<TextFieldProps>;
    totalBookings?: PrimitiveOverrideProps<TextFieldProps>;
    ongoingOrders?: PrimitiveOverrideProps<TextFieldProps>;
    returnsCancellations?: PrimitiveOverrideProps<TextFieldProps>;
    userRegistrations?: PrimitiveOverrideProps<TextFieldProps>;
    primeMembers?: PrimitiveOverrideProps<TextFieldProps>;
    sellerRegistrations?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DashboardMetricsUpdateFormProps = React.PropsWithChildren<{
    overrides?: DashboardMetricsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    dashboardMetrics?: any;
    onSubmit?: (fields: DashboardMetricsUpdateFormInputValues) => DashboardMetricsUpdateFormInputValues;
    onSuccess?: (fields: DashboardMetricsUpdateFormInputValues) => void;
    onError?: (fields: DashboardMetricsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DashboardMetricsUpdateFormInputValues) => DashboardMetricsUpdateFormInputValues;
    onValidate?: DashboardMetricsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DashboardMetricsUpdateForm(props: DashboardMetricsUpdateFormProps): React.ReactElement;
