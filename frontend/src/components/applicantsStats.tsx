import { Box, Text, Link, useToast, HStack, VStack, SimpleGrid, Button, usePrefersReducedMotion} from "@chakra-ui/react";
import { Card, CardBody, Image , Badge} from '@chakra-ui/react'
import { useState, useEffect } from "react"; 
import { userService } from "@/services/userService";
import { vendorService } from "@/services/vendorService";
import { Venue } from "@/types/venues";
import { Booking } from "@/types/booking";
import { useRouter } from "next/router";

export default function applicantStats() {
    const [hirerStats, setHirerStats] = useState<any[]>([]);
    const router = useRouter();
    const pushAnalitics = () => {
        router.push("vendorAnalytics");
    }

    useEffect(() => {
        const loadStats = async () => {
            const users = await userService.getUsers();
            const bookings = await vendorService.getBooking();
            const email = localStorage.getItem("email");
            const vendor = await userService.getUser(email!);
            const venues = await vendorService.getVenues();
            const vendorVenues = venues.filter(
                (venue: Venue) => venue.vendorId === vendor.id
            );

            const vendorVenueIds = vendorVenues.map(
                (venue: Venue) => venue.Id
            );

            const vendorBookings = bookings.filter(
                (booking: Booking) => vendorVenueIds.includes(booking.venueId)
            );

            const hirers = users.filter(
                (user: any)=> user.role === "Hirer" &&
                vendorBookings.some(
                    (booking: Booking) => booking.hirerId === user.id
                )
            );

            const stats = hirers.map((hirer: any) => {
                const bookingCount = vendorBookings.filter(
                    (booking: Booking) => booking.hirerId === hirer.id &&
                    (booking.status === "Approved" ||
                    booking.status === "Confirmed")
                ).length;

                return {
                    ...hirer,
                    bookingCount
                };
            });

            stats.sort(
                (a: any, b: any) => b.bookingCount - a.bookingCount
            );

            setHirerStats(stats);
        };
        loadStats();
    }, []);

    let mostChosen = null;
    let leastChosen = null;
    let notChosen: any[] = [];

    if (hirerStats.length > 0) {
        mostChosen = hirerStats[0];
        leastChosen =  hirerStats.filter(hirer => hirer.bookingCount > 0).sort((a, b) => a.bookingCount - b.bookingCount)[0];
        notChosen = hirerStats.filter(hirer => hirer.bookingCount === 0);
    }  

    return(
        <>
            <Box bg={"#ffffff"} borderRadius={"xl"}  boxShadow="sm" p={3} pb={9}>
                <Text fontSize="2xl" fontWeight="semibold" color="gray.800" mb={2}>
                    Applicant Insights
                </Text>
                    <VStack>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                            {leastChosen && (
                            <Card borderRadius="xl" overflow="hidden">
                                <Image h="180px" w="100%" objectFit="cover" src={leastChosen.profileImageURL || "/images/default.jpg"}/>            
                                <CardBody bg="white">
                                    <VStack spacing={2}>
                                        <Text fontSize="xl" fontWeight="bold">
                                            Least Chosen Applicant
                                        </Text>
                                        <Text fontSize="lg" fontWeight="semibold">
                                            {leastChosen.name}
                                        </Text>
                                        <Badge colorScheme="green" fontSize="sm">
                                            Chosen {leastChosen.bookingCount} times
                                        </Badge>
                                        <Text fontWeight="semibold">
                                            Hirer Score: {leastChosen.hirerScore}⭐
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        )}
                        {mostChosen && (
                            <Card borderRadius="xl" overflow="hidden">
                                <Image h="180px" w="100%" objectFit="cover" src={mostChosen.profileImageURL || "/images/default.jpg"}/>
                                <CardBody bg="white">
                                    <VStack spacing={2}>
                                        <Text fontSize="xl" fontWeight="bold">
                                            Most Chosen Applicant
                                        </Text>
                                        <Text fontSize="lg" fontWeight="semibold">
                                            {mostChosen.name}
                                        </Text>
                                        <Badge colorScheme="green" fontSize="sm">
                                            Chosen {mostChosen.bookingCount} times
                                        </Badge>
                                         <Text fontWeight="semibold">
                                            Hirer Score: {mostChosen.hirerScore}⭐
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                            )}
                            <Card borderRadius="xl" overflow="hidden">
                                <CardBody bg="white">
                                    <VStack align="start" spacing={3}>
                                        <Text fontSize="xl" fontWeight="bold">
                                            Applicants Not Chosen
                                        </Text>
                                        <Badge colorScheme="gray" fontSize="sm">
                                            {notChosen.length} applicant(s)
                                        </Badge>
                                        {notChosen.length > 0 ? (
                                            notChosen.map((hirer) => (
                                                <Text key={hirer.id}>
                                                    • {hirer.name}
                                                </Text>
                                            ))
                                        ):(
                                            <Text color="gray.500">
                                                All Applicants Have Been Previously Chosen
                                            </Text>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        </SimpleGrid>  
                    <Button bg="#7A5C43" colorScheme="blackAlpha" width="300px" mt={"10"} w={"500px"} onClick={pushAnalitics}>
                        View Full Analytics
                    </Button>
                </VStack>
            </Box>
        </>
    );
}