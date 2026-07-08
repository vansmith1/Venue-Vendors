// Home page
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { Text, 
        VStack,
        Divider,
        HStack,
        Box,
        Image,
        Img,
        Button,
       } from "@chakra-ui/react";
import Link from "next/link";

export default function Home(){
    const router = useRouter();

    return(
        <>
            <Box minH="100vh" bg="#F5EFE6">
                <Navbar/>
                <Box w="100%" marginTop={"-100"} bgImage={"url('/images/outdoorWedding.jpg')"} bgSize="cover" bgPosition="center" h={400} aspectRatio={1}>
                    <Text color="#F7EBD2" fontSize="8xl" fontWeight="bold" mt={100} textAlign="left" paddingTop={100} paddingLeft={7} textShadow={"2px 2px 6px rgba(0,0,0,0.8)"}>
                            Venue Vendors
                    </Text>
                    <Text color="#ffffff" fontSize="4xl" fontWeight="thin" paddingLeft={7}  textShadow={"2px 2px 6px rgba(0,0,0,0.8)"}>
                            The right venue for you
                    </Text>
                </Box>
                <Divider/>
                    <Box bg="white" pt={10} px={16}>
                        <Box>
                            <Text fontSize="5xl" fontWeight="bold" color="#2D2A26" mb={6}>
                                Need to hire a venue?
                            </Text>
                            <Text fontSize="xl" color="gray.600" mb={8}>
                                Find and secure the perfect space for your event.
                                Browse venues, compare options, and submit your
                                application — all in one place.
                            </Text>
                        </Box>
                            <Box w="100%" pb="10" bg="white" >
                                <HStack spacing={0}>
                                    <Box w="50%">
                                        <Link href="/signup">
                                            <VStack spacing={0} align="center">
                                                <Text fontSize="xl" fontWeight="thin" color="gray.800" 
                                                    pb={6} textAlign={"center"}>
                                                    Sign Up or Login
                                                </Text>
                                                <Image src="/images/search.png" boxSize="100px" alt="Search Image" objectFit="cover"/>
                                            </VStack>
                                        </Link>
                                    </Box>
                                    <VStack spacing={0} align="center" w="50%">
                                        <Image src="/images/arrow.png" boxSize="50px" alt="Search Image" objectFit="cover"/>
                                    </VStack>
                                    <Box w="50%">
                                        <Link href="/hirers">
                                            <VStack spacing={0} align="center">
                                                <Text fontSize="xl" fontWeight="thin" color="gray.800" 
                                                    pb={6} textAlign={"center"}>
                                                    Browse Venues with our Filtering Feature
                                                </Text>
                                                <Img src="/images/browse.png" boxSize="100px" alt="Browse Image" objectFit="cover"/>
                                            </VStack>  
                                        </Link>
                                    </Box>
                                    <VStack spacing={0} align="center" w="50%">
                                        <Image src="/images/arrow.png" boxSize="50px" alt="Search Image" objectFit="cover"/>
                                    </VStack>
                                    <Box w="50%">
                                        <Link href="/hirers">
                                            <VStack spacing={0} align="center">
                                                <Text fontSize="xl" fontWeight="thin" color="gray.800" 
                                                    pb={6} textAlign={"center"}>
                                                    Rank our Venues based on your preferences
                                                </Text>
                                                <Img src="/images/list.png" boxSize="100px" alt="List Image" objectFit="cover"/>
                                            </VStack>
                                        </Link>
                                    </Box>
                                    <VStack spacing={0} align="center" w="50%">
                                        <Image src="/images/arrow.png" boxSize="50px" alt="Search Image" objectFit="cover"/>
                                    </VStack>
                                    <Box w="50%">
                                        <Link href="/apply">
                                            <VStack spacing={0} align="center">
                                                <Text fontSize="xl" fontWeight="thin" color="gray.800" 
                                                    pb={6} textAlign={"center"}>
                                                    Submit your Application
                                                </Text>
                                                <Img src="/images/apply.png" alt="Apply Image" boxSize="100px" objectFit="cover"/>
                                            </VStack>
                                        </Link>
                                    </Box>
                                </HStack>
                            <Box pt="5">
                            <Button colorScheme="blackAlpha" bg="#7A5C43" color="white" size="lg" onClick={() => router.push("/login")}>
                                Browse Venues
                            </Button>
                            </Box>
                        </Box>
                </Box>
            <Divider/>
            <HStack spacing={0}>
                <Box w="50%" bg="#F5EFE6" p={16}>
                    <Text fontSize="5xl" fontWeight="bold" mb={6}>
                        Need to advertise your venue?
                    </Text>
                    <Text fontSize="xl" color="gray.600" mb={8}>
                        Reach hirers actively searching for venues.
                        Showcase your space, manage applications,
                        and grow your bookings with ease.
                    </Text>
                    <Button bg="#7A5C43" colorScheme="blackAlpha" color="white" size="lg" onClick={() => router.push("/login")}>
                        View Your Venues
                    </Button>
                </Box>
                <Box w="50%" minH="500px" bgImage="url('/images/indoorWedding.jpg')" bgSize="cover" bgPosition="center"/>
                </HStack>
                <Divider maxW="600px" mx="auto" />
            </Box>
            <Footer/>
        </>
    );
}