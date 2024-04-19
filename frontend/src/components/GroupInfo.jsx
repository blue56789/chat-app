import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../hooks/useAuthContext";

export default function GroupInfo({ setContent, convo }) {
    const { username } = useAuthContext();
    return (
        <>
            <div className="flex border-b border-border-primary bg-bg-primary p-4 items-center justify-between">
                <button onClick={() => setContent('chat')} className="button-icon"><FontAwesomeIcon icon="fa-solid fa-chevron-left" /></button>
                <span className="title text-center mx-4">Members</span>
                <div className="w-8"></div>
            </div>
            <div className="h-full overflow-scroll no-scrollbar pb-2">
                {convo.users.map((el) => <div key={el} className="border-b border-border-primary p-4">{el == username ? 'You' : el} {el == convo.admin && <span className="float-right text-txt-tertiary">Admin</span>}</div>)}
            </div>
        </>
    );
}