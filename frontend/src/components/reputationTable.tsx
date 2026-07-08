// Table for hirers to see their hiring history 
import { Text, 
        Box, 
        Tbody,
        Table, 
        Thead, 
        Tr, 
        Th, 
        Td, 
        TableContainer} from "@chakra-ui/react";
import { userService } from "@/services/userService";
import { hirerService } from "@/services/hirerService";
import { useEffect, useState } from "react";
import { Booking } from "@/types/booking";
import { Review } from "@/types/review";
import { Venue } from "@/types/venues";
import { vendorService } from "@/services/vendorService";

export default function ReputationTable(){;    
    // This allows the user to see their bookings, and page updates depending on which user is logged in
    const [myHistory, setMyHistory] = useState<Booking[]>([]);
    const [user, setUser] = useState<any>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // get user from localstorage email
    useEffect(() => {
        const getUser = async () => {
            const email = localStorage.getItem("email");

            try {
                const user = await userService.getUser(email!);
                setUser(user);
            }
            catch (error) {
                return;
            }
        };
        getUser();
    }, []);

    // filters through and finds users applications
    useEffect(() => {
        if (!user) return;
        
        const myHistory = async () => {
            const bookings = await hirerService.getBooking();

            const myBookings = bookings.filter(
                (booking: Booking) => (Number(booking.hirerId) === Number(user.id)) && ((booking.status === "Approved") || (booking.status === "Confirmed"))
            );

            setMyHistory(myBookings);
        };
        myHistory();
    }, [user]);

    // get the venues
    useEffect(() => {
        const loadVenues = async () => {
            const venues = await hirerService.getVenues();
            setVenues(venues);
        };
        loadVenues();
    }, []);

    useEffect(() => {
        const loadReviews = async () => {
            const reviews = await vendorService.getReviews();
            setReviews(reviews);
        };
        loadReviews();
    }, []);

    const hirerRating = (bookingId: number) => {
        const review = reviews.find(
            review => review.bookingId === bookingId
        );
        return review?.rating;
    };

return(
    <>
        {/* Table for past bookings and reputation ratings */}
        <Box bgColor="white">
            <Text fontSize="2xl" pt="5" fontWeight="bold" textAlign="left" pl="5"color="gray.800" mb={5}>
                Previously Hired Venues:
            </Text>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Number</Th>
                            <Th>Venue Name</Th>
                            <Th>Venue Location</Th>
                            <Th>Event Name</Th>
                            <Th>Date of Hire</Th>
                            <Th>Rating</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {myHistory.map((booking, index) => (
                            <>
                                <Tr key={index} bg="white">
                                    <Td>{index + 1}</Td>
                                    <Td>{venues.find(v => v.Id === booking.venueId)?.name}</Td>
                                    <Td>{venues.find(v => v.Id === booking.venueId)?.location}</Td>
                                    <Td>{booking.occasion}</Td>
                                    <Td>{booking.bookingDate}</Td>
                                    <Td>{hirerRating(booking.Id) ? `${hirerRating(booking.Id)}/5` : "Pending"}</Td>
                                </Tr>
                            </>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    </>
);
}