"use client";

import { useCallback, useEffect, useState } from "react";
import HostCalendar from "@/app/components/dashboard/HostCalendar";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getHostCalendarData } from "@/app/lib/features/analytics/analyticsSlice";

const HostDashboard = () => {
  const dispatch = useAppDispatch();
  const { data: hostCalendarData } = useAppSelector(
    (state) => state.analytics.hostCalendarData
  );
  const [currentRange, setCurrentRange] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });

  // Function to handle date range changes from calendar
  const handleDatesSet = useCallback(
    (start: string, end: string) => {
      setCurrentRange({ start, end });
      dispatch(getHostCalendarData({ start, end }));
    },
    [dispatch]
  );

  // Initial load - get current month
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    setCurrentRange({
      start: formatDate(start),
      end: formatDate(end),
    });

    dispatch(
      getHostCalendarData({
        start: formatDate(start),
        end: formatDate(end),
      })
    );
  }, [dispatch]);

  return (
    <div className="m-4 space-y-6">
      <HostCalendar
        reservations={hostCalendarData}
        onDatesSet={handleDatesSet}
      />
      {/* Optional: Display current range being shown */}
      {/* <div className="text-sm text-gray-500">
        Showing: {currentRange.start} to {currentRange.end}
      </div> */}
    </div>
  );
};

export default HostDashboard;
