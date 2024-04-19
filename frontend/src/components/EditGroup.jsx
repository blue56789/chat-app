import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";
import socket from "../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditGroup({ setContent, setConvo, convo }) {
    const { token, username } = useAuthContext();
    const { dispatchConvos } = useConvoContext();

    const groupUsers = convo.users.filter((el) => el != username);
    const [name, setName] = useState(convo.name);
    const [delMembers, setDelMembers] = useState([]);
    const [error, setError] = useState(null);

    const editGroup = async () => {
        const response = await fetch('/api/group', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                delMembers, name, id: convo._id
            })
        });
        const json = await response.json();
        if (response.ok) {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: json } });
            setConvo(json);
            setContent('chat');
        } else
            setError(json.error);
    };

    const delGroup = async () => {
        const response = await fetch('/api/group', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: convo._id })
        });
        const json = await response.json();
        if (response.ok) {
            socket.emit('delConvo', json);
            dispatchConvos({ type: 'del', data: convo._id });
            setContent('convos');
        } else
            setError(json.error);
    };

    return (
        <>
            <div className="flex items-center border-b border-border-primary bg-bg-primary p-4 mb-2 md:min-w-[500px] justify-between">
                <button onClick={() => setContent('chat')}
                    className="button-icon"
                ><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title  text-center mx-4">Edit group</span>
                <div className="w-8"></div>
            </div>
            <div className="overflow-y-scroll h-full flex flex-col px-4 py-2 mb-4">
                <p>Edit Group Name:</p>
                <div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-input mb-2" />
                </div>
                <p className="pt-2">Remove Members:</p>
                <div className="h-full overflow-scroll px-2 pb-4 no-scrollbar">
                    {groupUsers.map(el =>
                        <label key={el}
                            className="has-[:checked]:text-txt-tertiary block border-b border-border-primary py-1 px-2 hover:bg-bg-primary transition-all hover:cursor-pointer"
                        >
                            <input type="checkbox" checked={delMembers.includes(el)} onChange={(e) => {
                                if (e.target.checked)
                                    setDelMembers(delMembers.concat(el))
                                else
                                    setDelMembers(delMembers.filter((user) => user != el));
                            }}
                                className='hidden' />
                            <span>{el}</span>
                        </label>
                    )}
                </div>
                <div>
                    <button onClick={() => setContent('addMembers')} className="block button-normal w-full my-2 ">Add Members</button>
                </div>
                <div className="flex">
                    <button onClick={editGroup} className="button-normal w-full mr-1 ">Save</button>
                    <button onClick={delGroup} className="button-normal w-full ml-1 ">Delete Group</button>
                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </>
    );
}