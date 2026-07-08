// Component to show user available venues
import { Text, 
        Box, 
        Flex, 
        Button, 
        Tbody,
        Checkbox,
        Table, 
        Thead, 
        Tr, 
        Th, 
        Td, 
        TableContainer, 
        FormControl,
        Select,
        useToast,
        Input,
        HStack} from "@chakra-ui/react";
import { useEffect, useState } from "react";    
import router from "next/router";
import { ArrowDownIcon } from "@chakra-ui/icons/ArrowDown";
import { ArrowUpIcon } from "@chakra-ui/icons/ArrowUp";
import { hirerService } from "@/services/hirerService";
import { Venue } from "@/types/venues";

export default function PopularVenues(){
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [submittedVenues, setSubmittedVenues] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [suitability, setSuitability] = useState("");
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
    const toast = useToast();
    const locationOptions = Array.from(
        (venues.map((venue) => venue.location))
    );
    const handleReset = () => {
        setLocation("");
        setSuitability("");
        setCapacity("");
        setName("");
        setFilteredVenues(venues);
    };

    // loads venues from database
    useEffect(() => {
        const loadVenues = async () => {
            const venues: Venue[] = await hirerService.getVenues();
            
            const featuredVenues = venues.filter(
                (venue) => venue.isFeatured
            );

            setVenues(featuredVenues);
            setFilteredVenues(featuredVenues);
        };
        loadVenues();
    }, []);

    const filterVenues = () => {
        // If user tries to submit venue preferences with no input
        if (!name && !location && !capacity && !suitability) {
            setLocation("");
            setSuitability("");
            setCapacity("");
            setName("");
            setFilteredVenues(venues);

            toast({
                title: "Please Select At Least One Filter",
                status: "info",
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        
        const filteredVenues = venues.filter((venue) => {
            // If user is using search function, filter through venues and return the ones that match query.
            const nameMatch = !name || venue.name.toLowerCase().includes(name.toLowerCase());
            const locationMatch = !location || venue.location === location;
            const capacityMatch = !capacity || capacity === "Less than 50" && venue.capacity < 50 ||
                                               capacity === "50 - 99" && venue.capacity >= 50 && venue.capacity <= 99 ||
                                               capacity === "100 - 149" && venue.capacity >= 100 && venue.capacity <= 149 ||
                                               capacity === "150+" && venue.capacity > 150;
            const suitabilityMatch = !suitability || venue.suitability === suitability;
            return nameMatch && locationMatch && capacityMatch && suitabilityMatch;
        });

        setFilteredVenues(filteredVenues);
    };

    const submitVenues = () => {
        // Check if user has selected at least one venue before submitting
        if (checkedItems.length === 0) {
            alert("Please select at least one venue");
            setSubmittedVenues([]);
        } else {
            setSubmittedVenues(checkedItems);
        }
    };

    // Function to move venues up in the submitted list
    const moveUp = (index: number) => {
        if (index !== 0) {
            const updated = [...submittedVenues];
            const temp = updated[index];
            updated[index] = updated[index - 1];
            updated[index - 1] = temp;
            setSubmittedVenues(updated);
        }
    };

    // Function to move venues down in the submitted list
    const moveDown = (index: number) => {
        if (index !== submittedVenues.length - 1) {
            const updated = [...submittedVenues];
            const temp = updated[index];
            updated[index] = updated[index + 1];
            updated[index + 1] = temp;
            setSubmittedVenues(updated);
        }
    };

    return(
        <>
        {/* If filteredVenues array is not empty, render the venues */}
        {filteredVenues.length > 0 && (
            <>
            <Flex pb="5" gap={4} align="center" wrap="wrap"> 
                <Input placeholder="Search by name" 
                    w="200px" bg="white" value={name}
                    onChange={(e) => setName(e.target.value)}/>
                <FormControl w="200px">
                    <Select placeholder="Location" bg="white" value={location}
                        onChange={(e) => setLocation(e.target.value)}>
                        {locationOptions.map((location) => (
                            <option key={location} value={location}>
                            {location}
                            </option>
                        ))}
                    </Select>
                </FormControl>    
                <FormControl w="200px">
                    <Select placeholder="Capacity" bg="white" value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}>
                        <option>Less than 50</option>
                        <option>50 - 99</option>
                        <option>100 - 149</option>
                        <option>150+</option>
                    </Select>
                </FormControl> 
                <FormControl w="200px">
                    <Select placeholder="Suitability" bg="white" value={suitability}
                            onChange={(e) => setSuitability(e.target.value)}>
                        <option>Weddings</option>
                        <option>Exhibitions & Showcases</option>
                        <option>Business Meetings</option>
                        <option>Private Functions</option>
                    </Select>
                </FormControl> 
                <Button bg="#7A5C43" colorScheme="blackAlpha" width="250px" onClick={() => {filterVenues()}}>
                    Filter Search
                </Button>
                <Button bg="#907866" colorScheme="blackAlpha" width="250px" onClick={() => {handleReset()}}>
                    Reset Search
                </Button>
            </Flex>
                <Box display="flex" overflowX="auto" gap={4}>
                    <Flex overflowX="auto" gap={4} pb="5">
                        {/* Cycling through venues.tsx and rendering each object */}
                        {filteredVenues.map((venue) => (
                            <Box key={venue.Id} h="400px" minW="400px" bgImage={venue.imageUrl || "/images/default.jpg"} bgSize="150%" bgPosition="center" pt={2} pr={365} position="relative" role="group">
                                <Box position="absolute" inset={0} bg="blackAlpha.600" opacity={1}>
                                    <Text pt="3" pl="5" fontSize="3xl" color="white" fontWeight="bold">
                                        {venue.name}
                                    </Text>
                                    <Text pl="5" fontSize="md" color="white" fontWeight="bold">
                                        {venue.location}
                                    </Text>
                                    <Text pt="5" pr="5" pl="5" fontSize="xl" color="white">
                                        {venue.description}
                                    </Text>
                                    <Text pt="5" pr="5" fontSize="2xl" color="white">
                                        Capacity: {venue.capacity}
                                    </Text>
                                    <Text pr="5" fontSize="md" color="white" fontWeight="bold">
                                        Price: ${venue.price}/event
                                    </Text>
                                    {/* button to select venues for venue candidate table */}
                                    <Button size="sm" mt={2} bg="#808080" width={200} colorScheme="blackAlpha" onClick={() => {if (checkedItems.includes(venue.name)) { setCheckedItems(checkedItems.filter(name => name !== venue.name)); } else { setCheckedItems([...checkedItems, venue.name]); } }}>
                                        {checkedItems.includes(venue.name)
                                            ? "Remove from Preferences"
                                            : "Add to Preferences"
                                        }
                                    </Button>
                                    <Button bg="#808080" colorScheme="blackAlpha" mt={3} width={293} onClick={() => router.push(`/apply?venueId=${venue.Id}`)}>
                                        Apply
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Flex>
                </Box>
                {/* Submit button for selected venues */}
                {venues.length !== 0 &&
                    <Box display="flex" pb="3" justifyContent="left" >
                        <Button bg="#7A5C43" colorScheme="blackAlpha" width={293} onClick={submitVenues}>
                            Submit Selected Venues
                        </Button>
                    </Box>
                }
                <Box pb={5}>
                    {/* Venue preference table */}
                    <Box bgColor={"white"}>
                        <Text fontSize="2xl" pt="2" fontWeight="bold" textAlign="left" pl="5" color="gray.800">
                            Your Selected Venues:
                        </Text>
                        <TableContainer>
                            <Table >
                                <Thead>
                                    <Tr>
                                        <Th>Number</Th>
                                        <Th>Venue Name</Th>
                                        <Th>Location</Th>
                                        <Th>Capacity</Th>
                                        <Th>Price</Th>
                                        <Th/>
                                        <Th/>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                {/* Cycles through all venues and shows them in table if the matches the venue name in the submittedVenues array */}
                                {submittedVenues.map((venue, index) => (
                                    <Tr key={index}>
                                        <Td>{index + 1}</Td>
                                        <Td>{venue}</Td>
                                        <Td>{venues.find(v => v.name === venue)?.location}</Td>
                                        <Td>{venues.find(v => v.name === venue)?.capacity}</Td>
                                        <Td>${venues.find(v => v.name === venue)?.price}</Td>
                                        <Td>
                                            {/* Buttons to move venues up and down in the preference list */}
                                            <Button onClick={() => moveUp(index)}> 
                                                <ArrowUpIcon/>
                                            </Button>
                                        </Td>
                                        <Td>
                                            <Button onClick={() => moveDown(index)}>
                                                <ArrowDownIcon/>
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </>
        )}
        {/* If venues array is empty, render the message below */}
        {filteredVenues.length === 0 && (
            <Box pb={5}>
                <Text fontSize="4xl" pb="5" fontWeight="bold" textAlign="left" pl="5" color="gray.800">
                    No Venues Available
                </Text>
                <Button bg="#7A5C43" colorScheme="blackAlpha" width="250px" onClick={handleReset}>
                    Reset
                </Button>  
            </Box>
        )}   
    </>
);
}
