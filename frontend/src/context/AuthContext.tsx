import React, { createContext, useEffect, useState, ReactNode } from 'react';
import apiClient, {setAccessToken} from "@/libs/apiClient";

interface RegisterPayload {  // Data accepted by the registration endpoint
  email: string;
  password: string;
  username?: string;
}

interface LoginPayload {  // Data accepted by the login endpoint
  email: string;
  password: string;
}

interface User{  // Define the structure of the User object
    email: string;
    username: string;
    completed_kyc?: boolean;
}
export interface AuthContextType {   // Define the structure of the AuthContext
    user: User | null; 
    loading: boolean;
    isLoggedIn: boolean;
    completedKyc: boolean;
    register: (payload: RegisterPayload) => Promise<void>;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
}

interface Props {  // Define the structure of the Props for the AuthProvider
    children: ReactNode;  //this will rapp the entire app and provide the context to all components
}

export const AuthContext = createContext<AuthContextType>({  // Create the AuthContext with default values
    user: null,
    loading: true,
    isLoggedIn: false,
    completedKyc: false,
    register: async () => {},  //
    login: async () => {},
    logout: async () => {},
});
//the provider component 
export const AuthProvider: React.FC<Props> = ({ children }) => {   
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {  //this will run when the component mounts, it will check if the user is logged in and fetch the user data
        const initializeAuth = async () => {
            try {
                const { data } = await apiClient.post<{ access: string }>("user/auth/token/refresh/");
                setAccessToken(data.access);  //set the access token in the apiClient

                const userReponse = await apiClient.get<User>("user/profile/"); //fetch the user profile data
                setUser(userReponse?.data); 
            } catch {
                setUser(null); //if there is an error, set the user to null
                setAccessToken(null); //remove the access token from the apiClient
            } finally {
                setLoading(false);  //set loading to false after the request is completed
            }
        };

        initializeAuth();
    }, []);  //the []- (empty dependency array) means this effect will only run once when the component mounts
    //helper function to fetch the current user data
    const fetchCurrentUser = async () => {
        const res = await apiClient.get<User>("user/profile/");
        setUser(res.data);
    };
    //function to register a new user
    const register = async (payload: RegisterPayload) => {
        const { data } = await apiClient.post<{ access: string }>("user/auth/register/", payload);
        setAccessToken(data.access);
        await fetchCurrentUser();
    };
     
    const login = async (payload: LoginPayload) => {
        const { data } = await apiClient.post<{ access: string }>("user/auth/login/", payload);
        setAccessToken(data.access);
        await fetchCurrentUser();
    };

    const logout = async () => {
        try {
            await apiClient.post("user/auth/logout/");
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    const isLoggedIn = !!user;
    const completedKyc = user?.completed_kyc ? true : false;

    return <AuthContext.Provider value={{ user, loading, isLoggedIn, completedKyc, register, login, logout }}>{children}</AuthContext.Provider>;
};
