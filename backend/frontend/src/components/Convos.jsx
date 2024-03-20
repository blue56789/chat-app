import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";

export default function Convos({ setChat, setContent }) {
    const { username } = useAuthContext();
    const { convos, error } = useConvoContext();

    return (
        <>
            <div className="overflow-scroll no-scrollbar mb-1">
                {convos.map(el => {
                    const name = el.isGroupChat ? el.name : (el.users[0] == username ? el.users[1] : el.users[0]);
                    return (
                        <div key={el._id}
                            className="border-b border-border-primary py-2 px-4 hover:bg-bg-secondary cursor-pointer transition-all"
                            onClick={() => {
                                setChat(el);
                                setContent('chat');
                            }}>
                            <p className="font-semibold">{name}</p>
                            <p className="text-sm text-txt-secondary">
                                {el.lastMessage ?
                                    (el.lastMessage.author == username ? 'You' : el.lastMessage.author) + ': ' +
                                    el.lastMessage.body.substring(0, 25) +
                                    (el.lastMessage.body.length > 25 ? '...' : '') :
                                    'No messages'}
                            </p>
                        </div>
                    );
                })}
            </div>
            {error && <div className="error">{error}</div>}
        </>
    );
}