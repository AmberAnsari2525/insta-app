import React, { createContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken, removeToken } from '../Services/Auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log('Token has expired');
                    removeToken(); // Optionally remove expired token
                } else {
                    setUser(decodedToken);
                }
            } catch (error) {
                console.error('Invalid token');
                removeToken(); // Handle invalid token
            }
        }
    }, []);

    const signup = (token) => {
        setToken(token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        navigate('/home');
    };

    const login = (token) => {
        setToken(token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        return true; // Indicate successful login
    };

    const logout = () => {
        setUser(null);
        removeToken();
        navigate('/log-in');
    };

    const requireAuth = (Component) => {
        return user ? <Component /> : <Navigate to="/log-in" />;
    };

    const preventAuthAccess = (Component) => {
        return user ? <Navigate to="/home" /> : <Component />;
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, requireAuth, preventAuthAccess }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
export default AuthContext;
