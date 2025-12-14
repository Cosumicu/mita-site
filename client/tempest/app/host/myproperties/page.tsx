"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import { getUserPropertyList } from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag, Switch, Button, Drawer } from "antd";
import { useRouter } from "next/navigation";
import PropertyDetailsDrawer from "@/app/components/drawer/PropertyDetailsDrawer";

export default function MyPropertiesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: userPropertyList,
    count,
    loading: userPropertyListLoading,
  } = useAppSelector((state) => state.property.userPropertyList);

  const { user } = useAppSelector((state) => state.user);

  const [isPropertyDetailsDrawerOpen, setIsPropertyDetailsDrawerOpen] =
    useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (user?.id) {
      dispatch(
        getUserPropertyList({
          userId: user.id,
          pagination: { page: currentPage, page_size: pageSize },
        })
      );
    }
  }, [dispatch, user, currentPage, pageSize]);

  if (userPropertyListLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Listing",
      dataIndex: "property",
      render: (_: any, record: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer w-[300px]"
          onClick={() => router.push(`/properties/${record.property.id}`)}
        >
          <div>
            <Image
              src={record.property.image_url}
              alt={record.property.title}
              width={80}
              height={60}
              className="rounded-md object-cover"
              preview={false}
            />
          </div>
          <div className="min-w-0">
            {" "}
            <p className="font-semibold truncate">
              {record.property.title}
            </p>{" "}
            <p className="text-gray-500 text-sm truncate">
              {record.property.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Guests",
      dataIndex: "guests",
      align: "center" as const,
    },
    {
      title: "Price / Night",
      dataIndex: "price_per_night",
      render: (price: number) => `₱${formatCurrency(Number(price))}`,
    },
    {
      title: "Date Added",
      dataIndex: "created_at",
      render: (date: string) => `${formatDate(date)}`,
    },
    // {
    //   title: "Views",
    //   dataIndex: "views_count",
    //   align: "center",
    // },
    // {
    //   title: "Likes",
    //   dataIndex: "likes_count",
    //   align: "center",
    // },
    // {
    //   title: "Reservations",
    //   dataIndex: "reservations_count",
    //   align: "center",
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap: any = {
          ACTIVE: "green",
          INACTIVE: "gray",
          PENDING: "gold",
          SUSPENDED: "red",
        };
        return <Tag color={colorMap[status] || "blue"}>{status}</Tag>;
      },
    },
    {
      title: "Instant Book",
      dataIndex: "instant_booking",
      align: "center" as const,
      // TODO: Add instant booking feature
      render: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch size="small" />
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-4">
          <Button
            variant="outlined"
            size="small"
            type="primary"
            onClick={() => {
              setSelectedProperty(record);
              setIsPropertyDetailsDrawerOpen(true);
            }}
          >
            <p className="text-xs">Details</p>
          </Button>
          <button
            onClick={() => {
              console.log("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-dots"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const tableData = userPropertyList?.map((item: any) => ({
    key: item.id,
    ...item,
  }));

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="px-4 sm:px-10">
      <p className="my-4 font-semibold sm:text-xl">Listings</p>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={tableData}
          loading={userPropertyListLoading}
          pagination={{
            current: currentPage,
            pageSize,
            total: count,
          }}
          onChange={handleTableChange}
        />
      </div>
      <Drawer
        title="Listing Details"
        placement="right"
        width={500}
        onClose={() => setIsPropertyDetailsDrawerOpen(false)}
        open={isPropertyDetailsDrawerOpen}
      >
        {selectedProperty ? (
          <PropertyDetailsDrawer propertyId={selectedProperty.id} />
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  );
}
