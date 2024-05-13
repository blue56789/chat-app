import { useEffect, useMemo, useState } from "react";
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
    const { convos, setOnlineUsers, dispatchConvos } = useConvoContext();
    const users = useMemo(() => convos.filter((e) => !e.isGroupChat).map((e) => e.users[0] == username ? e.users[1] : e.users[0]), [convos, username]);

    const [chat, setChat] = useState(null);
    const [content, setContent] = useState('convos');

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        socket.emit('setup', username);
    }, [username]);

    useEffect(() => {
        socket.emit('subscribe', users);
        socket.emit('notifyOnline');
    }, [users]);

    useEffect(() => {
        const setOnline = (user) => {
            setOnlineUsers(o => {
                // console.log('setonline', user);
                if (!o.includes(user))
                    return [...o, user];
                return o;
            });
        };
        socket.on('notifyOnline', setOnline);
        const setOffline = (user) => {
            setOnlineUsers(o => {
                // console.log('setoffline', user);
                return o.filter(u => u != user)
            });
        }
        socket.on('notifyOffline', setOffline);
        return () => {
            socket.off('notifyOnline', setOnline);
            socket.off('notifyOffline', setOffline);
        };
    }, [setOnlineUsers]);

    useEffect(() => {
        const newMsg = (msg, convo) => {
            dispatchConvos({ type: 'update', data: { id: convo._id, convo: convo } });
        };

        const delConvo = (id) => {
            if (chat?._id == id)
                setContent('convos');
            dispatchConvos({ type: 'del', data: id });
        };

        socket.on('messageRecieved', newMsg);
        socket.on('convoDeleted', delConvo);

        return () => {
            socket.off('messageRecieved', newMsg);
            socket.off('convoDeleted', delConvo);
        };
    }, [dispatchConvos, chat]);

    const logout = () => {
        socket.emit('notifyOffline');
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <>
            <div className="flex h-full w-full overflow-hidden transition-all backdrop-blur-[2px]">
                <div className={`${content == 'convos' ? 'flex' : 'hidden'} bg-bg-primary sm:flex flex-col w-full sm:min-w-72 sm:max-w-[30%] sm:border-r sm:border-border-primary`}>
                    <div className="flex justify-between items-center p-4">
                        <span className="title">{username}</span>
                        <span className="ml-2">
                            <button className="button-icon" onClick={() => setContent('add')}>
                                <FontAwesomeIcon icon="fa-solid fa-plus" />
                            </button>
                            <button className="button-normal ml-2" onClick={logout}>Logout</button>
                        </span>
                    </div>
                    <Convos setChat={setChat} setContent={setContent} />
                </div>
                <div className={`${content == 'convos' ? 'hidden' : 'flex'} bg-bg-secondary sm:flex flex-col w-full h-full overflow-hidden`}>
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