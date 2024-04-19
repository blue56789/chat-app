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
            <div className="flex justify-between items-center p-4 bg-bg-primary border-b border-border-primary ">
                <div>
                    <button onClick={() => setContent('convos')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                </div>
                <div className="title">Add New</div>
                <div className="size-8 sm:size-0"></div>
            </div>
            <div className="flex flex-col h-full overflow-scroll no-scrollbar">

                <div className="flex p-4">
                    <button onClick={() => {
                        setAdd(true);
                    }}
                        className={'h-8 w-full border transition rounded-2xl cursor-pointer bg-bg-tertiary hover:border-txt-primary hover:text-txt-primary mr-1 ' + (add ? 'bg-btn-bg-hover text-btn-txt-hover' : 'border-neutral-500 text-neutral-500')}>
                        Contact
                    </button>
                    <button onClick={() => {
                        setAdd(false);
                    }}
                        className={'h-8 w-full border transition rounded-2xl cursor-pointer bg-bg-tertiary hover:border-txt-primary hover:text-txt-primary ml-1 ' + (add ? 'border-neutral-500 text-neutral-500' : 'bg-btn-bg-hover text-btn-txt-hover')}>
                        Group
                    </button>
                </div>

                <div className="flex flex-col mx-4 my-2 h-full">
                    {add ?
                        <Search onClick={addConvo} /> :
                        <>
                            <p>Group Name:</p>
                            <div>
                                <input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName} className="text-input mb-4" placeholder="Enter group name" />
                            </div>
                            {groupUsers.length > 0 && <>
                                <p>Group Members:</p>
                                <div className="mb-4 flex flex-wrap">
                                    {groupUsers.map((el) =>
                                        <div key={el} onClick={() => {
                                            const users = groupUsers.filter((user) => user != el);
                                            setGroupUsers(users);
                                        }}
                                            className="border border-border-primary rounded-2xl hover:bg-btn-bg-hover hover:text-btn-txt-hover transition-all cursor-pointer px-2 py-0.5 m-0.5">
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