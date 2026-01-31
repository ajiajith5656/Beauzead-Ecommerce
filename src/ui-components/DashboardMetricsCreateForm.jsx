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
import { createDashboardMetrics } from "../graphql/mutations";
const client = generateClient();
export default function DashboardMetricsCreateForm(props) {
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
    totalSales: "",
    totalExpenses: "",
    totalProducts: "",
    totalUsers: "",
    totalSellers: "",
    totalBookings: "",
    ongoingOrders: "",
    returnsCancellations: "",
    userRegistrations: "",
    primeMembers: "",
    sellerRegistrations: "",
    createdAt: "",
    updatedAt: "",
  };
  const [totalSales, setTotalSales] = React.useState(initialValues.totalSales);
  const [totalExpenses, setTotalExpenses] = React.useState(
    initialValues.totalExpenses
  );
  const [totalProducts, setTotalProducts] = React.useState(
    initialValues.totalProducts
  );
  const [totalUsers, setTotalUsers] = React.useState(initialValues.totalUsers);
  const [totalSellers, setTotalSellers] = React.useState(
    initialValues.totalSellers
  );
  const [totalBookings, setTotalBookings] = React.useState(
    initialValues.totalBookings
  );
  const [ongoingOrders, setOngoingOrders] = React.useState(
    initialValues.ongoingOrders
  );
  const [returnsCancellations, setReturnsCancellations] = React.useState(
    initialValues.returnsCancellations
  );
  const [userRegistrations, setUserRegistrations] = React.useState(
    initialValues.userRegistrations
  );
  const [primeMembers, setPrimeMembers] = React.useState(
    initialValues.primeMembers
  );
  const [sellerRegistrations, setSellerRegistrations] = React.useState(
    initialValues.sellerRegistrations
  );
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTotalSales(initialValues.totalSales);
    setTotalExpenses(initialValues.totalExpenses);
    setTotalProducts(initialValues.totalProducts);
    setTotalUsers(initialValues.totalUsers);
    setTotalSellers(initialValues.totalSellers);
    setTotalBookings(initialValues.totalBookings);
    setOngoingOrders(initialValues.ongoingOrders);
    setReturnsCancellations(initialValues.returnsCancellations);
    setUserRegistrations(initialValues.userRegistrations);
    setPrimeMembers(initialValues.primeMembers);
    setSellerRegistrations(initialValues.sellerRegistrations);
    setCreatedAt(initialValues.createdAt);
    setUpdatedAt(initialValues.updatedAt);
    setErrors({});
  };
  const validations = {
    totalSales: [{ type: "Required" }],
    totalExpenses: [{ type: "Required" }],
    totalProducts: [{ type: "Required" }],
    totalUsers: [{ type: "Required" }],
    totalSellers: [{ type: "Required" }],
    totalBookings: [{ type: "Required" }],
    ongoingOrders: [{ type: "Required" }],
    returnsCancellations: [{ type: "Required" }],
    userRegistrations: [{ type: "Required" }],
    primeMembers: [{ type: "Required" }],
    sellerRegistrations: [{ type: "Required" }],
    createdAt: [{ type: "Required" }],
    updatedAt: [{ type: "Required" }],
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
          totalSales,
          totalExpenses,
          totalProducts,
          totalUsers,
          totalSellers,
          totalBookings,
          ongoingOrders,
          returnsCancellations,
          userRegistrations,
          primeMembers,
          sellerRegistrations,
          createdAt,
          updatedAt,
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
            query: createDashboardMetrics.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "DashboardMetricsCreateForm")}
      {...rest}
    >
      <TextField
        label="Total sales"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalSales}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales: value,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalSales ?? value;
          }
          if (errors.totalSales?.hasError) {
            runValidationTasks("totalSales", value);
          }
          setTotalSales(value);
        }}
        onBlur={() => runValidationTasks("totalSales", totalSales)}
        errorMessage={errors.totalSales?.errorMessage}
        hasError={errors.totalSales?.hasError}
        {...getOverrideProps(overrides, "totalSales")}
      ></TextField>
      <TextField
        label="Total expenses"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalExpenses}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses: value,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalExpenses ?? value;
          }
          if (errors.totalExpenses?.hasError) {
            runValidationTasks("totalExpenses", value);
          }
          setTotalExpenses(value);
        }}
        onBlur={() => runValidationTasks("totalExpenses", totalExpenses)}
        errorMessage={errors.totalExpenses?.errorMessage}
        hasError={errors.totalExpenses?.hasError}
        {...getOverrideProps(overrides, "totalExpenses")}
      ></TextField>
      <TextField
        label="Total products"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalProducts}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts: value,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalProducts ?? value;
          }
          if (errors.totalProducts?.hasError) {
            runValidationTasks("totalProducts", value);
          }
          setTotalProducts(value);
        }}
        onBlur={() => runValidationTasks("totalProducts", totalProducts)}
        errorMessage={errors.totalProducts?.errorMessage}
        hasError={errors.totalProducts?.hasError}
        {...getOverrideProps(overrides, "totalProducts")}
      ></TextField>
      <TextField
        label="Total users"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalUsers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers: value,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalUsers ?? value;
          }
          if (errors.totalUsers?.hasError) {
            runValidationTasks("totalUsers", value);
          }
          setTotalUsers(value);
        }}
        onBlur={() => runValidationTasks("totalUsers", totalUsers)}
        errorMessage={errors.totalUsers?.errorMessage}
        hasError={errors.totalUsers?.hasError}
        {...getOverrideProps(overrides, "totalUsers")}
      ></TextField>
      <TextField
        label="Total sellers"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalSellers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers: value,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalSellers ?? value;
          }
          if (errors.totalSellers?.hasError) {
            runValidationTasks("totalSellers", value);
          }
          setTotalSellers(value);
        }}
        onBlur={() => runValidationTasks("totalSellers", totalSellers)}
        errorMessage={errors.totalSellers?.errorMessage}
        hasError={errors.totalSellers?.hasError}
        {...getOverrideProps(overrides, "totalSellers")}
      ></TextField>
      <TextField
        label="Total bookings"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalBookings}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings: value,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.totalBookings ?? value;
          }
          if (errors.totalBookings?.hasError) {
            runValidationTasks("totalBookings", value);
          }
          setTotalBookings(value);
        }}
        onBlur={() => runValidationTasks("totalBookings", totalBookings)}
        errorMessage={errors.totalBookings?.errorMessage}
        hasError={errors.totalBookings?.hasError}
        {...getOverrideProps(overrides, "totalBookings")}
      ></TextField>
      <TextField
        label="Ongoing orders"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={ongoingOrders}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders: value,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.ongoingOrders ?? value;
          }
          if (errors.ongoingOrders?.hasError) {
            runValidationTasks("ongoingOrders", value);
          }
          setOngoingOrders(value);
        }}
        onBlur={() => runValidationTasks("ongoingOrders", ongoingOrders)}
        errorMessage={errors.ongoingOrders?.errorMessage}
        hasError={errors.ongoingOrders?.hasError}
        {...getOverrideProps(overrides, "ongoingOrders")}
      ></TextField>
      <TextField
        label="Returns cancellations"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={returnsCancellations}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations: value,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.returnsCancellations ?? value;
          }
          if (errors.returnsCancellations?.hasError) {
            runValidationTasks("returnsCancellations", value);
          }
          setReturnsCancellations(value);
        }}
        onBlur={() =>
          runValidationTasks("returnsCancellations", returnsCancellations)
        }
        errorMessage={errors.returnsCancellations?.errorMessage}
        hasError={errors.returnsCancellations?.hasError}
        {...getOverrideProps(overrides, "returnsCancellations")}
      ></TextField>
      <TextField
        label="User registrations"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={userRegistrations}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations: value,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.userRegistrations ?? value;
          }
          if (errors.userRegistrations?.hasError) {
            runValidationTasks("userRegistrations", value);
          }
          setUserRegistrations(value);
        }}
        onBlur={() =>
          runValidationTasks("userRegistrations", userRegistrations)
        }
        errorMessage={errors.userRegistrations?.errorMessage}
        hasError={errors.userRegistrations?.hasError}
        {...getOverrideProps(overrides, "userRegistrations")}
      ></TextField>
      <TextField
        label="Prime members"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={primeMembers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers: value,
              sellerRegistrations,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.primeMembers ?? value;
          }
          if (errors.primeMembers?.hasError) {
            runValidationTasks("primeMembers", value);
          }
          setPrimeMembers(value);
        }}
        onBlur={() => runValidationTasks("primeMembers", primeMembers)}
        errorMessage={errors.primeMembers?.errorMessage}
        hasError={errors.primeMembers?.hasError}
        {...getOverrideProps(overrides, "primeMembers")}
      ></TextField>
      <TextField
        label="Seller registrations"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={sellerRegistrations}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.sellerRegistrations ?? value;
          }
          if (errors.sellerRegistrations?.hasError) {
            runValidationTasks("sellerRegistrations", value);
          }
          setSellerRegistrations(value);
        }}
        onBlur={() =>
          runValidationTasks("sellerRegistrations", sellerRegistrations)
        }
        errorMessage={errors.sellerRegistrations?.errorMessage}
        hasError={errors.sellerRegistrations?.hasError}
        {...getOverrideProps(overrides, "sellerRegistrations")}
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
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt: value,
              updatedAt,
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
      <TextField
        label="Updated at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              totalSales,
              totalExpenses,
              totalProducts,
              totalUsers,
              totalSellers,
              totalBookings,
              ongoingOrders,
              returnsCancellations,
              userRegistrations,
              primeMembers,
              sellerRegistrations,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
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
