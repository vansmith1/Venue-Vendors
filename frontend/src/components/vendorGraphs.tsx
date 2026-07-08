import { Box, Text, VStack, SimpleGrid, HStack, Button} from "@chakra-ui/react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, LineChart, ResponsiveContainer,
         CartesianGrid, Legend, Pie, Cell, Line} from "recharts";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { vendorService } from "@/services/vendorService";

export default function VendorGraphs(){
    //For Bar Charts
    const [hirerTallies, setHirerTallies] = useState<any[]>([]);
    const [combinedHirerTallies, setCombinedHirerTallies] = useState<any>({
        venues: [],
        data: [],
    });
	const BAR_COLORS = ["#e2d4ba", "#827f7b", "#5f4f35", "#493f33", "#07691a"];

     //For Pie Chart
    const [pieData, setPieData] = useState<any[]>([]);
    const COLORS = [
    "#e2d4ba", // Most Active 
    "#b4b1ac", // Least Active 
    ];

    //Lines Chart
	const [range, setRange] = useState("allTime");	
    const [lineChart, setLineChart] = useState<any>({
        venues: [],
        data: [],
    });
    const LINE_COLORS = ["#047dee", "#e2d4ba", "#07691a", "#493f33", "#000000"];

	const loadVenueUtilization = async (vendorId: number, selectedRange: string) => {
		const venueUtilization = await vendorService.getVenueUtilization(
			vendorId,
        selectedRange
    	);
		setLineChart(venueUtilization);
	};

    useEffect(() => {
        const getcharts = async () => {
            const email = localStorage.getItem("email");
            if (!email) return;

            const vendor = await userService.getUser(email);
            
            const data = await vendorService.getHirerTallies(vendor.id);
            
            setHirerTallies(data);

            const combinedData = await vendorService.getCombinedHirerTallies(vendor.id);
            setCombinedHirerTallies(combinedData);

            
            const hirerActivity = await vendorService.getHirerActivity(vendor.id); 

            const pieData = [
                {
                    name:  hirerActivity.mostActive?.hirerName,
                    value: hirerActivity.mostActive?.bookings,
                },
                {
                    name:  hirerActivity.leastActive?.hirerName,
                    value: hirerActivity.leastActive?.bookings,
                },
            ];
            setPieData(pieData);

		await loadVenueUtilization(vendor.id, range);
        };
        getcharts();

    }, []);

    const EmptyChart = ({ message }: { message: string }) => (
	<Box
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        bg="gray.300"
        h="250px"
        display="flex"
    	>
        <Text color="black" fontSize="lg" fontWeight="medium">
            {message}
        </Text>
    </Box>

);

return(
    <Box p={8} bgImage={"url('/images/loginimage.jpg')"} bgSize={"cover"}>
        <Box mb={10} bg={"white"} bgSize={"cover"} pb="5px" >
            <Text fontSize={"4xl"} fontWeight="bold" mb={"15"} pt={"6"} align={"center"}>
                Vendor Analytics
            </Text>
            <Text fontSize={"xl"} fontWeight="semibold" align={"center"}>
                Hirer's Tallies Individual Venues
            </Text>
            <Text fontSize={"medium"} fontWeight={"medium"} align={"center"} mb={"4"}>
                Hirer activity across your individual venues based on approved and confirmed bookings
            </Text>
			{/*Venues Charts Ends*/}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} pl={20} pr={20} mb={5}>
                {hirerTallies.map((venue) => (
                    <Box key={venue.venueId} bg="gray.100" p={6} borderRadius={"xl"}>  
                        <Text fontSize="lg" fontWeight="semibold" mb={4}>
                            {venue.venueName}
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold" mb={4}>
                            Total Applicants: {venue.hirerTallies.length}
                        </Text>

                    {venue.hirerTallies.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={venue.hirerTallies} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis type="number" />
                                <YAxis type="category" dataKey={"hirerName"} width={120}/>
                                <Tooltip/>
                                <Bar dataKey="bookings" name="Bookings" fill="#e2d4ba"
                                barSize={20} isAnimationActive={true}></Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box alignItems="center" borderRadius="lg" bg="gray.300" h="200px" w="400px" display="flex">
                            <Text color="black" fontSize="lg" fontWeight={"medium"} pl={2}>No booking data available</Text>
                        </Box>
                    )}
                </Box>
                ))}
           </SimpleGrid>
			{/*Venues Charts Ends*/}
            <Text fontSize={"xl"} fontWeight="semibold" align={"center"} pt={"10"}>
                Hirer's Tallies across All Venues
            </Text>
            <Text fontSize={"medium"} fontWeight={"medium"} align={"center"} mb={"4"}>
                Hirer activity across all your venues based on approved and confirmed bookings
            </Text>
			{/*Stacked Columns Chart*/}
            {combinedHirerTallies.data.length > 0 ? (
            <Box bg="gray.100" mb={10} p={8} mx={20} borderRadius={"xl"} bgSize={"cover"}>
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart data={combinedHirerTallies.data}>
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="hirerName"/>
                        <YAxis allowDecimals={false} width={120}/>
                        <Tooltip/>
                        {combinedHirerTallies.venues.map((venueName: string, index: number) => (
                        <Bar key={venueName} dataKey={venueName} stackId="bookings"
                        fill={BAR_COLORS[index % BAR_COLORS.length]}barSize={200} isAnimationActive={true} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            ) : (
                 <EmptyChart message="No booking data available" />
            )}  
			{/*Stacked Columns Chart Ends*/}
            <Text fontSize={"xl"} fontWeight="semibold" align={"center"} pt={"10"}>
                Hirer's Activity
            </Text>
            <Text fontSize={"medium"} fontWeight={"medium"} align={"center"} mb={"4"}>
                Activity ranked from least active to most active hirers across all your venues
            </Text>
			{/*Pie Chart*/}
            <Box bg="gray.100" mb={10} p={8} mx={20} borderRadius={"xl"} bgSize={"cover"}>
			{pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        outerRadius={120} 
                        isAnimationActive={true}
                        label={({ name }) => name}
                         >
                            {pieData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                            ))}
                         </Pie>
                        <Tooltip contentStyle={{color: "black", background: "white"}}/>
                        <Legend formatter={(value, entry, index) => (
                            <span style={{ color: "black", fontWeight: 500, fontSize: "20px" }}>
                                    {index === 0 ? `${value} (Least Active)` : `${value} (Most Active)`}
                            </span>
                        )}/>
                    </PieChart>
                </ResponsiveContainer>
			) : (
				<EmptyChart message="No hirer activity data available" />
			)}
            </Box>
			{/*Pie Chart Ends*/}
            <Text fontSize={"xl"} fontWeight="semibold" align={"center"} pt={"4"}>
                Venue Utilization
            </Text>
            <Text fontSize={"medium"} fontWeight={"medium"} align={"center"} mb={"8	"}>
                Venue Utilization by hirers over a range of time
            </Text>
			{/*Line Chart*/}
            <Box bg="gray.100" mb={10} p={8} mx={20} borderRadius={"xl"} bgSize={"cover"}>
				<HStack justify="center" mb={4}>
				 {[
					{ label: "This Week", value: "thisWeek" },
        			{ label: "This Month", value: "thisMonth" },
        			{ label: "Last Month", value: "lastMonth" },
        			{ label: "All Time", value: "allTime" },
				 ].map((option) => (
					<Button
						key={option.value}
						colorScheme={range === option.value ? "blue" : "gray"}
						onClick={async () => {
							setRange(option.value);
							const email = localStorage.getItem("email");
							if (!email) return;
							const vendor = await userService.getUser(email);
							await loadVenueUtilization(vendor.id, option.value);
						}}>
							{option.label}
						</Button>
				    ))}
				</HStack>
				{lineChart.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={lineChart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
			
                        {lineChart.venues.map((venueName: string, index: number) => (
                            <Line
                                key={venueName}
                                type="monotone"
                                dataKey={venueName}
                                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                                strokeWidth={3}
								dot={{ r: 2 }}
								activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
				) : (
					<EmptyChart message="No venue utilization data available for this range" />
				)}
				{/*Line Chart Ends*/}
            </Box>
        </Box>
    </Box>
);
}