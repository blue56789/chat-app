import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../hooks/useAuthContext";
import { Fragment, useEffect, useRef } from "react";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const isGreaterDate = (date1, date2) => date2.getFullYear() >= date1.getFullYear() && date2.getMonth() >= date1.getMonth() && date2.getDate() > date1.getDate();

function Content({ body, mime }) {
    // console.log(mime);
    if (mime == null)
        return (<img className="max-h-96" src={body} loading="lazy" />);
    switch (mime[2]) {
        case 'image':
            return (<img className="max-h-96" src={body} loading="lazy" />);
        case 'video':
            return (
                <video className="max-h-96" controls>
                    <source src={body} />
                </video>
            );
        case 'audio':
            return (
                <audio controls>
                    <source src={body} />
                </audio>
            );
        default:
            return (
                <div className="mx-2 my-1 text-txt-primary whitespace-pre-wrap">
                    {'File.' + mime[3]}
                </div>
                // <embed src={body} type={mime[1]} />
            )
    }
}

export default function Messages({ convo, messages }) {
    const { username } = useAuthContext();
    const msgRef = useRef(null);

    useEffect(() => msgRef.current?.scrollIntoView(), [convo]);

    useEffect(() => {
        const div = msgRef.current;
        if (div == null) return;
        const { top, left, bottom, right } = div.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        if (top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth)
            div.scrollIntoView();
    }, [messages])

    return (
        <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-scroll px-4 pt-2">
            {messages.map((m, i) => {
                const date = new Date(m.createdAt);
                const author = username == m.author;
                const mime = m.body.match(/:((.*?)\/(.*?));/);
                return (
                    <Fragment key={m._id} >
                        {(i == 0 || isGreaterDate(new Date(messages[i - 1].createdAt), date)) &&
                            <div key={i} className="flex my-1 justify-center">
                                <div className="border border-border-primary bg-bg-tertiary rounded-2xl px-2 text-sm font-thin">
                                    {date.getDate().toString().padStart(2, '0') + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()}
                                </div>
                            </div>
                        }
                        <div className={`flex my-1 ${author ? 'justify-end' : ''}`}>
                            <a href={m.body} target="_blank" rel="noreferrer" download className={`${!m.isDocument && 'hidden'} self-start ${author ? 'order-1' : 'order-3'}`}>
                                <FontAwesomeIcon icon='fa-solid fa-circle-down' className="w-6 h-6" />
                            </a>
                            <div className={`flex flex-col max-w-[calc(100%-50px)] ${author ? 'items-end' : ''} order-2`}>
                                <div className="flex items-end max-w-full border border-border-primary rounded-2xl overflow-hidden bg-bg-primary">
                                    {m.isDocument ? <Content body={m.body} mime={mime} /> :
                                        <div className="mx-2 my-1 flex-grow overflow-hidden text-txt-primary whitespace-pre-wrap">
                                            {m.body}
                                        </div>}
                                    {!m.isDocument && <div className={`mx-2 text-xs font-thin`}>
                                        {date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')}
                                    </div>}
                                </div>
                                {!author && messages[i + 1]?.author != m.author && convo.isGroupChat &&
                                    <div className="text-sm font-semibold text-txt-tertiary">
                                        {m.author}
                                    </div>}
                                {messages[i + 1]?.author != m.author &&
                                    <div className="mb-4"></div>}
                            </div>
                        </div>
                    </Fragment>
                )

            })}
            <div ref={msgRef} className="h-2"></div>
        </div>
    );
}