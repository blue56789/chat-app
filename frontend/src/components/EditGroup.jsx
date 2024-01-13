import { useState } from "react";
import Search from "./Search";
import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";
import socket from "../socket";

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
            <div className="title">
                <button onClick={() => {
                    add ? setAdd(false) : setContent('chat');
                }}>Back</button>
                {add ? <h1>Add Members</h1> : <h1>Edit Group</h1>}
            </div>
            <div style={{ overflow: 'scroll' }}>
                {add ?
                    <>
                        <br />
                        <div id="groupUsers">
                            {addUsers.map((el) => <span key={el} onClick={() => {
                                const users = addUsers.filter((user) => user != el);
                                setAddUsers(users);
                            }}>{el}</span>)}
                        </div> <br />
                        <Search onClick={(user) => {
                            if (!addUsers.includes(user.username))
                                setAddUsers([...addUsers, user.username]);
                        }} />
                        <br />
                    </> :
                    <>
                        <br />
                        <p>Edit Group Name:</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 100 + '%' }} /><br /><br />
                        <p>Remove Members:</p>
                        <div className="users">
                            {groupUsers.map(el => <div key={el}>
                                <input type="checkbox" id={`check-${el}`} onChange={(e) => {
                                    if (e.target.checked)
                                        setDelUsers(delUsers.concat(el))
                                    else
                                        setDelUsers(delUsers.filter((user) => user != el));
                                }} />
                                <label htmlFor={`check-${el}`} className="convo del" >
                                    <p>{el}</p>
                                </label>
                            </div>)}
                        </div><br />
                        <div className="tab">
                            <button onClick={() => setAdd(true)}>Add Members</button>
                        </div><br />
                    </>}
                <div className="tab">
                    {!add && <>
                        <button style={{ marginRight: 5 + 'px' }} onClick={editGroup}>Save</button>
                        <button onClick={delGroup}>Delete Group</button>
                    </>}
                </div><br />
                {error && <div className="error">{error}</div>}
            </div>
        </>
    );
}