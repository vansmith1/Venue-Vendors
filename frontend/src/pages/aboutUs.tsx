// About us page
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { Text,  
        Box,
       } from "@chakra-ui/react";

export default function aboutUs(){
    const router = useRouter();

    return(
        <>
            <Box bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar />
                    <Box p={50}>
                        <Box p={10} bg="white">
                            <Text fontSize="5xl" fontWeight="semibold" color="#2D2A26" textTransform="uppercase" textAlign={"center"}>
                                About Venue Vendors
                            </Text>
                            <Text fontSize="xl" maxW="900px" mx="auto" fontWeight="thin" color="gray.600" pt={1} textAlign={"center"}>
                                We connect people with the perfect venues for their most important moments. 
                                Whether it's a wedding, corporate event, or private celebration, our platform 
                                simplifies the process of discovering, comparing, and booking venues.
                                We aim to provide a seamless and reliable experience for both hirers and vendors, 
                                ensuring every event is executed with confidence.
                            </Text>
                            <Text fontSize="4xl" pt="10" fontWeight="semibold" color="gray.800" textTransform="uppercase" pb={6} textAlign={"center"}>
                                Why Choose Us
                            </Text>
                            <Text fontSize="xl" fontWeight="thin" color="gray.800" textAlign={"center"}>
                                •	Fast booking process
                                •	Compare venues easily
                                •	Manage applications in one place
                            </Text>
                        </Box>
                    </Box>
                </Box>
            <Footer/>
        </>
    );
}