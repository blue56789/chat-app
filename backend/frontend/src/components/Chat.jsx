import { useEffect, useRef, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import Message from "./Message";
import socket from "../socket";
import useConvoContext from "../hooks/useConvoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Chat({ convo, setContent }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const { username, token } = useAuthContext();
    const { dispatchConvos } = useConvoContext();
    const msgRef = useRef(null);
    const inputRef = useRef(null);
    const name = convo.isGroupChat ? convo.name : (convo.users[0] == username ? convo.users[1] : convo.users[0])

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        const newMessage = (msg) => {
            if (msg.conversation === convo._id)
                setMessages(messages => [...messages, msg]);
        };
        socket.on('messageRecieved', newMessage);
        return () => {
            socket.off('messageRecieved', newMessage);
        }
    }, [convo]);

    useEffect(() => {
        const input = inputRef.current;
        input.style.height = '32px';
        input.style.height = `${Math.min(input.scrollHeight, 96)}px`;
    }, [message]);

    useEffect(() => {
        msgRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/msg/${convo._id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const json = await response.json();
            if (response.ok) setMessages(json);
            else setError(json.error);
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
    };

    return (
        <>
            <div className="flex justify-between items-center pb-2 border-b border-border-primary px-4 py-2">
                <button onClick={() => setContent('convos')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title mx-4">{name}</span>
                <span>
                    {convo.isGroupChat ? <>
                        <button onClick={() => setContent('groupInfo')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-info" /></button>
                        {username == convo.admin && <button onClick={() => setContent('editGroup')} className="button-icon ml-2 "><FontAwesomeIcon icon="fa-solid fa-pen" /></button>}
                    </> :
                        <button onClick={delConvo} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-trash" /></button>}
                </span>
            </div>

            <div className="md:min-w-[500px] flex-grow overflow-scroll border-b border-border-primary px-4">
                {messages.length == 0 && <p>No messages</p>}
                {messages.map((el) => <Message key={el._id} msg={el} user={username} isGroup={convo.isGroupChat} />)}
                <div ref={msgRef}></div>
            </div>

            <div className="flex items-center justify-between p-4">
                <textarea autoFocus ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="text-input resize-none mr-2 no-scrollbar" />
                <button onClick={sendMessage} disabled={message.match(/^\s*$/) || loading} className="button-normal w-16 h-8 disabled:text-txt-tertiary"><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
            </div>

            {error && <div className="error mt-2">{error}</div>}
        </>
    );
}