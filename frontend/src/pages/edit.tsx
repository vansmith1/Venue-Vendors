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
import { hirerService } from "@/services/hirerService";
import { Venue } from "@/types/venues";

export default function Edit() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [suitability, setSuitability] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [venues, setVenues] = useState<Venue[]>([]);
    const [venue, setVenue] = useState<Venue | null>(null);
    const { venueId } = router.query;
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
            setVenue(selectedVenue);
            setName(selectedVenue.name);
            setLocation(selectedVenue.location);
            setCapacity(String(selectedVenue.capacity));
            setSuitability(selectedVenue.suitability);
            setPrice(String(selectedVenue.price));
            setDescription(selectedVenue.description);
            setImageUrl(selectedVenue.imageUrl);
        }
    }, [venueId, venues]);

    const editVenue = async () => {     
        if (!user) {
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
                await vendorService.updateVenue(
                    Number(venueId),
                    name, 
                    location,
                    Number(capacity),
                    suitability,
                    Number(price),
                    description,
                    imageUrl
                );

                toast({
                    title: "Venue updated",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push("/vendors");
            }
            catch (error: any) {
                toast({
                    title: error.response?.data?.message || "Failed to update venue",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const deleteVenue = async() => {
        console.log("Venue:", venue);
        try {
            console.log("About to call delete service");

            const result = 
            await vendorService.deleteVenue(
                venue!.Id
            );
            console.log("Delete succeeded:", result);

                toast({
                    title: "Venue deleted",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push("/vendors");
            }

            catch (error: any) {
                console.log("DELETE ERROR:");

        console.log(error);

        console.log(error.response);

        console.log(error.response?.data);
                toast({
                    title: error.response?.data?.message || "Failed to delete venue",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
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
                                    Edit Venue
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
                                <Button bg="#7A5C43" colorScheme="blackAlpha" mt={7} width={280} onClick={editVenue}>
                                    Edit Venue
                                </Button>
                                <Button ml="17px" colorScheme="red" mt={7} width={280} onClick={deleteVenue}>
                                    Delete Venue
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