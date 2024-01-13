import { useEffect, useRef, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import Message from "./Message";
import socket from "../socket";
import useConvoContext from "../hooks/useConvoContext";

export default function Chat({ convo, name, setContent }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const { username, token } = useAuthContext();
    const { dispatchConvos } = useConvoContext();
    const msgRef = useRef(null);

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        const addMessage = (msg) => {
            // console.log('recieved');
            if (msg.conversation === convo._id)
                setMessages(messages => [...messages, msg]);
        };
        socket.on('messageRecieved', addMessage);
        return () => {
            socket.off('messageRecieved', addMessage);
        }
    }, [convo]);

    useEffect(() => {
        msgRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/msg/${convo._id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const json = await response.json();
            // console.log(json);
            if (response.ok)
                setMessages(json);
            else
                setError(json.error);
        })();
    }, [convo, token]);

    const sendMessage = async () => {
        setLoading(true);
        const response = await fetch('/api/msg', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                convo: convo._id,
                user: username,
                msg: message.trim()
            })
        });
        const msg = await response.json();
        if (response.ok) {
            socket.emit('newMessage', msg, convo);
            setMessages([...messages, msg]);
            setMessage('');
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: { ...convo, lastMessage: msg } } })
        } else
            setError(msg.error);
        setLoading(false);
        // console.log(msg);
    };

    const delConvo = async () => {
        const response = await fetch('/api/convos', {
            method: 'DELETE',
            headers,
            body: JSON.stringify({
                id: convo._id
            })
        });
        const json = await response.json();
        if (response.ok) {
            socket.emit('delConvo', json);
            dispatchConvos({ type: 'del', data: json._id });
            setContent('convos')
        } else
            setError(json.error);
        // console.log(json);
    };

    return (
        <>
            <div id="chat" className="title">
                <button onClick={() => setContent('convos')}>Back</button>
                <h1>{name}</h1>
                {convo.isGroupChat ? <>
                    <button style={{ marginRight: 10 + 'px' }} onClick={() => setContent('groupInfo')}>View</button>
                    {username == convo.admin && <button onClick={() => setContent('editGroup')}>Edit</button>}
                </> :
                    <button onClick={delConvo}>Delete</button>}
            </div>

            <div id="messages">
                {messages.length == 0 && <p>No messages</p>}
                {messages.map((el) => <Message key={el._id} msg={el} user={username} isGroup={convo.isGroupChat} />)}
                <div ref={msgRef}></div>
            </div>

            <div id="send">
                <textarea type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage} disabled={message == '' || loading}>Send</button>
            </div>

            {error && <div className="error" style={{ marginTop: 10 + 'px' }}>{error}</div>}
        </>
    );
}