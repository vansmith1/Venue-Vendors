import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
  useToast,
  Box,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { complianceService} from "@/services/complianceService";
import { userService } from "@/services/userService";

type ComplianceDocumentsProps = {
	hirerId: number;
	abn?: string;
};

export default function ComplianceDocuments({hirerId, abn }: ComplianceDocumentsProps){
	const [isBusiness, setIsBusiness] = useState(false);
	const [credibilityScore, setCredibilityScore] = useState(0);
	const [abnNumber, setAbnNumber] = useState(abn || "");
	const [isEditingABN, setIsEditingABN] = useState(false);

	const [driversLicense, setDriversLicense] = useState<File | null>(null);
	const [publicLiabilityInsurance, setPublicLiabilityInsurance] = useState<File | null>(null);
	const [businessRegoCertificate, setBusinessRegoCerificate] = useState<File | null>(null);

	const toast = useToast();
	const [savingDocument, setSavingDocument] = useState(false);
	const [savedDocuments, setSavedDocuments] = useState<any[]>([]);

	//Preload the ABN
	useEffect(() => {

    if (abn) {
        setAbnNumber(abn);
        setIsBusiness(true);
    }
	}, [abn]);

	//File to base64
		const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve,reject) => {
			const reader = new FileReader();

			reader.onloadend = () => {
				resolve(reader.result as string);
			};

			reader.onerror = () => {
				reject("Failed to read file");
			};

			reader.readAsDataURL(file);
		});
	};

	//Function to save Document
	const handleSaveDocument = async(
		file: File | null, documentType: string) => {

		if(!file){
			toast({
				title: "Please select a file first",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			return;
		}
		try{
			setSavingDocument(true);
			
			const fileUrl = await fileToBase64(file);

			await complianceService.uploadDocument(
				hirerId, 
				documentType,
				fileUrl
			);
			setBusinessRegoCerificate(null);
			setDriversLicense(null);
			setPublicLiabilityInsurance(null);

			await fetchComplianceDocuments();

			toast({
				title: `${documentType} uploaded successfully`,
				status: "success",
				duration: 2000,
				isClosable: true,
			});

		} catch {
			toast({
				title: "Failed to upload document",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		}finally{
			setSavingDocument(false);
		}
	};

	//Function to save ABN
	const handleSaveABN = async() => {

		if(!abnNumber){
			toast({
				title: "Please enter an ABN number",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		if(abnNumber.length !==11){
			toast({
				title: "ABN must be 11 digits",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		try{
			setSavingDocument(true);

			await userService.updateProfile(hirerId, { abn: abnNumber,
		});

			toast({
				title: "ABN saved successfully",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setSavingDocument(false);
		}
	};
	// Function to Fetch compliance Documents
	const fetchComplianceDocuments = async () => {
		const documents = await complianceService.getDocuments(hirerId);
		setSavedDocuments(documents);
		let score = 0;

		const hasDriverLicense = documents.some((doc: any) => doc.documentType === "driversLicense");

		const hasInsurance = documents.some((doc: any) => doc.documentType === "publicLiabilityInsurance");

		const hasBusinessCertificate = documents.some((doc: any) => doc.documentType === "businessRegistrationCertificate");

		if (isBusiness) {
    	if (hasDriverLicense) score += 2;
    	if (hasInsurance) score += 2;
    	if (hasBusinessCertificate) score += 1;
		} else {
    	if (hasDriverLicense) score += 3;
    	if (hasInsurance) score += 2;
		}
		setCredibilityScore(score);
	}

	useEffect(() => {
		fetchComplianceDocuments();
	}, [hirerId]);

	const hasDocument = (documentType: string) => {
		return savedDocuments.some(
			(doc: any) => doc.documentType === documentType
		);
	};

	return(
		<>
			<Text p={4} fontSize="xl" fontWeight="bold">Compliance Documents</Text>
			<VStack align="left">       
				<FormControl>
					<Checkbox isChecked={isBusiness} onChange={(e) => setIsBusiness(e.target.checked)}>
						Registering as a Business
					</Checkbox>
				</FormControl>
			{/*ABN and Business Registration Certificate*/}
			{isBusiness ? (
				<>
					<Box p={4} borderWidth="1px" borderRadius="md">
						<HStack>
							<FormControl maxW="350px">
								<FormLabel>
									ABN Number
								</FormLabel>
								<Input placeholder="No ABN on file" w={"fit-content"} maxLength={11} inputMode="numeric"
										isReadOnly={!isEditingABN} bg={!isEditingABN ? "gray.100" : "white"} value={abnNumber} onChange={(e) => setAbnNumber(e.target.value)}/>
							</FormControl>
							{!isEditingABN ? (
								<Button colorScheme="blue" onClick={() => setIsEditingABN(true)}>Edit</Button>
							): (
								<Button  colorScheme="green"
									onClick={async () => {
									await handleSaveABN();
									setIsEditingABN(false);
									}}>
									Save
								</Button>)}
						</HStack>
						{abnNumber && !isEditingABN && (
							<Text color="green.500" fontSize="sm">
							✓ ABN on file
							</Text>)}
							<HStack align={"center"} spacing={5} pt={4}>
								<FormControl maxW="360px"> 
									<FormLabel htmlFor="bRegoCertificate">
										Business Registration Certificate
									</FormLabel>
									<Input type="file" w={"fit-content"} accept=".pdf" display="none" id="rego-certificate"
										onChange={(e => {const file = e.target.files?.[0]; 
											if(!file) return;
											setBusinessRegoCerificate(file);}
										)}/>
									<Button as="label" htmlFor="rego-certificate" colorScheme={hasDocument("businessRegistrationCertificate") ? "green" : "blue"} w="fit-content">
										{hasDocument("businessRegistrationCertificate") ? "Re-upload Business Registration Certificate": "Upload Business Registration Certificate"}
									</Button>
									{businessRegoCertificate && (
										<Text color="green.500" fontSize="sm">
											Selected: {businessRegoCertificate.name}
										</Text>
									)}
									{hasDocument("businessRegistrationCertificate") && (
									<Text color="green.500" fontSize="sm">
									✓ Business Registration Certificate submitted
									</Text>
									)}
								</FormControl>
								<Button onClick={() => handleSaveDocument(businessRegoCertificate,"businessRegistrationCertificate")}>
									{hasDocument("businessRegistrationCertificate") ? "Update" : "Save"}
								</Button>
							</HStack>
					</Box>
				</> ) : null}
				{/*ABN and Business Registration Certificate End*/}

				{/*Credibility Score*/}

				{/*Drivers License*/}
				<Box p={4} borderWidth="1px" borderRadius="md">
					<HStack>
						<FormControl maxW="350px">
							<FormLabel>Drivers License</FormLabel>
							<Input type="file"  w={"fit-content"} accept=".jpg, .jpeg" display="none" id="drivers-license"
								onChange={(e => {const file = e.target.files?.[0]; 
								if(!file) return;
								setDriversLicense(file);}
								)}
							/>
							<Button as="label" colorScheme={hasDocument("driversLicense") ? "green" : "blue"} htmlFor="drivers-license">
								{hasDocument("driversLicense") ? "Re-upload Driver's License": "Upload Driver's License"}
							</Button>	
							{driversLicense && (
								<Text color="green.500" fontSize="sm">
									Selected: {driversLicense.name}
								</Text>
							)}
							{hasDocument("driversLicense") && (
								<Text color="green.500" fontSize="sm">
								✓ Drivers License submitted
								</Text>
							)}
						</FormControl>
						<Button onClick={() => handleSaveDocument(driversLicense,"driversLicense")}>
							{hasDocument("driversLicense") ? "Update" : "Save"}
						</Button>
					</HStack>
				</Box>
				{/*Drivers License End*/}
				{/*Public Liability Insurance*/}
				<Box p={4} borderWidth="1px" borderRadius="md">
					<HStack>
						<FormControl maxW="350px">
							<FormLabel>
								Public Liability Insurance
							</FormLabel>
							<Input type="file"  w={"fit-content"} accept=".pdf" display="none" id="liability-insurance"
								onChange={(e => {const file = e.target.files?.[0]; 
									if(!file) return;
									setPublicLiabilityInsurance(file);}
								)}
							/>
							<Button as="label" htmlFor="liability-insurance" colorScheme={hasDocument("publicLiabilityInsurance") ? "green" : "blue"} w="fit-content">
								{hasDocument("publicLiabilityInsurance") ? "Re-upload Public Liability Insurance": "Upload Public Liability Insurance"}
							</Button>
							{publicLiabilityInsurance && (
								<Text color="green.500" fontSize="sm">
									Selected: {publicLiabilityInsurance.name}
								</Text>
							)}
							{hasDocument("publicLiabilityInsurance") && (
								<Text color="green.500" fontSize="sm">
								✓ Public Liability Insurance
								</Text>
							)}
						</FormControl>
						<Button onClick={() => handleSaveDocument(publicLiabilityInsurance,"publicLiabilityInsurance")}>
							{hasDocument("publicLiabilityInsurance") ? "Update" : "Save"}
						</Button>
					</HStack>
				</Box>
				{/*Public Liability Insurance End*/}

				{/*Credibility Score*/}
				<Box p={4} borderWidth="1px" borderRadius="md">
					<HStack>
						<Text fontWeight="bold">
							Credibility Score: {credibilityScore}/5
						</Text>
						<Text fontSize="xl">
						{"⭐".repeat(credibilityScore)}
						{"☆".repeat(5 - credibilityScore)}
						</Text>
					</HStack>
				</Box>
				{/*Credibility Score End*/}		
			</VStack>
		</>
	);
}
