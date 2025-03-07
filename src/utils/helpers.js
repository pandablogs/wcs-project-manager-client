import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
    const token = localStorage.getItem("_token");

    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        return decoded.exp > currentTime; // Token is valid if it hasn't expired
    } catch (error) {
        return false; // Invalid token
    }
};
