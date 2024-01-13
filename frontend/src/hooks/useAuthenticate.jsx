import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

const useAuthenticate = () => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const authenticate = async (username, password, method) => {
        setLoading(true);
        setError(null);

        const response = await fetch(`/user/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const json = await response.json();

        if (response.ok) {
            const user = {
                username,
                token: json.token
            }
            dispatch({ type: 'LOGIN', payload: user });
        } else {
            setError(json.error);
            setTimeout(() => setError(false), 5000);
        }

        setLoading(false);
    };
    return { isLoading, error, authenticate };
};
export default useAuthenticate;