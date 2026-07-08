// Component to allow user to update their details
import { Text, 
         Divider,
         Input,
         InputGroup,
         Button,
         Flex,
         Box,
         FormLabel,
         Link,
         useToast,
         HStack,
         FormControl,
         VStack
         } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { userService } from "../services/userService";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
};

type UpdateDetailsProps = {
  profile: UserProfile;
  onProfileUpdated: () => void;
};

export default function UpdateDetails({
    profile, onProfileUpdated,}: UpdateDetailsProps){
    const userId = profile.id;
    
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const toast = useToast();
    //UseEffect for existing user
    useEffect(() => {    
        setName(profile.name || "");
        setPhoneNumber(profile.phoneNumber || "");
        setEmail(profile.email || "");
    }, [profile]);

    const update = async () => { 
        //If ID is empty return error
        if (!userId) {
            toast({title: "User not found", status: "error",duration: 2000,isClosable: true});
            return;
        }
        // If either field is empty, tell the user to fill them in.
        if (!name || !phoneNumber) {
            toast({title: "Please fill in all editable fields", status: "error", duration: 2000,isClosable: true,});
            return;
        }
        // If phone number is not 10 digits or contains non-numeric characters, alert the user to enter a valid phone number.
        if (phoneNumber.length !== 10 ||isNaN(Number(phoneNumber)) ) {
            toast({title: "Please enter a valid phone number", status: "error", duration: 2000, isClosable: true,});
            return;
        }            
        // If name contains only numbers, alert the user to enter a valid name.  
        if (!isNaN(Number(name))) {
            toast({title: "Name cannot contain only numbers", status: "error", duration: 2000, isClosable: true,});
            return;
        } 

        try {
            setLoading(true);

            const updatedUser = await userService.updateProfile(userId, {
                name,
                phoneNumber,
            });

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            toast({
                title: "Details updated",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: "Update failed",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        } finally{setLoading(false);

        }
    };

    return(
        <>
            <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
                <VStack align="stretch" spacing={5}>   
                    <HStack justify="space-between"> 
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold">
                            Profile Details
                            </Text>
                            <Text color="gray.500">
                            View and update your personal information.
                            </Text>
                        </Box>
                        {!isEditing && (
                            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                        )}
                    </HStack>
                    <FormControl>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <Input value={name} isReadOnly={!isEditing} bg={isEditing ? "white" : "gray.100"}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </FormControl>  
                    <FormControl>
                        <FormLabel>
                            Phone Number
                        </FormLabel>
                        <Input value={phoneNumber} isReadOnly={!isEditing} maxLength={10} bg={isEditing ? "white" : "gray.100"}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                    </FormControl>
                    <FormControl>
                        <FormLabel>
                            Email
                        </FormLabel>
                        <Input value={email} isReadOnly={!isEditing} bg={isEditing ? "white" : "gray.100"}/>
                    </FormControl>
                {isEditing && (
                    <HStack>
                        <Button colorScheme="green" onClick={update} isLoading={isLoading}>
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </HStack>)}
                </VStack>
            </Box>  
        </>
    );
}
