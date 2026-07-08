// Panel to show the vendor information about the applicant they selected
import { Box, 
        Text, 
        Card, 
        Image, 
        Button, 
        CardBody, 
        HStack, 
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        TableContainer,
        Input,
        useToast,
        Select
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { Booking } from "@/types/booking";
import { vendorService } from "@/services/vendorService";
import { complianceService } from "@/services/complianceService";

type Props = {
    applicant: Booking | null;
    onUpdateStatus: (applicationId:number, newStatus:string) => void;
};  

export default function SelectedApplicantPanel({ applicant, onUpdateStatus } : Props){
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const toast = useToast();
    const [hirer, setHirer] = useState<any | null>(null);
    const [applicantHistory, setApplicantHistory] = useState<Booking[]>([]);
    const [vendorId, setVendorId] = useState<number>(0);
    const [venues, setVenues] = useState<any[]>([]);
    const [documentsList, setDocumentsList] = useState<any[]>([]);
    const [hirerScore, setHirerScore] = useState(0);

	const documentLabels: Record<string, string> = {
        businessRegistrationCertificate: "Business Registration Certificate",
        driversLicense: "Driver's License",
        publicLiabilityInsurance: "Public Liability Insurance",
	};

    // find vendor from email
    useEffect(() => {
        const loadVendor = async () => {
            const email = localStorage.getItem("email");

            if (!email) return;

            const vendor = await userService.getUser(email);
            setVendorId(vendor.id);
        };
        loadVendor();
    }, []);

    // find venues
    useEffect(() => {
        const loadVenues = async () => {
            const venues = await vendorService.getVenues();
            setVenues(venues);
        };
        loadVenues();
    }, []);

    // finds the hirer by hirer id
    useEffect(() => {
        const loadHirer = async () => {
            if (!applicant) return;
            const hirer = await userService.getUserById(applicant.hirerId);
            const bookings = await vendorService.getBooking();
            setHirer(hirer);
            const applicantHistory = bookings.filter((bookings: {hirerId: number; Id: number, status: string;}) =>
                bookings.hirerId === applicant.hirerId &&
                bookings.status === "Confirmed"
            );
            setApplicantHistory(applicantHistory);
        };
        loadHirer();
    }, [applicant]);

    // save comment to database
    const handleSavedReview = async () => {
        if (!applicant || !hirer) return;
		
        // If the user enters a comment; save
        if (comment) {
            await vendorService.createReview(applicant.Id, vendorId, applicant.hirerId, rating, comment);

            setComment("");

            toast({
                title: "Review saved",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } 
        
        else {
            toast({
                title: "Please enter all fields",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    }

	// When Applicants change
    useEffect(() => {
        const loadComplianceDocuments = async () => {
            if(!applicant || !hirer) return;

            const documents = await complianceService.getDocuments(applicant.hirerId);
			console.log("Applicant hirerId:", applicant.hirerId);
        	console.log("Compliance documents:", documents);
            setDocumentsList(documents);

            let score = 0;
		    const hasDriverLicense = documents.some((doc: any) =>
				 doc.documentType === "driversLicense");

            const hasInsurance = documents.some((doc: any) =>
				 doc.documentType === "publicLiabilityInsurance");

            const hasBusinessCertificate = documents.some((doc: any) => 
				doc.documentType === "businessRegistrationCertificate");

            const hasABN = hirer?.abn ? true : false;

		    if (hasABN) {
    	    	if (hasDriverLicense) score += 2;
    	    	if (hasInsurance) score += 2;
    	    	if (hasBusinessCertificate) score += 1;
		    } 
			else {
    	    	if (hasDriverLicense) score += 3;
    	    	if (hasInsurance) score += 2;
		    }
		    setHirerScore(score);
            
        };
		loadComplianceDocuments();
	}, [applicant,hirer]);


    // If the applicant does not exist; do nothing
    if (!hirer || !applicant) return null;

    return (
      <>
        <HStack pb="5" spacing={0} align="stretch">
            <Card borderRadius="lg" overflow="hidden" maxW="sm">
                <Image maxH="250px" objectFit="cover"
                    src={
                        "/images/default.jpg"
                    }
                    alt="Photo of Applicant"
                />	
                <CardBody>
                    <Text fontSize="2xl" fontWeight="bold" mb={4}>
                        {hirer.name}
                    </Text>
                    <Text fontWeight={"semibold"}>
                        Event: {applicant!.occasion}
                    </Text>
                    <Text fontWeight={"semibold"}>
                        Venue: {applicant!.venueId}
                    </Text>
                    <Text fontWeight={"semibold"}>
                        Date: {applicant!.bookingDate}
                    </Text>
                    <Text fontWeight={"semibold"}>
                        Status: {applicant!.status}
                    </Text>
                    <Text fontWeight={"semibold"}>
                        Credibility Score: {hirerScore}/5 ⭐
                    </Text>
                    {/* To Approve or Deny Booking*/}
                    <Button variant="outline" 
                        colorScheme={applicant!.status === "Approved" ? "red" : "green"} mr={2} mt={4}
                        onClick={() => onUpdateStatus(applicant!.Id, applicant!.status === "Approved" ? "Declined" : "Approved")}
                    >   
                        {applicant!.status === "Approved" ? "Decline" : "Accept"}
                    </Button>
                    {/* To Mark as Pending (Reset)*/}
                    <Button variant="outline"
                        colorScheme={applicant!.status === "Pending" ? "Orange" : "black"} mr={2} mt={4}
                        isDisabled={applicant!.status === "Pending"}
                        onClick={() => onUpdateStatus(applicant!.Id, "Pending")}
                    >
                        {applicant!.status === "Pending" ? "Pending" : "Reset"}
                    </Button>
                    {/* To Confirm Booking*/}
                    <Button variant="outline"
                        colorScheme={applicant!.status === "Confirmed" ? "blue" : "black"} mr={2} mt={4}
                        isDisabled={applicant!.status != "Approved"}
                        onClick={() => { onUpdateStatus(applicant!.Id, "Confirmed");
                            toast({
                                title: "Booking confirmed", 
                                status: "success", 
                                duration: 2000,
                                isClosable: true
                            });
                        }}
                    >
                        {applicant!.status === "Confirmed" ? "Confirmed" : "Confirm"}
                    </Button>
                    {applicant.status === "Confirmed" && (
                        <>
                            <Text fontWeight="bold" mt={4}>
                                Rating
                            </Text>
                            <Select value={rating} onChange={(e) => setRating(Number(e.target.value))} >
                                <option value={1}>1 Star</option>
                                <option value={2}>2 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={5}>5 Stars</option>
                            </Select>
                            <Text mt={4} fontWeight="bold">
                                Comments
                            </Text>
                            <Input placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                            <Button mt={2} size={"sm"} onClick={handleSavedReview}>
                                Save Review
                            </Button>
                        </>
                    )}
                </CardBody>
            </Card>
            <Box pl="12px" flex="1">
                <Box bg={"white"} borderRadius="lg" pb="12px" w={"100%"}>
                    <Text fontSize={"xl"} fontWeight={"bold"} p={5} pt={3}>
                        Applicant Past Bookings
                    </Text>
                    <TableContainer borderRadius="lg" bg="white">
                        <Table bg="white" variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Event</Th>
                                    <Th>Venue</Th>
                                    <Th>Date</Th>
                                    <Th>Location</Th>
                                    <Th>Credibility Score</Th>
                                </Tr>
                            </Thead>
                            <Tbody> 
                                {applicantHistory.length > 0 ? (
                                    applicantHistory.map((booking, index) => {
                                        const venue = venues.find(
                                            venue => venue.Id === booking.venueId
                                        );
                                        console.log("hirer", hirer);
                                        return (
                                            <Tr key={index}>
                                                <Td>{hirer.name}</Td>
                                                <Td>{booking.occasion}</Td>
                                                <Td>{venue.name}</Td>
                                                <Td>{booking.bookingDate}</Td>
                                                <Td>{venue.location}</Td>
                                                <Td>{hirerScore}⭐</Td>
                                            </Tr>
                                        );
                                    })
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            No past bookings found for this applicant.
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Box bg="#F5EFE6" pt={4}>
                        <Box bg="white" borderRadius="lg" w="100%">
                            <Text fontSize={"xl"} fontWeight={"bold"} p={5}>
                                Applicant Compliant Documents
                            </Text>
                        </Box>
                        <TableContainer bg="white">
                            <Table variant="simple">  
                                <Thead>
                                    <Tr>
                                        <Th>Document</Th>
                                        <Th>Status</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>  
                                 {documentsList.length > 0 ? (
                                    documentsList.map((doc, index) =>
                                        <Tr key={index} h="64px">
                                            <Td>{documentLabels[doc.documentType]}</Td>

                                            <Td color={doc.status === "submitted" ? "green.500" : "red.400"}>
                                                {doc.status}
                                            </Td>

                                            <Td>
                                                {doc.fileUrl ? (
                                                <Button size="sm" 
														onClick={() => {
															const [header, base64Data] = doc.fileUrl.split(",");
															const mimeType = header.match(/data:(.*);base64/)?.[1];

															const byteCharacters = atob(base64Data);
															const byteNumbers = Array.from(byteCharacters).map((char) => 
															char.charCodeAt(0));

															const byteArray = new Uint8Array(byteNumbers);
															const blob = new Blob([byteArray], {
															type: mimeType || "application/pdf",
															});

															const bloblUrl = URL.createObjectURL(blob);
															window.open(bloblUrl, "_blank");
														}}
												>
                                                View
                                                </Button>
                                                ):
                                                ("-")}
                                            </Td>
                                        </Tr>)) : ( 
                                        <Tr>
                                            <Td textAlign="center" colSpan={3}>
                                                No documents available.
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </HStack>
    </>
);
}


