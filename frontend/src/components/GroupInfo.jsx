import useAuthContext from "../hooks/useAuthContext";

export default function GroupInfo({ setContent, convo }) {
    const { username } = useAuthContext();
    return (
        <>
            <div className="flex border-b border-black mb-4 pb-4">
                <button onClick={() => setContent('chat')} className="button-normal">Back</button>
                <span className="title w-full text-center">Members</span>
            </div>
            <div className="h-full overflow-scroll">
                {convo.users.map((el) => <div key={el} className="border-b py-1">{el == username ? 'You' : el} {el == convo.admin && <span className="float-right">Admin</span>}</div>)}
            </div>
        </>
    );
}