import { useState } from "react";
import useAuthContext from "./useAuthContext";
import useConvoContext from "./useConvoContext";

export default function useCreateCovo() {
    const [error, setError] = useState();
    const { token } = useAuthContext();
    const { dispatchConvos } = useConvoContext();
    const createConvo = async (isGroup, body, setSuccess) => {
        setError(null);
        const response = await fetch(`/api/${isGroup ? 'group' : 'convos'}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        if (response.ok) {
            dispatchConvos({ type: 'add', data: json });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(json.error);
            setTimeout(() => setError(false), 3000);
        }
        // console.log(json);
    }
    return { createConvo, error }
}