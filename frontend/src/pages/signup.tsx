// Sign up page
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import { userService } from "../services/userService";
import { useState } from "react";
import { Text, 
         Input,
         InputGroup,
         InputRightElement,
         Button,
         Flex,
         Box,
         Link,
         FormControl,
         FormLabel,
         useToast,
         } from "@chakra-ui/react";

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();

    // Email domain choices
    const validDomains = [
        "@gmail.com",
        "@email.com",
        "@outlook.com",
        "@hotmail.com",
        "@yahoo.com",
        "@live.com",
        "@icloud.com",
        "@student.rmit.edu.au",
        "@rmit.edu.au"
    ];

    const handleSignup = async (role: string) => {
        // If user and password aren't filled out
        if(!email || !password1 || !password2){
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 1000,
            });
            return;
        }
        if (password1 !== password2) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 1000,
            });
            return;
        // If password is less than 6 characters, alert user
        } if (password1.length < 6) {
            toast({
                title: "Password must be at least 6 characters",
                status: "warning",
                duration: 1000,
            });
            return;
        // If user enters email dress with invalid domain
        }  if (!validDomains.some(domain => email.endsWith(domain))) {
            toast({
                title: "Please enter a valid email address",
                status: "warning",
                duration: 1000,
            });
            return;
        // If password doesn't contain an uppercase letter
        }  if (!/[A-Z]/.test(password1)) {
            toast({
                title: "Password must contain an uppercase letter",
                status: "warning",
                duration: 1000,
            });
            return;
        // If password doesn't contain a lowercase letter
        }  if (!/[a-z]/.test(password1)) {
            toast({
                title: "Password must contain a lowercase letter",
                status: "warning",
                duration: 1000,
            });
            return;
        // If password doesn't contain a special character
        }  if (!/[^A-Za-z0-9]/.test(password1)) {
            toast({
                title: "Password must contain a special character",
                status: "warning",
                duration: 1000,
            });
            return;
        } 
        
        try {
            const user = await userService.signup(email, password1, password2, role);
                
            toast({
                title: `Signup Successful`,
                status: "success",
                duration: 2000,
            });

            router.push("/login");
        }
        catch (error) {
            toast({
                title: "Unable to create account",
                status: "error",
                duration: 2000,
            });
        }
    };

    return (
        <>
            <Box minH="100vh" bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar/>
                    <Flex align="flex-start" justify={"space-between"} px={12} py={10} gap={10}>
                        <Box w="50%" minH="450px" mt={6} mb={6} p={10} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800" pt={2} pb={3}>
                                Sign Up
                            </Text>
                            <Box textAlign="left">
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={3}>
                                        Email
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">   
                                        <Input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='example@domain.com'
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={4}>
                                        Password
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input pr='4.5rem' type={show ? 'text' : 'password'}
                                            value={password1}
                                            onChange={(e) => setPassword1(e.target.value)}
                                            />
                                        <InputRightElement width='4.5rem'>
                                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                            {show ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={5}>
                                        Confirm Password
                                    </FormLabel>
                                    <InputGroup size='md' bg="#EDEDED" borderRadius="lg">
                                        <Input pr='4.5rem' type={show ? 'text' : 'password'} value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                                            <InputRightElement width='4.5rem'>
                                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                                    {show ? 'Hide' : 'Show'}
                                                </Button>
                                            </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <Flex mt={7} gap={4}>
                                    <Button bg="#7A5C43" colorScheme="blackAlpha" flex={1} onClick={() => handleSignup("Hirer")}>
                                        Sign Up As Hirer
                                    </Button>
                                    <Button bg="#7A5C43" colorScheme="blackAlpha" flex={1} onClick={() => handleSignup("Vendor")}>
                                        Sign Up As Vendor
                                    </Button>
                                </Flex>
                                <Text pt="5" pb="3" textAlign="center">
                                    Already have an account?
                                </Text>
                                <Link href="login" textAlign="center" style={{ textDecoration: "none" }}>
                                    <Text>Log In Here</Text>
                                </Link>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            <Footer/>
        </>
    );}

