import { createContext, useContext } from 'react';
import type { UserContextTypes } from '../types';

export const AuthContext = createContext<UserContextTypes | undefined>(
    undefined
);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
