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
            <div className="flex items-center border-b border-black pb-2 mb-2 md:min-w-[500px] justify-between">
                <button onClick={() => {
                    add ? setAdd(false) : setContent('chat');
                }}
                    className="button-icon"
                ><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title  text-center mx-4">{add ? 'Add Members' : 'Edit group'}</span>
                <div className="w-7"></div>
            </div>
            <div className="overflow-scroll h-full flex flex-col p-0.5">
                {add ?
                    <>
                        <div className="mb-1 flex flex-wrap">
                            {addUsers.map((el) => <span key={el} onClick={() => {
                                const users = addUsers.filter((user) => user != el);
                                setAddUsers(users);
                            }} className="border border-black rounded hover:bg-gray-300 cursor-pointer px-1 py-0.5 m-0.5"
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
                        <p>Remove Members:</p>
                        <div className="h-full overflow-scroll px-2 pb-4 no-scrollbar">
                            {groupUsers.map(el =>
                                <label key={el}
                                    className="block border-b py-1 hover:shadow-md transition-all hover:cursor-pointer"
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
                        <button onClick={() => setAdd(true)} className="block button-normal w-full mb-2 ">Add Members</button>
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