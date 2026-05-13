type BookingStatus = "new" | "confirmed" | "cancelled";

type TimeInterval = {
  startsAt: Date;
  endsAt: Date;
};

type BookingRequest = {
  branchId: string;
  postId: string;
  clientName: string;
  phone: string;
  carNumber: string;
  serviceIds: string[];
  startsAt: Date;
  durationMinutes: number;
};

type Booking = BookingRequest & {
  id: string;
  status: BookingStatus;
  endsAt: Date;
};

const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60_000);

const intervalsOverlap = (a: TimeInterval, b: TimeInterval): boolean =>
  a.startsAt < b.endsAt && b.startsAt < a.endsAt;

export function createBooking(
  request: BookingRequest,
  existingBookings: Booking[],
): Booking {
  const candidate: TimeInterval = {
    startsAt: request.startsAt,
    endsAt: addMinutes(request.startsAt, request.durationMinutes),
  };

  const hasConflict = existingBookings.some((booking) => {
    if (
      booking.branchId !== request.branchId ||
      booking.postId !== request.postId ||
      booking.status === "cancelled"
    ) {
      return false;
    }

    return intervalsOverlap(candidate, {
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    });
  });

  if (hasConflict) {
    throw new Error("Selected booking slot is already occupied");
  }

  return {
    ...request,
    id: `booking-${request.branchId}-${request.postId}-${request.startsAt.getTime()}`,
    status: "new",
    endsAt: candidate.endsAt,
  };
}

export const exampleBooking = createBooking(
  {
    branchId: "branch-1",
    postId: "post-1",
    clientName: "Demo Client",
    phone: "demo-phone",
    carNumber: "DEMO-001",
    serviceIds: ["service-tire-change-r16"],
    startsAt: new Date("2026-05-14T10:00:00.000Z"),
    durationMinutes: 60,
  },
  [],
);
