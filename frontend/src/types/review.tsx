export type Review = {
    Id: number;
    bookingId: number | null;
    vendorId: number | null;
    hirerId: number | null;
    rating: number | null;
    comment: string | null;
    publishedDate: string | null;
};