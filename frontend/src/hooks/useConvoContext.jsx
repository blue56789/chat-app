import { useContext } from "react";
import { ConvoContext } from "../contexts/ConvoContext";

export default function useConvoContext() {
    const context = useContext(ConvoContext);
    if (!context)
        throw new Error('Ccant use context');
    return context;
}