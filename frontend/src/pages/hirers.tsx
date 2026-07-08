// Hirers page; pulls components from /components and displays in user-friendly UI
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { Text, Divider, Box } from "@chakra-ui/react";
import PopularVenues from "../components/availableVenues";
import ApplicationHistory from "../components/applicationHistory";
import ReputationTable from "../components/reputationTable";
import { useEffect } from "react";
import { userService } from "@/services/userService";

export default function Hirers(){
    const router = useRouter();
        
    // Check to see if user is logged in, sees role. if they arent hirer, reload
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
            }
            catch {
                router.push("/login");
            }
        };
        checkRole();
    }, []);

    return(
        <>
        <Navbar />
        <Box minH="100vh" bg="#F5EFE6">
        <Divider/>
                <Text color="#000000" fontSize="5xl" textAlign="left" pl={5} pt={3}>
                    Hirer Dashboard
                </Text>
                <Text fontSize="2xl" fontWeight="thin" color="gray.800" pl="5">
                    Venues Available for Hire:
                </Text>
                <Box textAlign="center" pt={5} px={4}>
                    <PopularVenues />
                    <ReputationTable/>
                    <ApplicationHistory />
                </Box>
                <Divider maxW="600px" mx="auto" />
            </Box>
        <Footer/>
    </>
);
}