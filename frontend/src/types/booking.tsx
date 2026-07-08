export type Booking = {
    Id: number;
    hirerId: number;
    venueId: number;
    occasion: string;
    bookingDate: string;
    guests: number;
    startingTime: string;
    duration: number;
    status: string;
};