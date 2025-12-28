"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo } from "react";
import { HostCalendarEvent } from "@/app/lib/definitions";

type Props = {
  reservations: HostCalendarEvent[];
  onDatesSet?: (start: string, end: string) => void;
};

export default function HostCalendar({ reservations, onDatesSet }: Props) {
  // Transform reservations to FullCalendar events
  const events = useMemo(
    () =>
      reservations.map((r) => ({
        id: r.id,
        title: r.title,
        start: r.start,
        // Add 1 day to end date to make it inclusive
        end: addOneDay(r.end),
        extendedProps: {
          status: r.status,
          property_id: r.property_id,
          guest: r.guest,
          confirmation_code: r.confirmation_code,
        },
      })),
    [reservations]
  );

  // Handle date range changes (month navigation)
  const handleDatesSet = (dateInfo: any) => {
    if (onDatesSet) {
      // Get the first day of the current view
      const startDate = new Date(dateInfo.start);
      const start = formatDate(startDate);

      // Get the last day of the current view
      // FullCalendar's end date is exclusive, so we subtract 1 day
      const endDate = new Date(dateInfo.end);
      endDate.setDate(endDate.getDate() - 1);
      const end = formatDate(endDate);

      onDatesSet(start, end);
    }
  };

  // Alternative: If you want to always fetch full months
  const handleDatesSetAlternative = (dateInfo: any) => {
    if (onDatesSet) {
      const currentDate = dateInfo.view.currentStart;
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Get the first day of the current month
      const startDate = new Date(year, month, 1);
      const start = formatDate(startDate);

      // Get the last day of the current month
      const endDate = new Date(year, month + 1, 0);
      const end = formatDate(endDate);

      onDatesSet(start, end);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        // Use datesSet to detect month changes
        datesSet={handleDatesSetAlternative} // Use this one for full months
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;

          switch (status) {
            case "APPROVED":
              return ["bg-green-500", "border-green-600", "text-white"];
            case "COMPLETED":
              return ["bg-blue-500", "border-blue-600", "text-white"];
            case "PENDING":
              return ["bg-yellow-500", "border-yellow-600", "text-black"];
            case "CANCELLED":
              return ["bg-red-500", "border-red-600", "text-white"];
            default:
              return ["bg-gray-400", "border-gray-500", "text-white"];
          }
        }}
        eventClick={(info) => {
          console.log("Reservation clicked:", {
            id: info.event.id,
            guest: info.event.extendedProps.guest,
            confirmation_code: info.event.extendedProps.confirmation_code,
          });
        }}
        // Optional: Tooltip showing actual dates
        eventContent={(arg) => {
          return {
            html: `
              <div class="fc-event-title">
                ${arg.event.title}
                <div class="text-xs">${formatDateForDisplay(
                  arg.event.start
                )} - ${formatDateForDisplay(
              new Date(
                new Date(arg.event.startStr).getTime() +
                  (arg.event.end
                    ? new Date(arg.event.endStr).getTime() -
                      new Date(arg.event.startStr).getTime() -
                      86400000
                    : 0)
              )
            )}</div>
              </div>
            `,
          };
        }}
      />
    </div>
  );
}

// Helper function to add 1 day to a date string
function addOneDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Optional: Helper for displaying dates in event tooltip
function formatDateForDisplay(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
