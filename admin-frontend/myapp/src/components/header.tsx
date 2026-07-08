// Header component
import { Box, Flex, Text, Link, useToast, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Navbar() {
	const router = useRouter();
	const toast = useToast();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	// check log in state on page render
	useEffect(() => {
		const loggedIn = localStorage.getItem("isLoggedIn");

		if (loggedIn === "true") {
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
		}
	}, []);
		
	// Log out function 
	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn");
  		setIsLoggedIn(false);

		toast({
        title: "You've been successfully logged out",
        status: "success",
        duration: 2000,
        });
		router.push("/login");
	};

	return(
		<Box borderBottom="2px" borderColor="white" bg="white" px={2} py={2}>
			<Flex align="center" justify="space-between">
				<Flex align="center" gap={2} cursor="pointer">
					<Link href="/" style={{ textDecoration: "none" }}>
						<Text fontWeight="black" fontSize="2xl">VV Admin</Text>
					</Link>
				</Flex>
				<HStack spacing="1">
					{isLoggedIn ? (
						<Link onClick={handleLogout} style={{ textDecoration: "none" }}>
							<Text fontWeight="thin" fontSize="large" lineHeight="1"_hover={{ bg:"gray.100"}} padding="5">
								Logout
							</Text>
						</Link>
					) : (
						<Link href="/login" style={{ textDecoration: "none" }}>
							<Text fontWeight="thin" fontSize="large" lineHeight="1" _hover={{ bg: "gray.100" }} padding="5">
								Login
							</Text>
						</Link>
					)}
    			</HStack>
 			</Flex>
		</Box>
	)
};