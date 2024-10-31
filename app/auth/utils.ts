import wretch from "wretch";
import Cookies from "js-cookie";


const api = wretch("http://localhost:8000").accept("application/json");

const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
};

const getToken = (type: string) => {
    return Cookies.get(type + "Token");
};

const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};

const register = (email: string, username: string, password: string) => {
    return api.post({ email, username, password }, "/auth/users/");
};

const login = (username: string, password: string) => {
    return api.post({ username: username, password }, "/auth/jwt/create/")
};

const logout = () => {
    const refreshToken = getToken("refresh");
    return api.post({ refresh: refreshToken }, "/auth/logout/");
};

const handleJWTRefresh = () => {
    const refreshToken = getToken("refresh");
    return api.post({ refresh: refreshToken }, "auth/jwt/refresh");
};


export const AuthActions = () => {
    return {
        login,
        logout,
        register,
        getToken,
        storeToken,
        removeTokens,
        handleJWTRefresh,
    }
};