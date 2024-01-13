import useAuthContext from "../hooks/useAuthContext";
import useConvoContext from "../hooks/useConvoContext";

export default function Convos({ setChat, setName, setContent }) {
    const { username } = useAuthContext();
    const { convos, error } = useConvoContext();

    return (
        <>
            <div className="convos">
                {convos.map(el => {
                    const name1 = el.isGroupChat ? el.name : (el.users[0] == username ? el.users[1] : el.users[0]);
                    return (
                        <div key={el._id} className="convo" onClick={() => {
                            setChat(el);
                            setName(name1);
                            setContent('chat');
                        }}>
                            <p>{name1}</p>
                            <p className="author">
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