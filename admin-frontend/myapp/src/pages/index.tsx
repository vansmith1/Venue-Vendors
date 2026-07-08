// Home page 
import { Box,
        Text,
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        TableContainer,
        Divider,
		useToast,
        Select,
		Button,
		HStack
} from "@chakra-ui/react";
import { venueService } from "../services/venueService";
import { useEffect, useState } from "react";
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import router from "next/router";

export default function Home() {
	const [venues, setVenues] = useState<any[]>([]);
	const [vendors, setVendors] = useState<any[]>([]);
	const [selectedVendors, setSelectedVendors] = useState<any>({});
	const toast = useToast();
  
	// Check if logged in
	useEffect(() => {
        const checkLog = () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");

            if (isLoggedIn !== "true") {
                router.push("/login");
            }
        };
        checkLog();
    }, []);

	// Collects venues from database
	useEffect(() => {
		venueService.getAllVenues().then(setVenues);
	}, []);

	// Collects users from database and filters to find vendors
	useEffect(() => {
		venueService.getAllUsers().then((users) => {
			setVendors(users.filter((user: any,) => user.role === "Vendor"))
		});
	}, []);

	// Toggle vendors isFeatured
	const toggleFeature = async ( venueId: number, isFeatured: boolean ) => {
		await venueService.toggleFeature( venueId, !isFeatured );

		toast({
			title: !isFeatured
				? "Venue featured successfully"
				: "Venue removed from featured venues",
			status: "success",
			duration: 3000,
			isClosable: true,
		});

		// Set the venues to the new venues
		setVenues( venues.map((venue) => venue.Id === venueId ? {
				...venue,
				isFeatured: !venue.isFeatured,
			} : venue )
	); };

	// Assign new vendor
	const assignVendor = async ( venueId: string, vendorId: string ) => {
		try {
			await venueService.assignVendor(
				venueId, vendorId
			);	

			const venues = await venueService.getAllVenues();

			setVenues(
				venues.map((venue: any) =>
					venue.Id == venueId
					? {
						...venue,
						vendorId: Number(vendorId),
						}
					: venue
				)
			);
			
			toast({
				title: "Vendor assigned",
				status: "success",
				duration: 2000,
				});
			} 
			
			catch {
				toast({
				title: "Failed to assign vendor",
				status: "error",
				duration: 2000,
				});
		}
	}

    return(
		<>
			<Navbar/>
				<Box bgImage={"url('/images/loginimage.jpg')"} pb={7} pt={5} px={4}>
					<Divider/>
					<TableContainer bg="white" borderRadius="lg">
						<Text fontSize="2xl" p={4} fontWeight="bold">
							Venues
						</Text>
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>Venue</Th>
									<Th>Current Vendor</Th>
									<Th>Assign Vendor</Th>
									<Th>Edit Venue</Th>
									<Th>Delete Venue</Th>
									<Th>Feature Venue</Th>
								</Tr>
							</Thead>
							<Tbody>
								{venues.map((venue) => (
									<Tr key={venue.Id}>
										<Td>{venue.name}</Td>
										<Td>{vendors.find((vendor) => vendor.id == venue.vendorId)?.name || vendors.find((vendor) => vendor.id == venue.vendorId)?.id}</Td>
										<Td>
											<HStack>
												<Select w="100px" placeholder="Select Vendor" onChange={(e) => setSelectedVendors({...selectedVendors,[venue.Id]: e.target.value,})}>
													{vendors.map((vendor) => (
														<option key={vendor.id} value={vendor.id} >
															{vendor.name}
														</option>
													))}
												</Select>
												<Button onClick={() => assignVendor( venue.Id, selectedVendors[venue.Id] ) } >
													Assign Vendor
												</Button>
											</HStack>
										</Td>
										<Td>
											<Button width="150px" size="md" colorScheme="blue" onClick={() => router.push(`/update?venueId=${venue.Id}`)}>
												Edit Venue
											</Button>
										</Td>
										<Td>
											<Button width="150px" size="md" colorScheme="blue" onClick={() => toggleFeature(venue.Id, venue.isFeatured)}>
												{venue.isFeatured ? "Unfeature" : "Feature"}
											</Button>
										</Td>
										<Td>
											<Button colorScheme="red" onClick={async () => { await venueService.deleteVenue(venue.Id); const venues = await venueService.getAllVenues(); setVenues(venues); toast({ title: "Venue deleted", status: "success", duration: 3000, isClosable: true, }); }} >
												Delete
											</Button>
										</Td>
									</Tr>
								))}
								<Tr>
									<Td>
										<Button width="150px" size="md" colorScheme="blue" onClick={() => router.push("create")}>
											Create new Venue
										</Button>
									</Td>
								</Tr>
							</Tbody>
					</Table>
				</TableContainer>
			</Box>
			<Footer/>
		</>
);
}