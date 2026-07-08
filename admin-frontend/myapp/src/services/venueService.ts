import { client } from "./apollo-client";
import { GET_VENUES, ASSIGN_VENDOR, GET_USERS, CREATE_VENUE, UPDATE_VENUE, DELETE_VENUE, TOGGLE_FEATURE } from "./graphql";

export const venueService = {
    // Retrieves venues from back end
    getAllVenues: async () => {
        const { data }: any = await client.query({
            query: GET_VENUES,
        });
        return data.venues;
    },
    // Retrieves users from back end
    getAllUsers: async () => {
        const { data}: any = await client.query({
            query: GET_USERS
        });
        return data.users
    },
    // Assign a vendor to a venue with the ASSIGN_VENDOR mutation
    assignVendor: async ( venueId: string, vendorId: string ) => {
        const { data }: any = await client.mutate({
            mutation: ASSIGN_VENDOR, variables: { venueId, vendorId, },
        });
        return data.assignVendor;
    },
    // Create venue using CREATE_VENUE mutation and user inputs
    createVenue: async ( name: string, 
                        location: string, 
                        capacity: number, 
                        suitability: string, 
                        vendorId: number, 
                        price: number, 
                        description: string, 
                        imageUrl: string
                    ) => {

        const { data }: any = await client.mutate({
            mutation: CREATE_VENUE, variables: {
                name,
                location,
                capacity,
                suitability,
                vendorId,
                price,
                description,
                imageUrl,
            },
        });
    
        return data.createVenue;
    },

    // Update venue using UPDATE_VENUE mutation and user inputs
    updateVenue: async ( id: number, 
                        name: string, 
                        location: string, 
                        capacity: number, 
                        suitability: string, 
                        vendorId: number, 
                        price: number, 
                        description: string, 
                        imageUrl: string
                    ) => {
        const { data }: any = await client.mutate({
            mutation: UPDATE_VENUE, variables: {
                id,
                name,
                location,
                capacity,
                suitability,
                vendorId,
                price,
                description,
                imageUrl,
            },
        });

        return data.updateVenue;
    },

    // Delete a venue using DELETE_VENUE mutation and an ID to match venue
    deleteVenue: async (id: number) => {
        const { data }: any = await client.mutate({
            mutation: DELETE_VENUE,
            variables: { id },
        });

        return data.deleteVenue;
    },

    // Toggle a venue's availability using TOGGLE_FEATURE mutation
    toggleFeature: async(venueId: number, isFeatured: boolean) => {
        const { data }: any = await client.mutate({
            mutation: TOGGLE_FEATURE, variables: { venueId, isFeatured, },
        });
        
        return data.toggleFeature;
    }
};