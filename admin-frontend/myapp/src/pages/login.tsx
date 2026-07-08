// Login page
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { useState } from "react"
import { Text, 
        Button, 
        VStack, 
        Box, 
        Flex,
        FormControl,
        FormLabel,
        Input,
        useToast, 
        InputRightElement, 
        InputGroup 
    } from "@chakra-ui/react";

export default function Login(){
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toast = useToast();

    const handleClick = () => setShowPassword(!showPassword);
    
    // Handles log in once the login button is clicked
    const handleLogin = () => {
        // If user and password aren't filled out
        if (!username || !password) {
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 1000,
            });
            return;
        }

        // If wrong username
        if (username !== "admin") {
            toast({
                title: "Invalid username",
                status: "error",
                duration: 2000,
            });
            return;
        }

        // If wrong password
        if (password !== "admin") {
            toast({
                title: "Invalid password",
                status: "error",
                duration: 2000,
            });
            return;
        }
    
        // Try and log the user in
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", "true");

        toast({
            title: `Login Successful, Welcome ${username}`,
            status: "success",
            duration: 2000,
        });

        router.push("/");
    }

    return(
        <>
            <Box bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar />
                <Flex align="flex-start" justify={"space-between"} px={12} py={10} gap={10}>
                    <Box w="50%" mt={6} mb={6} p={10} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800" pt={2} pb={6}>
                            Admin Login
                        </Text>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>
                                    Username
                                </FormLabel>
                                <Input type="text" bg="#EDEDED" onChange={(e) => setUsername(e.target.value)}/>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <InputGroup size="md" bg="#EDEDED" borderRadius="lg">
                                    <Input type={showPassword ? "text" : "password"} bg="#EDEDED" 
                                        onChange={(e) => setPassword(e.target.value)}/>
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>    
                                </InputGroup>
                            </FormControl>
                            <Button onClick={handleLogin} mt={5} bg="#7A5C43" width={"full"} colorScheme="blackAlpha ">
                                Login
                            </Button>
                        </VStack>
                    </Box>
                </Flex>
            </Box>
            <Footer/>
        </>
    );
}