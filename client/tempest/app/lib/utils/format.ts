export const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeString: string): string {
  if (!timeString) return "";

  const [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  if (minute === 0) {
    return `${hour}${ampm}`;
  } else {
    return `${hour}:${minute.toString().padStart(2, "0")}${ampm}`;
  }
}

export function formatTimeV2(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12 for 12 AM/PM

  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatPesoShort(value: number) {
  const abs = Math.abs(value);

  if (abs >= 1_000_000) {
    return `₱${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (abs >= 1_000) {
    return `₱${(value / 1_000).toFixed(0)}K`;
  }

  return `₱${value.toLocaleString()}`;
}
