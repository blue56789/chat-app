import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

function authReducer(auth, action) {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return action.payload;
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { username: null, token: null };
        default:
            return auth;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [auth, dispatch] = useReducer(authReducer, { username: null, token: null });

    useEffect(() => {
        const user = localStorage.getItem('user');
        // console.log(user);
        if (user)
            dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
        // console.log('hi');
    }, []);

    return (
        <AuthContext.Provider value={{ ...auth, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};