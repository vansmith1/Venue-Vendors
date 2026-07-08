import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { ChangeEvent } from "react";
import { Text, 
         Input,
         Button,
         Flex,
         Box,
         Tag,
         FormControl,
         FormLabel,
         useToast,
         Checkbox,
         Divider,
         } from "@chakra-ui/react";

export default function SignUp() {
    const toast = useToast();

    const convertToBase64 = (file: File) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const UploadButton = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return;
        }
        const file = e.target.files[0];
        const key = e.target.id;

        if (file && file.size > (2 * 1024 * 1024)) {
            alert("File size too big");
        }
        else if (file) {
            const base64String = await convertToBase64(file);
            localStorage.setItem(key, JSON.stringify(base64String));
        }
        else {
            toast({
                title: "File not uploaded",
                status: "error",
                duration: 2000,
            });
        }
    }

    const submitDoc = () => {
        toast({
            title: "Document saved",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    }
    

    return (
        <>
            <Box minH="100vh" bgImage={"url('/images/loginimage.jpg')"} bgSize="cover">
                <Navbar/>
                <Flex align="flex-start" justify={"space-between"} px={12} py={10} gap={10}>
                        <Box w="50%" minH="450px" mt={6} mb={6} p={10} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800" pt={2} pb={3}>
                                Upload Documents
                            </Text>
                            <Box textAlign="left">
                                <FormControl isRequired>
                                    <FormLabel fontSize="1xl" color="gray.800" pt={3}>
                                        Documents
                                    </FormLabel>
                                    <Tag>
                                        License
                                    </Tag>
                                    <Divider/>
                                    <Input type='file' id='license' name='license' accept='.jpg' onChange={UploadButton}/>
                                    <Tag>
                                        Insurance
                                    </Tag>
                                    <Input type='file' id='insurance' name='insurance' accept='.pdf' onChange={UploadButton}/>
                                    <Tag>
                                        Business
                                    </Tag>
                                    <Input type='file' id='business' name='business' accept='.pdf' onChange={UploadButton}/>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            
                                        }
                                    }}/>
                                </FormControl>
                                <Flex mt={7} gap={4}>
                                    <Button bg="#7A5C43" colorScheme="blackAlpha" flex={1} onClick={submitDoc}>
                                        Submit Documents
                                    </Button>
                                </Flex>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            <Footer/>
        </>
    );}
