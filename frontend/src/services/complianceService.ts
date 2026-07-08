import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const complianceService = {
    uploadDocument: async(
        hirerId: number, 
        documentType: string, 
        fileUrl: string,
        ): Promise<any> => {
            const { data } = await axios.post(
                `${API_BASE_URL}/compliance/${hirerId}`,
                {
                    documentType,
                    fileUrl,
                }
            );
            return data;
    },

    getDocuments: async(hirerId: number): Promise<any> => {
        const { data } = await axios.get(
            `${API_BASE_URL}/compliance/${hirerId}`,
        );
        return data;
    },
};