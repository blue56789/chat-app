import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";

export default function Convos({ setChat, setName, setContent }) {
    const { username } = useAuthContext();
    const { convos, error } = useConvoContext();

    return (
        <>
            <div className="h-full overflow-scroll">
                {convos.map(el => {
                    const name1 = el.isGroupChat ? el.name : (el.users[0] == username ? el.users[1] : el.users[0]);
                    return (
                        <div key={el._id}
                            className="border-b py-1 hover:bg-gray-300 cursor-pointer transition-all duration-100 ease-in-out"
                            onClick={() => {
                                setChat(el);
                                setName(name1);
                                setContent('chat');
                            }}>
                            <p className="font-semibold">{name1}</p>
                            <p className="text-sm text-gray-700">
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