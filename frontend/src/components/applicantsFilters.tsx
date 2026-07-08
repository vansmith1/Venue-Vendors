// Component for vendor to filter the applicants
import { Box, Flex, Input, FormControl, Select, Button } from "@chakra-ui/react";

type ApplicantsFiltersProps= {
    search: string;
    suitability: string;
    sortBy: string;
    onSearchChange: (value: string) => void;
    onSuitabilityChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onReset: () => void;
};

export default function ApplicantsFilters({
    search,
    suitability,
    sortBy,
    onSearchChange,
    onSuitabilityChange,
    onSortByChange,
    onReset,
    }: ApplicantsFiltersProps) {

    return (
        <Box>
            <Flex pb={5} gap={4} align="center"wrap="wrap"> 
                <Input
                    placeholder="Search by hirer name, venue name, etc.." 
                    w={{ base: "100%", md: "450px" }} bg="white" value={search}
                    onChange={(e) => onSearchChange(e.target.value)}/>
                <FormControl w={{ base: "100%", md: "200px" }}>
                    <Select 
                        placeholder="Suitability" bg="white" value={suitability}
                        onChange={(e) => onSuitabilityChange(e.target.value)}
                        >
                        <option value="Weddings">Weddings</option>
                        <option value="Business Meetings">Business Meetings</option>
                        <option value="Exhibitions & Showcases">Exhibitions and Showcases</option>
                        <option value="Private Functions">Private Functions</option>
                    </Select>
                </FormControl>    
                <FormControl w={{ base: "100%", md: "200px" }}>
                    <Select placeholder="Sort By" bg="white" value={sortBy} 
                            onChange={(e) => onSortByChange(e.target.value)}
                        >   
                        <option>Reputation (High → Low)</option>
                        <option>Reputation (Low → High)</option>
                        <option>Date</option>
                    </Select>
                </FormControl> 
                <Button bg="#7A5C43" colorScheme="blackAlpha" width="300px" onClick={onReset}>
                    Reset
                </Button>  
            </Flex> 
        </Box>
    );
}