// Appliaction page
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Divider,
        Input,
        InputGroup,
        Button,
        Flex,
        Box,
        Heading,
        FormControl,
        FormLabel,
        Select,
        useToast,
        } from "@chakra-ui/react";
import { hirerService } from "@/services/hirerService";
import { userService } from "@/services/userService";
import { Venue } from "@/types/venues";

export default function Application() {
    const router = useRouter();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [venue, setVenue] = useState("");
    const [occasion, setEventName] = useState("");
    const [guests, setNumberGuests] = useState("");
    const [bookingDate, setDate] = useState("");
    const [startingTime, setEventTime] = useState("");
    const [duration, setEventDuration] = useState("");
    const selectedVenue = venues.find((v) => v.name === venue);
    const { venueId } = router.query;
    const toast = useToast();
    const [user, setUser] = useState<any>(null);

    // If the user is logged in, proceed. If not, redirect to login page, and set current user
    useEffect(() => {
        const checkRole = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                router.push("/login");
                return;
            }
            try {
                const user = await userService.getUser(email);
                if (user.role !== "Hirer") {
                    router.push("/login");
                }
                else {
                    setUser(user);
                }
            }
            catch {
                router.push("/login");
            }
        };
        checkRole();
    }, []);
    
    // pulls venues from database
    useEffect(() => {
        const loadVenues = async () => {
            const venues = await hirerService.getVenues();

            setVenues(venues);
        };
        loadVenues();
    }, []);

    // sets the venue to the same one they selected from dashboard for venue dropdown
    useEffect(() => {
        if (!venueId || venues.length === 0) {
            return;
        }
        const selectedVenue = venues.find(
            (v) => v.Id === Number(venueId)
        );
        if (selectedVenue) {
            setVenue(selectedVenue.name);
        }
    }, [venueId, venues]);

    const submitApplication = async () => {        
        if (!user || !user.name || !user.phoneNumber) {
            toast({
                title: "Complete your profile first",
                description: "Please add your name and phone number before applying.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            router.push("/profile");
            return;
        }
        // If any of the application fields are empty, alert the user to fill in all fields. 
        if (!venue || !occasion || !guests || !bookingDate || !startingTime || !duration) {
            toast({
                title: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        } 
        // selected date cannot be in the past
        const selectedDate = new Date(bookingDate);
        selectedDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            toast({
                title: "Booking date cannot be in the past",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        } 
        // selected time cannot be in the past
        const selectedDateTime = new Date(`${bookingDate}T${startingTime}`);
        const now = new Date();
        if (selectedDateTime < now) {
            toast({
                title: "Booking time cannot be in the past",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // if the inputted number of guests is higher than venue capacity. 
        else if (selectedVenue && Number(guests) > selectedVenue.capacity) {
            toast({
                title: `This venue allows a maximum of ${selectedVenue.capacity} guests`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        // If event name contains only numbers, alert the user to enter a valid event name.
        } else if (!isNaN(Number(occasion))) {
            toast({
                title: "Event name cannot contain only numbers",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        // If number of guests is not a valid number or less than 0, alert the user to enter a valid number.
        } else if (isNaN(Number(guests)) || Number(guests) <= 0) {
            toast({
                title: "Please enter a valid number of guests",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        // If event duration is not a valid number, alert the user to enter a valid event duration.
        } else if (isNaN(Number(duration))) {
            toast({
                title: "Please enter a valid event duration",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            // gets the user using the email in localStorage
            const email = localStorage.getItem("email");
            const user = await userService.getUser(email!);

            try {
                // submits application values to hirer service
                await hirerService.createBooking(
                    user.id,
                    selectedVenue!.Id,
                    occasion,
                    Number(guests),
                    bookingDate,
                    startingTime,
                    Number(duration),
                );

                toast({
                    title: "Application submitted",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push("/hirers");
            }
            catch (error: any) {
                toast({
                    title: error.response?.data?.message || "Failed to submit booking",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <>
            <Box minH="100vh" bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar />
                    <Flex align="flex-start" justify={"space-between"} px={12} py={10} gap={10}>
                        <Box w="50%" minH="450px" mt={6} mb={6} p={10} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                            <Heading mb={6} size="lg" textAlign="center">
                                    Venue Application
                            </Heading> 
                            <Box textAlign="left">
                                {/* Dropdown to select venue */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Select value={venue} onChange={(e) => setVenue(e.target.value)}>
                                            <option value='' disabled>Select a venue</option>
                                            {venues.map((venue) => (
                                                <option key={venue.Id} value ={venue.name}>
                                                    {venue.name}    
                                                </option>
                                            ))}
                                        </Select>
                                    </InputGroup>
                                </FormControl>
                                {/* Event name field */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Name of Event
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">   
                                        <Input
                                            type="text"
                                            value={occasion}
                                            onChange={(e) => setEventName(e.target.value)}
                                            placeholder='Enter event name'
                                        />
                                    </InputGroup>
                                </FormControl>
                                {/* Number of guests field */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Number of Guests
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">   
                                        <Input
                                            type="number"
                                            value={guests}
                                            onChange={(e) => setNumberGuests(e.target.value)}
                                            placeholder='Enter number of guests'
                                        />
                                    </InputGroup>
                                </FormControl>
                                {/* Date field */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Date
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setDate(e.target.value)}
                                            />
                                    </InputGroup>
                                </FormControl>
                                {/* Time field */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Time
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input
                                            type="time"
                                            value={startingTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                                {/* Duration field */}
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Duration (hours)
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setEventDuration(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <Button bg="#7A5C43" colorScheme="blackAlpha" mt={7} width={293} onClick={submitApplication}>
                                    Submit Application
                                </Button>
                            </Box>
                        </Box>
                        <Divider maxW="600px" mx="auto" />
                    </Flex>
                </Box>
            <Footer/>
        </>
    );
}