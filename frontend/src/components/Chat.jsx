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
        setError(false);
    }, [message]);

    useEffect(() => {
        msgRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        setLoading(true);
        setMessages([]);
        (async () => {
            const response = await fetch(`/api/msg/${convo._id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const json = await response.json();
            if (response.ok) setMessages(json);
            else setError(json.error);
            setLoading(false);
        })();
    }, [convo, token]);

    useEffect(() => {
        if (error)
            setTimeout(() => setError(null), 3000);
    }, [error])

    const sendMessage = async (isDocument, message) => {
        setLoading(true);
        const response = await fetch('/api/msg', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                convo: convo._id,
                isDocument,
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

    const sendFile = (e) => {
        const file = e.target.files[0];
        if (file.size > 15000000) {
            setError('File must be smaller than 15MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            sendMessage(true, reader.result);
        };
        reader.readAsDataURL(file);
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
            <div className="flex justify-between items-center border-b border-border-primary p-4">
                <button onClick={() => setContent('convos')} className="button-icon sm:hidden"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title mx-4">{name}</span>
                <span>
                    {convo.isGroupChat ? <>
                        <button onClick={() => setContent('groupInfo')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-info" /></button>
                        {username == convo.admin && <button onClick={() => setContent('editGroup')} className="button-icon ml-2 "><FontAwesomeIcon icon="fa-solid fa-pen" /></button>}
                    </> :
                        <button onClick={delConvo} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-trash" /></button>}
                </span>
            </div>

            <div className=" flex-grow overflow-x-hidden overflow-y-scroll border-b border-border-primary px-4">
                {messages.length == 0 && (loading ? <p>Loading...</p> : <p>No messages</p>)}
                {messages.map((el) => <Message key={el._id} msg={el} user={username} />)}
                <div ref={msgRef}></div>
            </div>

            <div className="flex items-center justify-between p-4">
                <div>
                    <label className="flex justify-center items-center button-icon has-[:disabled]:text-txt-tertiary has-[:disabled]:cursor-default has-[:enabled]:hover:bg-btn-bg-hover has-[:enabled]:hover:text-black has-[:enabled]:hover:border-white">
                        <input type="file" onChange={sendFile} className="hidden peer" disabled={loading} />
                        <FontAwesomeIcon icon="fa-solid fa-paperclip" className="w-4 h-4" />
                    </label>
                </div>
                <textarea ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="text-input resize-none mx-2 no-scrollbar" />
                <div>
                    {loading ?
                        <div className="loader"></div> :
                        <button onClick={() => sendMessage(false, message)} disabled={message.match(/^\s*$/)} className="button-normal w-16 h-8 disabled:text-txt-tertiary"><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
                    }
                </div>
            </div>

            {error && <div className="error mx-4 mb-4">{error}</div>}
        </>
    );
}