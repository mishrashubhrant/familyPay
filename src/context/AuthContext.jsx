import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, currentView }) => {
    // Change user based on current view
    const user = currentView === 'primary' ? mockUsers.primary : mockUsers.secondary1;
    const [loading] = useState(false);

    const logout = () => {
        window.location.reload();
    };

    const value = {
        user,
        loading,
        error: null,
        logout,
        isAuthenticated: true,
        isPrimary: currentView === 'primary',
        isSecondary: currentView === 'secondary'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
