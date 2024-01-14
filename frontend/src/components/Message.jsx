export default function Message({ msg, user, isGroup }) {
    const date = new Date(msg.createdAt);
    return (
        <div className={`flex py-2 ${user == msg.author ? 'justify-end' : ''}`}>
            <div className="border px-2 rounded-md border-black">
                {isGroup && <><span className="text-sm text-gray-700 font-semibold">{user == msg.author ? 'You' : msg.author}</span><br /></>}
                <span>{msg.body}</span><br />
                <span className="text-xs text-gray-500 font-semibold">{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()}</span>
            </div>
        </div>
    );
}