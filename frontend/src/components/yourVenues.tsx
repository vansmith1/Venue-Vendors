// Component to show the vendor their venues
import { Box,
        Text,
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        TableContainer,
        Button, 
        Divider,
        Input, 
        Select,
        VStack
} from "@chakra-ui/react";
import type { Venue } from "@/types/venues";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import router from "next/router";

type Props = {
    venues: Venue[];
    onBlockVenue:(venueId: number, blockStartDate: string, blockStartTime: string, blockEndDate: string, blockEndTime: string, reason: string) => void;
    onUnblockVenue:(venueId: number) => void;
};

export default function YourVenues({venues, onBlockVenue, onUnblockVenue}: Props) {
    const [venueInputs, setVenueInputs] = useState<{
        [key: number]: {
            startDate: string;
            startTime: string;
            endDate: string;
            endTime: string;
            reason: string;
        };
    }>({});
    const toast = useToast();

    return(
        <Box bg="#F5EFE6" pb={7}>
            <Divider/>
            <TableContainer bg="white" borderRadius="lg">
                <Text fontSize="2xl" p={4} fontWeight="bold">
                    Your Venues
                </Text>
                <Table variant="simple">
                    {/* HEADER */}
                    <Thead>
                        <Tr>
                            <Th>Venue</Th>
                            <Th>Status</Th>
                            <Th>Block From</Th>
                            <Th>Block To</Th>
                            <Th>Reason</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>   
                        {venues?.map((venue) => {
                            const venueData = venueInputs[venue.Id] || {
                                startDate: "",
                                startTime: "",
                                endDate: "", 
                                endTime: "",
                                reason: ""
                            };
                            return (
                            <Tr key={venue.Id}>
                                <Td>{venue.name}</Td>
                                <Td color={venue.isActive ? "green.400" : "red.400"}>
                                    {venue.isActive ? "Active" : "Blocked"}
                                </Td> 
                                <Td>
                                    <VStack>
                                        <Input placeholder="Select Date" size="md" type="date" value={venueData.startDate} onChange={(e) => setVenueInputs({...venueInputs, [venue.Id]: {...venueData, startDate: e.target.value}})}/>
                                        <Input placeholder="Select Time" size="md" type="time" value={venueData.startTime} onChange={(e) => setVenueInputs({...venueInputs, [venue.Id]: {...venueData, startTime: e.target.value}})}/>
                                    </VStack>
                                </Td>
                                <Td>
                                    <VStack>
                                        <Input placeholder="Select Date" size="md" type="date" value={venueData.endDate} onChange={(e) => setVenueInputs({...venueInputs, [venue.Id]: {...venueData, endDate: e.target.value}})}/>
                                        <Input placeholder="Select Time" size="md" type="time" value={venueData.endTime} onChange={(e) => setVenueInputs({...venueInputs, [venue.Id]: {...venueData, endTime: e.target.value}})}/>
                                    </VStack>
                                </Td>
                                <Td>
                                    <Select placeholder="Select option" value={venueData.reason} onChange={(e) => setVenueInputs({...venueInputs, [venue.Id]: {...venueData, reason: e.target.value}})}>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Renovation">Renovation</option>
                                        <option value="Private Event">Private Event</option>
                                    </Select>
                                </Td>
                                <Td>{venue.isActive === false ? (
                                        <Button width="100px" size="sm" colorScheme="green" onClick={() => {onUnblockVenue(venue.Id);}}>
                                            Unblock
                                        </Button>) : (
                                        <Button width="100px" size="sm" colorScheme="red" onClick={() => { if (!venueData.startDate || !venueData.startTime || !venueData.endDate || !venueData.endTime || !venueData.reason) { toast({ title: "Please fill in all fields", status: "error", duration: 2000, isClosable: true, }); return; } onBlockVenue(venue.Id, venueData.startDate, venueData.startTime, venueData.endDate, venueData.endTime, venueData.reason);}}>
                                            Block
                                        </Button>
                                    )}
                                <Button size="sm" ml="5px" width="100px" colorScheme="blue" onClick={() => router.push(`/edit?venueId=${venue.Id}`)}>
                                    Edit/View
                                </Button>
                                </Td>
                            </Tr>
                            );
                        })}
                        <Tr>
                            <Td>
                                <Button width="150px" size="md" colorScheme="blue" onClick={() => router.push(`/create`)}>
                                    Create new Venue
                                </Button>
                            </Td> 
                        </Tr>
                    </Tbody>
              </Table>
        </TableContainer>
    </Box>
);
}