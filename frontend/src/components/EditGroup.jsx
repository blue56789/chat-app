import { useState } from "react";
import Search from "./Search";
import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";
import socket from "../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditGroup({ setContent, convo }) {
    const { token, username } = useAuthContext();
    const { dispatchConvos } = useConvoContext();

    const groupUsers = convo.users.filter((el) => el != username);
    const [name, setName] = useState(convo.name);
    const [addUsers, setAddUsers] = useState([]);
    const [delUsers, setDelUsers] = useState([]);
    const [add, setAdd] = useState(false);
    const [error, setError] = useState(null);

    const editGroup = async () => {
        const response = await fetch('/api/group', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                addUsers, delUsers, name, id: convo._id
            })
        });
        const json = await response.json();
        if (response.ok) {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: json } });
            setContent('convos');
        } else
            setError(json.error);
        console.log(json);
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
        console.log(json);
    };

    return (
        <>
            <div className="flex items-center border-b border-border-primary py-2 px-4 mb-2 md:min-w-[500px] justify-between">
                <button onClick={() => {
                    add ? setAdd(false) : setContent('chat');
                }}
                    className="button-icon"
                ><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title  text-center mx-4">{add ? 'Add Members' : 'Edit group'}</span>
                <div className="w-8"></div>
            </div>
            <div className="overflow-scroll h-full flex flex-col px-4 py-2 mb-4">
                {add ?
                    <>
                        <div className="mb-1 flex flex-wrap">
                            {addUsers.map((el) => <span key={el} onClick={() => {
                                const users = addUsers.filter((user) => user != el);
                                setAddUsers(users);
                            }} className="border border-border-primary rounded hover:bg-bg-tertiary cursor-pointer px-1.5 py-0.5 m-0.5"
                            >{el}</span>)}
                        </div>
                        <Search onClick={(user) => {
                            if (!addUsers.includes(user.username))
                                setAddUsers([...addUsers, user.username]);
                        }} />
                    </> :
                    <>
                        <p>Edit Group Name:</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-input mb-2" />
                        <p className="pt-2">Remove Members:</p>
                        <div className="h-full overflow-scroll px-2 pb-4 no-scrollbar">
                            {groupUsers.map(el =>
                                <label key={el}
                                    className="block border-b border-border-primary py-1 px-2 hover:bg-bg-secondary transition-all hover:cursor-pointer"
                                >
                                    <input type="checkbox" onChange={(e) => {
                                        if (e.target.checked)
                                            setDelUsers(delUsers.concat(el))
                                        else
                                            setDelUsers(delUsers.filter((user) => user != el));
                                    }}
                                        className='mr-2' />
                                    <span>{el}</span>
                                </label>
                            )}
                        </div>
                        <button onClick={() => setAdd(true)} className="block button-normal w-full my-2 ">Add Members</button>
                    </>}
                <div className="flex">
                    {!add && <>
                        <button onClick={editGroup} className="button-normal w-full mr-1 ">Save</button>
                        <button onClick={delGroup} className="button-normal w-full ml-1 ">Delete Group</button>
                    </>}
                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </>
    );
}