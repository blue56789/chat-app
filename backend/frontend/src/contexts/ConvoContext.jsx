import { createContext, useEffect, useReducer, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

export const ConvoContext = createContext();

function reducer(convos, action) {
    switch (action.type) {
        case 'add':
            return [...convos, action.data];
        case 'set':
            return action.data;
        case 'del':
            // console.log('del');
            return convos.filter((convo) => convo._id != action.data);
        case 'update': {
            // console.log('update', action.data.convo);
            let found = false;
            const newConvos = convos.map(el => {
                if (el._id == action.data.id) {
                    found = true;
                    return action.data.convo;
                }
                return el;
            });
            if (!found)
                return [...convos, action.data.convo];
            return newConvos;
        }
        default:
            return convos;
    }
}

export const ConvoContextProvider = ({ children }) => {
    const [convos, dispatchConvos] = useReducer(reducer, []);
    const [error, setError] = useState(null);
    const { token } = useAuthContext();

    useEffect(() => {
        setError(null);
        token && (async () => {
            const response = await fetch('/api/convos', { headers: { 'Authorization': `Bearer ${token}` } });
            const json = await response.json();
            // console.log(json);
            if (response.ok)
                dispatchConvos({ type: 'set', data: json });
            else {
                setError(json.error);
                setTimeout(() => setError(false), 3000);
            }
        })();
    }, [token]);

    return (
        <ConvoContext.Provider value={{ convos, error, dispatchConvos }}>
            {children}
        </ConvoContext.Provider>
    );
};