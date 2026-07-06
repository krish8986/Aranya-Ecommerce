import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    // Default axios header
    axios.defaults.headers.common["Authorization"] = auth?.token;

    // Auto refresh token function

    const refreshAccessToken = async () => {
        try {
            // Sirf tab refresh karo jab user logged in ho
            const storedAuth = localStorage.getItem("auth");
            if (!storedAuth) return;

            const parsedAuth = JSON.parse(storedAuth);
            if (!parsedAuth?.token) return;

            const { data } = await axios.post(
                "/api/v1/auth/refresh-token",
                {},
                { withCredentials: true }
            );

            if (data.success) {
                const updatedAuth = { ...parsedAuth, token: data.token };
                localStorage.setItem("auth", JSON.stringify(updatedAuth));
                setAuth((prev) => ({ ...prev, token: data.token }));
                console.log("Access token refreshed!");
            }
        } catch (error) {
            console.log("Token expired — logging out");
            setAuth({ user: null, token: "" });
            localStorage.removeItem("auth");
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        // Load auth from localStorage on startup
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token,
            });
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        // Auto refresh every 14 minutes (access token = 15 min)
        if (auth?.token) {
            const interval = setInterval(() => {
                refreshAccessToken();
            }, 14 * 60 * 1000); // 14 minutes

            return () => clearInterval(interval);
        }
    }, [auth?.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };