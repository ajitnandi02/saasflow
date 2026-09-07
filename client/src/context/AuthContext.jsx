import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";


// ==========================================
// CREATE AUTH CONTEXT
// ==========================================

const AuthContext = createContext();


// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);


    // ======================================
    // LOAD SAVED AUTH DATA
    // ======================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const savedUser =
            localStorage.getItem("user");

        const savedOrganization =
            localStorage.getItem("organization");


        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }

        if (token && savedOrganization) {
            setOrganization(
                JSON.parse(savedOrganization)
            );
        }

        setLoading(false);

    }, []);


    // ======================================
    // LOGIN
    // ======================================

    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password,
            }
        );

        const {
            token,
            user,
            organization,
        } = response.data;


        // Save authentication data
        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "organization",
            JSON.stringify(organization)
        );


        // Update React state
        setUser(user);
        setOrganization(organization);


        return response.data;
    };


    // ======================================
    // LOGOUT
    // ======================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organization");

        setUser(null);
        setOrganization(null);
    };


    // ======================================
    // AUTH CONTEXT VALUE
    // ======================================

    const value = {
        user,
        organization,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};