import React, { createContext, useState, useEffect } from 'react';
import {getAuth} from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    // Check the user's authentication status on mount
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("set auth user",user)
            setUser(user);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
