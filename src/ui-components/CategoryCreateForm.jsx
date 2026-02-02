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
import { createCategory } from "../graphql/mutations";
const client = generateClient();
export default function CategoryCreateForm(props) {
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
    name: "",
    slug: "",
    description: "",
    image_url: "",
    parent_id: "",
    sub_categories: "",
    is_active: false,
    sort_order: "",
    created_at: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [slug, setSlug] = React.useState(initialValues.slug);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [image_url, setImage_url] = React.useState(initialValues.image_url);
  const [parent_id, setParent_id] = React.useState(initialValues.parent_id);
  const [sub_categories, setSub_categories] = React.useState(
    initialValues.sub_categories
  );
  const [is_active, setIs_active] = React.useState(initialValues.is_active);
  const [sort_order, setSort_order] = React.useState(initialValues.sort_order);
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setSlug(initialValues.slug);
    setDescription(initialValues.description);
    setImage_url(initialValues.image_url);
    setParent_id(initialValues.parent_id);
    setSub_categories(initialValues.sub_categories);
    setIs_active(initialValues.is_active);
    setSort_order(initialValues.sort_order);
    setCreated_at(initialValues.created_at);
    setErrors({});
  };
  const validations = {
    name: [{ type: "Required" }],
    slug: [],
    description: [],
    image_url: [],
    parent_id: [],
    sub_categories: [{ type: "JSON" }],
    is_active: [],
    sort_order: [],
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
          name,
          slug,
          description,
          image_url,
          parent_id,
          sub_categories,
          is_active,
          sort_order,
          created_at,
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
            query: createCategory.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "CategoryCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              slug,
              description,
              image_url,
              parent_id,
              sub_categories,
              is_active,
              sort_order,
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
        label="Slug"
        isRequired={false}
        isReadOnly={false}
        value={slug}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              slug: value,
              description,
              image_url,
              parent_id,
              sub_categories,
              is_active,
              sort_order,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.slug ?? value;
          }
          if (errors.slug?.hasError) {
            runValidationTasks("slug", value);
          }
          setSlug(value);
        }}
        onBlur={() => runValidationTasks("slug", slug)}
        errorMessage={errors.slug?.errorMessage}
        hasError={errors.slug?.hasError}
        {...getOverrideProps(overrides, "slug")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description: value,
              image_url,
              parent_id,
              sub_categories,
              is_active,
              sort_order,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Image url"
        isRequired={false}
        isReadOnly={false}
        value={image_url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description,
              image_url: value,
              parent_id,
              sub_categories,
              is_active,
              sort_order,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.image_url ?? value;
          }
          if (errors.image_url?.hasError) {
            runValidationTasks("image_url", value);
          }
          setImage_url(value);
        }}
        onBlur={() => runValidationTasks("image_url", image_url)}
        errorMessage={errors.image_url?.errorMessage}
        hasError={errors.image_url?.hasError}
        {...getOverrideProps(overrides, "image_url")}
      ></TextField>
      <TextField
        label="Parent id"
        isRequired={false}
        isReadOnly={false}
        value={parent_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description,
              image_url,
              parent_id: value,
              sub_categories,
              is_active,
              sort_order,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.parent_id ?? value;
          }
          if (errors.parent_id?.hasError) {
            runValidationTasks("parent_id", value);
          }
          setParent_id(value);
        }}
        onBlur={() => runValidationTasks("parent_id", parent_id)}
        errorMessage={errors.parent_id?.errorMessage}
        hasError={errors.parent_id?.hasError}
        {...getOverrideProps(overrides, "parent_id")}
      ></TextField>
      <TextAreaField
        label="Sub categories"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description,
              image_url,
              parent_id,
              sub_categories: value,
              is_active,
              sort_order,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.sub_categories ?? value;
          }
          if (errors.sub_categories?.hasError) {
            runValidationTasks("sub_categories", value);
          }
          setSub_categories(value);
        }}
        onBlur={() => runValidationTasks("sub_categories", sub_categories)}
        errorMessage={errors.sub_categories?.errorMessage}
        hasError={errors.sub_categories?.hasError}
        {...getOverrideProps(overrides, "sub_categories")}
      ></TextAreaField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_active}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description,
              image_url,
              parent_id,
              sub_categories,
              is_active: value,
              sort_order,
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
        label="Sort order"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={sort_order}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              slug,
              description,
              image_url,
              parent_id,
              sub_categories,
              is_active,
              sort_order: value,
              created_at,
            };
            const result = onChange(modelFields);
            value = result?.sort_order ?? value;
          }
          if (errors.sort_order?.hasError) {
            runValidationTasks("sort_order", value);
          }
          setSort_order(value);
        }}
        onBlur={() => runValidationTasks("sort_order", sort_order)}
        errorMessage={errors.sort_order?.errorMessage}
        hasError={errors.sort_order?.hasError}
        {...getOverrideProps(overrides, "sort_order")}
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
              name,
              slug,
              description,
              image_url,
              parent_id,
              sub_categories,
              is_active,
              sort_order,
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
