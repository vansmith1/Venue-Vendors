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
		Text,
        } from "@chakra-ui/react";
import { userService } from "@/services/userService";
import { vendorService } from "@/services/vendorService";

export default function Create() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [suitability, setSuitability] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const toast = useToast();

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
                if (user.role !== "Vendor") {
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

    const createVenue = async () => {     
        if (!user) {
            return;
        }   
        if (!user.name){
            toast({
                title: "Please complete your profile first"
            });
            return;
        }
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
                await vendorService.createVenue(
                    name, 
                    location,
                    Number(capacity),
                    suitability,
                    user.id,
                    Number(price),
                    description,
                    imageUrl,
                    true,
                    false,
                );

                toast({
                    title: "Venue created",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push("/vendors");
            }
            catch (error: any) {
                toast({
                    title: error.response?.data?.message || "Failed to create venue",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    //Image Upload 
    const handleVenueImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

         if (!allowedTypes.includes(file.type)) {
             toast({
                title: "Please upload a JPG, PNG, or WEBP image.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Image = reader.result as string;
            setImageUrl(base64Image);
        };
        reader.readAsDataURL(file);
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
                                        <Select placeholder="Choose Venue Suitability" bg="white" value={suitability}
                                                onChange={(e) => setSuitability(e.target.value)}>
                                            <option>Weddings</option>
                                            <option>Exhibitions & Showcases</option>
                                            <option>Business Meetings</option>
                                            <option>Private Functions</option>
                                        </Select>
                                    </InputGroup>
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
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            display="none"
                                            id="venue-image-upload"
											onChange={handleVenueImageUpload}
                                        />
										<Button
										as="label"
										htmlFor="venue-image-upload"
        								colorScheme="blue"
										w="fit-content"
										>
											Upload Venue Image
										</Button>
										{imageUrl && (
											<Text color="green.500" fontSize="sm" mt={2}>
												✓ Venue image selected
											</Text>
										)}
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