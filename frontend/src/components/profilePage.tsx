import { userService } from "@/services/userService";
import { Box, Text, SimpleGrid, VStack, Avatar, Heading, Divider, Button, Input, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import UpdateDetails from "./updateDetails";
import ComplianceDocuments from "./complianceDocuments";

type UserProfile = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    dateJoined: string;
    profileImageURL?: string;
    abn?: string;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const toast = useToast();
    const fetchProfile = async () => {
        const userEmail = localStorage.getItem("email");

        if (!userEmail) return;
    
        const user = await userService.getUser(userEmail);

        setProfile(user);
        };
        
        useEffect(() => {
        fetchProfile();
        }, []);

        if (!profile) {
        return <Text>Loading...</Text>;
        }

    const handleAvatarUpload = async (
        event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !profile){
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
        toast({
                title: "Please upload a JPG, PNG, or WEBP image.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {

            const base64Image = reader.result as string;
            const updatedUser =
                await userService.updateProfileImage(
                    profile.id,
                    base64Image);
            setProfile(updatedUser);
            window.dispatchEvent(new Event("profileUpdated"));
        };
        reader.readAsDataURL(file);
    };

    const formattedJoinDate = new Date(profile.dateJoined).toLocaleDateString("en-AU");

    
    return(
         <Box minH="70vh" bg="#F5EFE6" p={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
                    <VStack spacing={4} align="center">

                        <Avatar size="2xl" name={profile.name} src={profile.profileImageURL}></Avatar>
                        <Input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" display="none" id="avatar-upload"
                        onChange={handleAvatarUpload}/>
                        <Button as="label" htmlFor="avatar-upload" size="sm" colorScheme="blue">
                            Update Photo
                        </Button>
                        <Heading size="md">{profile.name}</Heading>
                        <Text color="gray.500">{profile.role}</Text>
                        <Divider />

                        <Text><b>Join Date:</b> {formattedJoinDate}</Text>
                        <Text><b>ID:</b> {profile.id}</Text>
                    </VStack>
                </Box>

                <UpdateDetails profile={profile} onProfileUpdated={fetchProfile}></UpdateDetails>
                {profile.role === "Hirer" && (
                    <Box bg="white" p={6} borderRadius="xl" boxShadow="md" w={1350} h={"fit-content"}>
                        <ComplianceDocuments hirerId={profile.id} abn={profile.abn}></ComplianceDocuments>
                    </Box>
                )}
            </SimpleGrid>
        </Box>
    )
    
};