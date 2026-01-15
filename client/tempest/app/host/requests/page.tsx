"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getReservationRequestsList,
  approveReservation,
  declineReservation,
  resetReservationRequestActions,
} from "@/app/lib/features/properties/propertySlice";
import { List, Button, Spin, Empty, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { formatCurrency } from "@/app/lib/utils/format";

export default function ReservationRequestListPage() {
  const dispatch = useAppDispatch();

  const {
    data: reservations,
    count,
    loading,
    error,
  } = useAppSelector((state) => state.property.reservationRequestsList);
  const {
    loading: approveReservationLoading,
    success: approveReservationSuccess,
    error: approveReservationError,
    message: approveReservationMessage,
  } = useAppSelector((state) => state.property.approveReservation);
  const {
    loading: declineReservationLoading,
    success: declineReservationSuccess,
    error: declineReservationError,
    message: declineReservationMessage,
  } = useAppSelector((state) => state.property.declineReservation);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getReservationRequestsList({ page, pageSize }));
  }, [
    dispatch,
    approveReservationSuccess,
    declineReservationSuccess,
    page,
    pageSize,
  ]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">No reservation requests</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "gold",
    ACCEPTED: "green",
    DECLINED: "red",
    CANCELLED: "gray",
  };

  return (
    <div className="ui-container">
      <div className="ui-main-content">
        <p className="font-semibold text-xl sm:text-2xl">
          Reservation Requests
        </p>

        <div>
          <List
            itemLayout="vertical"
            dataSource={reservations}
            pagination={{
              current: page,
              pageSize,
              total: count,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (newPage, newSize) => {
                setPage(newPage);
                setPageSize(newSize);
              },
            }}
            renderItem={(item: any) => (
              <List.Item key={item.id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap text-sm sm:mb-0">
                    <h3 className="font-semibold text-lg">
                      {item.property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 flex-wrap">
                      <p>
                        {`${new Date(item.start_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )} - ${new Date(item.end_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}`}
                      </p>
                      <span>•</span>
                      <p>{item.guests} Guests</p>
                      <span>•</span>
                      <p className="text-black">
                        ₱{formatCurrency(Number(item.total_amount))}
                      </p>
                    </div>
                  </div>

                  <p className="hidden sm:block text-gray-500 text-sm mb-2">
                    {item.property.location}
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar
                      size={48}
                      src={item.user.profile_picture_url}
                      icon={
                        !item.user.avatar_url ? <UserOutlined /> : undefined
                      }
                    />
                    <div className="text-sm">
                      <p className="font-semibold">
                        {item.user.full_name || item.user.username}
                      </p>
                      <p className="text-gray-500">{item.user.email}</p>
                    </div>
                  </div>

                  <div>
                    Seals drift through the cold-blue quiet like soft commas in
                    the ocean’s sentence, surfacing with a quick breath before
                    slipping back into the green. Along rocky shores they gather
                    in loose, drowsy piles, whiskers twitching as if they’re
                    listening to stories told by wind and tide. Now and then one
                    lifts its head to watch gulls argue overhead, blinking
                    slowly as foam threads itself around the stones. In the
                    water they turn playful and precise—spinning, gliding, and
                    vanishing in a blink—leaving only ripples and a suggestion
                    of laughter behind. Even the sun seems to pause on their
                    slick backs, warming them for a moment before the sea calls
                    them under again.
                  </div>

                  {item.status === "PENDING" && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          dispatch(approveReservation(item.id));
                          dispatch(resetReservationRequestActions());
                        }}
                      >
                        Approve
                      </Button>

                      <Button
                        type="primary"
                        size="small"
                        danger
                        onClick={() => {
                          dispatch(declineReservation(item.id));
                          dispatch(resetReservationRequestActions());
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}
