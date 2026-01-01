"use client";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const bookingsData = [
  { date: "Jan", count: 12 },
  { date: "Feb", count: 18 },
  { date: "Mar", count: 9 },
  { date: "Apr", count: 22 },
];

const revenueData = [
  { date: "Jan", revenue: 45000 },
  { date: "Feb", revenue: 62000 },
  { date: "Mar", revenue: 38000 },
  { date: "Apr", revenue: 71000 },
];

const DashboardPage = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="m-4">
      <div className="m-4 space-y-6">
        {/* Stats cards */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {" "}
            <h3 className="text-lg font-semibold mb-1">Bookings Over Time</h3>
            <p className="text-sm text-gray-500 mb-3">Confirmed reservations</p>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    fill="#c7d2fe"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            {" "}
            <h3 className="text-lg font-semibold mb-1">Revenue Over Time</h3>
            <p className="text-sm text-gray-500 mb-3">PHP (₱)</p>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `₱${Number(value).toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    fill="#c7d2fe"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
