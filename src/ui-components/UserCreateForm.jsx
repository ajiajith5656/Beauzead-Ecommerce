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
import { createUser } from "../graphql/mutations";
const client = generateClient();
export default function UserCreateForm(props) {
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
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    profile_type: "",
    avatar_url: "",
    address: "",
    is_verified: false,
    is_banned: false,
    created_at: "",
    updated_at: "",
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [profile_type, setProfile_type] = React.useState(
    initialValues.profile_type
  );
  const [avatar_url, setAvatar_url] = React.useState(initialValues.avatar_url);
  const [address, setAddress] = React.useState(initialValues.address);
  const [is_verified, setIs_verified] = React.useState(
    initialValues.is_verified
  );
  const [is_banned, setIs_banned] = React.useState(initialValues.is_banned);
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [updated_at, setUpdated_at] = React.useState(initialValues.updated_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setEmail(initialValues.email);
    setPhone(initialValues.phone);
    setFirst_name(initialValues.first_name);
    setLast_name(initialValues.last_name);
    setProfile_type(initialValues.profile_type);
    setAvatar_url(initialValues.avatar_url);
    setAddress(initialValues.address);
    setIs_verified(initialValues.is_verified);
    setIs_banned(initialValues.is_banned);
    setCreated_at(initialValues.created_at);
    setUpdated_at(initialValues.updated_at);
    setErrors({});
  };
  const validations = {
    email: [{ type: "Required" }],
    phone: [],
    first_name: [],
    last_name: [],
    profile_type: [],
    avatar_url: [],
    address: [{ type: "JSON" }],
    is_verified: [],
    is_banned: [],
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
          email,
          phone,
          first_name,
          last_name,
          profile_type,
          avatar_url,
          address,
          is_verified,
          is_banned,
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
            query: createUser.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "UserCreateForm")}
      {...rest}
    >
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
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
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone: value,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
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
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={first_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name: value,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.first_name ?? value;
          }
          if (errors.first_name?.hasError) {
            runValidationTasks("first_name", value);
          }
          setFirst_name(value);
        }}
        onBlur={() => runValidationTasks("first_name", first_name)}
        errorMessage={errors.first_name?.errorMessage}
        hasError={errors.first_name?.hasError}
        {...getOverrideProps(overrides, "first_name")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={last_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name: value,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.last_name ?? value;
          }
          if (errors.last_name?.hasError) {
            runValidationTasks("last_name", value);
          }
          setLast_name(value);
        }}
        onBlur={() => runValidationTasks("last_name", last_name)}
        errorMessage={errors.last_name?.errorMessage}
        hasError={errors.last_name?.hasError}
        {...getOverrideProps(overrides, "last_name")}
      ></TextField>
      <TextField
        label="Profile type"
        isRequired={false}
        isReadOnly={false}
        value={profile_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name,
              profile_type: value,
              avatar_url,
              address,
              is_verified,
              is_banned,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.profile_type ?? value;
          }
          if (errors.profile_type?.hasError) {
            runValidationTasks("profile_type", value);
          }
          setProfile_type(value);
        }}
        onBlur={() => runValidationTasks("profile_type", profile_type)}
        errorMessage={errors.profile_type?.errorMessage}
        hasError={errors.profile_type?.hasError}
        {...getOverrideProps(overrides, "profile_type")}
      ></TextField>
      <TextField
        label="Avatar url"
        isRequired={false}
        isReadOnly={false}
        value={avatar_url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url: value,
              address,
              is_verified,
              is_banned,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.avatar_url ?? value;
          }
          if (errors.avatar_url?.hasError) {
            runValidationTasks("avatar_url", value);
          }
          setAvatar_url(value);
        }}
        onBlur={() => runValidationTasks("avatar_url", avatar_url)}
        errorMessage={errors.avatar_url?.errorMessage}
        hasError={errors.avatar_url?.hasError}
        {...getOverrideProps(overrides, "avatar_url")}
      ></TextField>
      <TextAreaField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address: value,
              is_verified,
              is_banned,
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
      <SwitchField
        label="Is verified"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_verified}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified: value,
              is_banned,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.is_verified ?? value;
          }
          if (errors.is_verified?.hasError) {
            runValidationTasks("is_verified", value);
          }
          setIs_verified(value);
        }}
        onBlur={() => runValidationTasks("is_verified", is_verified)}
        errorMessage={errors.is_verified?.errorMessage}
        hasError={errors.is_verified?.hasError}
        {...getOverrideProps(overrides, "is_verified")}
      ></SwitchField>
      <SwitchField
        label="Is banned"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_banned}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned: value,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.is_banned ?? value;
          }
          if (errors.is_banned?.hasError) {
            runValidationTasks("is_banned", value);
          }
          setIs_banned(value);
        }}
        onBlur={() => runValidationTasks("is_banned", is_banned)}
        errorMessage={errors.is_banned?.errorMessage}
        hasError={errors.is_banned?.hasError}
        {...getOverrideProps(overrides, "is_banned")}
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
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
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
              email,
              phone,
              first_name,
              last_name,
              profile_type,
              avatar_url,
              address,
              is_verified,
              is_banned,
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
