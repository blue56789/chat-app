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
            <div className="p-4 border-b border-border-primary">
                <button onClick={() => setContent('convos')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
            </div>
            <div className="flex p-4">
                <button onClick={() => {
                    setAdd(true);
                }}
                    className={'h-8 w-full border transition rounded cursor-pointer hover:bg-bg-tertiary mr-1 ' + (add ? 'border-txt-primary' : 'border-txt-tertiary text-txt-tertiary')}>
                    New Contact
                </button>
                <button onClick={() => {
                    setAdd(false);
                }}
                    className={'h-8 w-full border transition rounded cursor-pointer hover:bg-bg-tertiary ml-1 ' + (add ? 'border-txt-tertiary text-txt-tertiary' : 'border-txt-primary')}>
                    New Group
                </button>
            </div>

            <div className="flex flex-col mx-4 my-2 h-full overflow-hidden">
                {add ?
                    <Search onClick={addConvo} /> :
                    <>
                        <p>Group Name:</p>
                        <div>
                            <input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName} className="text-input mb-4" />
                        </div>
                        {groupUsers.length > 0 && <>
                            <p>Group Members:</p>
                            <div className="mb-4 flex flex-wrap">
                                {groupUsers.map((el) =>
                                    <div key={el} onClick={() => {
                                        const users = groupUsers.filter((user) => user != el);
                                        setGroupUsers(users);
                                    }}
                                        className="border border-border-primary rounded hover:bg-bg-tertiary cursor-pointer px-1.5 py-0.5 m-0.5">
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
            </div>

            <div className="mb-4 mt-2 px-4">
                {!add && <button onClick={createGroup} className="button-normal w-full">Create Group</button>}
            </div>
            {error && <div className="error mx-4 mb-4">{error}</div>}
            {success && <div className="success mx-4 mb-4">
                {add ? 'User added' : 'Group created'}
            </div>}
        </>
    );
}