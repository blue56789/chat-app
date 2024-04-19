import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Content({ body, mime }) {
    // console.log(mime);
    if (mime == null)
        return (<img src={body} loading="lazy" />);
    switch (mime[2]) {
        case 'image':
            return (<img src={body} loading="lazy" />);
        case 'video':
            return (
                <video controls>
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
                <p>{'File.' + mime[3]}</p>
                // <embed src={body} type={mime[1]} />
            )
    }
}

export default function Message({ msg, user }) {
    const date = new Date(msg.createdAt);
    const author = user == msg.author;
    const mime = msg.body.match(/:((.*?)\/(.*?));/);
    return (
        <div className={`flex py-2 ${author ? 'justify-end' : ''}`}>
            <a href={msg.body} target="_blank" rel="noreferrer" download className={`${!msg.isDocument && 'hidden'} self-start ${author ? 'order-1' : 'order-3'}`}><FontAwesomeIcon icon='fa-solid fa-file-arrow-down' className="w-6 h-6" /></a>
            <div className="border bg-bg-primary border-border-primary rounded-lg shadow-md p-2 max-w-[calc(100%-50px)] order-2">
                <div className="text-sm text-txt-secondary font-semibold pb-2">
                    {author ? 'You' : msg.author}
                </div>
                {
                    msg.isDocument ? <Content body={msg.body} mime={mime} /> :
                        <div className="text-txt-primary whitespace-pre-wrap">{msg.body}</div>
                }
                <div className="text-xs text-txt-tertiary font-semibold pt-2">
                    {date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()}
                </div>
            </div>
        </div>
    );
}