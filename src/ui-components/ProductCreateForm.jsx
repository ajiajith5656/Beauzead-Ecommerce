/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SwitchField,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createProduct } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ProductCreateForm(props) {
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
    seller_id: "",
    category_id: "",
    sub_category_id: "",
    name: "",
    brand_name: "",
    model_number: "",
    short_description: "",
    description: "",
    highlights: [],
    specifications: "",
    image_url: "",
    images: [],
    videos: [],
    price: "",
    mrp: "",
    currency: "",
    stock: "",
    size_variants: "",
    color_variants: "",
    gst_rate: "",
    platform_fee: "",
    commission: "",
    delivery_countries: "",
    package_weight: "",
    package_dimensions: "",
    shipping_type: "",
    manufacturer_name: "",
    cancellation_policy_days: "",
    return_policy_days: "",
    offer_rules: "",
    approval_status: "",
    is_active: false,
    rating: "",
    review_count: "",
    created_at: "",
    updated_at: "",
  };
  const [seller_id, setSeller_id] = React.useState(initialValues.seller_id);
  const [category_id, setCategory_id] = React.useState(
    initialValues.category_id
  );
  const [sub_category_id, setSub_category_id] = React.useState(
    initialValues.sub_category_id
  );
  const [name, setName] = React.useState(initialValues.name);
  const [brand_name, setBrand_name] = React.useState(initialValues.brand_name);
  const [model_number, setModel_number] = React.useState(
    initialValues.model_number
  );
  const [short_description, setShort_description] = React.useState(
    initialValues.short_description
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [highlights, setHighlights] = React.useState(initialValues.highlights);
  const [specifications, setSpecifications] = React.useState(
    initialValues.specifications
  );
  const [image_url, setImage_url] = React.useState(initialValues.image_url);
  const [images, setImages] = React.useState(initialValues.images);
  const [videos, setVideos] = React.useState(initialValues.videos);
  const [price, setPrice] = React.useState(initialValues.price);
  const [mrp, setMrp] = React.useState(initialValues.mrp);
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [stock, setStock] = React.useState(initialValues.stock);
  const [size_variants, setSize_variants] = React.useState(
    initialValues.size_variants
  );
  const [color_variants, setColor_variants] = React.useState(
    initialValues.color_variants
  );
  const [gst_rate, setGst_rate] = React.useState(initialValues.gst_rate);
  const [platform_fee, setPlatform_fee] = React.useState(
    initialValues.platform_fee
  );
  const [commission, setCommission] = React.useState(initialValues.commission);
  const [delivery_countries, setDelivery_countries] = React.useState(
    initialValues.delivery_countries
  );
  const [package_weight, setPackage_weight] = React.useState(
    initialValues.package_weight
  );
  const [package_dimensions, setPackage_dimensions] = React.useState(
    initialValues.package_dimensions
  );
  const [shipping_type, setShipping_type] = React.useState(
    initialValues.shipping_type
  );
  const [manufacturer_name, setManufacturer_name] = React.useState(
    initialValues.manufacturer_name
  );
  const [cancellation_policy_days, setCancellation_policy_days] =
    React.useState(initialValues.cancellation_policy_days);
  const [return_policy_days, setReturn_policy_days] = React.useState(
    initialValues.return_policy_days
  );
  const [offer_rules, setOffer_rules] = React.useState(
    initialValues.offer_rules
  );
  const [approval_status, setApproval_status] = React.useState(
    initialValues.approval_status
  );
  const [is_active, setIs_active] = React.useState(initialValues.is_active);
  const [rating, setRating] = React.useState(initialValues.rating);
  const [review_count, setReview_count] = React.useState(
    initialValues.review_count
  );
  const [created_at, setCreated_at] = React.useState(initialValues.created_at);
  const [updated_at, setUpdated_at] = React.useState(initialValues.updated_at);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setSeller_id(initialValues.seller_id);
    setCategory_id(initialValues.category_id);
    setSub_category_id(initialValues.sub_category_id);
    setName(initialValues.name);
    setBrand_name(initialValues.brand_name);
    setModel_number(initialValues.model_number);
    setShort_description(initialValues.short_description);
    setDescription(initialValues.description);
    setHighlights(initialValues.highlights);
    setCurrentHighlightsValue("");
    setSpecifications(initialValues.specifications);
    setImage_url(initialValues.image_url);
    setImages(initialValues.images);
    setCurrentImagesValue("");
    setVideos(initialValues.videos);
    setCurrentVideosValue("");
    setPrice(initialValues.price);
    setMrp(initialValues.mrp);
    setCurrency(initialValues.currency);
    setStock(initialValues.stock);
    setSize_variants(initialValues.size_variants);
    setColor_variants(initialValues.color_variants);
    setGst_rate(initialValues.gst_rate);
    setPlatform_fee(initialValues.platform_fee);
    setCommission(initialValues.commission);
    setDelivery_countries(initialValues.delivery_countries);
    setPackage_weight(initialValues.package_weight);
    setPackage_dimensions(initialValues.package_dimensions);
    setShipping_type(initialValues.shipping_type);
    setManufacturer_name(initialValues.manufacturer_name);
    setCancellation_policy_days(initialValues.cancellation_policy_days);
    setReturn_policy_days(initialValues.return_policy_days);
    setOffer_rules(initialValues.offer_rules);
    setApproval_status(initialValues.approval_status);
    setIs_active(initialValues.is_active);
    setRating(initialValues.rating);
    setReview_count(initialValues.review_count);
    setCreated_at(initialValues.created_at);
    setUpdated_at(initialValues.updated_at);
    setErrors({});
  };
  const [currentHighlightsValue, setCurrentHighlightsValue] =
    React.useState("");
  const highlightsRef = React.createRef();
  const [currentImagesValue, setCurrentImagesValue] = React.useState("");
  const imagesRef = React.createRef();
  const [currentVideosValue, setCurrentVideosValue] = React.useState("");
  const videosRef = React.createRef();
  const validations = {
    seller_id: [{ type: "Required" }],
    category_id: [{ type: "Required" }],
    sub_category_id: [],
    name: [{ type: "Required" }],
    brand_name: [],
    model_number: [],
    short_description: [],
    description: [],
    highlights: [],
    specifications: [{ type: "JSON" }],
    image_url: [],
    images: [],
    videos: [],
    price: [{ type: "Required" }],
    mrp: [],
    currency: [],
    stock: [],
    size_variants: [{ type: "JSON" }],
    color_variants: [{ type: "JSON" }],
    gst_rate: [],
    platform_fee: [],
    commission: [],
    delivery_countries: [{ type: "JSON" }],
    package_weight: [],
    package_dimensions: [{ type: "JSON" }],
    shipping_type: [],
    manufacturer_name: [],
    cancellation_policy_days: [],
    return_policy_days: [],
    offer_rules: [{ type: "JSON" }],
    approval_status: [],
    is_active: [],
    rating: [],
    review_count: [],
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
          seller_id,
          category_id,
          sub_category_id,
          name,
          brand_name,
          model_number,
          short_description,
          description,
          highlights,
          specifications,
          image_url,
          images,
          videos,
          price,
          mrp,
          currency,
          stock,
          size_variants,
          color_variants,
          gst_rate,
          platform_fee,
          commission,
          delivery_countries,
          package_weight,
          package_dimensions,
          shipping_type,
          manufacturer_name,
          cancellation_policy_days,
          return_policy_days,
          offer_rules,
          approval_status,
          is_active,
          rating,
          review_count,
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
            query: createProduct.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ProductCreateForm")}
      {...rest}
    >
      <TextField
        label="Seller id"
        isRequired={true}
        isReadOnly={false}
        value={seller_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id: value,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
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
        label="Category id"
        isRequired={true}
        isReadOnly={false}
        value={category_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id: value,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.category_id ?? value;
          }
          if (errors.category_id?.hasError) {
            runValidationTasks("category_id", value);
          }
          setCategory_id(value);
        }}
        onBlur={() => runValidationTasks("category_id", category_id)}
        errorMessage={errors.category_id?.errorMessage}
        hasError={errors.category_id?.hasError}
        {...getOverrideProps(overrides, "category_id")}
      ></TextField>
      <TextField
        label="Sub category id"
        isRequired={false}
        isReadOnly={false}
        value={sub_category_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id: value,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.sub_category_id ?? value;
          }
          if (errors.sub_category_id?.hasError) {
            runValidationTasks("sub_category_id", value);
          }
          setSub_category_id(value);
        }}
        onBlur={() => runValidationTasks("sub_category_id", sub_category_id)}
        errorMessage={errors.sub_category_id?.errorMessage}
        hasError={errors.sub_category_id?.hasError}
        {...getOverrideProps(overrides, "sub_category_id")}
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
              seller_id,
              category_id,
              sub_category_id,
              name: value,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
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
        label="Brand name"
        isRequired={false}
        isReadOnly={false}
        value={brand_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name: value,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.brand_name ?? value;
          }
          if (errors.brand_name?.hasError) {
            runValidationTasks("brand_name", value);
          }
          setBrand_name(value);
        }}
        onBlur={() => runValidationTasks("brand_name", brand_name)}
        errorMessage={errors.brand_name?.errorMessage}
        hasError={errors.brand_name?.hasError}
        {...getOverrideProps(overrides, "brand_name")}
      ></TextField>
      <TextField
        label="Model number"
        isRequired={false}
        isReadOnly={false}
        value={model_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number: value,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.model_number ?? value;
          }
          if (errors.model_number?.hasError) {
            runValidationTasks("model_number", value);
          }
          setModel_number(value);
        }}
        onBlur={() => runValidationTasks("model_number", model_number)}
        errorMessage={errors.model_number?.errorMessage}
        hasError={errors.model_number?.hasError}
        {...getOverrideProps(overrides, "model_number")}
      ></TextField>
      <TextField
        label="Short description"
        isRequired={false}
        isReadOnly={false}
        value={short_description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description: value,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.short_description ?? value;
          }
          if (errors.short_description?.hasError) {
            runValidationTasks("short_description", value);
          }
          setShort_description(value);
        }}
        onBlur={() =>
          runValidationTasks("short_description", short_description)
        }
        errorMessage={errors.short_description?.errorMessage}
        hasError={errors.short_description?.hasError}
        {...getOverrideProps(overrides, "short_description")}
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
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description: value,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights: values,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            values = result?.highlights ?? values;
          }
          setHighlights(values);
          setCurrentHighlightsValue("");
        }}
        currentFieldValue={currentHighlightsValue}
        label={"Highlights"}
        items={highlights}
        hasError={errors?.highlights?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("highlights", currentHighlightsValue)
        }
        errorMessage={errors?.highlights?.errorMessage}
        setFieldValue={setCurrentHighlightsValue}
        inputFieldRef={highlightsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Highlights"
          isRequired={false}
          isReadOnly={false}
          value={currentHighlightsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.highlights?.hasError) {
              runValidationTasks("highlights", value);
            }
            setCurrentHighlightsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("highlights", currentHighlightsValue)
          }
          errorMessage={errors.highlights?.errorMessage}
          hasError={errors.highlights?.hasError}
          ref={highlightsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "highlights")}
        ></TextField>
      </ArrayField>
      <TextAreaField
        label="Specifications"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications: value,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.specifications ?? value;
          }
          if (errors.specifications?.hasError) {
            runValidationTasks("specifications", value);
          }
          setSpecifications(value);
        }}
        onBlur={() => runValidationTasks("specifications", specifications)}
        errorMessage={errors.specifications?.errorMessage}
        hasError={errors.specifications?.hasError}
        {...getOverrideProps(overrides, "specifications")}
      ></TextAreaField>
      <TextField
        label="Image url"
        isRequired={false}
        isReadOnly={false}
        value={image_url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url: value,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images: values,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            values = result?.images ?? values;
          }
          setImages(values);
          setCurrentImagesValue("");
        }}
        currentFieldValue={currentImagesValue}
        label={"Images"}
        items={images}
        hasError={errors?.images?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("images", currentImagesValue)
        }
        errorMessage={errors?.images?.errorMessage}
        setFieldValue={setCurrentImagesValue}
        inputFieldRef={imagesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Images"
          isRequired={false}
          isReadOnly={false}
          value={currentImagesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.images?.hasError) {
              runValidationTasks("images", value);
            }
            setCurrentImagesValue(value);
          }}
          onBlur={() => runValidationTasks("images", currentImagesValue)}
          errorMessage={errors.images?.errorMessage}
          hasError={errors.images?.hasError}
          ref={imagesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "images")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos: values,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            values = result?.videos ?? values;
          }
          setVideos(values);
          setCurrentVideosValue("");
        }}
        currentFieldValue={currentVideosValue}
        label={"Videos"}
        items={videos}
        hasError={errors?.videos?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("videos", currentVideosValue)
        }
        errorMessage={errors?.videos?.errorMessage}
        setFieldValue={setCurrentVideosValue}
        inputFieldRef={videosRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Videos"
          isRequired={false}
          isReadOnly={false}
          value={currentVideosValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.videos?.hasError) {
              runValidationTasks("videos", value);
            }
            setCurrentVideosValue(value);
          }}
          onBlur={() => runValidationTasks("videos", currentVideosValue)}
          errorMessage={errors.videos?.errorMessage}
          hasError={errors.videos?.hasError}
          ref={videosRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "videos")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Price"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={price}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price: value,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.price ?? value;
          }
          if (errors.price?.hasError) {
            runValidationTasks("price", value);
          }
          setPrice(value);
        }}
        onBlur={() => runValidationTasks("price", price)}
        errorMessage={errors.price?.errorMessage}
        hasError={errors.price?.hasError}
        {...getOverrideProps(overrides, "price")}
      ></TextField>
      <TextField
        label="Mrp"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={mrp}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp: value,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.mrp ?? value;
          }
          if (errors.mrp?.hasError) {
            runValidationTasks("mrp", value);
          }
          setMrp(value);
        }}
        onBlur={() => runValidationTasks("mrp", mrp)}
        errorMessage={errors.mrp?.errorMessage}
        hasError={errors.mrp?.hasError}
        {...getOverrideProps(overrides, "mrp")}
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
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency: value,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
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
      <TextField
        label="Stock"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={stock}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock: value,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.stock ?? value;
          }
          if (errors.stock?.hasError) {
            runValidationTasks("stock", value);
          }
          setStock(value);
        }}
        onBlur={() => runValidationTasks("stock", stock)}
        errorMessage={errors.stock?.errorMessage}
        hasError={errors.stock?.hasError}
        {...getOverrideProps(overrides, "stock")}
      ></TextField>
      <TextAreaField
        label="Size variants"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants: value,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.size_variants ?? value;
          }
          if (errors.size_variants?.hasError) {
            runValidationTasks("size_variants", value);
          }
          setSize_variants(value);
        }}
        onBlur={() => runValidationTasks("size_variants", size_variants)}
        errorMessage={errors.size_variants?.errorMessage}
        hasError={errors.size_variants?.hasError}
        {...getOverrideProps(overrides, "size_variants")}
      ></TextAreaField>
      <TextAreaField
        label="Color variants"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants: value,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.color_variants ?? value;
          }
          if (errors.color_variants?.hasError) {
            runValidationTasks("color_variants", value);
          }
          setColor_variants(value);
        }}
        onBlur={() => runValidationTasks("color_variants", color_variants)}
        errorMessage={errors.color_variants?.errorMessage}
        hasError={errors.color_variants?.hasError}
        {...getOverrideProps(overrides, "color_variants")}
      ></TextAreaField>
      <TextField
        label="Gst rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={gst_rate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate: value,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.gst_rate ?? value;
          }
          if (errors.gst_rate?.hasError) {
            runValidationTasks("gst_rate", value);
          }
          setGst_rate(value);
        }}
        onBlur={() => runValidationTasks("gst_rate", gst_rate)}
        errorMessage={errors.gst_rate?.errorMessage}
        hasError={errors.gst_rate?.hasError}
        {...getOverrideProps(overrides, "gst_rate")}
      ></TextField>
      <TextField
        label="Platform fee"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={platform_fee}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee: value,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.platform_fee ?? value;
          }
          if (errors.platform_fee?.hasError) {
            runValidationTasks("platform_fee", value);
          }
          setPlatform_fee(value);
        }}
        onBlur={() => runValidationTasks("platform_fee", platform_fee)}
        errorMessage={errors.platform_fee?.errorMessage}
        hasError={errors.platform_fee?.hasError}
        {...getOverrideProps(overrides, "platform_fee")}
      ></TextField>
      <TextField
        label="Commission"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={commission}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission: value,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.commission ?? value;
          }
          if (errors.commission?.hasError) {
            runValidationTasks("commission", value);
          }
          setCommission(value);
        }}
        onBlur={() => runValidationTasks("commission", commission)}
        errorMessage={errors.commission?.errorMessage}
        hasError={errors.commission?.hasError}
        {...getOverrideProps(overrides, "commission")}
      ></TextField>
      <TextAreaField
        label="Delivery countries"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries: value,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.delivery_countries ?? value;
          }
          if (errors.delivery_countries?.hasError) {
            runValidationTasks("delivery_countries", value);
          }
          setDelivery_countries(value);
        }}
        onBlur={() =>
          runValidationTasks("delivery_countries", delivery_countries)
        }
        errorMessage={errors.delivery_countries?.errorMessage}
        hasError={errors.delivery_countries?.hasError}
        {...getOverrideProps(overrides, "delivery_countries")}
      ></TextAreaField>
      <TextField
        label="Package weight"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={package_weight}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight: value,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.package_weight ?? value;
          }
          if (errors.package_weight?.hasError) {
            runValidationTasks("package_weight", value);
          }
          setPackage_weight(value);
        }}
        onBlur={() => runValidationTasks("package_weight", package_weight)}
        errorMessage={errors.package_weight?.errorMessage}
        hasError={errors.package_weight?.hasError}
        {...getOverrideProps(overrides, "package_weight")}
      ></TextField>
      <TextAreaField
        label="Package dimensions"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions: value,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.package_dimensions ?? value;
          }
          if (errors.package_dimensions?.hasError) {
            runValidationTasks("package_dimensions", value);
          }
          setPackage_dimensions(value);
        }}
        onBlur={() =>
          runValidationTasks("package_dimensions", package_dimensions)
        }
        errorMessage={errors.package_dimensions?.errorMessage}
        hasError={errors.package_dimensions?.hasError}
        {...getOverrideProps(overrides, "package_dimensions")}
      ></TextAreaField>
      <TextField
        label="Shipping type"
        isRequired={false}
        isReadOnly={false}
        value={shipping_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type: value,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.shipping_type ?? value;
          }
          if (errors.shipping_type?.hasError) {
            runValidationTasks("shipping_type", value);
          }
          setShipping_type(value);
        }}
        onBlur={() => runValidationTasks("shipping_type", shipping_type)}
        errorMessage={errors.shipping_type?.errorMessage}
        hasError={errors.shipping_type?.hasError}
        {...getOverrideProps(overrides, "shipping_type")}
      ></TextField>
      <TextField
        label="Manufacturer name"
        isRequired={false}
        isReadOnly={false}
        value={manufacturer_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name: value,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.manufacturer_name ?? value;
          }
          if (errors.manufacturer_name?.hasError) {
            runValidationTasks("manufacturer_name", value);
          }
          setManufacturer_name(value);
        }}
        onBlur={() =>
          runValidationTasks("manufacturer_name", manufacturer_name)
        }
        errorMessage={errors.manufacturer_name?.errorMessage}
        hasError={errors.manufacturer_name?.hasError}
        {...getOverrideProps(overrides, "manufacturer_name")}
      ></TextField>
      <TextField
        label="Cancellation policy days"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={cancellation_policy_days}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days: value,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.cancellation_policy_days ?? value;
          }
          if (errors.cancellation_policy_days?.hasError) {
            runValidationTasks("cancellation_policy_days", value);
          }
          setCancellation_policy_days(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "cancellation_policy_days",
            cancellation_policy_days
          )
        }
        errorMessage={errors.cancellation_policy_days?.errorMessage}
        hasError={errors.cancellation_policy_days?.hasError}
        {...getOverrideProps(overrides, "cancellation_policy_days")}
      ></TextField>
      <TextField
        label="Return policy days"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={return_policy_days}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days: value,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.return_policy_days ?? value;
          }
          if (errors.return_policy_days?.hasError) {
            runValidationTasks("return_policy_days", value);
          }
          setReturn_policy_days(value);
        }}
        onBlur={() =>
          runValidationTasks("return_policy_days", return_policy_days)
        }
        errorMessage={errors.return_policy_days?.errorMessage}
        hasError={errors.return_policy_days?.hasError}
        {...getOverrideProps(overrides, "return_policy_days")}
      ></TextField>
      <TextAreaField
        label="Offer rules"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules: value,
              approval_status,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.offer_rules ?? value;
          }
          if (errors.offer_rules?.hasError) {
            runValidationTasks("offer_rules", value);
          }
          setOffer_rules(value);
        }}
        onBlur={() => runValidationTasks("offer_rules", offer_rules)}
        errorMessage={errors.offer_rules?.errorMessage}
        hasError={errors.offer_rules?.hasError}
        {...getOverrideProps(overrides, "offer_rules")}
      ></TextAreaField>
      <TextField
        label="Approval status"
        isRequired={false}
        isReadOnly={false}
        value={approval_status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status: value,
              is_active,
              rating,
              review_count,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.approval_status ?? value;
          }
          if (errors.approval_status?.hasError) {
            runValidationTasks("approval_status", value);
          }
          setApproval_status(value);
        }}
        onBlur={() => runValidationTasks("approval_status", approval_status)}
        errorMessage={errors.approval_status?.errorMessage}
        hasError={errors.approval_status?.hasError}
        {...getOverrideProps(overrides, "approval_status")}
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
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active: value,
              rating,
              review_count,
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
        label="Rating"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={rating}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating: value,
              review_count,
              created_at,
              updated_at,
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
        label="Review count"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={review_count}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count: value,
              created_at,
              updated_at,
            };
            const result = onChange(modelFields);
            value = result?.review_count ?? value;
          }
          if (errors.review_count?.hasError) {
            runValidationTasks("review_count", value);
          }
          setReview_count(value);
        }}
        onBlur={() => runValidationTasks("review_count", review_count)}
        errorMessage={errors.review_count?.errorMessage}
        hasError={errors.review_count?.hasError}
        {...getOverrideProps(overrides, "review_count")}
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
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
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
              seller_id,
              category_id,
              sub_category_id,
              name,
              brand_name,
              model_number,
              short_description,
              description,
              highlights,
              specifications,
              image_url,
              images,
              videos,
              price,
              mrp,
              currency,
              stock,
              size_variants,
              color_variants,
              gst_rate,
              platform_fee,
              commission,
              delivery_countries,
              package_weight,
              package_dimensions,
              shipping_type,
              manufacturer_name,
              cancellation_policy_days,
              return_policy_days,
              offer_rules,
              approval_status,
              is_active,
              rating,
              review_count,
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
