// Vendors page; pulls components from /components and displays in user-friendly UI
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Text, Divider, Box, useToast } from "@chakra-ui/react";
import ApplicantsList from "@/components/applicantsList";
import SelectedApplicantPanel from "@/components/selectedApplicantPanel";
import ApplicantStats from "@/components/applicantsStats";
import { vendorService } from "@/services/vendorService";
import { Venue } from "@/types/venues";
import { userService } from "@/services/userService";
import YourVenues from "@/components/yourVenues"
import { Booking } from "@/types/booking";

export default function Vendors(){
    const router = useRouter();
    const toast = useToast();
    const [currentVendor, setCurrentVendor] = useState<number>(0);
    const [allVenues, setVenues] = useState<Venue[]>([]);
    const [allBookings, setAllBookings] = useState<Booking[]>([]);

    // If the user is logged in, proceed. If not, redirect to login page, and set current vendor
    useEffect(() => {
        const checkRole = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                router.push("/login");
                return;
            }
            try {
                const user = await userService.getUser(email);
                if (user.role !== "Vendor") {
                    router.push("/login");
                }
                else {
                    setCurrentVendor(user.id);
                }
            }
            catch {
                router.push("/login");
            }
        };
        checkRole();
    }, []);
        
    // load venues from database
    useEffect(() => {
        const loadVenues = async () => {
            const venues: Venue[] = await vendorService.getVenues();
        
            setVenues(venues);
        };
        loadVenues();
    }, []);

    // filter through the venues to get the vendor's venues
    const myVenues = allVenues.filter(
        venue => Number(venue.vendorId) === Number(currentVendor)
    );

    // Pull applications from database
    useEffect(() => {
        const loadBookings = async () => {
            const bookings = await vendorService.getBooking();

            setAllBookings(bookings);
        };
        loadBookings();
    }, []);

    // filter through the applications to get the vendor's venue applications
    const myVenuesBookings = allBookings.filter(
        bookings => myVenues.some(venue => venue.Id === bookings.venueId)
    );

    // Function to Select Applicant
    const [selectedApplicant, setSelectedApplicant] = useState<Booking | null>(null);

    // Function to accept an applicant, given application id and status id
    const updateApplicationStatus = async (applicationId: number, newStatus: string) => { await vendorService.updateBookingStatus(applicationId, newStatus);
        // change all applications
        setAllBookings((prev) => {
            // update the application
            return prev.map((app) => {
                // goes through and finds application
                if (app.Id === applicationId) {
                    return { ...app, status: newStatus };
                } else {
                    return app;
                }
            })
        });
        // if we find applicant and it matches the application, update the status of the applicant
        if (selectedApplicant && selectedApplicant.Id === applicationId) {
            setSelectedApplicant({...selectedApplicant, status: newStatus,});
        }
    };

    // Function to Block a Venue
    const blockVenue = async (venueId: number, startDate: string, startTime: string, endDate: string, endTime: string, reason: string) => { 
        try {
            await vendorService.blockVenue(venueId, startDate, startTime, endDate, endTime, reason);

            setVenues((prev) =>
                prev.map((venue) => {
                    if (venue.Id === venueId) {
                        return {
                            ...venue,
                            isActive: false
                        };
                    }

                    return venue;
                })
            );

            toast({
                title: "Venue Blocked",
                status: "success",
                duration: 2000,
                isClosable: true,
            });     
        }

        catch (error) {
            toast({
                title: "Failed to block venue",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Function to Unblock a Venue
    const unblockVenue = async (venueId: number) => {
        try {
            await vendorService.unblockVenue(venueId);

            setVenues((prev) =>
                prev.map((venue) => {
                    if (venue.Id === venueId) {
                    
                        return {
                            ...venue,
                            isActive: true
                        };
                    }

                    return venue;
                })
            );

            toast({
                title: "Venue Unblocked",
                status: "success",
                duration: 2000,
                isClosable: true,
            });     
        }

        catch (error) {
            toast({
                title: "Failed to unblock venue",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return( 
    <>
    <Navbar />
        <Box minH="100vh" bg="#F5EFE6">
            <Divider/>
            <Box bg="#f5efe6">
                <Text color="#000000" fontSize="5xl" textAlign="left" pl={5} pt={3}>
                    Vendor Dashboard
                </Text>
                <Text fontSize="2xl" fontWeight="thin" color="gray.800" pl="5">
                    Review applicants, assess credibility, and confirm suitable venue bookings.
                </Text>
            </Box>
            <Box px={4} mx="auto">
            {/* Work In progress, Applicant Stats */}
            <ApplicantStats/>
            {/* List And Selecting Button Toggle */}
                <Box pt={7}>
                    <ApplicantsList applications={myVenuesBookings} 
                        onSelectApplicant={(app) =>{
                            if (selectedApplicant?.Id == app.Id && selectedApplicant?.occasion == app.occasion) {
                                setSelectedApplicant(null);
                            }
                            else {
                                setSelectedApplicant(app);
                            }
                        }}   
                        selectedApplicant={selectedApplicant}/>
                    <Box pt="15px">
                        <SelectedApplicantPanel applicant={selectedApplicant} onUpdateStatus={updateApplicationStatus}/>
                    </Box>
                </Box>
                <YourVenues venues={myVenues} onBlockVenue={blockVenue} onUnblockVenue={unblockVenue}/>
            </Box>    
        </Box>
    <Footer/>
    </>
);
}
