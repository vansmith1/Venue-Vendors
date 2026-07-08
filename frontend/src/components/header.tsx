// Header component
import { Box, Flex, Text, Link, useToast, HStack, Image, Avatar } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";

export default function Navbar() {
	const router = useRouter();
	const toast = useToast();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<any>(null);
	
    useEffect(() => {
        const checkRole = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                return;
            }
            try {
                const user = await userService.getUser(email);
				setUser(user);
            	setIsLoggedIn(true);
            }
            catch {
                setUser(null);
            	setIsLoggedIn(false);
            }
        };
        checkRole();

		window.addEventListener("profileUpdated", checkRole);

		return () => {
			window.removeEventListener("profileUpdated", checkRole);
		};
    }, []);

		// Log out function 
	const handleLogout = () => {
		userService.logOutUser();
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
						<Text fontWeight="black" fontSize="2xl">VV</Text>
					</Link>
					<Flex direction="column">
						<Text fontWeight="thin" fontSize="large" lineHeight="1">Venue </Text>
						<Text fontWeight="thin" fontSize="large" lineHeight="1">Hirers </Text>
					</Flex>
				</Flex>
				<HStack spacing="1">
						<Link href="/aboutUs" style={{ textDecoration: "none" }}>
							<Text fontWeight="thin" fontSize="large" lineHeight="1"_hover={{ bg:"gray.100"}} padding="5">
								About Us
							</Text>
						</Link>
					{(isLoggedIn && user?.role === "Vendor") && (
						<Link href="/vendors" style={{ textDecoration: "none" }}>
							<Text fontWeight="thin" fontSize="large" lineHeight="1" _hover={{ bg: "gray.100" }} padding="5">
								Dashboard
							</Text>
						</Link>
					)}
					{(isLoggedIn && user?.role === "Hirer") && (
						<Link href="/hirers" style={{ textDecoration: "none" }}>
							<Text fontWeight="thin" fontSize="large" lineHeight="1" _hover={{ bg: "gray.100" }} padding="5">
								Dashboard
							</Text>
						</Link>
					)}
					{isLoggedIn ? (
						<>
							<Link onClick={handleLogout} style={{ textDecoration: "none" }}>
								<Text fontWeight="thin" fontSize="large" lineHeight="1"_hover={{ bg:"gray.100"}} padding="5">
									Logout
								</Text>
							</Link>

	  						<Link href="/profile">
    							<Avatar
      							size="sm"
      							name={user?.name}
      							src={user?.profileImageURL}
      							cursor="pointer"
								_hover={{ bg:"gray.500"}}
    							/>
  							</Link>
						</>
					) : (
						<>
							<Link href="/login" style={{ textDecoration: "none" }}>
								<Text fontWeight="thin" fontSize="large" lineHeight="1" _hover={{ bg: "gray.100" }} padding="5">
									Login
								</Text>
							</Link>
							<Link href="/signup" style={{ textDecoration: "none" }}>
								<Text fontWeight="thin" fontSize="large" lineHeight="1" _hover={{ bg: "gray.100" }} padding="5">
									Sign Up
								</Text>
							</Link>
							
						</>
					)}
    			</HStack>
 			</Flex>
		</Box>
	)
};