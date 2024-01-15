import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../hooks/useAuthContext";

export default function GroupInfo({ setContent, convo }) {
    const { username } = useAuthContext();
    return (
        <>
            <div className="flex border-b border-black mb-2 pb-2 items-center justify-between">
                <button onClick={() => setContent('chat')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title text-center mx-4">Members</span>
                <div className="w-7"></div>
            </div>
            <div className="h-full overflow-scroll">
                {convo.users.map((el) => <div key={el} className="border-b py-1">{el == username ? 'You' : el} {el == convo.admin && <span className="float-right">Admin</span>}</div>)}
            </div>
        </>
    );
}