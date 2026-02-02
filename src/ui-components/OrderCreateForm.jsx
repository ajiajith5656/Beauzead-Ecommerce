/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createOrder } from "../graphql/mutations";
const client = generateClient();
export default function OrderCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    user_id: "",
    seller_id: "",
    order_number: "",
    status: "",
    items: "",
    subtotal: "",
    shipping_cost: "",
    tax_amount: "",
    discount_amount: "",
    total_amount: "",
    currency: "",
    shipping_address: "",
    billing_address: "",
    payment_method: "",
    payment_status: "",
    payment_intent_id: "",
    tracking_number: "",
    created_at: "",
    updated_at: "",
  };
  const [user_id, setUser_id] = React.useState(initialValues.user_id);
  const [seller_id, setSeller_id] = React.useState(initialValues.seller_id);
  const [order_number, setOrder_number] = React.useState(
    initialValues.order_number
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [items, setItems] = React.useState(initialValues.items);
  const [subtotal, setSubtotal] = React.useState(initialValues.subtotal);
  const [shipping_cost, setShipping_cost] = React.useState(
    initialValues.shipping_cost
  );
  const [tax_amount, setTax_amount] = React.useState(initialValues.tax_amount);
  const [discount_amount, setDiscount_amount] = React.useState(
    initialValues.discount_amount
  );
  const [total_amount, setTotal_amount] = React.useState(
    initialValues.total_amount
  );
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [shipping_address, setShipping_address] = React.useState(
    initialValues.shipping_address
  );
  const [billing_address, setBilling_address] = React.useState(
    initialValues.billing_address
  );
  const [payment_method, setPayment_method] = React.useState(
    initialValues.payment_method
  );
  const [payment_status, setPayment_status] = React.useState(
    initialValues.payment_status
  );
  const [payment_intent_id, setPayment_intent_id] = React.useState(
    initialValues.payment_intent_id
  );
  const [tracking_number, setTracking_number] = React.useState(
    initialValues.tracking_number
  );
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [updated_at, setUpdated_at] = React.useState(initialValues.updated_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUser_id(initialValues.user_id);
    setSeller_id(initialValues.seller_id);
    setOrder_number(initialValues.order_number);
    setStatus(initialValues.status);
    setItems(initialValues.items);
    setSubtotal(initialValues.subtotal);
    setShipping_cost(initialValues.shipping_cost);
    setTax_amount(initialValues.tax_amount);
    setDiscount_amount(initialValues.discount_amount);
    setTotal_amount(initialValues.total_amount);
    setCurrency(initialValues.currency);
    setShipping_address(initialValues.shipping_address);
    setBilling_address(initialValues.billing_address);
    setPayment_method(initialValues.payment_method);
    setPayment_status(initialValues.payment_status);
    setPayment_intent_id(initialValues.payment_intent_id);
    setTracking_number(initialValues.tracking_number);
    setCreated_at(initialValues.created_at);
    setUpdated_at(initialValues.updated_at);
    setErrors({});
  };
  const validations = {
    user_id: [{ type: "Required" }],
    seller_id: [],
    order_number: [{ type: "Required" }],
    status: [{ type: "Required" }],
    items: [{ type: "Required" }, { type: "JSON" }],
    subtotal: [{ type: "Required" }],
    shipping_cost: [],
    tax_amount: [],
    discount_amount: [],
    total_amount: [{ type: "Required" }],
    currency: [],
    shipping_address: [{ type: "Required" }, { type: "JSON" }],
    billing_address: [{ type: "JSON" }],
    payment_method: [],
    payment_status: [],
    payment_intent_id: [],
    tracking_number: [],
    created_at: [],
    updated_at: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          user_id,
          seller_id,
          order_number,
          status,
          items,
          subtotal,
          shipping_cost,
          tax_amount,
          discount_amount,
          total_amount,
          currency,
          shipping_address,
          billing_address,
          payment_method,
          payment_status,
          payment_intent_id,
          tracking_number,
          created_at,
          updated_at,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createOrder.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "OrderCreateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={user_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id: value,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.user_id ?? value;
          }
          if (errors.user_id?.hasError) {
            runValidationTasks("user_id", value);
          }
          setUser_id(value);
        }}
        onBlur={() => runValidationTasks("user_id", user_id)}
        errorMessage={errors.user_id?.errorMessage}
        hasError={errors.user_id?.hasError}
        {...getOverrideProps(overrides, "user_id")}
      ></TextField>
      <TextField
        label="Seller id"
        isRequired={false}
        isReadOnly={false}
        value={seller_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id: value,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.seller_id ?? value;
          }
          if (errors.seller_id?.hasError) {
            runValidationTasks("seller_id", value);
          }
          setSeller_id(value);
        }}
        onBlur={() => runValidationTasks("seller_id", seller_id)}
        errorMessage={errors.seller_id?.errorMessage}
        hasError={errors.seller_id?.hasError}
        {...getOverrideProps(overrides, "seller_id")}
      ></TextField>
      <TextField
        label="Order number"
        isRequired={true}
        isReadOnly={false}
        value={order_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number: value,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.order_number ?? value;
          }
          if (errors.order_number?.hasError) {
            runValidationTasks("order_number", value);
          }
          setOrder_number(value);
        }}
        onBlur={() => runValidationTasks("order_number", order_number)}
        errorMessage={errors.order_number?.errorMessage}
        hasError={errors.order_number?.hasError}
        {...getOverrideProps(overrides, "order_number")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={true}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status: value,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextAreaField
        label="Items"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items: value,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.items ?? value;
          }
          if (errors.items?.hasError) {
            runValidationTasks("items", value);
          }
          setItems(value);
        }}
        onBlur={() => runValidationTasks("items", items)}
        errorMessage={errors.items?.errorMessage}
        hasError={errors.items?.hasError}
        {...getOverrideProps(overrides, "items")}
      ></TextAreaField>
      <TextField
        label="Subtotal"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={subtotal}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal: value,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.subtotal ?? value;
          }
          if (errors.subtotal?.hasError) {
            runValidationTasks("subtotal", value);
          }
          setSubtotal(value);
        }}
        onBlur={() => runValidationTasks("subtotal", subtotal)}
        errorMessage={errors.subtotal?.errorMessage}
        hasError={errors.subtotal?.hasError}
        {...getOverrideProps(overrides, "subtotal")}
      ></TextField>
      <TextField
        label="Shipping cost"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={shipping_cost}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost: value,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.shipping_cost ?? value;
          }
          if (errors.shipping_cost?.hasError) {
            runValidationTasks("shipping_cost", value);
          }
          setShipping_cost(value);
        }}
        onBlur={() => runValidationTasks("shipping_cost", shipping_cost)}
        errorMessage={errors.shipping_cost?.errorMessage}
        hasError={errors.shipping_cost?.hasError}
        {...getOverrideProps(overrides, "shipping_cost")}
      ></TextField>
      <TextField
        label="Tax amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={tax_amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount: value,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.tax_amount ?? value;
          }
          if (errors.tax_amount?.hasError) {
            runValidationTasks("tax_amount", value);
          }
          setTax_amount(value);
        }}
        onBlur={() => runValidationTasks("tax_amount", tax_amount)}
        errorMessage={errors.tax_amount?.errorMessage}
        hasError={errors.tax_amount?.hasError}
        {...getOverrideProps(overrides, "tax_amount")}
      ></TextField>
      <TextField
        label="Discount amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={discount_amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount: value,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.discount_amount ?? value;
          }
          if (errors.discount_amount?.hasError) {
            runValidationTasks("discount_amount", value);
          }
          setDiscount_amount(value);
        }}
        onBlur={() => runValidationTasks("discount_amount", discount_amount)}
        errorMessage={errors.discount_amount?.errorMessage}
        hasError={errors.discount_amount?.hasError}
        {...getOverrideProps(overrides, "discount_amount")}
      ></TextField>
      <TextField
        label="Total amount"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={total_amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount: value,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.total_amount ?? value;
          }
          if (errors.total_amount?.hasError) {
            runValidationTasks("total_amount", value);
          }
          setTotal_amount(value);
        }}
        onBlur={() => runValidationTasks("total_amount", total_amount)}
        errorMessage={errors.total_amount?.errorMessage}
        hasError={errors.total_amount?.hasError}
        {...getOverrideProps(overrides, "total_amount")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={false}
        isReadOnly={false}
        value={currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency: value,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.currency ?? value;
          }
          if (errors.currency?.hasError) {
            runValidationTasks("currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("currency", currency)}
        errorMessage={errors.currency?.errorMessage}
        hasError={errors.currency?.hasError}
        {...getOverrideProps(overrides, "currency")}
      ></TextField>
      <TextAreaField
        label="Shipping address"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address: value,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.shipping_address ?? value;
          }
          if (errors.shipping_address?.hasError) {
            runValidationTasks("shipping_address", value);
          }
          setShipping_address(value);
        }}
        onBlur={() => runValidationTasks("shipping_address", shipping_address)}
        errorMessage={errors.shipping_address?.errorMessage}
        hasError={errors.shipping_address?.hasError}
        {...getOverrideProps(overrides, "shipping_address")}
      ></TextAreaField>
      <TextAreaField
        label="Billing address"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address: value,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.billing_address ?? value;
          }
          if (errors.billing_address?.hasError) {
            runValidationTasks("billing_address", value);
          }
          setBilling_address(value);
        }}
        onBlur={() => runValidationTasks("billing_address", billing_address)}
        errorMessage={errors.billing_address?.errorMessage}
        hasError={errors.billing_address?.hasError}
        {...getOverrideProps(overrides, "billing_address")}
      ></TextAreaField>
      <TextField
        label="Payment method"
        isRequired={false}
        isReadOnly={false}
        value={payment_method}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method: value,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.payment_method ?? value;
          }
          if (errors.payment_method?.hasError) {
            runValidationTasks("payment_method", value);
          }
          setPayment_method(value);
        }}
        onBlur={() => runValidationTasks("payment_method", payment_method)}
        errorMessage={errors.payment_method?.errorMessage}
        hasError={errors.payment_method?.hasError}
        {...getOverrideProps(overrides, "payment_method")}
      ></TextField>
      <TextField
        label="Payment status"
        isRequired={false}
        isReadOnly={false}
        value={payment_status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status: value,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.payment_status ?? value;
          }
          if (errors.payment_status?.hasError) {
            runValidationTasks("payment_status", value);
          }
          setPayment_status(value);
        }}
        onBlur={() => runValidationTasks("payment_status", payment_status)}
        errorMessage={errors.payment_status?.errorMessage}
        hasError={errors.payment_status?.hasError}
        {...getOverrideProps(overrides, "payment_status")}
      ></TextField>
      <TextField
        label="Payment intent id"
        isRequired={false}
        isReadOnly={false}
        value={payment_intent_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id: value,
              tracking_number,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.payment_intent_id ?? value;
          }
          if (errors.payment_intent_id?.hasError) {
            runValidationTasks("payment_intent_id", value);
          }
          setPayment_intent_id(value);
        }}
        onBlur={() =>
          runValidationTasks("payment_intent_id", payment_intent_id)
        }
        errorMessage={errors.payment_intent_id?.errorMessage}
        hasError={errors.payment_intent_id?.hasError}
        {...getOverrideProps(overrides, "payment_intent_id")}
      ></TextField>
      <TextField
        label="Tracking number"
        isRequired={false}
        isReadOnly={false}
        value={tracking_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number: value,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.tracking_number ?? value;
          }
          if (errors.tracking_number?.hasError) {
            runValidationTasks("tracking_number", value);
          }
          setTracking_number(value);
        }}
        onBlur={() => runValidationTasks("tracking_number", tracking_number)}
        errorMessage={errors.tracking_number?.errorMessage}
        hasError={errors.tracking_number?.hasError}
        {...getOverrideProps(overrides, "tracking_number")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={created_at && convertToLocal(new Date(created_at))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at: value,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.created_at ?? value;
          }
          if (errors.created_at?.hasError) {
            runValidationTasks("created_at", value);
          }
          setCreated_at(value);
        }}
        onBlur={() => runValidationTasks("created_at", created_at)}
        errorMessage={errors.created_at?.errorMessage}
        hasError={errors.created_at?.hasError}
        {...getOverrideProps(overrides, "created_at")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updated_at && convertToLocal(new Date(updated_at))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              user_id,
              seller_id,
              order_number,
              status,
              items,
              subtotal,
              shipping_cost,
              tax_amount,
              discount_amount,
              total_amount,
              currency,
              shipping_address,
              billing_address,
              payment_method,
              payment_status,
              payment_intent_id,
              tracking_number,
              created_at,
              updated_at: value,
            };
            const result = onChange(modelFields);
            value = result?.updated_at ?? value;
          }
          if (errors.updated_at?.hasError) {
            runValidationTasks("updated_at", value);
          }
          setUpdated_at(value);
        }}
        onBlur={() => runValidationTasks("updated_at", updated_at)}
        errorMessage={errors.updated_at?.errorMessage}
        hasError={errors.updated_at?.hasError}
        {...getOverrideProps(overrides, "updated_at")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
