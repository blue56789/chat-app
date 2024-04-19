import { useMemo, useState } from "react";
import { gemoji } from "gemoji";


export default function Emojis({ onClick }) {
    const [query, setQuery] = useState('');
    const [hoveredEmoji, setHoveredEmoji] = useState(null);
    const filteredEmojis = useMemo(() => gemoji.filter((e) => {
        const reg = new RegExp(query, 'i');
        return e.names.find((n) => n.match(reg)) || e.tags.find((t) => t.match(reg));
    }), [query]);
    return (
        <div className="transition-all flex flex-col gap-2 p-2 w-64 h-48 border border-border-primary rounded-lg bg-bg-primary">
            <div>
                <input type="text" className="bg-bg-secondary rounded-lg w-full px-1 outline-none" placeholder="Search emoji" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex flex-wrap w-full h-full content-start overflow-y-scroll no-scrollbar">
                {filteredEmojis.map((e) => <div key={e.emoji} className="text-xl w-8 h-8 flex justify-center items-center hover:cursor-pointer hover:bg-bg-secondary rounded-md transition-all" onClick={() => onClick(e.char)} onMouseEnter={() => setHoveredEmoji(e)} onMouseLeave={() => setHoveredEmoji(null)} >{e.emoji}</div>)}
            </div>
            <div>
                {hoveredEmoji ? (hoveredEmoji.emoji + hoveredEmoji.description) : "Pick an emoji"}
            </div>
        </div>
    );
}