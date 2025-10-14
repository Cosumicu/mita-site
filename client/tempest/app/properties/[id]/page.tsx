"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyDetail,
  reset as resetProperty,
} from "@/app/lib/features/properties/propertySlice";
import { Avatar, Button, Form, InputNumber, Image } from "antd";
import CreateReservationForm from "@/app/components/forms/CreateReservationForm";
import { toast } from "react-toastify"

function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const { propertyDetail, isLoading, isError, isSuccess, message } =
    useAppSelector((state) => state.property);

  useEffect(() => {
    if (id) dispatch(getPropertyDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetProperty());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetProperty());
    }
  }, [isSuccess, isError, message, dispatch]);

  const property = propertyDetail;

  if (!property || !property.id) {
    return (
      <div className="text-center mt-10 text-gray-500">Property not found.</div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <p className="text-2xl my-4">{property.title}</p>
      <div className="bg-100 w-full h-[450px] rounded-xl flex justify-center items-center">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-full w-auto object-contain rounded-xl"
        />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:basis-[60%] py-4">
          <div className="text-center sm:text-left">
            <p className="text-lg">{`${property.category} in ${property.location}`}</p>
          </div>
          <div className="flex sm:block justify-center text-center">
            <ol className="flex space-x-2 text-gray-700 text-sm">
              <li>
                {property.guests} {property.guests === 1 ? "guest" : "guests"}{" "}
                &bull;
              </li>
              <li>
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "bedroom" : "bedrooms"} &bull;
              </li>
              <li>
                {property.beds} {property.beds === 1 ? "bed" : "beds"} &bull;
              </li>
              <li>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
              </li>
            </ol>
          </div>
          <div className="w-[full] text-center border border-gray-200 rounded-lg my-4 py-4">
            reviews
          </div>
          <div className="flex items-center justify-center sm:justify-start w-[full] py-4">
            <div className="inline-block">
              <Avatar size="large" src={property.user.profile_picture} />
            </div>
            <div className="inline-block ml-2">
              <p>{`Hosted by ${property.user.username}`}</p>
            </div>
          </div>
          <div className="py-4 px-6 sm:px-0">{property.description}</div>
        </div>
        <div className="w-full sm:basis-[40%] p-6 rounded-2xl shadow-xl my-4 ml-12 border border-gray-100">
          <CreateReservationForm property={property} />
        </div>
      </div>
    </div>
  );
}
export default PropertyDetailPage;
