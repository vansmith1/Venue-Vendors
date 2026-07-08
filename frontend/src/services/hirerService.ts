import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const hirerService = {
    getVenues: async () => {
        const { data } = await axios.get(
            `${API_BASE_URL}/hirers`
        );
        return data;
    },

    createBooking: async (
        hirerId: number,
        venueId: number,
        occasion: string,
        guests: number,
        bookingDate: string,
        startingTime: string,
        duration: number,
    ) => {
        // sends saved application parameters to backend router
        const { data } = await axios.post(
            `${API_BASE_URL}/apply`,
            {
                hirerId, venueId, occasion, guests, bookingDate, startingTime, duration, status: "Pending"
            }
        );
        return data;
    },
    
    getBooking: async () => {
        const { data } = await axios.get(
            `${API_BASE_URL}/apply`
        );
        return data;
    },
}