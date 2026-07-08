// Displays the users selected venues from localStorage and displays them in a list
import { Box, ListItem, OrderedList } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PopularVenues(){
    // Stores the users selected venues
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

    // Updates localStorage  
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("selectedVenues") || "[]");
        setSelectedVenues(stored);
    }, []); 

    // Convert saved venue names into a list 
    const listItems = [];

    for (let i = 0; i < selectedVenues.length; i++) {
        listItems.push(<ListItem key={i}>{selectedVenues[i]}</ListItem>);
    }

return(
    <>
        <Box display="flex" overflowX="auto" gap={4} pb={2}>
            <OrderedList>
                {listItems}
            </OrderedList>
        </Box>
    </>
);
}