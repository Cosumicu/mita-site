"use client";

import React, { useState } from "react";
import { Reservation } from "@/app/lib/definitions";
import { formatCurrency, formatDate, formatTime } from "@/app/lib/utils/format";
import { Tag, Avatar, Card, Row, Col, Divider, Button, Modal } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/app/lib/hooks";
import CreatePropertyReviewModal from "@/app/components/modals/CreatePropertyReviewModal";

interface ReservationDetailsDrawerProps {
  reservation: Reservation;
}

const colorMap: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  DECLINED: "red",
  ONGOING: "green",
  COMPLETED: "blue",
  CANCELLED: "gray",
};

const statusTextMap: Record<string, string> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

function ReservationDetailsDrawer({
  reservation,
}: ReservationDetailsDrawerProps) {
  // Safe access to nested properties with fallbacks
  const propertyTitle = reservation.property?.title || "Untitled Property";
  const propertyLocation =
    reservation.property?.location || "Location not specified";
  const propertyImage =
    reservation.property?.image_url || "/placeholder-property.jpg";
  const hostUsername = reservation.property?.user?.username || "Unknown Host";
  const hostId = reservation.property?.user?.id || "";
  const hostProfilePicture =
    reservation.property?.user?.profile_picture_url || undefined;

  const user = useAppSelector((state) => state.user);

  const [isCreatePropertyReviewOpen, setCreatePropertyReviewOpen] =
    useState(false);

  // Parse numeric values safely
  const longStayDiscount = parseFloat(
    reservation.long_stay_discount?.toString() || "0"
  );
  const guestServiceFeeRate = parseFloat(
    reservation.guest_service_fee_rate?.toString() || "0"
  );
  const taxRate = parseFloat(reservation.tax_rate?.toString() || "0");
  const cleaningFee = parseFloat(reservation.cleaning_fee?.toString() || "0");
  const totalAmount = parseFloat(reservation.total_amount?.toString() || "0");

  // Calculate duration
  const startDate = reservation.start_date
    ? new Date(reservation.start_date)
    : null;
  const endDate = reservation.end_date ? new Date(reservation.end_date) : null;
  const duration =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        )
      : 0;

  return (
    <div className="flex flex-col gap-4 p-2">
      <div>
        <p className="font-bold text-xl">{reservation.property.title}</p>
        <p className="text-gray-600">{reservation.property.location}</p>
      </div>
      <div className="w-full h-48 rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={reservation.property.image_url}
          alt={reservation.property.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          {hostId ? (
            <Link href={`/users/profile/${hostId}`}>
              <Avatar
                size="large"
                src={hostProfilePicture}
                icon={<UserOutlined />}
              />
            </Link>
          ) : (
            <Avatar size="large" icon={<UserOutlined />} />
          )}
          <div className="ml-3">
            <p className="font-semibold">
              Hosted by {reservation.user.username}
            </p>
            <p className="text-sm text-gray-500">{reservation.user.email}</p>
          </div>
        </div>
      </div>
      {/* Booking Details Grid */}
      <Card title="Booking Details" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
              <CalendarOutlined className="text-blue-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold text-gray-800">
                  {reservation.start_date
                    ? formatDate(reservation.start_date)
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {reservation.checkin_time
                    ? formatTime(reservation.checkin_time)
                    : "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
              <CalendarOutlined className="text-green-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Checkout</p>
                <p className="font-semibold text-gray-800">
                  {reservation.end_date
                    ? formatDate(reservation.end_date)
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {reservation.checkout_time
                    ? formatTime(reservation.checkout_time)
                    : "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
              <UserOutlined className="text-purple-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-semibold text-gray-800 text-xl">
                  {reservation.guests || 0}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
              {reservation.is_instant_booking ? (
                <CheckCircleOutlined className="text-orange-600 text-xl mr-3" />
              ) : (
                <ClockCircleOutlined className="text-orange-600 text-xl mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-500">Booking Type</p>
                <p className="font-semibold text-gray-800">
                  {reservation.is_instant_booking
                    ? "Instant Booking"
                    : "Request Booking"}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      {/* Price Breakdown */}
      <Card title="Price Breakdown" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Nightly rate × {duration} nights
            </span>
            <span className="font-semibold">
              ₱
              {formatCurrency(
                totalAmount / (1 + guestServiceFeeRate + taxRate) || 0
              )}
            </span>
          </div>

          {longStayDiscount > 0 && (
            <div className="flex justify-between items-center py-2 bg-green-50 p-3 rounded-lg">
              <span className="text-green-700">
                <TagOutlined className="mr-2" />
                Long stay discount ({(longStayDiscount * 100).toFixed(0)}%)
              </span>
              <span className="font-semibold text-green-700">
                -₱{formatCurrency(totalAmount * longStayDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              <HomeOutlined className="mr-2" />
              Cleaning fee
            </span>
            <span>₱{formatCurrency(cleaningFee)}</span>
          </div>

          {guestServiceFeeRate > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">
                Service fee ({(guestServiceFeeRate * 100).toFixed(0)}%)
              </span>
              <span>₱{formatCurrency(totalAmount * guestServiceFeeRate)}</span>
            </div>
          )}

          {taxRate > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">
                Tax ({(taxRate * 100).toFixed(0)}%)
              </span>
              <span>₱{formatCurrency(totalAmount * taxRate)}</span>
            </div>
          )}

          <Divider className="my-3" />

          <div className="flex justify-between items-center bg-gray-100 py-3 p-4 rounded-lg">
            <span className="text-lg font-bold text-gray-800">
              Total Amount
            </span>
            <span className="text-2xl font-bold">
              ₱{formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </Card>
      {/* Reservation Information */}
      <Card title="Reservation Information" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <SafetyCertificateOutlined className="text-blue-500 mr-2" />
                <span className="font-semibold text-gray-700">
                  Confirmation Code
                </span>
              </div>
              <p className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                {reservation.confirmation_code || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Use this code for reference
              </p>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CalendarOutlined className="text-green-500 mr-2" />
                <span className="font-semibold text-gray-700">Booked On</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {reservation.created_at
                  ? formatDate(reservation.created_at)
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Reservation date</p>
            </div>
          </Col>
        </Row>
      </Card>
      {/* Status Summary */}
      <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Reservation Status
          </h3>
          <Tag
            color={colorMap[reservation.status] || "blue"}
            className="text-base px-6 py-2 font-semibold"
          >
            {statusTextMap[reservation.status] || reservation.status}
          </Tag>
        </div>
      </Card>

      {reservation.status === "COMPLETED" &&
        !reservation.property.reviewed &&
        user.user?.id !== reservation.property.user.id && (
          <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Review Property
              </h3>
              <Button
                type="primary"
                onClick={() => setCreatePropertyReviewOpen(true)}
              >
                Write a review
              </Button>
            </div>
          </Card>
        )}

      {reservation.status === "COMPLETED" && reservation.property.reviewed && (
        <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Review Property
            </h3>
            <span className="text-gray-400">Already reviewed</span>
          </div>
        </Card>
      )}

      <Modal
        title={
          <div className="text-center w-full font-medium">Write a review</div>
        }
        open={isCreatePropertyReviewOpen}
        footer={null}
        onCancel={() => setCreatePropertyReviewOpen(false)}
        width={600}
        centered
        destroyOnHidden
      >
        <CreatePropertyReviewModal
          propertyId={reservation.property.id}
          onSuccess={() => setCreatePropertyReviewOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default ReservationDetailsDrawer;
