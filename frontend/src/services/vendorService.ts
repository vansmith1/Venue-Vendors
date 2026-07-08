import axios from "axios";
import { image } from "framer-motion/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const vendorService = {
    getVenues: async () => {
        const { data } = await axios.get(
            `${API_BASE_URL}/hirers`
        );
        return data;
    },

    blockVenue: async (venueId: number, blockedStartDate: string, blockedStartTime: string, blockedEndDate: string, blockedEndTime: string, reason: string) => {
        const { data } = await axios.put(
            `${API_BASE_URL}/venue/${venueId}/block`, 
            {
                blockedStartDate, 
                blockedStartTime,
                blockedEndDate,
                blockedEndTime,
                reason
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

    unblockVenue: async (venueId: number) => {
        const { data } = await axios.put(
            `${API_BASE_URL}/venue/${venueId}/unblock`
        );
        return data;
    },    

    updateBookingStatus: async (bookingId: number, status: string) => {
        const { data } = await axios.put(
            `${API_BASE_URL}/apply/${bookingId}/status`,
            { status }
        );
        return data;
    },

    createReview : async (bookingId: number, vendorId: number, hirerId: number, rating: number, comment: string) => {
        const { data } = await axios.post(
            `${API_BASE_URL}/reviews`,
            {
                bookingId,
                vendorId,
                hirerId,
                rating,
                comment,
            }
        );
        return data;    
    },

    getReviews: async () => {
        const { data } = await axios.get(
            `${API_BASE_URL}/reviews`
        );
        return data;
    },

    createVenue : async (name: string, location: string, capacity: number, suitability: string, vendorId: number, price: number, description: string, imageUrl: string, isActive: boolean, isFeatured: boolean) => {
        const { data } = await axios.post(
            `${API_BASE_URL}/create`,
            {
                name,
                location,
                capacity,
                suitability,
                vendorId,
                price, 
                description, 
                imageUrl,
                isActive,
                isFeatured
            }
        );
        return data;    
    },

    Uint8ClampedArrayateVenue : async (venueId: number, name: string, location: string, capacity: number, suitability: string, price: number, description: string, imageUrl: string) => {
        const { data } = await axios.put(
            `${API_BASE_URL}/venue/${venueId}`,
            {
                name,
                location,
                capacity,
                suitability,
                price, 
                description, 
                imageUrl,
            }
        );
        return data;    
    },

    getHirerTallies: async (vendorId: number) => {
        const { data } = await axios.get(
            `${API_BASE_URL}/vendor/${vendorId}/analytics/hirer-tallies`);
        return data;
    },

    getCombinedHirerTallies: async (vendorId: number) => {
        const { data } = await axios.get(
            `${API_BASE_URL}/vendor/${vendorId}/analytics/combined-hirer-tallies`);
        return data;
    },

    getHirerActivity: async (vendorId: number) => {
        const { data } = await axios.get(
            `${API_BASE_URL}/vendor/${vendorId}/analytics/hirer-activity`);
        return data;
    },

    getVenueUtilization: async (vendorId: number, range: string = "allTime") => {
        const { data } = await axios.get(
                    `${API_BASE_URL}/vendor/${vendorId}/analytics/venue-utilization?range=${range}`);
        return data;
    },

    updateVenue : async (venueId: number, name: string, location: string, capacity: number, suitability: string, price: number, description: string, imageUrl: string) => {
    const { data } = await axios.put(
            `${API_BASE_URL}/venue/${venueId}`,
            {
                name,
                location,
                capacity,
                suitability,
                price, 
                description, 
                imageUrl
            }
        );
        return data;    
    },

    deleteVenue: async (venueId: number) => {
        const { data } = await axios.delete(
            `${API_BASE_URL}/venue/${venueId}`
        );
        return data;
    },
}