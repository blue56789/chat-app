import { useEffect, useRef, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import Message from "./Message";
import socket from "../socket";
import useConvoContext from "../hooks/useConvoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Emojis from "./Emojis";
import { Gif } from "./Gif";

export default function Chat({ convo, setContent }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState('');
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
        if (file.size > 10000000) {
            setError('File size must not exceed 10MB');
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

            <div className="relative">
                {{
                    'file': <div className="absolute flex flex-col gap-2 -top-[11.5rem] left-4 p-2 border border-border-primary rounded-lg bg-bg-tertiary">
                        <div className="flex justify-start items-center">
                            <label className="checkbox-button mr-2">
                                <input type="file" accept="image/*" className="hidden peer" onChange={sendFile} />
                                <FontAwesomeIcon icon="fa-solid fa-image" />
                            </label>
                            Photo
                        </div>
                        <div className="flex justify-start items-center">
                            <label className="checkbox-button mr-2">
                                <input type="file" accept="video/*" className="hidden peer" onChange={sendFile} />
                                <FontAwesomeIcon icon="fa-solid fa-film" />
                            </label>
                            Video
                        </div>
                        <div className="flex justify-start items-center">
                            <label className="checkbox-button mr-2">
                                <input type="file" accept="audio/*" className="hidden peer" onChange={sendFile} />
                                <FontAwesomeIcon icon="fa-solid fa-headphones" />
                            </label>
                            Audio
                        </div>
                        <div className="flex justify-start items-center">
                            <label className="checkbox-button mr-2">
                                <input type="file" accept="*" className="hidden peer" onChange={sendFile} />
                                <FontAwesomeIcon icon="fa-solid fa-file" />
                            </label>
                            Document
                        </div>
                    </div>,
                    'emoji': <div className="absolute -top-[13rem] left-4">
                        <Emojis disabled={loading} onClick={(e) => setMessage(msg => msg + e)} />
                    </div>,
                    'gif': <div className="absolute -top-[25rem] left-4">
                        <Gif onClick={(g) => sendMessage(true, g.media_formats.gif.url)} />
                    </div>
                }[modal]}
                <div className="flex items-center justify-between p-4">
                    <div className="mr-2">
                        <button className={`button-icon ${modal == 'file' ? 'bg-white text-black' : 'text-white'} disabled:text-txt-tertiary`} disabled={loading} onClick={() => setModal(m => m == 'file' ? '' : 'file')} >
                            <FontAwesomeIcon icon="fa-solid fa-paperclip" className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className={`${modal == 'emoji' ? "text-blue-500" : ""} size-8 flex justify-center items-center -mr-8 z-[1] hover:cursor-pointer`} onClick={() => setModal(m => m == 'emoji' ? '' : 'emoji')}>
                            <FontAwesomeIcon icon="face-grin" />
                        </div>
                        <div className={`${modal == 'gif' ? "text-blue-500" : ""} size-8 flex justify-center items-center -mr-[5.5rem] z-[1] hover:cursor-pointer`} onClick={() => setModal(m => m == 'gif' ? '' : 'gif')}>
                            {/* <FontAwesomeIcon icon="fa-solid fa-video" /> */}
                            <span className="font-mono font-extrabold">GIF</span>
                        </div>
                        <textarea ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="text-input pl-16 py-1 resize-none no-scrollbar" />
                    </div>
                    <div className="ml-2">
                        {loading ?
                            <div className="loader"></div> :
                            <button onClick={() => sendMessage(false, message)} disabled={message.match(/^\s*$/)} className="button-normal w-16 h-8 disabled:text-txt-tertiary"><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
                        }
                    </div>
                </div>
            </div>

            {error && <div className="error mx-4 mb-4">{error}</div>}
        </>
    );
}