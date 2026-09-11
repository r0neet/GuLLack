import React, { createContext, useEffect, useState, ReactNode } from 'react';
import apiClient, {setAccessToken} from "@/libs/apiClient";

import { User } from "@/types/api";

interface AuthPayload {  // Define the structure of the payload for authentication
  email: string;
  password: string;
  username: string;
}

interface User{  // Define the structure of the User object
    email: string;
    fullname: string;
}
interface AuthContextType {   // Define the structure of the AuthContext
    user: User | null; 
    loading: boolean;
    isLoggedIn: boolean;
    completedKyc: boolean;
    register: (payload: AuthPayload) => Promise<void>;
    login: (payload: AuthPayload) => Promise<void>;
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
            } catch (error) {
                setUser(null); //if there is an error, set the user to null
                setAccessToken(null); //remove the access token from the apiClient
                console.log(error);
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
    const register = async (payload: AuthPayload) => {
        try {
            const { data } = await apiClient.post<{ access: string }>("user/auth/register/", payload);
            setAccessToken(data.access);
            await fetchCurrentUser();
        } catch (error) {
            throw error;
        }
    };
     
    const login = async (payload: AuthPayload) => {
        try {
            const { data } = await apiClient.post<{ access: string }>("user/auth/login/", payload);
            setAccessToken(data.access);
            await fetchCurrentUser();
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post("user/auth/logout/");
        } catch (error) {
            throw error;
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    let isLoggedIn = !!user;
    let completedKyc = user?.completed_kyc ? true : false;

    return <AuthContext.Provider value={{ user, loading, isLoggedIn, completedKyc, register, login, logout }}>{children}</AuthContext.Provider>;
};
