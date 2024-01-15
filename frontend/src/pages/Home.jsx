import { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import Convos from "../components/Convos";
import Chat from "../components/Chat";
import AddNew from "../components/AddNew";
import EditGroup from "../components/EditGroup";
import GroupInfo from "../components/GroupInfo";
import socket from "../socket";
import useConvoContext from "../hooks/useConvoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
    const { username, dispatch } = useAuthContext();
    const { dispatchConvos } = useConvoContext();

    const [chat, setChat] = useState(null);
    const [name, setName] = useState(null);
    const [content, setContent] = useState('convos');

    useEffect(() => {
        socket.connect();
        console.log('connected to socket');
        return () => {
            socket.disconnect();
            console.log('disconnected from socket');
        };
    }, []);

    useEffect(() => {
        socket.emit('setup', username);
    }, [username]);

    useEffect(() => {
        const newMsg = (msg, convo) => {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: convo } });
        };
        const delConvo = (id) => {
            // console.log('del');
            setContent('convos');
            dispatchConvos({ type: 'del', data: id });
        };
        socket.on('messageRecieved', newMsg);
        socket.on('convoDeleted', delConvo);
        // console.log('on');
        return () => {
            // console.log('off');
            socket.off('messageRecieved', newMsg);
            socket.off('convoDeleted', delConvo);
        };
    }, [dispatchConvos]);

    return (
        <>
            <div id="home" className="border border-black p-4 rounded-md shadow-lg flex flex-col min-w-72 min-h-72 max-h-[calc(100%-10px)]">
                {
                    {
                        'convos': <>
                            <div className="flex justify-between items-center border-b border-black pb-2">
                                <span className="title">{username}</span>
                                <span className="mx-2">
                                    <button className="button-icon" onClick={() => setContent('add')}>
                                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                                    </button>
                                    <button className="button-normal ml-2" onClick={() => { dispatch({ type: 'LOGOUT' }) }}>Logout</button>
                                </span>
                            </div>

                            <Convos setChat={setChat} setName={setName} setContent={setContent} />
                        </>,
                        'chat': chat && <Chat convo={chat} name={chat.isGroupChat ? chat.name : name} setChat={setChat} setContent={setContent} />,
                        'add': <AddNew setContent={setContent} />,
                        'editGroup': <EditGroup convo={chat} setContent={setContent} />,
                        'groupInfo': <GroupInfo setContent={setContent} convo={chat} />
                    }[content]
                }
            </div>
        </>
    );
}