import useAuthContext from "../hooks/useAuthContext";

export default function GroupInfo({ setContent, convo }) {
    const { username } = useAuthContext();
    return (
        <>
            <div className="title">
                <button onClick={() => setContent('chat')}>Back</button>
                <h1>Members</h1>
            </div>
            <div className="convos">
                {convo.users.map((el) => <div key={el} className="convo">{el == username ? 'You' : el} {el == convo.admin && <span>Admin</span>}</div>)}
            </div>
        </>
    );
}