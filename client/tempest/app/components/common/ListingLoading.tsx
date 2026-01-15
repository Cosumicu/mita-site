"use client";

import React from "react";
import { Card, Skeleton } from "antd";

type ListingLoadingProps = {
  title?: string;
  count?: number;
};

export default function ListingLoading({
  title = "",
  count = 10,
}: ListingLoadingProps) {
  return (
    <div className="ui-container ui-main-content">
      <p className="font-semibold text-xl sm:text-2xl">{title}</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card
            key={i}
            className="rounded-xl !shadow-none"
            size="small"
            variant="borderless"
            cover={
              <div className="w-full space-y-2 relative">
                <div className="aspect-[16/15] w-full">
                  <Skeleton.Image
                    active
                    className="!w-full !h-full !rounded-xl"
                  />
                </div>
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
