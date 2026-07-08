// Login page
import Navbar from "@/components/header";
import Footer from "@/components/footer"
import { useRouter } from "next/router";
import { useState } from "react"
import { userService } from "../services/userService";
import { Text, Button, VStack, Box, Flex,
  FormControl,FormLabel,Input,
  useToast, Link, InputRightElement, InputGroup } from "@chakra-ui/react";

export default function Login(){
    const router = useRouter();
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toast = useToast();

    const handleClick = () => setShowPassword(!showPassword);
    
    const handleLogin = async () => {
        // If user and password aren't filled out
        if(!email || !password){
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 1000,
            });
            return;
        }
    
        try {
            const user = await userService.login(email, password);

            localStorage.setItem("email", user.email);
            localStorage.setItem("isLoggedIn", "true");

            toast({
                title: `Login Successful, Welcome ${user.email}`,
                status: "success",
                duration: 2000,
            });

            if (user.role === "Hirer") {
                router.push("/hirers");
            }
            else if (user.role === "Vendor") {
                router.push("/vendors");
            }
        }

        catch (error) {
            toast({
                title: "Invalid email or password",
                status: "error",
                duration: 2000,
            });
        }
    };

    return(
        <>
            <Box bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar />
                <Flex align="flex-start" justify={"space-between"} px={12} py={10} gap={10}>
                    <Box w="50%" mt={6} mb={6} p={10} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800" pt={2} pb={6}>
                            Login
                        </Text>
                        <VStack spacing={4}>
                            {/*Email*/}
                            <FormControl isRequired>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <Input type="email" placeholder="example@gmail.com" bg="#EDEDED" value={email}
                                    onChange={(e) => setEmail(e.target.value)}/>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                {/*For Show/Hide Button*/}
                                <InputGroup size="md" bg="#EDEDED" borderRadius="lg">
                                    <Input type={showPassword ? "text" : "password"} bg="#EDEDED" value={password}
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
                            <Text>
                                New to Venue Vendors?
                            </Text>
                            <Link href="signup" style={{ textDecoration: "none" }}>
                                <Text>
                                    Sign Up Here
                                </Text>
                            </Link>
                        </VStack>
                    </Box>
                </Flex>
            </Box>
            <Footer/>
        </>
    );
}
