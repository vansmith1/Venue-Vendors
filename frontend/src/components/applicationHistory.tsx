// Shows the user their application history
import { Text, 
        Box, 
        Tbody,
        Table, 
        Thead, 
        Tr, 
        Th, 
        Td, 
        TableContainer} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Booking } from "@/types/booking";
import { userService } from "@/services/userService";
import { hirerService } from "@/services/hirerService";

export default function ReputationTable(){;    
    // This allows the user to see their applications, and page updates depending on which user is logged in
    const [user, setUser] = useState<any>(null);
    const [myHistory, setMyHistory] = useState<Booking[]>([]);

    // get user from localstorage email
    useEffect(() => {
        const getUser = async () => {
            const email = localStorage.getItem("email");

            try {
                const user = await userService.getUser(email!);
                setUser(user);
            }
            catch (error) {
                return;
            }
        };
        getUser();
    }, []);

    // filters through and finds users applications
    useEffect(() => {
        if (!user) return;
        
        const myHistory = async () => {
            const applications = await hirerService.getBooking();     
            const myApplications = applications.filter(
                (application: Booking) => Number(application.hirerId) === Number(user.id)
            );
            setMyHistory(myApplications);
        };
        myHistory();
    }, [user]);

    return(
        <>
            {/* Table for past bookings and reputation ratings */}
            <Box pt="5">
                <Box bgColor="white" mb={10}>
                    <Text fontSize="2xl" pt="5" fontWeight="bold" textAlign="left" pl="5"color="gray.800" mb={5}>
                        Previously Submitted Applications:
                    </Text>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Event Name</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {myHistory.map((application, index) => (
                                    <Tr key={index} bg="white">
                                        <Td>{application.occasion}</Td>
                                        <Td>{application.status}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
}