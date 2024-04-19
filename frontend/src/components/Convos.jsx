import { useMemo, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";

export default function Convos({ setChat, setContent }) {
    const { username } = useAuthContext();
    const { convos, onlineUsers, error } = useConvoContext();
    const [search, setSearch] = useState('');
    const filteredConvos = useMemo(() => convos.filter((el) => {
        const name = el.isGroupChat ? el.name : (el.users[0] == username ? el.users[1] : el.users[0]);
        el.name = name;
        return name.match(new RegExp(search, 'i'));
    }), [search, convos, username]);

    return (
        <>
            <div className="px-2 pb-2">
                <input className="text-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Contacts" />
            </div>
            <div className="overflow-scroll no-scrollbar mb-1">
                {filteredConvos.map(el => {
                    return (
                        <div key={el._id}
                            className="flex justify-between items-center py-2 px-4 border-b border-border-primary hover:bg-btn-bg-hover hover:text-btn-txt-hover cursor-pointer transition-all"
                            onClick={() => {
                                setChat(el);
                                setContent('chat');
                            }}>
                            <div className="w-full overflow-hidden pr-2" >
                                <p className="font-semibold">{el.name}</p>
                                <p className="text-sm font-thin truncate">
                                    {el.lastMessage ?
                                        (el.lastMessage.author == username ? 'You' : el.lastMessage.author) + ': ' + el.lastMessage.body :
                                        'No messages'}
                                </p>
                            </div>
                            <div className="flex items-center">
                                {!el.isGroupChat &&
                                    <span className={`size-2 rounded-full transition-all duration-500 ${onlineUsers.includes(el.name) ? 'bg-green-500' : 'bg-bg-secondary'}`}></span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            {error && <div className="error">{error}</div>}
        </>
    );
}