import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('cant use context');
    return context;
}

export default useAuthContext;