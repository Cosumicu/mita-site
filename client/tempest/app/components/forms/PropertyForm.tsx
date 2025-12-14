import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Upload,
  Steps,
  theme,
  Select,
  Divider,
  Switch,
} from "antd";
import type { SelectProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  createProperty,
  getPropertyList,
  resetCreateProperty,
  resetPropertyList,
  updateProperty,
  resetUpdateProperty,
  getPropertyTags,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";
import LeftImage from "../navbar/LeftImage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const { TextArea } = Input;

type PropertyFormProps = {
  mode: "create" | "edit";
  initialValues?: any;
  onSuccess?: () => void;
};

const options: SelectProps["options"] = [];

const steps = [
  {
    title: "",
  },
  {
    title: "",
  },
  {
    title: "",
  },
  {
    title: "",
  },
  {
    title: "",
  },
  {
    title: "",
  },
];

function PropertyForm({ mode, initialValues, onSuccess }: PropertyFormProps) {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { error, loading, success, message } = useAppSelector((state) =>
    mode === "create"
      ? state.property.createProperty
      : state.property.updateProperty
  );
  const {
    data: propertyTagList,
    error: propertyTagListError,
    loading: propertyTagListLoading,
    success: propertyTagListSuccess,
  } = useAppSelector((state) => state.property.propertyTagList);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getPropertyTags());
  }, [dispatch]);

  const options: SelectProps["options"] = propertyTagList.map((ptag) => ({
    value: ptag.value,
    label: ptag.label,
  }));

  const next = async () => {
    try {
      // validate only the fields in the current step
      let fieldsToValidate: string[] = [];
      switch (current) {
        case 0:
          fieldsToValidate = ["category"];
          break;
        case 1:
          fieldsToValidate = ["title", "description"];
          break;
        case 2:
          fieldsToValidate = ["price_per_night"];
          break;
        case 3:
          fieldsToValidate = [];
          break;
        case 4:
          fieldsToValidate = ["location"];
          break;
        case 5:
          fieldsToValidate = ["image"];
          break;
        default:
          fieldsToValidate = [];
      }

      await form.validateFields(fieldsToValidate);
      setCurrent(current + 1);
    } catch (error) {
      // validation failed, stay on the current step
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  // SLIDER CODE END
  useEffect(() => {
    if (mode === "edit" && initialValues) {
      form.setFieldsValue({
        ...initialValues,

        weekly_discount_rate: initialValues.weekly_discount_rate
          ? initialValues.weekly_discount_rate * 100
          : 0,
        monthly_discount_rate: initialValues.monthly_discount_rate
          ? initialValues.monthly_discount_rate * 100
          : 0,
        image: initialValues.image
          ? [
              {
                uid: "-1",
                name: "current-image.jpg",
                status: "done",
                url: initialValues.image,
              },
            ]
          : [],
      });
    }
  }, [mode, initialValues]);

  useEffect(() => {
    if (success) {
      toast.success(
        mode === "create"
          ? "Property created successfully"
          : "Property updated successfully"
      );

      dispatch(resetUpdateProperty());
      dispatch(resetCreateProperty());
      dispatch(getPropertyList());
      dispatch(resetPropertyList());

      if (onSuccess) onSuccess();
    }
    if (error) {
      toast.error(message);
    }
    dispatch(resetCreateProperty());
  }, [success, error, message, mode, onSuccess, dispatch]);

  const onFinish = (values: any) => {
    const formData = new FormData();

    // convert weekly/monthly discounts to rates
    const weeklyRate = values.weekly_discount_rate / 100;
    const monthlyRate = values.monthly_discount_rate / 100;

    formData.append("category", values.category);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("bedrooms", values.bedrooms);
    formData.append("beds", values.beds);
    formData.append("bathrooms", values.bathrooms);
    formData.append("guests", values.guests);
    formData.append("price_per_night", values.price_per_night);
    values.tags?.forEach((tagValue: string) =>
      formData.append("tags", tagValue)
    );
    // formdata doesnt accept numbers
    formData.append("weekly_discount_rate", weeklyRate.toString());
    formData.append("monthly_discount_rate", monthlyRate.toString());
    formData.append("cleaning_fee", values.cleaning_fee);
    formData.append("is_instant_booking", values.is_instant_booking);
    formData.append("location", values.location);
    formData.append("image", values.image?.[0]?.originFileObj); // do this if using antd upload

    if (values.image && values.image[0]?.originFileObj) {
      formData.append("image", values.image[0].originFileObj);
    }

    if (mode === "edit") {
      dispatch(
        updateProperty({
          propertyId: initialValues.id,
          formData,
        })
      );
      // dispatch(resetUpdateProperty());
    } else {
      dispatch(createProperty(formData));
      // dispatch(resetCreateProperty());
    }
  };

  return (
    <>
      <nav className="w-full h-16 fixed top-0 left-0 z-10 bg-secondary">
        <div className="flex justify-between items-center gap-2 mx-2 sm:mx-4 md:mx-6 lg:mx-8 h-full">
          {/* Left content */}
          <LeftImage />
          <div className="flex gap-4 px-4">
            <button>Help</button>{" "}
            <button onClick={() => router.push("/")}>Exit</button>
          </div>
        </div>
      </nav>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="pb-24">
          <div style={{ position: "relative" }}>
            {/* Step 0 */}
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 0 ? 1 : 0,
                x: current === 0 ? 0 : -50,
                display: current === 0 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 0 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">
                Which of these best describes your place?
              </p>
              <div className="flex justify-center items-center py-10">
                <Form.Item
                  name="category"
                  preserve={true}
                  rules={[{ required: true }]}
                  required={false}
                >
                  <Radio.Group size="large">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                      }}
                    >
                      <Radio.Button value="House">House</Radio.Button>
                      <Radio.Button value="Apartment">Apartment</Radio.Button>
                      <Radio.Button value="Bed & Breakfast">
                        Bed & Breakfast
                      </Radio.Button>
                      <Radio.Button value="Cabin">Cabin</Radio.Button>
                      <Radio.Button value="Tent">Tent</Radio.Button>
                      <Radio.Button value="Hotel">Hotel</Radio.Button>
                      <Radio.Button value="Treehouse">Tree House</Radio.Button>
                      <Radio.Button value="Barn">Barn</Radio.Button>
                      <Radio.Button value="Container">Container</Radio.Button>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
            </motion.div>

            {/* Step 1 */}
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 1 ? 1 : 0,
                x: current === 1 ? 0 : -50,
                display: current === 1 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 1 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">
                Tell us more about your place
              </p>
              <div className="flex justify-center items-center">
                <div className="flex flex-col w-[90%] py-10">
                  <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: "Title is required" }]}
                    required={false}
                  >
                    <Input maxLength={255} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      { required: true, message: "Description is required" },
                    ]}
                    required={false}
                  >
                    <TextArea rows={10} style={{ resize: "none" }} />
                  </Form.Item>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 2 ? 1 : 0,
                x: current === 2 ? 0 : -50,
                display: current === 2 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 2 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">
                Share some basics about your place
              </p>
              <div className="flex justify-center items-center">
                <div className="w-[75%] py-10">
                  <div className="flex items-center">
                    <label>Guests</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="guests"
                        initialValue={1}
                        rules={[{ required: true, message: "Guests required" }]}
                        required={false}
                        noStyle
                      >
                        <InputNumber min={1} max={99} step={1} />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label>Bedrooms</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="bedrooms"
                        initialValue={0}
                        rules={[{ required: true, message: "Guests required" }]}
                        required={false}
                        noStyle
                      >
                        <InputNumber min={0} max={99} step={1} />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label>Beds</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="beds"
                        initialValue={1}
                        rules={[{ required: true, message: "Guests required" }]}
                        required={false}
                        noStyle
                      >
                        <InputNumber min={1} max={99} step={1} />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label>Bathrooms</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="bathrooms"
                        initialValue={1}
                        rules={[{ required: true, message: "Guests required" }]}
                        required={false}
                        noStyle
                      >
                        <InputNumber min={1} max={99} step={1} />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label>Price per night</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="price_per_night"
                        initialValue={0}
                        rules={[{ required: true, message: "required!" }]}
                        required={true}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          max={999999}
                          step={1}
                          prefix="₱"
                          style={{ width: 150 }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <Divider />
                  <Form.Item
                    name="tags"
                    label="Amenities"
                    rules={[{ required: false }]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Select property tags"
                      options={options}
                      loading={propertyTagListLoading}
                    />
                  </Form.Item>
                </div>
              </div>
            </motion.div>

            {/* Repeat the same pattern for steps 3, 4, and 5 */}
            {/* Step 3 */}
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 3 ? 1 : 0,
                x: current === 3 ? 0 : -50,
                display: current === 3 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 3 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">
                Add discounts, miscellaneous fees, etc.
              </p>
              <div className="flex justify-center items-center">
                <div className="w-[75%] py-10">
                  <div className="flex items-center">
                    <label>Weekly Discount</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="weekly_discount_rate"
                        initialValue={0}
                        required={false}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          step={1}
                          prefix="%"
                          style={{ width: 100 }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label>Monthly Discount</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="monthly_discount_rate"
                        initialValue={0}
                        required={false}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          step={1}
                          prefix="%"
                          style={{ width: 100 }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label>Cleaning Fee</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="cleaning_fee"
                        initialValue={0}
                        required={false}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          max={9999}
                          step={1}
                          prefix="₱"
                          style={{ width: 150 }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label>Instant Booking</label>
                    <div className="ml-auto my-4">
                      <Form.Item
                        name="is_instant_booking"
                        valuePropName="checked"
                        initialValue={false}
                        required={false}
                        noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </div>{" "}
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 4 ? 1 : 0,
                x: current === 4 ? 0 : -50,
                display: current === 4 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 4 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">Where's your place located?</p>
              <div className="flex justify-center items-center">
                <div className="flex flex-col w-[90%] py-10">
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      { required: true, message: "Location is required" },
                    ]}
                    required={false}
                  >
                    <Input maxLength={255}></Input>
                  </Form.Item>
                </div>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: current === 5 ? 1 : 0,
                x: current === 5 ? 0 : -50,
                display: current === 5 ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: current === 5 ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <p className="text-2xl font-bold">Attach an image</p>
              <div className="flex justify-center items-center h-[250px]">
                <Form.Item
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                  rules={[
                    { required: true, message: "Please upload an image" },
                  ]}
                >
                  <Upload
                    beforeUpload={() => false} // prevent auto upload
                    listType="picture"
                    maxCount={1}
                  >
                    <Button>Upload Image</Button>
                  </Upload>
                </Form.Item>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="w-full fixed bottom-0 left-0 z-50">
          <div className="hidden sm:block bg-transparent">
            <Steps
              progressDot
              current={current}
              items={items}
              responsive={false}
            />
          </div>
          <div className="bg-secondary py-4">
            <div className="w-full flex justify-around items-center">
              <div>
                {current > 0 && (
                  <Button size="large" onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </div>

              <div>
                {current < steps.length - 1 && (
                  <Button type="primary" size="large" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary" size="large" htmlType="submit">
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default PropertyForm;
