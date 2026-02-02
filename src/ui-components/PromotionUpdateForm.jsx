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
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getPromotion } from "../graphql/queries";
import { updatePromotion } from "../graphql/mutations";
const client = generateClient();
export default function PromotionUpdateForm(props) {
  const {
    id: idProp,
    promotion: promotionModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    code: "",
    name: "",
    discount_type: "",
    discount_value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "",
    used_count: "",
    is_active: false,
    start_date: "",
    end_date: "",
    created_at: "",
  };
  const [code, setCode] = React.useState(initialValues.code);
  const [name, setName] = React.useState(initialValues.name);
  const [discount_type, setDiscount_type] = React.useState(
    initialValues.discount_type
  );
  const [discount_value, setDiscount_value] = React.useState(
    initialValues.discount_value
  );
  const [min_order_amount, setMin_order_amount] = React.useState(
    initialValues.min_order_amount
  );
  const [max_discount, setMax_discount] = React.useState(
    initialValues.max_discount
  );
  const [usage_limit, setUsage_limit] = React.useState(
    initialValues.usage_limit
  );
  const [used_count, setUsed_count] = React.useState(initialValues.used_count);
  const [is_active, setIs_active] = React.useState(initialValues.is_active);
  const [start_date, setStart_date] = React.useState(initialValues.start_date);
  const [end_date, setEnd_date] = React.useState(initialValues.end_date);
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = promotionRecord
      ? { ...initialValues, ...promotionRecord }
      : initialValues;
    setCode(cleanValues.code);
    setName(cleanValues.name);
    setDiscount_type(cleanValues.discount_type);
    setDiscount_value(cleanValues.discount_value);
    setMin_order_amount(cleanValues.min_order_amount);
    setMax_discount(cleanValues.max_discount);
    setUsage_limit(cleanValues.usage_limit);
    setUsed_count(cleanValues.used_count);
    setIs_active(cleanValues.is_active);
    setStart_date(cleanValues.start_date);
    setEnd_date(cleanValues.end_date);
    setCreated_at(cleanValues.created_at);
    setErrors({});
  };
  const [promotionRecord, setPromotionRecord] =
    React.useState(promotionModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getPromotion.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getPromotion
        : promotionModelProp;
      setPromotionRecord(record);
    };
    queryData();
  }, [idProp, promotionModelProp]);
  React.useEffect(resetStateValues, [promotionRecord]);
  const validations = {
    code: [{ type: "Required" }],
    name: [{ type: "Required" }],
    discount_type: [{ type: "Required" }],
    discount_value: [{ type: "Required" }],
    min_order_amount: [],
    max_discount: [],
    usage_limit: [],
    used_count: [],
    is_active: [],
    start_date: [],
    end_date: [],
    created_at: [],
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
          code,
          name,
          discount_type,
          discount_value,
          min_order_amount: min_order_amount ?? null,
          max_discount: max_discount ?? null,
          usage_limit: usage_limit ?? null,
          used_count: used_count ?? null,
          is_active: is_active ?? null,
          start_date: start_date ?? null,
          end_date: end_date ?? null,
          created_at: created_at ?? null,
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
            query: updatePromotion.replaceAll("__typename", ""),
            variables: {
              input: {
                id: promotionRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PromotionUpdateForm")}
      {...rest}
    >
      <TextField
        label="Code"
        isRequired={true}
        isReadOnly={false}
        value={code}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code: value,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.code ?? value;
          }
          if (errors.code?.hasError) {
            runValidationTasks("code", value);
          }
          setCode(value);
        }}
        onBlur={() => runValidationTasks("code", code)}
        errorMessage={errors.code?.errorMessage}
        hasError={errors.code?.hasError}
        {...getOverrideProps(overrides, "code")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name: value,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Discount type"
        isRequired={true}
        isReadOnly={false}
        value={discount_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type: value,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.discount_type ?? value;
          }
          if (errors.discount_type?.hasError) {
            runValidationTasks("discount_type", value);
          }
          setDiscount_type(value);
        }}
        onBlur={() => runValidationTasks("discount_type", discount_type)}
        errorMessage={errors.discount_type?.errorMessage}
        hasError={errors.discount_type?.hasError}
        {...getOverrideProps(overrides, "discount_type")}
      ></TextField>
      <TextField
        label="Discount value"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={discount_value}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value: value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.discount_value ?? value;
          }
          if (errors.discount_value?.hasError) {
            runValidationTasks("discount_value", value);
          }
          setDiscount_value(value);
        }}
        onBlur={() => runValidationTasks("discount_value", discount_value)}
        errorMessage={errors.discount_value?.errorMessage}
        hasError={errors.discount_value?.hasError}
        {...getOverrideProps(overrides, "discount_value")}
      ></TextField>
      <TextField
        label="Min order amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={min_order_amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount: value,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.min_order_amount ?? value;
          }
          if (errors.min_order_amount?.hasError) {
            runValidationTasks("min_order_amount", value);
          }
          setMin_order_amount(value);
        }}
        onBlur={() => runValidationTasks("min_order_amount", min_order_amount)}
        errorMessage={errors.min_order_amount?.errorMessage}
        hasError={errors.min_order_amount?.hasError}
        {...getOverrideProps(overrides, "min_order_amount")}
      ></TextField>
      <TextField
        label="Max discount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={max_discount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount: value,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.max_discount ?? value;
          }
          if (errors.max_discount?.hasError) {
            runValidationTasks("max_discount", value);
          }
          setMax_discount(value);
        }}
        onBlur={() => runValidationTasks("max_discount", max_discount)}
        errorMessage={errors.max_discount?.errorMessage}
        hasError={errors.max_discount?.hasError}
        {...getOverrideProps(overrides, "max_discount")}
      ></TextField>
      <TextField
        label="Usage limit"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={usage_limit}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit: value,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.usage_limit ?? value;
          }
          if (errors.usage_limit?.hasError) {
            runValidationTasks("usage_limit", value);
          }
          setUsage_limit(value);
        }}
        onBlur={() => runValidationTasks("usage_limit", usage_limit)}
        errorMessage={errors.usage_limit?.errorMessage}
        hasError={errors.usage_limit?.hasError}
        {...getOverrideProps(overrides, "usage_limit")}
      ></TextField>
      <TextField
        label="Used count"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={used_count}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count: value,
              is_active,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.used_count ?? value;
          }
          if (errors.used_count?.hasError) {
            runValidationTasks("used_count", value);
          }
          setUsed_count(value);
        }}
        onBlur={() => runValidationTasks("used_count", used_count)}
        errorMessage={errors.used_count?.errorMessage}
        hasError={errors.used_count?.hasError}
        {...getOverrideProps(overrides, "used_count")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_active}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active: value,
              start_date,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.is_active ?? value;
          }
          if (errors.is_active?.hasError) {
            runValidationTasks("is_active", value);
          }
          setIs_active(value);
        }}
        onBlur={() => runValidationTasks("is_active", is_active)}
        errorMessage={errors.is_active?.errorMessage}
        hasError={errors.is_active?.hasError}
        {...getOverrideProps(overrides, "is_active")}
      ></SwitchField>
      <TextField
        label="Start date"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={start_date && convertToLocal(new Date(start_date))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date: value,
              end_date,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.start_date ?? value;
          }
          if (errors.start_date?.hasError) {
            runValidationTasks("start_date", value);
          }
          setStart_date(value);
        }}
        onBlur={() => runValidationTasks("start_date", start_date)}
        errorMessage={errors.start_date?.errorMessage}
        hasError={errors.start_date?.hasError}
        {...getOverrideProps(overrides, "start_date")}
      ></TextField>
      <TextField
        label="End date"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={end_date && convertToLocal(new Date(end_date))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date: value,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.end_date ?? value;
          }
          if (errors.end_date?.hasError) {
            runValidationTasks("end_date", value);
          }
          setEnd_date(value);
        }}
        onBlur={() => runValidationTasks("end_date", end_date)}
        errorMessage={errors.end_date?.errorMessage}
        hasError={errors.end_date?.hasError}
        {...getOverrideProps(overrides, "end_date")}
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
              code,
              name,
              discount_type,
              discount_value,
              min_order_amount,
              max_discount,
              usage_limit,
              used_count,
              is_active,
              start_date,
              end_date,
              created_at: value,
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
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || promotionModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || promotionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
