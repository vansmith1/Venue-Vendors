// Create venue page
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
import { venueService } from "@/services/venueService";

export default function Create() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [vendors, setVendors] = useState<any[]>([]);
    const [vendorId, setVendorId] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [suitability, setSuitability] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const toast = useToast();

    // If the user is logged in, proceed. If not, redirect to login page
    useEffect(() => {
        const checkLog = () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");

            if (isLoggedIn !== "true") {
                router.push("/login");
            }
        };
        checkLog();
    }, []);

    // Load vendors
    useEffect(() => {
        venueService.getAllUsers().then((users) => {
            setVendors(
                users.filter((user: any) => user.role === "Vendor")
            );
        });
    }, []);

    // Create venue
    const createVenue = async () => {     
        // If any of the application fields are empty, alert the user to fill in all fields. 
        if (!name || !location || !capacity || !suitability || !price || !description || !imageUrl) {
            toast({
                title: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        } 
        // If venue name contains only numbers, alert the user to enter a valid venue name.
        if (!isNaN(Number(name))) {
            toast({
                title: "Venue name cannot contain only numbers",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        // If venue location contains only numbers, alert the user to enter a valid venue name.
        } else if (!isNaN(Number(location))) {
            toast({
                title: "Venue location cannot contain only numbers",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        // If venue description contains only numbers, alert the user to enter a valid venue name.
        } else if (!isNaN(Number(description))) {
            toast({
                title: "Venue description cannot contain only numbers",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        // If venue suitability contains only numbers, alert the user to enter a valid venue name.
        } else if (!isNaN(Number(suitability))) {
            toast({
                title: "Venue suitability cannot contain only numbers",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        // If capacity is not a valid number or less than 0, alert the user to enter a valid number.
        } else if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
            toast({
                title: "Please enter a valid capacity",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        // If event duration is not a valid number, alert the user to enter a valid event duration.
        } else if (isNaN(Number(price)) || Number(price) <= 0) {
            toast({
                title: "Please enter a valid price",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        } else {
            try {
                // Call venue service to create venue using inputs as parameters
                await venueService.createVenue(
                    name, 
                    location,
                    Number(capacity),
                    suitability,
                    Number(vendorId),
                    Number(price),
                    description,
                    imageUrl
                );

                toast({
                    title: "Venue created",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push("/");
            }

            catch (error: any) {
                toast({
                    title: "Failed to create venue",
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
                                Create Venue
                            </Heading> 
                            <Box textAlign="left">
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Name
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input 
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder='Enter Venue Name'/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Location
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input 
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder='Enter Venue Location'/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Capacity
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">   
                                        <Input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            placeholder='Enter Venue Capacity'
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Suitability
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">   
                                        <Input 
                                            type="text"
                                            value={suitability}
                                            onChange={(e) => setSuitability(e.target.value)}
                                            placeholder='Enter Venue Suitability'/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt={5}>
                                        Vendor
                                    </FormLabel>
                                    <Select placeholder="Select Vendor" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                                        {vendors.map((vendor) => (
                                            <option key={vendor.id} value={vendor.id}>
                                                {vendor.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel pt={5}>
                                        Venue Description
                                    </FormLabel>
                                    <Input
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter Venue Description"
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Price
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Venue Image
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input
                                            placeholder='Enter Venue Image Url'
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <Button bg="#7A5C43" colorScheme="blackAlpha" mt={7} width={293} onClick={createVenue}>
                                    Create Venue
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