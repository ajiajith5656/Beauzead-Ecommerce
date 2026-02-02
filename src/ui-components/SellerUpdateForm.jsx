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
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getSeller } from "../graphql/queries";
import { updateSeller } from "../graphql/mutations";
const client = generateClient();
export default function SellerUpdateForm(props) {
  const {
    id: idProp,
    seller: sellerModelProp,
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
    email: "",
    business_name: "",
    business_type: "",
    gst_number: "",
    pan_number: "",
    phone: "",
    address: "",
    bank_details: "",
    kyc_status: "",
    kyc_documents: "",
    badge: "",
    is_approved: false,
    is_active: false,
    created_at: "",
    updated_at: "",
  };
  const [user_id, setUser_id] = React.useState(initialValues.user_id);
  const [email, setEmail] = React.useState(initialValues.email);
  const [business_name, setBusiness_name] = React.useState(
    initialValues.business_name
  );
  const [business_type, setBusiness_type] = React.useState(
    initialValues.business_type
  );
  const [gst_number, setGst_number] = React.useState(initialValues.gst_number);
  const [pan_number, setPan_number] = React.useState(initialValues.pan_number);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [address, setAddress] = React.useState(initialValues.address);
  const [bank_details, setBank_details] = React.useState(
    initialValues.bank_details
  );
  const [kyc_status, setKyc_status] = React.useState(initialValues.kyc_status);
  const [kyc_documents, setKyc_documents] = React.useState(
    initialValues.kyc_documents
  );
  const [badge, setBadge] = React.useState(initialValues.badge);
  const [is_approved, setIs_approved] = React.useState(
    initialValues.is_approved
  );
  const [is_active, setIs_active] = React.useState(initialValues.is_active);
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [updated_at, setUpdated_at] = React.useState(initialValues.updated_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = sellerRecord
      ? { ...initialValues, ...sellerRecord }
      : initialValues;
    setUser_id(cleanValues.user_id);
    setEmail(cleanValues.email);
    setBusiness_name(cleanValues.business_name);
    setBusiness_type(cleanValues.business_type);
    setGst_number(cleanValues.gst_number);
    setPan_number(cleanValues.pan_number);
    setPhone(cleanValues.phone);
    setAddress(
      typeof cleanValues.address === "string" || cleanValues.address === null
        ? cleanValues.address
        : JSON.stringify(cleanValues.address)
    );
    setBank_details(
      typeof cleanValues.bank_details === "string" ||
        cleanValues.bank_details === null
        ? cleanValues.bank_details
        : JSON.stringify(cleanValues.bank_details)
    );
    setKyc_status(cleanValues.kyc_status);
    setKyc_documents(
      typeof cleanValues.kyc_documents === "string" ||
        cleanValues.kyc_documents === null
        ? cleanValues.kyc_documents
        : JSON.stringify(cleanValues.kyc_documents)
    );
    setBadge(cleanValues.badge);
    setIs_approved(cleanValues.is_approved);
    setIs_active(cleanValues.is_active);
    setCreated_at(cleanValues.created_at);
    setUpdated_at(cleanValues.updated_at);
    setErrors({});
  };
  const [sellerRecord, setSellerRecord] = React.useState(sellerModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getSeller.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getSeller
        : sellerModelProp;
      setSellerRecord(record);
    };
    queryData();
  }, [idProp, sellerModelProp]);
  React.useEffect(resetStateValues, [sellerRecord]);
  const validations = {
    user_id: [{ type: "Required" }],
    email: [{ type: "Required" }],
    business_name: [{ type: "Required" }],
    business_type: [],
    gst_number: [],
    pan_number: [],
    phone: [],
    address: [{ type: "JSON" }],
    bank_details: [{ type: "JSON" }],
    kyc_status: [],
    kyc_documents: [{ type: "JSON" }],
    badge: [],
    is_approved: [],
    is_active: [],
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
          email,
          business_name,
          business_type: business_type ?? null,
          gst_number: gst_number ?? null,
          pan_number: pan_number ?? null,
          phone: phone ?? null,
          address: address ?? null,
          bank_details: bank_details ?? null,
          kyc_status: kyc_status ?? null,
          kyc_documents: kyc_documents ?? null,
          badge: badge ?? null,
          is_approved: is_approved ?? null,
          is_active: is_active ?? null,
          created_at: created_at ?? null,
          updated_at: updated_at ?? null,
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
            query: updateSeller.replaceAll("__typename", ""),
            variables: {
              input: {
                id: sellerRecord.id,
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
      {...getOverrideProps(overrides, "SellerUpdateForm")}
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
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
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
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email: value,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Business name"
        isRequired={true}
        isReadOnly={false}
        value={business_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name: value,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.business_name ?? value;
          }
          if (errors.business_name?.hasError) {
            runValidationTasks("business_name", value);
          }
          setBusiness_name(value);
        }}
        onBlur={() => runValidationTasks("business_name", business_name)}
        errorMessage={errors.business_name?.errorMessage}
        hasError={errors.business_name?.hasError}
        {...getOverrideProps(overrides, "business_name")}
      ></TextField>
      <TextField
        label="Business type"
        isRequired={false}
        isReadOnly={false}
        value={business_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type: value,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.business_type ?? value;
          }
          if (errors.business_type?.hasError) {
            runValidationTasks("business_type", value);
          }
          setBusiness_type(value);
        }}
        onBlur={() => runValidationTasks("business_type", business_type)}
        errorMessage={errors.business_type?.errorMessage}
        hasError={errors.business_type?.hasError}
        {...getOverrideProps(overrides, "business_type")}
      ></TextField>
      <TextField
        label="Gst number"
        isRequired={false}
        isReadOnly={false}
        value={gst_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number: value,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.gst_number ?? value;
          }
          if (errors.gst_number?.hasError) {
            runValidationTasks("gst_number", value);
          }
          setGst_number(value);
        }}
        onBlur={() => runValidationTasks("gst_number", gst_number)}
        errorMessage={errors.gst_number?.errorMessage}
        hasError={errors.gst_number?.hasError}
        {...getOverrideProps(overrides, "gst_number")}
      ></TextField>
      <TextField
        label="Pan number"
        isRequired={false}
        isReadOnly={false}
        value={pan_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number: value,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.pan_number ?? value;
          }
          if (errors.pan_number?.hasError) {
            runValidationTasks("pan_number", value);
          }
          setPan_number(value);
        }}
        onBlur={() => runValidationTasks("pan_number", pan_number)}
        errorMessage={errors.pan_number?.errorMessage}
        hasError={errors.pan_number?.hasError}
        {...getOverrideProps(overrides, "pan_number")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone: value,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <TextAreaField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address: value,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextAreaField>
      <TextAreaField
        label="Bank details"
        isRequired={false}
        isReadOnly={false}
        value={bank_details}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details: value,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.bank_details ?? value;
          }
          if (errors.bank_details?.hasError) {
            runValidationTasks("bank_details", value);
          }
          setBank_details(value);
        }}
        onBlur={() => runValidationTasks("bank_details", bank_details)}
        errorMessage={errors.bank_details?.errorMessage}
        hasError={errors.bank_details?.hasError}
        {...getOverrideProps(overrides, "bank_details")}
      ></TextAreaField>
      <TextField
        label="Kyc status"
        isRequired={false}
        isReadOnly={false}
        value={kyc_status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status: value,
              kyc_documents,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.kyc_status ?? value;
          }
          if (errors.kyc_status?.hasError) {
            runValidationTasks("kyc_status", value);
          }
          setKyc_status(value);
        }}
        onBlur={() => runValidationTasks("kyc_status", kyc_status)}
        errorMessage={errors.kyc_status?.errorMessage}
        hasError={errors.kyc_status?.hasError}
        {...getOverrideProps(overrides, "kyc_status")}
      ></TextField>
      <TextAreaField
        label="Kyc documents"
        isRequired={false}
        isReadOnly={false}
        value={kyc_documents}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents: value,
              badge,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.kyc_documents ?? value;
          }
          if (errors.kyc_documents?.hasError) {
            runValidationTasks("kyc_documents", value);
          }
          setKyc_documents(value);
        }}
        onBlur={() => runValidationTasks("kyc_documents", kyc_documents)}
        errorMessage={errors.kyc_documents?.errorMessage}
        hasError={errors.kyc_documents?.hasError}
        {...getOverrideProps(overrides, "kyc_documents")}
      ></TextAreaField>
      <TextField
        label="Badge"
        isRequired={false}
        isReadOnly={false}
        value={badge}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge: value,
              is_approved,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.badge ?? value;
          }
          if (errors.badge?.hasError) {
            runValidationTasks("badge", value);
          }
          setBadge(value);
        }}
        onBlur={() => runValidationTasks("badge", badge)}
        errorMessage={errors.badge?.errorMessage}
        hasError={errors.badge?.hasError}
        {...getOverrideProps(overrides, "badge")}
      ></TextField>
      <SwitchField
        label="Is approved"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_approved}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved: value,
              is_active,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.is_approved ?? value;
          }
          if (errors.is_approved?.hasError) {
            runValidationTasks("is_approved", value);
          }
          setIs_approved(value);
        }}
        onBlur={() => runValidationTasks("is_approved", is_approved)}
        errorMessage={errors.is_approved?.errorMessage}
        hasError={errors.is_approved?.hasError}
        {...getOverrideProps(overrides, "is_approved")}
      ></SwitchField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_active}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              user_id,
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active: value,
              created_at,
              updated_at,
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
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
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
              email,
              business_name,
              business_type,
              gst_number,
              pan_number,
              phone,
              address,
              bank_details,
              kyc_status,
              kyc_documents,
              badge,
              is_approved,
              is_active,
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
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || sellerModelProp)}
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
              !(idProp || sellerModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
