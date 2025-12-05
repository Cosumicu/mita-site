"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {} from "@/app/lib/features/properties/propertySlice";
import Link from "next/link";

const HostDashboard = () => {
  return (
    <div className="m-4">
      <div className="flex justify-between gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Total Monies</p>
          <p>Admin</p>
          <p>Admin</p>
          <p>Admin</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Upcoming Reservations</p>
          <p>Admin</p>
          <p>Admin</p>
          <p>Admin</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Pending Requests</p>
          <p>Admin</p>
          <p>Admin</p>
          <p>Admin</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Ave. Nightly Rate</p>
          <p>Admin</p>
          <p>Admin</p>
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
