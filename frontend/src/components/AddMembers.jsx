import { useState } from "react";
import Search from "./Search";
import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddMembers({ setContent, setConvo, convo }) {
    const [newMembers, setNewMembers] = useState([]);
    const [error, setError] = useState(null);

    const { token } = useAuthContext();
    const { dispatchConvos } = useConvoContext();

    const addMembers = async () => {
        const response = await fetch('/api/group/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newMembers, id: convo._id })
        });
        const json = await response.json();
        if (response.ok) {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: json } });
            setConvo(json);
            setContent('chat');
        } else
            setError(json.error);
    };

    return (
        <>
            <div className="flex items-center bg-bg-primary border-b border-border-primary p-4 mb-2 md:min-w-[500px] justify-between">
                <button onClick={() => setContent('editGroup')}
                    className="button-icon"
                ><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title  text-center mx-4">Add Members</span>
                <div className="w-8"></div>
            </div>
            <div className="flex flex-col grow overflow-x-hidden overflow-y-scroll px-4 py-2">
                {newMembers.length > 0 && <>
                    <p>New Members:</p>
                    <div className="mb-4 flex flex-wrap">
                        {newMembers.map((el) => <span key={el} onClick={() => {
                            const users = newMembers.filter((user) => user != el);
                            setNewMembers(users);
                        }} className="border border-border-primary rounded hover:bg-bg-tertiary cursor-pointer px-1.5 py-0.5 m-0.5"
                        >{el}</span>)}
                    </div>
                </>}
                <Search onClick={(user) => {
                    if (!newMembers.includes(user.username))
                        setNewMembers([...newMembers, user.username]);
                }} />
            </div>
            <div className="p-4">
                <button className="w-full button-normal" onClick={addMembers}>Save</button>
            </div>

            {error && <div className="error">{error}</div>}
        </>
    );
}