export default function Message({ msg, user, isGroup }) {
    const date = new Date(msg.createdAt);
    return (
        <div className={`flex py-2 ${user == msg.author ? 'justify-end' : ''}`}>
            <div className="border border-border-primary rounded shadow-md p-2 max-w-[calc(100%-50px)]">
                {isGroup && <div className="text-sm text-txt-secondary font-semibold">{user == msg.author ? 'You' : msg.author}</div>}
                <div className="text-txt-primary whitespace-pre-wrap">{msg.body}</div>
                <div className="text-xs text-txt-tertiary font-semibold ">{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()}</div>
            </div>
        </div>
    );
}