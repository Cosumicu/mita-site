"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getUserLikesList } from "@/app/lib/features/properties/propertySlice";
import Link from "next/link";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { data: favorites, loading } = useAppSelector(
    (state) => state.property.likedList
  );

  useEffect(() => {
    dispatch(getUserLikesList());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-gray-600 text-lg">
        Loading favorites...
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center mt-24 text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">No Favorites Yet</h2>
        <p className="text-center">
          Tap the ❤️ icon on a property to add it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-6">Your Favorites</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((property) => (
          <Link
            key={property.id}
            href={`/property/${property.id}`}
            className="border rounded-xl p-3 shadow hover:shadow-lg transition"
          >
            <img
              src={property.image_url}
              alt={property.title}
              className="rounded-lg w-full h-48 object-cover mb-3"
            />

            <h2 className="text-xl font-semibold">{property.title}</h2>

            <p className="text-gray-500">{property.location}</p>
            <p className="mt-2 font-semibold">
              ₱{property.price_per_night} / night
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
