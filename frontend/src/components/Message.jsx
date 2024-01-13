export default function Message({ msg, user, isGroup }) {
    const date = new Date(msg.createdAt);
    return (
        <div className={`message ${user == msg.author ? 'self' : ''}`}>
            <div>
                {isGroup && <><span className="author">{msg.author}</span><br /></>}
                <span>{msg.body}</span><br />
                <span className="time">{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()}</span>
            </div>
        </div>
    );
}