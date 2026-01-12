"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserLikesList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import Link from "next/link";
import { Alert, Card, Skeleton, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { formatCurrency } from "@/app/lib/utils/format";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isLoading: userLoading,
    hasCheckedAuth,
  } = useAppSelector((state) => state.user);
  const { data: userLikesList, loading: userLikesListLoading } = useAppSelector(
    (state) => state.property.likedList
  );

  const handleToggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(propertyId));
  };

  useEffect(() => {
    if (!hasCheckedAuth || userLoading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    dispatch(getUserLikesList());
  }, [user, userLoading, hasCheckedAuth, dispatch, router, pathname]);

  if (!hasCheckedAuth || userLoading) {
    return (
      <div className="h-screen px-4 sm:px-10 space-y-4">
        <p className="font-semibold sm:text-xl">Saved Listings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-xl !shadow-none"
              size="small"
              variant="borderless"
              cover={
                <div className="w-full h-[160px] sm:h-[200px]">
                  <Skeleton.Image
                    active
                    className="!w-full !h-full !rounded-xl"
                  />
                </div>
              }
            >
              <Skeleton active title={false} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen px-4 sm:px-10 space-y-4">
        <p className="font-semibold sm:text-xl">Saved Listings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-xl !shadow-none"
              size="small"
              variant="borderless"
              cover={
                <div className="w-full h-[160px] sm:h-[200px]">
                  <Skeleton.Image
                    active
                    className="!w-full !h-full !rounded-xl"
                  />
                </div>
              }
            >
              <Skeleton active title={false} paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen px-4 sm:px-10 space-y-4">
      <p className="font-semibold text-xl">Saved Listings</p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-4 gap-4">
        {userLikesList.map((property: any) => (
          <Link href={`/properties/${property.id}`} key={property.id}>
            <Card
              styles={{ body: { padding: 0 } }}
              className="!shadow-none shrink-0 snap-start"
              size="small"
              variant="borderless"
            >
              <div className="w-[160px] sm:w-[184px] space-y-2 relative">
                <div className="aspect-[16/15]">
                  <img
                    className="w-full h-full object-cover rounded-xl"
                    alt={property.title}
                    src={property.image_url}
                  />
                </div>

                {user && (
                  <div
                    className={`absolute top-1 right-1 action-button-detail like-button ${
                      property.liked ? "liked" : ""
                    }`}
                    onClick={(e) => handleToggleFavorite(e, property.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={property.liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icon-tabler-heart transition-transform duration-150"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold truncate">
                    {property.category} in {property.location}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ₱{formatCurrency(Number(property.price_per_night))} per
                    night
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
