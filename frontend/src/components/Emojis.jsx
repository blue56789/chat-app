import { useMemo, useState } from "react";
import emojis from "emoji.json";

export default function Emojis({ onClick }) {
    const [query, setQuery] = useState('');
    const [hoveredEmoji, setHoveredEmoji] = useState(null);
    const filteredEmojis = useMemo(() => emojis.filter((e) => {
        const reg = new RegExp(query, 'i');
        return reg.test(e.name) || reg.test(e.category)
    }), [query]);
    return (
        <div className="transition-all flex flex-col gap-2 p-2 w-64 h-48 border border-border-primary rounded-lg bg-bg-primary">
            <div>
                <input type="text" className="bg-bg-secondary rounded-lg w-full px-1 outline-none" placeholder="Search emoji" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex flex-wrap w-full h-full content-start overflow-y-scroll">
                {filteredEmojis.map((e) => <div key={e.char} className="text-xl w-8 h-8 flex justify-center items-center hover:cursor-pointer hover:bg-bg-secondary rounded-md transition-all" onClick={() => onClick(e.char)} onMouseEnter={() => setHoveredEmoji(e)} onMouseLeave={() => setHoveredEmoji(null)} >{e.char}</div>)}
            </div>
            <div>
                {hoveredEmoji ? (hoveredEmoji.char + hoveredEmoji.name) : "Pick an emoji"}
            </div>
        </div>
    );
}