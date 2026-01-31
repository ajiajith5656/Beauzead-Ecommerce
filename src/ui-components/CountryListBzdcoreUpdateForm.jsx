/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getCountryListBzdcore } from "../graphql/queries";
import { updateCountryListBzdcore } from "../graphql/mutations";
const client = generateClient();
export default function CountryListBzdcoreUpdateForm(props) {
  const {
    id: idProp,
    countryListBzdcore: countryListBzdcoreModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    countryName: "",
    shortCode: "",
    currency: "",
    dialCode: "",
  };
  const [countryName, setCountryName] = React.useState(
    initialValues.countryName
  );
  const [shortCode, setShortCode] = React.useState(initialValues.shortCode);
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [dialCode, setDialCode] = React.useState(initialValues.dialCode);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = countryListBzdcoreRecord
      ? { ...initialValues, ...countryListBzdcoreRecord }
      : initialValues;
    setCountryName(cleanValues.countryName);
    setShortCode(cleanValues.shortCode);
    setCurrency(cleanValues.currency);
    setDialCode(cleanValues.dialCode);
    setErrors({});
  };
  const [countryListBzdcoreRecord, setCountryListBzdcoreRecord] =
    React.useState(countryListBzdcoreModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCountryListBzdcore.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCountryListBzdcore
        : countryListBzdcoreModelProp;
      setCountryListBzdcoreRecord(record);
    };
    queryData();
  }, [idProp, countryListBzdcoreModelProp]);
  React.useEffect(resetStateValues, [countryListBzdcoreRecord]);
  const validations = {
    countryName: [{ type: "Required" }],
    shortCode: [{ type: "Required" }],
    currency: [{ type: "Required" }],
    dialCode: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          countryName,
          shortCode,
          currency,
          dialCode: dialCode ?? null,
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
            query: updateCountryListBzdcore.replaceAll("__typename", ""),
            variables: {
              input: {
                id: countryListBzdcoreRecord.id,
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
      {...getOverrideProps(overrides, "CountryListBzdcoreUpdateForm")}
      {...rest}
    >
      <TextField
        label="Country name"
        isRequired={true}
        isReadOnly={false}
        value={countryName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              countryName: value,
              shortCode,
              currency,
              dialCode,
            };
            const result = onChange(modelFields);
            value = result?.countryName ?? value;
          }
          if (errors.countryName?.hasError) {
            runValidationTasks("countryName", value);
          }
          setCountryName(value);
        }}
        onBlur={() => runValidationTasks("countryName", countryName)}
        errorMessage={errors.countryName?.errorMessage}
        hasError={errors.countryName?.hasError}
        {...getOverrideProps(overrides, "countryName")}
      ></TextField>
      <TextField
        label="Short code"
        isRequired={true}
        isReadOnly={false}
        value={shortCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              countryName,
              shortCode: value,
              currency,
              dialCode,
            };
            const result = onChange(modelFields);
            value = result?.shortCode ?? value;
          }
          if (errors.shortCode?.hasError) {
            runValidationTasks("shortCode", value);
          }
          setShortCode(value);
        }}
        onBlur={() => runValidationTasks("shortCode", shortCode)}
        errorMessage={errors.shortCode?.errorMessage}
        hasError={errors.shortCode?.hasError}
        {...getOverrideProps(overrides, "shortCode")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={true}
        isReadOnly={false}
        value={currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              countryName,
              shortCode,
              currency: value,
              dialCode,
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
      <TextField
        label="Dial code"
        isRequired={false}
        isReadOnly={false}
        value={dialCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              countryName,
              shortCode,
              currency,
              dialCode: value,
            };
            const result = onChange(modelFields);
            value = result?.dialCode ?? value;
          }
          if (errors.dialCode?.hasError) {
            runValidationTasks("dialCode", value);
          }
          setDialCode(value);
        }}
        onBlur={() => runValidationTasks("dialCode", dialCode)}
        errorMessage={errors.dialCode?.errorMessage}
        hasError={errors.dialCode?.hasError}
        {...getOverrideProps(overrides, "dialCode")}
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
          isDisabled={!(idProp || countryListBzdcoreModelProp)}
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
              !(idProp || countryListBzdcoreModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
