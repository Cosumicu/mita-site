"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { getPropertyList } from "../lib/features/properties/propertySlice";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    data: propertyListData,
    loading: propertyListLoading,
    success: propertyListSuccess,
    error: propertyListError,
    message: propertyListMessage,
  } = useAppSelector((state) => state.property.propertyList);

  // Extract query parameters
  const location = searchParams.get("location") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  const guests = searchParams.get("guests") || "";

  // ✅ Add dependency array and pass query parameters to API call
  useEffect(() => {
    const queryParams = {
      location,
      start_date,
      end_date,
      guests,
    };

    dispatch(getPropertyList(queryParams));
  }, [dispatch, location, start_date, end_date, guests]);

  if (propertyListLoading) return <div>Loading...</div>;
  if (propertyListError) return <div>Error: {propertyListMessage}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {location && <span>📍 {location}</span>}{" "}
        {start_date && end_date && (
          <span>
            • {start_date} → {end_date}
          </span>
        )}{" "}
        {guests && <span>• {guests} guest(s)</span>}
      </p>

      {propertyListData?.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyListData.map((property: any) => (
            <div
              key={property.id}
              className="border rounded-xl p-4 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold">{property.name}</h3>
              <p className="text-gray-500">{property.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default SearchPage;
