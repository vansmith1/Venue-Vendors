// Footer function 
import { Box, Text } from "@chakra-ui/react";

export default function Footer() {

    return(
        <Box as="footer" textAlign="center" py={6} borderTop="1px" borderColor="gray.200">
            <Text fontWeight="semibold" color="gray.700">Venue Vendors © 2026</Text>
            <Text fontSize="sm" color="gray.700">Designed by Vanessa Smith & Nicholas Egerton</Text>
            <Text fontSize="sm" color="gray.400">Full Stack Development 2026</Text>
            <Text fontSize="sm" color="gray.400">RMIT</Text>
        </Box>
    );
}