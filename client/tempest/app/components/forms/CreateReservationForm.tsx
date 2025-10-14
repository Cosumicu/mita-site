import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  createReservation,
  reset as resetProperty,
} from "@/app/lib/features/properties/propertySlice";
import { Avatar, Button, Form, InputNumber, DatePicker } from "antd";
import { toast } from "react-toastify";
import { Property } from "@/app/lib/features/properties/propertyService";
import dayjs from "dayjs";

type CreateReservationFormProps = {
  property: Property;
};

const { RangePicker } = DatePicker;

function CreateReservationForm({ property }: CreateReservationFormProps) {
  const dispatch = useAppDispatch();
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.property
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Reservation created successfully");
      dispatch(resetProperty());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetProperty());
    }
  }, [isSuccess, isError, message, dispatch]);

  const onFinish = (values: any) => {
    const [start, end] = values.dates;
    const formData = {
      property_id: property.id,
      start_date: dayjs(start).format("YYYY-MM-DD"),
      end_date: dayjs(end).format("YYYY-MM-DD"),
      guests: values.guests,
    };

    console.log("Reservation payload:", formData);
    dispatch(createReservation(formData as any));
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Price section */}
      <div className="text-2xl font-semibold text-gray-800 text-center">
        ₱{property.price_per_night}
        <span className="text-gray-500 text-base font-normal"> / night</span>
      </div>

      {/* Guest selectors */}
      <Form
        className="flex flex-col items-center"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="flex items-center justify-center">
          <Form.Item
            name="dates"
            rules={[{ required: true, message: "Please select a date range" }]}
          >
            <RangePicker />
          </Form.Item>
        </div>
        <div className="w-[300px] grid grid-cols-2 items-center">
          <span className="ml-2">Guests</span>
          <div>
            <Form.Item
              name="guests"
              initialValue={1}
              noStyle
              rules={[{ required: true, message: "Guests required" }]}
            >
              <InputNumber
                className=""
                min={1}
                max={property.guests}
                step={1}
                style={{ width: "145px" }}
              />
            </Form.Item>
          </div>
        </div>

        {/* Reserve button */}
        <div className="pt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{
              backgroundColor: "rgb(236 72 153)",
              border: "none",
            }}
            className="h-11 text-white font-semibold text-lg rounded-lg hover:bg-pink-500"
          >
            Reserve
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateReservationForm;
