import { useEffect, useRef, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import Message from "./Message";
import socket from "../socket";
import useConvoContext from "../hooks/useConvoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <div className="flex justify-between items-center pb-2 border-b border-black">
                <button onClick={() => setContent('convos')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title mx-4">{name}</span>
                <span>
                    {convo.isGroupChat ? <>
                        <button onClick={() => setContent('groupInfo')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-info" /></button>
                        {username == convo.admin && <button onClick={() => setContent('editGroup')} className="button-icon ml-2"><FontAwesomeIcon icon="fa-solid fa-pen" /></button>}
                    </> :
                        <button onClick={delConvo} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-trash" /></button>}
                </span>
            </div>

            <div className="h-full min-h-72 md:min-w-[500px] overflow-scroll border-b border-black mb-4">
                {messages.length == 0 && <p>No messages</p>}
                {messages.map((el) => <Message key={el._id} msg={el} user={username} isGroup={convo.isGroupChat} />)}
                <div ref={msgRef}></div>
            </div>

            <div className="flex items-center justify-between">
                <textarea type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="text-input resize-none h-8 mr-2" />
                <button onClick={sendMessage} disabled={message == '' || loading} className="border border-black h-8 w-16 disabled:border-gray-500 disabled:text-gray-500 rounded-sm hover:bg-gray-300"><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
            </div>

            {error && <div className="error mt-2">{error}</div>}
        </>
    );
}