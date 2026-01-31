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
import { createReview } from "../graphql/mutations";
const client = generateClient();
export default function ReviewCreateForm(props) {
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
    productId: "",
    userId: "",
    rating: "",
    comment: "",
    createdAt: "",
    isVerified: false,
    isFlagged: false,
  };
  const [productId, setProductId] = React.useState(initialValues.productId);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [rating, setRating] = React.useState(initialValues.rating);
  const [comment, setComment] = React.useState(initialValues.comment);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [isVerified, setIsVerified] = React.useState(initialValues.isVerified);
  const [isFlagged, setIsFlagged] = React.useState(initialValues.isFlagged);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setProductId(initialValues.productId);
    setUserId(initialValues.userId);
    setRating(initialValues.rating);
    setComment(initialValues.comment);
    setCreatedAt(initialValues.createdAt);
    setIsVerified(initialValues.isVerified);
    setIsFlagged(initialValues.isFlagged);
    setErrors({});
  };
  const validations = {
    productId: [{ type: "Required" }],
    userId: [{ type: "Required" }],
    rating: [{ type: "Required" }],
    comment: [{ type: "Required" }],
    createdAt: [{ type: "Required" }],
    isVerified: [],
    isFlagged: [],
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
          productId,
          userId,
          rating,
          comment,
          createdAt,
          isVerified,
          isFlagged,
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
            query: createReview.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ReviewCreateForm")}
      {...rest}
    >
      <TextField
        label="Product id"
        isRequired={true}
        isReadOnly={false}
        value={productId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              productId: value,
              userId,
              rating,
              comment,
              createdAt,
              isVerified,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.productId ?? value;
          }
          if (errors.productId?.hasError) {
            runValidationTasks("productId", value);
          }
          setProductId(value);
        }}
        onBlur={() => runValidationTasks("productId", productId)}
        errorMessage={errors.productId?.errorMessage}
        hasError={errors.productId?.hasError}
        {...getOverrideProps(overrides, "productId")}
      ></TextField>
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              productId,
              userId: value,
              rating,
              comment,
              createdAt,
              isVerified,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Rating"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={rating}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              productId,
              userId,
              rating: value,
              comment,
              createdAt,
              isVerified,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.rating ?? value;
          }
          if (errors.rating?.hasError) {
            runValidationTasks("rating", value);
          }
          setRating(value);
        }}
        onBlur={() => runValidationTasks("rating", rating)}
        errorMessage={errors.rating?.errorMessage}
        hasError={errors.rating?.hasError}
        {...getOverrideProps(overrides, "rating")}
      ></TextField>
      <TextField
        label="Comment"
        isRequired={true}
        isReadOnly={false}
        value={comment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              productId,
              userId,
              rating,
              comment: value,
              createdAt,
              isVerified,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.comment ?? value;
          }
          if (errors.comment?.hasError) {
            runValidationTasks("comment", value);
          }
          setComment(value);
        }}
        onBlur={() => runValidationTasks("comment", comment)}
        errorMessage={errors.comment?.errorMessage}
        hasError={errors.comment?.hasError}
        {...getOverrideProps(overrides, "comment")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              productId,
              userId,
              rating,
              comment,
              createdAt: value,
              isVerified,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <SwitchField
        label="Is verified"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isVerified}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              productId,
              userId,
              rating,
              comment,
              createdAt,
              isVerified: value,
              isFlagged,
            };
            const result = onChange(modelFields);
            value = result?.isVerified ?? value;
          }
          if (errors.isVerified?.hasError) {
            runValidationTasks("isVerified", value);
          }
          setIsVerified(value);
        }}
        onBlur={() => runValidationTasks("isVerified", isVerified)}
        errorMessage={errors.isVerified?.errorMessage}
        hasError={errors.isVerified?.hasError}
        {...getOverrideProps(overrides, "isVerified")}
      ></SwitchField>
      <SwitchField
        label="Is flagged"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isFlagged}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              productId,
              userId,
              rating,
              comment,
              createdAt,
              isVerified,
              isFlagged: value,
            };
            const result = onChange(modelFields);
            value = result?.isFlagged ?? value;
          }
          if (errors.isFlagged?.hasError) {
            runValidationTasks("isFlagged", value);
          }
          setIsFlagged(value);
        }}
        onBlur={() => runValidationTasks("isFlagged", isFlagged)}
        errorMessage={errors.isFlagged?.errorMessage}
        hasError={errors.isFlagged?.hasError}
        {...getOverrideProps(overrides, "isFlagged")}
      ></SwitchField>
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
