"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList,
  toggleFavorite,
  reset as resetProperty,
} from "@/app/lib/features/properties/propertySlice";

import { toast } from "react-toastify";

type PropertyListProps = {
  label: string;
  location: string;
};

const PropertyList = ({ label, location }: PropertyListProps) => {
  const dispatch = useAppDispatch();
  const { propertyList, isError, isSuccess, isLoading, message } =
    useAppSelector((state) => state.property);

  useEffect(() => {
    dispatch(getPropertyList());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetProperty());
    }

    if (isError) {
      toast.error(message);
      dispatch(resetProperty());
    }
  }, [isSuccess, isError, message, dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector<HTMLDivElement>(".ant-card");
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 16;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
        behavior: "smooth",
      });
    }
  };

  const handleToggleFavorite = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    propertyId: string
  ) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    dispatch(toggleFavorite(propertyId));
  };

  return (
    <div className="my-2">
      {/* Label + arrows row */}
      <div className="flex justify-between items-center">
        {/* Left: Label */}
        <h2>{label}</h2>

        {/* Right: Arrow buttons */}
        <div className="hidden sm:flex gap-1">
          <Button
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
          />
          <Button
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            onClick={() => scroll("right")}
          />
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-2 p-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i} // ← ADD THIS
                className="flex-shrink-0 w-40 md:w-60 snap-start !shadow-none"
                size="small"
                variant="borderless"
                cover={
                  <div className="w-full h-[200px]">
                    <Skeleton.Image
                      active
                      className="!w-full !h-full !rounded-xl"
                    />
                  </div>
                }
              >
                <Skeleton
                  active
                  loading={true}
                  title={false}
                  paragraph={{ rows: 1, width: "100%" }}
                />
              </Card>
            ))
          : propertyList.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id}>
                <Card
                  className="flex-shrink-0 w-40 sm:w-60 snap-start !shadow-none"
                  key={property.id}
                  size="small"
                  variant="borderless"
                  cover={
                    <div className="relative w-full h-[150px] sm:h-[200px]">
                      <img
                        className="w-full h-full object-cover rounded-xl"
                        alt={property.title}
                        src={property.image_url}
                      />
                      <div
                        onClick={(e) => handleToggleFavorite(e, property.id)}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 cursor-pointer transition"
                      >
                        {property.favorited ? (
                          <HeartFilled className="text-red-500 text-lg" />
                        ) : (
                          <HeartOutlined className="text-gray-700 text-lg" />
                        )}
                      </div>
                    </div>
                  }
                >
                  <div className="ml-[-10]">
                    <h3 className="text-[.75rem] font-semibold truncate">
                      {property.title}
                    </h3>
                    <p className="text-[.75rem] text-gray-500">
                      ₱{property.price_per_night}/night
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default PropertyList;
