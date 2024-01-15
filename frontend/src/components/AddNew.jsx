import { useState } from "react";
import Search from "./Search";
import useCreateCovo from "../hooks/useCreateConvo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddNew({ setContent }) {
    const { createConvo, error } = useCreateCovo();

    const [add, setAdd] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([]);
    const [success, setSuccess] = useState(false);

    const addConvo = async (user) => {
        await createConvo(false, { user: user.username }, setSuccess);
    };

    const createGroup = async () => {
        await createConvo(true, { users: groupUsers, name: groupName }, setSuccess);
        setGroupName('');
        setGroupUsers([]);
    }

    return (
        <>
            <div className="mb-2">
                <button onClick={() => setContent('convos')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
            </div>
            <div className="flex mb-2">
                <button onClick={() => {
                    setAdd(true);
                }}
                    className={'border px-2 py-1 rounded-sm w-full mr-1 ' + (add ? 'border-black' : 'border-gray-500 text-gray-500')}>
                    New Contact
                </button>
                <button onClick={() => {
                    setAdd(false);
                }}
                    className={'border px-2 py-1 rounded-sm w-full ml-1 ' + (add ? 'border-gray-500 text-gray-500' : 'border-black')}>
                    New Group
                </button>
            </div>

            <>
                {add ?
                    <Search onClick={addConvo} /> :
                    <>
                        <p>Group Name:</p>
                        <input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName} className="text-input mb-2" />
                        {groupUsers.length > 0 && <>
                            <div className="mb-1 flex flex-wrap">
                                {groupUsers.map((el) =>
                                    <div key={el} onClick={() => {
                                        const users = groupUsers.filter((user) => user != el);
                                        setGroupUsers(users);
                                    }}
                                        className="border border-black rounded-sm hover:bg-gray-300 cursor-pointer px-1 py-0.5 m-0.5">
                                        {el}
                                    </div>)}
                            </div> <br />
                        </>}
                        <p>Add Members:</p>
                        <Search onClick={(user) => {
                            if (!groupUsers.includes(user.username))
                                setGroupUsers([...groupUsers, user.username]);
                        }} />
                    </>
                }
            </>

            <div className="mb-2">
                {!add && <button onClick={createGroup} className="button-normal w-full">Create Group</button>}
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">
                {add ? 'User added' : 'Group created'}
            </div>}
        </>
    );
}