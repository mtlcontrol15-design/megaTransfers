import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getBookingDateTime = (
  journey,
  timeZone = "Europe/London"
) => {
  if (!journey?.date) {
    return null;
  }

  const date = String(journey.date).slice(0, 10);
  const hour = String(journey.hour ?? 0).padStart(2, "0");
  const minute = String(journey.minute ?? 0).padStart(2, "0");
  const bookingDateTime = dayjs.tz(
    `${date} ${hour}:${minute}`,
    "YYYY-MM-DD HH:mm",
    timeZone
  );

  return bookingDateTime.isValid() ? bookingDateTime : null;
};
