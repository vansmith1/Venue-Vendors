import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const userService = {
    login: async (email: string, password: string): Promise<any> => {
        const { data } = await axios.post(
            `${API_BASE_URL}/login`,
            { email, password }
        );
        return data;
    }, 

    updateProfile: async (id: number, userData: any): Promise<any> => {
        const { data } = await axios.put(
            `${API_BASE_URL}/profile/${id}`,
            userData
        );
        return data;
    },

    updateProfileImage: async(id: number, profileImageURL: string): Promise<any> =>{
        const { data } = await axios.put(
            `${API_BASE_URL}/profile/${id}/avatar`,
            { profileImageURL }
        );
        return data;
    },

    signup: async (email: string, password1: string, password2: string, role: string): Promise<any> => {
        const { data } = await axios.post(
            `${API_BASE_URL}/signup`,
            {
                email, password1, password2, role
            }
        );
        return data;
    },

    getUser: async(email: string) => {`${API_BASE_URL}/profile/${email}`
        const { data } = await axios.get(
            `${API_BASE_URL}/profile/${email}`
        );
        return data;
    },

    logOutUser: () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("email");
        localStorage.removeItem("user");
    },

    getUserById: async(id: number) => {
        const { data } = await axios.get(
            `${API_BASE_URL}/user/${id}`
        );
        return data;
    },
    
    getUsers: async () => {
        const { data } = await axios.get(
            `${API_BASE_URL}/users`
        );
        return data;
    },
};