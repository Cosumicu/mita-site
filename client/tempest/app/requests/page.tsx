"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getReservationRequestsList,
  approveReservation,
  declineReservation,
} from "@/app/lib/features/properties/propertySlice";
import { Card, Button, Spin, Empty } from "antd";
import { toast } from "react-toastify";

export default function ReservationRequestListPage() {
  const dispatch = useAppDispatch();
  const {
    data: reservations,
    loading,
    error,
  } = useAppSelector((state) => state.property.reservationRequestsList);

  useEffect(() => {
    dispatch(getReservationRequestsList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
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
        <Empty description="No reservation requests" />
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reservations.map((reservation: any) => (
        <Card
          key={reservation.id}
          title={reservation.property.title}
          extra={<span>{reservation.status}</span>}
          className="rounded-xl shadow hover:shadow-md transition"
        >
          <p>
            <strong>Guest:</strong> {reservation.user.username}
          </p>
          <p>
            <strong>Check-in:</strong> {reservation.start_date}
          </p>
          <p>
            <strong>Check-out:</strong> {reservation.end_date}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              type="primary"
              onClick={() =>
                dispatch(
                  // call your approveReservation thunk here
                  approveReservation(reservation.id)
                )
              }
            >
              Approve
            </Button>
            <Button
              danger
              onClick={() =>
                dispatch(
                  // call your rejectReservation thunk here
                  declineReservation(reservation.id)
                )
              }
            >
              Reject
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
