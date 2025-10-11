'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import {
  getPropertyDetail,
  reset as resetProperty,
} from '@/app/lib/features/properties/propertySlice';

function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const { propertyDetail, isLoading, isError, message } = useAppSelector(
    (state) => state.property
  );

  useEffect(() => {
    if (id) dispatch(getPropertyDetail(id));
  }, [dispatch, id]);

  const property = propertyDetail;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading property details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        Failed to load property details: {message}
      </div>
    );
  }

  if (!property || !property.id) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Property not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      {/* Image */}
      {property.image_url ? (
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-[400px] object-cover rounded-2xl shadow-md mb-6"
        />
      ) : (
        <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-2xl mb-6">
          <span className="text-gray-500">No image available</span>
        </div>
      )}

      {/* Title and Location */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-gray-600">{property.location}</p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Info label="Guests" value={property.guests} />
        <Info label="Bedrooms" value={property.bedrooms} />
        <Info label="Beds" value={property.beds} />
        <Info label="Bathrooms" value={property.bathrooms} />
      </div>

      {/* Price and Views */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-semibold">
          ${property.price_per_night} / night
        </p>
        <p className="text-gray-500">Views: {property.views}</p>
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-2xl p-4 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{property.description}</p>
      </div>

      {/* Category and Favorite */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Category: {property.category}</p>
        <p className="text-gray-600">
          Favorited: {property.favorited?.length || 0}
        </p>
      </div>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-100 p-3 rounded-lg text-center shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default PropertyDetailPage;
