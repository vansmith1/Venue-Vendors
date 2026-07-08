// Component for vendors to see the list of applications
import { Box, 
        Text,
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        TableContainer,
        Button
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Booking } from "@/types/booking";
import { vendorService } from "@/services/vendorService";
import ApplicantsFilters from "@/components/applicantsFilters"
import { userService } from "@/services/userService";

type ApplicantsListSelect = {
    applications: Booking[];
    onSelectApplicant: (app: Booking) => void;
    selectedApplicant: Booking | null;
}

export default function ApplicantsList({ applications, onSelectApplicant, selectedApplicant}: ApplicantsListSelect){
    // Functions for First Section
    const [search, setSearch] = useState("");
    const [suitability, setSuitability] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);

    const handleReset = () => {
        setSearch("");
        setSuitability("");
        setSortBy("");
    };

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            const reviews = await vendorService.getReviews();
            setReviews(reviews);
        };
        loadReviews();
    }, []);

    // Calculate average rating
    const updateAverageRating = (hirerId: number) => {
        const hirerReviews = reviews.filter(
            review => review.hirerId === hirerId
        );

        if (hirerReviews.length === 0) {
            return 0;
        }

        let i;
        let sum = 0;

        for (i = 0; i < hirerReviews.length; ++i) {
            sum = sum + hirerReviews[i].rating;
        }

        return sum / hirerReviews.length;
    };

    // Get users
    useEffect(() => {
        const pullUsers = async () => {
            const users = await userService.getUsers();
            setUsers(users);
        };

        pullUsers();
    }, [])

    // Get venues
    useEffect(() => {
        const pullVenues = async () => {
            const venues = await vendorService.getVenues();
            setVenues(venues);
        };
        pullVenues();
    }, []);

    const filteredApplications: Booking[] = applications

    // For the Search Bar
    .filter((bookings) => {
        const hirer = users.find(
            user => user.id === bookings.hirerId
        );
        const venue = venues.find(
            venue => venue.Id === bookings.venueId
        );
        return(
            // hirer name gonna have to pull from hirer entity
            (hirer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (bookings.occasion || "").toLowerCase().includes(search.toLowerCase()) ||
            // venue name gonna have to pull from venue entity
            (venue.name || "").toLowerCase().includes(search.toLowerCase())
        );
    })
        
    // For the Suitability Dropdown
    .filter((bookings) => {
        const venue = venues.find(
            venue => venue.Id === bookings.venueId
        );
        if (!suitability) return true;
        // will need to change to match suitability on venue not booking
        return (venue.suitability || "").toLowerCase() === suitability.toLowerCase();
    })
            
    // For the Sorting
    .sort((booking1, booking2) => {
        const hirer = users.find(
            user => user.id === booking1.hirerId
        );
        const hirer2 = users.find(
            user => user.id === booking2.hirerId
        );
        if (sortBy === "Date") {
            return new Date(booking1.bookingDate).getTime() - new Date(booking2.bookingDate).getTime();
        }
        if(sortBy == "Reputation (High → Low)"){
            return updateAverageRating(hirer2.id) - updateAverageRating(hirer.id);
        }
        if(sortBy == "Reputation (Low → High)"){
            return updateAverageRating(hirer.id) - updateAverageRating(hirer2.id);
        }
        return 0;
    });
          
    return(
        <Box shadow="sm">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
                Applicants List
            </Text>
            <ApplicantsFilters  
                search={search}
                suitability={suitability}
                sortBy={sortBy}
                onSearchChange={setSearch}
                onSuitabilityChange={setSuitability}
                onSortByChange={setSortBy}
                onReset={handleReset}
            />
            <TableContainer>
                <Table bg="white" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Hirer Name</Th>
                            <Th>Event</Th>
                            <Th>Venue</Th>
                            <Th>Date</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                            <Th>Hirer Rating</Th>
                        </Tr>
                    </Thead>
                    <Tbody>   
                        {filteredApplications?.map((app, index) => {
                            const hirer = users.find(
                                user => user.id === app.hirerId
                            );
                            const venue = venues.find(
                                venue => venue.Id === app.venueId
                            );
                            return (
                                <Tr key={index}>
                                    <Td>{hirer?.name}</Td>
                                    <Td>{app.occasion}</Td>
                                    <Td>{venue?.name}</Td>
                                    <Td>{app.bookingDate}</Td>
                            <Td color={
                                app.status === "Approved" ? "green" :
                                app.status === "Declined" ? "red" :
                                app.status === "Confirmed" ? "Blue" : "orange"
                                }>
                                {app.status}
                            </Td>
                            <Td>
                                {/*Button Colour Toggle */}
                                <Button width="150px" 
                                    colorScheme={
                                        selectedApplicant?.Id === app.Id
                                        ? "red"
                                        : "blue"
                                    }
                                    onClick={() => onSelectApplicant(app)}>
                                    {/*Button Text Toggle */}
                                    { 
                                        selectedApplicant?.Id === app.Id
                                        ? "Deselect"
                                        : "Select"
                                    }
                                </Button>
                            </Td>
                            <Td>
                                {updateAverageRating(hirer?.id)}
                            </Td>
                        </Tr>
                        );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}