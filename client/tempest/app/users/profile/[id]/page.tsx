"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Card, Divider, Rate, Skeleton, Spin, Tag } from "antd";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserProfile,
  reset as resetUser,
} from "@/app/lib/features/users/userSlice";
import { getUserPropertyList } from "@/app/lib/features/properties/propertySlice";
import PropertyList from "@/app/components/properties/PropertyList";

export default function UserProfilePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const dispatch = useAppDispatch();

  const { userDetail, isError, isLoading, message } = useAppSelector(
    (state) => state.user
  );

  const { data: userPropertyList, loading: userPropertyListLoading } =
    useAppSelector((state) => state.property.userPropertyList);

  useEffect(() => {
    if (!id) return;

    dispatch(getUserProfile(id));
    dispatch(
      getUserPropertyList({
        filters: { userId: id },
        pagination: { page: 1, page_size: 10 },
      })
    );
  }, [id, dispatch]);

  useEffect(() => {
    if (!isError) return;
    toast.error(message);
    dispatch(resetUser());
  }, [isError, message, dispatch]);

  const user = userDetail;

  // loading state (profile)
  if (isLoading || !user) {
    return <Spin></Spin>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row border border-gray-200 shadow-lg rounded-lg">
        <div className="sm:basis-1/3 p-6">
          <div className="flex sm:flex-col space-y-2">
            <div className="basis-1/3 flex justify-center">
              <Avatar
                src={user.profile_picture_url}
                size={96}
                className="border border-gray-100 space-y-2"
              />
            </div>
            <div className="basis-2/3 px-6 sm:px-0">
              {" "}
              <p className="text-xl font-semibold sm:text-center">
                {user.username}
              </p>
              <p>{user.email}</p>
              <p>{user.phone_number}</p>
              <p>
                {user.city}, {user.country}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:block w-px bg-gray-200 my-6" />
        <div className="relative p-6 space-y-2">
          <div className="flex gap-4 item-center">
            <p className="text-2xl font-semibold">About {user.username}</p>
            <Button variant="outlined" color="primary" size="small">
              Edit Profile
            </Button>
          </div>

          <p>{user.about_me}</p>

          {/* your content */}
          <div className="">
            <Button type="primary">Message</Button>
          </div>
        </div>
      </div>

      <div>
        <PropertyList
          label="User Listings"
          properties={userPropertyList}
          loading={userPropertyListLoading}
        />
      </div>

      {/* USER LISTINGS */}
    </div>
  );
}
