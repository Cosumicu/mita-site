import React from "react";
import { Skeleton, Card, Divider } from "antd";

export function PropertyDetailLoading() {
  return (
    <div className="ui-container ui-main-content">
      {/* Title + actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 min-w-0">
          <Skeleton active title={{ width: "70%" }} paragraph={false} />
        </div>
      </div>

      {/* Main image */}
      <div className="w-full h-[250px] sm:h-[450px] rounded-xl overflow-hidden">
        <Skeleton.Image active className="!w-full !h-full" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Category + location + specs */}
          <div>
            <Skeleton active title={{ width: "55%" }} paragraph={false} />
            <div className="mt-2 flex gap-2">
              <Skeleton.Button active size="small" />
              <Skeleton.Button active size="small" />
              <Skeleton.Button active size="small" />
            </div>
          </div>

          {/* Reviews summary box */}
          <div className="border border-gray-300 rounded-lg py-4 px-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton active title={{ width: "60%" }} paragraph={false} />
              <Skeleton active title={{ width: "60%" }} paragraph={false} />
              <Skeleton active title={{ width: "60%" }} paragraph={false} />
            </div>
          </div>

          {/* Host info */}
          <div className="flex items-center gap-3">
            <Skeleton.Avatar active size={56} shape="circle" />
            <Skeleton
              active
              title={{ width: "40%" }}
              paragraph={{ rows: 1, width: "60%" }}
            />
          </div>

          {/* Description */}
          <div className="ui-main-content">
            <Skeleton active title={{ width: "25%" }} paragraph={{ rows: 4 }} />
          </div>

          {/* Amenities */}
          <div className="ui-main-content">
            <Skeleton active title={{ width: "35%" }} paragraph={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "80%" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right reservation card */}
        <div className="lg:col-span-1">
          <div className="sticky top-30">
            <Card className="rounded-2xl shadow-xl border border-gray-100">
              <Skeleton
                active
                title={{ width: "60%" }}
                paragraph={{ rows: 6 }}
              />
            </Card>

            <div className="my-6 p-4 border border-gray-200 rounded-xl text-center text-gray-400">
              <Skeleton
                active
                title={false}
                paragraph={{ rows: 1, width: "30%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <Divider className="border-gray-300 border-[1]" />

      {/* Reviews section */}
      <div className="ui-main-content">
        <Skeleton active title={{ width: "20%" }} paragraph={false} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Skeleton.Avatar active size={40} shape="circle" />
                <Skeleton
                  active
                  title={{ width: "35%" }}
                  paragraph={{ rows: 1, width: "45%" }}
                />
                <div className="ml-auto">
                  <Skeleton.Button active size="small" />
                </div>
              </div>
              <div className="mt-3">
                <Skeleton active title={false} paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
