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
import AddMembers from "../components/AddMembers";

export default function Home() {
    const { username, dispatch } = useAuthContext();
    const { dispatchConvos } = useConvoContext();

    const [chat, setChat] = useState(null);
    const [content, setContent] = useState('convos');

    useEffect(() => {
        socket.connect();
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        socket.emit('setup', username);
    }, [username]);

    useEffect(() => {
        const newMsg = (msg, convo) => {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: convo } });
        };

        const delConvo = (id) => {
            setContent('convos');
            dispatchConvos({ type: 'del', data: id });
        };

        socket.on('messageRecieved', newMsg);
        socket.on('convoDeleted', delConvo);

        return () => {
            socket.off('messageRecieved', newMsg);
            socket.off('convoDeleted', delConvo);
        };
    }, [dispatchConvos]);

    return (
        <>
            <div className="flex border border-border-primary rounded-lg h-[calc(100%-20px)] min-w-72 max-w-[calc(100%-20px)] md:w-[calc(100%-20px)] bg-[rgba(0,0,0,0.25)] backdrop-blur-[2px] overflow-hidden transition-all">
                <div className={`${content == 'convos' ? 'flex' : 'hidden'} md:flex flex-col w-full md:min-w-72 md:max-w-[30%] md:border-r md:border-border-primary`}>
                    <div className="flex justify-between items-center border-b border-border-primary p-4">
                        <span className="title">{username}</span>
                        <span className="ml-2">
                            <button className="button-icon" onClick={() => setContent('add')}>
                                <FontAwesomeIcon icon="fa-solid fa-plus" />
                            </button>
                            <button className="button-normal ml-2" onClick={() => { dispatch({ type: 'LOGOUT' }) }}>Logout</button>
                        </span>
                    </div>
                    <Convos setChat={setChat} setContent={setContent} />
                </div>
                <div className={`${content == 'convos' ? 'hidden' : 'flex'} md:flex flex-col w-full h-full overflow-scroll`}>
                    {
                        {
                            'chat': chat && <Chat convo={chat} setChat={setChat} setContent={setContent} />,
                            'add': <AddNew setContent={setContent} />,
                            'groupInfo': <GroupInfo setContent={setContent} convo={chat} />,
                            'editGroup': <EditGroup convo={chat} setConvo={setChat} setContent={setContent} />,
                            'addMembers': <AddMembers setContent={setContent} convo={chat} setConvo={setChat} />
                        }[content]
                    }
                </div>
            </div>
        </>
    );
}