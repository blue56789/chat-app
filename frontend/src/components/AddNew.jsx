import { useState } from "react";
import Search from "./Search";
import useCreateCovo from "../hooks/useCreateConvo";

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
            <div style={{ marginBottom: 10 + 'px' }}>
                <button onClick={() => setContent('convos')} style={{ marginRight: 5 + 'px' }}>Back</button>
            </div>
            <div className="tab">
                <button onClick={() => {
                    setAdd(true);
                }}
                    className={add ? '' : 'not-selected'}
                    style={{ marginRight: 5 + 'px' }}>
                    New Contact
                </button>
                <button onClick={() => {
                    setAdd(false);
                }}
                    className={add ? 'not-selected' : ''}
                    style={{ marginLeft: 5 + 'px' }} >
                    New Group
                </button>
            </div>

            <>
                {add ?
                    <Search onClick={addConvo} /> :
                    <>
                        <label htmlFor="groupName">Enter Group Name:</label>
                        <input id="groupName" type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName} />
                        <br />
                        {groupUsers.length > 0 && <>
                            <div id="groupUsers">
                                {groupUsers.map((el) => <span key={el} onClick={() => {
                                    const users = groupUsers.filter((user) => user != el);
                                    setGroupUsers(users);
                                }}>{el}</span>)}
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

            <div className="tab">
                {!add && <button onClick={createGroup} style={{ marginLeft: 5 + 'px' }}>Create Group</button>}
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">
                {add ? 'User added' : 'Group created'}
            </div>}
        </>
    );
}