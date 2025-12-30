"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyDetail,
  getPropertyReviews,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { Avatar, Button, Modal, Divider } from "antd";
import CreateReservationForm from "@/app/components/forms/CreateReservationForm";
import Link from "next/link";
import DeletePropertyConfirmationModal from "@/app/components/modals/DeletePropertyConfirmationModal";
import { div } from "framer-motion/client";

function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isUpdatePropertyModalOpen, setIsUpdatePropertyModalOpen] =
    useState(false);
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] =
    useState(false);

  const { user } = useAppSelector((state) => state.user);
  const {
    data: propertyDetail,
    loading: propertyDetailLoading,
    success: propertyDetailSuccess,
    error: propertyDetailError,
    message: propertyDetailMessage,
  } = useAppSelector((state) => state.property.propertyDetail);
  const {
    data: propertyReviews,
    loading: propertyReviewsLoading,
    success: propertyReviewsSuccess,
    error: propertyReviewsError,
    message: propertyReviewsMessage,
    count: propertyReviewsCount,
  } = useAppSelector((state) => state.property.propertyReviews);

  const { success: updatePropertySuccess } = useAppSelector(
    (state) => state.property.updateProperty
  );

  useEffect(() => {
    if (id) {
      dispatch(getPropertyDetail(id));
      dispatch(
        getPropertyReviews({
          propertyId: id,
          pagination: { page: 1, page_size: 10 },
        })
      );
    }
  }, [dispatch, updatePropertySuccess, id]);

  const property = propertyDetail;

  if (!property || !property.id) {
    return (
      <div className="text-center mt-10 text-gray-500">Property not found.</div>
    );
  }

  const handleToggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleFavorite(propertyId));
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
      {/* Header with title and action buttons */}
      <div className="flex items-center my-6">
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-semibold break-words overflow-wrap-break-word">
            {property.title}
          </p>
        </div>
        {/* {property.user.id === user?.id && (
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => router.push(`/host/update-listing/${property.id}`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              danger
              onClick={() => setIsDeletePropertyModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        )} */}

        {user && (
          <div className="flex gap-2 items-center">
            <Button
              type="default"
              size="small"
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-share"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M8.7 10.7l6.6 -3.4" />
                <path d="M8.7 13.3l6.6 3.4" />
              </svg>
              <span className="text-xs font-medium">Share</span>
            </Button>

            <Button
              type="default"
              size="small"
              onClick={(e) => handleToggleFavorite(e, property.id)}
            >
              <div
                className={`action-button-detail-2 like-button ${
                  property.liked ? "liked" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={property.liked ? "currentColor" : "none"}
                  stroke={property.liked ? "currentColor" : "gray"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icon-tabler-heart transition-transform duration-150"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </div>
              <span className="text-xs">
                {" "}
                {property.liked ? "Liked" : "Like"}{" "}
              </span>
            </Button>
          </div>
        )}
      </div>
      {/* Main image */}
      <div className="w-full h-[250px] sm:h-[450px] rounded-xl overflow-hidden bg-gray-100 flex justify-center items-center mb-8">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-full w-auto object-contain"
        />
      </div>
      {/* Grid layout for main content and reservation form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main content column (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          {/* Property type and location */}
          <div className="mb-6">
            <div className="max-w-full">
              <h2 className="text-xl font-semibold break-words overflow-wrap-break-word">
                {property.category} in {property.location}
              </h2>
            </div>

            {/* Property specs */}
            <div className="mt-3">
              <ol className="flex flex-wrap gap-2 text-gray-700 text-sm md:text-base">
                <li>
                  {property.guests} {property.guests === 1 ? "guest" : "guests"}
                </li>
                <li>•</li>
                <li>
                  {property.bedrooms}{" "}
                  {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
                </li>
                <li>•</li>
                <li>
                  {property.beds} {property.beds === 1 ? "bed" : "beds"}
                </li>
                <li>•</li>
                <li>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
                </li>
              </ol>
            </div>
          </div>

          {/* Reviews placeholder */}
          <div className="flex w-full border border-gray-200 rounded-lg mb-8 py-4 text-center text-gray-700">
            <div className="w-1/3 sm:w-[60%] py-2">Some title</div>
            <div className="w-1/3 sm:w-[20%] py-2 border-l border-gray-200">
              {propertyDetail.average_rating}{" "}
              <span className="text-sm">Stars</span>
            </div>
            <div className="w-1/3 sm:w-[20%] py-2 border-l border-gray-200">
              {propertyReviewsCount} <span className="text-sm">Reviews</span>
            </div>
          </div>

          {/* Host info */}
          <div className="flex items-center mb-8">
            <Link
              href={`/users/profile/${property.user.id}`}
              className="flex items-center gap-3"
            >
              <Avatar size={56} src={property.user.profile_picture_url} />
              <div>
                <p className="font-medium">
                  Hosted by {property.user.username}
                </p>
                <p className="text-sm text-gray-600">{property.user.email}</p>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4">Description</h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed break-words overflow-wrap-break-word word-break-break-word">
              {property.description}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4">Amenities & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.tags?.length > 0 ? (
                property.tags.map((tag) => (
                  <div
                    key={tag.value}
                    className="flex items-center gap-2 text-gray-700 py-2"
                  >
                    <span>{tag.label}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm col-span-2">
                  No amenities listed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reservation form column (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <div className="sticky top-30">
            <div className="p-6 rounded-2xl shadow-xl border border-gray-100 bg-white">
              <CreateReservationForm property={property} />
            </div>

            {/* Additional info or call-to-action can go here */}
            <div className="mt-6 p-4 border border-gray-200 rounded-xl text-center text-gray-400">
              Ads
            </div>
          </div>
        </div>
      </div>

      <Divider className="border-gray-300 border-[1]" />

      {/* Reviews Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Reviews
          {propertyReviews?.length > 0 && (
            <span className="ml-2 text-gray-500 text-sm">
              ({propertyReviewsCount})
            </span>
          )}
        </h3>

        {propertyReviewsLoading && (
          <p className="text-gray-500">Loading reviews...</p>
        )}

        {!propertyReviewsLoading && propertyReviews?.length === 0 && (
          <span className="text-gray-500 text-sm col-span-2">
            No reviews yet
          </span>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propertyReviews?.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar size={40} src={review.user.profile_picture_url} />
                <div>
                  <p className="font-medium">{review.user.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="ml-auto text-sm ">
                  {review.rating}
                  <span className="text-yellow-400 text-xl px-1">★</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>

        {propertyReviewsCount > 6 && (
          <div className="my-4 ">
            <Button>View all {propertyReviewsCount} reviews</Button>
          </div>
        )}
      </div>
      {/* Delete Property Modal */}
      <Modal
        title={
          <div className="text-center w-full font-medium">
            Delete this property?
          </div>
        }
        open={isDeletePropertyModalOpen}
        footer={null}
        onCancel={() => setIsDeletePropertyModalOpen(false)}
        width={400}
        centered
        destroyOnHidden
      >
        <DeletePropertyConfirmationModal
          propertyId={property.id}
          onSuccess={() => setIsDeletePropertyModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default PropertyDetailPage;
